
import React, { useState } from 'react';
import { Search, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { auditWebsite } from './services/geminiService';
import { SEOAuditReport } from './types';
import { ReportView } from './components/ReportView';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<SEOAuditReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setError(null);
    setLoading(true);
    setReport(null);

    try {
      const result = await auditWebsite(url);
      setReport(result);
    } catch (err: any) {
      setError(err.message || 'Something went wrong while auditing the site.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => { setReport(null); setUrl(''); setError(null); }}
            >
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Sparkles className="text-white" size={20} />
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tight">SEOIntel<span className="text-indigo-600">Pro</span></span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
              <a href="#" className="hover:text-slate-900">Features</a>
              <a href="#" className="hover:text-slate-900">Pricing</a>
              <a href="#" className="hover:text-slate-900">Resources</a>
              <button className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {!report && !loading && (
          <div className="max-w-4xl mx-auto px-4 pt-20 pb-32 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-8">
              <Sparkles size={14} />
              Powered by Gemini 3 Intelligence
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
              Audit Your Website for <br />
              <span className="text-indigo-600">Organic Growth</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Get an instant, data-driven SEO audit. Our AI engine scans technical metadata, 
              authority signals, and competitor landscape in seconds.
            </p>

            <form onSubmit={handleAudit} className="relative max-w-2xl mx-auto">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={24} />
                </div>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter website URL (e.g., example.com)"
                  className="block w-full pl-12 pr-32 py-5 bg-white border-2 border-slate-200 rounded-2xl text-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 shadow-xl transition-all"
                />
                <button
                  type="submit"
                  disabled={!url}
                  className="absolute right-2.5 top-2.5 bottom-2.5 px-8 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Analyze
                </button>
              </div>
            </form>

            <div className="mt-12 flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
               {/* Just placeholders for visual flair */}
               <div className="flex items-center gap-2 font-bold text-slate-600">TRUSTED BY 2,000+ FOUNDERS</div>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center pt-32 pb-48 text-center px-4">
            <div className="relative mb-8">
              <Loader2 className="animate-spin text-indigo-600" size={64} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-indigo-50 rounded-full blur-xl animate-pulse" />
              </div>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-3">Analyzing Domain Intelligence...</h2>
            <div className="space-y-2 max-w-xs mx-auto">
              <p className="text-slate-500 text-sm italic">"Scanning indexing status and backlink profiles..."</p>
              <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full animate-[loading_2s_ease-in-out_infinite]" style={{width: '60%'}} />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-xl mx-auto mt-8 px-4">
            <div className="bg-red-50 border border-red-200 p-6 rounded-2xl flex items-start gap-4">
              <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-red-900 font-bold text-lg mb-1">Analysis Failed</h3>
                <p className="text-red-700 text-sm mb-4">{error}</p>
                <button 
                  onClick={() => setError(null)}
                  className="text-red-900 font-bold text-sm underline hover:no-underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {report && <ReportView report={report} />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">
            © 2024 SEO Intelligence Pro. Data sourced via Gemini 3 & Google Search Grounding.
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default App;
