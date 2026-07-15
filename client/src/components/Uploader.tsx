import React, { useState, useRef } from 'react';
import axios from 'axios';
import { UploadCloud, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface UploaderProps {
  type: 'reports' | 'prescriptions';
  onUploadComplete: () => void;
}

const Uploader: React.FC<UploaderProps> = ({ type, onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { token } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus('idle');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setProgress(0);
    setStatus('idle');

    try {
      await axios.post(`${API_URL}/${type}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
          setProgress(percentCompleted);
        }
      });
      setStatus('success');
      setMessage('File uploaded successfully. AI processing will begin shortly.');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      onUploadComplete();
    } catch (err: any) {
      setStatus('error');
      setMessage(err.response?.data?.error || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative group">
      {/* Animated gradient border effect behind the uploader */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-teal-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
      
      <div className="relative border-2 border-dashed border-indigo-200/50 rounded-2xl p-10 text-center bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-300">
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden" 
          accept=".pdf,.jpg,.jpeg,.png"
        />
        
        {!file ? (
          <div className="flex flex-col items-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-sm shadow-indigo-100">
              <UploadCloud className="w-8 h-8 text-indigo-500" />
            </div>
            <p className="text-lg font-display font-semibold text-[var(--color-text-primary)]">Drag & drop or click to upload</p>
            <p className="text-sm font-medium text-[var(--color-text-secondary)] mt-2">Support PDF, JPG, PNG (Max 5MB)</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-5 shadow-sm shadow-teal-100">
              <FileText className="w-8 h-8 text-teal-500" />
            </div>
            <p className="text-lg font-display font-semibold text-[var(--color-text-primary)]">{file.name}</p>
            <p className="text-sm font-medium text-[var(--color-text-secondary)] mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            
            {uploading ? (
              <div className="w-full max-w-sm mt-8">
                <div className="flex justify-between text-xs font-medium text-[var(--color-text-secondary)] mb-2">
                  <span>Uploading securely...</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-gradient-primary transition-all duration-300 relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex space-x-4 mt-8">
                <button 
                  onClick={() => setFile(null)}
                  className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpload}
                  className="px-6 py-2.5 bg-gradient-primary text-white font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-105 transition-all duration-300"
                >
                  Confirm Upload
                </button>
              </div>
            )}
          </div>
        )}

        {status === 'success' && (
          <div className="absolute -bottom-16 left-0 right-0 flex items-center justify-center text-[var(--color-status-success)] p-3.5 bg-[var(--color-status-success-bg)] rounded-xl shadow-sm border border-emerald-200 animate-fade-in-up">
            <CheckCircle2 className="w-5 h-5 mr-2.5" />
            <span className="text-sm font-medium tracking-wide">{message}</span>
          </div>
        )}

        {status === 'error' && (
          <div className="absolute -bottom-16 left-0 right-0 flex items-center justify-center text-[var(--color-status-error)] p-3.5 bg-[var(--color-status-error-bg)] rounded-xl shadow-sm border border-red-200 animate-fade-in-up">
            <AlertCircle className="w-5 h-5 mr-2.5" />
            <span className="text-sm font-medium tracking-wide">{message}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Uploader;
