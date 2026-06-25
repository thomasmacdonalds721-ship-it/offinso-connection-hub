/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Menu, X, Landmark, Compass, Hammer, HeartHandshake, Gavel, Search, Trees, LogIn, LogOut, User as UserIcon, Globe, ChevronDown, Calendar, ShieldAlert, BookOpen, Sun, Moon } from 'lucide-react';
import { User, ActivePage } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { AnimatePresence, motion } from 'motion/react';

interface HeaderProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage, targetId?: string) => void;
  onGlobalSearch: (term: string) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function Header({ 
  activePage, 
  setActivePage, 
  onGlobalSearch,
  currentUser,
  onOpenAuth,
  onLogout,
  isDarkMode,
  onToggleDarkMode
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMunicipalityOpen, setIsMunicipalityOpen] = useState(false);
  const [isCareersOpen, setIsCareersOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const { language, setLanguage, t } = useLanguage();

  const handleSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onGlobalSearch(searchVal);
  };

  return (
    <header className="bg-white border-b border-zinc-200 sticky top-0 z-50 shadow-xs" id="offinso-portal-header">
      {/* Top Banner - Ghanaian/Ashanti Heritage Bar */}
      <div className="bg-offinso-green-950 text-white text-[11px] font-mono py-1 px-4 sm:px-6 flex justify-between items-center flex-wrap gap-2">
        <div className="flex items-center gap-4">
          <span className="opacity-90">{t('header.banner_left', 'Offinso Resident Private Connection Hub, Ghana')}</span>
          <span className="hidden md:inline text-offinso-gold opacity-60">|</span>
          <span className="hidden md:inline opacity-90">{t('header.banner_right', 'Ashanti Region, West Africa')}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-offinso-gold font-medium hidden sm:inline">{t('header.seal_text', 'OFFINSO PRIVATE HUB')}</span>
          
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="flex items-center justify-center p-1.5 rounded bg-offinso-green-900 border border-offinso-green-800 hover:border-offinso-gold hover:text-offinso-gold text-white transition-colors cursor-pointer"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            id="theme-toggle"
          >
            {isDarkMode ? (
              <Sun className="w-3.5 h-3.5 text-offinso-gold shrink-0 animate-pulse" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
            )}
          </button>

          <div className="flex items-center gap-0.5 bg-offinso-green-900 border border-offinso-green-800 rounded p-0.5" id="language-switcher">
            <Globe className="w-3.5 h-3.5 text-offinso-gold mx-1 shrink-0" />
            <button 
              type="button"
              onClick={() => setLanguage('en')} 
              className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide transition-colors uppercase ${language === 'en' ? 'bg-[#efbf12] text-offinso-green-950 px-2' : 'text-zinc-300 hover:text-white'}`}
            >
              EN
            </button>
            <button 
              type="button"
              onClick={() => setLanguage('tw')} 
              className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide transition-colors uppercase ${language === 'tw' ? 'bg-[#efbf12] text-offinso-green-950 px-2' : 'text-zinc-300 hover:text-white'}`}
            >
              TWI
            </button>
          </div>
        </div>
      </div>

      {/* Main Private Banner & Logo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Heraldic Logo Area */}
        <div 
          className="flex items-center gap-3.5 cursor-pointer selection:bg-transparent"
          onClick={() => setActivePage('home')}
        >
          {/* Offinso Styled Emblem */}
          <div className="relative w-12 h-12 bg-[#005f54] hover:bg-offinso-green-800 transition-colors text-white rounded-lg flex flex-col items-center justify-center shadow-xs border border-offinso-gold/30 p-1">
            <div className="w-full h-1/4 bg-offinso-gold flex items-center justify-center rounded-sm text-[8px] font-bold text-offinso-green-950 font-mono tracking-tighter leading-none">
              GHANA
            </div>
            {/* Custom Oak Tree Icon with Saplings represented via small Leaf/Tree icons */}
            <div className="flex-1 flex flex-col items-center justify-center relative mt-1">
              <Trees className="w-6 h-6 text-offinso-gold-light" />
              <div className="absolute bottom-0 flex gap-0.5">
                <span className="w-1.5 h-1.5 bg-offinso-gold rounded-full"></span>
                <span className="w-1.5 h-2 bg-offinso-gold rounded-full"></span>
                <span className="w-1.5 h-1.5 bg-offinso-gold rounded-full font-bold"></span>
              </div>
            </div>
            <div className="text-[7px] font-mono text-offinso-gold leading-none pb-0.5">
              2004
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="font-serif text-lg md:text-2xl font-bold tracking-tight text-offinso-green-900 leading-none">
              {t('header.title', 'OFFINSO PRIVATE HUB')}
            </h1>
            <p className="text-[11px] md:text-xs font-sans tracking-wide text-zinc-500 font-medium uppercase mt-1">
              {t('header.subtitle', 'Resident Created Private Connection Link')}
            </p>
          </div>
        </div>

        {/* Global Search Bar - Premium Style */}
        <form onSubmit={handleSubmitSearch} className="max-w-md w-full md:w-80 lg:w-96 relative">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder={t('header.search_placeholder', 'Search Offinso jobs, auctions, relief...')}
              className="w-full bg-zinc-50 border border-zinc-300 rounded text-sm px-3 py-2 pl-9 pr-20 text-zinc-900 focus:outline-none focus:border-offinso-green-700 focus:ring-1 focus:ring-offinso-green-700 transition"
              value={searchVal}
              onChange={(e) => {
                setSearchVal(e.target.value);
                onGlobalSearch(e.target.value);
              }}
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 pointer-events-none" />
            <button 
              type="submit" 
              className="absolute right-1 text-[11px] font-medium bg-offinso-green-700 hover:bg-offinso-green-800 text-white px-2.5 py-1 rounded transition"
            >
              {t('global.explore', 'Search')}
            </button>
          </div>
        </form>
      </div>

      {/* Navigation Row */}
      <nav className="bg-offinso-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-12">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center h-full gap-1">
              {/* Home Hub navigation */}
              <button
                id="nav-link-home"
                onClick={() => {
                  setActivePage('home');
                  setMobileMenuOpen(false);
                  setIsMunicipalityOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`h-full px-4 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-offinso-green-700 transition relative ${
                  activePage === 'home' ? 'bg-offinso-green-905 text-white bg-offinso-green-900 border-b-2 border-offinso-gold' : 'text-zinc-100'
                }`}
              >
                <Compass className="w-4 h-4 text-offinso-gold" />
                <span>{t('nav.home', 'Home Hub')}</span>
              </button>

              {/* Municipality dropdown menu */}
              <div 
                className="relative h-full"
                onMouseEnter={() => setIsMunicipalityOpen(true)}
                onMouseLeave={() => setIsMunicipalityOpen(false)}
              >
                <button
                  id="nav-link-municipality"
                  className={`h-full px-4 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-offinso-green-700 transition relative ${
                    isMunicipalityOpen || activePage === 'auction' || activePage === 'events' || activePage === 'health-safety' ? 'bg-offinso-green-905 text-white bg-offinso-green-900' : 'text-zinc-100'
                  }`}
                >
                  <Landmark className="w-4 h-4 text-offinso-gold" />
                  <span>{t('nav.municipality', 'Local Guide')}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-250 ${isMunicipalityOpen ? 'rotate-180' : ''}`} />
                  {(activePage === 'auction' || activePage === 'events' || activePage === 'health-safety') && (
                    <span className="absolute bottom-0 left-0 right-0 h-1 bg-offinso-gold"></span>
                  )}
                </button>

                {/* Dropdown Card */}
                <AnimatePresence>
                  {isMunicipalityOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 mt-0 w-56 bg-white rounded-b-lg shadow-xl py-2 border-x border-b border-zinc-200 z-50 overflow-hidden text-zinc-800"
                    >
                      {/* Auction item */}
                      <button
                        onClick={() => {
                          setActivePage('auction');
                          setIsMunicipalityOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-zinc-50 flex items-center gap-3 text-zinc-700 hover:text-offinso-green-900 transition-colors font-semibold cursor-pointer"
                      >
                        <Gavel className="w-4 h-4 text-offinso-green-700" />
                        <span>{t('nav.auction', 'Auction')}</span>
                      </button>

                      {/* Events item */}
                      <button
                        onClick={() => {
                          setActivePage('events');
                          setIsMunicipalityOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-zinc-50 flex items-center gap-3 text-zinc-700 hover:text-offinso-green-900 transition-colors font-semibold cursor-pointer"
                      >
                        <Calendar className="w-4 h-4 text-offinso-gold" />
                        <span>{t('nav.events', 'Events')}</span>
                      </button>

                      {/* Health & Safety item */}
                      <button
                        onClick={() => {
                          setActivePage('health-safety');
                          setIsMunicipalityOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-zinc-50 flex items-center gap-3 text-zinc-700 hover:text-offinso-green-900 transition-colors font-semibold cursor-pointer"
                      >
                        <ShieldAlert className="w-4 h-4 text-rose-600" />
                        <span>{t('nav.health_safety', 'Health and Safety')}</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Offinso Careers dropdown menu */}
              <div 
                className="relative h-full"
                onMouseEnter={() => setIsCareersOpen(true)}
                onMouseLeave={() => setIsCareersOpen(false)}
              >
                <button
                  id="nav-link-careers"
                  className={`h-full px-4 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-offinso-green-700 transition relative ${
                    isCareersOpen || activePage === 'jobs' || activePage === 'literacy' ? 'bg-offinso-green-905 text-white bg-offinso-green-900' : 'text-zinc-100'
                  }`}
                >
                  <Hammer className="w-4 h-4 text-offinso-gold" />
                  <span>{t('nav.jobs', 'Offinso Careers')}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-250 ${isCareersOpen ? 'rotate-180' : ''}`} />
                  {(activePage === 'jobs' || activePage === 'literacy') && (
                    <span className="absolute bottom-0 left-0 right-0 h-1 bg-offinso-gold"></span>
                  )}
                </button>

                {/* Dropdown Card */}
                <AnimatePresence>
                  {isCareersOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 mt-0 w-56 bg-white rounded-b-lg shadow-xl py-2 border-x border-b border-zinc-200 z-50 overflow-hidden text-zinc-800"
                    >
                      {/* Job Openings */}
                      <button
                        onClick={() => {
                          setActivePage('jobs');
                          setIsCareersOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-zinc-50 flex items-center gap-3 text-zinc-700 hover:text-offinso-green-900 transition-colors font-semibold cursor-pointer"
                      >
                        <Hammer className="w-4 h-4 text-offinso-green-700" />
                        <span>{t('nav.jobs_sub', 'Job Openings')}</span>
                      </button>

                      {/* Literacy Campaign */}
                      <button
                        onClick={() => {
                          setActivePage('literacy');
                          setIsCareersOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-zinc-50 flex items-center gap-3 text-zinc-700 hover:text-offinso-green-900 transition-colors font-semibold cursor-pointer"
                      >
                        <BookOpen className="w-4 h-4 text-emerald-600" />
                        <span>{t('nav.literacy', 'Courses')}</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Relief Programs direct button */}
              <button
                id="nav-link-charity"
                onClick={() => {
                  setActivePage('charity');
                  setMobileMenuOpen(false);
                  setIsMunicipalityOpen(false);
                  setIsCareersOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`h-full px-4 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-offinso-green-700 transition relative ${
                  activePage === 'charity' || activePage === 'charity-agric' || activePage === 'charity-social' ? 'bg-offinso-green-905 text-white bg-offinso-green-900 border-b-2 border-offinso-gold' : 'text-zinc-100'
                }`}
              >
                <HeartHandshake className="w-4 h-4 text-offinso-gold" />
                <span>{t('nav.charity', 'Relief Programs')}</span>
              </button>

              {/* Travel Abroad direct page */}
              <button
                id="nav-link-travel"
                onClick={() => {
                  setActivePage('travel');
                  setMobileMenuOpen(false);
                  setIsMunicipalityOpen(false);
                  setIsCareersOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`h-full px-4 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-offinso-green-700 transition relative ${
                  activePage === 'travel' ? 'bg-offinso-green-905 text-white bg-offinso-green-900 border-b-2 border-offinso-gold' : 'text-zinc-100'
                }`}
              >
                <Trees className="w-4 h-4 text-offinso-gold" />
                <span>{t('nav.travel', 'Travel Abroad')}</span>
              </button>
            </div>

            {/* Emergency Hotline Button & Authentication Row */}
            <div className="hidden md:flex items-center gap-4 text-xs text-white">
              <div className="flex items-center gap-2 text-zinc-200 border-r border-offinso-green-700/60 pr-4">
                <span className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-pulse"></span>
                <span className="text-zinc-200 font-mono text-[11.5px]">{t('header.river_status', 'River Offin Crossing:')} </span>
                <span className="bg-offinso-green-900 border border-offinso-green-700 text-emerald-400 px-2 py-0.5 rounded font-bold font-mono">
                  {t('header.river_passable', 'PASSABLE')}
                </span>
              </div>

              {currentUser ? (
                <div className="flex items-center gap-3" id="header-user-actions">
                  <button
                    onClick={() => {
                      setActivePage('profile');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded border transition-all cursor-pointer ${
                      activePage === 'profile' 
                        ? 'bg-offinso-gold/25 border-offinso-gold text-offinso-gold font-bold shadow-xs' 
                        : 'bg-offinso-green-900 border-offinso-green-700 text-[#efbf12] hover:border-offinso-gold hover:bg-offinso-green-800'
                    }`}
                    title={t('nav.goto_profile', 'View Application History & Profile')}
                    id="btn-desktop-profile"
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    <span className="font-sans font-bold text-[11px] truncate max-w-[130px]">
                      {currentUser.fullName}
                    </span>
                  </button>
                  <button
                    onClick={onLogout}
                    className="text-zinc-200 hover:text-white uppercase font-bold tracking-wider font-mono text-[10.5px] flex items-center gap-1 cursor-pointer hover:underline"
                    id="btn-desktop-logout"
                  >
                    <LogOut className="w-3.5 h-3.5" /> {t('auth.logout', 'Log Out')}
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="bg-[#efbf12] hover:bg-[#d4a70b] text-offinso-green-950 font-extrabold px-4 py-1.5 rounded-full transition text-[10.5px] uppercase tracking-wider flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" /> {t('auth.login', 'Sign In')}
                </button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex lg:hidden w-full justify-between items-center h-full">
              <div className="flex items-center gap-1.5 p-1 bg-offinso-green-900/40 rounded border border-offinso-green-700/60 max-w-[200px]">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                <span className="text-[11px] font-mono truncate text-zinc-300">{t('header.weather', 'Offinso: 28°C Tropical')}</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 -mr-2 rounded text-zinc-200 hover:text-white focus:outline-none cursor-pointer"
                id="mobile-menu-toggle"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-offinso-green-900 text-white border-t border-offinso-green-700 p-4 space-y-2 shadow-inner">
          {/* Home Hub Link */}
          <button
            onClick={() => {
              setActivePage('home');
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`w-full text-left p-3 rounded flex items-center gap-3 font-medium transition ${
              activePage === 'home' ? 'bg-offinso-green-700 text-offinso-gold border-l-4 border-offinso-gold font-bold' : 'hover:bg-offinso-green-800'
            }`}
          >
            <Compass className="w-5 h-5 text-offinso-gold" />
            <span className="text-sm font-semibold uppercase tracking-wider">{t('nav.home', 'Home Hub')}</span>
          </button>

          {/* Municipality Submenu Block */}
          <div className="bg-offinso-green-950/40 rounded border border-offinso-green-800 p-3 my-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-offinso-gold leading-none block mb-2 px-1 font-mono">
              {t('nav.municipality_menu', 'Local Guide Menu')}
            </span>
            <div className="space-y-1.5 pl-2">
              {/* Auction */}
              <button
                onClick={() => {
                  setActivePage('auction');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left py-1.5 px-2 rounded flex items-center gap-3 font-semibold transition text-xs cursor-pointer ${
                  activePage === 'auction' ? 'text-offinso-gold bg-offinso-green-800/60' : 'text-zinc-200 hover:bg-offinso-green-800/40'
                }`}
              >
                <Gavel className="w-4 h-4 text-offinso-gold" />
                <span>{t('nav.auction', 'Auction')}</span>
              </button>

              {/* Events */}
              <button
                onClick={() => {
                  setActivePage('events');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left py-1.5 px-2 rounded flex items-center gap-3 font-semibold transition text-xs cursor-pointer ${
                  activePage === 'events' ? 'text-offinso-gold bg-offinso-green-800/60' : 'text-zinc-200 hover:bg-offinso-green-800/40'
                }`}
              >
                <Calendar className="w-4 h-4 text-offinso-gold" />
                <span>{t('nav.events', 'Events')}</span>
              </button>

              {/* Health and Safety */}
              <button
                onClick={() => {
                  setActivePage('health-safety');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left py-1.5 px-2 rounded flex items-center gap-3 font-semibold transition text-xs cursor-pointer ${
                  activePage === 'health-safety' ? 'text-offinso-gold bg-offinso-green-800/60' : 'text-zinc-200 hover:bg-offinso-green-800/40'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>{t('nav.health_safety', 'Health and Safety')}</span>
              </button>
            </div>
          </div>

          {/* Offinso Careers Submenu Block */}
          <div className="bg-offinso-green-950/40 rounded border border-offinso-green-800 p-3 my-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-offinso-gold leading-none block mb-2 px-1 font-mono">
              {t('nav.careers_menu', 'Offinso Careers Menu')}
            </span>
            <div className="space-y-1.5 pl-2">
              {/* Job Openings */}
              <button
                onClick={() => {
                  setActivePage('jobs');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left py-1.5 px-2 rounded flex items-center gap-3 font-semibold transition text-xs cursor-pointer ${
                  activePage === 'jobs' ? 'text-offinso-gold bg-offinso-green-800/60' : 'text-zinc-200 hover:bg-offinso-green-800/40'
                }`}
              >
                <Hammer className="w-4 h-4 text-offinso-gold" />
                <span>{t('nav.jobs_sub', 'Job Openings')}</span>
              </button>

              {/* Offinso Literacy */}
              <button
                onClick={() => {
                  setActivePage('literacy');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left py-1.5 px-2 rounded flex items-center gap-3 font-semibold transition text-xs cursor-pointer ${
                  activePage === 'literacy' ? 'text-offinso-gold bg-offinso-green-800/60' : 'text-zinc-200 hover:bg-offinso-green-800/40'
                }`}
              >
                <BookOpen className="w-4 h-4 text-offinso-gold" />
                <span>{t('nav.literacy', 'Courses')}</span>
              </button>
            </div>
          </div>

          {/* Relief Programs Link */}
          <button
            onClick={() => {
              setActivePage('charity');
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`w-full text-left p-3 rounded flex items-center gap-3 font-medium transition ${
              activePage === 'charity' || activePage === 'charity-agric' || activePage === 'charity-social' ? 'bg-offinso-green-700 text-offinso-gold border-l-4 border-offinso-gold font-bold' : 'hover:bg-offinso-green-800'
            }`}
          >
            <HeartHandshake className="w-5 h-5 text-offinso-gold" />
            <span className="text-sm font-semibold uppercase tracking-wider">{t('nav.charity', 'Relief Programs')}</span>
          </button>

          {/* Travel Abroad Link */}
          <button
            onClick={() => {
              setActivePage('travel');
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`w-full text-left p-3 rounded flex items-center gap-3 font-medium transition ${
              activePage === 'travel' ? 'bg-offinso-green-700 text-offinso-gold border-l-4 border-offinso-gold font-bold' : 'hover:bg-offinso-green-800'
            }`}
          >
            <Trees className="w-5 h-5 text-offinso-gold" />
            <span className="text-sm font-semibold uppercase tracking-wider">{t('nav.travel', 'Travel Abroad')}</span>
          </button>
          
          <div className="pt-4 border-t border-offinso-green-800 mt-4 space-y-3">
            {currentUser ? (
              <div className="p-3 bg-offinso-green-950/60 rounded border border-offinso-green-800 flex items-center justify-between">
                <button
                  onClick={() => {
                    setActivePage('profile');
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex items-center gap-2 text-left cursor-pointer transition-all ${
                    activePage === 'profile' ? 'text-offinso-gold font-bold scale-[1.03]' : 'text-[#efbf12] hover:text-[#efbf12]'
                  }`}
                  id="btn-mobile-profile"
                >
                  <UserIcon className="w-4 h-4" />
                  <span className="text-xs font-bold truncate max-w-[150px]">{currentUser.fullName}</span>
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-bold text-rose-300 hover:text-rose-100 flex items-center gap-1 cursor-pointer"
                  id="btn-mobile-logout"
                >
                  <LogOut className="w-4 h-4" /> {t('auth.logout', 'Sign Out')}
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-[#efbf12] text-offinso-green-950 font-extrabold p-3 rounded-md flex items-center justify-center gap-1 uppercase tracking-wider text-xs transition cursor-pointer"
              >
                <LogIn className="w-4 h-4" /> {t('auth.login', 'Sign In to Portal')}
              </button>
            )}

            <div className="text-[11px] text-zinc-300 font-mono space-y-1">
              <p>{t('header.hotline_prefix', '🔴 Offin Water Advisory: ')}0545-832-619</p>
              <p>{t('header.warning_prefix', '⚡ Local Notice: stable water table')}</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
