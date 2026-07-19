import React, { useState } from 'react';
import { Settings, Database, RefreshCw, CheckCircle2, Shield, Info } from 'lucide-react';

export default function SettingsView({ stats, onReload }) {
  const [copied, setCopied] = useState(false);

  const isMongoConnected = stats?.isMongoDBConnected;

  const mongoUriSample = 'mongodb://localhost:27017/dailyforge';

  const copyUri = () => {
    navigator.clipboard.writeText(mongoUriSample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-[#1e2638]">
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-slate-400" /> Forge System Settings
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Manage database configuration, view connectivity, and system diagnostics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Database Configuration Card */}
        <div className="glass-panel p-6 rounded-3xl border border-[#1e2638] space-y-5">
          <div className="flex items-center justify-between border-b border-[#1e2638] pb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                isMongoConnected ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
              }`}>
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">MongoDB Mongoose Connection</h3>
                <p className="text-xs text-slate-400">Database connection state</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
              isMongoConnected
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
            }`}>
              {isMongoConnected ? 'Connected' : 'Hybrid Mock Fallback'}
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <p>
              DailyForge connects via Mongoose to your MongoDB instance. If MongoDB is active on your machine, all habits, tasks, and journals persist directly to Mongo collections.
            </p>

            <div className="p-3.5 rounded-2xl bg-[#0d121d] border border-[#1e2638] space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Connection URI</span>
              <div className="flex items-center justify-between font-mono text-xs text-blue-300">
                <span>{mongoUriSample}</span>
                <button
                  onClick={copyUri}
                  className="px-2 py-1 rounded bg-[#1e2638] text-slate-300 hover:text-white"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={onReload}
            className="w-full py-2.5 rounded-xl text-xs font-semibold bg-[#121723] hover:bg-[#1a2234] border border-[#1e2638] text-slate-200 flex items-center justify-center gap-2 transition-all"
          >
            <RefreshCw className="w-4 h-4 text-blue-400" /> Refresh Connection Status
          </button>
        </div>

        {/* Scalability & Architecture Info */}
        <div className="glass-panel p-6 rounded-3xl border border-[#1e2638] space-y-5">
          <div className="flex items-center gap-3 border-b border-[#1e2638] pb-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Scalability & Architecture</h3>
              <p className="text-xs text-slate-400">Future-proof full-stack design</p>
            </div>
          </div>

          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span><strong>Clean Separation:</strong> Express REST backend under <code className="text-blue-300">/backend</code> and React frontend under <code className="text-blue-300">/frontend</code>.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span><strong>Mongoose Schema Validation:</strong> Strongly typed schemas for Habits, Tasks, and Journal entries.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span><strong>Single-User Isolated:</strong> Built specifically for personal focus without unnecessary multi-tenant complexity.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
