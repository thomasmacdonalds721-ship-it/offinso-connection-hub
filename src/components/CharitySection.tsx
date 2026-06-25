/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, CheckCircle, Search, Mail, Phone, MapPin, BadgeInfo } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ReliefProgram, ReliefApplication, User } from '../types';

interface CharitySectionProps {
  programs: ReliefProgram[];
  applications: ReliefApplication[];
  onSubmitApplication: (appl: Omit<ReliefApplication, 'id' | 'submittedAt' | 'status' | 'referenceNumber'>) => void;
  searchQuery: string;
  currentUser?: User | null;
}

export default function CharitySection({
  programs,
  applications,
  onSubmitApplication,
  searchQuery,
  currentUser
}: CharitySectionProps) {
  const { t, language } = useLanguage();

  // Tabs: Apply / Track
  const [activeTab, setActiveTab] = useState<'programs' | 'apply' | 'track'>('programs');

  // Form Fields
  const [selectedProgramId, setSelectedProgramId] = useState(programs[0]?.id || '');
  const [applicantName, setApplicantName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [incomeTier, setIncomeTier] = useState('');
  const [descriptionOfNeed, setDescriptionOfNeed] = useState('');
  
  // States
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [generatedRefCode, setGeneratedRefCode] = useState('');
  const [validationError, setValidationError] = useState('');

  // Track / Search State
  const [trackQuery, setTrackQuery] = useState('');
  const [trackResult, setTrackResult] = useState<ReliefApplication[] | null>(null);

  // Sync candidate fields based on current user session
  React.useEffect(() => {
    if (currentUser) {
      setApplicantName(currentUser.fullName);
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  // Filter programs by global search
  const filteredPrograms = programs.filter(prog => {
    const matchesSearch = searchQuery === '' ||
      prog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.eligibility.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleApplyClick = (programId: string) => {
    setSelectedProgramId(programId);
    setActiveTab('apply');
    setValidationError('');
    setSubmissionSuccess(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!applicantName.trim() || !email.trim() || !phone.trim() || !address.trim() || !incomeTier || !descriptionOfNeed.trim()) {
      setValidationError(t('charity.validation_error', 'Please complete all form fields.'));
      return;
    }

    // Call state up
    onSubmitApplication({
      programId: selectedProgramId,
      programName: programs.find(p => p.id === selectedProgramId)?.name || 'General Emergency Relief',
      applicantName: applicantName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      incomeTier,
      descriptionOfNeed: descriptionOfNeed.trim()
    });

    // Simulate generated ref code for confirmation display
    const computedRef = `OFFINSO-RLF-${Math.floor(Math.random() * 90000 + 10000)}`;
    setGeneratedRefCode(computedRef);

    // Reset Form
    setApplicantName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setIncomeTier('');
    setDescriptionOfNeed('');
    setValidationError('');
    setSubmissionSuccess(true);
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = trackQuery.trim().toLowerCase();
    if (!query) {
      setTrackResult([]);
      return;
    }

    // Filter local applications array matching email or reference code
    const results = applications.filter(app => {
      const matchEmail = app.email.toLowerCase() === query;
      const matchRef = app.referenceNumber.toLowerCase() === query || app.referenceNumber.toLowerCase().includes(query);
      const matchName = app.applicantName.toLowerCase().includes(query);
      return matchEmail || matchRef || matchName;
    });

    setTrackResult(results);
  };

  return (
    <div id="offinso-relief-alliance" className="space-y-8 py-4">
      
      {/* Top Banner Block */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-zinc-200 pb-5 gap-4">
        <div>
          <span className="text-xs text-offinso-gold font-bold uppercase tracking-widest font-mono">{t('charity.sub_office', 'Haven Light Charity LBG')}</span>
          <h2 className="font-serif text-3xl font-bold text-offinso-green-900 mt-1">{t('charity.alliance_title', 'Community Relief & Charity Grants')}</h2>
          <p className="text-zinc-550 text-xs mt-1">
            {t('charity.alliance_para', 'Mitigating climate hurdles, smallholder farming shifts, and local startup costs for Offinso families below the poverty line.')}
          </p>
        </div>

        {/* Action Toggle Tabs */}
        <div className="flex bg-zinc-100 rounded-md p-1 border">
          <button
            onClick={() => setActiveTab('programs')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition cursor-pointer ${
              activeTab === 'programs' ? 'bg-white text-offinso-green-900 shadow-2xs font-bold' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            {t('charity.tab_programs', 'Relief Funds')}
          </button>
          <button
            onClick={() => {
              setActiveTab('apply');
              setSubmissionSuccess(false);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition cursor-pointer ${
              activeTab === 'apply' ? 'bg-white text-offinso-green-900 shadow-2xs font-bold' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            {t('charity.tab_apply', 'File Relief Claim')}
          </button>
          <button
            onClick={() => {
              setActiveTab('track');
              setTrackResult(null);
              setTrackQuery('');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition relative cursor-pointer ${
              activeTab === 'track' ? 'bg-white text-offinso-green-900 shadow-2xs font-bold' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            {t('charity.tab_track', 'Track My Grants')}
            {applications.length > 0 && (
              <span className="absolute -top-1 right-0 w-2 h-2 bg-offinso-dirt rounded-full"></span>
            )}
          </button>
        </div>
      </div>

      {/* Assistance Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-xs text-amber-850">
        <Phone className="w-5 h-5 text-amber-600 shrink-0" />
        <div>
          <p className="font-bold">
            {language === 'tw' ? 'Sɛ wo hia mmoa wɔ afasɔ mu a?' : 'Need Help Applying?'}
          </p>
          <p className="mt-0.5">
            {language === 'tw' 
              ? 'Sɛ wo hia mmoa wɔ afasɔ mu a, wobɛtumi abɔ fon nɔma, a ɛne 0249560120.'
              : 'If you need help applying, we can contact their phone number, which is 0249560120.'
            }
          </p>
        </div>
      </div>

      {/* Tabs Router */}
      {activeTab === 'programs' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Column Description */}
          <div className="space-y-4">
            <div className="bg-offinso-green-900 text-white p-5 rounded-lg border border-offinso-green-800">
              <h4 className="font-serif font-bold text-base text-offinso-gold mb-2">{t('charity.empowering', 'Empowering Local Communities')}</h4>
              <p className="text-xs leading-relaxed text-zinc-200">
                {t('charity.empowering_text', 'This program is administered by Haven Light Charity LBG, which manages community relief funds to ensure safe distribution.')}
              </p>
            </div>

            <div className="bg-white border p-5 rounded-lg text-xs space-y-2 text-zinc-505 dark:text-zinc-300">
              <span className="text-[10px] font-mono text-offinso-gold font-bold uppercase tracking-wider">{t('charity.required_dossiers', 'Required Dossiers')}</span>
              <p className="leading-relaxed">
                {t('charity.required_dossiers_text', 'Generally, applying requires proof of residence in Offinso, documented household income brackets, and an assessment narrative detailing your emergency status.')}
              </p>
            </div>
          </div>

          {/* Right 3 Columns: Relief List */}
          <div className="lg:col-span-3 space-y-4">
            
            <div className="flex justify-between items-baseline text-xs text-zinc-500 font-mono">
              <p>ACTIVE EMERGENCY ASSISTANCE MEASURES</p>
              <p>Found {filteredPrograms.length} programs</p>
            </div>

            {filteredPrograms.length === 0 ? (
              <div className="bg-white border rounded-lg p-12 text-center text-zinc-500">
                {t('charity.no_records', 'No programs found matching filters.')}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPrograms.map((prog) => {
                  let pName = prog.name;
                  let pDesc = prog.description;
                  let pElig = prog.eligibility;

                  if (language === 'tw') {
                    if (prog.id === 'rp_1') {
                      pName = 'Low income family Food Stamps';
                      pDesc = 'Aduane mmoa sika krataa kɛseɛ na ɛmma amansin hiafoɔ abusua nyinaa bekyɛ aduane foforɔ.';
                      pElig = 'Ɛwɔ sɛ wobɛkyerɛ Offinso resident card.';
                    } else if (prog.id === 'rp_2') {
                      pName = 'Entry Fee for trading school Rebate';
                      pDesc = 'Sukuu mmoa sika firi Offinso ankorɛankorɛ mma sukuufo foforɔ.';
                      pElig = 'Sukuufo nyinaa a wɔkyerɛw din foforo.';
                    } else if (prog.id === 'rp_3') {
                      pName = 'Small grants for youth entreprenuers in TRADE';
                      pDesc = 'Boa adwumfoɔ foforɔ ma wɔanya sika mmoa firi private registry.';
                      pElig = 'Offinso amansin manfoɔ pɛpɛɛpɛ a wonni sika pii.';
                    } else if (prog.id === 'rp_4') {
                      pName = 'School Supplies for the Low Income Families';
                      pDesc = 'Sukuu nneɛma mmoa ama mmofra a wɔn mmusua firi mmusua a wonni sika pii mu.';
                      pElig = 'Mmusua a wɔn mma kɔ primary anaa JHS firi Offinso.';
                    }
                  }

                  return (
                    <div
                      key={prog.id}
                      id={`relief-program-${prog.id}`}
                      className="bg-white border-l-4 border-offinso-green-700 border-zinc-200 rounded-r-lg border p-5 shadow-2xs hover:shadow-xs transition flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <span className="text-[10px] font-mono bg-offinso-green-50 text-offinso-green-700 px-2 py-0.5 rounded font-bold border border-offinso-green-100 uppercase">
                          {prog.reliefAmount}
                        </span>
                        <h4 className="font-serif font-bold text-base text-zinc-900 leading-tight">
                          {pName}
                        </h4>
                        <p className="text-zinc-650 text-xs leading-relaxed">
                          {pDesc}
                        </p>
                        
                        <div className="bg-zinc-50 p-3 rounded border border-zinc-150 text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                          <strong>Criteria:</strong> {pElig}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-zinc-100 mt-4 flex justify-end">
                        <button
                          onClick={() => handleApplyClick(prog.id)}
                          className="bg-offinso-green-800 hover:bg-offinso-green-900 text-white font-bold text-xs px-4 py-1.5 rounded transition uppercase tracking-wider cursor-pointer"
                        >
                          {t('global.apply_now', 'Apply Now')}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

      {/* Place/File Request Tab */}
      {activeTab === 'apply' && (
        <div className="max-w-3xl mx-auto bg-white border border-zinc-200 rounded-lg p-6 sm:p-8 shadow-xs">
          
          <div className="border-b pb-4 mb-6">
            <h3 className="font-serif font-bold text-xl text-offinso-green-900">{t('charity.claim_title', 'File a Community Relief Claim')}</h3>
            <p className="text-zinc-550 text-xs mt-1">
              {t('charity.claim_para', 'Submit structured claims for certified micro-grants. Approved bursaries are paid directly via mobile capital transfers.')}
            </p>
          </div>

          {submissionSuccess ? (
            <div className="space-y-4 py-8 text-center text-zinc-850 font-sans">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 animate-bounce text-emerald-600" />
              </div>
              <h4 className="font-serif font-bold text-lg">{t('charity.claim_success', 'Social Benefit Claim Registered!')}</h4>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
                {t('charity.claim_success_msg', 'Your claim has been logged inside our ledger. Please record your reference code for tracking: {ref}', { ref: generatedRefCode })}
              </p>
              
              <div className="bg-zinc-50 border p-3 max-w-xs mx-auto rounded font-mono text-center">
                <span className="text-[10px] text-zinc-400 block uppercase font-sans">{t('charity.claim_ref', 'Reference Tracker Code')}</span>
                <span className="text-sm font-bold text-offinso-green-900 font-mono">{generatedRefCode || 'OFS-RLF-XXXX'}</span>
              </div>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('track');
                    setTrackQuery(generatedRefCode);
                    const results = applications.filter(app => app.referenceNumber === generatedRefCode);
                    setTrackResult(results);
                  }}
                  className="bg-offinso-green-700 text-white font-bold text-xs px-4 py-2 rounded shadow-2xs hover:bg-offinso-green-800 cursor-pointer"
                >
                  Track Dossier Live
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSubmissionSuccess(false);
                    setActiveTab('programs');
                  }}
                  className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold text-xs px-4 py-2 rounded cursor-pointer"
                >
                  Return to Programs
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-sans">
              
              {/* Program selection */}
              <div>
                <label className="font-semibold text-zinc-700 block mb-1">{t('charity.form_program', 'Select Target Fund Program')}</label>
                <select
                  className="w-full bg-zinc-50 border border-zinc-300 rounded text-xs px-2.5 py-2 text-zinc-900 focus:outline-none focus:border-offinso-green-700"
                  value={selectedProgramId}
                  onChange={(e) => setSelectedProgramId(e.target.value)}
                >
                  {programs.map((prog) => {
                    let pName = prog.name;
                    if (language === 'tw') {
                      if (prog.id === 'rp_1') pName = 'Low income family Food Stamps';
                      if (prog.id === 'rp_2') pName = 'Entry Fee for trading school Rebate';
                      if (prog.id === 'rp_3') pName = 'Small grants for youth entreprenuers in TRADE';
                      if (prog.id === 'rp_4') pName = 'School Supplies for the Low Income Families';
                    }
                    return (
                      <option key={prog.id} value={prog.id}>
                        {pName} ({prog.reliefAmount})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Contact section */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Kofi Mensah"
                    className="w-full bg-zinc-50 border border-zinc-300 rounded text-xs px-3 py-2 text-zinc-900 focus:outline-none focus:border-offinso-green-700"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g., kofi@offinso.com"
                    className="w-full bg-zinc-50 border border-zinc-300 rounded text-xs px-3 py-2 text-zinc-900 focus:outline-none focus:border-offinso-green-700"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g., 0244-123-456"
                    className="w-full bg-zinc-50 border border-zinc-300 rounded text-xs px-3 py-2 text-zinc-900 focus:outline-none focus:border-offinso-green-700"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Physical Address</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., OP/24 Kokote, Offinso"
                    className="w-full bg-zinc-50 border border-zinc-300 rounded text-xs px-3 py-2 text-zinc-900 focus:outline-none focus:border-offinso-green-700"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">{t('charity.form_income', 'Gross Annual Income Level')}</label>
                  <select
                    required
                    className="w-full bg-zinc-50 border border-zinc-300 rounded text-xs px-2.5 py-2 text-zinc-900 focus:outline-none focus:border-offinso-green-700"
                    value={incomeTier}
                    onChange={(e) => setIncomeTier(e.target.value)}
                  >
                    <option value="">-- Choose annual income --</option>
                    <option value="Under GH₵ 5,000">Under GH₵ 5,000 per annum</option>
                    <option value="GH₵ 5,000 - GH₵ 15,000">GH₵ 5,000 - GH₵ 15,000 per annum</option>
                    <option value="GH₵ 15,000 - GH₵ 30,000">GH₵ 15,000 - GH₵ 30,000 per annum</option>
                    <option value="Over GH₵ 30,000">Over GH₵ 30,000 per annum</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">{t('charity.form_desc', 'Assessment Narrative & Proof of Emergency')}</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Outline the farming hardships, cocoa seasonal yields, or business goals you represent..."
                  className="w-full bg-zinc-50 border border-zinc-300 rounded text-xs px-3 py-2 text-zinc-900 focus:outline-none focus:border-offinso-green-700"
                  value={descriptionOfNeed}
                  onChange={(e) => setDescriptionOfNeed(e.target.value)}
                />
              </div>

              {validationError && (
                <div className="bg-red-50 text-red-700 text-xs p-2.5 rounded border border-red-200 mt-2 font-medium flex items-start gap-1.5 leading-snug">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{validationError}</span>
                </div>
              )}

              <div className="pt-4 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('programs')}
                  className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold px-4 py-2 rounded text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-offinso-green-800 hover:bg-offinso-green-900 text-white font-bold px-5 py-2 rounded text-xs uppercase tracking-wider cursor-pointer"
                >
                  {t('global.submit', 'Submit')}
                </button>
              </div>

            </form>
          )}

        </div>
      )}

      {/* Tracking Search Console Tab */}
      {activeTab === 'track' && (
        <div className="max-w-3xl mx-auto space-y-6">
          
          <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-xs">
            <h4 className="font-serif font-bold text-lg text-zinc-900 pb-2 border-b">
              {t('charity.track_title', 'Track Relief Applications')}
            </h4>
            <p className="text-zinc-500 text-xs mt-1 mb-4 leading-relaxed">
              {t('charity.track_para', 'Query your benefit application progress using your email address or unique tracking number.')}
            </p>

            <form onSubmit={handleTrackSubmit} className="flex gap-2 font-sans text-xs">
              <input
                type="text"
                placeholder={t('charity.track_query_placeholder', 'e.g., kofi@offinso.com or OFS-RLF-189')}
                required
                className="bg-zinc-50 border border-zinc-300 rounded text-xs px-3 py-2 flex-1 focus:outline-none focus:border-offinso-green-700"
                value={trackQuery}
                onChange={(e) => setTrackQuery(e.target.value)}
              />
              <button
                type="submit"
                className="bg-offinso-green-800 hover:bg-offinso-green-900 text-white font-bold text-xs px-4 py-2 rounded transition uppercase tracking-wider flex items-center gap-1 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" /> {t('charity.track_btn', 'Query Progress')}
              </button>
            </form>
          </div>

          <AnimatePresence>
            {trackResult !== null && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <p className="text-xs text-zinc-500 font-mono">RETRIEVED AUDIT MATCHES ({trackResult.length})</p>

                {trackResult.length === 0 ? (
                  <div className="bg-white border rounded-lg p-8 text-center text-zinc-500 text-xs italic">
                    No matching relief files found.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {trackResult.map((app) => {
                      let prName = app.programName;
                      if (language === 'tw') {
                        if (app.programId === 'rp_1') prName = 'Low income family Food Stamps';
                        if (app.programId === 'rp_2') prName = 'Entry Fee for trading school Rebate';
                        if (app.programId === 'rp_3') prName = 'Small grants for youth entreprenuers in TRADE';
                        if (app.programId === 'rp_4') prName = 'School Supplies for the Low Income Families';
                      }

                      return (
                        <div 
                          key={app.id} 
                          className="bg-white border border-zinc-200 rounded-lg p-5 shadow-2xs text-xs space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b pb-2">
                             <div>
                               <span className="text-[10px] text-zinc-400 font-mono font-bold block uppercase leading-none">Reference file</span>
                               <span className="font-mono text-xs font-bold text-zinc-850">{app.referenceNumber}</span>
                             </div>
                             
                             {/* Live Status styling depending on status */}
                             <div className="flex items-center gap-2">
                               <span className="text-[10px] text-zinc-400 font-medium">{t('charity.status_label', 'Resident Status')}:</span>
                               <span className={`font-mono text-[10.5px] font-bold px-2 py-0.5 rounded border uppercase leading-none ${
                                 app.status === 'Approved' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' :
                                 app.status === 'Under Review' ? 'bg-amber-50 text-amber-800 border-amber-100' :
                                 'bg-zinc-50 text-zinc-850 border-zinc-200'
                               }`}>
                                 {app.status}
                               </span>
                             </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <span className="text-zinc-400 text-[10px] uppercase font-bold block leading-none mb-1">Applicant</span>
                              <h5 className="font-bold text-zinc-900 text-sm">{app.applicantName}</h5>
                              <p className="text-zinc-500">{app.email} • {app.phone}</p>
                              <p className="text-zinc-400 font-medium mt-1">{app.address}</p>
                            </div>
                            <div>
                              <span className="text-zinc-400 text-[10px] uppercase font-bold block leading-none mb-1">Requested Program Support</span>
                              <h5 className="font-bold text-offinso-green-900 text-sm">{prName}</h5>
                              <p className="text-zinc-550 font-mono mt-1">Income segment: {app.incomeTier}</p>
                            </div>
                          </div>

                          {app.descriptionOfNeed && (
                            <div className="bg-zinc-50 p-3 rounded border">
                              <span className="text-zinc-400 text-[9px] uppercase font-bold block mb-1">Assessment Overviews</span>
                              <p className="text-zinc-650 leading-relaxed italic">{app.descriptionOfNeed}</p>
                            </div>
                          )}

                          <div className="pt-2 text-[10.5px] text-zinc-400 font-mono flex flex-wrap justify-between gap-2 border-t mt-4">
                            <span>Security Code: Authorized SHA-256</span>
                            <span>Filing registered: {new Date(app.submittedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      )}

    </div>
  );
}
