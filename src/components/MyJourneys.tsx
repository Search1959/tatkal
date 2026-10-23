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
  Train as TrainIcon,
  Edit3,
  X
} from 'lucide-react';
import { SavedJourney, TravelClass, BookingQuota } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { formatCountdown, getTimeUntilTatkal } from '../utils/tatkalCalculations';

interface MyJourneysProps {
  journeys: SavedJourney[];
  onDeleteJourney: (id: string) => void;
  onUpdateJourney?: (id: string, updated: Partial<SavedJourney>) => void;
  onOpenHandoff: (journey: SavedJourney) => void;
  onNavigateToSearch: () => void;
}

export const MyJourneys: React.FC<MyJourneysProps> = ({
  journeys,
  onDeleteJourney,
  onUpdateJourney,
  onOpenHandoff,
  onNavigateToSearch
}) => {
  const { t } = useLanguage();
  const [, setTicker] = useState(0);
  const [editingJourney, setEditingJourney] = useState<SavedJourney | null>(null);

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
                      onClick={() => setEditingJourney({ ...journey })}
                      className="p-1.5 text-slate-500 hover:text-blue-700 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Edit Journey Details"
                    >
                      <Edit3 className="w-4 h-4" />
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
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  {journey.notes ? (
                    <div className="text-slate-600 bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/60 flex items-start gap-2 flex-1">
                      <FileText className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <span>{journey.notes}</span>
                    </div>
                  ) : <div />}

                  {journey.pnr && (
                    <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-800 border border-slate-200">
                      PNR: {journey.pnr}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit Journey Modal */}
      {editingJourney && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-[#0A1D37] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Edit3 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Edit Journey Details</h3>
                  <p className="text-[11px] text-slate-300">
                    {editingJourney.trainNumber} - {editingJourney.trainName}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setEditingJourney(null)} 
                className="p-1 rounded text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingJourney && onUpdateJourney) {
                  onUpdateJourney(editingJourney.id, editingJourney);
                  setEditingJourney(null);
                }
              }}
              className="p-5 space-y-4 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Journey Date</label>
                  <input
                    type="date"
                    required
                    value={editingJourney.journeyDate}
                    onChange={(e) => setEditingJourney({ ...editingJourney, journeyDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Travel Class</label>
                  <select
                    value={editingJourney.travelClass}
                    onChange={(e) => setEditingJourney({ ...editingJourney, travelClass: e.target.value as TravelClass })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-900 bg-white"
                  >
                    <option value="3A">AC 3 Tier (3A)</option>
                    <option value="2A">AC 2 Tier (2A)</option>
                    <option value="1A">AC 1st Class (1A)</option>
                    <option value="3E">AC 3 Economy (3E)</option>
                    <option value="CC">AC Chair Car (CC)</option>
                    <option value="EC">Executive Chair Car (EC)</option>
                    <option value="SL">Sleeper (SL)</option>
                    <option value="2S">Second Sitting (2S)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Quota</label>
                  <select
                    value={editingJourney.quota}
                    onChange={(e) => setEditingJourney({ ...editingJourney, quota: e.target.value as BookingQuota })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-900 bg-white"
                  >
                    <option value="TQ">Tatkal (TQ)</option>
                    <option value="PT">Premium Tatkal (PT)</option>
                    <option value="GN">General (GN)</option>
                    <option value="LD">Ladies (LD)</option>
                    <option value="SS">Senior Citizen (SS)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Booked PNR (Optional)</label>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="10-digit PNR"
                    value={editingJourney.pnr || ''}
                    onChange={(e) => setEditingJourney({ ...editingJourney, pnr: e.target.value.replace(/\D/g, '') })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-medium text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Personal Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Remember to keep PhonePe open at 9:57 AM"
                  value={editingJourney.notes || ''}
                  onChange={(e) => setEditingJourney({ ...editingJourney, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingJourney(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#0F284E] hover:bg-[#163B6E] text-white font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
