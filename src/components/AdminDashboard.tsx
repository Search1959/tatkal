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
  UserPlus,
  Edit3,
  Trash2,
  Eye,
  X,
  Compass,
  MapPin,
  Plus,
  LogOut,
  Search,
  Lock
} from 'lucide-react';
import { AdminStats, TatkalRuleConfig, UserAccount, Station } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { INDIAN_STATIONS } from '../data/mockStations';

interface AdminDashboardProps {
  stats: AdminStats;
  rules: TatkalRuleConfig;
  onUpdateRules: (newRules: Partial<TatkalRuleConfig>) => void;
  adminEmail?: string;
  onLogoutAdmin?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  rules,
  onUpdateRules,
  adminEmail = 'admin@tatkalassist.rail.in',
  onLogoutAdmin
}) => {
  const { t } = useLanguage();
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'users' | 'stations' | 'rules' | 'database' | 'logs'>('users');
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // User Accounts State (Create, Read/View, Update/Edit, Delete)
  const [usersList, setUsersList] = useState<UserAccount[]>([
    {
      id: 'usr-1',
      fullName: 'Rajesh Sharma',
      email: 'rajesh.sharma@example.com',
      phoneNumber: '+91 98765 43210',
      role: 'PASSENGER',
      status: 'ACTIVE',
      createdAt: '2026-10-15',
      lastLogin: '2026-10-22'
    },
    {
      id: 'usr-2',
      fullName: 'Pooja Sharma',
      email: 'pooja.sharma@example.com',
      phoneNumber: '+91 98765 43211',
      role: 'PASSENGER',
      status: 'ACTIVE',
      createdAt: '2026-10-16',
      lastLogin: '2026-10-21'
    },
    {
      id: 'usr-3',
      fullName: 'Vikram Malhotra',
      email: 'vikram.m@railoperator.gov.in',
      phoneNumber: '+91 91234 56789',
      role: 'OPERATOR',
      status: 'ACTIVE',
      createdAt: '2026-09-01',
      lastLogin: '2026-10-22'
    },
    {
      id: 'usr-admin',
      fullName: 'System Administrator (Arun)',
      email: 'admin@tatkalassist.rail.in',
      phoneNumber: '+91 99999 88888',
      role: 'ADMIN',
      status: 'ACTIVE',
      createdAt: '2026-08-01',
      lastLogin: '2026-10-22'
    }
  ]);

  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('ALL');

  // Modals for User CRUD
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [viewingUser, setViewingUser] = useState<UserAccount | null>(null);

  // New user form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserRole, setNewUserRole] = useState<'ADMIN' | 'OPERATOR' | 'PASSENGER'>('PASSENGER');
  const [newUserStatus, setNewUserStatus] = useState<'ACTIVE' | 'SUSPENDED'>('ACTIVE');

  // Stations State for CRUD
  const [stationsList, setStationsList] = useState<Station[]>(INDIAN_STATIONS);
  const [stationSearchQuery, setStationSearchQuery] = useState('');
  const [createStationOpen, setCreateStationOpen] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | null>(null);

  // New Station form state
  const [newStnCode, setNewStnCode] = useState('');
  const [newStnName, setNewStnName] = useState('');
  const [newStnCity, setNewStnCity] = useState('');
  const [newStnState, setNewStnState] = useState('');
  const [newStnZone, setNewStnZone] = useState('NR');
  const [newStnIsJunction, setNewStnIsJunction] = useState(false);

  // Editable rule state
  const [acHour, setAcHour] = useState(rules.acOpeningHour);
  const [acMin, setAcMin] = useState(rules.acOpeningMinute);
  const [nonAcHour, setNonAcHour] = useState(rules.nonAcOpeningHour);
  const [nonAcMin, setNonAcMin] = useState(rules.nonAcOpeningMinute);
  const [maxPassengers, setMaxPassengers] = useState(rules.maxPassengersPerTatkal);
  const [advanceDays, setAdvanceDays] = useState(rules.advanceDays);

  // User Actions
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const created: UserAccount = {
      id: `usr-${Date.now()}`,
      fullName: newUserName.trim(),
      email: newUserEmail.trim(),
      phoneNumber: newUserPhone.trim() || undefined,
      role: newUserRole,
      status: newUserStatus,
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Never'
    };

    setUsersList(prev => [created, ...prev]);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPhone('');
    setCreateUserOpen(false);
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setUsersList(prev => prev.map(u => u.id === editingUser.id ? editingUser : u));
    setEditingUser(null);
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Are you sure you want to permanently delete this user account?')) {
      setUsersList(prev => prev.filter(u => u.id !== id));
    }
  };

  // Station Actions
  const handleCreateStation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStnCode.trim() || !newStnName.trim()) return;

    const created: Station = {
      code: newStnCode.toUpperCase().trim(),
      name: newStnName.trim(),
      city: newStnCity.trim(),
      state: newStnState.trim(),
      zone: newStnZone,
      isJunction: newStnIsJunction
    };

    setStationsList(prev => [created, ...prev]);
    setNewStnCode('');
    setNewStnName('');
    setNewStnCity('');
    setNewStnState('');
    setCreateStationOpen(false);
  };

  const handleUpdateStation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStation) return;
    setStationsList(prev => prev.map(s => s.code === editingStation.code ? editingStation : s));
    setEditingStation(null);
  };

  const handleDeleteStation = (code: string) => {
    if (confirm(`Are you sure you want to delete station ${code}?`)) {
      setStationsList(prev => prev.filter(s => s.code !== code));
    }
  };

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

  const filteredUsers = usersList.filter(u => {
    const matchesSearch = u.fullName.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearchQuery.toLowerCase());
    const matchesRole = userRoleFilter === 'ALL' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredStations = stationsList.filter(s => 
    s.code.toLowerCase().includes(stationSearchQuery.toLowerCase()) ||
    s.name.toLowerCase().includes(stationSearchQuery.toLowerCase()) ||
    s.city.toLowerCase().includes(stationSearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Admin Header with Logged-in Staff Info & Logout */}
      <div className="bg-[#0A1D37] text-white rounded-xl p-5 border border-[#1E3A5F] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-red-600 text-white shadow-xs">
              SYSTEM ADMIN CONSOLE
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> Authenticated as {adminEmail}
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">Railway Administrative & User Management Console</h2>
          <p className="text-xs text-slate-300">
            Create, view, edit and delete accounts, manage stations dataset, and adjust official Tatkal rules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onLogoutAdmin && (
            <button
              onClick={onLogoutAdmin}
              className="px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout Admin</span>
            </button>
          )}
        </div>
      </div>

      {/* Admin Sub-Tabs */}
      <div className="flex items-center gap-1 bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs overflow-x-auto text-xs">
        <button
          onClick={() => setActiveAdminSubTab('users')}
          className={`px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-1.5 ${
            activeAdminSubTab === 'users' ? 'bg-[#0F284E] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Accounts ({usersList.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('stations')}
          className={`px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-1.5 ${
            activeAdminSubTab === 'stations' ? 'bg-[#0F284E] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Stations Directory ({stationsList.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('rules')}
          className={`px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-1.5 ${
            activeAdminSubTab === 'rules' ? 'bg-[#0F284E] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Tatkal Booking Rules</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('database')}
          className={`px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-1.5 ${
            activeAdminSubTab === 'database' ? 'bg-[#0F284E] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>MySQL & Deployment</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('logs')}
          className={`px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-1.5 ${
            activeAdminSubTab === 'logs' ? 'bg-[#0F284E] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Audit Logs</span>
        </button>
      </div>

      {/* VIEW 1: USER MANAGEMENT (Create, View, Edit, Delete) */}
      {activeAdminSubTab === 'users' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">User & Account Administration</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage passenger and staff accounts with full create, view, edit, and delete permissions.
              </p>
            </div>

            <button
              onClick={() => setCreateUserOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-[#0F284E] hover:bg-[#163B6E] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create New User</span>
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search user by name or email..."
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0F284E]"
              />
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs font-semibold text-slate-500">Role:</span>
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 bg-white"
              >
                <option value="ALL">All Roles</option>
                <option value="PASSENGER">Passengers</option>
                <option value="OPERATOR">Operators</option>
                <option value="ADMIN">Admins</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="border border-slate-200 rounded-xl overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">User</th>
                  <th className="py-2.5 px-4">Phone</th>
                  <th className="py-2.5 px-4">Role</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4">Registered</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/80">
                    <td className="py-2.5 px-4">
                      <div className="font-bold text-slate-900">{user.fullName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{user.email}</div>
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-600">
                      {user.phoneNumber || '—'}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                        user.role === 'OPERATOR' ? 'bg-purple-100 text-purple-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        user.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-500 font-mono">
                      {user.createdAt}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setViewingUser(user)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 rounded hover:bg-slate-100"
                          title="View user details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingUser({ ...user })}
                          className="p-1.5 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-50"
                          title="Edit user"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1.5 text-red-600 hover:text-red-800 rounded hover:bg-red-50"
                          title="Delete user"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: STATIONS & DIRECTORY CRUD */}
      {activeAdminSubTab === 'stations' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Railway Stations Directory</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage stations dataset, junction tags, and railway zones.
              </p>
            </div>
            <button
              onClick={() => setCreateStationOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-[#0F284E] hover:bg-[#163B6E] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Station</span>
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search station by code, name, or city..."
              value={stationSearchQuery}
              onChange={(e) => setStationSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0F284E]"
            />
          </div>

          <div className="border border-slate-200 rounded-xl overflow-x-auto text-xs max-h-96">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0">
                <tr>
                  <th className="py-2.5 px-4">Station Code</th>
                  <th className="py-2.5 px-4">Station Name</th>
                  <th className="py-2.5 px-4">City / State</th>
                  <th className="py-2.5 px-4">Zone</th>
                  <th className="py-2.5 px-4">Junction?</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filteredStations.map(stn => (
                  <tr key={stn.code} className="hover:bg-slate-50/80">
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-900">{stn.code}</td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900">{stn.name}</td>
                    <td className="py-2.5 px-4 text-slate-600">{stn.city}, {stn.state}</td>
                    <td className="py-2.5 px-4 font-mono">{stn.zone}</td>
                    <td className="py-2.5 px-4">
                      {stn.isJunction ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          Junction
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Regular</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditingStation({ ...stn })}
                          className="p-1.5 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-50"
                          title="Edit station"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteStation(stn.code)}
                          className="p-1.5 text-red-600 hover:text-red-800 rounded hover:bg-red-50"
                          title="Delete station"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: TATKAL RULES */}
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
              </div>

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

      {/* VIEW 4: DATABASE & DEPLOYMENT */}
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
  group_tag VARCHAR(50) DEFAULT 'Family'
);`}</pre>
          </div>
        </div>
      )}

      {/* VIEW 5: AUDIT LOGS */}
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
              <span>[AUTH] Admin {adminEmail} session verified</span>
              <span className="text-slate-400">Now</span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE USER */}
      {createUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-[#0A1D37] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm">Create New User Account</h3>
              </div>
              <button onClick={() => setCreateUserOpen(false)} className="p-1 rounded text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand Kumar"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. anand@example.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number (Optional)</label>
                <input
                  type="tel"
                  placeholder="+91 98765 00000"
                  value={newUserPhone}
                  onChange={(e) => setNewUserPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-900 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as 'ADMIN' | 'OPERATOR' | 'PASSENGER')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-900 bg-white"
                  >
                    <option value="PASSENGER">Passenger</option>
                    <option value="OPERATOR">Operator</option>
                    <option value="ADMIN">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={newUserStatus}
                    onChange={(e) => setNewUserStatus(e.target.value as 'ACTIVE' | 'SUSPENDED')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-900 bg-white"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="SUSPENDED">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateUserOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#0F284E] hover:bg-[#163B6E] text-white font-bold"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT USER */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-[#0A1D37] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-sm">Edit User Account</h3>
              </div>
              <button onClick={() => setEditingUser(null)} className="p-1 rounded text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingUser.fullName}
                  onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={editingUser.phoneNumber || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, phoneNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-900 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as 'ADMIN' | 'OPERATOR' | 'PASSENGER' })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-900 bg-white"
                  >
                    <option value="PASSENGER">Passenger</option>
                    <option value="OPERATOR">Operator</option>
                    <option value="ADMIN">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={editingUser.status}
                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as 'ACTIVE' | 'SUSPENDED' })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-900 bg-white"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="SUSPENDED">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#0F284E] hover:bg-[#163B6E] text-white font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW USER DETAILS */}
      {viewingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-[#0A1D37] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">User Profile Dossier</h3>
              </div>
              <button onClick={() => setViewingUser(null)} className="p-1 rounded text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">User Identification</span>
                <div className="text-base font-bold text-slate-900">{viewingUser.fullName}</div>
                <div className="font-mono text-slate-600">{viewingUser.email}</div>
                <div className="font-mono text-slate-600">{viewingUser.phoneNumber || 'No phone registered'}</div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Assigned Role</span>
                  <span className="font-bold text-slate-900 text-sm">{viewingUser.role}</span>
                </div>
                <div className="p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Account Status</span>
                  <span className={`font-bold text-sm ${viewingUser.status === 'ACTIVE' ? 'text-emerald-700' : 'text-red-700'}`}>
                    {viewingUser.status}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 text-slate-600 space-y-1">
                <div>Account ID: <span className="font-mono font-bold text-slate-900">{viewingUser.id}</span></div>
                <div>Member Since: <span className="font-mono text-slate-900">{viewingUser.createdAt}</span></div>
                <div>Last Platform Access: <span className="font-mono text-slate-900">{viewingUser.lastLogin || 'N/A'}</span></div>
              </div>

              <div className="pt-2 text-right">
                <button
                  type="button"
                  onClick={() => setViewingUser(null)}
                  className="px-4 py-2 rounded-lg bg-[#0F284E] text-white font-semibold text-xs"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE STATION */}
      {createStationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-[#0A1D37] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm">Add New Railway Station</h3>
              </div>
              <button onClick={() => setCreateStationOpen(false)} className="p-1 rounded text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStation} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Station Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. BSB"
                    value={newStnCode}
                    onChange={(e) => setNewStnCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold uppercase text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Zone</label>
                  <input
                    type="text"
                    placeholder="e.g. NR, CR, WR"
                    value={newStnZone}
                    onChange={(e) => setNewStnZone(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono uppercase text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Station Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Varanasi Junction"
                  value={newStnName}
                  onChange={(e) => setNewStnName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Varanasi"
                    value={newStnCity}
                    onChange={(e) => setNewStnCity(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Uttar Pradesh"
                    value={newStnState}
                    onChange={(e) => setNewStnState(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 pt-1">
                  <input
                    type="checkbox"
                    checked={newStnIsJunction}
                    onChange={(e) => setNewStnIsJunction(e.target.checked)}
                    className="rounded text-[#0F284E]"
                  />
                  <span>Major Junction Station (Junction Tag)</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateStationOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#0F284E] hover:bg-[#163B6E] text-white font-bold"
                >
                  Add Station
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT STATION */}
      {editingStation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-[#0A1D37] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-sm">Edit Station: {editingStation.code}</h3>
              </div>
              <button onClick={() => setEditingStation(null)} className="p-1 rounded text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStation} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Station Name</label>
                <input
                  type="text"
                  required
                  value={editingStation.name}
                  onChange={(e) => setEditingStation({ ...editingStation, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={editingStation.city}
                    onChange={(e) => setEditingStation({ ...editingStation, city: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={editingStation.state}
                    onChange={(e) => setEditingStation({ ...editingStation, state: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Zone</label>
                  <input
                    type="text"
                    required
                    value={editingStation.zone}
                    onChange={(e) => setEditingStation({ ...editingStation, zone: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono uppercase text-slate-900"
                  />
                </div>
                <div className="pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={Boolean(editingStation.isJunction)}
                      onChange={(e) => setEditingStation({ ...editingStation, isJunction: e.target.checked })}
                      className="rounded text-[#0F284E]"
                    />
                    <span>Junction</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStation(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#0F284E] hover:bg-[#163B6E] text-white font-bold"
                >
                  Save Station
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
