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
    <div className="bg-white border border-[var(--color-border)] rounded-xl p-6 mt-4 shadow-sm">
      <div className="flex items-center mb-4">
        <Activity className="w-6 h-6 text-[var(--color-medical-blue)] mr-2" />
        <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">AI Report Analysis</h3>
      </div>
      
      <div className="bg-[var(--color-soft-sky)] p-4 rounded-lg mb-6 border border-blue-100">
        <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
          <Info className="w-4 h-4 mr-2" /> Simple Explanation
        </h4>
        <p className="text-blue-900 leading-relaxed text-sm">{explanation}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-[var(--color-text-primary)] mb-3 flex items-center">
            <CheckCircle className="w-4 h-4 mr-2 text-[var(--color-status-success)]" /> Key Findings
          </h4>
          <ul className="space-y-2">
            {keyFindings.map((finding: string, i: number) => (
              <li key={i} className="text-sm text-[var(--color-text-secondary)] flex items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-medical-blue)] mt-1.5 mr-2 shrink-0"></span>
                <span>{finding}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-red-700 mb-3 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2" /> Abnormal Values
          </h4>
          {abnormalValues.length > 0 ? (
            <ul className="space-y-2">
              {abnormalValues.map((val: string, i: number) => (
                <li key={i} className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-100">
                  {val}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-green-600">All values appear to be in the normal range.</p>
          )}
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="mt-6 border-t border-[var(--color-border)] pt-4">
          <h4 className="font-semibold text-[var(--color-text-primary)] mb-3">Actionable Recommendations</h4>
          <div className="flex flex-wrap gap-2">
            {recommendations.map((rec: string, i: number) => (
              <span key={i} className="bg-[var(--color-light-mint)] text-[var(--color-status-success)] border border-green-200 text-xs font-medium px-3 py-1.5 rounded-full">
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
