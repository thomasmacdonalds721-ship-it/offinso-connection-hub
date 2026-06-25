/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Users, Award, ShieldCheck, Building, HelpCircle, GraduationCap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export interface YouthCooperative {
  id: string;
  name: string;
  craftType: string;
  leadContact: string;
  membersCount: number;
  location: string;
  certificationStatus: 'Verified' | 'Pending Audit';
}

const INITIAL_COOPERATIVES: YouthCooperative[] = [
  {
    id: 'coop_1',
    name: 'Kokote Cocoa Growers Youth Guild',
    craftType: 'Sustainable Cocoa Cultivation',
    leadContact: 'Daniel Owusu Sekyere',
    membersCount: 18,
    location: 'Kokote Community Centre, Offinso',
    certificationStatus: 'Verified'
  },
  {
    id: 'coop_2',
    name: 'Abofour Loom-Weavers Kente Collective',
    craftType: 'Authentic Loom-Weaving & Pottery',
    leadContact: 'Serwaa Akoto Boateng',
    membersCount: 12,
    location: 'Abofour Town Hall, Offinso North',
    certificationStatus: 'Verified'
  },
  {
    id: 'coop_3',
    name: 'Amanchia Eco-Reserve Rangers Cooperative',
    craftType: 'Monkey Sanctuary Ecotourism Guides',
    leadContact: 'Kofi Mensah Bonsu',
    membersCount: 8,
    location: 'Amanchia Entrance Outpost, Offinso',
    certificationStatus: 'Pending Audit'
  }
];

export default function SocialDevSection() {
  const { t, language } = useLanguage();

  // Cooperatives registry state
  const [cooperatives, setCooperatives] = useState<YouthCooperative[]>(() => {
    const saved = localStorage.getItem('offinso_cooperatives');
    return saved ? JSON.parse(saved) : INITIAL_COOPERATIVES;
  });

  // Cooperative Form States
  const [coopName, setCoopName] = useState('');
  const [craftType, setCraftType] = useState('Cocoa Cultivation');
  const [leadContact, setLeadContact] = useState('');
  const [membersCount, setMembersCount] = useState(5);
  const [coopLocation, setCoopLocation] = useState('');
  const [addSuccess, setAddSuccess] = useState(false);

  const handleCreateCooperative = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coopName.trim() || !leadContact.trim() || !coopLocation.trim()) return;

    const newCoop: YouthCooperative = {
      id: `COOP-${Math.floor(Math.random() * 9000 + 1000)}`,
      name: coopName.trim(),
      craftType,
      leadContact: leadContact.trim(),
      membersCount,
      location: coopLocation.trim(),
      certificationStatus: 'Pending Audit'
    };

    const updated = [...cooperatives, newCoop];
    setCooperatives(updated);
    localStorage.setItem('offinso_cooperatives', JSON.stringify(updated));

    setCoopName('');
    setLeadContact('');
    setCoopLocation('');
    setMembersCount(5);
    setAddSuccess(true);

    setTimeout(() => {
      setAddSuccess(false);
    }, 2500);
  };

  return (
    <div id="offinso-social-dev-portal" className="space-y-8 py-4">
      
      {/* Top Banner Block */}
      <div className="border-b border-zinc-200 pb-5">
        <span className="text-xs text-[#b8860b] font-bold uppercase tracking-widest font-mono">REGIONAL COOPERATIVE REGISTRY</span>
        <h2 className="font-serif text-3xl font-bold text-[#004d40] mt-1">Youth Trade Cooperatives &amp; Craft Alliances</h2>
        <p className="text-zinc-550 text-xs mt-1">
          Cataloging verified smallholder collectives, traditional weavers, and eco-rangers. Register your youth guild to qualify for future regional support funds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
        
        {/* Left Column (7 cols): List of active cooperatives */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
          
          <div className="flex justify-between items-baseline text-xs text-zinc-500 font-mono">
            <p>CERTIFIED COLLECTIVES REGISTRY LEDGER</p>
            <p>Active Guilds: <strong>{cooperatives.length}</strong></p>
          </div>

          <div className="space-y-4">
            {cooperatives.map(coop => (
              <div
                key={coop.id}
                id={`coop-card-${coop.id}`}
                className="bg-white border border-zinc-200 rounded-lg p-5 shadow-2xs hover:shadow-xs transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-zinc-100 text-zinc-650 font-mono px-2 py-0.5 rounded uppercase font-bold leading-none border">
                      {coop.id}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold leading-none border ${
                      coop.certificationStatus === 'Verified'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-100'
                        : 'bg-amber-50 text-amber-800 border-amber-100'
                    }`}>
                      {coop.certificationStatus}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-zinc-900 text-base leading-tight">
                    {coop.name}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-zinc-600 font-medium">
                    <p className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-offinso-gold" /> {coop.craftType}</p>
                    <p className="flex items-center gap-1.5"><Building className="w-4 h-4 text-zinc-400" /> {coop.location}</p>
                    <p className="flex items-center gap-1.5"><Users className="w-4 h-4 text-zinc-400" /> {coop.membersCount} active members</p>
                    <p className="flex items-center gap-1.5"><Award className="w-4 h-4 text-zinc-400" /> Contact Lead: {coop.leadContact}</p>
                  </div>
                </div>

                {coop.certificationStatus === 'Verified' && (
                  <div className="shrink-0 flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-1 text-xs font-mono font-bold">
                    <ShieldCheck className="w-4 h-4" /> SECURE REGISTERED
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>

        {/* Right Column (5 cols): Register a new Cooperative Form */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
          
          <div className="bg-white border border-zinc-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
             <div className="flex items-center gap-2 pb-2 border-b">
               <Building className="w-5 h-5 text-offinso-green-800 shrink-0" />
               <h3 className="font-serif font-bold text-base text-zinc-900">List Your Youth Cooperative</h3>
             </div>

             <p className="text-zinc-500 text-xs leading-relaxed">
                collects local craft guilds or agricultural union groups. Enter details to register your local organization for traditional verification.
             </p>

             {addSuccess ? (
               <div className="py-6 text-center space-y-3">
                 <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                   <ShieldCheck className="w-6 h-6" />
                 </div>
                 <h4 className="font-serif font-bold text-zinc-900 text-sm">Collective Registered for Audit!</h4>
                 <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                   Your youth guild has been added as &quot;Pending Audit&quot;. Verification officers will conduct scheduled field visits within 14 days.
                 </p>
               </div>
             ) : (
               <form onSubmit={handleCreateCooperative} className="space-y-4 text-xs font-medium">
                  
                  <div>
                    <label className="text-zinc-700 block mb-1">Cooperative Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kokote Weavers Association"
                      value={coopName}
                      onChange={(e) => setCoopName(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded px-3 py-2 text-zinc-950 focus:outline-none focus:border-offinso-green-700"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-zinc-700 block mb-1">Industrial Craft Domain</label>
                      <select
                        value={craftType}
                        onChange={(e) => setCraftType(e.target.value)}
                        className="w-full bg-white border border-zinc-300 rounded px-2.5 py-1.5 text-zinc-900 focus:outline-none"
                      >
                        <option value="Cocoa Cultivation">Cocoa Cultivation</option>
                        <option value="Traditional Loom-Weaving">Traditional Loom-Weaving</option>
                        <option value="Ecotourism Guiding">Ecotourism Guiding</option>
                        <option value="Food Stuffs Trading">Food Stuffs Trading</option>
                        <option value="Brick masonry adwin">Brick masonry adwin</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-zinc-700 block mb-1">Active Guild Members</label>
                      <input
                        type="number"
                        min={3}
                        max={100}
                        required
                        value={membersCount}
                        onChange={(e) => setMembersCount(Math.max(3, parseInt(e.target.value) || 3))}
                        className="w-full bg-zinc-50 border border-zinc-300 rounded px-3 py-2 text-zinc-955 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-zinc-700 block mb-1">Lead Contact Person</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Samuel Adjei"
                      value={leadContact}
                      onChange={(e) => setLeadContact(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded px-3 py-2 text-zinc-950 focus:outline-none focus:border-offinso-green-700"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-700 block mb-1">General Office Location / Town</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kokote, Offinso"
                      value={coopLocation}
                      onChange={(e) => setCoopLocation(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded px-3 py-2 text-zinc-950 focus:outline-none focus:border-offinso-green-700"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-offinso-green-800 hover:bg-offinso-green-900 text-white font-bold py-2 rounded uppercase tracking-wider transition cursor-pointer"
                  >
                    Register Guild &amp; Queue Audit
                  </button>

               </form>
             )}

          </div>

          {/* Social Welfare criteria notice */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-5 space-y-3.5 text-xs text-zinc-550 leading-relaxed">
            <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-widest block">AUDIT STANDARDS FOR UNION FUNDING</span>
            <p>
              collectives undergo detailed review processes matching local laws. The audit includes matching membership lists, verifying localized physical workshops inside Offinso, and declaring fair wage parameters for youth apprentices.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
