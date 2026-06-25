/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Gavel, HeartHandshake, Hammer, Compass, Globe, BookOpen, GraduationCap, Clock, ChevronRight, TrendingUp, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { OFFINSO_COMMUNITY_STATS, INITIAL_CLASS_OFFERINGS } from '../data';
import { BidItem, JobPost, ReliefProgram, TravelPackage, ActivePage } from '../types';

interface HomeHubProps {
  onNavigate: (page: ActivePage, targetId?: string) => void;
  auctionItems: BidItem[];
  jobPosts: JobPost[];
  reliefPrograms: ReliefProgram[];
  travelPackages: TravelPackage[];
  searchQuery: string;
  setSearchQuery: (term: string) => void;
}

export default function HomeHub({
  onNavigate,
  auctionItems,
  jobPosts,
  reliefPrograms,
  travelPackages,
}: HomeHubProps) {
  const { t, language } = useLanguage();

  // Simple statistics
  const activeAuctionsCount = auctionItems.filter(item => !item.isClosed).length;
  const activeJobsCount = jobPosts.length;
  const activeProgramsCount = reliefPrograms.length;

  const classOfferings = INITIAL_CLASS_OFFERINGS;

  return (
    <div className="space-y-10 py-6" id="offinso-home-hub">
      
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-offinso-green-900 via-offinso-green-800 to-offinso-green-950 text-white shadow-md p-6 sm:p-12 border border-offinso-gold/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-offinso-green-700/40 via-transparent to-transparent pointer-events-none"></div>
        {/* Soft atmospheric overlay mimicking Ashanti forest green and river clay soils */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-offinso-gold/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-offinso-gold/20 text-offinso-gold border border-offinso-gold/30 text-[11px] font-mono font-bold tracking-widest px-3 py-1 rounded-full uppercase">
            <Globe className="w-3.5 h-3.5" /> {t('home.welcome_link', 'Offinso Private Link')}
          </div>
          
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            {t('home.akwaaba_title', 'Offinso Connection Man')} <br />
            <span className="font-serif italic text-offinso-gold-light text-2xl sm:text-4xl antialiased font-normal">
              {t('home.akwaaba_subtitle', 'Akwaaba — Welcome to Offinso Connection Hub')}
            </span>
          </h2>
          
          <p className="text-zinc-200 text-sm sm:text-base leading-relaxed font-sans max-w-2xl font-light">
            {t('home.hero_para', 'A fertile local hub of rich cocoa pastures, forest reserves, and cooperative trade. Created by an Offinso resident to connect job seekers with agriculture or commerce roles, coordinate private relief applications, arrange regional transport and tours, and host craft auctions for profit.')}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onNavigate('auction')}
              className="bg-offinso-gold hover:bg-[#d4a70b] text-offinso-green-950 font-bold px-6 py-2.5 rounded shadow-sm text-sm uppercase tracking-wider transition-all cursor-pointer"
            >
              {t('nav.auction', 'Enter Auction Floor')}
            </button>
            <button
              onClick={() => onNavigate('jobs')}
              className="bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold px-6 py-2.5 rounded text-sm uppercase tracking-wider transition-all cursor-pointer"
            >
              {t('jobs.tab_listings', 'Browse Open Careers')}
            </button>
          </div>
        </div>
      </section>

      {/* Haven Light Charity LBG Appreciation Post */}
      <section className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition duration-300" id="haven-light-appreciation">
        <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-zinc-100">
          
          {/* Logo Column */}
          <div className="md:w-1/4 p-6 bg-zinc-50 flex items-center justify-center min-h-[180px]">
            <div className="relative group text-center space-y-3">
              <div className="w-32 h-32 md:w-36 md:h-36 mx-auto bg-white keep-white rounded-lg p-2 border border-zinc-200 shadow-xs hover:scale-105 hover:rotate-1 transition-transform duration-300 flex items-center justify-center overflow-hidden">
                <svg 
                  viewBox="0 0 400 440" 
                  className="w-full h-full select-none"
                  id="haven-light-logo-svg"
                >
                  <g id="logo-mark">
                    {/* Bar 1: Deep dark teal-blue */}
                    <polygon
                      points="60,40 108,106.7 108,310 60,310"
                      fill="#123d4c"
                    />
                    
                    {/* Bar 2: Slate blue-grey */}
                    <polygon
                      points="120,123.3 168,190 168,310 120,310"
                      fill="#456171"
                    />
                    
                    {/* Central downward triangle (medium teal) */}
                    <polygon
                      points="168,40 232,40 200,90"
                      fill="#477a8e"
                    />
                    
                    {/* Bar 3: Light sky-blue */}
                    <polygon
                      points="180,206.7 200,240 220,206.7 220,310 180,310"
                      fill="#61b5da"
                    />
                    
                    {/* Bar 4: Medium sky-blue */}
                    <polygon
                      points="232,190 280,123.3 280,310 232,310"
                      fill="#3695b3"
                    />
                    
                    {/* Bar 5: Rich darker cyan-teal */}
                    <polygon
                      points="292,106.7 340,40 340,310 292,310"
                      fill="#0982a3"
                    />

                    {/* Slashes that mask the bars in white */}
                    {/* Slash 1: bottom-left to top-right */}
                    <line
                      x1="114"
                      y1="306"
                      x2="260"
                      y2="160"
                      stroke="#ffffff"
                      strokeWidth="22"
                      strokeLinecap="square"
                    />
                    
                    {/* Slash 2: bottom-right to top-left */}
                    <line
                      x1="286"
                      y1="306"
                      x2="140"
                      y2="160"
                      stroke="#ffffff"
                      strokeWidth="22"
                      strokeLinecap="square"
                    />
                  </g>
                  
                  {/* Text: HAVEN LIGHT */}
                  <text
                    x="200"
                    y="405"
                    textAnchor="middle"
                    fill="#111111"
                    style={{
                      fontFamily: '"Space Grotesk", "JetBrains Mono", system-ui, sans-serif',
                      fontSize: '44px',
                      fontWeight: 800,
                      letterSpacing: '0.12em'
                    }}
                  >
                    HAVEN LIGHT
                  </text>
                </svg>
              </div>
              <p className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">haven light charity</p>
            </div>
          </div>

          {/* Text/Content Column */}
          <div className="md:w-3/4 p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 border border-rose-100 text-[10.5px] font-mono font-bold tracking-wider px-2.5 py-1 rounded-full uppercase">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>{t('home.appreciation_badge', 'BENEFACTOR PARTNER APPRECIATION')}</span>
              </div>
              
              <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-offinso-green-900 leading-tight">
                {t('home.appreciation_title', 'Heartfelt Gratitude to Haven Light Charity LBG')}
              </h3>
              
              <p className="text-zinc-650 text-xs sm:text-sm leading-relaxed font-sans font-light">
                {t('home.appreciation_desc', 'We express our deepest appreciation to Haven Light Charity LBG for their immense and continued support of the Offinso Community Relief & Charity Grants. Through their dedicated administration and funding, numerous farming households, cooperatives, and local laborers receive critical seed subsidies, clean water access, work safety tutoring, and crucial micro-grants. Together, we are building a more resilient, safer, and self-sufficient Offinso.')}
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
              <span className="text-[11px] font-medium text-zinc-500 font-mono">
                {language === 'tw' ? 'Haven Light Charity LBG na ɛhwɛ so' : 'Administered by: Haven Light Charity LBG'}
              </span>
              <button 
                onClick={() => onNavigate('charity')}
                className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-offinso-gold hover:text-offinso-gold-dark font-mono transition-colors cursor-pointer bg-offinso-green-900 px-3 py-1.5 rounded"
              >
                {language === 'tw' ? 'Hwɛ Mmoa Nhyehyɛe' : 'View Relief Grants'} <ChevronRight className="w-3 h-3 text-offinso-gold" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Main Service Bento Grid Navigation */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h3 className="font-serif text-2xl font-bold text-offinso-green-900 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-offinso-gold rounded-full inline-block"></span>
            {t('home.municipal_services', 'Private Activities & Services')}
          </h3>
          <p className="text-xs text-zinc-500 font-mono hidden sm:inline">{t('home.select_hub_office', 'SELECT A LOCAL CONNECTION HUB BELOW')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Community Auction */}
          <motion.div 
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            onClick={() => onNavigate('auction')}
            className="group cursor-pointer bg-white border border-zinc-200 rounded-lg p-5 shadow-xs hover:shadow-md hover:border-offinso-green-300 transition flex flex-col justify-between"
            id="hub-card-auction"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 bg-offinso-gold-light text-offinso-gold group-hover:bg-offinso-gold group-hover:text-white transition-all rounded-lg flex items-center justify-center border border-offinso-gold/30">
                <Gavel className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-lg text-zinc-900 group-hover:text-offinso-green-700 transition">{t('nav.auction', 'Local Auction Floor')}</h4>
              <p className="text-zinc-500 text-xs leading-relaxed">
                {language === 'tw' 
                  ? 'To boɔ wɔ hand-carved loom shuttle, kɔkɔɔ mbobae, shea roasters, na abran weights ho. Boa adwumfoɔ fɛfɛɛfɛ.'
                  : 'Bid on hand-carved Kente shuttle looms, traditional cocoa baskets, premium shea pots, and antique goldweights. Supports village artisans.'}
              </p>
            </div>
            <div className="pt-4 border-t border-zinc-100 mt-4 flex items-center justify-between text-xs font-semibold text-offinso-green-800">
              <span className="bg-offinso-green-50 text-[10.5px] uppercase tracking-wider px-2 py-0.5 rounded text-offinso-green-700 font-mono">
                {activeAuctionsCount} {t('auction.active', 'Active items')}
              </span>
              <span className="flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                {t('global.explore', 'Enter')} <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </motion.div>

          {/* Card 2: Job Board */}
          <motion.div 
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            onClick={() => onNavigate('jobs')}
            className="group cursor-pointer bg-white border border-zinc-200 rounded-lg p-5 shadow-xs hover:shadow-md hover:border-offinso-green-300 transition flex flex-col justify-between"
            id="hub-card-jobs"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 bg-offinso-green-100 text-offinso-green-700 group-hover:bg-offinso-green-700 group-hover:text-white transition-all rounded-lg flex items-center justify-center border border-zinc-200">
                <Hammer className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-lg text-zinc-900 group-hover:text-offinso-green-700 transition">{t('nav.jobs', 'Offinso Careers')}</h4>
              <p className="text-zinc-500 text-xs leading-relaxed">
                {language === 'tw'
                  ? 'Search seasonal, full-time, and contractual adwumayɛ pii firi kɔkɔɔ, shea butter cooperations, ne forestry.'
                  : 'Search seasonal, full-time, and contractual forestry, cocoa agriculture, and trade jobs listed to lift livelihoods and overcome poverty.'}
              </p>
            </div>
            <div className="pt-4 border-t border-zinc-100 mt-4 flex items-center justify-between text-xs font-semibold text-offinso-green-800">
              <span className="bg-offinso-green-50 text-[10.5px] uppercase tracking-wider px-2 py-0.5 rounded text-offinso-green-700 font-mono">
                {activeJobsCount} {t('home.jobs_label', 'Jobs Open')}
              </span>
              <span className="flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                {t('global.explore', 'Browse')} <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </motion.div>

          {/* Card 3: Relief Services */}
          <motion.div 
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            onClick={() => onNavigate('charity')}
            className="group cursor-pointer bg-white border border-zinc-200 rounded-lg p-5 shadow-xs hover:shadow-md hover:border-offinso-green-300 transition flex flex-col justify-between"
            id="hub-card-charity"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-all rounded-lg flex items-center justify-center border border-rose-100">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-lg text-zinc-900 group-hover:text-offinso-green-700 transition">{t('nav.charity', 'Relief Programs')}</h4>
              <p className="text-zinc-500 text-xs leading-relaxed">
                {language === 'tw'
                  ? 'Bisa seed subsidies, mmaa cooperatives shea-butter grants, ne poultry micro-grants sika firi amansin mu.'
                  : 'Apply for smallholder seed subsidies, women shea equipment grants, and poultry start-up bursaries designed to mitigate local poverty lines.'}
              </p>
            </div>
            <div className="pt-4 border-t border-zinc-100 mt-4 flex items-center justify-between text-xs font-semibold text-offinso-green-800">
              <span className="bg-offinso-green-50 text-[10.5px] uppercase tracking-wider px-2 py-0.5 rounded text-offinso-green-700 font-mono">
                {activeProgramsCount} {t('charity.status_label', 'Programs')} Live
              </span>
              <span className="flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                {t('global.apply_now', 'Apply')} <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Main Content Area: Courses and Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Available Courses */}
        <section className="lg:col-span-2 space-y-5" id="available-academy-courses">
          <div className="border-b-2 border-offinso-green-100 pb-3">
            <h4 className="font-serif text-2xl font-bold text-offinso-green-900 flex items-center gap-2.5">
              <BookOpen className="w-6 h-6 text-offinso-gold" />
              {t('home.courses_title', 'Available Academy Courses')}
            </h4>
            <p className="text-zinc-650 text-xs mt-1 leading-relaxed">
              {t('home.courses_subtitle', 'Educational campaigns, professional training & digital skill builders for local development.')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classOfferings.map((course) => (
              <div 
                key={course.id} 
                className="bg-white border border-zinc-200 hover:border-offinso-gold/60 rounded-xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-2.5">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-offinso-gold tracking-wider">
                      {course.twiTitle}
                    </span>
                    <span className="shrink-0 bg-offinso-green-50 text-[9px] font-mono font-bold uppercase text-offinso-green-800 tracking-wider px-2 py-0.5 rounded border border-offinso-green-100">
                      {course.duration}
                    </span>
                  </div>
                  
                  <h5 className="font-serif font-bold text-base text-zinc-900 leading-snug group-hover:text-offinso-green-800 transition">
                    {course.title}
                  </h5>
                  
                  <p className="text-zinc-500 text-xs leading-relaxed font-light">
                    {course.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 space-y-2 text-xs text-zinc-600">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="font-mono text-[11px] truncate">{course.schedule}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{course.age}</span>
                  </div>
                  
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => onNavigate('literacy', 'literacy-enroll-form')}
                      className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-offinso-green-700 hover:text-offinso-green-900 transition-colors cursor-pointer"
                    >
                      {language === 'tw' ? 'Kyerɛw wo din seesei' : 'Enroll Now'} <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right 1 Column: Statistics & Highlights */}
        <section className="space-y-6">
          
          {/* Stats Panel */}
          <div className="bg-white border-2 border-offinso-green-700 rounded-lg shadow-xs overflow-hidden" id="stats-panel">
            <div className="bg-offinso-green-700 text-white px-4 py-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-offinso-gold" />
              <h4 className="font-serif font-bold text-sm uppercase tracking-wider leading-none">{t('home.live_stats', 'Offinso Live Registry Stats')}</h4>
            </div>

            <div className="p-4 space-y-4 font-sans">
              <div className="flex justify-between items-center pb-3 border-b border-zinc-100">
                <span className="text-zinc-500 text-xs font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4 text-offinso-gold" /> {t('home.pop_label', 'Offinso Population')}
                </span>
                <span className="text-zinc-900 font-mono text-sm font-bold">
                  {OFFINSO_COMMUNITY_STATS.municipalityPopulation.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-zinc-100">
                <span className="text-zinc-500 text-xs font-semibold flex items-center gap-2">
                  <Gavel className="w-4 h-4 text-offinso-gold" /> {t('home.bids_label', 'Active Auction Items')}
                </span>
                <span className="text-zinc-900 font-mono text-sm font-bold">
                  {activeAuctionsCount} {language === 'tw' ? 'Items Guaso' : 'Items Active'}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-zinc-100">
                <span className="text-zinc-500 text-xs font-semibold flex items-center gap-2">
                  <Hammer className="w-4 h-4 text-offinso-gold" /> {t('home.jobs_label', 'Jobs Open / Filled')}
                </span>
                <span className="text-zinc-900 font-mono text-sm font-bold">
                  {activeJobsCount} / {OFFINSO_COMMUNITY_STATS.jobsFilledThisMonth}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-505 text-xs font-semibold flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-offinso-gold" /> {t('home.relief_label', 'Relief Disbursed')}
                </span>
                <span className="text-emerald-700 font-mono text-sm font-bold">
                  {OFFINSO_COMMUNITY_STATS.reliefFundsDisbursed}
                </span>
              </div>
            </div>
            
            <div className="bg-zinc-50 px-4 py-2.5 text-[10.5px] text-zinc-500 font-mono text-center border-t border-zinc-100">
              {language === 'tw' ? 'Sane sɛsɛɛ ara na woasiesie' : 'Last updated: Realtime UTC Daily sync'}
            </div>
          </div>

          {/* Quick Alert Notice Board */}
          <div className="bg-offinso-gold-light/60 border border-offinso-gold/40 rounded-lg p-5 space-y-2" id="road-river-advisory">
            <h5 className="text-[11px] font-mono font-bold tracking-widest text-[#a8820c] uppercase">{t('home.road_advisory', 'Offin River & Roads Advisory')}</h5>
            <p className="font-serif font-bold text-sm text-zinc-900">{t('home.road_para', 'River Offin Bridge passable for all transport categories.')}</p>
            <p className="text-xs text-zinc-650 leading-relaxed">
              {language === 'tw'
                ? 'Nsuo a ɛwɔ asubɔnten yi mu asesei pa ara adu Abofour mpɔtam. Akwan nyinaa anya awo, na ɛyɛ fɛ amamfoɔ akwantufoɔ kwan.'
                : 'River water levels are stable after seasonal rainfalls near Abofour. All bypass trunk roads and secondary farmer routes are dry and safe.'}
            </p>
          </div>

        </section>

      </div>

    </div>
  );
}
