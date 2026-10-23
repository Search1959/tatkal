import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { appStorage } from './src/server/storage';
import { calculateTatkalOpening } from './src/utils/tatkalCalculations';
import { TravelClass } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // Request logger for audit
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      if (req.path.startsWith('/api')) {
        console.log(`[API] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
      }
    });
    next();
  });

  // Healthcheck
  app.get('/api/v1/health', (_req: Request, res: Response) => {
    res.json({
      status: 'UP',
      service: 'Tatkal Assist API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      irctcStatus: 'NORMAL',
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // Stations lookup
  app.get('/api/v1/stations', (req: Request, res: Response) => {
    const query = typeof req.query.q === 'string' ? req.query.q : undefined;
    const stations = appStorage.getStations(query);
    res.json({ success: true, count: stations.length, data: stations });
  });

  // Train search
  app.get('/api/v1/trains/search', (req: Request, res: Response) => {
    const { from, to, date, class: travelClass, quota } = req.query;
    if (!from || !to) {
      return res.status(400).json({ success: false, error: 'Both "from" and "to" station codes are required.' });
    }
    const trains = appStorage.searchTrains(
      String(from),
      String(to),
      date ? String(date) : undefined,
      travelClass ? String(travelClass) : undefined,
      quota ? String(quota) : undefined
    );

    res.json({
      success: true,
      query: { from, to, date, travelClass, quota },
      count: trains.length,
      data: trains,
      isSimulated: true,
      notice: 'Operating with authentic railway schedules. Official booking occurs directly on IRCTC.'
    });
  });

  // Tatkal Rules
  app.get('/api/v1/tatkal/rules', (_req: Request, res: Response) => {
    const rules = appStorage.getTatkalRules();
    res.json({ success: true, data: rules });
  });

  // Tatkal Opening Calculator
  app.post('/api/v1/tatkal/calculate', (req: Request, res: Response) => {
    const { journeyDate, travelClass, originOffsetDays } = req.body;
    if (!journeyDate || !travelClass) {
      return res.status(400).json({ success: false, error: 'journeyDate and travelClass are required.' });
    }
    const rules = appStorage.getTatkalRules();
    const result = calculateTatkalOpening(
      String(journeyDate),
      travelClass as TravelClass,
      originOffsetDays ? Number(originOffsetDays) : 0,
      rules
    );

    res.json({ success: true, data: result });
  });

  // Passenger Profiles
  app.get('/api/v1/passengers', (_req: Request, res: Response) => {
    const passengers = appStorage.getPassengers();
    res.json({ success: true, count: passengers.length, data: passengers });
  });

  app.post('/api/v1/passengers', (req: Request, res: Response) => {
    const { name, age, gender, berthPreference, foodPreference, seniorCitizen, groupTag, idCardType, idCardLast4 } = req.body;
    if (!name || !age || !gender) {
      return res.status(400).json({ success: false, error: 'Name, age and gender are required.' });
    }

    const created = appStorage.addPassenger({
      name,
      age: Number(age),
      gender,
      berthPreference: berthPreference || 'NO_PREF',
      foodPreference: foodPreference || 'NONE',
      seniorCitizen: Boolean(seniorCitizen),
      groupTag: groupTag || 'Family',
      idCardType,
      idCardLast4
    });

    res.status(201).json({ success: true, data: created });
  });

  app.delete('/api/v1/passengers/:id', (req: Request, res: Response) => {
    const deleted = appStorage.deletePassenger(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Passenger profile not found.' });
    }
    res.json({ success: true, message: 'Passenger deleted successfully.' });
  });

  // Saved Journeys
  app.get('/api/v1/journeys', (_req: Request, res: Response) => {
    const journeys = appStorage.getJourneys();
    res.json({ success: true, count: journeys.length, data: journeys });
  });

  app.post('/api/v1/journeys', (req: Request, res: Response) => {
    const { 
      trainNumber, 
      trainName, 
      fromStationCode, 
      fromStationName, 
      toStationCode, 
      toStationName, 
      journeyDate, 
      travelClass, 
      quota, 
      passengerIds, 
      reminderEnabled, 
      reminderMinutesBefore, 
      originDepartureOffsetDays, 
      notes 
    } = req.body;

    if (!trainNumber || !journeyDate || !fromStationCode || !toStationCode || !travelClass) {
      return res.status(400).json({ success: false, error: 'Missing required journey fields.' });
    }

    const journey = appStorage.saveJourney({
      trainNumber,
      trainName,
      fromStationCode,
      fromStationName,
      toStationCode,
      toStationName,
      journeyDate,
      travelClass: travelClass as TravelClass,
      quota: quota || 'TQ',
      passengerIds: passengerIds || [],
      reminderEnabled: reminderEnabled !== false,
      reminderMinutesBefore: reminderMinutesBefore || 15,
      originDepartureOffsetDays: originDepartureOffsetDays || 0,
      notes
    });

    res.status(201).json({ success: true, data: journey });
  });

  app.delete('/api/v1/journeys/:id', (req: Request, res: Response) => {
    const deleted = appStorage.deleteJourney(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Journey not found.' });
    }
    res.json({ success: true, message: 'Journey removed.' });
  });

  // PNR Status Tracking
  app.get('/api/v1/pnr/:pnr', (req: Request, res: Response) => {
    const pnr = req.params.pnr;
    const clean = pnr.replace(/\D/g, '');
    if (clean.length !== 10) {
      return res.status(400).json({ success: false, error: 'PNR must be a valid 10-digit numeric code.' });
    }

    const record = appStorage.getPnr(clean);
    if (!record) {
      return res.status(404).json({ success: false, error: 'PNR not found or expired.' });
    }

    res.json({ success: true, data: record });
  });

  // Alerts
  app.get('/api/v1/alerts', (_req: Request, res: Response) => {
    const alerts = appStorage.getAlerts();
    res.json({ success: true, count: alerts.length, data: alerts });
  });

  app.post('/api/v1/alerts/:id/dismiss', (req: Request, res: Response) => {
    const success = appStorage.dismissAlert(req.params.id);
    res.json({ success });
  });

  // Admin Stats & Rules
  app.get('/api/v1/admin/stats', (_req: Request, res: Response) => {
    const stats = appStorage.getAdminStats();
    res.json({ success: true, data: stats });
  });

  app.post('/api/v1/admin/rules', (req: Request, res: Response) => {
    const updated = appStorage.updateTatkalRules(req.body);
    res.json({ success: true, data: updated });
  });

  // Vite development middleware or static production serving
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Tatkal Assist] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start Tatkal Assist server:', err);
  process.exit(1);
});
