import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HomeDashboard } from './components/HomeDashboard';
import { TrainSearch } from './components/TrainSearch';
import { TatkalPlanner } from './components/TatkalPlanner';
import { PassengerProfiles } from './components/PassengerProfiles';
import { MyJourneys } from './components/MyJourneys';
import { PnrTracker } from './components/PnrTracker';
import { AlertsManager } from './components/AlertsManager';
import { AdminDashboard } from './components/AdminDashboard';
import { BookingHandoffModal } from './components/BookingHandoffModal';
import { DeviceSyncModal } from './components/DeviceSyncModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { Lock } from 'lucide-react';

import { 
  Station, 
  Train, 
  Passenger, 
  SavedJourney, 
  AlertNotification, 
  AdminStats, 
  TatkalRuleConfig,
  TravelClass,
  BookingQuota
} from './types';
import { api } from './services/api';
import { DEFAULT_TATKAL_RULES } from './utils/tatkalCalculations';
import { INDIAN_STATIONS } from './data/mockStations';
import { INDIAN_TRAINS } from './data/mockTrains';
import { 
  initAuthSession, 
  testFirestoreConnection,
  subscribeCloudPassengers,
  saveCloudPassenger,
  deleteCloudPassenger,
  subscribeCloudJourneys,
  saveCloudJourney,
  deleteCloudJourney,
  subscribeCloudAlerts,
  saveCloudAlert,
  dismissCloudAlert
} from './services/firebase';

function AppContent() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return typeof window !== 'undefined' && sessionStorage.getItem('tatkal_is_admin') === 'true';
  });
  const [adminEmail, setAdminEmail] = useState<string>('admin@tatkalassist.rail.in');
  const [adminLoginOpen, setAdminLoginOpen] = useState<boolean>(false);

  // Cloud Synchronization States
  const [cloudUserId, setCloudUserId] = useState<string>(() => {
    return localStorage.getItem('tatkal_cloud_sync_id') || '';
  });
  const [isCloudOnline, setIsCloudOnline] = useState<boolean>(true);
  const [syncModalOpen, setSyncModalOpen] = useState<boolean>(false);

  // Application Data States - Instant initial data guarantees zero blank dropdowns on Vercel
  const [stations, setStations] = useState<Station[]>(INDIAN_STATIONS);
  const [trains, setTrains] = useState<Train[]>(INDIAN_TRAINS);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [savedJourneys, setSavedJourneys] = useState<SavedJourney[]>([]);
  const [alerts, setAlerts] = useState<AlertNotification[]>([]);
  const [rules, setRules] = useState<TatkalRuleConfig>(DEFAULT_TATKAL_RULES);
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalJourneys: 0,
    totalPassengers: 0,
    activeAlerts: 0,
    searchesToday: 0,
    systemUptimeSeconds: 0,
    irctcServerStatus: 'NORMAL',
    isLiveApiConfigured: true,
    dataSourceLabel: 'Cloud Firestore Real-Time Database'
  });

  // Handoff Modal State
  const [handoffOpen, setHandoffOpen] = useState(false);
  const [handoffTrain, setHandoffTrain] = useState<{
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
  } | undefined>(undefined);

  // Planner Preset
  const [plannerPresetDate, setPlannerPresetDate] = useState<string | undefined>(undefined);
  const [plannerPresetClass, setPlannerPresetClass] = useState<TravelClass | undefined>(undefined);

  // Initialize Firebase Auth & Test Firestore Connection
  useEffect(() => {
    testFirestoreConnection().then(connected => {
      setIsCloudOnline(connected);
    });

    const unsubscribeAuth = initAuthSession((user) => {
      if (user) {
        const storedSyncId = localStorage.getItem('tatkal_cloud_sync_id');
        const activeId = storedSyncId || user.uid;
        setCloudUserId(activeId);
        if (!storedSyncId) {
          localStorage.setItem('tatkal_cloud_sync_id', activeId);
        }
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Subscribe to Cloud Firestore real-time collections when cloudUserId is active
  useEffect(() => {
    if (!cloudUserId) return;

    const unsubPassengers = subscribeCloudPassengers(cloudUserId, (cloudList) => {
      if (cloudList && cloudList.length > 0) {
        setPassengers(cloudList);
      }
    });

    const unsubJourneys = subscribeCloudJourneys(cloudUserId, (cloudJourneys) => {
      if (cloudJourneys && cloudJourneys.length > 0) {
        setSavedJourneys(cloudJourneys);
      }
    });

    const unsubAlerts = subscribeCloudAlerts(cloudUserId, (cloudAlerts) => {
      if (cloudAlerts && cloudAlerts.length > 0) {
        setAlerts(cloudAlerts);
      }
    });

    return () => {
      unsubPassengers();
      unsubJourneys();
      unsubAlerts();
    };
  }, [cloudUserId]);

  // Initial Load from API / Storage fallback
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [stns, psngrs, jrneys, alrts, rls, stts] = await Promise.all([
          api.getStations(),
          api.getPassengers(),
          api.getJourneys(),
          api.getAlerts(),
          api.getTatkalRules(),
          api.getAdminStats()
        ]);

        setStations(stns);
        setPassengers(prev => prev.length > 0 ? prev : psngrs);
        setSavedJourneys(prev => prev.length > 0 ? prev : jrneys);
        setAlerts(prev => prev.length > 0 ? prev : alrts);
        if (rls) setRules(rls);
        if (stts) {
          setAdminStats({
            ...stts,
            isLiveApiConfigured: true,
            dataSourceLabel: 'Cloud Firestore Real-Time Database'
          });
        }

        // Pre-fetch default popular train search (Delhi - Mumbai)
        const trainRes = await api.searchTrains({ from: 'NDLS', to: 'MMCT' });
        setTrains(trainRes.trains);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      }
    }

    loadInitialData();
  }, []);

  // Search handler
  const handleTrainSearch = async (params: {
    from: string;
    to: string;
    date?: string;
    class?: string;
    quota?: string;
  }) => {
    try {
      const res = await api.searchTrains(params);
      setTrains(res.trains);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  // Passenger CRUD
  const handleAddPassenger = async (data: Omit<Passenger, 'id' | 'createdAt'>) => {
    try {
      const newPassenger = await api.addPassenger(data);
      setPassengers(prev => [...prev, newPassenger]);
      if (cloudUserId) {
        saveCloudPassenger(cloudUserId, newPassenger).catch(e => console.warn('Cloud passenger save:', e));
      }
    } catch (err) {
      console.error('Failed to add passenger:', err);
    }
  };

  const handleDeletePassenger = async (id: string) => {
    try {
      await api.deletePassenger(id);
      setPassengers(prev => prev.filter(p => p.id !== id));
      if (cloudUserId) {
        deleteCloudPassenger(cloudUserId, id).catch(e => console.warn('Cloud passenger delete:', e));
      }
    } catch (err) {
      console.error('Failed to delete passenger:', err);
    }
  };

  const handleUpdatePassenger = (id: string, updated: Partial<Passenger>) => {
    setPassengers(prev => prev.map(p => {
      if (p.id === id) {
        const merged = { ...p, ...updated };
        if (cloudUserId) {
          saveCloudPassenger(cloudUserId, merged).catch(e => console.warn('Cloud update:', e));
        }
        return merged;
      }
      return p;
    }));
  };

  // Journey CRUD
  const handleSaveJourney = async (journeyData: Partial<SavedJourney>) => {
    try {
      const saved = await api.saveJourney(journeyData);
      setSavedJourneys(prev => [saved, ...prev]);
      if (cloudUserId) {
        saveCloudJourney(cloudUserId, saved).catch(e => console.warn('Cloud journey save:', e));
      }
      // refresh alerts
      const updatedAlerts = await api.getAlerts();
      setAlerts(updatedAlerts);
    } catch (err) {
      console.error('Failed to save journey:', err);
    }
  };

  const handleUpdateJourney = (id: string, updated: Partial<SavedJourney>) => {
    setSavedJourneys(prev => prev.map(j => {
      if (j.id === id) {
        const merged = { ...j, ...updated };
        if (cloudUserId) {
          saveCloudJourney(cloudUserId, merged).catch(e => console.warn('Cloud journey update:', e));
        }
        return merged;
      }
      return j;
    }));
  };

  const handleDeleteJourney = async (id: string) => {
    try {
      await api.deleteJourney(id);
      setSavedJourneys(prev => prev.filter(j => j.id !== id));
      if (cloudUserId) {
        deleteCloudJourney(cloudUserId, id).catch(e => console.warn('Cloud journey delete:', e));
      }
    } catch (err) {
      console.error('Failed to delete journey:', err);
    }
  };

  // Dismiss alert
  const handleDismissAlert = async (id: string) => {
    try {
      await api.dismissAlert(id);
      setAlerts(prev => prev.filter(a => a.id !== id));
      if (cloudUserId) {
        dismissCloudAlert(cloudUserId, id).catch(e => console.warn('Cloud alert dismiss:', e));
      }
    } catch (err) {
      console.error('Failed to dismiss alert:', err);
    }
  };

  // Update admin rules
  const handleUpdateRules = async (newRules: Partial<TatkalRuleConfig>) => {
    try {
      const updated = await api.updateAdminRules(newRules);
      setRules(updated);
    } catch (err) {
      console.error('Failed to update rules:', err);
    }
  };

  // Direct Handoff triggers
  const handleOpenHandoffFromTrain = (trainInfo: {
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
  }) => {
    setHandoffTrain(trainInfo);
    setHandoffOpen(true);
  };

  const handleOpenHandoffFromJourney = (journey: SavedJourney) => {
    setHandoffTrain({
      trainNumber: journey.trainNumber,
      trainName: journey.trainName,
      fromStationCode: journey.fromStationCode,
      fromStationName: journey.fromStationName,
      toStationCode: journey.toStationCode,
      toStationName: journey.toStationName,
      journeyDate: journey.journeyDate,
      travelClass: journey.travelClass,
      quota: journey.quota
    });
    setHandoffOpen(true);
  };

  const handlePlanTatkal = (train: Train, date: string, travelClass: TravelClass) => {
    setPlannerPresetDate(date);
    setPlannerPresetClass(travelClass);
    setActiveTab('planner');
  };

  const handleQuickSearch = (from: string, to: string, date: string) => {
    handleTrainSearch({ from, to, date });
    setActiveTab('search');
  };

  const pendingAlertsCount = alerts.filter(a => a.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-amber-300 selection:text-slate-950">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingAlertsCount={pendingAlertsCount}
        onOpenSyncModal={() => setSyncModalOpen(true)}
        isCloudConnected={isCloudOnline}
        isAdmin={isAdminAuthenticated}
        onOpenAdminLogin={() => setAdminLoginOpen(true)}
        onAdminLogout={() => {
          setIsAdminAuthenticated(false);
          sessionStorage.removeItem('tatkal_is_admin');
          if (activeTab === 'admin') setActiveTab('dashboard');
        }}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
        {activeTab === 'dashboard' && (
          <HomeDashboard
            savedJourneys={savedJourneys}
            passengers={passengers}
            stations={stations}
            onNavigate={setActiveTab}
            onOpenHandoff={handleOpenHandoffFromJourney}
            onQuickSearch={handleQuickSearch}
          />
        )}

        {activeTab === 'search' && (
          <TrainSearch
            stations={stations}
            trains={trains}
            onSearch={handleTrainSearch}
            onSaveJourney={handleSaveJourney}
            onOpenHandoff={handleOpenHandoffFromTrain}
            onPlanTatkal={handlePlanTatkal}
          />
        )}

        {activeTab === 'planner' && (
          <TatkalPlanner
            initialJourneyDate={plannerPresetDate}
            initialClass={plannerPresetClass}
            rules={rules}
            onOpenHandoff={handleOpenHandoffFromTrain}
          />
        )}

        {activeTab === 'journeys' && (
          <MyJourneys
            journeys={savedJourneys}
            onDeleteJourney={handleDeleteJourney}
            onUpdateJourney={handleUpdateJourney}
            onOpenHandoff={handleOpenHandoffFromJourney}
            onNavigateToSearch={() => setActiveTab('search')}
          />
        )}

        {activeTab === 'passengers' && (
          <PassengerProfiles
            passengers={passengers}
            onAddPassenger={handleAddPassenger}
            onUpdatePassenger={handleUpdatePassenger}
            onDeletePassenger={handleDeletePassenger}
          />
        )}

        {activeTab === 'pnr' && (
          <PnrTracker />
        )}

        {activeTab === 'alerts' && (
          <AlertsManager
            alerts={alerts}
            onDismissAlert={handleDismissAlert}
          />
        )}

        {activeTab === 'admin' && (
          isAdminAuthenticated ? (
            <AdminDashboard
              stats={adminStats}
              rules={rules}
              onUpdateRules={handleUpdateRules}
              adminEmail={adminEmail}
              onLogoutAdmin={() => {
                setIsAdminAuthenticated(false);
                sessionStorage.removeItem('tatkal_is_admin');
                setActiveTab('dashboard');
              }}
            />
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center max-w-md mx-auto space-y-4 my-8">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto text-red-700">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Administrator Access Required</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  The Admin Console and Railway Rules configuration are restricted to authorized personnel.
                </p>
              </div>
              <button
                onClick={() => setAdminLoginOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#0F284E] hover:bg-[#163B6E] text-white font-bold text-xs shadow-md transition-colors"
              >
                Sign In to Admin Portal
              </button>
            </div>
          )
        )}
      </main>

      {/* Official Booking Handoff Modal */}
      <BookingHandoffModal
        isOpen={handoffOpen}
        onClose={() => setHandoffOpen(false)}
        trainDetails={handoffTrain}
        passengers={passengers}
        onSavePnr={(pnr) => {
          if (handoffTrain) {
            handleSaveJourney({
              ...handoffTrain,
              travelClass: handoffTrain.travelClass as TravelClass,
              quota: handoffTrain.quota as BookingQuota,
              pnr,
              originDepartureOffsetDays: 0
            });
          }
        }}
      />

      {/* Cloud Device Sync Modal */}
      <DeviceSyncModal
        isOpen={syncModalOpen}
        onClose={() => setSyncModalOpen(false)}
        syncId={cloudUserId}
        isOnline={isCloudOnline}
        onSwitchSyncId={(newId) => {
          setCloudUserId(newId);
          localStorage.setItem('tatkal_cloud_sync_id', newId);
        }}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={adminLoginOpen}
        onClose={() => setAdminLoginOpen(false)}
        onLoginSuccess={(email) => {
          setIsAdminAuthenticated(true);
          setAdminEmail(email);
          sessionStorage.setItem('tatkal_is_admin', 'true');
          setActiveTab('admin');
        }}
      />

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
