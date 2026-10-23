/**
 * Unit tests for Tatkal calculations and business rules.
 */
import { 
  calculateTatkalOpening, 
  calculateTatkalFare, 
  isAcClass, 
  formatPassengerClipboardBundle, 
  DEFAULT_TATKAL_RULES 
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

  return results;
}
