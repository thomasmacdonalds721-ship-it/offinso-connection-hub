/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeHub from './components/HomeHub';
import AuctionSection from './components/AuctionSection';
import JobSearchSection from './components/JobSearchSection';
import CharitySection from './components/CharitySection';
import TravelSection from './components/TravelSection';
import LiteracySection from './components/LiteracySection';
import AgricSectorSection from './components/AgricSectorSection';
import SocialDevSection from './components/SocialDevSection';
import EventsSection from './components/EventsSection';
import HealthSafetySection from './components/HealthSafetySection';
import UserProfile from './components/UserProfile';

import { 
  INITIAL_AUCTION_ITEMS, 
  INITIAL_JOBS, 
  INITIAL_RELIEF_PROGRAMS, 
  INITIAL_TRAVEL_PACKAGES 
} from './data';
import { BidItem, JobPost, JobApplication, ReliefApplication, ReliefProgram, TravelPackage, User, ActivePage } from './types';
import { Filter, X } from 'lucide-react';
import AuthModal from './components/AuthModal';

import { supabase } from './lib/supabase';
import {
  fetchJobs,
  createJob,
  fetchJobApplications,
  applyForJob,
  fetchAuctionItems,
  placeBid,
  fetchReliefApplications,
  submitReliefApplication,
  subscribeToAuctionBids
} from './lib/api';

export default function App() {
  // Navigation State
  const [activePage, setActivePage] = useState<ActivePage>('home');
  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  // Unified Search State
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('offinso_dark_mode');
    return saved === 'true';
  });

  // Sync state to HTML element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('offinso_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('offinso_dark_mode', 'false');
    }
  }, [isDarkMode]);

  // 1. Auction Items State
  const [auctionItems, setAuctionItems] = useState<BidItem[]>([]);

  // 2. Job Posts State
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);

  // 3. Job Applications State
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);

  // 4. Relief Applications State
  const [reliefApplications, setReliefApplications] = useState<ReliefApplication[]>([]);

  // 5. Relief Programs & Travel Packages (Fixed lists)
  const [reliefPrograms] = useState<ReliefProgram[]>(INITIAL_RELIEF_PROGRAMS);
  const [travelPackages] = useState<TravelPackage[]>(INITIAL_TRAVEL_PACKAGES);

  // Auth profile loader helper
  const fetchUserProfile = async (authUser: any) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (!error && data) {
      setCurrentUser({
        id: data.id,
        username: data.username || authUser.user_metadata?.username || authUser.email?.split('@')[0] || '',
        email: authUser.email || '',
        fullName: data.full_name || authUser.user_metadata?.full_name || '',
        phone: data.phone || authUser.user_metadata?.phone || '',
        address: data.address || authUser.user_metadata?.address || '',
        registeredAt: data.registered_at || new Date().toISOString()
      });
    } else {
      setCurrentUser({
        id: authUser.id,
        username: authUser.user_metadata?.username || authUser.email?.split('@')[0] || '',
        email: authUser.email || '',
        fullName: authUser.user_metadata?.full_name || '',
        phone: authUser.user_metadata?.phone || '',
        address: authUser.user_metadata?.address || '',
        registeredAt: new Date().toISOString()
      });
    }
  };

  // Auth state listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setCurrentUser(null);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setCurrentUser(null);
        setJobApplications([]);
        setReliefApplications([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Synchronize dynamic items from API
  useEffect(() => {
    const loadData = async () => {
      try {
        const jobs = await fetchJobs();
        setJobPosts(jobs);

        const items = await fetchAuctionItems();
        setAuctionItems(items);

        if (currentUser) {
          const jobApps = await fetchJobApplications();
          setJobApplications(jobApps);

          const reliefApps = await fetchReliefApplications();
          setReliefApplications(reliefApps);
        } else {
          setJobApplications([]);
          setReliefApplications([]);
        }
      } catch (error) {
        console.error("Error loading Supabase data:", error);
      }
    };

    loadData();
  }, [currentUser]);

  // Realtime subscription
  useEffect(() => {
    const subscription = subscribeToAuctionBids(async () => {
      const updatedItems = await fetchAuctionItems();
      setAuctionItems(updatedItems);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Handle placing a lot bid from component
  const handlePlaceBid = async (itemId: string, bidderName: string, amount: number) => {
    try {
      await placeBid(itemId, bidderName, amount);
      const updatedItems = await fetchAuctionItems();
      setAuctionItems(updatedItems);
    } catch (error: any) {
      console.error("Failed to place bid:", error);
      alert(error.message || "Failed to place bid. Please try again.");
    }
  };

  // Handle posting a new job vacancy as employer
  const handlePostJob = async (newJob: Omit<JobPost, 'id' | 'postedAt'>) => {
    try {
      const createdJob: Partial<JobPost> = {
        ...newJob,
        id: `job_custom_${Date.now()}`,
        postedAt: new Date().toISOString().split('T')[0],
        isCustom: true
      };
      await createJob(createdJob);
      const updatedJobs = await fetchJobs();
      setJobPosts(updatedJobs);
    } catch (error: any) {
      console.error("Failed to post job:", error);
      alert(error.message || "Failed to post job. Please try again.");
    }
  };

  // Handle submitting a candidate application form
  const handleApplyForJob = async (appl: Omit<JobApplication, 'id' | 'submittedAt'>) => {
    try {
      const computedApp: JobApplication = {
        ...appl,
        id: `APP-OFFINSO-${Math.floor(Math.random() * 900000 + 100000)}`,
        submittedAt: new Date().toISOString()
      };
      await applyForJob(computedApp);
      const updatedApps = await fetchJobApplications();
      setJobApplications(updatedApps);
    } catch (error: any) {
      console.error("Failed to apply for job:", error);
      alert(error.message || "Failed to submit application. Please try again.");
    }
  };

  // Handle submitting a social charity relief claim
  const handleApplyForRelief = async (appl: Omit<ReliefApplication, 'id' | 'submittedAt' | 'status' | 'referenceNumber'>) => {
    try {
      const referenceNumber = `OFFINSO-RLF-${Math.floor(Math.random() * 90000 + 10000)}`;
      const computedRelief: ReliefApplication = {
        ...appl,
        id: `RLF-OFFINSO-${Date.now()}`,
        referenceNumber,
        submittedAt: new Date().toISOString(),
        status: 'Submitted'
      };
      await submitReliefApplication(computedRelief);
      const updatedReliefs = await fetchReliefApplications();
      setReliefApplications(updatedReliefs);
    } catch (error: any) {
      console.error("Failed to apply for relief:", error);
      alert(error.message || "Failed to submit relief application. Please try again.");
    }
  };

  const handleClearGlobalSearch = () => {
    setGlobalSearchQuery('');
  };

  const handleNavigatePage = (page: ActivePage, targetId?: string) => {
    setActivePage(page);
    setGlobalSearchQuery('');
    if (targetId) {
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('ring-4', 'ring-[#efbf12]', 'ring-offset-2', 'transition-all', 'duration-500');
          setTimeout(() => {
            element.classList.remove('ring-4', 'ring-[#efbf12]', 'ring-offset-2');
          }, 3000);
        }
      }, 350);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-955 dark:text-zinc-100 flex flex-col justify-between transition-colors duration-300" id="root-portal-view">
      
      {/* Dynamic Header */}
      <Header 
        activePage={activePage} 
        setActivePage={handleNavigatePage} 
        onGlobalSearch={setGlobalSearchQuery} 
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={async () => {
          await supabase.auth.signOut();
        }}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(prev => !prev)}
      />

      {/* Global Search Banner Notice */}
      {globalSearchQuery && (
        <div className="bg-offinso-gold-light border-b border-offinso-gold/30 py-2.5 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-semibold text-offinso-gold-hover">
            <span className="flex items-center gap-1.5 font-medium text-zinc-700 dark:text-zinc-200">
              <Filter className="w-4 h-4 text-offinso-gold shrink-0" />
              <span>Active search query: <strong className="text-offinso-green-900 dark:text-offinso-gold font-mono font-bold">&quot;{globalSearchQuery}&quot;</strong> is filtering listings.</span>
            </span>
            <button 
              onClick={handleClearGlobalSearch}
              className="text-[10px] font-mono hover:underline uppercase flex items-center gap-0.5 font-bold cursor-pointer text-zinc-650 hover:text-zinc-900"
            >
              Clear filters <X className="w-3 h-3 shrink-0" />
            </button>
          </div>
        </div>
      )}

      {/* Main Core Container with layout transitions */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6" id="main-content-layout">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="focus:outline-none"
          >
            {activePage === 'home' && (
              <HomeHub 
                onNavigate={(page) => handleNavigatePage(page)}
                auctionItems={auctionItems}
                jobPosts={jobPosts}
                reliefPrograms={reliefPrograms}
                travelPackages={travelPackages}
                searchQuery={globalSearchQuery}
                setSearchQuery={setGlobalSearchQuery}
              />
            )}

            {activePage === 'auction' && (
              <AuctionSection 
                searchQuery={globalSearchQuery}
                currentUser={currentUser}
              />
            )}

            {activePage === 'events' && (
              <EventsSection 
                searchQuery={globalSearchQuery}
                currentUser={currentUser}
              />
            )}

            {activePage === 'health-safety' && (
              <HealthSafetySection 
                currentUser={currentUser}
              />
            )}

            {activePage === 'jobs' && (
              <JobSearchSection 
                jobs={jobPosts}
                applications={jobApplications}
                onPostJob={handlePostJob}
                onApplyForJob={handleApplyForJob}
                searchQuery={globalSearchQuery}
                currentUser={currentUser}
              />
            )}

            {activePage === 'literacy' && (
              <LiteracySection 
                currentUser={currentUser}
              />
            )}

            {activePage === 'charity' && (
              <CharitySection 
                programs={reliefPrograms}
                applications={reliefApplications}
                onSubmitApplication={handleApplyForRelief}
                searchQuery={globalSearchQuery}
                currentUser={currentUser}
              />
            )}

            {activePage === 'charity-agric' && (
              <AgricSectorSection 
                currentUser={currentUser}
              />
            )}

            {activePage === 'charity-social' && (
              <SocialDevSection 
                currentUser={currentUser}
              />
            )}

            {activePage === 'travel' && (
              <TravelSection 
                packages={travelPackages}
                searchQuery={globalSearchQuery}
                currentUser={currentUser}
              />
            )}

            {activePage === 'profile' && (
              <UserProfile 
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                jobApplications={jobApplications}
                reliefApplications={reliefApplications}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {isAuthOpen && (
          <AuthModal 
            isOpen={isAuthOpen} 
            onClose={() => setIsAuthOpen(false)} 
            onLoginSuccess={(user) => setCurrentUser(user)} 
          />
        )}
      </AnimatePresence>

      {/* Structured Footer */}
      <Footer />

    </div>
  );
}
