import React, { useState } from 'react';
import { 
  Bell, 
  Volume2, 
  VolumeX, 
  Check, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Settings2,
  Trash2
} from 'lucide-react';
import { AlertNotification } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { soundPlayer } from '../utils/audioAlert';

interface AlertsManagerProps {
  alerts: AlertNotification[];
  onDismissAlert: (id: string) => void;
}

export const AlertsManager: React.FC<AlertsManagerProps> = ({
  alerts,
  onDismissAlert
}) => {
  const { t } = useLanguage();
  const [browserPermission, setBrowserPermission] = useState<string>(() => {
    return typeof window !== 'undefined' && 'Notification' in window 
      ? Notification.permission 
      : 'default';
  });

  const [leadTimeMinutes, setLeadTimeMinutes] = useState(15);
  const [playAudioAlarm, setPlayAudioAlarm] = useState(true);
  const [testChimePlaying, setTestChimePlaying] = useState(false);

  const requestPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const perm = await Notification.requestPermission();
      setBrowserPermission(perm);
      if (perm === 'granted') {
        new Notification('Tatkal Assist Alerts Enabled', {
          body: 'You will receive precision countdown alarms before Tatkal windows open.',
          icon: '/icon-192.png'
        });
      }
    }
  };

  const handleTestSound = () => {
    setTestChimePlaying(true);
    soundPlayer.playTatkalChime();
    setTimeout(() => setTestChimePlaying(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900">{t.alerts} & Countdown Alarms</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Configurable audio chimes and notifications so you never miss the 10:00 AM / 11:00 AM booking rush.
            </p>
          </div>
          <button
            onClick={handleTestSound}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto border border-slate-200"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#0F284E]" />
            <span>{testChimePlaying ? 'Playing Chime...' : 'Test Station Chime'}</span>
          </button>
        </div>

        {/* Browser Permission Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-700">
                Browser Push Notifications
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                browserPermission === 'granted'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {browserPermission.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enables background notifications when Tatkal Assist is running in another tab or minimized.
            </p>
            {browserPermission !== 'granted' && (
              <button
                onClick={requestPermission}
                className="w-full py-2 px-3 rounded-lg bg-[#0F284E] hover:bg-[#163B6E] text-white text-xs font-bold transition-colors"
              >
                Enable Browser Notifications
              </button>
            )}
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-700">
                Audible Station Chime
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                WEB AUDIO SYNTHESIZED
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Plays authentic multi-tone railway chime at 15m, 3m, and 0s before opening time.
            </p>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800 pt-1">
              <input
                type="checkbox"
                checked={playAudioAlarm}
                onChange={(e) => setPlayAudioAlarm(e.target.checked)}
                className="rounded text-[#0F284E] focus:ring-[#0F284E]"
              />
              <span>Enable Web Audio Gong on zero second</span>
            </label>
          </div>
        </div>
      </div>

      {/* Reminder Preferences Form */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
          Reminder Timing Settings
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className={`p-3 rounded-xl border cursor-pointer transition-all ${
            leadTimeMinutes === 15 ? 'border-[#0F284E] bg-blue-50/50 ring-1 ring-[#0F284E]' : 'border-slate-200 hover:bg-slate-50'
          }`}>
            <input
              type="radio"
              name="leadTime"
              className="sr-only"
              checked={leadTimeMinutes === 15}
              onChange={() => setLeadTimeMinutes(15)}
            />
            <span className="block font-bold text-xs text-slate-900">15 Minutes Before</span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Recommended for Master List & NetBanking preparation</span>
          </label>

          <label className={`p-3 rounded-xl border cursor-pointer transition-all ${
            leadTimeMinutes === 5 ? 'border-[#0F284E] bg-blue-50/50 ring-1 ring-[#0F284E]' : 'border-slate-200 hover:bg-slate-50'
          }`}>
            <input
              type="radio"
              name="leadTime"
              className="sr-only"
              checked={leadTimeMinutes === 5}
              onChange={() => setLeadTimeMinutes(5)}
            />
            <span className="block font-bold text-xs text-slate-900">5 Minutes Before</span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Log in to IRCTC at 9:57 AM / 10:57 AM</span>
          </label>

          <label className={`p-3 rounded-xl border cursor-pointer transition-all ${
            leadTimeMinutes === 1 ? 'border-[#0F284E] bg-blue-50/50 ring-1 ring-[#0F284E]' : 'border-slate-200 hover:bg-slate-50'
          }`}>
            <input
              type="radio"
              name="leadTime"
              className="sr-only"
              checked={leadTimeMinutes === 1}
              onChange={() => setLeadTimeMinutes(1)}
            />
            <span className="block font-bold text-xs text-slate-900">1 Minute Before</span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Immediate final countdown alarm</span>
          </label>
        </div>
      </div>

      {/* Active Alerts List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Scheduled Journey Alerts ({alerts.length})</h3>
          <span className="text-xs text-slate-400">Auto-synchronized with saved journeys</span>
        </div>

        {alerts.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No active alerts. Save a journey to schedule Tatkal countdown alarms.
          </div>
        ) : (
          <div className="space-y-2.5">
            {alerts.map(a => (
              <div
                key={a.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{a.title}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      a.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {a.status}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{a.message}</p>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    Scheduled For: {a.scheduledFor}
                  </span>
                </div>

                <button
                  onClick={() => onDismissAlert(a.id)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded"
                  title="Dismiss alert"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
