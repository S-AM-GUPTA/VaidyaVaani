import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Uploader from './components/Uploader';
import ReportSummary from './components/ReportSummary';
import PrescriptionDetails from './components/PrescriptionDetails';

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
    <div className="min-h-screen p-8 bg-[var(--color-background)]">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-[var(--color-border)]">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-medical-blue)]">VaidyaVaani Dashboard</h1>
            <p className="text-[var(--color-text-secondary)]">Welcome to your secure health vault</p>
          </div>
          <button 
            onClick={logout}
            className="px-4 py-2 text-sm text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors border border-red-200"
          >
            Logout
          </button>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] overflow-hidden">
          <div className="flex border-b border-[var(--color-border)]">
            <button 
              onClick={() => setActiveTab('reports')}
              className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'reports' ? 'text-[var(--color-medical-blue)] border-b-2 border-[var(--color-medical-blue)] bg-[var(--color-soft-sky)]' : 'text-[var(--color-text-secondary)] hover:bg-gray-50'}`}
            >
              Lab Reports
            </button>
            <button 
              onClick={() => setActiveTab('prescriptions')}
              className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'prescriptions' ? 'text-[var(--color-medical-blue)] border-b-2 border-[var(--color-medical-blue)] bg-[var(--color-soft-sky)]' : 'text-[var(--color-text-secondary)] hover:bg-gray-50'}`}
            >
              Prescriptions
            </button>
          </div>
          
          <div className="p-8">
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Upload New {activeTab === 'reports' ? 'Report' : 'Prescription'}</h2>
            <Uploader type={activeTab} onUploadComplete={fetchItems} />
            
            <div className="mt-12">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Your {activeTab === 'reports' ? 'Reports' : 'Prescriptions'}</h2>
              {reports.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <p className="text-[var(--color-text-secondary)]">No records found. Upload one above.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reports.map((item) => (
                    <div key={item._id} className="border border-[var(--color-border)] rounded-lg overflow-hidden transition-colors hover:border-[var(--color-medical-blue)]">
                      <div 
                        className="flex items-center justify-between p-4 bg-white cursor-pointer"
                        onClick={() => toggleExpand(item._id)}
                      >
                        <div>
                          <h3 className="font-medium text-[var(--color-text-primary)]">{item.originalName || 'Untitled Document'}</h3>
                          <p className="text-sm text-[var(--color-text-secondary)]">Uploaded on {new Date(item.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            item.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                            item.status === 'PROCESSING' ? 'bg-blue-100 text-blue-700' :
                            item.status === 'FAILED' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {item.status}
                          </span>
                          <span className="text-gray-400">
                            {expandedId === item._id ? '▲' : '▼'}
                          </span>
                        </div>
                      </div>
                      
                      {expandedId === item._id && item.status === 'COMPLETED' && (
                        <div className="p-4 bg-gray-50 border-t border-[var(--color-border)]">
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
        <Route path="/login" element={<Login />} />
        <Route 
          path="/" 
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

