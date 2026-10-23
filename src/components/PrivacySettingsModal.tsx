import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Download, 
  Trash2, 
  Lock, 
  Smartphone, 
  Eye, 
  X, 
  Check, 
  AlertTriangle,
  Type,
  Vibrate,
  Sliders,
  FileText
} from 'lucide-react';
import { Passenger, SavedJourney, AccessibilitySettings } from '../types';
import { triggerHapticFeedback } from '../utils/tatkalCalculations';

interface PrivacySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  passengers: Passenger[];
  journeys: SavedJourney[];
  accessibility: AccessibilitySettings;
  onUpdateAccessibility: (settings: Partial<AccessibilitySettings>) => void;
  onClearAllLocalData: () => void;
}

export const PrivacySettingsModal: React.FC<PrivacySettingsModalProps> = ({
  isOpen,
  onClose,
  passengers,
  journeys,
  accessibility,
  onUpdateAccessibility,
  onClearAllLocalData
}) => {
  const [exportSuccess, setExportSuccess] = useState(false);
  const [confirmWipe, setConfirmWipe] = useState(false);
  const [wipeSuccess, setWipeSuccess] = useState(false);

  if (!isOpen) return null;

  const handleExportData = () => {
    const backup = {
      app: 'Tatkal Assist 2.0',
      exportDate: new Date().toISOString(),
      passengers,
      journeys,
      policy: 'Compliant with Indian Railways PRS preparation guidelines. Passwords and banking credentials are never retained.'
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tatkal-assist-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  const handleWipeData = () => {
    onClearAllLocalData();
    triggerHapticFeedback([50, 100, 50]);
    setWipeSuccess(true);
    setConfirmWipe(false);
    setTimeout(() => {
      setWipeSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-[#0A1D37] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Privacy, Security & Accessibility</h3>
              <p className="text-[11px] text-slate-300">Data ownership & Tatkal Assist 2.0 preferences</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-slate-700 text-xs">
          {/* Zero-Bot Railway Compliance Guarantee */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Official IRCTC Zero-Compromise Guarantee</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Tatkal Assist is an authorized personal preparation assistant. We <strong>never</strong> bypass CAPTCHAs, inject browser bots, store IRCTC login passwords, or intercept payment OTPs. All ticket purchases and payments happen exclusively within official IRCTC systems.
            </p>
          </div>

          {/* Accessibility & Display Controls */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              <span>Accessibility & Physical Feedback</span>
            </h4>

            <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              {/* High Contrast Mode */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800">High-Contrast Sunlight Mode</span>
                  <p className="text-[11px] text-slate-500">Sharper borders and deep black text for bright outdoor platforms.</p>
                </div>
                <button
                  type="button"
                  onClick={() => onUpdateAccessibility({ highContrast: !accessibility.highContrast })}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    accessibility.highContrast ? 'bg-[#0F284E]' : 'bg-slate-300'
                  }`}
                  aria-label="Toggle high contrast"
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    accessibility.highContrast ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Font Size Scaling */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800">Interface Font Size</span>
                  <p className="text-[11px] text-slate-500">Enhanced readability for seniors and rapid scans.</p>
                </div>
                <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-lg p-0.5">
                  {(['normal', 'large', 'xlarge'] as const).map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => onUpdateAccessibility({ fontSize: size })}
                      className={`px-2 py-1 rounded text-[11px] font-semibold uppercase ${
                        accessibility.fontSize === size 
                          ? 'bg-[#0F284E] text-white' 
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {size === 'normal' ? 'Standard' : size === 'large' ? 'Large' : 'XL'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Haptic Vibration */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Vibrate className="w-3.5 h-3.5 text-slate-600" />
                    <span>Haptic Countdown Ticks</span>
                  </span>
                  <p className="text-[11px] text-slate-500">Vibrates phone during final 10 seconds before 10:00 AM / 11:00 AM.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = !accessibility.hapticFeedback;
                    onUpdateAccessibility({ hapticFeedback: next });
                    if (next) triggerHapticFeedback([40, 40]);
                  }}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    accessibility.hapticFeedback ? 'bg-[#0F284E]' : 'bg-slate-300'
                  }`}
                  aria-label="Toggle haptic vibration"
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    accessibility.hapticFeedback ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Data Ownership & Export */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Data Export & Backup</span>
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">Download Passenger & Journey Archives</p>
                <p className="text-[11px] text-slate-500">
                  {passengers.length} passenger profiles · {journeys.length} tracked journeys
                </p>
              </div>
              <button
                type="button"
                onClick={handleExportData}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-semibold text-xs flex items-center gap-1.5 shrink-0"
              >
                {exportSuccess ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Download className="w-3.5 h-3.5 text-slate-600" />}
                <span>{exportSuccess ? 'Downloaded!' : 'Export JSON'}</span>
              </button>
            </div>
          </div>

          {/* Privacy Wipe Section */}
          <div className="space-y-3">
            <h4 className="font-bold text-red-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Trash2 className="w-3.5 h-3.5 text-red-600" />
              <span>Shared Device Privacy Wipe</span>
            </h4>
            <div className="p-3.5 rounded-xl bg-red-50/50 border border-red-200 space-y-3">
              <p className="text-[11px] text-red-900 leading-relaxed">
                Using a cyber café or borrowed smartphone? Erase all locally cached passenger names, birth years, ID cards, and journey countdowns with one click.
              </p>

              {confirmWipe ? (
                <div className="bg-white p-3 rounded-lg border border-red-300 space-y-2">
                  <p className="font-bold text-xs text-red-800 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Are you sure? This cannot be undone.
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleWipeData}
                      className="flex-1 py-1.5 px-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-xs transition-colors"
                    >
                      Yes, Wipe All Data
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmWipe(false)}
                      className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmWipe(true)}
                  disabled={wipeSuccess}
                  className="w-full py-2 px-3 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-red-300"
                >
                  {wipeSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Data Cleared Successfully!</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 text-red-700" />
                      <span>Emergency Wipe (Clear Local Data)</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0F284E] text-white font-bold rounded-lg text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
