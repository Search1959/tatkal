import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Trash2, 
  ExternalLink, 
  ShieldCheck, 
  FileText, 
  AlertCircle, 
  Bell, 
  Plus, 
  Train as TrainIcon
} from 'lucide-react';
import { SavedJourney } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { formatCountdown, getTimeUntilTatkal } from '../utils/tatkalCalculations';

interface MyJourneysProps {
  journeys: SavedJourney[];
  onDeleteJourney: (id: string) => void;
  onOpenHandoff: (journey: SavedJourney) => void;
  onNavigateToSearch: () => void;
}

export const MyJourneys: React.FC<MyJourneysProps> = ({
  journeys,
  onDeleteJourney,
  onOpenHandoff,
  onNavigateToSearch
}) => {
  const { t } = useLanguage();
  const [, setTicker] = useState(0);

  // Re-render countdown every second
  useEffect(() => {
    const timer = setInterval(() => setTicker(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">{t.myJourneys} & Tatkal Tracking</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor upcoming Tatkal countdowns and trigger instant official IRCTC handoff.
          </p>
        </div>
        <button
          onClick={onNavigateToSearch}
          className="px-3.5 py-2 rounded-lg bg-[#0F284E] hover:bg-[#163B6E] text-white font-bold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Plan Another Journey</span>
        </button>
      </div>

      {/* Journeys List */}
      <div className="space-y-4">
        {journeys.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 space-y-3">
            <Calendar className="w-10 h-10 mx-auto text-slate-300" />
            <h3 className="font-bold text-slate-800 text-sm">No journeys tracked yet</h3>
            <p className="text-xs max-w-sm mx-auto">
              Search for your desired train and click "Save Journey" to monitor the exact Tatkal opening window.
            </p>
            <button
              onClick={onNavigateToSearch}
              className="px-4 py-2 rounded-lg bg-[#0F284E] text-white text-xs font-semibold"
            >
              Search Trains Now
            </button>
          </div>
        ) : (
          journeys.map(journey => {
            const tatkalIso = `${journey.tatkalOpeningDate}T${journey.tatkalOpeningTime}+05:30`;
            const diffMs = getTimeUntilTatkal(tatkalIso);
            const countdown = formatCountdown(diffMs);

            return (
              <div
                key={journey.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all p-5 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-slate-900">
                        {journey.trainNumber} - {journey.trainName}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-900">
                        {journey.travelClass} · {journey.quota}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                      <span>{journey.fromStationName} ({journey.fromStationCode}) → {journey.toStationName} ({journey.toStationCode})</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-slate-700">Journey: {journey.journeyDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onOpenHandoff(journey)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#9B111E] hover:bg-[#B91C1C] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <span>Launch IRCTC</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteJourney(journey.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="Remove Journey"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Tatkal Countdown Bar */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-slate-500">
                      Tatkal Window Opens At:
                    </span>
                    <div className="font-mono text-sm font-bold text-slate-900">
                      {journey.tatkalOpeningDate} at {journey.tatkalOpeningTime.slice(0, 5)} IST ({journey.isAcClass ? 'AC 10 AM' : 'Non-AC 11 AM'})
                    </div>
                    {journey.originDepartureOffsetDays > 0 && (
                      <span className="text-[11px] text-amber-800 font-medium">
                        Origin Station Offset: Train started {journey.originDepartureOffsetDays} day earlier.
                      </span>
                    )}
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-slate-500 block">
                      Live Countdown:
                    </span>
                    <span className={`font-mono text-lg font-black tracking-tight ${countdown.isOpenNow ? 'text-emerald-600' : 'text-[#0F284E]'}`}>
                      {countdown.formattedShort}
                    </span>
                  </div>
                </div>

                {/* Optional Journey Notes / PNR */}
                {journey.notes && (
                  <div className="text-xs text-slate-600 bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/60 flex items-start gap-2">
                    <FileText className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                    <span>{journey.notes}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
