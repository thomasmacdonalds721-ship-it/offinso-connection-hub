/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sprout, 
  Leaf, 
  CloudRain, 
  Info, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  Legend, 
  CartesianGrid 
} from 'recharts';

// Projected cocoa harvest datasets for Recharts
const HARVEST_TREND_DATA = [
  { month: 'May', harvestYld: 320, rainfallMm: 160 },
  { month: 'Jun', harvestYld: 410, rainfallMm: 220 },
  { month: 'Jul', harvestYld: 380, rainfallMm: 185 },
  { month: 'Aug', harvestYld: 290, rainfallMm: 110 },
  { month: 'Sep', harvestYld: 480, rainfallMm: 240 },
  { month: 'Oct', harvestYld: 540, rainfallMm: 190 }
];

export default function AgricSectorSection() {
  const { t, language } = useLanguage();

  // Selected crop for calculation
  const [selectedCrop, setSelectedCrop] = useState<'cocoa' | 'plantain' | 'cassava'>('cocoa');

  // Input metrics
  const [farmAcres, setFarmAcres] = useState(2);
  const [expectedRainDays, setExpectedRainDays] = useState(12);
  const [fertilizerBags, setFertilizerBags] = useState(4);

  // Result metrics
  const [yieldCalculated, setYieldCalculated] = useState(false);
  const [predictedYieldKg, setPredictedYieldKg] = useState(0);
  const [agriAdvice, setAgriAdvice] = useState('');

  // Handle calculator submission
  const handleCalculateAgriYield = (e: React.FormEvent) => {
    e.preventDefault();

    if (farmAcres < 1 || expectedRainDays < 0 || fertilizerBags < 0) return;

    let baseYieldPerAcre = 400; // cocoa standard kg
    if (selectedCrop === 'plantain') baseYieldPerAcre = 1200; // bunches
    if (selectedCrop === 'cassava') baseYieldPerAcre = 1800; // kg

    // Multipliers
    const fertilizerMultiplier = 1 + (fertilizerBags * 0.08); // 8% gain per bag (diminishing return model)
    const rainfallAdjustment = expectedRainDays > 20 
      ? 0.85 // oversaturated water yields lower cocoa
      : expectedRainDays < 5 
      ? 0.70 // drought
      : 1.15; // perfect rain range 10-18 days

    const finalYield = Math.round(farmAcres * baseYieldPerAcre * fertilizerMultiplier * rainfallAdjustment);
    setPredictedYieldKg(finalYield);

    // Advisory strings
    let advisory = '';
    if (selectedCrop === 'cocoa') {
      if (expectedRainDays > 20) {
        advisory = 'High rainfall levels detected. Watch for black pod fungal disease. Ensure robust canopy pruning to allow safe sunlight penetration and air circulation.';
      } else if (expectedRainDays < 5) {
        advisory = 'Drought risk detected. Prioritize mulching using dry cocoa leaves around sapling roots to block critical evaporation paths.';
      } else {
        advisory = 'Perfect weather coordinates. Your fertilizer distribution matches seasonal curves. Maintain active weed clearing cycles to guarantee maximum pod weight.';
      }
    } else if (selectedCrop === 'plantain') {
      advisory = 'Ensure robust soil nitrogen. Weed around the sucker roots carefully, and harvest immediately upon color shift to optimize market transportation lifespans.';
    } else {
      advisory = 'Cassava stands are highly drought resistant but prone to rot in waterlogged lowlands. Keep mounds high and harvest systematically.';
    }

    setAgriAdvice(advisory);
    setYieldCalculated(true);
  };

  const handleResetYieldCalculators = () => {
    setFarmAcres(2);
    setExpectedRainDays(12);
    setFertilizerBags(4);
    setYieldCalculated(false);
  };

  return (
    <div id="offinso-agriculture-hub" className="space-y-8 py-4">
      
      {/* Top Banner Block */}
      <div className="border-b border-zinc-200 pb-5">
        <span className="text-xs text-offinso-gold font-bold uppercase tracking-widest font-mono">AGRICULTURAL SERVICES OFFICE</span>
        <h2 className="font-serif text-3xl font-bold text-[#004d40] mt-1">Offinso Cocoa &amp; Smallholder Farming Advisory</h2>
        <p className="text-zinc-550 text-xs mt-1">
          Review municipal cocoa crop yield advisories, calculate projected harvest metrics based on fertilizer weights, and monitor real-time monthly rain forecasts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
        
        {/* Left column (7 cols): Yield Multiplier Calculator & Advisory */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
          
          <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-2xs space-y-4">
            
            <div className="flex items-center gap-2 pb-3 border-b">
              <Sprout className="w-5 h-5 text-offinso-green-800 shrink-0" />
              <div>
                <h3 className="font-serif font-bold text-lg text-zinc-900">Agro-Crop Yield Diagnostic Calculator</h3>
                <p className="text-[11px] text-zinc-405">Optimize fertilizer use and weather inputs to estimate organic crop yields.</p>
              </div>
            </div>

            {yieldCalculated ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-5 text-xs"
              >
                {/* Simulated projection card */}
                <div className="bg-offinso-green-950 text-white rounded-lg p-5 border border-offinso-green-800 flex justify-between items-center relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-1/4 translate-x-1/8">
                    <Leaf className="w-40 h-40" />
                  </div>

                  <div className="space-y-1 relative z-10">
                    <span className="text-[9px] font-mono uppercase text-[#efbf12] font-extrabold tracking-wider block">PROJECTED ORGANIC HARVEST</span>
                    <h4 className="font-serif text-3xl font-bold">
                      {predictedYieldKg} {selectedCrop === 'plantain' ? 'Bunches' : 'kg'}
                    </h4>
                    <p className="text-[11px] text-zinc-300">
                      Based on {farmAcres} farm acres with {fertilizerBags} fertilizer bag(s) applied.
                    </p>
                  </div>

                  <div className="shrink-0 bg-offinso-green-905 border border-[#efbf12]/40 rounded-full w-12 h-12 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-[#efbf12]" />
                  </div>
                </div>

                {/* Live Advisor guidance */}
                <div className="bg-zinc-50 border p-4 rounded-lg space-y-2">
                  <span className="text-zinc-400 text-[10px] uppercase font-mono font-bold block flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-offinso-gold" /> MUNICIPAL EXTENSION ADVISORY
                  </span>
                  <p className="text-zinc-700 leading-relaxed font-semibold">
                    &quot;{agriAdvice}&quot;
                  </p>
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    onClick={handleResetYieldCalculators}
                    className="bg-zinc-100 hover:bg-zinc-200 text-zinc-750 font-bold text-xs px-4 py-2 rounded-lg transition uppercase tracking-wider cursor-pointer"
                  >
                    Recalculate Yields
                  </button>
                </div>

              </motion.div>
            ) : (
              <form onSubmit={handleCalculateAgriYield} className="space-y-4 text-xs font-medium">
                
                <p className="text-zinc-500 leading-relaxed text-[11.5px]">
                  Calculate projected crop outputs. Our database factors in typical Offinso soils and dimishing returns on artificial inputs.
                </p>

                {/* Crop selector */}
                <div>
                  <label className="text-zinc-700 block mb-1.5">Select Primary Farm Crop Type</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'cocoa', label: 'Cocoa Pods', desc: 'Sovereign crop' },
                      { id: 'plantain', label: 'Plantains', desc: 'Sucker stalks' },
                      { id: 'cassava', label: 'Cassava Roots', desc: 'Tuber roots' }
                    ].map((crop) => (
                      <button
                        key={crop.id}
                        type="button"
                        onClick={() => setSelectedCrop(crop.id as any)}
                        className={`p-3 rounded-lg border text-left transition cursor-pointer ${
                          selectedCrop === crop.id
                            ? 'bg-offinso-green-50 border-offinso-green-800 text-offinso-green-950 font-bold'
                            : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-650'
                        }`}
                      >
                        <span className="block text-xs font-bold">{crop.label}</span>
                        <span className="text-[10px] text-zinc-405 font-mono block mt-0.5">{crop.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input multipliers */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                  
                  <div>
                    <label className="text-zinc-700 block mb-1">Farm Land Area (Acres)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={50}
                      value={farmAcres}
                      onChange={(e) => setFarmAcres(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded px-3 py-2 text-zinc-950 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-700 block mb-1">Monthly Expected Rainy Days</label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={31}
                      value={expectedRainDays}
                      onChange={(e) => setExpectedRainDays(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded px-3 py-2 text-zinc-950 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-700 block mb-1">Fertilizer Inputs (50kg bags)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={20}
                      value={fertilizerBags}
                      onChange={(e) => setFertilizerBags(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded px-3 py-2 text-zinc-950 focus:outline-none"
                    />
                  </div>

                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-offinso-green-800 hover:bg-offinso-green-950 text-white font-bold py-2 px-5 rounded-lg uppercase tracking-wider transition cursor-pointer"
                  >
                    Run Yield Diagnostics
                  </button>
                </div>

              </form>
            )}

          </div>

          {/* Quick Cocoa Crop advisory info card */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-5 text-xs space-y-2.5 text-zinc-650 leading-relaxed">
            <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-widest block flex items-center gap-1">
              <Leaf className="w-4 h-4 text-emerald-600" /> COCOA DISEASES PREVENTIVE MANUAL
            </span>
            <p>
              **Black Pod (Phytophthora megakarya)** is highly endemic in Ashanti soils, heavily fueled by poor land drainage and high rainy humidity levels. Extension experts advise maintaining a tree spacing of **3m x 3m** to support solar ventilation patterns. Prune dead branches immediately.
            </p>
          </div>

        </div>

        {/* Right column (5 cols): Visual Recharts projections */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6" id="agriculture-recharts-projections">
          
          <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-2xs space-y-4">
             
             <div className="flex items-center gap-2 pb-2 border-b">
               <CloudRain className="w-5 h-5 text-offinso-green-850 shrink-0" />
               <h3 className="font-serif font-bold text-base text-zinc-900">Rainfall &amp; Cocoa Harvest Trend</h3>
             </div>

             <p className="text-zinc-500 text-xs">
                Monthly projections outlining historical relationship between rainfall depths (mm) and average cocoa bean yields (tons/month) across Offinso district.
             </p>

             {/* Recharts dynamic area chart visualizer */}
             <div className="h-64 w-full pt-2">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={HARVEST_TREND_DATA} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorYld" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#004d40" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#004d40" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#efbf12" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#efbf12" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6, borderColor: '#e2e8f0' }} />
                    <Legend wrapperStyle={{ fontSize: 10, pt: 10 }} />
                    <Area type="monotone" name="Cocoa Yield (tons)" dataKey="harvestYld" stroke="#004d40" strokeWidth={2} fillOpacity={1} fill="url(#colorYld)" />
                    <Area type="monotone" name="Rainfall (mm)" dataKey="rainfallMm" stroke="#efbf12" strokeWidth={2} fillOpacity={1} fill="url(#colorRain)" />
                 </AreaChart>
               </ResponsiveContainer>
             </div>

             <div className="bg-zinc-50 p-3 rounded border border-zinc-150 text-[10.5px] text-zinc-550 leading-relaxed font-mono flex items-start gap-1.5">
               <HelpCircle className="w-3.5 h-3.5 text-offinso-gold shrink-0 mt-0.5" />
               <span>Yield peaks in October as seasonal pods fully mature following primary wet September downpours. Plan logistics early!</span>
             </div>

          </div>

        </div>

      </div>

    </div>
  );
}
