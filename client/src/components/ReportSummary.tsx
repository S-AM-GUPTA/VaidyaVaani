import React from 'react';
import { AlertTriangle, Info, CheckCircle, Activity, Sparkles } from 'lucide-react';

interface ReportSummaryProps {
  summaryJson: string;
}

const ReportSummary: React.FC<ReportSummaryProps> = ({ summaryJson }) => {
  let data: any = {};
  try {
    data = typeof summaryJson === 'string' ? JSON.parse(summaryJson) : summaryJson;
  } catch (e) {
    return <div className="text-red-400 text-xs">Failed to parse diagnostic summary.</div>;
  }

  const { keyFindings = [], abnormalValues = [], explanation = '', recommendations = [] } = data || {};

  return (
    <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] mt-4 space-y-6 text-[#ffffff]">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#8052ff]/20 border border-[#8052ff]/40 flex items-center justify-center">
            <Activity className="w-4 h-4 text-[#8052ff]" />
          </div>
          <div>
            <h3 className="text-base font-normal tracking-tight text-[#ffffff]">Neural Diagnostic Analysis</h3>
            <p className="text-xs font-light text-[#9a9a9a]">Deconstructed by VaidyaVaani Engine</p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-[#ffb829] uppercase tracking-wider">Zero-Knowledge Sealed</span>
      </div>
      
      {/* Plain Language Explanation */}
      {explanation && (
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8052ff] uppercase tracking-wider mb-2">
            <Info className="w-4 h-4 text-[#8052ff]" />
            Clinical Translation
          </div>
          <p className="text-sm font-light text-[#bdbdbd] leading-relaxed whitespace-pre-wrap">{explanation}</p>
        </div>
      )}

      {/* Grid: Key findings & Abnormalities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Key Findings */}
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#15846e] uppercase tracking-wider mb-4">
            <CheckCircle className="w-4 h-4 text-[#15846e]" />
            Verified Biomarkers
          </div>
          <ul className="space-y-2.5">
            {keyFindings.map((finding: string, i: number) => (
              <li key={i} className="text-xs font-light text-[#bdbdbd] flex items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-[#15846e] mt-1.5 mr-2.5 shrink-0"></span>
                <span className="leading-relaxed">{finding}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Abnormal Values */}
        <div className="p-5 rounded-2xl bg-[#ffb829]/5 border border-[#ffb829]/20">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#ffb829] uppercase tracking-wider mb-4">
            <AlertTriangle className="w-4 h-4 text-[#ffb829]" />
            Out-of-Range Markers
          </div>
          {abnormalValues && abnormalValues.length > 0 ? (
            <ul className="space-y-2.5">
              {abnormalValues.map((val: string, i: number) => (
                <li key={i} className="text-xs font-light text-[#ffb829] bg-[#ffb829]/10 p-2.5 rounded-xl border border-[#ffb829]/20 flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ffb829] mt-1.5 mr-2.5 shrink-0"></span>
                  <span className="leading-relaxed">{val}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-xs font-light text-[#15846e] flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              All extracted biomarkers are within normal reference ranges.
            </div>
          )}
        </div>

      </div>

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="pt-4 border-t border-white/[0.06]">
          <div className="text-xs font-semibold text-[#ffffff] uppercase tracking-wider mb-3 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#8052ff]" />
            Physician Talking Points
          </div>
          <div className="flex flex-wrap gap-2.5">
            {recommendations.map((rec: string, i: number) => (
              <span key={i} className="bg-white/[0.04] text-[#bdbdbd] border border-white/10 text-xs font-light px-3.5 py-1.5 rounded-full">
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
