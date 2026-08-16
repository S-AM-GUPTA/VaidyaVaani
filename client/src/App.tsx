import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Uploader from './components/Uploader';
import ReportSummary from './components/ReportSummary';
import PrescriptionDetails from './components/PrescriptionDetails';
import Landing from './pages/Landing';
import Home from './pages/Home';
import TopBanner from './components/layout/TopBanner';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { ConstellationCanvas } from './components/ConstellationCanvas';
import { FileText, Activity, ChevronDown } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

const Dashboard = () => {
  const { token } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'reports' | 'prescriptions'>('reports');
  const [viewMode, setViewMode] = useState<'upload' | 'history'>('history');
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
    <div className="min-h-screen bg-[#000000] text-[#ffffff] font-sans overflow-x-hidden flex flex-col selection:bg-[#8052ff] selection:text-[#ffffff] relative">
      <TopBanner />
      <Navbar />

      {/* Ambient background particle dust */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-25">
        <ConstellationCanvas variant="ambient" particleCount={60} interactive={false} />
      </div>
      
      <main className="relative z-10 flex-grow w-full max-w-[1280px] mx-auto px-6 lg:px-12 py-12">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/[0.06]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ffb829] mb-2">
              Clinical Telemetry Vault
            </div>
            <h1 className="text-4xl font-normal text-[#ffffff] tracking-[-0.04em]">
              Diagnostic Records
            </h1>
            <p className="text-sm font-light text-[#9a9a9a] mt-1">
              Zero-knowledge sealed medical history and AI deconstructions
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('upload')}
              className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                viewMode === 'upload'
                  ? 'bg-[#8052ff] text-white shadow-[0_0_20px_rgba(128,82,255,0.35)]'
                  : 'bg-white/[0.04] text-[#9a9a9a] hover:text-[#ffffff] border border-white/10'
              }`}
            >
              Upload Document
            </button>
            <button
              onClick={() => setViewMode('history')}
              className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                viewMode === 'history'
                  ? 'bg-[#8052ff] text-white shadow-[0_0_20px_rgba(128,82,255,0.35)]'
                  : 'bg-white/[0.04] text-[#9a9a9a] hover:text-[#ffffff] border border-white/10'
              }`}
            >
              History Vault
            </button>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/[0.08]">
          
          {/* Sub-tabs for Reports vs Prescriptions */}
          <div className="flex p-1.5 gap-2 bg-white/[0.03] rounded-full mb-10 w-fit mx-auto border border-white/10">
            <button 
              onClick={() => setActiveTab('reports')}
              className={`py-2 px-6 text-xs font-semibold uppercase tracking-wider rounded-full transition-all duration-300 ${
                activeTab === 'reports' 
                  ? 'bg-[#8052ff] text-white shadow-[0_0_20px_rgba(128,82,255,0.35)]' 
                  : 'text-[#9a9a9a] hover:text-white'
              }`}
            >
              Clinical Lab Reports
            </button>
            <button 
              onClick={() => setActiveTab('prescriptions')}
              className={`py-2 px-6 text-xs font-semibold uppercase tracking-wider rounded-full transition-all duration-300 ${
                activeTab === 'prescriptions' 
                  ? 'bg-[#8052ff] text-white shadow-[0_0_20px_rgba(128,82,255,0.35)]' 
                  : 'text-[#9a9a9a] hover:text-white'
              }`}
            >
              Doctor Prescriptions
            </button>
          </div>

          {viewMode === 'upload' ? (
            <div className="max-w-2xl mx-auto py-4">
              <h2 className="text-xl font-normal text-[#ffffff] tracking-tight mb-2 text-center">
                Ingest New {activeTab === 'reports' ? 'Clinical Report' : 'Prescription'}
              </h2>
              <p className="text-xs font-light text-[#9a9a9a] text-center mb-8">
                Processed with client-side zero-knowledge security
              </p>
              <Uploader 
                type={activeTab} 
                onUploadComplete={() => {
                  fetchItems();
                  setViewMode('history');
                }} 
              />
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.06]">
                <h2 className="text-lg font-normal text-[#ffffff] tracking-tight">
                  Archived {activeTab === 'reports' ? 'Lab Biomarkers' : 'Prescription Records'}
                </h2>
                <span className="text-xs font-mono text-[#9a9a9a]">
                  Total: {reports.length}
                </span>
              </div>
              
              {reports.length === 0 ? (
                <div className="text-center py-20 px-4 bg-white/[0.01] rounded-3xl border border-dashed border-white/10">
                  <div className="w-14 h-14 mx-auto mb-4 bg-white/[0.04] rounded-full flex items-center justify-center border border-white/10">
                    <FileText className="w-6 h-6 text-[#9a9a9a]" />
                  </div>
                  <h3 className="text-base font-normal text-[#ffffff]">No archived records yet</h3>
                  <p className="text-xs font-light text-[#9a9a9a] mt-1 mb-6">Upload your first diagnostic sheet to start tracking.</p>
                  <button
                    onClick={() => setViewMode('upload')}
                    className="bg-[#8052ff] hover:bg-[#6c3df5] text-white px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all"
                  >
                    Upload Now
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {reports.map((item) => (
                    <div key={item._id} className="rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-[#8052ff]/40 transition-all overflow-hidden">
                      <div 
                        className="flex items-center justify-between p-5 cursor-pointer"
                        onClick={() => toggleExpand(item._id)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#8052ff]/15 border border-[#8052ff]/30 text-[#8052ff]">
                            {activeTab === 'reports' ? <Activity className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                          </div>
                          <div>
                            <h3 className="font-normal text-sm text-[#ffffff] hover:text-[#8052ff] transition-colors">{item.originalName || 'Diagnostic Document'}</h3>
                            <p className="text-xs font-light text-[#9a9a9a]">Uploaded on {new Date(item.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase ${
                            item.status === 'COMPLETED' ? 'bg-[#15846e]/20 text-[#15846e] border border-[#15846e]/40' :
                            item.status === 'PROCESSING' ? 'bg-[#8052ff]/20 text-[#8052ff] border border-[#8052ff]/40' :
                            'bg-[#ffb829]/20 text-[#ffb829] border border-[#ffb829]/40'
                          }`}>
                            {item.status}
                          </span>
                          <ChevronDown className={`w-4 h-4 text-[#9a9a9a] transition-transform duration-300 ${expandedId === item._id ? 'rotate-180 text-[#ffffff]' : ''}`} />
                        </div>
                      </div>
                      
                      {expandedId === item._id && item.status === 'COMPLETED' && (
                        <div className="p-6 border-t border-white/[0.06] bg-black/40">
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
          )}
        </div>
      </main>

      <Footer />
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
          path="/home" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
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
