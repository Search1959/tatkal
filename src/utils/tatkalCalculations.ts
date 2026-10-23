import { TravelClass, BookingQuota, TatkalRuleConfig } from '../types';

export const DEFAULT_TATKAL_RULES: TatkalRuleConfig = {
  acOpeningHour: 10,
  acOpeningMinute: 0,
  nonAcOpeningHour: 11,
  nonAcOpeningMinute: 0,
  advanceDays: 1,
  maxPassengersPerTatkal: 4,
  tatkalChargesMinSl: 100,
  tatkalChargesMaxSl: 200,
  tatkalChargesMin3a: 300,
  tatkalChargesMax3a: 400,
  tatkalChargesMin2a: 400,
  tatkalChargesMax2a: 500,
  seniorCitizenConcessionAllowed: false,
  cancellationRefundOnConfirmedTatkal: false,
  lastUpdated: new Date().toISOString()
};

export function isAcClass(className: TravelClass): boolean {
  return ['1A', '2A', '3A', '3E', 'CC', 'EC'].includes(className);
}

export interface TatkalOpeningResult {
  originatingDate: string; // YYYY-MM-DD train departs from source
  tatkalDate: string; // YYYY-MM-DD when booking opens
  tatkalTime: string; // e.g. "10:00:00"
  tatkalDateTimeIso: string;
  isAc: boolean;
  totalAdvanceDaysFromBoarding: number;
  originOffsetDays: number;
  explanation: string;
}

/**
 * Calculates official Tatkal opening date and time.
 * @param journeyDateStr - Date when passenger boards (YYYY-MM-DD)
 * @param className - Travel class (e.g. '3A', 'SL')
 * @param originOffsetDays - If train departs origin station 1 day before boarding, offset is 1.
 * @param rules - Configurable rules
 */
export function calculateTatkalOpening(
  journeyDateStr: string,
  className: TravelClass,
  originOffsetDays: number = 0,
  rules: TatkalRuleConfig = DEFAULT_TATKAL_RULES
): TatkalOpeningResult {
  const [year, month, day] = journeyDateStr.split('-').map(Number);
  
  // Date when passenger boards
  const boardingDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));

  // Date when train departs its origin station: boardingDate minus originOffsetDays
  const originatingDateObj = new Date(boardingDate.getTime() - originOffsetDays * 86400000);
  
  // Tatkal opens exactly advanceDays (1 day) prior to train's originating departure date
  const tatkalDateObj = new Date(originatingDateObj.getTime() - rules.advanceDays * 86400000);

  const tYear = tatkalDateObj.getUTCFullYear();
  const tMonth = String(tatkalDateObj.getUTCMonth() + 1).padStart(2, '0');
  const tDay = String(tatkalDateObj.getUTCDate()).padStart(2, '0');
  const tatkalDateStr = `${tYear}-${tMonth}-${tDay}`;

  const oYear = originatingDateObj.getUTCFullYear();
  const oMonth = String(originatingDateObj.getUTCMonth() + 1).padStart(2, '0');
  const oDay = String(originatingDateObj.getUTCDate()).padStart(2, '0');
  const originatingDateStr = `${oYear}-${oMonth}-${oDay}`;

  const isAc = isAcClass(className);
  const hour = isAc ? rules.acOpeningHour : rules.nonAcOpeningHour;
  const minute = isAc ? rules.acOpeningMinute : rules.nonAcOpeningMinute;
  const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;

  // Construct ISO string in IST (+05:30)
  const tatkalDateTimeIso = `${tatkalDateStr}T${timeStr}+05:30`;

  const totalAdvanceDaysFromBoarding = rules.advanceDays + originOffsetDays;

  let explanation = '';
  if (originOffsetDays > 0) {
    explanation = `The train departs its source station on ${originatingDateStr} (${originOffsetDays} day before your boarding date ${journeyDateStr}). Therefore, Tatkal opens on ${tatkalDateStr} at ${timeStr.slice(0, 5)} IST.`;
  } else {
    explanation = `For your journey on ${journeyDateStr}, Tatkal opens 1 day prior on ${tatkalDateStr} at ${timeStr.slice(0, 5)} IST for ${className} class.`;
  }

  return {
    originatingDate: originatingDateStr,
    tatkalDate: tatkalDateStr,
    tatkalTime: timeStr,
    tatkalDateTimeIso,
    isAc,
    totalAdvanceDaysFromBoarding,
    originOffsetDays,
    explanation
  };
}

/**
 * Calculates current time difference to Tatkal opening in milliseconds.
 */
export function getTimeUntilTatkal(tatkalIsoString: string): number {
  const target = new Date(tatkalIsoString).getTime();
  const now = Date.now();
  return target - now;
}

export interface FormattedCountdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
  isOpenNow: boolean; // within 1 hour after opening
  formattedShort: string;
}

export function formatCountdown(diffMs: number): FormattedCountdown {
  if (diffMs <= 0) {
    const passedMs = Math.abs(diffMs);
    const isOpenNow = passedMs <= 3600000; // open within 1 hour
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isPast: true,
      isOpenNow,
      formattedShort: isOpenNow ? 'OPEN NOW' : 'CLOSED'
    };
  }

  const secondsTotal = Math.floor(diffMs / 1000);
  const days = Math.floor(secondsTotal / 86400);
  const hours = Math.floor((secondsTotal % 86400) / 3600);
  const minutes = Math.floor((secondsTotal % 3600) / 60);
  const seconds = secondsTotal % 60;

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0 || days > 0) parts.push(`${hours}h`);
  parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);

  return {
    days,
    hours,
    minutes,
    seconds,
    isPast: false,
    isOpenNow: false,
    formattedShort: parts.join(' ')
  };
}

/**
 * Calculates Tatkal fare surcharge as per official Indian Railway rules
 */
export function calculateTatkalFare(baseFare: number, className: TravelClass, quota: BookingQuota): number {
  if (quota === 'GN' || quota === 'LD' || quota === 'SS') {
    return baseFare;
  }

  // Official IRCTC Tatkal Surcharge rate:
  // Second Class (2S): 10% of base fare (Min ₹10, Max ₹15)
  // Sleeper (SL): 10% of base fare (Min ₹100, Max ₹200)
  // AC Chair Car (CC): 30% of base fare (Min ₹125, Max ₹225)
  // 3 AC / 3E: 30% of base fare (Min ₹300, Max ₹400)
  // 2 AC: 30% of base fare (Min ₹400, Max ₹500)
  // Executive Class (EC) / 1A: 30% of base fare (Min ₹400, Max ₹500)
  let percentage = 0.30;
  let minCharge = 300;
  let maxCharge = 400;

  switch (className) {
    case '2S':
      percentage = 0.10;
      minCharge = 10;
      maxCharge = 15;
      break;
    case 'SL':
      percentage = 0.10;
      minCharge = 100;
      maxCharge = 200;
      break;
    case 'CC':
      percentage = 0.30;
      minCharge = 125;
      maxCharge = 225;
      break;
    case '3A':
    case '3E':
      percentage = 0.30;
      minCharge = 300;
      maxCharge = 400;
      break;
    case '2A':
    case '1A':
    case 'EC':
      percentage = 0.30;
      minCharge = 400;
      maxCharge = 500;
      break;
  }

  let surcharge = Math.round(baseFare * percentage);
  if (surcharge < minCharge) surcharge = minCharge;
  if (surcharge > maxCharge) surcharge = maxCharge;

  // Premium Tatkal has dynamic multiplier based on occupancy
  if (quota === 'PT') {
    surcharge = Math.round(surcharge * 1.5);
  }

  return baseFare + surcharge;
}

/**
 * Format passenger list into 1-click clipboard bundle for rapid manual IRCTC input
 */
export function formatPassengerClipboardBundle(passengers: Array<{
  name: string;
  age: number;
  gender: string;
  berthPreference: string;
  foodPreference: string;
}>): string {
  if (passengers.length === 0) return '';
  
  return passengers.map((p, idx) => {
    return `${idx + 1}. ${p.name.toUpperCase()} | Age: ${p.age} | ${p.gender === 'M' ? 'Male' : p.gender === 'F' ? 'Female' : 'Transgender'} | Berth: ${p.berthPreference} | Food: ${p.foodPreference}`;
  }).join('\n');
}

/**
 * Metropolitan station cluster clusters for alternative train planning
 */
export const METRO_STATION_CLUSTERS: Record<string, { city: string; stations: string[] }> = {
  NDLS: { city: 'Delhi NCR', stations: ['NDLS', 'NZM', 'DLI', 'ANVT', 'DEC'] },
  NZM: { city: 'Delhi NCR', stations: ['NDLS', 'NZM', 'DLI', 'ANVT', 'DEC'] },
  DLI: { city: 'Delhi NCR', stations: ['NDLS', 'NZM', 'DLI', 'ANVT', 'DEC'] },
  ANVT: { city: 'Delhi NCR', stations: ['NDLS', 'NZM', 'DLI', 'ANVT', 'DEC'] },
  MMCT: { city: 'Mumbai MMR', stations: ['MMCT', 'BDTS', 'CSMT', 'LTT', 'DR', 'KYN'] },
  CSMT: { city: 'Mumbai MMR', stations: ['MMCT', 'BDTS', 'CSMT', 'LTT', 'DR', 'KYN'] },
  BDTS: { city: 'Mumbai MMR', stations: ['MMCT', 'BDTS', 'CSMT', 'LTT', 'DR', 'KYN'] },
  HWH: { city: 'Kolkata Hub', stations: ['HWH', 'SDAH', 'KOAA', 'SHM'] },
  SDAH: { city: 'Kolkata Hub', stations: ['HWH', 'SDAH', 'KOAA', 'SHM'] },
  MAS: { city: 'Chennai Hub', stations: ['MAS', 'MS', 'TBM'] },
  MS: { city: 'Chennai Hub', stations: ['MAS', 'MS', 'TBM'] },
  SBC: { city: 'Bengaluru Hub', stations: ['SBC', 'YPR', 'SMVB', 'BNC'] },
  YPR: { city: 'Bengaluru Hub', stations: ['SBC', 'YPR', 'SMVB', 'BNC'] }
};

export function getNearbyStationCodes(code: string): string[] {
  const cluster = METRO_STATION_CLUSTERS[code.toUpperCase()];
  if (!cluster) return [code.toUpperCase()];
  return cluster.stations;
}

/**
 * Generate 5-day alternative date planning hopper around target journey date
 */
export function calculateAlternativeDates(
  targetDateStr: string,
  className: TravelClass = '3A',
  rules: TatkalRuleConfig = DEFAULT_TATKAL_RULES
) {
  const [year, month, day] = targetDateStr.split('-').map(Number);
  const targetDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const options = [];
  
  // -2, -1, 0, +1, +2 days
  for (let offset = -2; offset <= 2; offset++) {
    const curDate = new Date(targetDate.getTime() + offset * 86400000);
    const y = curDate.getUTCFullYear();
    const m = String(curDate.getUTCMonth() + 1).padStart(2, '0');
    const d = String(curDate.getUTCDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;
    
    // Calculate opening for this date
    const opening = calculateTatkalOpening(dateStr, className, 0, rules);
    const diffMs = getTimeUntilTatkal(opening.tatkalDateTimeIso);
    
    let statusBadge: 'OPEN_NOW' | 'OPENS_SOON' | 'UPCOMING' | 'EXPIRED' = 'UPCOMING';
    let tatkalOpensAt = `Opens ${opening.tatkalDate} ${opening.tatkalTime.slice(0, 5)} IST`;
    
    if (diffMs <= 0 && Math.abs(diffMs) <= 3600000) {
      statusBadge = 'OPEN_NOW';
      tatkalOpensAt = 'Tatkal Window Open Now';
    } else if (diffMs < 0) {
      statusBadge = 'EXPIRED';
      tatkalOpensAt = 'Tatkal Window Passed';
    } else if (diffMs < 86400000) {
      statusBadge = 'OPENS_SOON';
      tatkalOpensAt = `Opens in ${Math.round(diffMs / 3600000)}h (${opening.tatkalTime.slice(0, 5)} IST)`;
    }
    
    options.push({
      date: dateStr,
      dayName: daysOfWeek[curDate.getUTCDay()],
      dayNumber: curDate.getUTCDate(),
      monthShort: months[curDate.getUTCMonth()],
      isTargetDate: offset === 0,
      tatkalOpensAt,
      statusBadge
    });
  }
  
  return options;
}

/**
 * Triggers safe mobile haptic vibration if supported by device
 */
export function triggerHapticFeedback(pattern: number | number[] = 50) {
  if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Haptics not allowed or denied
    }
  }
}

/**
 * Post-Booking Journey Milestones & Alerts Calculator
 */
export function generatePostBookingMilestones(journeyDate: string, departureTime: string) {
  // Estimated ISO timestamp of train departure
  const depIso = `${journeyDate}T${departureTime}:00+05:30`;
  const depTime = new Date(depIso).getTime();
  
  return [
    {
      type: 'CANCELLATION_DEADLINE',
      title: '24-Hour Refund Threshold',
      description: 'Free/low-fee ticket cancellation window expires 24 hours before train departure. After this, 25% to 50% cancellation deduction applies.',
      triggerTimeIso: new Date(depTime - 24 * 3600000).toISOString(),
      hoursBefore: 24,
      importance: 'HIGH'
    },
    {
      type: 'CHART_PREPARATION',
      title: 'First Charting & Berth Allotment',
      description: 'Indian Railways PRS finalizes first reservation chart approx 4 hours before originating station departure. RAC/WL berths will be confirmed or refunded.',
      triggerTimeIso: new Date(depTime - 4 * 3600000).toISOString(),
      hoursBefore: 4,
      importance: 'CRITICAL'
    },
    {
      type: 'BOARDING_CALL',
      title: 'Station Arrival & Platform Standby',
      description: 'Reach boarding platform 60 to 90 minutes early with ID proof (Aadhaar / Voter ID / Passport) and confirmed IRCTC e-Ticket.',
      triggerTimeIso: new Date(depTime - 2 * 3600000).toISOString(),
      hoursBefore: 2,
      importance: 'MEDIUM'
    }
  ];
}
