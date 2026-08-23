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
  ArrowLeft,
  ArrowRight,
  Save,
  Plus,
  Trash2,
  Eye,
  Download,
  AlertTriangle,
  Flame,
  CheckCheck,
  Split,
  Copy,
  Info,
  ChevronRight,
  Filter
} from 'lucide-react';

const OCR_SERVICE_URL = import.meta.env.VITE_OCR_SERVICE_URL || 'http://localhost:8000';

interface PriorityBreakdown {
  high_agreement: number;
  partial_agreement: number;
  disagreement: number;
  no_useful_output: number;
}

interface ReviewerConfidenceDist {
  HIGH: number;
  MEDIUM: number;
  LOW: number;
}

interface TrainingGateInfo {
  training_eligible: boolean;
  min_required_verified_regions: number;
  verified_count: number;
  message: string;
}

interface QualityReport {
  total_prescriptions: number;
  total_regions: number;
  reviewed_regions: number;
  verified: number;
  uncertain: number;
  illegible: number;
  rejected: number;
  remaining_unreviewed: number;
  priority_breakdown: PriorityBreakdown;
  verification_rate_percent: number;
  medicine_labels_available: number;
  structured_regimen_labels_available: number;
  context_used_percentage: number;
  reviewer_confidence_distribution: ReviewerConfidenceDist;
  training_gate: TrainingGateInfo;
}

interface RegionItem {
  region_id: string;
  bbox?: number[];
  raw_ocr?: { engine: string; text: string; confidence: number }[];
  annotation_priority?: 'HIGH_AGREEMENT' | 'PARTIAL_AGREEMENT' | 'DISAGREEMENT' | 'NO_USEFUL_OUTPUT' | string;
  visual_transcription?: string;
  normalized_medicine?: string;
  strength?: string;
  dosage_form?: string;
  frequency?: string;
  timing?: string;
  duration?: string;
  context_used?: boolean;
  reviewer_confidence?: 'HIGH' | 'MEDIUM' | 'LOW' | string;
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
  status: 'VERIFIED' | 'UNCERTAIN' | 'ILLEGIBLE' | 'REJECTED' | 'UNREVIEWED' | 'IN_REVIEW' | string;
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

interface ListItem {
  image_id: string;
  filename: string;
  overall_status: string;
  total_regions: number;
  verified_regions: number;
  priorities: string[];
}

const AnnotationPage: React.FC = () => {
  const [currentId, setCurrentId] = useState<number>(1);
  const [record, setRecord] = useState<AnnotationRecord | null>(null);
  const [qualityReport, setQualityReport] = useState<QualityReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  // Filters
  const [activeQueueFilter, setActiveQueueFilter] = useState<string>('ALL');
  const [filteredList, setFilteredList] = useState<ListItem[]>([]);

  // Zoom state
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);

  // Fetch Quality Report & Live Statistics
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

  // Fetch List based on filters
  const fetchList = async (filterKey: string = activeQueueFilter) => {
    try {
      let url = `${OCR_SERVICE_URL}/annotation/list`;
      if (['HIGH_AGREEMENT', 'PARTIAL_AGREEMENT', 'DISAGREEMENT', 'NO_USEFUL_OUTPUT'].includes(filterKey)) {
        url += `?priority=${filterKey}`;
      } else if (['UNREVIEWED', 'VERIFIED', 'UNCERTAIN', 'ILLEGIBLE', 'REJECTED'].includes(filterKey)) {
        url += `?status=${filterKey}`;
      }
      const res = await axios.get(url);
      if (res.data && res.data.items) {
        setFilteredList(res.data.items);
      }
    } catch (e) {
      console.error('Failed to load annotation list', e);
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
    fetchList('ALL');
  }, []);

  useEffect(() => {
    fetchRecord(currentId);
    setZoomLevel(1.0);
  }, [currentId]);

  const handleFilterChange = (filter: string) => {
    setActiveQueueFilter(filter);
    fetchList(filter);
  };

  // Save annotation
  const handleSave = async (andNext: boolean = false) => {
    if (!record) return;
    setSaving(true);
    try {
      await axios.post(`${OCR_SERVICE_URL}/annotation/save`, record);
      setSaveSuccess(true);
      fetchReport();
      fetchList(activeQueueFilter);
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

  // Export verified dataset
  const handleExportVerified = async () => {
    try {
      const res = await axios.post(`${OCR_SERVICE_URL}/annotation/export`);
      if (res.data) {
        setExportMessage(`Exported ${res.data.total_verified_exported} verified samples to data/datasets/vaidyavaani_verified/`);
        setTimeout(() => setExportMessage(null), 5000);
      }
    } catch (e) {
      console.error('Failed to export dataset', e);
    }
  };

  // Next Difficult Case Button
  const handleNextDifficult = async () => {
    try {
      const res = await axios.get(`${OCR_SERVICE_URL}/annotation/next-difficult?current_id=${currentId}`);
      if (res.data && res.data.success && res.data.item) {
        const nextId = parseInt(res.data.item.image_id);
        setCurrentId(nextId);
      } else {
        alert('All difficult cases in queue reviewed!');
      }
    } catch (e) {
      console.error('Failed to find next difficult case', e);
    }
  };

  const handleUpdateRegion = (index: number, field: keyof RegionItem | string, value: any) => {
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
      region_id: `reg_${record.regions.length + 1}`,
      status: 'VERIFIED',
      annotation_priority: 'DISAGREEMENT',
      visual_transcription: '',
      normalized_medicine: '',
      strength: '',
      dosage_form: 'Tab',
      frequency: '1-0-1',
      timing: 'After food',
      duration: '5 days',
      context_used: false,
      reviewer_confidence: 'HIGH'
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

  const getPriorityBadge = (priority?: string) => {
    switch (priority) {
      case 'HIGH_AGREEMENT':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <CheckCheck className="w-3 h-3" /> High Agreement
          </span>
        );
      case 'PARTIAL_AGREEMENT':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Split className="w-3 h-3" /> Partial Agreement
          </span>
        );
      case 'DISAGREEMENT':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
            <Flame className="w-3 h-3 text-rose-400" /> Disagreement (Difficult)
          </span>
        );
      case 'NO_USEFUL_OUTPUT':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <AlertTriangle className="w-3 h-3" /> No Useful Output
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-700 text-slate-300">
            Unclassified
          </span>
        );
    }
  };

  const queueFilters = [
    { key: 'ALL', label: 'All (129)' },
    { key: 'UNREVIEWED', label: 'Unreviewed' },
    { key: 'HIGH_AGREEMENT', label: 'High Agreement' },
    { key: 'PARTIAL_AGREEMENT', label: 'Partial Agreement' },
    { key: 'DISAGREEMENT', label: 'Disagreement' },
    { key: 'NO_USEFUL_OUTPUT', label: 'No Useful Output' },
    { key: 'VERIFIED', label: 'Verified' },
    { key: 'UNCERTAIN', label: 'Uncertain' },
    { key: 'ILLEGIBLE', label: 'Illegible' },
    { key: 'REJECTED', label: 'Rejected' },
  ];

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
                  129 Full Prescriptions ({qualityReport?.total_regions || 759} Regions)
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Human-verified ground-truth pipeline. Machine proposals remain suggestions until explicitly verified by a human reviewer.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleNextDifficult}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-mono text-xs font-bold shadow-md transition-all cursor-pointer"
                title="Jump to the highest priority unresolved case"
              >
                <Flame className="w-4 h-4" /> Next Difficult Case
              </button>

              <button
                onClick={handleExportVerified}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-mono text-xs font-semibold border border-slate-600 transition-all cursor-pointer"
                title="Export verified annotations to data/datasets/vaidyavaani_verified/"
              >
                <Download className="w-4 h-4 text-emerald-400" /> Export Dataset
              </button>
            </div>
          </div>

          {/* Export Notification Banner */}
          {exportMessage && (
            <div className="mt-3 p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{exportMessage}</span>
            </div>
          )}

          {/* Detailed Statistics Cards */}
          {qualityReport && (
            <div className="mt-4 pt-4 border-t border-slate-700/60 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-xs font-mono">
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-700">
                <span className="text-[10px] text-slate-400 block">Prescriptions</span>
                <span className="text-sm font-bold text-white">{qualityReport.total_prescriptions}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-700">
                <span className="text-[10px] text-slate-400 block">Total Regions</span>
                <span className="text-sm font-bold text-white">{qualityReport.total_regions}</span>
              </div>
              <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                <span className="text-[10px] text-emerald-400 block">Verified</span>
                <span className="text-sm font-bold text-emerald-300">{qualityReport.verified}</span>
              </div>
              <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-500/30">
                <span className="text-[10px] text-amber-400 block">Uncertain</span>
                <span className="text-sm font-bold text-amber-300">{qualityReport.uncertain}</span>
              </div>
              <div className="p-2 rounded-xl bg-purple-950/40 border border-purple-500/30">
                <span className="text-[10px] text-purple-400 block">Illegible</span>
                <span className="text-sm font-bold text-purple-300">{qualityReport.illegible}</span>
              </div>
              <div className="p-2 rounded-xl bg-rose-950/40 border border-rose-500/30">
                <span className="text-[10px] text-rose-400 block">Rejected</span>
                <span className="text-sm font-bold text-rose-300">{qualityReport.rejected}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-700">
                <span className="text-[10px] text-slate-400 block">Remaining</span>
                <span className="text-sm font-bold text-slate-300">{qualityReport.remaining_unreviewed}</span>
              </div>
              <div className="p-2 rounded-xl bg-indigo-950/40 border border-indigo-500/30">
                <span className="text-[10px] text-indigo-400 block">Verification Rate</span>
                <span className="text-sm font-bold text-indigo-300">{qualityReport.verification_rate_percent}%</span>
              </div>
            </div>
          )}

          {/* Priority Distribution Bar */}
          {qualityReport && (
            <div className="mt-3 pt-3 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-slate-400">Annotation Priority Pool:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  High: <strong>{qualityReport.priority_breakdown.high_agreement}</strong>
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Partial: <strong>{qualityReport.priority_breakdown.partial_agreement}</strong>
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">
                  Disagreement: <strong>{qualityReport.priority_breakdown.disagreement}</strong>
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  No Useful: <strong>{qualityReport.priority_breakdown.no_useful_output}</strong>
                </span>
              </div>

              <div className="flex items-center gap-3 text-slate-400 text-[11px] flex-wrap">
                <span>Context-Used: <strong className="text-white">{qualityReport.context_used_percentage}%</strong></span>
                <span>•</span>
                <span>Confidence: <strong className="text-emerald-400">H: {qualityReport.reviewer_confidence_distribution.HIGH}</strong> / <strong className="text-amber-400">M: {qualityReport.reviewer_confidence_distribution.MEDIUM}</strong> / <strong className="text-rose-400">L: {qualityReport.reviewer_confidence_distribution.LOW}</strong></span>
              </div>
            </div>
          )}
        </div>

        {/* Queue Filter Bar */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 shadow-md flex items-center justify-between gap-3 overflow-x-auto">
          <div className="flex items-center gap-1.5 text-xs font-mono shrink-0">
            <Filter className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-slate-400 mr-1 font-semibold">Queue Filters:</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono py-0.5">
            {queueFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => handleFilterChange(f.key)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer shrink-0 ${
                  activeQueueFilter === f.key
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filteredList.length > 0 && (
            <div className="text-[11px] font-mono text-slate-400 shrink-0 hidden sm:block">
              Matching: <strong className="text-emerald-400">{filteredList.length}</strong> Prescriptions
            </div>
          )}
        </div>

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: High-Res Zoomable Image Viewer (6 cols) */}
          <div className="lg:col-span-6 bg-slate-800/90 border border-slate-700 rounded-2xl p-4 flex flex-col h-[820px] shadow-lg">
            
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
                  className="p-1.5 rounded bg-slate-700/80 hover:bg-slate-600 text-slate-300 transition-colors cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono px-2 text-slate-400">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel(z => Math.min(3.5, z + 0.25))}
                  className="p-1.5 rounded bg-slate-700/80 hover:bg-slate-600 text-slate-300 transition-colors cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel(1.0)}
                  className="p-1.5 rounded bg-slate-700/80 hover:bg-slate-600 text-slate-300 transition-colors ml-1 cursor-pointer"
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
                    className="max-h-[720px] object-contain rounded shadow-md border border-slate-700/60"
                  />
                </div>
              )}
            </div>
            
            <div className="mt-2 text-[11px] text-slate-500 font-mono text-center">
              * Original high-resolution prescription scan is preserved side-by-side during review.
            </div>
          </div>

          {/* Right Column: Multi-Level Ground Truth Review Form (6 cols) */}
          <div className="lg:col-span-6 bg-slate-800/90 border border-slate-700 rounded-2xl p-5 flex flex-col h-[820px] shadow-lg">
            
            {/* Top Navigation & Status Selector */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-700/80 mb-3">
              <div className="flex items-center gap-2">
                <button
                  disabled={currentId <= 1}
                  onClick={() => setCurrentId(prev => Math.max(1, prev - 1))}
                  className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title="Previous Prescription"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1 font-mono text-xs">
                  <span className="text-slate-400">Prescription:</span>
                  <input
                    type="number"
                    min={1}
                    max={129}
                    value={currentId}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val >= 1 && val <= 129) setCurrentId(val);
                    }}
                    className="w-14 bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-center font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-slate-500">/ 129</span>
                </div>

                <button
                  disabled={currentId >= 129}
                  onClick={() => setCurrentId(prev => Math.min(129, prev + 1))}
                  className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title="Next Prescription"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Save Buttons */}
              <div className="flex items-center gap-2">
                <button
                  disabled={saving || !record}
                  onClick={() => handleSave(false)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold shadow-md transition-all cursor-pointer ${
                    saveSuccess 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  }`}
                >
                  <Save className="w-3.5 h-3.5" />
                  {saving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Ground Truth'}
                </button>

                <button
                  disabled={saving || !record}
                  onClick={() => handleSave(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-mono text-xs font-semibold transition-all cursor-pointer"
                  title="Save and advance to next prescription"
                >
                  <span>Save & Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Regions List */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-4">
              {record && record.regions && record.regions.length > 0 ? (
                record.regions.map((reg, idx) => (
                  <div
                    key={reg.region_id || idx}
                    className={`rounded-xl p-4 border transition-all ${
                      reg.status === 'VERIFIED'
                        ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                        : reg.status === 'ILLEGIBLE'
                        ? 'bg-purple-950/20 border-purple-500/40'
                        : reg.status === 'UNCERTAIN'
                        ? 'bg-amber-950/20 border-amber-500/40'
                        : reg.status === 'REJECTED'
                        ? 'bg-rose-950/20 border-rose-500/40'
                        : 'bg-slate-900/60 border-slate-700/80'
                    }`}
                  >
                    {/* Region Header */}
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700/50">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-300">
                          Region #{idx + 1}
                        </span>
                        {getPriorityBadge(reg.annotation_priority)}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Status Selector */}
                        <select
                          value={reg.status}
                          onChange={(e) => handleUpdateRegion(idx, 'status', e.target.value)}
                          className={`text-xs font-mono font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                            reg.status === 'VERIFIED'
                              ? 'bg-emerald-900/80 text-emerald-200 border-emerald-500/60'
                              : reg.status === 'ILLEGIBLE'
                              ? 'bg-purple-900/80 text-purple-200 border-purple-500/60'
                              : reg.status === 'UNCERTAIN'
                              ? 'bg-amber-900/80 text-amber-200 border-amber-500/60'
                              : reg.status === 'REJECTED'
                              ? 'bg-rose-900/80 text-rose-200 border-rose-500/60'
                              : 'bg-slate-800 text-slate-300 border-slate-600'
                          }`}
                        >
                          <option value="UNREVIEWED">UNREVIEWED</option>
                          <option value="VERIFIED">VERIFIED</option>
                          <option value="UNCERTAIN">UNCERTAIN</option>
                          <option value="ILLEGIBLE">ILLEGIBLE</option>
                          <option value="REJECTED">REJECTED</option>
                        </select>

                        <button
                          onClick={() => handleDeleteRegion(idx)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Delete Region"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Multi-Engine Proposals Chips */}
                    {reg.raw_ocr && reg.raw_ocr.length > 0 && (
                      <div className="mb-3 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                        <span className="text-[10px] font-mono text-slate-400 block mb-1.5">
                          Multi-Engine Machine Proposals (Click 📋 to copy into visual transcription):
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                          {reg.raw_ocr.map((prop, pIdx) => (
                            <div
                              key={pIdx}
                              className="p-1.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between gap-1 text-[11px] font-mono"
                            >
                              <div className="truncate">
                                <span className="text-[9px] text-slate-500 uppercase block font-semibold">
                                  {prop.engine === 'paddleocr' ? 'PaddleOCR' : prop.engine === 'pretrained_trocr' ? 'TrOCR Baseline' : 'RxHandBD-v1'}
                                </span>
                                <span className="text-slate-200 font-medium truncate block" title={prop.text}>
                                  {prop.text || '<empty>'}
                                </span>
                              </div>
                              <button
                                onClick={() => handleUpdateRegion(idx, 'visual_transcription', prop.text)}
                                className="p-1 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded transition-colors cursor-pointer shrink-0"
                                title="Copy to Visual Transcription"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Level A & B: Visual Transcription & Normalized Medicine (Strictly Separated) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="text-[11px] font-mono text-slate-300 font-semibold block mb-1">
                          Visual Transcription (Literal Handwriting):
                        </label>
                        <input
                          type="text"
                          value={reg.visual_transcription || ''}
                          onChange={(e) => handleUpdateRegion(idx, 'visual_transcription', e.target.value)}
                          placeholder="e.g. Amoxi 500 / Tab Paracet"
                          disabled={reg.status === 'ILLEGIBLE'}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 disabled:opacity-40"
                        />
                        <span className="text-[10px] text-slate-500 block mt-0.5">What is literally visible on paper</span>
                      </div>

                      <div>
                        <label className="text-[11px] font-mono text-slate-300 font-semibold block mb-1">
                          Normalized Medicine (Canonical):
                        </label>
                        <input
                          type="text"
                          value={reg.normalized_medicine || reg.medicine?.name || ''}
                          onChange={(e) => {
                            handleUpdateRegion(idx, 'normalized_medicine', e.target.value);
                            handleUpdateRegion(idx, 'medicine.name', e.target.value);
                          }}
                          placeholder="e.g. Amoxicillin / Paracetamol"
                          disabled={reg.status === 'ILLEGIBLE'}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-emerald-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500 disabled:opacity-40"
                        />
                        <span className="text-[10px] text-slate-500 block mt-0.5">Canonical medical drug entity</span>
                      </div>
                    </div>

                    {/* Level C: Structured Regimen Fields */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-3">
                      <div>
                        <label className="text-[10px] font-mono text-slate-400 block mb-0.5">Strength</label>
                        <input
                          type="text"
                          value={reg.strength || reg.medicine?.strength || ''}
                          onChange={(e) => {
                            handleUpdateRegion(idx, 'strength', e.target.value);
                            handleUpdateRegion(idx, 'medicine.strength', e.target.value);
                          }}
                          placeholder="500mg"
                          disabled={reg.status === 'ILLEGIBLE'}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500 disabled:opacity-40"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-slate-400 block mb-0.5">Dosage Form</label>
                        <input
                          type="text"
                          value={reg.dosage_form || reg.medicine?.dosage || ''}
                          onChange={(e) => {
                            handleUpdateRegion(idx, 'dosage_form', e.target.value);
                            handleUpdateRegion(idx, 'medicine.dosage', e.target.value);
                          }}
                          placeholder="Tab / Cap"
                          disabled={reg.status === 'ILLEGIBLE'}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500 disabled:opacity-40"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-slate-400 block mb-0.5">Frequency</label>
                        <input
                          type="text"
                          value={reg.frequency || reg.medicine?.frequency || ''}
                          onChange={(e) => {
                            handleUpdateRegion(idx, 'frequency', e.target.value);
                            handleUpdateRegion(idx, 'medicine.frequency', e.target.value);
                          }}
                          placeholder="1-0-1 / BD"
                          disabled={reg.status === 'ILLEGIBLE'}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500 disabled:opacity-40"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-slate-400 block mb-0.5">Timing</label>
                        <input
                          type="text"
                          value={reg.timing || reg.medicine?.timing || ''}
                          onChange={(e) => {
                            handleUpdateRegion(idx, 'timing', e.target.value);
                            handleUpdateRegion(idx, 'medicine.timing', e.target.value);
                          }}
                          placeholder="After food"
                          disabled={reg.status === 'ILLEGIBLE'}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500 disabled:opacity-40"
                        />
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <label className="text-[10px] font-mono text-slate-400 block mb-0.5">Duration</label>
                        <input
                          type="text"
                          value={reg.duration || reg.medicine?.duration || ''}
                          onChange={(e) => {
                            handleUpdateRegion(idx, 'duration', e.target.value);
                            handleUpdateRegion(idx, 'medicine.duration', e.target.value);
                          }}
                          placeholder="5 days"
                          disabled={reg.status === 'ILLEGIBLE'}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500 disabled:opacity-40"
                        />
                      </div>
                    </div>

                    {/* Human Context & Reviewer Confidence */}
                    <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1.5 font-mono text-xs text-slate-300 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={Boolean(reg.context_used)}
                            onChange={(e) => handleUpdateRegion(idx, 'context_used', e.target.checked)}
                            className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900 cursor-pointer"
                          />
                          <span>Context used to interpret handwriting</span>
                        </label>
                      </div>

                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-[11px] text-slate-400">Reviewer Confidence:</span>
                        <div className="inline-flex rounded-lg border border-slate-700 bg-slate-950 p-0.5">
                          {(['HIGH', 'MEDIUM', 'LOW'] as const).map((conf) => (
                            <button
                              key={conf}
                              type="button"
                              onClick={() => handleUpdateRegion(idx, 'reviewer_confidence', conf)}
                              className={`px-2 py-0.5 text-[10px] font-bold rounded transition-colors cursor-pointer ${
                                (reg.reviewer_confidence || 'HIGH') === conf
                                  ? conf === 'HIGH'
                                    ? 'bg-emerald-500 text-slate-950'
                                    : conf === 'MEDIUM'
                                    ? 'bg-amber-500 text-slate-950'
                                    : 'bg-rose-500 text-white'
                                  : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              {conf}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500 font-mono text-xs">
                  <Info className="w-8 h-8 text-slate-600 mb-2" />
                  <p>No candidate regions found for this prescription.</p>
                  <button
                    onClick={handleAddRegion}
                    className="mt-3 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 transition-colors"
                  >
                    + Add Manual Ground-Truth Region
                  </button>
                </div>
              )}

              {/* Add Region Button */}
              {record && record.regions && record.regions.length > 0 && (
                <button
                  onClick={handleAddRegion}
                  className="w-full py-2.5 border-2 border-dashed border-slate-700/80 hover:border-emerald-500/50 rounded-xl text-xs font-mono text-slate-400 hover:text-emerald-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Extra Region Box
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AnnotationPage;
