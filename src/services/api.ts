import { 
  Station, 
  Train, 
  Passenger, 
  SavedJourney, 
  TatkalRuleConfig, 
  PnrRecord, 
  AlertNotification, 
  AdminStats, 
  TravelClass 
} from '../types';

export const api = {
  async getStations(query?: string): Promise<Station[]> {
    const url = query ? `/api/v1/stations?q=${encodeURIComponent(query)}` : '/api/v1/stations';
    const res = await fetch(url);
    const json = await res.json();
    return json.data || [];
  },

  async searchTrains(params: {
    from: string;
    to: string;
    date?: string;
    class?: string;
    quota?: string;
  }): Promise<{ trains: Train[]; isSimulated: boolean }> {
    const qs = new URLSearchParams();
    qs.set('from', params.from);
    qs.set('to', params.to);
    if (params.date) qs.set('date', params.date);
    if (params.class) qs.set('class', params.class);
    if (params.quota) qs.set('quota', params.quota);

    const res = await fetch(`/api/v1/trains/search?${qs.toString()}`);
    const json = await res.json();
    return {
      trains: json.data || [],
      isSimulated: json.isSimulated ?? true
    };
  },

  async getTatkalRules(): Promise<TatkalRuleConfig> {
    const res = await fetch('/api/v1/tatkal/rules');
    const json = await res.json();
    return json.data;
  },

  async calculateTatkal(journeyDate: string, travelClass: TravelClass, originOffsetDays: number = 0) {
    const res = await fetch('/api/v1/tatkal/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ journeyDate, travelClass, originOffsetDays })
    });
    const json = await res.json();
    return json.data;
  },

  async getPassengers(): Promise<Passenger[]> {
    const res = await fetch('/api/v1/passengers');
    const json = await res.json();
    return json.data || [];
  },

  async addPassenger(data: Omit<Passenger, 'id' | 'createdAt'>): Promise<Passenger> {
    const res = await fetch('/api/v1/passengers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    return json.data;
  },

  async deletePassenger(id: string): Promise<boolean> {
    const res = await fetch(`/api/v1/passengers/${id}`, { method: 'DELETE' });
    const json = await res.json();
    return json.success;
  },

  async getJourneys(): Promise<SavedJourney[]> {
    const res = await fetch('/api/v1/journeys');
    const json = await res.json();
    return json.data || [];
  },

  async saveJourney(journeyData: Partial<SavedJourney>): Promise<SavedJourney> {
    const res = await fetch('/api/v1/journeys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(journeyData)
    });
    const json = await res.json();
    return json.data;
  },

  async deleteJourney(id: string): Promise<boolean> {
    const res = await fetch(`/api/v1/journeys/${id}`, { method: 'DELETE' });
    const json = await res.json();
    return json.success;
  },

  async checkPnr(pnr: string): Promise<PnrRecord> {
    const res = await fetch(`/api/v1/pnr/${pnr}`);
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'Failed to check PNR');
    }
    return json.data;
  },

  async getAlerts(): Promise<AlertNotification[]> {
    const res = await fetch('/api/v1/alerts');
    const json = await res.json();
    return json.data || [];
  },

  async dismissAlert(id: string): Promise<boolean> {
    const res = await fetch(`/api/v1/alerts/${id}/dismiss`, { method: 'POST' });
    const json = await res.json();
    return json.success;
  },

  async getAdminStats(): Promise<AdminStats> {
    const res = await fetch('/api/v1/admin/stats');
    const json = await res.json();
    return json.data;
  },

  async updateAdminRules(rules: Partial<TatkalRuleConfig>): Promise<TatkalRuleConfig> {
    const res = await fetch('/api/v1/admin/rules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rules)
    });
    const json = await res.json();
    return json.data;
  }
};
