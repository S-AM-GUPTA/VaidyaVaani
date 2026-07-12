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
    <div className="border-2 border-dashed border-[var(--color-border)] rounded-xl p-8 text-center bg-[var(--color-surface)] hover:border-[var(--color-medical-blue)] transition-colors">
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden" 
        accept=".pdf,.jpg,.jpeg,.png"
      />
      
      {!file ? (
        <div className="flex flex-col items-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <UploadCloud className="w-12 h-12 text-[var(--color-text-secondary)] mb-4" />
          <p className="text-[var(--color-text-primary)] font-medium">Click to upload a {type === 'reports' ? 'Lab Report' : 'Prescription'}</p>
          <p className="text-sm text-[var(--color-text-secondary)] mt-2">Support PDF, JPG, PNG (Max 5MB)</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <FileText className="w-12 h-12 text-[var(--color-medical-blue)] mb-4" />
          <p className="text-[var(--color-text-primary)] font-medium">{file.name}</p>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          
          {uploading ? (
            <div className="w-full max-w-xs mt-6">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[var(--color-medical-blue)] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] mt-2">{progress}% Uploading...</p>
            </div>
          ) : (
            <div className="flex space-x-4 mt-6">
              <button 
                onClick={() => setFile(null)}
                className="px-4 py-2 border border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)] hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpload}
                className="px-4 py-2 bg-[var(--color-medical-blue)] text-white rounded-lg hover:opacity-90"
              >
                Confirm Upload
              </button>
            </div>
          )}
        </div>
      )}

      {status === 'success' && (
        <div className="flex items-center justify-center text-[var(--color-status-success)] mt-4 p-3 bg-green-50 rounded-lg">
          <CheckCircle2 className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium">{message}</span>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-center justify-center text-[var(--color-status-error)] mt-4 p-3 bg-red-50 rounded-lg">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium">{message}</span>
        </div>
      )}
    </div>
  );
};

export default Uploader;
