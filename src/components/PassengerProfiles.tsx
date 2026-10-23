import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Copy, 
  Check, 
  ShieldCheck, 
  AlertCircle, 
  Heart, 
  Briefcase, 
  User, 
  Lock,
  Utensils
} from 'lucide-react';
import { Passenger, BerthPreference, FoodPreference, Gender } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { formatPassengerClipboardBundle } from '../utils/tatkalCalculations';

interface PassengerProfilesProps {
  passengers: Passenger[];
  onAddPassenger: (data: Omit<Passenger, 'id' | 'createdAt'>) => void;
  onDeletePassenger: (id: string) => void;
}

export const PassengerProfiles: React.FC<PassengerProfilesProps> = ({
  passengers,
  onAddPassenger,
  onDeletePassenger
}) => {
  const { t } = useLanguage();
  const [showAddForm, setShowAddForm] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('ALL');

  // Form states
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<Gender>('M');
  const [berthPreference, setBerthPreference] = useState<BerthPreference>('NO_PREF');
  const [foodPreference, setFoodPreference] = useState<FoodPreference>('V');
  const [seniorCitizen, setSeniorCitizen] = useState(false);
  const [groupTag, setGroupTag] = useState('Family');
  const [idCardLast4, setIdCardLast4] = useState('');
  const [consentChecked, setConsentChecked] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !age || !consentChecked) return;

    onAddPassenger({
      name: name.toUpperCase().trim(),
      age: Number(age),
      gender,
      berthPreference,
      foodPreference,
      seniorCitizen: Boolean(seniorCitizen || Number(age) >= 60),
      groupTag,
      idCardType: idCardLast4 ? 'Aadhaar (Last 4)' : undefined,
      idCardLast4: idCardLast4 || undefined
    });

    // Reset form
    setName('');
    setAge('');
    setBerthPreference('NO_PREF');
    setIdCardLast4('');
    setShowAddForm(false);
  };

  const handleCopyBundle = () => {
    const text = formatPassengerClipboardBundle(filteredPassengers);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const filteredPassengers = selectedGroupFilter === 'ALL'
    ? passengers
    : passengers.filter(p => p.groupTag === selectedGroupFilter);

  const groups = ['ALL', ...Array.from(new Set(passengers.map(p => p.groupTag || 'Family')))];

  return (
    <div className="space-y-6">
      {/* Top Banner & Security Pledge */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">{t.passengerProfiles} (Master List Prep)</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Keep passenger names, ages, and berth choices ready for instant manual input or IRCTC Master List synchronization.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyBundle}
              disabled={filteredPassengers.length === 0}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? t.copiedSuccess : t.copyAllPassengers}</span>
            </button>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3.5 py-1.5 rounded-lg bg-[#0F284E] hover:bg-[#163B6E] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{showAddForm ? 'Cancel' : t.addPassenger}</span>
            </button>
          </div>
        </div>

        {/* Security & Privacy Notice */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-start gap-2.5 text-xs text-emerald-900">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Data Privacy & Security Guarantee:</strong> We enforce data minimisation. Tatkal Assist <strong>never</strong> asks for IRCTC passwords, banking CVVs, or full Aadhaar numbers. Profiles are stored with local encryption and strict user scoping.
          </div>
        </div>
      </div>

      {/* Add Passenger Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl border border-blue-200 shadow-md p-5 space-y-4">
          <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Add New Passenger to Master List</h3>
            <span className="text-xs text-slate-400">All fields match IRCTC form format</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name (As on Govt ID) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RAJESH SHARMA"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F284E] uppercase"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Age (Years) *
                </label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  required
                  placeholder="e.g. 35"
                  value={age}
                  onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F284E]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Gender *
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 bg-white"
                >
                  <option value="M">Male (M)</option>
                  <option value="F">Female (F)</option>
                  <option value="T">Transgender (T)</option>
                </select>
              </div>

              {/* Berth Preference */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Berth Preference
                </label>
                <select
                  value={berthPreference}
                  onChange={(e) => setBerthPreference(e.target.value as BerthPreference)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 bg-white"
                >
                  <option value="NO_PREF">No Preference</option>
                  <option value="LOWER">Lower Berth</option>
                  <option value="MIDDLE">Middle Berth</option>
                  <option value="UPPER">Upper Berth</option>
                  <option value="SIDE_LOWER">Side Lower (SL)</option>
                  <option value="SIDE_UPPER">Side Upper (SU)</option>
                  <option value="WINDOW">Window (CC)</option>
                </select>
              </div>

              {/* Food Preference */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Food (Rajdhani/VB)
                </label>
                <select
                  value={foodPreference}
                  onChange={(e) => setFoodPreference(e.target.value as FoodPreference)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 bg-white"
                >
                  <option value="V">Veg (शाकाहारी)</option>
                  <option value="N">Non-Veg (मांसाहारी)</option>
                  <option value="NONE">No Food</option>
                </select>
              </div>

              {/* Group Tag */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Group / Tag
                </label>
                <input
                  type="text"
                  placeholder="e.g. Family, Office"
                  value={groupTag}
                  onChange={(e) => setGroupTag(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Optional ID Card (Last 4 Digits Only)
                </label>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="e.g. 4821"
                  value={idCardLast4}
                  onChange={(e) => setIdCardLast4(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono tracking-widest text-slate-900"
                />
              </div>

              <div className="pt-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={seniorCitizen || (typeof age === 'number' && age >= 60)}
                    onChange={(e) => setSeniorCitizen(e.target.checked)}
                    className="rounded text-[#0F284E] focus:ring-[#0F284E]"
                  />
                  <span>Senior Citizen (Note: No concession in Tatkal quota)</span>
                </label>
              </div>
            </div>

            {/* Explicit Consent */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600 max-w-md">
                <input
                  type="checkbox"
                  required
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="rounded text-[#0F284E] focus:ring-[#0F284E] mt-0.5"
                />
                <span>
                  I give explicit consent to store these passenger details for quick booking preparation on this device.
                </span>
              </label>

              <button
                type="submit"
                disabled={!name.trim() || !age || !consentChecked}
                className="py-2.5 px-6 rounded-lg bg-[#0F284E] hover:bg-[#163B6E] disabled:bg-slate-300 text-white font-bold text-xs shadow-sm transition-colors"
              >
                Save Passenger
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter by Group Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="font-semibold text-slate-500 mr-1">Filter Group:</span>
        {groups.map(grp => (
          <button
            key={grp}
            onClick={() => setSelectedGroupFilter(grp)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              selectedGroupFilter === grp
                ? 'bg-[#0F284E] text-white shadow-xs font-semibold'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {grp}
          </button>
        ))}
      </div>

      {/* Passengers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPassengers.length === 0 ? (
          <div className="md:col-span-3 bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 space-y-2">
            <Users className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs">No passengers found in this group.</p>
          </div>
        ) : (
          filteredPassengers.map(p => (
            <div
              key={p.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all p-4 space-y-3 relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm tracking-wide">
                      {p.name}
                    </h3>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {p.age} Yrs · {p.gender === 'M' ? 'Male' : p.gender === 'F' ? 'Female' : 'Transgender'}
                      {p.seniorCitizen && ' · Senior Citizen'}
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {p.groupTag || 'Family'}
                  </span>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-semibold">Berth Choice</span>
                    <span className="font-medium text-slate-800">{p.berthPreference.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-semibold">Meal Preference</span>
                    <span className="font-medium text-slate-800">
                      {p.foodPreference === 'V' ? 'Veg' : p.foodPreference === 'N' ? 'Non-Veg' : 'None'}
                    </span>
                  </div>
                </div>

                {p.idCardLast4 && (
                  <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span>ID: •••• {p.idCardLast4}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${p.name} | Age ${p.age} | ${p.gender} | ${p.berthPreference}`);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="text-blue-700 hover:text-blue-900 font-medium flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy Single</span>
                </button>
                <button
                  onClick={() => onDeletePassenger(p.id)}
                  className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                  title="Delete passenger profile"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
