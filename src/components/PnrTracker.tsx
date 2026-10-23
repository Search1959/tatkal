import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Train as TrainIcon, 
  RefreshCw, 
  MapPin, 
  Info,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { PnrRecord } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { generatePostBookingMilestones } from '../utils/tatkalCalculations';
import { Bell, Check, ShieldAlert } from 'lucide-react';

interface PnrTrackerProps {
  onAddAlert?: (alert: { title: string; message: string; type: 'DEPARTURE' | 'PNR_STATUS'; scheduledFor: string }) => void;
}

export const PnrTracker: React.FC<PnrTrackerProps> = ({ onAddAlert }) => {
  const { t } = useLanguage();
  const [pnrInput, setPnrInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pnrData, setPnrData] = useState<PnrRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [alertsEnabled, setAlertsEnabled] = useState(false);

  const samplePnrs = ['2847591024', '4918237560'];

  const handleLookup = async (pnrToQuery: string) => {
    const clean = pnrToQuery.replace(/\D/g, '');
    if (clean.length !== 10) {
      setError('Please enter a valid 10-digit Indian Railways PNR number.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await api.checkPnr(clean);
      setPnrData(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'PNR record not found or expired.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLookup(pnrInput);
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900">{t.pnrLookupTitle}</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live status tracking for Passenger Name Record (PNR) & Chart Preparation.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Simulated Railway PRS Query</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                maxLength={10}
                required
                placeholder={t.enterPnr}
                value={pnrInput}
                onChange={(e) => {
                  setPnrInput(e.target.value.replace(/\D/g, ''));
                  setError(null);
                }}
                className="w-full px-4 py-2.5 pl-10 border border-slate-300 rounded-lg text-sm font-mono tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F284E]"
              />
              <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>

            <button
              type="submit"
              disabled={loading || pnrInput.length !== 10}
              className="py-2.5 px-6 rounded-lg bg-[#0F284E] hover:bg-[#163B6E] disabled:bg-slate-300 text-white font-bold text-xs sm:text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Checking...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>{t.checkStatus}</span>
                </>
              )}
            </button>
          </div>

          {/* Quick test PNR numbers */}
          <div className="flex items-center gap-2 text-xs text-slate-600 pt-1">
            <span className="font-semibold text-slate-700">Quick Test Samples:</span>
            {samplePnrs.map(sample => (
              <button
                key={sample}
                type="button"
                onClick={() => {
                  setPnrInput(sample);
                  handleLookup(sample);
                }}
                className="font-mono px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors border border-slate-200"
              >
                {sample}
              </button>
            ))}
          </div>
        </form>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* PNR Results Box */}
      {pnrData && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
          {/* Result Header Strip */}
          <div className="bg-[#0A1D37] text-white p-5 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-mono tracking-widest text-amber-400">
                  PNR: {pnrData.pnr}
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {pnrData.trainNumber} - {pnrData.trainName}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  pnrData.chartingStatus === 'CHART_PREPARED'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-amber-500 text-slate-950'
                }`}>
                  {pnrData.chartingStatus === 'CHART_PREPARED' ? t.chartPrepared : t.chartNotPrepared}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300 pt-1">
              <span>{pnrData.fromStationName} ({pnrData.fromStationCode}) → {pnrData.toStationName} ({pnrData.toStationCode})</span>
              <span>·</span>
              <span>Journey Date: {pnrData.journeyDate}</span>
              <span>·</span>
              <span>Class: {pnrData.travelClass}</span>
            </div>
          </div>

          <div className="p-5 space-y-5">
            {/* Timetable & Platform Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Departure</span>
                <span className="font-semibold text-slate-900 text-sm">{pnrData.scheduledDeparture}</span>
                <span className="text-slate-500 block text-[11px]">{pnrData.fromStationName}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Expected Platform</span>
                <span className="font-semibold text-slate-900 text-sm flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-600" />
                  {pnrData.platform || 'Platform will be announced'}
                </span>
                <span className="text-slate-500 block text-[11px]">
                  {pnrData.delayMinutes > 0 ? `Delayed by ${pnrData.delayMinutes} mins` : 'Running On Time'}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Confirmation Probability</span>
                <span className="font-semibold text-emerald-700 text-sm flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  {pnrData.confirmationProbability}% Probability
                </span>
                <span className="text-slate-500 block text-[11px]">Based on historical clearing trends</span>
              </div>
            </div>

            {/* Passenger Status Table */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-2.5">
                Passenger Berth Allocation
              </h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4">Passenger</th>
                      <th className="py-2.5 px-4">Booking Status</th>
                      <th className="py-2.5 px-4">Current Status</th>
                      <th className="py-2.5 px-4">Coach / Berth</th>
                      <th className="py-2.5 px-4">Berth Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {pnrData.passengers.map(p => (
                      <tr key={p.passengerNumber} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-bold">Passenger {p.passengerNumber}</td>
                        <td className="py-2.5 px-4 font-mono text-slate-500">{p.bookingStatus}</td>
                        <td className="py-2.5 px-4">
                          <span className={`font-bold font-mono px-2 py-0.5 rounded text-[11px] ${
                            p.currentStatus.includes('CNF')
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {p.currentStatus}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 font-bold text-slate-900">
                          {p.coach ? `${p.coach} / ${p.berth}` : 'Chart Pending'}
                        </td>
                        <td className="py-2.5 px-4 text-slate-600">{p.berthType || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Post-Booking Milestones & Reminder Setup */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-blue-600" />
                    <span>Post-Booking Journey Reminders & PRS Timeline</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Pre-set alerts for charting, refund thresholds, and boarding call.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (onAddAlert) {
                      onAddAlert({
                        title: `Chart Alert: PNR ${pnrData.pnr}`,
                        message: `First chart preparation for ${pnrData.trainNumber} ${pnrData.trainName}. Check coach & berth allotment!`,
                        type: 'PNR_STATUS',
                        scheduledFor: new Date().toISOString()
                      });
                      onAddAlert({
                        title: `Departure Call: ${pnrData.trainNumber}`,
                        message: `Train departs at ${pnrData.scheduledDeparture}. Please proceed to ${pnrData.platform || 'platform'}.`,
                        type: 'DEPARTURE',
                        scheduledFor: new Date().toISOString()
                      });
                    }
                    setAlertsEnabled(true);
                  }}
                  disabled={alertsEnabled}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    alertsEnabled
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-[#0F284E] hover:bg-[#163B6E] text-white shadow-xs'
                  }`}
                >
                  {alertsEnabled ? <Check className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                  <span>{alertsEnabled ? 'Reminders Active' : 'Activate Departure Alerts'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
                {generatePostBookingMilestones(pnrData.journeyDate, pnrData.scheduledDeparture.slice(0, 5)).map((m, idx) => (
                  <div key={idx} className="bg-white p-2.5 rounded-lg border border-slate-200 text-[11px] space-y-1">
                    <span className="font-mono font-bold text-blue-700 block text-[10px]">
                      {m.hoursBefore} HOURS BEFORE DEPARTURE
                    </span>
                    <strong className="text-slate-900 block font-semibold">{m.title}</strong>
                    <p className="text-slate-500 text-[10px] leading-tight">{m.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Micro timestamp & explanation */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>Last checked: {new Date(pnrData.lastChecked).toLocaleTimeString()}</span>
              <span>Charts are finalized 4 hours prior to train departure</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
