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
      setMessage('Document encrypted & uploaded successfully.');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setTimeout(() => {
        onUploadComplete();
      }, 800);
    } catch (err: any) {
      setStatus('error');
      setMessage(err.response?.data?.error || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      <div className="border border-dashed border-white/20 hover:border-[#15846e]/60 rounded-3xl p-10 text-center bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300">
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden" 
          accept=".pdf,.jpg,.jpeg,.png"
        />
        
        {!file ? (
          <div className="flex flex-col items-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-16 h-16 bg-[#15846e]/15 border border-[#15846e]/30 rounded-full flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(21,132,110,0.25)]">
              <UploadCloud className="w-8 h-8 text-[#15846e]" />
            </div>
            <p className="text-base font-normal text-[#ffffff]">Drag and drop or click to browse</p>
            <p className="text-xs font-light text-[#9a9a9a] mt-2">Supports PDF, JPG, PNG (Zero-Knowledge Encrypted)</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-[#15846e]/15 border border-[#15846e]/30 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-[#15846e]" />
            </div>
            <p className="text-sm font-normal text-[#ffffff]">{file.name}</p>
            <p className="text-xs font-light text-[#9a9a9a] mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            
            {uploading ? (
              <div className="w-full max-w-sm mt-6">
                <div className="flex justify-between text-xs font-mono text-[#9a9a9a] mb-2">
                  <span>Encrypting & Ingesting...</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#15846e] transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="flex space-x-4 mt-6">
                <button 
                  onClick={() => setFile(null)}
                  className="px-6 py-2.5 bg-white/[0.04] border border-white/10 rounded-full text-xs font-semibold uppercase tracking-wider text-[#9a9a9a] hover:text-[#ffffff] hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpload}
                  className="px-6 py-2.5 bg-[#15846e] hover:bg-[#116e5c] text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(21,132,110,0.35)] active:scale-95"
                >
                  Process Document
                </button>
              </div>
            )}
          </div>
        )}

        {status === 'success' && (
          <div className="mt-6 flex items-center justify-center text-[#15846e] p-3 bg-[#15846e]/10 border border-[#15846e]/20 rounded-full">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            <span className="text-xs font-light">{message}</span>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-6 flex items-center justify-center text-red-400 p-3 bg-red-950/40 border border-red-500/20 rounded-full">
            <AlertCircle className="w-4 h-4 mr-2" />
            <span className="text-xs font-light">{message}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Uploader;
