import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Server, 
  Database, 
  Sliders, 
  Copy, 
  Check, 
  Terminal, 
  FileCode, 
  AlertTriangle,
  RefreshCw,
  Clock,
  Users,
  Compass
} from 'lucide-react';
import { AdminStats, TatkalRuleConfig } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface AdminDashboardProps {
  stats: AdminStats;
  rules: TatkalRuleConfig;
  onUpdateRules: (newRules: Partial<TatkalRuleConfig>) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  rules,
  onUpdateRules
}) => {
  const { t } = useLanguage();
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'metrics' | 'rules' | 'database' | 'logs'>('metrics');
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Editable rule state
  const [acHour, setAcHour] = useState(rules.acOpeningHour);
  const [acMin, setAcMin] = useState(rules.acOpeningMinute);
  const [nonAcHour, setNonAcHour] = useState(rules.nonAcOpeningHour);
  const [nonAcMin, setNonAcMin] = useState(rules.nonAcOpeningMinute);
  const [maxPassengers, setMaxPassengers] = useState(rules.maxPassengersPerTatkal);
  const [advanceDays, setAdvanceDays] = useState(rules.advanceDays);

  const handleSaveRules = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateRules({
      acOpeningHour: Number(acHour),
      acOpeningMinute: Number(acMin),
      nonAcOpeningHour: Number(nonAcHour),
      nonAcOpeningMinute: Number(nonAcMin),
      maxPassengersPerTatkal: Number(maxPassengers),
      advanceDays: Number(advanceDays)
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const copyMysqlSchema = () => {
    const schemaSql = `-- Tatkal Assist MySQL 8.0+ Production Schema
CREATE TABLE users (id VARCHAR(36) PRIMARY KEY, phone VARCHAR(15), email VARCHAR(255), full_name VARCHAR(120), role VARCHAR(20));
CREATE TABLE stations (code VARCHAR(10) PRIMARY KEY, name VARCHAR(120), city VARCHAR(80), state VARCHAR(80), zone VARCHAR(10));
CREATE TABLE passenger_profiles (id VARCHAR(36) PRIMARY KEY, user_id VARCHAR(36), full_name VARCHAR(100), age TINYINT UNSIGNED, gender ENUM('M','F','T'), berth_preference VARCHAR(30), group_tag VARCHAR(50));
CREATE TABLE saved_journeys (id VARCHAR(36) PRIMARY KEY, user_id VARCHAR(36), train_number VARCHAR(10), journey_date DATE, travel_class VARCHAR(5), tatkal_opening_date DATE, tatkal_opening_time TIME);
CREATE TABLE alerts_notifications (id VARCHAR(36) PRIMARY KEY, user_id VARCHAR(36), title VARCHAR(200), scheduled_for TIMESTAMP, status ENUM('PENDING','TRIGGERED','DISMISSED'));
CREATE TABLE tatkal_rules_config (id INT AUTO_INCREMENT PRIMARY KEY, ac_opening_hour INT, non_ac_opening_hour INT, advance_days INT, max_passengers INT);
-- See /src/db/mysql-schema.sql for the full relational DDL`;
    navigator.clipboard.writeText(schemaSql);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-[#0A1D37] text-white rounded-xl p-5 border border-[#1E3A5F] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-red-600/80 text-white border border-red-400/40">
              ADMINISTRATOR CONSOLE
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> Authenticated Session
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">Railway Rules & System Administration</h2>
          <p className="text-xs text-slate-300">
            Configure official Tatkal booking timings, monitor traffic surges, and export database migrations.
          </p>
        </div>

        {/* Sub-tab navigation */}
        <div className="flex items-center gap-1 bg-[#132E50] p-1 rounded-lg border border-white/10 text-xs">
          <button
            onClick={() => setActiveAdminSubTab('metrics')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeAdminSubTab === 'metrics' ? 'bg-[#0A1D37] text-white font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            System Metrics
          </button>
          <button
            onClick={() => setActiveAdminSubTab('rules')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeAdminSubTab === 'rules' ? 'bg-[#0A1D37] text-white font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Tatkal Rules
          </button>
          <button
            onClick={() => setActiveAdminSubTab('database')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeAdminSubTab === 'database' ? 'bg-[#0A1D37] text-white font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            MySQL & Deploy
          </button>
          <button
            onClick={() => setActiveAdminSubTab('logs')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeAdminSubTab === 'logs' ? 'bg-[#0A1D37] text-white font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Audit Logs
          </button>
        </div>
      </div>

      {/* View 1: System Metrics & Health */}
      {activeAdminSubTab === 'metrics' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Tracked Journeys</span>
              <div className="text-2xl font-black text-slate-900">{stats.totalJourneys}</div>
              <span className="text-[11px] text-emerald-600 font-medium">Active in database</span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Saved Passenger Profiles</span>
              <div className="text-2xl font-black text-slate-900">{stats.totalPassengers}</div>
              <span className="text-[11px] text-blue-600 font-medium">In Master List</span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Active Scheduled Alerts</span>
              <div className="text-2xl font-black text-slate-900">{stats.activeAlerts}</div>
              <span className="text-[11px] text-amber-600 font-medium">Upcoming Tatkal gongs</span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Route Searches</span>
              <div className="text-2xl font-black text-slate-900">{stats.searchesToday}</div>
              <span className="text-[11px] text-purple-600 font-medium">Queries executed</span>
            </div>
          </div>

          {/* Infrastructure Health Status */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
              External Integration Health & Data Source
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Data Source Mode</span>
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{stats.dataSourceLabel}</span>
                </div>
                <p className="text-[11px] text-slate-500">Authentic Indian Railway schedules & Tatkal fares</p>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">IRCTC NGET Load Status</span>
                <div className="font-bold text-emerald-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>NORMAL (Accepting Logins)</span>
                </div>
                <p className="text-[11px] text-slate-500">Rush anticipated between 09:58 AM and 11:15 AM IST</p>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Server Process Uptime</span>
                <div className="font-bold font-mono text-slate-900">
                  {Math.floor(stats.systemUptimeSeconds / 60)} minutes {stats.systemUptimeSeconds % 60} seconds
                </div>
                <p className="text-[11px] text-slate-500">Express REST API on Node.js</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View 2: Editable Tatkal Rules */}
      {activeAdminSubTab === 'rules' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Official Railway Tatkal Rule Configuration</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Centralized rule parameters driving all client-side countdowns and validations.
              </p>
            </div>
            {saveSuccess && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Saved & Propagated!
              </span>
            )}
          </div>

          <form onSubmit={handleSaveRules} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* AC Opening Time */}
              <div className="p-3.5 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-900">
                  AC Classes Opening Time (1A, 2A, 3A, 3E, CC, EC)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={23}
                    value={acHour}
                    onChange={(e) => setAcHour(Number(e.target.value))}
                    className="w-16 px-2 py-1.5 border border-slate-300 rounded text-xs font-mono font-bold text-center"
                  />
                  <span>:</span>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={acMin}
                    onChange={(e) => setAcMin(Number(e.target.value))}
                    className="w-16 px-2 py-1.5 border border-slate-300 rounded text-xs font-mono font-bold text-center"
                  />
                  <span className="text-xs text-slate-500">IST (Standard: 10:00 AM)</span>
                </div>
              </div>

              {/* Non-AC Opening Time */}
              <div className="p-3.5 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-900">
                  Non-AC Classes Opening Time (SL, 2S)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={23}
                    value={nonAcHour}
                    onChange={(e) => setNonAcHour(Number(e.target.value))}
                    className="w-16 px-2 py-1.5 border border-slate-300 rounded text-xs font-mono font-bold text-center"
                  />
                  <span>:</span>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={nonAcMin}
                    onChange={(e) => setNonAcMin(Number(e.target.value))}
                    className="w-16 px-2 py-1.5 border border-slate-300 rounded text-xs font-mono font-bold text-center"
                  />
                  <span className="text-xs text-slate-500">IST (Standard: 11:00 AM)</span>
                </div>
              </div>

              {/* Advance Days */}
              <div className="p-3.5 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-900">
                  Advance Reservation Days (Prior to Train Origin)
                </label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={advanceDays}
                  onChange={(e) => setAdvanceDays(Number(e.target.value))}
                  className="w-24 px-2.5 py-1.5 border border-slate-300 rounded text-xs font-mono font-bold"
                />
                <p className="text-[11px] text-slate-500">Standard Indian Railways Tatkal quota is 1 day in advance.</p>
              </div>

              {/* Max Passengers per Tatkal ticket */}
              <div className="p-3.5 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-900">
                  Maximum Passengers per Tatkal PNR
                </label>
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={maxPassengers}
                  onChange={(e) => setMaxPassengers(Number(e.target.value))}
                  className="w-24 px-2.5 py-1.5 border border-slate-300 rounded text-xs font-mono font-bold"
                />
                <p className="text-[11px] text-slate-500">Official cap: 4 passengers (unlike 6 on General quota).</p>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                type="submit"
                className="py-2.5 px-6 rounded-lg bg-[#0F284E] hover:bg-[#163B6E] text-white font-bold text-xs shadow-sm transition-colors"
              >
                Save & Update Railway Rules
              </button>
            </div>
          </form>
        </div>
      )}

      {/* View 3: MySQL & Deployment Guide */}
      {activeAdminSubTab === 'database' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">MySQL Database Schema & Production Guide</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                DDL migration scripts, indexing, foreign keys, backup & restore CLI protocols.
              </p>
            </div>
            <button
              onClick={copyMysqlSchema}
              className="px-3 py-1.5 rounded-lg bg-[#0F284E] hover:bg-[#163B6E] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copiedSchema ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSchema ? 'Copied Schema!' : 'Copy SQL Schema'}</span>
            </button>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              MySQL Production DDL Script (Located at /src/db/mysql-schema.sql)
            </h4>
            <div className="bg-slate-900 text-slate-100 font-mono text-xs p-4 rounded-xl overflow-x-auto max-h-60 leading-relaxed border border-slate-800">
              <pre>{`-- Tatkal Assist Production Schema (MySQL 8.0+)
CREATE DATABASE IF NOT EXISTS \`tatkal_assist\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`tatkal_assist\`;

-- 1. Users & Authentication Sessions
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  phone_number VARCHAR(15) UNIQUE,
  email VARCHAR(255) UNIQUE,
  full_name VARCHAR(120) NOT NULL,
  role ENUM('USER','ADMIN') DEFAULT 'USER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Passenger Profiles (Master List)
CREATE TABLE passenger_profiles (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  age TINYINT UNSIGNED NOT NULL,
  gender ENUM('M','F','T') NOT NULL,
  berth_preference VARCHAR(30) DEFAULT 'NO_PREF',
  food_preference VARCHAR(10) DEFAULT 'NONE',
  group_tag VARCHAR(50) DEFAULT 'Family',
  CONSTRAINT fk_passengers_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_passengers_user (user_id)
);

-- 3. Saved Journeys & Tatkal Calculations
CREATE TABLE saved_journeys (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  train_number VARCHAR(10) NOT NULL,
  train_name VARCHAR(150) NOT NULL,
  from_station_code VARCHAR(10) NOT NULL,
  to_station_code VARCHAR(10) NOT NULL,
  journey_date DATE NOT NULL,
  travel_class VARCHAR(5) NOT NULL,
  tatkal_opening_date DATE NOT NULL,
  tatkal_opening_time TIME NOT NULL,
  INDEX idx_journeys_open (tatkal_opening_date, tatkal_opening_time)
);`}</pre>
            </div>
          </div>

          {/* Deployment & Backup Instructions */}
          <div className="pt-2 border-t border-slate-100 space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wide">
              Local Installation & Production Deployment
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                <span className="font-bold text-slate-800">Local Run Command</span>
                <p className="font-mono text-slate-700 bg-white p-2 rounded border border-slate-200 text-[11px]">
                  npm install && npm run dev
                </p>
                <p className="text-[11px] text-slate-500">Starts Express on port 3000 with Vite middleware.</p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                <span className="font-bold text-slate-800">Database Backup Protocol</span>
                <p className="font-mono text-slate-700 bg-white p-2 rounded border border-slate-200 text-[11px]">
                  mysqldump -u root -p tatkal_assist &gt; backup.sql
                </p>
                <p className="text-[11px] text-slate-500">Nightly cron automated snapshot.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View 4: Audit Logs */}
      {activeAdminSubTab === 'logs' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
            System Request & Event Stream
          </h3>
          <div className="space-y-2 font-mono text-xs text-slate-700">
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span>[API] GET /api/v1/stations - 200 OK</span>
              <span className="text-slate-400">12ms</span>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span>[API] GET /api/v1/trains/search?from=NDLS&to=MMCT - 200 OK</span>
              <span className="text-slate-400">18ms</span>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span>[API] POST /api/v1/tatkal/calculate - 200 OK</span>
              <span className="text-slate-400">4ms</span>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span>[API] GET /api/v1/pnr/2847591024 - 200 OK</span>
              <span className="text-slate-400">9ms</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
