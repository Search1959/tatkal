import React, { useState } from 'react';
import { 
  Cloud, 
  Smartphone, 
  Laptop, 
  Copy, 
  Check, 
  X, 
  ShieldCheck, 
  RefreshCw, 
  ArrowRight,
  Wifi
} from 'lucide-react';

interface DeviceSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncId: string;
  isOnline: boolean;
  onSwitchSyncId: (newId: string) => void;
}

export const DeviceSyncModal: React.FC<DeviceSyncModalProps> = ({
  isOpen,
  onClose,
  syncId,
  isOnline,
  onSwitchSyncId
}) => {
  const [copied, setCopied] = useState(false);
  const [inputSyncId, setInputSyncId] = useState('');
  const [switchSuccess, setSwitchSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(syncId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePair = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputSyncId.trim()) {
      onSwitchSyncId(inputSyncId.trim());
      setSwitchSuccess(true);
      setTimeout(() => {
        setSwitchSuccess(false);
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        <div className="bg-[#0A1D37] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Internet Cloud Database</h3>
              <p className="text-[11px] text-slate-300">Access from any phone, tablet, or PC</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs text-slate-700">
          {/* Status Indicator */}
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-semibold text-emerald-950">Cloud Firestore Connected</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
              LIVE INTERNET SYNC
            </span>
          </div>

          {/* Current Device Sync ID */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-800">
              Your Device Cloud Sync Code
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3 py-2 bg-slate-100 rounded-lg font-mono text-xs text-slate-900 select-all border border-slate-200 truncate">
                {syncId || 'Initializing cloud key...'}
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-2 rounded-lg bg-[#0F284E] hover:bg-[#163B6E] text-white font-semibold text-xs flex items-center gap-1 shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Enter this code on your other phone or laptop to access the exact same journeys and passenger list.
            </p>
          </div>

          <div className="border-t border-slate-200 pt-3 space-y-2">
            <label className="block font-bold text-slate-800">
              Pair with Another Device
            </label>
            <form onSubmit={handlePair} className="flex gap-2">
              <input
                type="text"
                placeholder="Paste Sync Code from other device"
                value={inputSyncId}
                onChange={(e) => setInputSyncId(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0F284E]"
              />
              <button
                type="submit"
                disabled={!inputSyncId.trim()}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold rounded-lg text-xs"
              >
                {switchSuccess ? 'Linked!' : 'Link Device'}
              </button>
            </form>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-start gap-2 text-[11px] text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              Changes made on any device sync in real-time within milliseconds using Google Cloud Firestore.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
