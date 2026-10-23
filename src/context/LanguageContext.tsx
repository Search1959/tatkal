import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi';

interface Translations {
  appName: string;
  appTagline: string;
  disclaimerBanner: string;
  home: string;
  findTrains: string;
  tatkalPlanner: string;
  myJourneys: string;
  passengerProfiles: string;
  pnrStatus: string;
  alerts: string;
  admin: string;
  searchTrainsTitle: string;
  fromStation: string;
  toStation: string;
  journeyDate: string;
  travelClass: string;
  quota: string;
  searchButton: string;
  tatkalCountdown: string;
  openingAt: string;
  originRuleNotice: string;
  checklistTitle: string;
  masterListReady: string;
  fastCopyDetails: string;
  irctcLoginPrompt: string;
  paymentPrepared: string;
  proceedToIrctc: string;
  demoNotice: string;
  acOpening10am: string;
  nonAcOpening11am: string;
  saveJourney: string;
  addPassenger: string;
  copyAllPassengers: string;
  copiedSuccess: string;
  pnrLookupTitle: string;
  enterPnr: string;
  checkStatus: string;
  chartPrepared: string;
  chartNotPrepared: string;
}

const en: Translations = {
  appName: 'Tatkal Assist',
  appTagline: 'Smart preparation · Faster decisions · Safer booking',
  disclaimerBanner: 'Official Railway Companion: Tatkal Assist prepares your booking details & countdown timers. Actual booking & payments happen strictly on the authorized IRCTC portal. We never ask for passwords or OTPs.',
  home: 'Dashboard',
  findTrains: 'Find Trains',
  tatkalPlanner: 'Tatkal Planner',
  myJourneys: 'My Journeys',
  passengerProfiles: 'Passenger Profiles',
  pnrStatus: 'PNR Tracker',
  alerts: 'Alerts',
  admin: 'Admin & Rules',
  searchTrainsTitle: 'Find Trains & Check Tatkal Timing',
  fromStation: 'From Station',
  toStation: 'To Station',
  journeyDate: 'Journey Date',
  travelClass: 'Travel Class',
  quota: 'Quota',
  searchButton: 'Search Trains',
  tatkalCountdown: 'Tatkal Window Countdown',
  openingAt: 'Opens At',
  originRuleNotice: 'Originating Station Rule',
  checklistTitle: 'Pre-Booking Readiness Checklist',
  masterListReady: 'Add passengers to IRCTC Master List in advance',
  fastCopyDetails: '1-Click copy passenger details for rapid form filling',
  irctcLoginPrompt: 'Log in to IRCTC 3 minutes before opening (9:57 AM / 10:57 AM)',
  paymentPrepared: 'Keep UPI App (GPay/PhonePe/Paytm) open for 10-second approval',
  proceedToIrctc: 'Proceed to Official IRCTC Booking',
  demoNotice: 'Simulated Data: Operating in prototype mode with authentic Indian Railways timetables.',
  acOpening10am: 'AC Tatkal opens at 10:00 AM IST (1 day prior to origin departure)',
  nonAcOpening11am: 'Sleeper Tatkal opens at 11:00 AM IST (1 day prior to origin departure)',
  saveJourney: 'Save Journey',
  addPassenger: 'Add Passenger',
  copyAllPassengers: 'Copy All Passenger Info',
  copiedSuccess: 'Copied to clipboard!',
  pnrLookupTitle: 'Check 10-Digit PNR Status',
  enterPnr: 'Enter 10-digit PNR Number',
  checkStatus: 'Check PNR Status',
  chartPrepared: 'Chart Prepared',
  chartNotPrepared: 'Chart Not Prepared'
};

const hi: Translations = {
  appName: 'तत्काल असिस्ट',
  appTagline: 'स्मार्ट तैयारी · त्वरित निर्णय · सुरक्षित बुकिंग',
  disclaimerBanner: 'आधिकारिक रेलवे साथी: तत्काल असिस्ट आपकी बुकिंग तैयारी, टाइमर और यात्री विवरण में मदद करता है। वास्तविक टिकट बुकिंग अधिकृत आईआरसीटीसी (IRCTC) पोर्टल पर ही होती है। हम कभी पासवर्ड या ओटीपी नहीं मांगते।',
  home: 'डैशबोर्ड',
  findTrains: 'ट्रेन खोजें',
  tatkalPlanner: 'तत्काल योजना',
  myJourneys: 'मेरी यात्राएं',
  passengerProfiles: 'यात्री प्रोफाइल',
  pnrStatus: 'पीएनआर स्थिति',
  alerts: 'अलर्ट व रिमाइंडर',
  admin: 'एडमिन व नियम',
  searchTrainsTitle: 'ट्रेन खोजें एवं तत्काल समय देखें',
  fromStation: 'प्रस्थान स्टेशन (From)',
  toStation: 'गंतव्य स्टेशन (To)',
  journeyDate: 'यात्रा तिथि',
  travelClass: 'यात्रा श्रेणी',
  quota: 'कोटा',
  searchButton: 'ट्रेन खोजें',
  tatkalCountdown: 'तत्काल विंडो उलटी गिनती',
  openingAt: 'खुलने का समय',
  originRuleNotice: 'प्रारंभिक स्टेशन नियम',
  checklistTitle: 'बुकिंग पूर्व तैयारी चेकलिस्ट',
  masterListReady: 'आईआरसीटीसी मास्टर लिस्ट में पहले से यात्री जोड़ें',
  fastCopyDetails: 'फास्ट फॉर्म भरने के लिए 1-क्लिक कॉपी विकल्प',
  irctcLoginPrompt: 'खुलने से 3 मिनट पहले आईआरसीटीसी पर लॉगिन करें (सुबह 9:57 / 10:57)',
  paymentPrepared: '10 सेकंड में भुगतान के लिए यूपीआई (UPI) ऐप तैयार रखें',
  proceedToIrctc: 'आधिकारिक IRCTC बुकिंग पर जाएं',
  demoNotice: 'सिम्युलेटेड डेटा: वास्तविक भारतीय रेलवे समय-सारणी के साथ प्रोटोटाइप मोड सक्रिय।',
  acOpening10am: 'एसी तत्काल सुबह 10:00 बजे IST पर खुलता है',
  nonAcOpening11am: 'स्लीपर तत्काल सुबह 11:00 बजे IST पर खुलता है',
  saveJourney: 'यात्रा सुरक्षित करें',
  addPassenger: 'नया यात्री जोड़ें',
  copyAllPassengers: 'सभी यात्रियों की जानकारी कॉपी करें',
  copiedSuccess: 'क्लिपबोर्ड पर कॉपी हो गया!',
  pnrLookupTitle: '10-अंकीय PNR स्थिति देखें',
  enterPnr: '10-अंकों का PNR नंबर दर्ज करें',
  checkStatus: 'स्थिति जांचें',
  chartPrepared: 'चार्ट तैयार है',
  chartNotPrepared: 'चार्ट अभी तैयार नहीं है'
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: en
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('tatkal_assist_lang') as Language;
    if (saved === 'en' || saved === 'hi') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('tatkal_assist_lang', lang);
  };

  const t = language === 'hi' ? hi : en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
