
import React from 'react';
import { SEOMetric } from '../types';

interface MetricCardProps {
  label: string;
  metric: SEOMetric;
  icon: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, metric, icon }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
          {icon}
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${getStatusColor(metric.status)}`}>
          {metric.status}
        </span>
      </div>
      
      <h3 className="text-slate-900 font-bold text-lg mb-1">{label}</h3>
      <div className="flex items-end gap-2 mb-4">
        <span className="text-3xl font-black text-slate-800">{metric.score}</span>
        <span className="text-slate-400 text-sm mb-1.5">/ 100</span>
      </div>

      <div className="w-full bg-slate-100 rounded-full h-1.5 mb-6">
        <div 
          className={`h-1.5 rounded-full transition-all duration-1000 ${getProgressColor(metric.score)}`} 
          style={{ width: `${metric.score}%` }}
        ></div>
      </div>

      <div className="space-y-2">
        {metric.details.slice(0, 3).map((detail, idx) => (
          <div key={idx} className="flex gap-2 items-start text-sm text-slate-600">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-indigo-400 flex-shrink-0" />
            <span>{detail}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
