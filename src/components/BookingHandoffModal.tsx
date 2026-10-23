import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  AlertCircle, 
  Smartphone, 
  CreditCard, 
  UserCheck, 
  Train as TrainIcon
} from 'lucide-react';
import { Passenger } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { formatPassengerClipboardBundle } from '../utils/tatkalCalculations';

interface BookingHandoffModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainDetails?: {
    trainNumber: string;
    trainName: string;
    fromStationCode: string;
    fromStationName: string;
    toStationCode: string;
    toStationName: string;
    journeyDate: string;
    travelClass: string;
    quota: string;
    fare?: number;
  };
  passengers: Passenger[];
  onSavePnr?: (pnr: string) => void;
}

export const BookingHandoffModal: React.FC<BookingHandoffModalProps> = ({
  isOpen,
  onClose,
  trainDetails,
  passengers,
  onSavePnr
}) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [checklist, setChecklist] = useState({
    masterList: true,
    upiApp: true,
    irctcLogin: true,
    noBotAcknowledged: true
  });
  const [pnrInput, setPnrInput] = useState('');
  const [pnrSaved, setPnrSaved] = useState(false);

  if (!isOpen || !trainDetails) return null;

  const passengerBundleText = formatPassengerClipboardBundle(passengers);

  const handleCopy = () => {
    navigator.clipboard.writeText(passengerBundleText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const allChecked = Object.values(checklist).every(Boolean);

  const handlePnrSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pnrInput.length === 10 && onSavePnr) {
      onSavePnr(pnrInput);
      setPnrSaved(true);
      setTimeout(() => {
        setPnrSaved(false);
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="bg-[#0A1D37] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#9B111E] flex items-center justify-center">
              <TrainIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">Official Booking Handoff</h3>
              <p className="text-xs text-slate-300">Authorized IRCTC Portal Transition</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-sm text-slate-700">
          {/* Journey Summary Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">
                {trainDetails.trainNumber} - {trainDetails.trainName}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                {trainDetails.travelClass} · {trainDetails.quota === 'TQ' ? 'Tatkal' : trainDetails.quota}
              </span>
            </div>
            <div className="flex items-center text-xs text-slate-600 gap-1.5">
              <span>{trainDetails.fromStationName} ({trainDetails.fromStationCode})</span>
              <span>→</span>
              <span>{trainDetails.toStationName} ({trainDetails.toStationCode})</span>
              <span aria-hidden="true">·</span>
              <span className="font-medium text-slate-900">{trainDetails.journeyDate}</span>
            </div>
          </div>

          {/* Quick Copy Passenger Bundle */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-amber-950 text-xs flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-amber-700" />
                Prepared Passenger Details ({passengers.length})
              </span>
              <button
                onClick={handleCopy}
                disabled={passengers.length === 0}
                className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-600 hover:bg-amber-700 text-white transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? t.copiedSuccess : '1-Click Copy Bundle'}</span>
              </button>
            </div>
            <div className="bg-white/90 p-2.5 rounded-lg border border-amber-200/80 font-mono text-xs text-slate-800 max-h-24 overflow-y-auto whitespace-pre-wrap">
              {passengerBundleText || 'No passenger profiles selected. Add passengers in Passenger Profiles tab.'}
            </div>
            <p className="text-[11px] text-amber-900/80 leading-relaxed">
              Tip: Copy and paste passenger details directly or ensure they match your IRCTC Master List for instant selection.
            </p>
          </div>

          {/* Readiness Checklist */}
          <div className="border border-slate-200 rounded-xl p-3.5 space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Pre-Handoff Checklist
            </h4>
            <div className="space-y-2 text-xs">
              <label className="flex items-start gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={checklist.masterList} 
                  onChange={(e) => setChecklist({ ...checklist, masterList: e.target.checked })}
                  className="rounded text-[#0F284E] focus:ring-[#0F284E] mt-0.5" 
                />
                <span>My passengers are updated in the IRCTC Master List</span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={checklist.upiApp} 
                  onChange={(e) => setChecklist({ ...checklist, upiApp: e.target.checked })}
                  className="rounded text-[#0F284E] focus:ring-[#0F284E] mt-0.5" 
                />
                <span>UPI payment app (GPay / PhonePe / Paytm) is open with active screen</span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={checklist.irctcLogin} 
                  onChange={(e) => setChecklist({ ...checklist, irctcLogin: e.target.checked })}
                  className="rounded text-[#0F284E] focus:ring-[#0F284E] mt-0.5" 
                />
                <span>I have active IRCTC credentials ready for manual 2FA / CAPTCHA</span>
              </label>
            </div>
          </div>

          {/* Compliance & Anti-Bot Notice */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2 text-xs text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Railway Compliant:</strong> Tatkal Assist does not automate login, CAPTCHA entry, or payments. You will complete your booking manually on IRCTC’s authorized infrastructure.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <a
              href="https://www.irctc.co.in/nget/train-search"
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-bold text-sm shadow-md transition-all ${
                allChecked 
                  ? 'bg-[#9B111E] hover:bg-[#B91C1C]' 
                  : 'bg-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Launch Official IRCTC Website</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <div className="text-center">
              <span className="text-xs text-slate-400">or open mobile app</span>
              <div className="flex justify-center gap-3 mt-1 text-xs">
                <a 
                  href="https://play.google.com/store/apps/details?id=cris.org.in.prs.ima" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Smartphone className="w-3 h-3" /> IRCTC Rail Connect (Android)
                </a>
                <span className="text-slate-300">·</span>
                <a 
                  href="https://apps.apple.com/in/app/irctc-rail-connect/id1453264426" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Smartphone className="w-3 h-3" /> iOS App
                </a>
              </div>
            </div>
          </div>

          {/* Post-Booking PNR Entry */}
          <div className="border-t border-slate-200 pt-3 mt-3">
            <span className="block text-xs font-semibold text-slate-800 mb-1">
              Already booked? Save PNR to track status:
            </span>
            <form onSubmit={handlePnrSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="10-digit PNR"
                maxLength={10}
                value={pnrInput}
                onChange={(e) => setPnrInput(e.target.value.replace(/\D/g, ''))}
                className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-[#0F284E]"
              />
              <button
                type="submit"
                disabled={pnrInput.length !== 10}
                className="px-3 py-1.5 bg-[#0F284E] hover:bg-[#163B6E] disabled:bg-slate-300 text-white rounded-lg text-xs font-medium"
              >
                {pnrSaved ? 'Saved!' : 'Save PNR'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
