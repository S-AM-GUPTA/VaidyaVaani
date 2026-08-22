import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import {
  Shield,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Ban,
  ArrowLeft,
  ArrowRight,
  Save,
  Plus,
  Trash2,
  Eye,
  Database
} from 'lucide-react';

const OCR_SERVICE_URL = import.meta.env.VITE_OCR_SERVICE_URL || 'http://localhost:8000';

interface QualityReport {
  total_images: number;
  verified: number;
  uncertain: number;
  illegible: number;
  rejected: number;
  in_review: number;
  unreviewed: number;
  verified_visual_transcriptions: number;
  verified_medicine_labels: number;
  average_annotation_confidence: number;
  training_eligible: boolean;
  min_required_for_training: number;
}

interface RegionItem {
  region_id: string;
  bbox?: number[];
  raw_ocr?: { engine: string; text: string; confidence: number }[];
  visual_transcription?: string;
  medicine?: {
    name?: string;
    generic_name?: string;
    strength?: string;
    dosage?: string;
    frequency?: string;
    timing?: string;
    duration?: string;
    verification_status?: string;
  };
  context_used?: string;
  status: string;
  notes?: string;
}

interface AnnotationRecord {
  image_id: string;
  filename: string;
  image_path: string;
  overall_status: string;
  annotator?: string;
  reviewed_at?: string;
  regions: RegionItem[];
  general_notes?: string;
}

const AnnotationPage: React.FC = () => {
  const [currentId, setCurrentId] = useState<number>(1);
  const [record, setRecord] = useState<AnnotationRecord | null>(null);
  const [qualityReport, setQualityReport] = useState<QualityReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Zoom & Pan state
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);

  // Fetch Quality Report
  const fetchReport = async () => {
    try {
      const res = await axios.get(`${OCR_SERVICE_URL}/annotation/stats`);
      if (res.data && res.data.report) {
        setQualityReport(res.data.report);
      }
    } catch (e) {
      console.error('Failed to load annotation stats', e);
    }
  };

  // Fetch specific prescription record
  const fetchRecord = async (id: number) => {
    setLoading(true);
    try {
      const res = await axios.get(`${OCR_SERVICE_URL}/annotation/item/${id}`);
      if (res.data && res.data.item) {
        setRecord(res.data.item);
      }
    } catch (e) {
      console.error(`Failed to load prescription #${id}`, e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  useEffect(() => {
    fetchRecord(currentId);
    setZoomLevel(1.0);
  }, [currentId]);

  // Handle Save
  const handleSave = async (andNext: boolean = false) => {
    if (!record) return;
    setSaving(true);
    try {
      await axios.post(`${OCR_SERVICE_URL}/annotation/save`, record);
      setSaveSuccess(true);
      fetchReport();
      setTimeout(() => setSaveSuccess(false), 2500);

      if (andNext && currentId < 129) {
        setCurrentId(prev => prev + 1);
      }
    } catch (e) {
      console.error('Failed to save annotation', e);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateRegion = (index: number, field: string, value: any) => {
    if (!record) return;
    const updated = { ...record };
    const reg = { ...updated.regions[index] };

    if (field.startsWith('medicine.')) {
      const medField = field.replace('medicine.', '');
      reg.medicine = {
        ...(reg.medicine || {}),
        [medField]: value
      };
    } else {
      (reg as any)[field] = value;
    }

    updated.regions[index] = reg;
    setRecord(updated);
  };

  const handleAddRegion = () => {
    if (!record) return;
    const newReg: RegionItem = {
      region_id: `manual_${Date.now()}`,
      status: 'VERIFIED',
      visual_transcription: '',
      medicine: {
        name: '',
        strength: '',
        dosage: '1 tablet',
        frequency: 'twice daily',
        timing: 'after food',
        duration: '5 days',
        verification_status: 'VERIFIED'
      },
      context_used: 'Manual clinical transcription'
    };
    setRecord({
      ...record,
      regions: [...record.regions, newReg]
    });
  };

  const handleDeleteRegion = (index: number) => {
    if (!record) return;
    setRecord({
      ...record,
      regions: record.regions.filter((_, i) => i !== index)
    });
  };

  const jumpToNextUnreviewed = async () => {
    try {
      const res = await axios.get(`${OCR_SERVICE_URL}/annotation/list`);
      if (res.data && res.data.items) {
        const next = res.data.items.find((it: any) => it.overall_status === 'UNREVIEWED' && parseInt(it.image_id) > currentId)
          || res.data.items.find((it: any) => it.overall_status === 'UNREVIEWED');
        if (next) {
          setCurrentId(parseInt(next.image_id));
        } else {
          alert('All 129 prescriptions have been reviewed!');
        }
      }
    } catch (e) {
      console.error('Failed to find unreviewed', e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Top Header & Data Quality Banner */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg backdrop-blur-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-5 h-5 text-emerald-400" />
                <h1 className="text-lg font-bold text-white uppercase tracking-wider font-mono">
                  Ground-Truth Annotation Studio
                </h1>
                <span className="text-xs font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  129 Dataset Images
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Verify messy doctor prescription handwriting. Human-verified ground truth is strictly separated from raw OCR pseudo-labels.
              </p>
            </div>

            {/* Quality Summary Counters */}
            {qualityReport && (
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <div className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
                  <span className="font-bold">{qualityReport.verified}</span> Verified
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-300">
                  <span className="font-bold">{qualityReport.uncertain}</span> Uncertain
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-purple-950/60 border border-purple-500/40 text-purple-300">
                  <span className="font-bold">{qualityReport.illegible}</span> Illegible
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300">
                  <span className="font-bold">{qualityReport.rejected}</span> Rejected
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400">
                  <span className="font-bold">{qualityReport.unreviewed}</span> Unreviewed
                </div>
              </div>
            )}
          </div>

          {/* Supervised Training Gate Status Callout */}
          {qualityReport && (
            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>
                  Supervised Fine-Tuning Gate:{' '}
                  {qualityReport.training_eligible ? (
                    <strong className="text-emerald-400">PASSED ({qualityReport.verified} / {qualityReport.min_required_for_training} Verified)</strong>
                  ) : (
                    <strong className="text-amber-400">LOCKED ({qualityReport.verified} / {qualityReport.min_required_for_training} Required Verified Images)</strong>
                  )}
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                <span>Transcriptions: <strong className="text-white">{qualityReport.verified_visual_transcriptions}</strong></span>
                <span>•</span>
                <span>Medicines: <strong className="text-white">{qualityReport.verified_medicine_labels}</strong></span>
              </div>
            </div>
          )}
        </div>

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: High-Res Zoomable Image Viewer (7 cols) */}
          <div className="lg:col-span-6 bg-slate-800/90 border border-slate-700 rounded-2xl p-4 flex flex-col h-[750px] shadow-lg">
            
            {/* Viewer Controls */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/80 mb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-slate-200">
                  ORIGINAL PRESCRIPTION ({currentId}.jpg)
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setZoomLevel(z => Math.max(0.6, z - 0.25))}
                  className="p-1.5 rounded bg-slate-700/80 hover:bg-slate-600 text-slate-300 transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono px-2 text-slate-400">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel(z => Math.min(3.5, z + 0.25))}
                  className="p-1.5 rounded bg-slate-700/80 hover:bg-slate-600 text-slate-300 transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel(1.0)}
                  className="p-1.5 rounded bg-slate-700/80 hover:bg-slate-600 text-slate-300 transition-colors ml-1"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable / Zoomable Container */}
            <div className="flex-1 overflow-auto bg-slate-950/80 rounded-xl border border-slate-800 p-2 flex items-center justify-center relative select-none">
              {loading ? (
                <div className="flex flex-col items-center gap-2 text-xs font-mono text-slate-500">
                  <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading High-Resolution Image...</span>
                </div>
              ) : (
                <div
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: 'center center',
                    transition: 'transform 0.15s ease-out'
                  }}
                  className="relative max-w-full"
                >
                  <img
                    src={`${OCR_SERVICE_URL}/annotation/image/${currentId}`}
                    alt={`Prescription ${currentId}`}
                    className="max-h-[660px] object-contain rounded shadow-md border border-slate-700/60"
                  />
                </div>
              )}
            </div>
            
            <div className="mt-2 text-[11px] text-slate-500 font-mono text-center">
              * Inspect doctors' signature, letterhead salts, and ink strokes directly from the original document.
            </div>
          </div>

          {/* Right Column: Multi-Level Ground Truth Review Form (6 cols) */}
          <div className="lg:col-span-6 bg-slate-800/90 border border-slate-700 rounded-2xl p-5 flex flex-col h-[750px] shadow-lg">
            
            {/* Top Navigation & Status Selector */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentId(c => Math.max(1, c - 1))}
                  disabled={currentId <= 1}
                  className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-30 text-slate-200 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono font-bold text-white px-2">
                  #{currentId} / 129
                </span>
                <button
                  onClick={() => setCurrentId(c => Math.min(129, c + 1))}
                  disabled={currentId >= 129}
                  className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-30 text-slate-200 cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Status Buttons */}
              {record && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setRecord({ ...record, overall_status: 'VERIFIED' })}
                    className={`px-2.5 py-1 rounded text-xs font-mono font-bold flex items-center gap-1 cursor-pointer transition-all ${
                      record.overall_status === 'VERIFIED'
                        ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-400'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </button>

                  <button
                    onClick={() => setRecord({ ...record, overall_status: 'UNCERTAIN' })}
                    className={`px-2.5 py-1 rounded text-xs font-mono font-bold flex items-center gap-1 cursor-pointer transition-all ${
                      record.overall_status === 'UNCERTAIN'
                        ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Uncertain</span>
                  </button>

                  <button
                    onClick={() => setRecord({ ...record, overall_status: 'ILLEGIBLE' })}
                    className={`px-2.5 py-1 rounded text-xs font-mono font-bold flex items-center gap-1 cursor-pointer transition-all ${
                      record.overall_status === 'ILLEGIBLE'
                        ? 'bg-purple-500 text-slate-950 ring-2 ring-purple-400'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Illegible</span>
                  </button>
                </div>
              )}
            </div>

            {/* Scrollable Regions Ground Truth Editor */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {record && record.regions.length === 0 && (
                <div className="p-8 text-center bg-slate-900/60 rounded-xl border border-dashed border-slate-700 text-xs text-slate-400">
                  <p>No line proposals detected automatically.</p>
                  <button
                    onClick={handleAddRegion}
                    className="mt-3 btn-med-primary text-xs py-1.5 px-3 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Manual Line Annotation</span>
                  </button>
                </div>
              )}

              {record && record.regions.map((reg, idx) => (
                <div
                  key={reg.region_id || idx}
                  className={`p-4 rounded-xl border transition-all ${
                    reg.status === 'VERIFIED'
                      ? 'bg-slate-900/90 border-emerald-500/40'
                      : reg.status === 'UNCERTAIN'
                      ? 'bg-slate-900/90 border-amber-500/40'
                      : 'bg-slate-900/90 border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800 mb-3 text-xs">
                    <span className="font-mono font-bold text-slate-300">
                      Line #{idx + 1}
                    </span>

                    <div className="flex items-center gap-2">
                      <select
                        value={reg.status}
                        onChange={(e) => handleUpdateRegion(idx, 'status', e.target.value)}
                        className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-[11px] font-mono text-slate-200 outline-none"
                      >
                        <option value="VERIFIED">✓ Verified</option>
                        <option value="UNCERTAIN">⚠️ Uncertain</option>
                        <option value="ILLEGIBLE">🚫 Illegible</option>
                        <option value="REJECTED">❌ Rejected</option>
                      </select>

                      <button
                        onClick={() => handleDeleteRegion(idx)}
                        className="text-slate-500 hover:text-rose-400 p-0.5"
                        title="Delete line"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Raw OCR Proposals for Reference */}
                  {reg.raw_ocr && reg.raw_ocr.length > 0 && (
                    <div className="mb-3 p-2 bg-slate-950/80 rounded border border-slate-800/80 text-[11px] font-mono text-slate-400 space-y-1">
                      <div className="text-[10px] uppercase font-bold text-slate-500">OCR Proposal:</div>
                      {reg.raw_ocr.map((prop, pIdx) => (
                        <div key={pIdx} className="flex justify-between">
                          <span>[{prop.engine}] {prop.text}</span>
                          <span className="text-slate-500">{Math.round(prop.confidence * 100)}%</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Level A: Visual Transcription */}
                  <div className="mb-3">
                    <label className="block text-[10px] font-mono font-bold text-emerald-400 mb-1">
                      LEVEL A: VISUAL TRANSCRIPTION (Exact seen handwriting)
                    </label>
                    <input
                      type="text"
                      value={reg.visual_transcription || ''}
                      onChange={(e) => handleUpdateRegion(idx, 'visual_transcription', e.target.value)}
                      placeholder="e.g. Amox 500 1-0-1"
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs font-mono text-white outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Level B: Normalized Medicine */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <label className="block text-[10px] font-mono font-bold text-slate-400 mb-1">
                        LEVEL B: NORMALIZED MEDICINE
                      </label>
                      <input
                        type="text"
                        value={reg.medicine?.name || ''}
                        onChange={(e) => handleUpdateRegion(idx, 'medicine.name', e.target.value)}
                        placeholder="e.g. Amoxicillin"
                        className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs text-white outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono font-bold text-slate-400 mb-1">
                        GENERIC SALT
                      </label>
                      <input
                        type="text"
                        value={reg.medicine?.generic_name || ''}
                        onChange={(e) => handleUpdateRegion(idx, 'medicine.generic_name', e.target.value)}
                        placeholder="e.g. Amoxicillin"
                        className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs text-white outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Level C: Structured Dosage, Frequency, Timing */}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-1">STRENGTH</label>
                      <input
                        type="text"
                        value={reg.medicine?.strength || ''}
                        onChange={(e) => handleUpdateRegion(idx, 'medicine.strength', e.target.value)}
                        placeholder="500 mg"
                        className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-1">FREQUENCY</label>
                      <input
                        type="text"
                        value={reg.medicine?.frequency || ''}
                        onChange={(e) => handleUpdateRegion(idx, 'medicine.frequency', e.target.value)}
                        placeholder="twice daily"
                        className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-1">DURATION</label>
                      <input
                        type="text"
                        value={reg.medicine?.duration || ''}
                        onChange={(e) => handleUpdateRegion(idx, 'medicine.duration', e.target.value)}
                        placeholder="5 days"
                        className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-700 flex items-center justify-between mt-3">
              <button
                onClick={handleAddRegion}
                className="px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-xs font-mono text-slate-300 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Line</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={jumpToNextUnreviewed}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-400 cursor-pointer"
                >
                  Jump Unreviewed
                </button>

                <button
                  onClick={() => handleSave(false)}
                  disabled={saving}
                  className="btn-med-secondary text-xs py-1.5 px-3 flex items-center gap-1 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : saveSuccess ? 'Saved ✓' : 'Save'}</span>
                </button>

                <button
                  onClick={() => handleSave(true)}
                  disabled={saving}
                  className="btn-med-primary text-xs py-1.5 px-4 flex items-center gap-1 cursor-pointer"
                >
                  <span>Save & Next →</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AnnotationPage;
