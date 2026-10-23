import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Search, 
  Calendar, 
  Train as TrainIcon, 
  CheckCircle2, 
  Circle, 
  ExternalLink, 
  ArrowRight, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles, 
  Info,
  Users,
  Compass
} from 'lucide-react';
import { SavedJourney, Passenger, Station } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { formatCountdown } from '../utils/tatkalCalculations';

interface HomeDashboardProps {
  savedJourneys: SavedJourney[];
  passengers: Passenger[];
  stations: Station[];
  onNavigate: (tab: string) => void;
  onOpenHandoff: (journey: SavedJourney) => void;
  onQuickSearch: (from: string, to: string, date: string) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  savedJourneys,
  passengers,
  stations,
  onNavigate,
  onOpenHandoff,
  onQuickSearch
}) => {
  const { t } = useLanguage();

  const [fromCode, setFromCode] = useState('NDLS');
  const [toCode, setToCode] = useState('MMCT');
  const [journeyDate, setJourneyDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });

  // Next Tatkal Window Calculation (Today or Tomorrow's 10:00 AM AC window)
  const [nextAcDiff, setNextAcDiff] = useState<number>(0);
  const [nextSlDiff, setNextSlDiff] = useState<number>(0);

  useEffect(() => {
    const computeWindows = () => {
      const now = new Date();
      // IST current time
      const istDate = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
      
      const today10am = new Date(istDate);
      today10am.setHours(10, 0, 0, 0);

      const today11am = new Date(istDate);
      today11am.setHours(11, 0, 0, 0);

      let targetAc = today10am;
      if (istDate.getTime() > today10am.getTime() + 3600000) {
        // Today's AC Tatkal has passed 1 hour ago, target tomorrow
        targetAc = new Date(today10am.getTime() + 86400000);
      }

      let targetSl = today11am;
      if (istDate.getTime() > today11am.getTime() + 3600000) {
        targetSl = new Date(today11am.getTime() + 86400000);
      }

      setNextAcDiff(targetAc.getTime() - istDate.getTime());
      setNextSlDiff(targetSl.getTime() - istDate.getTime());
    };

    computeWindows();
    const interval = setInterval(computeWindows, 1000);
    return () => clearInterval(interval);
  }, []);

  const acCountdown = formatCountdown(nextAcDiff);
  const slCountdown = formatCountdown(nextSlDiff);

  // Preparation checklist items
  const [checklist, setChecklist] = useState([
    { id: 'master', text: 'Add all travellers to the IRCTC Master List in advance', checked: passengers.length > 0 },
    { id: 'upi', text: 'Keep UPI App (GPay/PhonePe/Paytm) ready for 1-tap approval', checked: true },
    { id: 'login', text: 'Log into IRCTC at 9:57 AM (AC) or 10:57 AM (Sleeper)', checked: false },
    { id: 'network', text: 'Ensure high-speed 5G or dual Wi-Fi standby connection', checked: true }
  ]);

  const toggleChecklist = (id: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onQuickSearch(fromCode, toCode, journeyDate);
  };

  return (
    <div className="space-y-6">
      {/* Prominent Disclaimer & Purpose Header */}
      <div className="bg-gradient-to-r from-[#0F284E] to-[#163864] text-white rounded-2xl p-5 shadow-lg border border-[#234674] relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-2xl space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Official Tatkal Companion
              </span>
              <span className="text-xs text-slate-300">·</span>
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> No Ticket Guarantee Disclaimer
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Be 100% Prepared Before the Tatkal Clock Strikes
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Tatkal tickets in Indian Railways sell out within seconds. Tatkal Assist calculates the exact opening date, syncs your master list, and counts down to 10:00 AM (AC) & 11:00 AM (Non-AC) so you never miss your booking window.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2.5">
            <button
              onClick={() => onNavigate('planner')}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Tatkal Calculator</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="https://www.irctc.co.in/nget/train-search"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors flex items-center gap-1 border border-white/20"
            >
              <span>IRCTC</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Grid: Live Countdown Windows & Quick Search */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card 1 & 2: Real-time Next Tatkal Countdown */}
        <div className="lg:col-span-1 space-y-4">
          {/* AC Tatkal Window */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 relative overflow-hidden">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Next AC Tatkal (1A, 2A, 3A, CC)
                </span>
              </div>
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                10:00 AM IST
              </span>
            </div>
            <div className="pt-3">
              <div className="flex items-baseline justify-between">
                <div className="font-mono text-2xl font-black text-slate-900 tracking-tight">
                  {acCountdown.formattedShort}
                </div>
                <span className="text-xs font-medium text-slate-500">
                  {acCountdown.isOpenNow ? 'Active Window' : 'Until Opening'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2 leading-tight">
                Applicable for trains originating tomorrow. Master List must be pre-saved.
              </p>
            </div>
          </div>

          {/* Non-AC Tatkal Window */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 relative overflow-hidden">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Next Non-AC Tatkal (SL, 2S)
                </span>
              </div>
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                11:00 AM IST
              </span>
            </div>
            <div className="pt-3">
              <div className="flex items-baseline justify-between">
                <div className="font-mono text-2xl font-black text-slate-900 tracking-tight">
                  {slCountdown.formattedShort}
                </div>
                <span className="text-xs font-medium text-slate-500">
                  {slCountdown.isOpenNow ? 'Active Window' : 'Until Opening'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2 leading-tight">
                Opens 1 hour after AC Tatkal. High rush on trunk routes (Bihar, UP, WB).
              </p>
            </div>
          </div>

          {/* Quick Stats Micro Strip */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-3.5 flex items-center justify-between text-xs text-slate-600">
            <div>
              <span className="block font-bold text-slate-900">{passengers.length} Passengers</span>
              <span className="text-[11px] text-slate-500">in Master List</span>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <span className="block font-bold text-slate-900">{savedJourneys.length} Journeys</span>
              <span className="text-[11px] text-slate-500">Tracked</span>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <button
              onClick={() => onNavigate('passengers')}
              className="text-blue-700 font-semibold hover:underline"
            >
              Manage →
            </button>
          </div>
        </div>

        {/* Card 3: Journey Quick Search Form */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#0F284E]" />
              <h2 className="font-bold text-sm text-slate-900">{t.searchTrainsTitle}</h2>
            </div>
            <span className="text-xs text-slate-500">
              Station Code or City Name
            </span>
          </div>

          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* From Station */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.fromStation}
                </label>
                <select
                  value={fromCode}
                  onChange={(e) => setFromCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F284E]"
                >
                  {stations.map(stn => (
                    <option key={`from-${stn.code}`} value={stn.code}>
                      {stn.name} ({stn.code}) - {stn.city}
                    </option>
                  ))}
                </select>
              </div>

              {/* To Station */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.toStation}
                </label>
                <select
                  value={toCode}
                  onChange={(e) => setToCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F284E]"
                >
                  {stations.map(stn => (
                    <option key={`to-${stn.code}`} value={stn.code}>
                      {stn.name} ({stn.code}) - {stn.city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.journeyDate}
                </label>
                <input
                  type="date"
                  value={journeyDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setJourneyDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F284E]"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-lg bg-[#0F284E] hover:bg-[#163B6E] text-white font-bold text-xs sm:text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>{t.searchButton} & Check Tatkal</span>
                </button>
              </div>
            </div>
          </form>

          {/* Quick Route Shortcuts */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <span className="font-semibold text-slate-700">Popular Corridors:</span>
            <button
              type="button"
              onClick={() => { setFromCode('NDLS'); setToCode('MMCT'); }}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
            >
              Delhi ⇄ Mumbai
            </button>
            <button
              type="button"
              onClick={() => { setFromCode('NDLS'); setToCode('BSB'); }}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
            >
              Delhi ⇄ Varanasi
            </button>
            <button
              type="button"
              onClick={() => { setFromCode('NDLS'); setToCode('HWH'); }}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
            >
              Delhi ⇄ Howrah
            </button>
            <button
              type="button"
              onClick={() => { setFromCode('SBC'); setToCode('NDLS'); }}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
            >
              Bangalore ⇄ Delhi
            </button>
          </div>
        </div>
      </div>

      {/* Row: Pre-Booking Readiness Checklist & Saved Journeys */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Pre-Booking Tactical Checklist */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h2 className="font-bold text-sm text-slate-900">{t.checklistTitle}</h2>
            </div>
            <span className="text-xs text-slate-500">
              Essential 10-Minute Drill
            </span>
          </div>

          <div className="space-y-2.5">
            {checklist.map(item => (
              <div 
                key={item.id}
                onClick={() => toggleChecklist(item.id)}
                className={`flex items-start gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                  item.checked 
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950' 
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.checked ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                )}
                <span className="text-xs font-medium leading-relaxed">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <p>
              <strong>Golden Rule:</strong> At 10:00:01 AM or 11:00:01 AM, refresh or click book immediately. Never use browser Back button or submit multiple concurrent requests, as IRCTC blocks dual logins.
            </p>
          </div>
        </div>

        {/* Saved Upcoming Journeys */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#0F284E]" />
              <h2 className="font-bold text-sm text-slate-900">{t.myJourneys}</h2>
            </div>
            <button
              onClick={() => onNavigate('journeys')}
              className="text-xs font-semibold text-blue-700 hover:underline"
            >
              View All ({savedJourneys.length}) →
            </button>
          </div>

          {savedJourneys.length === 0 ? (
            <div className="py-8 text-center text-slate-500 space-y-2">
              <Compass className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs">No saved journeys yet.</p>
              <button
                onClick={() => onNavigate('search')}
                className="px-3 py-1.5 rounded-lg bg-[#0F284E] text-white text-xs font-medium"
              >
                Find & Plan Journey
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {savedJourneys.slice(0, 2).map(journey => (
                <div 
                  key={journey.id}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors bg-slate-50/50 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">
                        {journey.trainNumber} {journey.trainName}
                      </span>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {journey.fromStationCode} → {journey.toStationCode} · Journey: {journey.journeyDate}
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                      {journey.travelClass} ({journey.quota})
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 text-xs">
                    <span className="text-slate-600 font-medium">
                      Tatkal Opens: <strong className="text-slate-900">{journey.tatkalOpeningDate} at {journey.tatkalOpeningTime.slice(0, 5)} IST</strong>
                    </span>
                    <button
                      onClick={() => onOpenHandoff(journey)}
                      className="px-2.5 py-1 rounded-md bg-[#9B111E] hover:bg-[#B91C1C] text-white font-semibold text-xs flex items-center gap-1 transition-colors"
                    >
                      <span>Handoff</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-2 text-right">
            <button
              onClick={() => onNavigate('planner')}
              className="text-xs font-semibold text-[#0F284E] hover:underline"
            >
              Calculate Custom Origin Offset →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
