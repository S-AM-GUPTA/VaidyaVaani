import React from 'react';
import { AlertTriangle, Info, CheckCircle, Activity } from 'lucide-react';

interface ReportSummaryProps {
  summaryJson: string;
}

const ReportSummary: React.FC<ReportSummaryProps> = ({ summaryJson }) => {
  let data: any = {};
  try {
    data = JSON.parse(summaryJson);
  } catch (e) {
    return <div className="text-red-500">Failed to parse report summary.</div>;
  }

  const { keyFindings = [], abnormalValues = [], explanation = '', recommendations = [] } = data;

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 mt-2 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-md shadow-indigo-500/20 mr-4 shrink-0">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-[var(--color-text-primary)]">AI Report Analysis</h3>
            <p className="text-sm text-[var(--color-text-secondary)] font-medium">Extracted and analyzed by VaidyaVaani</p>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl mb-8 border border-indigo-100/50 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
        <h4 className="font-display font-semibold text-indigo-900 mb-3 flex items-center text-lg">
          <Info className="w-5 h-5 mr-2 text-indigo-500" /> Simple Explanation
        </h4>
        <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">{explanation}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
          <h4 className="font-display font-semibold text-slate-800 mb-4 flex items-center text-lg">
            <CheckCircle className="w-5 h-5 mr-2 text-emerald-500" /> Key Findings
          </h4>
          <ul className="space-y-3">
            {keyFindings.map((finding: string, i: number) => (
              <li key={i} className="text-sm font-medium text-slate-600 flex items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 mr-3 shrink-0 shadow-sm shadow-emerald-200"></span>
                <span className="leading-relaxed">{finding}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-red-50/30 p-6 rounded-2xl border border-red-100/50">
          <h4 className="font-display font-semibold text-red-800 mb-4 flex items-center text-lg">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-500" /> Abnormal Values
          </h4>
          {abnormalValues.length > 0 ? (
            <ul className="space-y-3">
              {abnormalValues.map((val: string, i: number) => (
                <li key={i} className="text-sm font-medium text-red-700 bg-white/60 backdrop-blur-sm p-3 rounded-xl border border-red-100 shadow-sm flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 mr-3 shrink-0"></span>
                  <span className="leading-relaxed">{val}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center text-sm font-medium text-emerald-600 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
              <CheckCircle className="w-5 h-5 mr-2" />
              All values appear to be in the normal range.
            </div>
          )}
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="pt-6 border-t border-slate-200/60">
          <h4 className="font-display font-semibold text-slate-800 mb-4 text-lg">Actionable Recommendations</h4>
          <div className="flex flex-wrap gap-3">
            {recommendations.map((rec: string, i: number) => (
              <span key={i} className="bg-teal-50 text-teal-700 border border-teal-200/60 text-sm font-semibold px-4 py-2 rounded-xl shadow-sm">
                {rec}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportSummary;
