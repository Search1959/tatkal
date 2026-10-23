import { 
  Passenger, 
  SavedJourney, 
  TatkalRuleConfig, 
  PnrRecord, 
  AlertNotification, 
  AdminStats 
} from '../types';
import { INDIAN_STATIONS } from '../data/mockStations';
import { INDIAN_TRAINS } from '../data/mockTrains';
import { DEFAULT_TATKAL_RULES, calculateTatkalOpening } from '../utils/tatkalCalculations';

class AppStorage {
  private passengers: Passenger[] = [
    {
      id: 'p-1',
      name: 'RAJESH SHARMA',
      age: 44,
      gender: 'M',
      berthPreference: 'LOWER',
      foodPreference: 'V',
      seniorCitizen: false,
      groupTag: 'Family',
      idCardType: 'Aadhaar (Last 4)',
      idCardLast4: '8842',
      createdAt: new Date().toISOString()
    },
    {
      id: 'p-2',
      name: 'POOJA SHARMA',
      age: 41,
      gender: 'F',
      berthPreference: 'MIDDLE',
      foodPreference: 'V',
      seniorCitizen: false,
      groupTag: 'Family',
      idCardType: 'Aadhaar (Last 4)',
      idCardLast4: '1299',
      createdAt: new Date().toISOString()
    },
    {
      id: 'p-3',
      name: 'AARAV SHARMA',
      age: 12,
      gender: 'M',
      berthPreference: 'UPPER',
      foodPreference: 'V',
      seniorCitizen: false,
      groupTag: 'Family',
      createdAt: new Date().toISOString()
    },
    {
      id: 'p-4',
      name: 'VIKRAM MALHOTRA',
      age: 32,
      gender: 'M',
      berthPreference: 'SIDE_LOWER',
      foodPreference: 'N',
      seniorCitizen: false,
      groupTag: 'Office',
      createdAt: new Date().toISOString()
    }
  ];

  private journeys: SavedJourney[] = [];
  private pnrRecords: Map<string, PnrRecord> = new Map();
  private alerts: AlertNotification[] = [];
  private tatkalRules: TatkalRuleConfig = { ...DEFAULT_TATKAL_RULES };
  private serverStartTime = Date.now();
  private searchesCount = 142;

  constructor() {
    this.seedDefaultJourney();
    this.seedDefaultPnrs();
  }

  private seedDefaultJourney() {
    // Tomorrow + 2 days for realistic upcoming Tatkal booking demonstration
    const d = new Date();
    d.setDate(d.getDate() + 2);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const journeyDate = `${yyyy}-${mm}-${dd}`;

    const opening = calculateTatkalOpening(journeyDate, '3A', 0, this.tatkalRules);

    this.journeys.push({
      id: 'j-101',
      trainNumber: '12952',
      trainName: 'Mumbai Tejas Rajdhani Express',
      fromStationCode: 'NDLS',
      fromStationName: 'New Delhi',
      toStationCode: 'MMCT',
      toStationName: 'Mumbai Central',
      journeyDate,
      travelClass: '3A',
      quota: 'TQ',
      passengerIds: ['p-1', 'p-2'],
      tatkalOpeningDate: opening.tatkalDate,
      tatkalOpeningTime: opening.tatkalTime,
      isAcClass: true,
      reminderEnabled: true,
      reminderMinutesBefore: 15,
      originDepartureOffsetDays: 0,
      notes: 'Family trip. Be ready with PhonePe UPI by 9:57 AM.',
      createdAt: new Date().toISOString()
    });

    this.alerts.push({
      id: 'alt-1',
      journeyId: 'j-101',
      title: 'Tatkal Opening Reminder',
      message: `AC Tatkal opens tomorrow at 10:00 AM IST for 12952 Mumbai Rajdhani.`,
      scheduledFor: `${opening.tatkalDate}T09:45:00+05:30`,
      type: 'TATKAL_COUNTDOWN',
      status: 'PENDING',
      createdAt: new Date().toISOString()
    });
  }

  private seedDefaultPnrs() {
    this.pnrRecords.set('2847591024', {
      pnr: '2847591024',
      trainNumber: '12952',
      trainName: 'Mumbai Tejas Rajdhani Express',
      fromStationCode: 'NDLS',
      fromStationName: 'New Delhi',
      toStationCode: 'MMCT',
      toStationName: 'Mumbai Central',
      journeyDate: '2026-10-25',
      travelClass: '3A',
      chartingStatus: 'CHART_PREPARED',
      platform: 'Platform 1',
      scheduledDeparture: '16:55 IST',
      scheduledArrival: '08:35 IST',
      delayMinutes: 0,
      confirmationProbability: 100,
      lastChecked: new Date().toISOString(),
      passengers: [
        { passengerNumber: 1, bookingStatus: 'WL 14', currentStatus: 'CNF', coach: 'B4', berth: 23, berthType: 'LOWER' },
        { passengerNumber: 2, bookingStatus: 'WL 15', currentStatus: 'CNF', coach: 'B4', berth: 24, berthType: 'MIDDLE' }
      ]
    });

    this.pnrRecords.set('4918237560', {
      pnr: '4918237560',
      trainNumber: '12626',
      trainName: 'Kerala Superfast Express',
      fromStationCode: 'NDLS',
      fromStationName: 'New Delhi',
      toStationCode: 'ERS',
      toStationName: 'Ernakulam Junction',
      journeyDate: '2026-10-28',
      travelClass: 'SL',
      chartingStatus: 'CHART_NOT_PREPARED',
      platform: 'Platform 3',
      scheduledDeparture: '20:10 IST',
      scheduledArrival: '10:30 IST',
      delayMinutes: 15,
      confirmationProbability: 82,
      lastChecked: new Date().toISOString(),
      passengers: [
        { passengerNumber: 1, bookingStatus: 'WL 42', currentStatus: 'RAC 6', coach: 'S3', berth: 39, berthType: 'SIDE_LOWER' },
        { passengerNumber: 2, bookingStatus: 'WL 43', currentStatus: 'RAC 7', coach: 'S3', berth: 39, berthType: 'SIDE_LOWER' }
      ]
    });
  }

  // Stations
  getStations(query?: string) {
    if (!query) return INDIAN_STATIONS;
    const q = query.toLowerCase().trim();
    return INDIAN_STATIONS.filter(s => 
      s.code.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.state.toLowerCase().includes(q)
    );
  }

  // Trains
  searchTrains(fromCode: string, toCode: string, _date?: string, _className?: string, _quota?: string) {
    this.searchesCount++;
    const from = fromCode.toUpperCase().trim();
    const to = toCode.toUpperCase().trim();

    return INDIAN_TRAINS.filter(train => {
      // Direct matches
      const directMatch = train.originStationCode === from && train.destinationStationCode === to;
      if (directMatch) return true;

      // Stop-based matches
      const fromStopIdx = train.stops.findIndex(s => s.stationCode === from);
      const toStopIdx = train.stops.findIndex(s => s.stationCode === to);

      return fromStopIdx !== -1 && toStopIdx !== -1 && fromStopIdx < toStopIdx;
    });
  }

  // Passengers
  getPassengers() {
    return this.passengers;
  }

  addPassenger(data: Omit<Passenger, 'id' | 'createdAt'>): Passenger {
    const newPassenger: Passenger = {
      id: `p-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: data.name.toUpperCase().trim(),
      age: Number(data.age),
      gender: data.gender,
      berthPreference: data.berthPreference || 'NO_PREF',
      foodPreference: data.foodPreference || 'NONE',
      seniorCitizen: Boolean(data.seniorCitizen || Number(data.age) >= 60),
      groupTag: data.groupTag || 'Family',
      idCardType: data.idCardType,
      idCardLast4: data.idCardLast4,
      createdAt: new Date().toISOString()
    };
    this.passengers.push(newPassenger);
    return newPassenger;
  }

  deletePassenger(id: string): boolean {
    const idx = this.passengers.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.passengers.splice(idx, 1);
      return true;
    }
    return false;
  }

  // Journeys
  getJourneys() {
    return this.journeys;
  }

  saveJourney(data: Omit<SavedJourney, 'id' | 'createdAt' | 'tatkalOpeningDate' | 'tatkalOpeningTime' | 'isAcClass'>): SavedJourney {
    const opening = calculateTatkalOpening(
      data.journeyDate,
      data.travelClass,
      data.originDepartureOffsetDays || 0,
      this.tatkalRules
    );

    const journey: SavedJourney = {
      id: `j-${Date.now()}`,
      ...data,
      tatkalOpeningDate: opening.tatkalDate,
      tatkalOpeningTime: opening.tatkalTime,
      isAcClass: opening.isAc,
      createdAt: new Date().toISOString()
    };

    this.journeys.unshift(journey);

    // Add alert
    if (journey.reminderEnabled) {
      this.alerts.unshift({
        id: `alt-${Date.now()}`,
        journeyId: journey.id,
        title: `Tatkal Prep: ${journey.trainNumber} ${journey.trainName}`,
        message: `Tatkal window opens at ${opening.tatkalTime.slice(0, 5)} IST on ${opening.tatkalDate}. Prepare your Master List!`,
        scheduledFor: `${opening.tatkalDate}T${opening.tatkalTime}+05:30`,
        type: 'TATKAL_COUNTDOWN',
        status: 'PENDING',
        createdAt: new Date().toISOString()
      });
    }

    return journey;
  }

  deleteJourney(id: string): boolean {
    const idx = this.journeys.findIndex(j => j.id === id);
    if (idx !== -1) {
      this.journeys.splice(idx, 1);
      return true;
    }
    return false;
  }

  // Rules
  getTatkalRules(): TatkalRuleConfig {
    return this.tatkalRules;
  }

  updateTatkalRules(updated: Partial<TatkalRuleConfig>): TatkalRuleConfig {
    this.tatkalRules = {
      ...this.tatkalRules,
      ...updated,
      lastUpdated: new Date().toISOString()
    };
    return this.tatkalRules;
  }

  // PNR
  getPnr(pnr: string): PnrRecord | null {
    const clean = pnr.replace(/\D/g, '');
    if (this.pnrRecords.has(clean)) {
      return this.pnrRecords.get(clean)!;
    }

    // If 10-digit number not found in mock store, synthesize a realistic Indian Railways PNR query response
    if (clean.length === 10) {
      const isConfirmed = parseInt(clean.slice(-1), 10) > 3;
      const record: PnrRecord = {
        pnr: clean,
        trainNumber: '12302',
        trainName: 'Howrah Rajdhani Express',
        fromStationCode: 'NDLS',
        fromStationName: 'New Delhi',
        toStationCode: 'HWH',
        toStationName: 'Howrah Junction',
        journeyDate: '2026-10-30',
        travelClass: '3A',
        chartingStatus: isConfirmed ? 'CHART_PREPARED' : 'CHART_NOT_PREPARED',
        platform: 'Platform 12',
        scheduledDeparture: '16:50 IST',
        scheduledArrival: '09:55 IST',
        delayMinutes: 0,
        confirmationProbability: isConfirmed ? 100 : 74,
        lastChecked: new Date().toISOString(),
        passengers: [
          {
            passengerNumber: 1,
            bookingStatus: isConfirmed ? 'CNF' : 'WL 28',
            currentStatus: isConfirmed ? 'CNF' : 'RAC 2',
            coach: isConfirmed ? 'B3' : undefined,
            berth: isConfirmed ? 31 : undefined,
            berthType: isConfirmed ? 'LOWER' : undefined
          }
        ]
      };
      this.pnrRecords.set(clean, record);
      return record;
    }

    return null;
  }

  // Alerts
  getAlerts(): AlertNotification[] {
    return this.alerts;
  }

  dismissAlert(id: string): boolean {
    const alert = this.alerts.find(a => a.id === id);
    if (alert) {
      alert.status = 'DISMISSED';
      return true;
    }
    return false;
  }

  // Admin Stats
  getAdminStats(): AdminStats {
    return {
      totalJourneys: this.journeys.length,
      totalPassengers: this.passengers.length,
      activeAlerts: this.alerts.filter(a => a.status === 'PENDING').length,
      searchesToday: this.searchesCount,
      systemUptimeSeconds: Math.floor((Date.now() - this.serverStartTime) / 1000),
      irctcServerStatus: 'NORMAL',
      isLiveApiConfigured: false,
      dataSourceLabel: 'Simulated Railway Schedule Engine (Accurate Timetables)'
    };
  }
}

export const appStorage = new AppStorage();
