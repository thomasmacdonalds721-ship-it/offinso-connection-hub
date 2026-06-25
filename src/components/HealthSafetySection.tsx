/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HeartPulse, Stethoscope, ClipboardList, ShieldAlert, BadgeCheck, Phone, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function HealthSafetySection() {
  const { t, language } = useLanguage();

  // Symptom checker form state
  const [fever, setFever] = useState(false);
  const [headache, setHeadache] = useState(false);
  const [chills, setChills] = useState(false);
  const [vomiting, setVomiting] = useState(false);
  const [fatigue, setFatigue] = useState(false);
  const [soreThroat, setSoreThroat] = useState(false);
  const [respiratory, setRespiratory] = useState(false);

  // Diagnostic result state
  const [assessmentCalculated, setAssessmentCalculated] = useState(false);
  const [calculatedRisk, setCalculatedRisk] = useState<'Low' | 'Medium' | 'High'>('Low');
  const [suspectedConditions, setSuspectedConditions] = useState<string[]>([]);

  // Emergency contact simulation
  const [emergencyAlertSent, setEmergencyAlertSent] = useState(false);
  const [residentPhone, setResidentPhone] = useState('');
  const [residentLocation, setResidentLocation] = useState('');

  // Checklist of basic guidelines
  const [guide1Completed, setGuide1Completed] = useState(false);
  const [guide2Completed, setGuide2Completed] = useState(false);
  const [guide3Completed, setGuide3Completed] = useState(false);
  const [guide4Completed, setGuide4Completed] = useState(false);

  // Evaluate risk level on form submission
  const handleCheckSymptoms = (e: React.FormEvent) => {
    e.preventDefault();

    let score = 0;
    const activeSymptoms: string[] = [];

    if (fever) { score += 35; activeSymptoms.push('High Fever (above 38.5°C)'); }
    if (headache) { score += 15; activeSymptoms.push('Severe Migraine / Headache'); }
    if (chills) { score += 20; activeSymptoms.push('Sweating & Chills'); }
    if (vomiting) { score += 25; activeSymptoms.push('Nausea / Vomiting'); }
    if (fatigue) { score += 10; activeSymptoms.push('General Fatigue'); }
    if (soreThroat) { score += 10; activeSymptoms.push('Sore throat'); }
    if (respiratory) { score += 30; activeSymptoms.push('Respiratory shortness of breath'); }

    let risk: 'Low' | 'Medium' | 'High' = 'Low';
    if (score >= 60) risk = 'High';
    else if (score >= 30) risk = 'Medium';

    const conditions: string[] = [];
    if (fever && chills && headache && fatigue) {
      conditions.push('Malaria (highly endemic in Offinso District)');
    }
    if (fever && soreThroat && headache && vomiting) {
      conditions.push('Typhoid Fever (associated with clean water sanitation levels)');
    }
    if (respiratory && fever && soreThroat) {
      conditions.push('Respiratory Infection (Bronchitis / Influenza)');
    }
    if (conditions.length === 0 && score > 0) {
      conditions.push('General Bacterial / Viral Infection');
    }

    setCalculatedRisk(risk);
    setSuspectedConditions(conditions);
    setAssessmentCalculated(true);
  };

  const handleResetChecker = () => {
    setFever(false);
    setHeadache(false);
    setChills(false);
    setVomiting(false);
    setFatigue(false);
    setSoreThroat(false);
    setRespiratory(false);
    setAssessmentCalculated(false);
    setSuspectedConditions([]);
  };

  const handleSendEmergencyAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!residentPhone.trim() || !residentLocation.trim()) return;

    setEmergencyAlertSent(true);
    setTimeout(() => {
      setEmergencyAlertSent(false);
      setResidentPhone('');
      setResidentLocation('');
    }, 3500);
  };

  return (
    <div id="offinso-health-safety-hub" className="space-y-8 py-4">
      
      {/* Top Banner Block */}
      <div className="border-b border-zinc-200 pb-5">
        <span className="text-xs text-rose-600 font-bold uppercase tracking-widest font-mono">HEALTH &amp; SOCIAL SERVICES DIVISION</span>
        <h2 className="font-serif text-3xl font-bold text-offinso-green-900 mt-1">Offinso Municipal Public Health &amp; Clinic Advisor</h2>
        <p className="text-zinc-550 text-xs mt-1">
          Review preventive guidelines for regional tropical diseases, calculate emergency risk metrics, and trigger simulated dispatch coordinates to Offinso Municipal Hospital.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
        
        {/* Left column (7 cols): Symptom Assessment Console */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
          
          <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-2xs space-y-4">
            
            <div className="flex items-center gap-2 pb-3 border-b">
              <Stethoscope className="w-5 h-5 text-rose-500 shrink-0" />
              <div>
                <h3 className="font-serif font-bold text-lg text-zinc-900">Tropical Disease Risk-Level Assessor</h3>
                <p className="text-[11px] text-zinc-400">Evaluate regional fever symptoms for immediate clinical guidance.</p>
              </div>
            </div>

            {assessmentCalculated ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-5"
              >
                {/* Risk Banner styling */}
                <div className={`p-5 rounded-lg border flex items-start gap-4 ${
                  calculatedRisk === 'High' ? 'bg-red-50 border-red-200 text-red-900' :
                  calculatedRisk === 'Medium' ? 'bg-amber-50 border-amber-200 text-amber-900' :
                  'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}>
                  <ShieldAlert className={`w-10 h-10 shrink-0 mt-0.5 ${
                    calculatedRisk === 'High' ? 'text-red-600 animate-bounce' :
                    calculatedRisk === 'Medium' ? 'text-amber-600' :
                    'text-emerald-600'
                  }`} />
                  <div className="space-y-1">
                    <p className="text-xs font-bold font-mono tracking-wider uppercase">ASSESSMENT CONCLUSION</p>
                    <h4 className="text-xl font-bold font-serif leading-none">
                      {calculatedRisk === 'High' ? 'CRITICAL RISK DETECTED' :
                       calculatedRisk === 'Medium' ? 'MODERATE CLINICAL RISK' :
                       'MILD / LOW DISCOMFORT RISK'}
                    </h4>
                    <p className="text-xs leading-relaxed opacity-90">
                      {calculatedRisk === 'High' 
                        ? 'Your symptom combination indicates severe systemic fever. Immediate consultation at Offinso Municipal Hospital or Kokote Polyclinic is strongly advised.'
                        : calculatedRisk === 'Medium'
                        ? 'Moderate indicator scores. Keep monitored, consume boiled drinking water, and consult a local pharmacist if symptoms persist beyond 48 hours.'
                        : 'Symptoms are within safe ranges. Ensure standard rest, stay hydrated, and practice personal hygiene guards.'}
                    </p>
                  </div>
                </div>

                {/* Suspected conditions list */}
                {suspectedConditions.length > 0 && (
                  <div className="space-y-2 text-xs">
                    <h5 className="font-bold text-zinc-800 uppercase tracking-wide">Potential Regional Etiologies:</h5>
                    <ul className="space-y-1.5 font-medium">
                      {suspectedConditions.map((cond, index) => (
                        <li key={index} className="flex items-center gap-2 bg-zinc-50 border rounded-md p-2.5 text-zinc-700">
                          <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0"></span>
                          <span>{cond}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleResetChecker}
                    className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs px-4 py-2 rounded-lg transition uppercase tracking-wider cursor-pointer"
                  >
                    Clear Checker
                  </button>
                  {calculatedRisk === 'High' && (
                    <button
                      onClick={() => {
                        const contactEl = document.getElementById('emergency-dispatch-form');
                        if (contactEl) contactEl.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition uppercase tracking-wider cursor-pointer"
                    >
                      Emergency Dispatch Form
                    </button>
                  )}
                </div>

              </motion.div>
            ) : (
              <form onSubmit={handleCheckSymptoms} className="space-y-4 text-xs font-medium">
                
                <p className="text-zinc-500 leading-relaxed text-[11.5px]">
                  Check the symptoms currently being experienced by the patient. Our assessor compiles real-time weights based on historic regional epidemic thresholds.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-zinc-50 p-4 rounded-lg border border-zinc-150">
                  
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={fever}
                      onChange={(e) => setFever(e.target.checked)}
                      className="rounded border-zinc-300 text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
                    />
                    <span>High Fever (Body Temp &gt; 38°C)</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={headache}
                      onChange={(e) => setHeadache(e.target.checked)}
                      className="rounded border-zinc-300 text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
                    />
                    <span>Severe Migraine / Headache</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={chills}
                      onChange={(e) => setChills(e.target.checked)}
                      className="rounded border-zinc-300 text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
                    />
                    <span>Profuse Sweating / Chills</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={vomiting}
                      onChange={(e) => setVomiting(e.target.checked)}
                      className="rounded border-zinc-300 text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
                    />
                    <span>Frequent Nausea / Vomiting</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={fatigue}
                      onChange={(e) => setFatigue(e.target.checked)}
                      className="rounded border-zinc-300 text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
                    />
                    <span>Joint Pain &amp; General Fatigue</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={soreThroat}
                      onChange={(e) => setSoreThroat(e.target.checked)}
                      className="rounded border-zinc-300 text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
                    />
                    <span>Dry Cough / Sore Throat</span>
                  </label>

                  <label className="flex items-center gap-2.5 sm:col-span-2 cursor-pointer select-none pt-2 border-t border-zinc-150">
                    <input
                      type="checkbox"
                      checked={respiratory}
                      onChange={(e) => setRespiratory(e.target.checked)}
                      className="rounded border-zinc-300 text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
                    />
                    <span className="font-semibold text-rose-700">Difficulty Breathing / Acute Respiratory Shortness</span>
                  </label>

                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-5 rounded-lg uppercase tracking-wider transition cursor-pointer"
                  >
                    Analyze Symptoms
                  </button>
                </div>

              </form>
            )}

          </div>

          {/* Guidelines Interactive List Checklist */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-2xs space-y-4">
             <div className="flex items-center gap-2 pb-2 border-b">
               <ClipboardList className="w-5 h-5 text-offinso-green-800 shrink-0" />
               <h3 className="font-serif font-bold text-lg text-zinc-900">Hygiene &amp; Safety Compliance Checklist</h3>
             </div>

             <p className="text-zinc-550 text-xs">
               Review and complete these essential safety protocols recommended by regional health guides for sustainable water management.
             </p>

             <div className="space-y-3 text-xs text-zinc-700 font-medium">
                
                {/* Rule 1 */}
                <div 
                  onClick={() => setGuide1Completed(!guide1Completed)}
                  className={`border rounded-lg p-3.5 flex items-start gap-3.5 transition cursor-pointer ${
                    guide1Completed ? 'bg-emerald-50 border-emerald-200' : 'bg-zinc-50 hover:bg-zinc-100'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                    guide1Completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-zinc-300'
                  }`}>
                    {guide1Completed && <BadgeCheck className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900">1. Boil All Well &amp; River Water</h4>
                    <p className="text-[11px] text-zinc-505 mt-0.5">Ensure all drinking and cooking water is boiled at a rolling boil for at least 1 minute to neutralize bacterial pathogens.</p>
                  </div>
                </div>

                {/* Rule 2 */}
                <div 
                  onClick={() => setGuide2Completed(!guide2Completed)}
                  className={`border rounded-lg p-3.5 flex items-start gap-3.5 transition cursor-pointer ${
                    guide2Completed ? 'bg-emerald-50 border-emerald-200' : 'bg-zinc-50 hover:bg-zinc-100'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                    guide2Completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-zinc-300'
                  }`}>
                    {guide2Completed && <BadgeCheck className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900">2. Secure Malaria Net Protection</h4>
                    <p className="text-[11px] text-zinc-505 mt-0.5">Always sleep under insecticide-treated bednets, particularly during the wet cocoa planting seasonal transitions.</p>
                  </div>
                </div>

                {/* Rule 3 */}
                <div 
                  onClick={() => setGuide3Completed(!guide3Completed)}
                  className={`border rounded-lg p-3.5 flex items-start gap-3.5 transition cursor-pointer ${
                    guide3Completed ? 'bg-emerald-50 border-emerald-200' : 'bg-zinc-50 hover:bg-zinc-100'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                    guide3Completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-zinc-300'
                  }`}>
                    {guide3Completed && <BadgeCheck className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900">3. Wash Hands Prior to Food Preparation</h4>
                    <p className="text-[11px] text-zinc-505 mt-0.5">Wash hands with antibacterial soap or clean ash water prior to handling farm cassava, yams, or maize crops.</p>
                  </div>
                </div>

                {/* Rule 4 */}
                <div 
                  onClick={() => setGuide4Completed(!guide4Completed)}
                  className={`border rounded-lg p-3.5 flex items-start gap-3.5 transition cursor-pointer ${
                    guide4Completed ? 'bg-emerald-50 border-emerald-200' : 'bg-zinc-50 hover:bg-zinc-100'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                    guide4Completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-zinc-300'
                  }`}>
                    {guide4Completed && <BadgeCheck className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900">4. Safe Disposal of Agricultural Waste</h4>
                    <p className="text-[11px] text-zinc-505 mt-0.5">Do not store wet farm compost next to water collection barrels to block bacterial leachates.</p>
                  </div>
                </div>

             </div>
          </div>

        </div>

        {/* Right column (5 cols): Emergency Medical Dispatch & Info */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
          
          {/* Dispatch console form */}
          <div className="bg-white border-2 border-rose-500 rounded-lg p-5 sm:p-6 shadow-2xs space-y-4" id="emergency-dispatch-form">
            
            <div className="flex items-center gap-2 pb-2 border-b border-rose-100">
              <Phone className="w-5 h-5 text-rose-500 shrink-0" />
              <h3 className="font-serif font-bold text-base text-zinc-900">Emergency Dispatch Simulator</h3>
            </div>

            <p className="text-zinc-500 text-xs leading-relaxed">
              In severe malaria or typhoid crisis, immediately submit your location metrics to trigger simulated medical clinic notifications.
            </p>

            {emergencyAlertSent ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto animate-ping">
                  <HeartPulse className="w-6 h-6 text-rose-600" />
                </div>
                <h4 className="font-serif font-bold text-rose-700">Dispatch Warning Triggered!</h4>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
                  Notification with coordinates logged. Responding unit has been routed to your registered location for emergency transportation.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendEmergencyAlert} className="space-y-4 text-xs">
                
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Direct Call Line</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +233 54 123 456"
                    value={residentPhone}
                    onChange={(e) => setResidentPhone(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded text-xs px-3 py-2 text-zinc-900 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-zinc-700 block mb-1">Specific Community Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kokote, Near Methodist JHS"
                    value={residentLocation}
                    onChange={(e) => setResidentLocation(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded text-xs px-3 py-2 text-zinc-900 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 rounded uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1"
                >
                  <HeartPulse className="w-4 h-4 text-white" />
                  Dispatch Response Ambulance
                </button>

              </form>
            )}

          </div>

          {/* Hospital Contacts Card */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-5 text-xs space-y-3.5">
            <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-widest block">DISTRICT EMERGENCY CLINICS</span>
            
            <div className="space-y-2 text-zinc-650">
              <div className="border-b pb-2">
                <h5 className="font-bold text-zinc-900">Offinso Municipal Hospital</h5>
                <p>Location: Central Government Rd, Offinso Town</p>
                <p className="font-mono text-[10.5px] text-zinc-500 mt-0.5">Emergency Line: +233 (0) 32 209 1122</p>
              </div>
              
              <div className="border-b pb-2">
                <h5 className="font-bold text-zinc-900">Kokote Polyclinic</h5>
                <p>Location: Kokote High Street, Offinso</p>
                <p className="font-mono text-[10.5px] text-zinc-500 mt-0.5">Emergency Line: +233 (0) 32 209 1155</p>
              </div>

              <div>
                <h5 className="font-bold text-zinc-900">Abofour Health Center</h5>
                <p>Location: Abofour Market Road, Offinso North</p>
                <p className="font-mono text-[10.5px] text-zinc-500 mt-0.5">Emergency Line: +233 (0) 32 209 1199</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
