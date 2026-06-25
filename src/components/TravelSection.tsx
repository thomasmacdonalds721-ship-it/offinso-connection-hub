/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Landmark, Heart, Ticket, CheckCircle, Star, Send, X, Calendar, Users, Briefcase } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { TravelPackage, User } from '../types';

interface TravelSectionProps {
  packages: TravelPackage[];
  searchQuery: string;
  currentUser?: User | null;
}

export interface TravelBooking {
  id: string;
  packageId: string;
  packageTitle: string;
  startDate: string;
  touristsCount: number;
  kidsCount: number;
  totalCost: number;
  upgrades: string[];
  clientName: string;
  clientEmail: string;
  status: 'Estimated' | 'Inquiry Sent' | 'Confirmed';
}

export default function TravelSection({ packages, searchQuery, currentUser }: TravelSectionProps) {
  const { t, language } = useLanguage();

  // Local States
  const [savedPackageIds, setSavedPackageIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('offinso_saved_packages');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [bookings, setBookings] = useState<TravelBooking[]>(() => {
    const saved = localStorage.getItem('offinso_travel_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeSubView, setActiveSubView] = useState<'packages' | 'my-trips'>('packages');

  // Modal Enquiry States
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [enquiryPack, setEnquiryPack] = useState<TravelPackage | null>(null);

  // Enquiry Fields
  const [startDate, setStartDate] = useState(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [adultsCount, setAdultsCount] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [addLighthousePass, setAddLighthousePass] = useState(false);
  const [addLobsterFeast, setAddLobsterFeast] = useState(false);
  const [addGolfPass, setAddGolfPass] = useState(false);

  // Client Info
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Custom filters
  const [destinationFilter, setDestinationFilter] = useState('');
  const [travelDateFilter, setTravelDateFilter] = useState('');

  // Synchronize client details based on authenticated user session
  React.useEffect(() => {
    if (currentUser) {
      setClientName(currentUser.fullName);
      setClientEmail(currentUser.email);
    }
  }, [currentUser]);

  // Toggle Bookmark
  const handleToggleBookmark = (pkgId: string) => {
    let updated;
    if (savedPackageIds.includes(pkgId)) {
      updated = savedPackageIds.filter(id => id !== pkgId);
    } else {
      updated = [...savedPackageIds, pkgId];
    }
    setSavedPackageIds(updated);
    localStorage.setItem('offinso_saved_packages', JSON.stringify(updated));
  };

  const handlePostBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryPack || !clientName.trim() || !clientEmail.trim()) {
      return;
    }

    const compiledUpgrades: string[] = [];
    if (addLighthousePass) compiledUpgrades.push('Formal Invitation Letter Procurement');
    if (addLobsterFeast) compiledUpgrades.push('Official Bank Draft Facilitation');
    if (addGolfPass) compiledUpgrades.push('Fast-Track Expedited Submission');

    const newBooking: TravelBooking = {
      id: `ENQ-NAY-${Math.floor(Math.random() * 9000 + 1000)}`,
      packageId: enquiryPack.id,
      packageTitle: enquiryPack.title,
      startDate,
      touristsCount: adultsCount,
      kidsCount: childrenCount,
      totalCost: 0, // Costs are custom and sent on inquiry review
      upgrades: compiledUpgrades,
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      status: 'Inquiry Sent'
    };

    const updatedBookings = [newBooking, ...bookings];
    setBookings(updatedBookings);
    localStorage.setItem('offinso_travel_bookings', JSON.stringify(updatedBookings));

    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setIsEnquiryModalOpen(false);
      setEnquiryPack(null);
      // Reset inputs
      setAddLighthousePass(false);
      setAddLobsterFeast(false);
      setAddGolfPass(false);
      setChildrenCount(0);
      setAdultsCount(1);
      setActiveSubView('my-trips');
    }, 2200);
  };

  const availabilityMap: Record<string, { from: string; to: string }> = {
    'trp_canada': { from: '2026-01-01', to: '2026-12-31' },
    'trp_uk': { from: '2026-01-01', to: '2026-12-31' },
    'trp_schengen': { from: '2026-01-01', to: '2026-12-31' },
  };

  const filteredPackages = packages.filter(pkg => {
    const matchesDestination = destinationFilter === '' ||
      pkg.title.toLowerCase().includes(destinationFilter.toLowerCase()) ||
      pkg.tags.some(t => t.toLowerCase().includes(destinationFilter.toLowerCase())) ||
      pkg.description.toLowerCase().includes(destinationFilter.toLowerCase());

    let matchesDate = true;
    if (travelDateFilter) {
      const bounds = availabilityMap[pkg.id];
      if (bounds) {
        matchesDate = travelDateFilter >= bounds.from && travelDateFilter <= bounds.to;
      }
    }

    const matchesSearch = searchQuery === '' ||
      pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesDestination && matchesDate && matchesSearch;
  });

  return (
    <div id="offinso-tourism-alliance" className="space-y-8 py-4 font-sans">
      
      {/* Top Banner Block */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-zinc-200 pb-5 gap-4">
        <div>
          <span className="text-xs text-offinso-gold font-bold uppercase tracking-widest font-mono">{t('travel.sub_office', 'Offinso Tourism Guild')}</span>
          <h2 className="font-serif text-3xl font-bold text-offinso-green-900 mt-1">{t('travel.agency_title', 'Offinso Eco-Tours & Travel Agency')}</h2>
          <p className="text-zinc-550 text-xs mt-1">
            Browse premium travel packages and submit an enquiry directly to receive a personalized cost breakdown from NAY TRAVEL COMPANY.
          </p>
        </div>

        {/* View toggles */}
        <div className="flex bg-zinc-100 rounded-md p-1 border">
          <button
            onClick={() => setActiveSubView('packages')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition cursor-pointer ${
              activeSubView === 'packages' ? 'bg-white text-offinso-green-900 shadow-2xs font-bold' : 'text-zinc-650 hover:text-zinc-900'
            }`}
          >
            {t('travel.tab_packages', 'View Holiday Offers')}
          </button>
          <button
            onClick={() => setActiveSubView('my-trips')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition relative cursor-pointer ${
              activeSubView === 'my-trips' ? 'bg-white text-offinso-green-900 shadow-2xs font-bold' : 'text-zinc-650 hover:text-zinc-900'
            }`}
          >
            {t('travel.tab_my_trips', 'My Bookings')}
            {bookings.length > 0 && (
              <span className="absolute -top-1 right-0 w-4 h-4 bg-offinso-dirt text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {bookings.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeSubView === 'packages' && (
        <div className="space-y-6">
          
          {/* Travel Agency Custom Filters Card */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="font-serif font-bold text-sm text-[#003730] uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#efbf12] rounded-full inline-block"></span>
                Refine Travel Packages
              </h4>
              <button
                onClick={() => {
                  setDestinationFilter('');
                  setTravelDateFilter('');
                }}
                className="text-[10px] uppercase font-mono font-bold text-offinso-dirt hover:underline cursor-pointer"
              >
                Reset
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Destination Filter */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block font-sans">{t('travel.destination_label', 'Destination / Zone')}</label>
                <input
                  type="text"
                  value={destinationFilter}
                  onChange={(e) => setDestinationFilter(e.target.value)}
                  placeholder={t('travel.destination_placeholder', 'e.g. Canada, UK, Europe')}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-md py-1.5 px-3 text-xs focus:outline-none focus:border-offinso-green-700 text-zinc-950"
                />
              </div>

              {/* Travel departure dates selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block">Proposed Travel Date</label>
                <input
                  type="date"
                  min="2026-05-01"
                  max="2026-10-31"
                  value={travelDateFilter}
                  onChange={(e) => setTravelDateFilter(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-md py-1.5 px-3 text-xs focus:outline-none focus:border-offinso-green-700 text-zinc-850"
                />
              </div>
            </div>

            <div className="flex justify-between items-center text-[10.5px] text-zinc-500 font-mono pt-2 border-t">
              {travelDateFilter ? (
                <span className="bg-offinso-gold-light/60 text-offinso-green-950 px-2 py-0.5 rounded text-[10px] font-sans font-bold flex items-center gap-1">
                  🗓️ Checking slot availability for: {travelDateFilter}
                </span>
              ) : (
                <span className="text-zinc-400">Select proposed travel date to check seasonal slots</span>
              )}
              
              <span className="font-bold">Available packages: {filteredPackages.length}</span>
            </div>
          </div>

          <div className="flex justify-between items-baseline text-xs text-zinc-500 font-mono">
            <p>EXCLUSIVE OFFINSO VACATIONS</p>
            <p>Found {filteredPackages.length} packages</p>
          </div>

          {/* Grid of holiday packages */}
          {filteredPackages.length === 0 ? (
            <div className="text-center py-12 bg-white border border-zinc-250 rounded-xl text-zinc-400 italic text-xs">
              No holiday packages match the specified filters. Please reset or try another search query.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPackages.map((pkg) => {
                const isBookmarked = savedPackageIds.includes(pkg.id);
                
                let pkgTitle = pkg.title;
                let pkgDesc = pkg.description;
                let pkgTags = pkg.tags;

                if (language === 'tw') {
                  if (pkg.id === 'trp_canada') {
                    pkgTitle = 'Canada Visit Visa';
                    pkgDesc = 'Yɛyɛ visa krataa ne akwantuo mmoa nyinaa ma ankonam a wɔpɛ sɛ wɔkɔ Canada kɔsra anaa kɔbɔ pɔ wɔ hɔ. Dwumadi yi nyinaa yɛ deɛ NAY TRAVEL COMPANY na ɛhwɛ so pɛpɛɛpɛ.';
                    pkgTags = ['Canada', 'Visit Visa', 'NAY Travel'];
                  } else if (pkg.id === 'trp_uk') {
                    pkgTitle = 'United Kingdom Visit Visa';
                    pkgDesc = 'Hwɛ United Kingdom (UK) fɛfɛɛfɛ anaa kɔsra wo mmapo wɔ hɔ. NAY TRAVEL COMPANY bɛboa wo ama woatumi anya visa pɛpɛɛpɛ.';
                    pkgTags = ['United Kingdom', 'Visit Visa', 'NAY Travel'];
                  } else if (pkg.id === 'trp_schengen') {
                    pkgTitle = 'Schengen Tourist Visa (Europe)';
                    pkgDesc = 'Tutu akwan kɔ amanɔne Europe aman 29 mu. NAY TRAVEL COMPANY bɛboa wo ama woanya hotel booking, flight ticket ne sika krataa.';
                    pkgTags = ['Europe', 'Schengen', 'NAY Travel'];
                  }
                }

                return (
                  <div
                    key={pkg.id}
                    id={`travel-package-${pkg.id}`}
                    className="bg-white border border-zinc-200 rounded-xl overflow-hidden hover:shadow-md transition duration-300 flex flex-col justify-between"
                  >
                    {/* Visual block */}
                    <div className="relative w-full h-48 bg-zinc-100 shrink-0 overflow-hidden">
                      <img
                        src={pkg.image}
                        alt={pkgTitle}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover hover:scale-102 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleBookmark(pkg.id);
                        }}
                        className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-zinc-655 hover:text-rose-500 transition shadow-xs z-10 cursor-pointer"
                      >
                        <Heart className={`w-4 h-4 ${isBookmarked ? 'text-rose-500 fill-rose-500' : ''}`} />
                      </button>
                    </div>

                    {/* Content list */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {pkgTags.map((tag, i) => (
                            <span key={i} className="text-[10px] bg-zinc-100 border text-zinc-600 px-1.5 py-0.5 rounded font-medium">
                              {tag}
                            </span>
                          ))}
                          <span className="text-zinc-300 text-xs font-mono">•</span>
                          <span className="text-amber-600 text-xs font-bold leading-none flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            {pkg.rating}
                          </span>
                        </div>

                        <h3 className="font-serif font-bold text-zinc-900 text-base leading-snug">
                          {pkgTitle}
                        </h3>
                        
                        <div className="space-y-2 text-zinc-600 text-xs leading-relaxed">
                          <p>{pkgDesc}</p>
                          {pkg.id === 'trp_canada' && (
                            <p className="font-semibold text-offinso-green-900 bg-emerald-50 border border-emerald-100 p-1.5 rounded mt-2">
                              ⭐ Offered by NAY TRAVEL COMPANY: Bank Draft & Invitation Letter included.
                            </p>
                          )}
                        </div>

                        {/* Inclusions checklist */}
                        <div className="pt-2">
                          <span className="text-[9px] uppercase font-bold text-zinc-400 font-mono tracking-wider block mb-1">Inclusions</span>
                          <ul className="space-y-1 text-[11px] text-zinc-600">
                            {pkg.inclusions.map((inc, index) => (
                              <li key={index} className="flex items-start gap-1">
                                <span className="text-[#efbf12] font-bold">✓</span>
                                <span className="line-clamp-1">{inc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-zinc-100 flex justify-end">
                        <button
                          onClick={() => {
                            setEnquiryPack(pkg);
                            setIsEnquiryModalOpen(true);
                          }}
                          className="w-full bg-offinso-green-800 hover:bg-offinso-green-950 text-white font-bold text-xs py-2.5 rounded transition uppercase tracking-wider cursor-pointer text-center flex items-center justify-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" /> Submit Enquiry
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Bookings log View */}
      {activeSubView === 'my-trips' && (
        <div className="max-w-4xl mx-auto space-y-6 font-sans text-xs">
          
          <div className="bg-white border border-zinc-200 rounded-lg p-5 shadow-2xs">
            <h3 className="font-serif font-bold text-lg text-[#003730] border-b pb-2 mb-2">
              Your Submitted Visa & Travel Enquiries
            </h3>
            <p className="text-zinc-500 text-xs">
              All enquiries requested during this session are listed in real-time below. NAY TRAVEL COMPANY agents cross-verify processing timelines and financial sponsor documentation via phone and email.
            </p>
          </div>

          {bookings.length === 0 ? (
            <div className="py-12 bg-white border rounded-lg text-center text-zinc-400 italic space-y-3">
              <Ticket className="w-8 h-8 text-zinc-350 mx-auto" />
              <p>{t('travel.no_bookings', 'You have no active visa enquiries logged yet.')}</p>
              <button
                onClick={() => setActiveSubView('packages')}
                className="text-offinso-green-800 font-bold hover:underline cursor-pointer"
              >
                Go browse packages
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => (
                <div key={b.id} className="bg-zinc-900 text-zinc-100 rounded-lg overflow-hidden border-2 border-offinso-gold/30 p-5 relative shadow-md">
                  <div className="absolute right-0 top-0 w-32 h-32 bg-offinso-gold/10 rounded-full blur-2xl pointer-events-none"></div>
                  
                  {/* Card header ticket design */}
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-zinc-800 pb-3 mb-4">
                    <div>
                      <span className="text-[9px] text-zinc-505 font-mono tracking-widest font-black uppercase">Enquiry Code: {b.id}</span>
                      <h4 className="font-serif font-bold text-base sm:text-lg text-white leading-tight">
                        {language === 'tw' && b.packageId === 'trp_canada' ? 'Canada Visit Visa' :
                         language === 'tw' && b.packageId === 'trp_uk' ? 'United Kingdom Visit Visa' :
                         language === 'tw' && b.packageId === 'trp_schengen' ? 'Schengen Tourist Visa (Europe)' :
                         b.packageTitle}
                      </h4>
                    </div>
                    
                    <span className="bg-[#efbf12]/10 text-[#efbf12] border border-[#efbf12]/45 text-[10px] font-mono tracking-widest font-bold px-2 py-0.5 rounded uppercase shrink-0 h-fit">
                      {b.status}
                    </span>
                  </div>

                  {/* Tourist metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-zinc-300 font-medium mb-4 pb-4 border-b border-zinc-800/60">
                    <div>
                      <span className="text-[9px] uppercase text-zinc-500 block">APPLICANT REGISTERED</span>
                      <span className="text-white font-semibold">{b.clientName}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase text-zinc-500 block">EMAIL ADDRESS</span>
                      <span>{b.clientEmail}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase text-zinc-505 block">PROPOSED DATE</span>
                      <span>{b.startDate}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase text-zinc-505 block font-sans">APPLICANTS</span>
                      <span>{b.touristsCount} Main{b.kidsCount > 0 ? ` + ${b.kidsCount} Co-applicants` : ''}</span>
                    </div>
                  </div>

                  {/* Upgrades */}
                  {b.upgrades.length > 0 ? (
                    <div className="mb-4">
                      <span className="text-[9px] uppercase text-zinc-500 block mb-1">ELECTED EXTRA SERVICES</span>
                      <div className="flex flex-wrap gap-2">
                        {b.upgrades.map((upgr, ind) => (
                          <span key={ind} className="bg-zinc-800 text-zinc-300 font-mono text-[10px] px-2 py-0.5 rounded border border-zinc-700">
                            ✓ {upgr}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4 text-[10.5px] text-zinc-500 font-mono">
                      No optional documentation requested. Regular processing applies.
                    </div>
                  )}

                  {/* Ticket footer invoice */}
                  <div className="flex justify-between items-center bg-zinc-950/80 p-3 rounded border border-zinc-800 gap-3">
                    <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                      <Ticket className="w-4 h-4 text-offinso-gold" /> {t('travel.board_voucher_msg', 'NAY TRAVEL COMPANY visa consultation request logged')}
                    </span>
                    <span className="font-mono text-xs font-bold text-amber-500">
                      Quote Pending Review
                    </span>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* Enquiry Modal overlay */}
      <AnimatePresence>
        {isEnquiryModalOpen && enquiryPack && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-zinc-200 rounded-xl max-w-lg w-full overflow-hidden shadow-2xl relative"
            >
              {/* Header */}
              <div className="bg-[#003730] text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-offinso-gold" />
                  <h4 className="font-serif font-bold text-base">Submit Visa Enquiry</h4>
                </div>
                <button
                  onClick={() => setIsEnquiryModalOpen(false)}
                  className="text-zinc-300 hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto max-h-[80vh]">
                {bookingSuccess ? (
                  <div className="py-8 text-center space-y-4">
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <h5 className="font-serif font-bold text-xl text-zinc-900">Enquiry Submitted!</h5>
                    <p className="text-xs text-zinc-500 leading-relaxed max-w-xs mx-auto">
                      Your travel enquiry for <span className="font-bold text-zinc-805">"{enquiryPack.title}"</span> has been logged successfully under NAY TRAVEL COMPANY.
                    </p>
                    <p className="text-xs text-amber-705 font-semibold bg-amber-50 p-2.5 rounded-md border border-amber-100">
                      Our consultants will contact you shortly with your custom cost details, processing fees & bank draft options.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handlePostBookingSubmit} className="space-y-4 text-xs font-sans">
                    {/* Selected package overview */}
                    <div className="bg-offinso-green-50/60 border border-offinso-green-200/50 p-3 rounded-lg">
                      <span className="text-[8.5px] text-zinc-400 font-mono uppercase block">Selected Travel Package</span>
                      <h5 className="font-serif font-bold text-zinc-900 text-sm leading-tight mt-0.5">
                        {enquiryPack.title}
                      </h5>
                      <p className="text-[10.5px] font-sans font-bold text-amber-700 mt-1">
                        Cost Details: Submit this enquiry to receive detailed processing fees & sponsorship quote.
                      </p>
                    </div>

                    {/* Proposed dates & applicants counts */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-semibold text-zinc-700 block mb-1 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-zinc-400" /> Proposed Travel Date
                        </label>
                        <input
                          type="date"
                          required
                          className="w-full bg-zinc-50 border border-zinc-300 rounded-md px-3 py-1.5 focus:outline-none focus:border-offinso-green-700"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="font-semibold text-zinc-700 block mb-1 flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-zinc-400" /> Applicants
                          </label>
                          <input
                            type="number"
                            min={1}
                            max={10}
                            className="w-full bg-zinc-50 border border-zinc-300 rounded-md px-3 py-1.5 focus:outline-none"
                            value={adultsCount}
                            onChange={(e) => setAdultsCount(parseInt(e.target.value) || 1)}
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-zinc-700 block mb-1">Co-applicants</label>
                          <input
                            type="number"
                            min={0}
                            max={10}
                            className="w-full bg-zinc-50 border border-zinc-300 rounded-md px-3 py-1.5 focus:outline-none"
                            value={childrenCount}
                            onChange={(e) => setChildrenCount(parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Checkbox Extra Services */}
                    <div className="space-y-2">
                      <label className="font-bold text-zinc-550 text-[10px] uppercase tracking-wider block flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-zinc-400" /> Optional Visa & Document Procurement
                      </label>
                      <div className="space-y-2 bg-zinc-50 p-3 rounded-lg border text-[11px]">
                        
                        <label className="flex items-start gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            className="mt-0.5 rounded border-zinc-300 text-offinso-green-800 focus:ring-offinso-green-750 cursor-pointer"
                            checked={addLighthousePass}
                            onChange={(e) => setAddLighthousePass(e.target.checked)}
                          />
                          <div>
                            <span className="font-semibold text-zinc-800">Formal Invitation Letter Procurement</span>
                            <span className="text-[10px] text-zinc-500 block">Official verified invitation letter from host country sponsors.</span>
                          </div>
                        </label>

                        <label className="flex items-start gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            className="mt-0.5 rounded border-zinc-300 text-offinso-green-800 focus:ring-offinso-green-750 cursor-pointer"
                            checked={addLobsterFeast}
                            onChange={(e) => setAddLobsterFeast(e.target.checked)}
                          />
                          <div>
                            <span className="font-semibold text-zinc-800">Official Bank Draft Facilitation</span>
                            <span className="text-[10px] text-zinc-500 block">Assistance in acquiring necessary bank draft endorsement.</span>
                          </div>
                        </label>

                        <label className="flex items-start gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            className="mt-0.5 rounded border-zinc-300 text-offinso-green-800 focus:ring-offinso-green-750 cursor-pointer"
                            checked={addGolfPass}
                            onChange={(e) => setAddGolfPass(e.target.checked)}
                          />
                          <div>
                            <span className="font-semibold text-zinc-800">Fast-Track Expedited Submission</span>
                            <span className="text-[10px] text-zinc-500 block">Priority document sorting and fast processing with NAY Travel.</span>
                          </div>
                        </label>

                      </div>
                    </div>

                    {/* Personal Info fields */}
                    <div className="space-y-2 border-t pt-3">
                      <label className="font-bold text-zinc-500 text-[10px] uppercase tracking-wider block">Applicant Contact Info</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          placeholder="Your full name"
                          className="bg-zinc-50 border border-zinc-300 rounded-md px-3 py-1.5 focus:outline-none focus:border-offinso-green-700"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                        />
                        <input
                          type="email"
                          required
                          placeholder="Your email address"
                          className="bg-zinc-50 border border-zinc-300 rounded-md px-3 py-1.5 focus:outline-none focus:border-offinso-green-700"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-offinso-green-800 hover:bg-offinso-green-955 text-white font-bold py-2.5 rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                    >
                      <Send className="w-4 h-4 text-offinso-gold" /> Submit Enquiry to NAY Travel
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
