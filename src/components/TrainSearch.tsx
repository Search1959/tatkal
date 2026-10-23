import React, { useState } from 'react';
import { 
  Search, 
  ArrowLeftRight, 
  Calendar, 
  Clock, 
  Tag, 
  Users, 
  Info, 
  AlertCircle, 
  Bookmark, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Train as TrainIcon
} from 'lucide-react';
import { Station, Train, TravelClass, BookingQuota } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { calculateTatkalOpening, calculateTatkalFare } from '../utils/tatkalCalculations';
import { INDIAN_STATIONS } from '../data/mockStations';

interface TrainSearchProps {
  stations: Station[];
  trains: Train[];
  onSearch: (params: { from: string; to: string; date?: string; class?: string; quota?: string }) => void;
  onSaveJourney: (journey: {
    trainNumber: string;
    trainName: string;
    fromStationCode: string;
    fromStationName: string;
    toStationCode: string;
    toStationName: string;
    journeyDate: string;
    travelClass: TravelClass;
    quota: BookingQuota;
    originDepartureOffsetDays: number;
  }) => void;
  onOpenHandoff: (trainInfo: {
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
  }) => void;
  onPlanTatkal: (train: Train, date: string, travelClass: TravelClass) => void;
}

export const TrainSearch: React.FC<TrainSearchProps> = ({
  stations,
  trains,
  onSearch,
  onSaveJourney,
  onOpenHandoff,
  onPlanTatkal
}) => {
  const { t } = useLanguage();
  const activeStations = stations && stations.length > 0 ? stations : INDIAN_STATIONS;

  const [fromCode, setFromCode] = useState('NDLS');
  const [toCode, setToCode] = useState('MMCT');
  const [journeyDate, setJourneyDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [selectedClass, setSelectedClass] = useState<TravelClass>('3A');
  const [selectedQuota, setSelectedQuota] = useState<BookingQuota>('TQ');
  const [passengerCount, setPassengerCount] = useState<number>(2);
  const [expandedTrainId, setExpandedTrainId] = useState<string | null>(null);
  const [savedSuccessId, setSavedSuccessId] = useState<string | null>(null);

  const swapStations = () => {
    const temp = fromCode;
    setFromCode(toCode);
    setToCode(temp);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      from: fromCode,
      to: toCode,
      date: journeyDate,
      class: selectedClass,
      quota: selectedQuota
    });
  };

  const handleSave = (train: Train) => {
    // Check stop day count for origin offset
    const fromStop = train.stops.find(s => s.stationCode === fromCode);
    const offset = fromStop ? Math.max(0, fromStop.dayCount - 1) : 0;

    const fromStn = stations.find(s => s.code === fromCode);
    const toStn = stations.find(s => s.code === toCode);

    onSaveJourney({
      trainNumber: train.trainNumber,
      trainName: train.trainName,
      fromStationCode: fromCode,
      fromStationName: fromStn ? fromStn.name : fromCode,
      toStationCode: toCode,
      toStationName: toStn ? toStn.name : toCode,
      journeyDate,
      travelClass: selectedClass,
      quota: selectedQuota,
      originDepartureOffsetDays: offset
    });

    setSavedSuccessId(train.trainNumber);
    setTimeout(() => setSavedSuccessId(null), 2500);
  };

  const handleBookHandoff = (train: Train) => {
    const fromStn = stations.find(s => s.code === fromCode);
    const toStn = stations.find(s => s.code === toCode);
    const avail = train.availabilities[selectedClass];

    onOpenHandoff({
      trainNumber: train.trainNumber,
      trainName: train.trainName,
      fromStationCode: fromCode,
      fromStationName: fromStn ? fromStn.name : fromCode,
      toStationCode: toCode,
      toStationName: toStn ? toStn.name : toCode,
      journeyDate,
      travelClass: selectedClass,
      quota: selectedQuota,
      fare: avail ? (selectedQuota === 'TQ' ? avail.tatkalFare : avail.fare) : undefined
    });
  };

  return (
    <div className="space-y-6">
      {/* Search Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">{t.searchTrainsTitle}</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verify train schedules, Tatkal quota allocation, and fare estimates.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Prototype Timetable Engine</span>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* From Station */}
            <div className="md:col-span-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.fromStation}
              </label>
              <select
                value={fromCode}
                onChange={(e) => setFromCode(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F284E]"
              >
                {activeStations.map(stn => (
                  <option key={`src-${stn.code}`} value={stn.code}>
                    {stn.name} ({stn.code}) - {stn.city}
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 flex justify-center pt-4 md:pt-4">
              <button
                type="button"
                onClick={swapStations}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
                title="Swap Stations"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            </div>

            {/* To Station */}
            <div className="md:col-span-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.toStation}
              </label>
              <select
                value={toCode}
                onChange={(e) => setToCode(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0F284E]"
              >
                {activeStations.map(stn => (
                  <option key={`dst-${stn.code}`} value={stn.code}>
                    {stn.name} ({stn.code}) - {stn.city}
                  </option>
                ))}
              </select>
            </div>

            {/* Journey Date */}
            <div className="md:col-span-3">
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
          </div>

          {/* Secondary Controls: Class, Quota, Passenger Count */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.travelClass}
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value as TravelClass)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#0F284E]"
              >
                <option value="3A">AC 3 Tier (3A) - 10:00 AM</option>
                <option value="2A">AC 2 Tier (2A) - 10:00 AM</option>
                <option value="1A">AC 1st Class (1A) - 10:00 AM</option>
                <option value="3E">AC 3 Economy (3E) - 10:00 AM</option>
                <option value="CC">AC Chair Car (CC) - 10:00 AM</option>
                <option value="EC">Exec. Chair Car (EC) - 10:00 AM</option>
                <option value="SL">Sleeper (SL) - 11:00 AM</option>
                <option value="2S">Second Sitting (2S) - 11:00 AM</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.quota}
              </label>
              <select
                value={selectedQuota}
                onChange={(e) => setSelectedQuota(e.target.value as BookingQuota)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#0F284E]"
              >
                <option value="TQ">Tatkal (TQ) - Max 4 Passengers</option>
                <option value="PT">Premium Tatkal (PT) - Dynamic Fare</option>
                <option value="GN">General Quota (GN)</option>
                <option value="LD">Ladies Quota (LD)</option>
                <option value="SS">Senior Citizen (SS)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Passengers (Max 4 for Tatkal)
              </label>
              <input
                type="number"
                min={1}
                max={selectedQuota === 'TQ' ? 4 : 6}
                value={passengerCount}
                onChange={(e) => setPassengerCount(Math.min(selectedQuota === 'TQ' ? 4 : 6, Math.max(1, Number(e.target.value))))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#0F284E]"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 px-4 rounded-lg bg-[#0F284E] hover:bg-[#163B6E] text-white font-bold text-xs sm:text-sm shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <Search className="w-4 h-4" />
                <span>Search Trains</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Demo Notice Banner */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Demo Train Availability Notice:</strong> Real Indian Railway seat status fluctuates second-by-second. The seat status, running days, and fare surge figures displayed below are grounded in official Indian Railways timetables and Tatkal fare regulations for realistic preparation.
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-600 px-1">
          <span className="font-semibold text-slate-900">
            {trains.length} Trains available between {fromCode} and {toCode}
          </span>
          <span>Fares shown for {selectedQuota} Quota ({selectedClass})</span>
        </div>

        {trains.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 space-y-2">
            <TrainIcon className="w-10 h-10 mx-auto text-slate-300" />
            <h3 className="font-bold text-slate-800 text-sm">No direct trains found for this route</h3>
            <p className="text-xs max-w-sm mx-auto">
              Try searching major junction stations like NDLS (New Delhi), CSMT (Mumbai), HWH (Howrah), or BSB (Varanasi).
            </p>
          </div>
        ) : (
          trains.map(train => {
            const avail = train.availabilities[selectedClass];
            const isExpanded = expandedTrainId === train.trainNumber;

            // Calculate origin offset days
            const fromStop = train.stops.find(s => s.stationCode === fromCode);
            const originOffsetDays = fromStop ? Math.max(0, fromStop.dayCount - 1) : 0;
            const tatkalOpen = calculateTatkalOpening(journeyDate, selectedClass, originOffsetDays);

            return (
              <div 
                key={train.trainNumber}
                className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all overflow-hidden"
              >
                {/* Train Card Main Section */}
                <div className="p-4 sm:p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm sm:text-base font-bold text-slate-900">
                          {train.trainNumber} - {train.trainName}
                        </span>
                        <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                          {train.trainType.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <span>Runs on: {train.runningDays.join(', ')}</span>
                        <span aria-hidden="true">·</span>
                        <span>{train.originStationName} ({train.originStationCode}) → {train.destinationStationName} ({train.destinationStationCode})</span>
                      </div>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleSave(train)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1 transition-colors"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>{savedSuccessId === train.trainNumber ? 'Saved!' : 'Save'}</span>
                      </button>

                      <button
                        onClick={() => onPlanTatkal(train, journeyDate, selectedClass)}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-semibold flex items-center gap-1 transition-colors border border-blue-200"
                      >
                        <Clock className="w-3.5 h-3.5 text-blue-700" />
                        <span>Plan Tatkal</span>
                      </button>

                      <button
                        onClick={() => handleBookHandoff(train)}
                        className="px-3.5 py-1.5 rounded-lg bg-[#9B111E] hover:bg-[#B91C1C] text-white text-xs font-bold flex items-center gap-1 transition-colors shadow-xs"
                      >
                        <span>IRCTC Book</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Schedule Strip */}
                  <div className="grid grid-cols-3 gap-2 py-1 items-center">
                    <div>
                      <span className="block font-mono text-base font-bold text-slate-900">{train.departureTime}</span>
                      <span className="text-xs text-slate-600 font-medium">{train.originStationCode}</span>
                    </div>

                    <div className="text-center">
                      <span className="text-xs font-medium text-slate-500">{train.durationHours}</span>
                      <div className="w-full flex items-center gap-1 my-1">
                        <div className="h-0.5 flex-1 bg-slate-200" />
                        <TrainIcon className="w-3.5 h-3.5 text-slate-400" />
                        <div className="h-0.5 flex-1 bg-slate-200" />
                      </div>
                      <span className="text-[11px] text-slate-400">{train.stops.length} Stops</span>
                    </div>

                    <div className="text-right">
                      <span className="block font-mono text-base font-bold text-slate-900">{train.arrivalTime}</span>
                      <span className="text-xs text-slate-600 font-medium">{train.destinationStationCode}</span>
                    </div>
                  </div>

                  {/* Tatkal Opening Notice for this specific train & date */}
                  <div className="bg-[#0F284E]/5 border border-[#0F284E]/15 rounded-lg p-2.5 flex items-center justify-between text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#0F284E]" />
                      <span>
                        Tatkal for {journeyDate} ({selectedClass}) opens: <strong className="text-slate-900">{tatkalOpen.tatkalDate} at {tatkalOpen.tatkalTime.slice(0, 5)} IST</strong>
                      </span>
                    </div>
                    {originOffsetDays > 0 && (
                      <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        Origin Offset: {originOffsetDays} day prior
                      </span>
                    )}
                  </div>

                  {/* Class Selection & Fare Strip */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {train.classes.map(cls => {
                      const classAvail = train.availabilities[cls];
                      const isSelected = selectedClass === cls;
                      const fare = classAvail ? (selectedQuota === 'TQ' ? classAvail.tatkalFare : classAvail.fare) : 0;
                      const statusDetail = classAvail ? (selectedQuota === 'TQ' ? classAvail.tatkalStatusDetail : classAvail.statusDetail) : 'NA';

                      return (
                        <button
                          key={cls}
                          onClick={() => setSelectedClass(cls)}
                          className={`px-3 py-2 rounded-lg border text-left transition-all text-xs ${
                            isSelected
                              ? 'border-[#0F284E] bg-[#0F284E]/10 ring-1 ring-[#0F284E]'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-bold text-slate-900">{cls}</span>
                            <span className="font-semibold text-slate-800">₹{fare}</span>
                          </div>
                          <div className="text-[11px] font-medium text-emerald-700 mt-0.5">
                            {statusDetail}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Toggle Route Details */}
                  <div className="pt-1 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                    <button
                      onClick={() => setExpandedTrainId(isExpanded ? null : train.trainNumber)}
                      className="flex items-center gap-1 font-medium text-slate-700 hover:text-slate-900"
                    >
                      <span>{isExpanded ? 'Hide Route & Stoppages' : 'View Route & Stoppages'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                    <span>Distance: {train.stops[train.stops.length - 1]?.distanceKm} km</span>
                  </div>
                </div>

                {/* Expanded Route Stoppages Table */}
                {isExpanded && (
                  <div className="bg-slate-50 border-t border-slate-200 p-4 overflow-x-auto text-xs">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                          <th className="pb-1.5">Station</th>
                          <th className="pb-1.5">Code</th>
                          <th className="pb-1.5">Arrival</th>
                          <th className="pb-1.5">Departure</th>
                          <th className="pb-1.5">Day</th>
                          <th className="pb-1.5">Distance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200/70 font-mono text-slate-800">
                        {train.stops.map((stop, i) => (
                          <tr key={i} className={stop.stationCode === fromCode || stop.stationCode === toCode ? 'bg-amber-100/60 font-semibold' : ''}>
                            <td className="py-1.5 font-sans">{stop.stationName}</td>
                            <td className="py-1.5">{stop.stationCode}</td>
                            <td className="py-1.5">{stop.arrivalTime}</td>
                            <td className="py-1.5">{stop.departureTime}</td>
                            <td className="py-1.5">Day {stop.dayCount}</td>
                            <td className="py-1.5">{stop.distanceKm} km</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
