/**
 * Unit tests for Tatkal calculations and business rules.
 */
import { 
  calculateTatkalOpening, 
  calculateTatkalFare, 
  isAcClass, 
  formatPassengerClipboardBundle, 
  DEFAULT_TATKAL_RULES,
  calculateAlternativeDates,
  getNearbyStationCodes,
  generatePostBookingMilestones
} from './tatkalCalculations';

export function runTatkalCalculationTests(): { name: string; passed: boolean; message?: string }[] {
  const results: { name: string; passed: boolean; message?: string }[] = [];

  // Test 1: AC Opening Time is 10:00:00
  try {
    const acResult = calculateTatkalOpening('2026-10-25', '3A', 0, DEFAULT_TATKAL_RULES);
    const pass = acResult.tatkalTime === '10:00:00' && acResult.tatkalDate === '2026-10-24';
    results.push({
      name: 'AC Tatkal opens at 10:00 AM exactly 1 day prior',
      passed: pass,
      message: pass ? undefined : `Expected 2026-10-24 at 10:00:00, got ${acResult.tatkalDate} at ${acResult.tatkalTime}`
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    results.push({ name: 'AC Tatkal opens at 10:00 AM exactly 1 day prior', passed: false, message: msg });
  }

  // Test 2: Non-AC (Sleeper) Opening Time is 11:00:00
  try {
    const nonAcResult = calculateTatkalOpening('2026-10-25', 'SL', 0, DEFAULT_TATKAL_RULES);
    const pass = nonAcResult.tatkalTime === '11:00:00' && nonAcResult.tatkalDate === '2026-10-24';
    results.push({
      name: 'Non-AC Tatkal opens at 11:00 AM exactly 1 day prior',
      passed: pass,
      message: pass ? undefined : `Expected 2026-10-24 at 11:00:00, got ${nonAcResult.tatkalDate} at ${nonAcResult.tatkalTime}`
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    results.push({ name: 'Non-AC Tatkal opens at 11:00 AM exactly 1 day prior', passed: false, message: msg });
  }

  // Test 3: Origin Station Day Offset Rule (Train departs origin station 1 day earlier)
  try {
    // Boarding Oct 25, train started Oct 24 (offset 1 day) -> Tatkal opens Oct 23!
    const offsetResult = calculateTatkalOpening('2026-10-25', '3A', 1, DEFAULT_TATKAL_RULES);
    const pass = offsetResult.tatkalDate === '2026-10-23' && offsetResult.tatkalTime === '10:00:00';
    results.push({
      name: 'Origin Station Offset shifts Tatkal opening earlier',
      passed: pass,
      message: pass ? undefined : `Expected 2026-10-23, got ${offsetResult.tatkalDate}`
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    results.push({ name: 'Origin Station Offset shifts Tatkal opening earlier', passed: false, message: msg });
  }

  // Test 4: Tatkal Surcharge Caps for Sleeper (SL Min ₹100, Max ₹200)
  try {
    const slFareBase500 = calculateTatkalFare(500, 'SL', 'TQ'); // 10% is 50, but min is 100 -> 500 + 100 = 600
    const slFareBase3000 = calculateTatkalFare(3000, 'SL', 'TQ'); // 10% is 300, but max is 200 -> 3000 + 200 = 3200
    const pass = slFareBase500 === 600 && slFareBase3000 === 3200;
    results.push({
      name: 'Sleeper Tatkal fare respects Min ₹100 and Max ₹200 cap',
      passed: pass,
      message: pass ? undefined : `Got ${slFareBase500} and ${slFareBase3000}`
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    results.push({ name: 'Sleeper Tatkal fare respects Min ₹100 and Max ₹200 cap', passed: false, message: msg });
  }

  // Test 5: Passenger Clipboard Formatter
  try {
    const formatted = formatPassengerClipboardBundle([
      { name: 'Amit Kumar', age: 30, gender: 'M', berthPreference: 'LOWER', foodPreference: 'V' }
    ]);
    const pass = formatted.includes('AMIT KUMAR') && formatted.includes('Age: 30');
    results.push({
      name: 'Passenger clipboard bundle generates valid uppercase text',
      passed: pass
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    results.push({ name: 'Passenger clipboard bundle generates valid uppercase text', passed: false, message: msg });
  }

  // Test 6: 3A Tatkal Surcharge (30%, Min ₹300, Max ₹400)
  try {
    const fare800 = calculateTatkalFare(800, '3A', 'TQ'); // 30% of 800 is 240, but min is 300 -> 800 + 300 = 1100
    const fare2000 = calculateTatkalFare(2000, '3A', 'TQ'); // 30% of 2000 is 600, but max is 400 -> 2000 + 400 = 2400
    const pass = fare800 === 1100 && fare2000 === 2400;
    results.push({
      name: '3A Tatkal surcharge respects 30% with Min ₹300 and Max ₹400 cap',
      passed: pass,
      message: pass ? undefined : `Got fare800=${fare800}, fare2000=${fare2000}`
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    results.push({ name: '3A Tatkal surcharge respects 30% with Min ₹300 and Max ₹400 cap', passed: false, message: msg });
  }

  // Test 7: Alternative Date Range Generator
  try {
    const alts = calculateAlternativeDates('2026-10-25', '3A', DEFAULT_TATKAL_RULES);
    const pass = alts.length === 5 && alts[2].isTargetDate && alts[2].date === '2026-10-25';
    results.push({
      name: 'Alternative dates generator outputs 5 contiguous days with target date centered',
      passed: pass
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    results.push({ name: 'Alternative dates generator outputs 5 contiguous days with target date centered', passed: false, message: msg });
  }

  // Test 8: Metro Station Cluster Hubs
  try {
    const ndlsAlts = getNearbyStationCodes('NDLS');
    const pass = ndlsAlts.includes('NZM') && ndlsAlts.includes('DLI') && ndlsAlts.includes('ANVT');
    results.push({
      name: 'Metro cluster resolver maps New Delhi to NZM, DLI and ANVT alternatives',
      passed: pass
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    results.push({ name: 'Metro cluster resolver maps New Delhi to NZM, DLI and ANVT alternatives', passed: false, message: msg });
  }

  // Test 9: Post-Booking Milestones Generator
  try {
    const milestones = generatePostBookingMilestones('2026-10-30', '16:55');
    const pass = milestones.length === 3 && milestones.some(m => m.type === 'CHART_PREPARATION');
    results.push({
      name: 'Post-booking milestone generator creates Charting, Cancellation & Boarding alerts',
      passed: pass
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    results.push({ name: 'Post-booking milestone generator creates Charting, Cancellation & Boarding alerts', passed: false, message: msg });
  }

  return results;
}
