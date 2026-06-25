/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Users, Ticket, CheckCircle, Search, Heart, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { User } from '../types';

export interface OffinsoEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  availableTickets: number;
  totalTickets: number;
  ticketPrice: number;
  category: 'Festival' | 'Agricultural' | 'Seminar' | 'Community' | 'Arts & Crafts';
}

export interface RSVPLog {
  id: string;
  eventId: string;
  eventTitle: string;
  guestName: string;
  guestEmail: string;
  ticketsBooked: number;
  totalCost: number;
  dateReserved: string;
}

const INITIAL_EVENTS: OffinsoEvent[] = [
  {
    id: 'evt_1',
    title: 'Beauty Pageant for SHS Students',
    description: 'A spectacular beauty pageant for Senior High School (SHS) students celebrating elegance, culture, intellect, and leadership. Grand reward: 1,000 Ghana Cedis.',
    date: 'Upcoming Soon',
    time: 'Stay Tuned',
    location: 'Stay tuned for location',
    availableTickets: 0,
    totalTickets: 0,
    ticketPrice: 0,
    category: 'Community'
  },
  {
    id: 'evt_2',
    title: 'SHS Dance Battle',
    description: 'An energetic inter-school dance battle showcasing the best dance choreography, rhythm, and talent from local Senior High Schools (SHS). Grand reward: 1,000 Ghana Cedis.',
    date: 'Upcoming Soon',
    time: 'Stay Tuned',
    location: 'Stay tuned for location',
    availableTickets: 0,
    totalTickets: 0,
    ticketPrice: 0,
    category: 'Arts & Crafts'
  }
];

interface EventsSectionProps {
  searchQuery: string;
  currentUser?: User | null;
}

export default function EventsSection({ searchQuery, currentUser }: EventsSectionProps) {
  const { t, language } = useLanguage();

  // Load state from localStorage
  const [events, setEvents] = useState<OffinsoEvent[]>(() => {
    const saved = localStorage.getItem('offinso_events_shs_v3');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [rsvpLogs, setRsvpLogs] = useState<RSVPLog[]>(() => {
    const saved = localStorage.getItem('offinso_rsvp_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [savedEventIds, setSavedEventIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('offinso_saved_events');
    return saved ? JSON.parse(saved) : [];
  });

  // Controls states
  const [activeSubView, setActiveSubView] = useState<'browse' | 'my-tickets'>('browse');
  const [selectedEvent, setSelectedEvent] = useState<OffinsoEvent | null>(null);

  // Form states
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [ticketCount, setTicketCount] = useState(1);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // Filter Categories
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Synchronize authenticated user fields
  React.useEffect(() => {
    if (currentUser) {
      setGuestName(currentUser.fullName);
      setGuestEmail(currentUser.email);
    }
  }, [currentUser]);

  // Handle bookmarks
  const handleToggleBookmark = (id: string) => {
    let updated;
    if (savedEventIds.includes(id)) {
      updated = savedEventIds.filter(eId => eId !== id);
    } else {
      updated = [...savedEventIds, id];
    }
    setSavedEventIds(updated);
    localStorage.setItem('offinso_saved_events', JSON.stringify(updated));
  };

  // Submit Reservation
  const handleRSVPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    if (!guestName.trim() || !guestEmail.trim() || ticketCount < 1) {
      setFormError('Please enter all details correctly.');
      return;
    }

    if (ticketCount > selectedEvent.availableTickets) {
      setFormError(`Only ${selectedEvent.availableTickets} tickets are available for booking.`);
      return;
    }

    const calculatedCost = selectedEvent.ticketPrice * ticketCount;

    const newRSVP: RSVPLog = {
      id: `RSVP-${Math.floor(Math.random() * 90000 + 10000)}`,
      eventId: selectedEvent.id,
      eventTitle: selectedEvent.title,
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim(),
      ticketsBooked: ticketCount,
      totalCost: calculatedCost,
      dateReserved: new Date().toISOString()
    };

    // Update tickets counts inside master state
    const updatedEvents = events.map(evt => {
      if (evt.id === selectedEvent.id) {
        return {
          ...evt,
          availableTickets: Math.max(0, evt.availableTickets - ticketCount)
        };
      }
      return evt;
    });

    // Update local variables
    setEvents(updatedEvents);
    localStorage.setItem('offinso_events_shs_v3', JSON.stringify(updatedEvents));

    const updatedRSVPs = [newRSVP, ...rsvpLogs];
    setRsvpLogs(updatedRSVPs);
    localStorage.setItem('offinso_rsvp_logs', JSON.stringify(updatedRSVPs));

    setFormSuccess(true);
    setFormError('');
    
    setTimeout(() => {
      setFormSuccess(false);
      setSelectedEvent(null);
      setActiveSubView('my-tickets');
    }, 2500);
  };

  const categories = ['All', 'Community', 'Arts & Crafts'];

  // Filter Event listings
  const filteredEvents = events.filter(evt => {
    const matchesCategory = selectedCategory === 'All' || evt.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="offinso-events-portal" className="space-y-8 py-4">
      
      {/* Top Header Block */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-zinc-200 pb-5 gap-4">
        <div>
          <span className="text-xs text-offinso-gold font-bold uppercase tracking-widest font-mono">Registry calendar</span>
          <h2 className="font-serif text-3xl font-bold text-offinso-green-900 mt-1">Community Assembly &amp; Festivals Calendar</h2>
          <p className="text-zinc-500 text-xs mt-1">
            Register for upcoming local SHS school beauty pageants, dance battles, and other community events inside Offinso.
          </p>
        </div>

        {/* View toggles */}
        <div className="flex bg-zinc-100 rounded-md p-1 border">
          <button
            onClick={() => setActiveSubView('browse')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition cursor-pointer ${
              activeSubView === 'browse' ? 'bg-white text-offinso-green-900 shadow-2xs font-bold' : 'text-zinc-650 hover:text-zinc-900'
            }`}
          >
            All Upcoming Assemblies
          </button>
          <button
            onClick={() => setActiveSubView('my-tickets')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition relative cursor-pointer ${
              activeSubView === 'my-tickets' ? 'bg-white text-offinso-green-900 shadow-2xs font-bold' : 'text-zinc-655 hover:text-zinc-900'
            }`}
          >
            My Saved RSVPs
            {rsvpLogs.length > 0 && (
              <span className="absolute -top-1 right-0 w-4 h-4 bg-offinso-dirt text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {rsvpLogs.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeSubView === 'browse' && (
        <div className="space-y-6">
          
          {/* Categories select row */}
          <div className="bg-white border rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider font-mono">Filter Category:</span>
              <div className="flex flex-wrap gap-1.5">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-offinso-green-850 text-white font-bold shadow-2xs'
                        : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-650 border border-zinc-200'
                    }`}
                  >
                    {language === 'tw' && cat === 'All' ? 'Nyinaa' : cat}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-zinc-500 font-mono">
              Events listed: <strong>{filteredEvents.length}</strong>
            </p>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="text-center py-12 bg-white border border-zinc-200 rounded-lg text-zinc-500 italic">
              No local events listed matching chosen conditions.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEvents.map(evt => {
                const isBookmarked = savedEventIds.includes(evt.id);

                let evtTitle = evt.title;
                let evtDesc = evt.description;

                if (language === 'tw') {
                  if (evt.id === 'evt_1') {
                    evtTitle = 'SHS Ahoɔfɛ Akansi (Beauty Pageant for SHS Students)';
                    evtDesc = 'Ahoɔfɛ ne nimdeɛ akansi soronko a yɛreyɛ ama Senior High School (SHS) mma. Sika kɛseɛ a yɛde bɛma banyɛfoɔ ne Ghana Cedis 1,000.';
                  } else if (evt.id === 'evt_2') {
                    evtTitle = 'SHS Asa Akansi (SHS Dance Battle)';
                    evtDesc = 'Asa akansi fɛfɛɛfɛ a yɛreyɛ ama Senior High School (SHS) mma. Sika kɛseɛ a yɛde bɛma banyɛfoɔ ne Ghana Cedis 1,000.';
                  }
                }

                // Localized text strings for stay tuned elements
                const isTwi = language === 'tw';
                const dateText = isTwi ? 'Ɛreba Seesei (Upcoming Soon)' : 'Upcoming Soon';
                const locationLabel = isTwi ? 'Beaeɛ ho Nkyerɛkyerɛmu:' : 'Location Details:';
                const locationVal = isTwi ? 'Yɛbɛbɔ mo amandeɛ wɔ beaeɛ pɔtee a yɛbɛyɛ ho nkyɛ' : 'Stay tuned for location details';
                const entryLabel = isTwi ? 'Kwan a Mobɛfa so ne Mfonini:' : 'Entry & Admission:';
                const entryVal = isTwi ? 'Yɛbɛbɔ mo amandeɛ wɔ sika dodoɔ ne free entry nkyerɛkyerɛmu ho' : 'Stay tuned for entry details & free entry options';
                const capacityLabel = isTwi ? 'Nnipa Dodoɔ a Yɛbɛgye:' : 'Event Capacity:';
                const capacityVal = isTwi ? 'Yɛbɛbɔ mo amandeɛ wɔ nnipa dodoɔ a yɛbɛgye ho' : 'Stay tuned for audience capacity details';
                const admissionRateLabel = isTwi ? 'ADMISSION RATE' : 'ADMISSION RATE';
                const stayTunedLabel = isTwi ? 'YƐBƐBƆ MO AMANDEƐ' : 'STAY TUNED';
                const upcomingSoonStatus = isTwi ? 'ƐREBA SEESEI' : 'UPCOMING SOON';

                return (
                  <div
                    key={evt.id}
                    id={`event-item-${evt.id}`}
                    className="bg-white border border-zinc-200 rounded-lg overflow-hidden hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div className="p-5 space-y-4">
                      
                      {/* Meta header */}
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[10px] font-mono bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded uppercase font-semibold">
                          {evt.category}
                        </span>
                        
                        <button
                          onClick={() => handleToggleBookmark(evt.id)}
                          className="text-zinc-400 hover:text-rose-500 transition cursor-pointer"
                        >
                          <Heart className={`w-4 h-4 ${isBookmarked ? 'text-rose-500 fill-rose-500' : ''}`} />
                        </button>
                      </div>

                      {/* Header block */}
                      <div className="space-y-1">
                        <span className="text-xs text-offinso-dirt font-bold flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {dateText}
                        </span>
                        <h4 className="font-serif font-bold text-zinc-950 text-base leading-tight">
                          {evtTitle}
                        </h4>
                      </div>

                      <p className="text-zinc-650 text-xs leading-relaxed line-clamp-3">
                        {evtDesc}
                      </p>

                      {/* Details block */}
                      <div className="space-y-2.5 text-xs border-t pt-3 font-sans">
                        <div className="flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-zinc-700 block">{locationLabel}</span>
                            <span className="text-zinc-500">{locationVal}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <Ticket className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-zinc-700 block">{entryLabel}</span>
                            <span className="text-zinc-500">{entryVal}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <Users className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-zinc-700 block">{capacityLabel}</span>
                            <span className="text-zinc-500">{capacityVal}</span>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Footer price and actions */}
                    <div className="px-5 py-4 bg-zinc-50 border-t border-zinc-150 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] text-zinc-400 block font-mono">{admissionRateLabel}</span>
                        <strong className="text-offinso-green-955 text-sm uppercase">
                          {stayTunedLabel}
                        </strong>
                      </div>

                      <span className="bg-zinc-100 text-zinc-500 text-[10px] font-bold px-3 py-1.5 rounded border border-zinc-200 uppercase tracking-wider font-mono">
                        {upcomingSoonStatus}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* RSVP tickets log */}
      {activeSubView === 'my-tickets' && (
        <div className="max-w-4xl mx-auto space-y-6 text-xs font-sans">
          
          <div className="bg-white border rounded-lg p-5 shadow-2xs">
            <h3 className="font-serif font-bold text-lg text-offinso-green-950 border-b pb-2 mb-2">
              My Active Assembly Reservations
            </h3>
            <p className="text-zinc-500">
              All calendar RSVP seats secured within this session. Please display the confirmation identifiers at entry checking desks.
            </p>
          </div>

          {rsvpLogs.length === 0 ? (
            <div className="py-12 bg-white border rounded-lg text-center text-zinc-400 italic">
              You have no saved reservations booked yet.
            </div>
          ) : (
            <div className="space-y-4">
              {rsvpLogs.map(rsvp => (
                <div key={rsvp.id} className="bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-xs p-5 relative">
                  
                  {/* Decorative Ticket Line cut */}
                  <div className="absolute top-1/2 -left-3 w-6 h-6 bg-zinc-50 border-r rounded-full transform -translate-y-1/2"></div>
                  <div className="absolute top-1/2 -right-3 w-6 h-6 bg-zinc-50 border-l rounded-full transform -translate-y-1/2"></div>

                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b pb-3 mb-4">
                    <div>
                      <span className="text-[10px] text-zinc-400 font-mono font-bold uppercase block leading-none">Voucher Pass Code</span>
                      <strong className="text-offinso-green-900 font-mono text-xs">{rsvp.id}</strong>
                    </div>
                    
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 text-[10px] font-mono tracking-widest font-bold px-2 py-0.5 rounded uppercase leading-none">
                      Secured Entry
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-zinc-600 font-medium">
                    <div className="sm:col-span-2">
                      <span className="text-[9px] uppercase text-zinc-400 block leading-none mb-1">Target Event</span>
                      <h4 className="font-serif font-bold text-sm text-zinc-900">{rsvp.eventTitle}</h4>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase text-zinc-400 block leading-none mb-1">Pass holder</span>
                      <span className="text-zinc-900">{rsvp.guestName}</span>
                      <span className="block text-zinc-500 text-[11px]">{rsvp.guestEmail}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase text-zinc-400 block leading-none mb-1">Admissions booked</span>
                      <span className="text-zinc-900 font-bold">{rsvp.ticketsBooked} seat(s)</span>
                    </div>
                  </div>

                  {/* Pricing footer summary inside reservation */}
                  <div className="bg-zinc-50 p-3 rounded border border-zinc-150 mt-4 flex justify-between items-center text-[10px] font-mono">
                    <span>Authorized stamp: SECURE REGISTRY SHA-256</span>
                    <span className="font-bold text-zinc-700">Total charge: GH₵ {rsvp.totalCost} GHS</span>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* Modal RSVP seat booking Form */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border-t-8 border-offinso-green-800 rounded-lg max-w-md w-full shadow-2xl p-6 relative animate-fade-in"
              id="rsvp-modal-container"
            >
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-650 focus:outline-none font-bold cursor-pointer"
              >
                ✕
              </button>

              <h4 className="font-serif font-bold text-lg text-offinso-green-950 border-b pb-2 mb-4">
                Secure RSVP Pass: {selectedEvent.title}
              </h4>

              {formSuccess ? (
                <div className="space-y-4 py-4 text-center text-xs">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-7 h-7 text-emerald-600" />
                  </div>
                  <h5 className="font-serif font-bold text-base text-zinc-900">Seat Successfully Reserved!</h5>
                  <p className="text-zinc-500 max-w-sm mx-auto leading-relaxed">
                    Your reservations are locked into regional lists. Present your email details at Kokote or Abofour durbar check-in queues.
                  </p>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="mt-2 bg-offinso-green-850 hover:bg-offinso-green-950 text-white font-bold text-xs px-4 py-1.5 rounded transition cursor-pointer"
                  >
                    Got It
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRSVPSubmit} className="space-y-4 font-sans text-xs">
                  
                  {/* Event summary info */}
                  <div className="bg-zinc-50 p-3 rounded border border-zinc-200 space-y-1">
                    <p className="text-offinso-dirt font-bold text-xs">🗓️ {selectedEvent.date} @ {selectedEvent.time}</p>
                    <p className="text-zinc-500 truncate">📍 {selectedEvent.location}</p>
                    <p className="text-zinc-650 font-bold">Admission price: {selectedEvent.ticketPrice === 0 ? 'FREE' : `GH₵ ${selectedEvent.ticketPrice} GHS`}</p>
                  </div>

                  {/* Input fields */}
                  <div>
                    <label className="text-xs font-semibold text-zinc-700 block mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ama Serwaa"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded px-3 py-2 text-zinc-955 focus:outline-none focus:border-offinso-green-700"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-700 block mb-1">Email Coordinates</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. ama@gmail.com"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded px-3 py-2 text-zinc-955 focus:outline-none focus:border-offinso-green-700"
                    />
                  </div>

                  {/* Seat counter */}
                  <div>
                    <label className="text-xs font-semibold text-zinc-700 block mb-1">Admissions to reserve</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={10}
                      value={ticketCount}
                      onChange={(e) => setTicketCount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded px-3 py-2 text-zinc-955 focus:outline-none"
                    />
                    <p className="text-[10.5px] text-zinc-400 mt-1">Available capacity: {selectedEvent.availableTickets} tickets</p>
                  </div>

                  {/* Live subtotal billing calculation */}
                  {selectedEvent.ticketPrice > 0 && (
                    <div className="bg-zinc-900 text-zinc-300 font-mono p-3 rounded flex justify-between items-center">
                      <span>Total Invoice: ({ticketCount}x tickets)</span>
                      <strong className="text-offinso-gold">GH₵ {selectedEvent.ticketPrice * ticketCount} GHS</strong>
                    </div>
                  )}

                  {formError && (
                    <div className="bg-red-50 text-red-700 text-xs p-2.5 rounded border border-red-200 mt-2 font-medium flex items-start gap-1.5 leading-snug">
                      <ShieldAlert className="w-4 h-4 text-rose-650 shrink-0 mt-0.5" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex gap-2.5 pt-2 border-t mt-4">
                    <button
                      type="button"
                      onClick={() => setSelectedEvent(null)}
                      className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold px-4 py-2 rounded flex-1 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-offinso-green-850 hover:bg-offinso-green-950 text-white font-bold px-4 py-2 rounded flex-1 uppercase tracking-wider cursor-pointer"
                    >
                      Verify Reservation
                    </button>
                  </div>

                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
