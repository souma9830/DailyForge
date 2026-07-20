import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileSpreadsheet, Download, CheckCircle2, BookOpen, CheckSquare, Flame, Sparkles } from 'lucide-react';
import { exportDailyForgeExcel } from '../utils/exportExcel';

export default function ExportDataModal({ isOpen, onClose, studySessions = [], tasks = [], habits = [] }) {
  const [exporting, setExporting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportDailyForgeExcel(studySessions, tasks, habits);
      setSuccessToast(true);
      setTimeout(() => {
        setSuccessToast(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Excel Export Error:', err);
      alert('Failed to generate Excel file: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-[#121723] border border-[#1e2638] rounded-3xl p-6 shadow-2xl space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#1e2638] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-white">Export Excel Report</h3>
                <p className="text-xs text-slate-400">Generate formatted .xlsx workbook via ExcelJS</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#1a2234]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Export Content Summary Cards */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Included Excel Sheets:
            </span>

            <div className="p-3.5 rounded-2xl bg-[#0d121d] border border-[#1e2638] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4 text-blue-400" />
                <div>
                  <h4 className="text-xs font-bold text-white">📘 Study Logs Sheet</h4>
                  <p className="text-[10px] text-slate-400">Subject, topic, duration mins, difficulty, notes</p>
                </div>
              </div>
              <span className="text-xs font-black text-blue-400">{studySessions.length} records</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0d121d] border border-[#1e2638] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                <div>
                  <h4 className="text-xs font-bold text-white">📋 Daily Tasks Sheet</h4>
                  <p className="text-[10px] text-slate-400">Title, category, priority, status, created date</p>
                </div>
              </div>
              <span className="text-xs font-black text-emerald-400">{tasks.length} records</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0d121d] border border-[#1e2638] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Flame className="w-4 h-4 text-amber-400" />
                <div>
                  <h4 className="text-xs font-bold text-white">⚡ Habits Tracker Sheet</h4>
                  <p className="text-[10px] text-slate-400">Title, frequency, streaks, total completions</p>
                </div>
              </div>
              <span className="text-xs font-black text-amber-400">{habits.length} records</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#1e2638]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/25 hover:from-emerald-500 hover:to-teal-400 transition-all disabled:opacity-50"
            >
              {exporting ? (
                <>Generating Excel...</>
              ) : successToast ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" /> Downloaded!
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" /> Download .XLSX
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
