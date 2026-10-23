export type TravelClass = '1A' | '2A' | '3A' | '3E' | 'SL' | 'CC' | 'EC' | '2S';

export type BookingQuota = 'TQ' | 'PT' | 'GN' | 'LD' | 'SS';

export type BerthPreference = 
  | 'NO_PREF'
  | 'LOWER'
  | 'MIDDLE'
  | 'UPPER'
  | 'SIDE_LOWER'
  | 'SIDE_UPPER'
  | 'WINDOW';

export type FoodPreference = 'V' | 'N' | 'NONE';

export type Gender = 'M' | 'F' | 'T';

export interface Station {
  code: string;
  name: string;
  city: string;
  state: string;
  zone: string;
  isJunction?: boolean;
}

export interface TrainClassAvailability {
  className: TravelClass;
  fare: number;
  tatkalFare: number;
  availableSeats: number;
  totalSeats: number;
  status: 'AVAILABLE' | 'RAC' | 'WL' | 'REGRET';
  statusDetail: string; // e.g. "AVAILABLE-42", "WL-18", "RAC-6"
  tatkalSeats: number;
  tatkalStatus: 'AVAILABLE' | 'RAC' | 'WL';
  tatkalStatusDetail: string;
}

export interface TrainScheduleStop {
  stationCode: string;
  stationName: string;
  arrivalTime: string;
  departureTime: string;
  dayCount: number; // 1 for first day, 2 for second day, etc.
  distanceKm: number;
}

export interface Train {
  trainNumber: string;
  trainName: string;
  trainType: 'VANDE_BHARAT' | 'RAJDHANI' | 'SHATABDI' | 'SUPERFAST' | 'EXPRESS';
  originStationCode: string;
  originStationName: string;
  destinationStationCode: string;
  destinationStationName: string;
  departureTime: string;
  arrivalTime: string;
  durationHours: string;
  runningDays: string[]; // ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
  classes: TravelClass[];
  availabilities: Record<string, TrainClassAvailability>;
  stops: TrainScheduleStop[];
}

export interface Passenger {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  berthPreference: BerthPreference;
  foodPreference: FoodPreference;
  seniorCitizen: boolean;
  groupTag?: string; // e.g., "Family", "Office", "Friends"
  idCardType?: string;
  idCardLast4?: string;
  createdAt: string;
}

export interface SavedJourney {
  id: string;
  trainNumber: string;
  trainName: string;
  fromStationCode: string;
  fromStationName: string;
  toStationCode: string;
  toStationName: string;
  journeyDate: string; // YYYY-MM-DD
  travelClass: TravelClass;
  quota: BookingQuota;
  passengerIds: string[];
  tatkalOpeningDate: string; // YYYY-MM-DD
  tatkalOpeningTime: string; // HH:mm:ss
  isAcClass: boolean;
  reminderEnabled: boolean;
  reminderMinutesBefore: number; // e.g. 15, 5, 1
  originDepartureOffsetDays: number; // 0 if boarding at origin, 1 if boarding day 2, etc.
  pnr?: string;
  notes?: string;
  createdAt: string;
}

export interface TatkalRuleConfig {
  acOpeningHour: number; // 10
  acOpeningMinute: number; // 0
  nonAcOpeningHour: number; // 11
  nonAcOpeningMinute: number; // 0
  advanceDays: number; // 1 (day prior to journey originating date)
  maxPassengersPerTatkal: number; // 4
  tatkalChargesMinSl: number; // 100
  tatkalChargesMaxSl: number; // 200
  tatkalChargesMin3a: number; // 300
  tatkalChargesMax3a: number; // 400
  tatkalChargesMin2a: number; // 400
  tatkalChargesMax2a: number; // 500
  seniorCitizenConcessionAllowed: boolean; // false
  cancellationRefundOnConfirmedTatkal: boolean; // false
  lastUpdated: string;
}

export interface PnrPassengerStatus {
  passengerNumber: number;
  bookingStatus: string; // e.g., "WL 24"
  currentStatus: string; // e.g., "CNF" or "RAC 4" or "WL 8"
  coach?: string; // "B3"
  berth?: number; // 24
  berthType?: string; // "LOWER"
}

export interface PnrRecord {
  pnr: string;
  trainNumber: string;
  trainName: string;
  fromStationCode: string;
  fromStationName: string;
  toStationCode: string;
  toStationName: string;
  journeyDate: string;
  travelClass: TravelClass;
  chartingStatus: 'CHART_NOT_PREPARED' | 'CHART_PREPARED';
  passengers: PnrPassengerStatus[];
  platform?: string;
  scheduledDeparture: string;
  scheduledArrival: string;
  delayMinutes: number;
  lastChecked: string;
  confirmationProbability?: number; // percentage
}

export interface AlertNotification {
  id: string;
  journeyId?: string;
  title: string;
  message: string;
  scheduledFor: string;
  type: 'TATKAL_COUNTDOWN' | 'DEPARTURE' | 'PNR_STATUS' | 'SYSTEM';
  status: 'PENDING' | 'TRIGGERED' | 'DISMISSED';
  createdAt: string;
}

export interface AdminStats {
  totalJourneys: number;
  totalPassengers: number;
  activeAlerts: number;
  searchesToday: number;
  systemUptimeSeconds: number;
  irctcServerStatus: 'NORMAL' | 'HIGH_LOAD' | 'MAINTENANCE';
  isLiveApiConfigured: boolean;
  dataSourceLabel: string;
}

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: 'ADMIN' | 'OPERATOR' | 'PASSENGER';
  status: 'ACTIVE' | 'SUSPENDED';
  preferredLanguage?: 'en' | 'hi';
  createdAt: string;
  lastLogin?: string;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'xlarge';
  hapticFeedback: boolean;
  soundAlerts: boolean;
}

export interface AlternativeDateOption {
  date: string; // YYYY-MM-DD
  dayName: string; // "Fri", "Sat", "Sun"
  dayNumber: number; // 24, 25
  monthShort: string; // "Oct"
  isTargetDate: boolean;
  tatkalOpensAt: string; // e.g. "Tomorrow 10:00 AM" or "Open Now" or "Closed"
  statusBadge: 'OPEN_NOW' | 'OPENS_SOON' | 'UPCOMING' | 'EXPIRED';
}

export interface PostBookingReminderConfig {
  pnr: string;
  journeyId?: string;
  trainNumber: string;
  trainName: string;
  journeyDate: string;
  departureTime: string;
  notifyChartPreparation: boolean; // 4 hours before
  notifyCancellationThreshold: boolean; // 24 hours before
  notifyBoardingCall: boolean; // 2 hours before
  createdAt: string;
}
