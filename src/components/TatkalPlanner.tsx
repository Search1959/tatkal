import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  AlertCircle, 
  Volume2, 
  VolumeX, 
  ExternalLink, 
  ShieldCheck, 
  Info, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  BellRing,
  HelpCircle,
  Train as TrainIcon
} from 'lucide-react';
import { TravelClass, TatkalRuleConfig } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { 
  calculateTatkalOpening, 
  formatCountdown, 
  getTimeUntilTatkal,
  isAcClass,
  calculateAlternativeDates,
  triggerHapticFeedback
} from '../utils/tatkalCalculations';
import { soundPlayer } from '../utils/audioAlert';

interface TatkalPlannerProps {
  initialJourneyDate?: string;
  initialClass?: TravelClass;
  rules: TatkalRuleConfig;
  onOpenHandoff: (details: {
    trainNumber: string;
    trainName: string;
    fromStationCode: string;
    fromStationName: string;
    toStationCode: string;
    toStationName: string;
    journeyDate: string;
    travelClass: string;
    quota: string;
  }) => void;
}

export const TatkalPlanner: React.FC<TatkalPlannerProps> = ({
  initialJourneyDate,
  initialClass,
  rules,
  onOpenHandoff
}) => {
  const { t } = useLanguage();

  const [journeyDate, setJourneyDate] = useState(() => {
    if (initialJourneyDate) return initialJourneyDate;
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });

  const [travelClass, setTravelClass] = useState<TravelClass>(initialClass || '3A');
  const [originOffsetDays, setOriginOffsetDays] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [alarmPlayed, setAlarmPlayed] = useState(false);
  const [diffMs, setDiffMs] = useState<number>(0);

  // Calculate opening
  const opening = calculateTatkalOpening(journeyDate, travelClass, originOffsetDays, rules);

  useEffect(() => {
    const updateCountdown = () => {
      const remaining = getTimeUntilTatkal(opening.tatkalDateTimeIso);
      setDiffMs(remaining);

      // Play alert chime when window opens (between 0 and -5000 ms)
      if (soundEnabled && remaining <= 0 && remaining > -4000 && !alarmPlayed) {
        soundPlayer.playTatkalChime();
        setAlarmPlayed(true);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [opening.tatkalDateTimeIso, soundEnabled, alarmPlayed]);

  const countdown = formatCountdown(diffMs);

  const testChime = () => {
    soundPlayer.playTatkalChime();
  };

  const handleProceedHandoff = () => {
    onOpenHandoff({
      trainNumber: '12952',
      trainName: 'Express Train',
      fromStationCode: 'NDLS',
      fromStationName: 'New Delhi',
      toStationCode: 'MMCT',
      toStationName: 'Mumbai Central',
      journeyDate,
      travelClass,
      quota: 'TQ'
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0F284E] to-[#1E3E68] text-white rounded-2xl p-6 shadow-md border border-[#234A78]">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-amber-400 text-slate-950 font-mono">
              OFFICIAL RAILWAY RULES ENGINE
            </span>
            <span className="text-xs text-slate-300">·</span>
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Advance Timing Verified
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            Tatkal Opening Date & Countdown Calculator
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Tatkal opens exactly 1 day in advance of the train's departure from its <strong>Originating Station</strong> (10:00 AM for AC, 11:00 AM for Non-AC). Select your journey date and travel class below to reveal the exact second bookings open.
          </p>
        </div>
      </div>

      {/* Alternative Date Planning Strip */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Alternative Journey Dates & Booking Windows</span>
          </span>
          <span className="text-[11px] text-slate-500">1-Tap Select Date</span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {calculateAlternativeDates(journeyDate, travelClass, rules).map((opt) => {
            const isSelected = opt.date === journeyDate;
            return (
              <button
                key={opt.date}
                type="button"
                onClick={() => {
                  setJourneyDate(opt.date);
                  setAlarmPlayed(false);
                }}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'bg-[#0F284E] text-white border-[#0F284E] shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <div className={`text-[10px] font-bold uppercase ${isSelected ? 'text-amber-300' : 'text-slate-500'}`}>
                  {opt.dayName}
                </div>
                <div className="text-sm font-black my-0.5">
                  {opt.dayNumber} {opt.monthShort}
                </div>
                <div className={`text-[9px] font-semibold truncate ${
                  opt.statusBadge === 'OPEN_NOW'
                    ? (isSelected ? 'text-emerald-300 font-bold' : 'text-emerald-700 font-bold')
                    : opt.statusBadge === 'OPENS_SOON'
                    ? (isSelected ? 'text-blue-200' : 'text-blue-700')
                    : (isSelected ? 'text-slate-300' : 'text-slate-500')
                }`}>
                  {opt.statusBadge === 'OPEN_NOW' ? '⚡ OPEN NOW' : opt.statusBadge === 'OPENS_SOON' ? 'SOON' : opt.dayName}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Calculator Inputs & Precision Countdown Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Calculator Configuration */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-bold text-sm text-slate-900">1. Enter Journey & Train Details</h2>
            <p className="text-xs text-slate-500 mt-0.5">Customise class and originating station offset.</p>
          </div>

          <div className="space-y-3.5">
            {/* Journey Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Boarding Date
              </label>
              <input
                type="date"
                value={journeyDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => {
                  setJourneyDate(e.target.value);
                  setAlarmPlayed(false);
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F284E]"
              />
            </div>

            {/* Travel Class */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Travel Class (Determines 10:00 AM vs 11:00 AM)
              </label>
              <select
                value={travelClass}
                onChange={(e) => {
                  setTravelClass(e.target.value as TravelClass);
                  setAlarmPlayed(false);
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F284E]"
              >
                <optgroup label="AC Classes (Opens at 10:00 AM IST)">
                  <option value="3A">AC 3 Tier (3A)</option>
                  <option value="2A">AC 2 Tier (2A)</option>
                  <option value="1A">AC 1st Class (1A)</option>
                  <option value="3E">AC 3 Economy (3E)</option>
                  <option value="CC">AC Chair Car (CC)</option>
                  <option value="EC">Executive Chair Car (EC)</option>
                </optgroup>
                <optgroup label="Non-AC Classes (Opens at 11:00 AM IST)">
                  <option value="SL">Sleeper (SL)</option>
                  <option value="2S">Second Sitting (2S)</option>
                </optgroup>
              </select>
            </div>

            {/* Originating Station Offset */}
            <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                  Originating Station Day Offset
                </label>
                <span className="text-[11px] font-semibold text-amber-800">
                  {originOffsetDays === 0 ? 'Same Day (Origin)' : `Day ${originOffsetDays + 1} of Train Run`}
                </span>
              </div>
              <p className="text-[11px] text-amber-900/90 leading-normal">
                If you board at an intermediate station and the train departed its starting station 1 or 2 days earlier, Tatkal opens earlier!
              </p>
              <select
                value={originOffsetDays}
                onChange={(e) => {
                  setOriginOffsetDays(Number(e.target.value));
                  setAlarmPlayed(false);
                }}
                className="w-full px-2.5 py-1.5 border border-amber-300 rounded-lg text-xs font-medium text-slate-900 bg-white"
              >
                <option value={0}>0 Days - Train departs source on my boarding day</option>
                <option value={1}>1 Day Prior - Train departed source yesterday</option>
                <option value={2}>2 Days Prior - Train departed source 2 days ago (Long-distance)</option>
                <option value={3}>3 Days Prior - E.g. Kanyakumari / Dibrugarh expresses</option>
              </select>
            </div>

            {/* Sound Alarm Toggle */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-slate-700 font-medium">Opening Audio Chime</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={testChime}
                  className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px] flex items-center gap-1"
                >
                  <Volume2 className="w-3 h-3 text-slate-600" />
                  <span>Test Chime</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    soundEnabled ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-slate-100 border-slate-300 text-slate-500'
                  }`}
                  title={soundEnabled ? 'Sound Enabled' : 'Sound Muted'}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Target & Countdown Screen */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#0F284E] text-white rounded-xl p-6 shadow-md border border-[#1E3E68] space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${countdown.isOpenNow ? 'bg-emerald-400 animate-ping' : 'bg-amber-400 animate-pulse'}`} />
                <h3 className="font-bold text-sm tracking-wide uppercase text-slate-200">
                  {countdown.isOpenNow ? 'Tatkal Window Open Now' : 'Time Remaining Until Opening'}
                </h3>
              </div>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-white/10 text-amber-300">
                {opening.tatkalTime.slice(0, 5)} IST
              </span>
            </div>

            {/* Big Countdown Digits */}
            <div className="grid grid-cols-4 gap-2 text-center py-2">
              <div className="bg-[#0A1D37] rounded-xl p-3 border border-white/10">
                <span className="block font-mono text-3xl sm:text-4xl font-black text-amber-400">{countdown.days}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Days</span>
              </div>
              <div className="bg-[#0A1D37] rounded-xl p-3 border border-white/10">
                <span className="block font-mono text-3xl sm:text-4xl font-black text-amber-400">{countdown.hours}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Hours</span>
              </div>
              <div className="bg-[#0A1D37] rounded-xl p-3 border border-white/10">
                <span className="block font-mono text-3xl sm:text-4xl font-black text-amber-400">{countdown.minutes}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Minutes</span>
              </div>
              <div className="bg-[#0A1D37] rounded-xl p-3 border border-white/10">
                <span className="block font-mono text-3xl sm:text-4xl font-black text-white">{countdown.seconds}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Seconds</span>
              </div>
            </div>

            {/* Result Interpretation Box */}
            <div className="bg-white/10 rounded-xl p-4 border border-white/15 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-200">
                <span>Calculated Tatkal Date:</span>
                <strong className="text-white text-sm font-mono">{opening.tatkalDate}</strong>
              </div>
              <div className="flex items-center justify-between text-slate-200">
                <span>Opening Time:</span>
                <strong className="text-amber-300 text-sm font-mono">{opening.tatkalTime.slice(0, 5)} IST ({travelClass} Class)</strong>
              </div>
              <div className="pt-2 border-t border-white/10 text-slate-300 leading-relaxed text-[11px]">
                {opening.explanation}
              </div>
            </div>

            {/* Proceed Handoff CTA */}
            <div className="pt-1">
              <button
                onClick={handleProceedHandoff}
                className="w-full py-3 px-4 rounded-xl bg-[#9B111E] hover:bg-[#B91C1C] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Continue to Official Booking Handoff</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 10-Minute Pre-Booking Execution Drill */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Tactical 10-Minute Tatkal Drill</h3>
            <p className="text-xs text-slate-500 mt-0.5">Chronological protocol practiced by high-speed bookers.</p>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
            Speed Strategy
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1.5">
            <span className="text-[11px] font-bold text-blue-700 font-mono">T - 10 MIN (9:50 AM)</span>
            <h4 className="font-semibold text-slate-900">Device & Sync</h4>
            <p className="text-slate-600 text-[11px]">
              Verify your Master List in IRCTC. Close all unnecessary apps to free memory.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1.5">
            <span className="text-[11px] font-bold text-blue-700 font-mono">T - 3 MIN (9:57 AM)</span>
            <h4 className="font-semibold text-slate-900">Precision Login</h4>
            <p className="text-slate-600 text-[11px]">
              Log in to IRCTC. Never log in too early (e.g. 9:45 AM) to prevent session timeout!
            </p>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1.5">
            <span className="text-[11px] font-bold text-amber-700 font-mono">T - 1 MIN (9:59 AM)</span>
            <h4 className="font-semibold text-slate-900">Station Search Ready</h4>
            <p className="text-slate-600 text-[11px]">
              Have From/To and Train Number selected. Keep your eyes on the seconds hand.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/70 space-y-1.5">
            <span className="text-[11px] font-bold text-emerald-700 font-mono">T - 0 (10:00:01 AM)</span>
            <h4 className="font-semibold text-emerald-950">1-Tap Book & UPI</h4>
            <p className="text-emerald-900 text-[11px]">
              Click Book. Select Master List passengers. Choose UPI VPA payment for sub-10s authorization.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
