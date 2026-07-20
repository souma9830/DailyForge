import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Info, Wifi } from 'lucide-react';

const iconMap = {
  error: <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />,
  success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
  info: <Info className="w-4 h-4 text-blue-400 shrink-0" />,
  warning: <Wifi className="w-4 h-4 text-amber-400 shrink-0" />,
};

const colorMap = {
  error:   'border-red-500/30 bg-red-950/80',
  success: 'border-emerald-500/30 bg-emerald-950/80',
  info:    'border-blue-500/30 bg-blue-950/80',
  warning: 'border-amber-500/30 bg-amber-950/80',
};

export default function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 w-80 max-w-[calc(100vw-3rem)]">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`flex items-start gap-3 px-4 py-3 rounded-2xl border backdrop-blur-md shadow-2xl ${colorMap[t.type] || colorMap.info}`}
          >
            {iconMap[t.type] || iconMap.info}
            <p className="text-xs font-semibold text-slate-100 flex-1 leading-snug">{t.message}</p>
            <button
              onClick={() => onRemove(t.id)}
              className="text-slate-400 hover:text-white shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
