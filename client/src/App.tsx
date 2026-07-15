import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Uploader from './components/Uploader';
import ReportSummary from './components/ReportSummary';
import PrescriptionDetails from './components/PrescriptionDetails';
import Landing from './pages/Landing';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

const Dashboard = () => {
  const { logout, token } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'reports' | 'prescriptions'>('reports');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_URL}/${activeTab}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(res.data);
    } catch (err) {
      console.error(`Failed to fetch ${activeTab}`, err);
    }
  };

  useEffect(() => {
    fetchItems();
    setExpandedId(null);
  }, [activeTab]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-500/10 blur-[100px] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <header className="flex justify-between items-center mb-10 glass-panel p-6 rounded-2xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <span className="text-white font-display font-bold text-2xl">V</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">VaidyaVaani Dashboard</h1>
              <p className="text-[var(--color-text-secondary)] text-sm font-medium">Your secure medical intelligence hub</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="px-5 py-2.5 text-sm text-[var(--color-text-secondary)] font-medium hover:text-[var(--color-text-primary)] hover:bg-slate-100/50 rounded-xl transition-all border border-transparent hover:border-slate-200"
          >
            Sign Out
          </button>
        </header>

        <div className="glass-panel rounded-3xl overflow-hidden">
          <div className="flex p-2 gap-2 bg-slate-50/50 border-b border-[var(--color-border)]/50 backdrop-blur-sm">
            <button 
              onClick={() => setActiveTab('reports')}
              className={`flex-1 py-3 px-4 text-center font-medium rounded-xl transition-all duration-300 ${activeTab === 'reports' ? 'bg-white shadow-sm text-indigo-600' : 'text-[var(--color-text-secondary)] hover:bg-slate-100/50 hover:text-[var(--color-text-primary)]'}`}
            >
              Lab Reports
            </button>
            <button 
              onClick={() => setActiveTab('prescriptions')}
              className={`flex-1 py-3 px-4 text-center font-medium rounded-xl transition-all duration-300 ${activeTab === 'prescriptions' ? 'bg-white shadow-sm text-teal-600' : 'text-[var(--color-text-secondary)] hover:bg-slate-100/50 hover:text-[var(--color-text-primary)]'}`}
            >
              Prescriptions
            </button>
          </div>
          
          <div className="p-8 sm:p-10">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center">
              <span className="bg-slate-100 text-slate-600 w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-sm">1</span>
              Upload New {activeTab === 'reports' ? 'Report' : 'Prescription'}
            </h2>
            <Uploader type={activeTab} onUploadComplete={fetchItems} />
            
            <div className="mt-14">
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center">
                <span className="bg-slate-100 text-slate-600 w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-sm">2</span>
                Your History
              </h2>
              {reports.length === 0 ? (
                <div className="text-center py-16 px-4 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
                  <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl opacity-50">📄</span>
                  </div>
                  <h3 className="text-lg font-medium text-slate-700">No records found</h3>
                  <p className="text-[var(--color-text-secondary)] mt-1">Upload your first document above to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reports.map((item) => (
                    <div key={item._id} className="glass-card rounded-2xl overflow-hidden group">
                      <div 
                        className="flex items-center justify-between p-5 cursor-pointer"
                        onClick={() => toggleExpand(item._id)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeTab === 'reports' ? 'bg-indigo-50 text-indigo-500' : 'bg-teal-50 text-teal-500'}`}>
                            {activeTab === 'reports' ? (
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-[var(--color-text-primary)] group-hover:text-indigo-600 transition-colors">{item.originalName || 'Untitled Document'}</h3>
                            <p className="text-sm text-[var(--color-text-secondary)] font-medium">Uploaded on {new Date(item.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide uppercase ${
                            item.status === 'COMPLETED' ? 'bg-[var(--color-status-success-bg)] text-[var(--color-status-success)]' :
                            item.status === 'PROCESSING' ? 'bg-[var(--color-status-info-bg)] text-[var(--color-status-info)]' :
                            item.status === 'FAILED' ? 'bg-[var(--color-status-error-bg)] text-[var(--color-status-error)]' :
                            'bg-[var(--color-status-warning-bg)] text-[var(--color-status-warning)]'
                          }`}>
                            {item.status}
                          </span>
                          <span className={`text-slate-400 transition-transform duration-300 ${expandedId === item._id ? 'rotate-180' : ''}`}>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          </span>
                        </div>
                      </div>
                      
                      {expandedId === item._id && item.status === 'COMPLETED' && (
                        <div className="p-6 bg-slate-50/50 border-t border-[var(--color-border)]/50">
                          {activeTab === 'reports' ? (
                            <ReportSummary summaryJson={item.summary} />
                          ) : (
                            <PrescriptionDetails prescriptionId={item._id} token={token} />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;

