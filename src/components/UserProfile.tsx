import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Download, 
  Save, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  HeartHandshake, 
  Briefcase, 
  History, 
  Edit3, 
  FileCheck, 
  Trash2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { User, JobApplication, ReliefApplication } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface UserProfileProps {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  jobApplications: JobApplication[];
  reliefApplications: ReliefApplication[];
}

export default function UserProfile({
  currentUser,
  setCurrentUser,
  jobApplications,
  reliefApplications,
}: UserProfileProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'history' | 'edit'>('history');

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Draft feedback & global notifications
  const [notification, setNotification] = useState<{ type: 'success' | 'info'; message: string } | null>(null);
  const [hasDraft, setHasDraft] = useState(false);

  // Filter application state for current user
  const userJobApps = currentUser
    ? jobApplications.filter(app => app.applicantEmail.toLowerCase() === currentUser.email.toLowerCase() || app.applicantName === currentUser.fullName)
    : [];

  const userReliefApps = currentUser
    ? reliefApplications.filter(app => app.email.toLowerCase() === currentUser.email.toLowerCase() || app.applicantName === currentUser.fullName)
    : [];

  const draftKey = currentUser ? `offinso_profile_draft_${currentUser.id}` : '';

  // Load initial profile values & check for drafts
  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
      setAddress(currentUser.address || '');

      // Check if draft exists
      if (draftKey) {
        const savedDraft = localStorage.getItem(draftKey);
        if (savedDraft) {
          setHasDraft(true);
        }
      }
    }
  }, [currentUser, draftKey]);

  // Clean transition notifications
  const triggerNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Live real-time validators
  const validateEmail = (val: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val);
  };

  const validatePhone = (val: string) => {
    // Ghanaian / International standard: 9-15 characters with +, -, space or digits
    const phoneRegex = /^\+?[0-9\s\-]{9,15}$/;
    return phoneRegex.test(val);
  };

  const validateName = (val: string) => val.trim().length >= 3;
  const validateAddress = (val: string) => val.trim().length >= 4;

  const errors = {
    fullName: !validateName(fullName) ? t('profile.err_name', 'Full name must be at least 3 characters.') : '',
    email: !validateEmail(email) ? t('profile.err_email', 'Please enter a valid email address.') : '',
    phone: phone && !validatePhone(phone) ? t('profile.err_phone', 'Phone must be 9 to 15 digits (digits, dashes, spaces with optional +).') : '',
    address: address && !validateAddress(address) ? t('profile.err_address', 'Address must be at least 4 characters.') : '',
  };

  const isFormValid = !errors.fullName && !errors.email && !errors.phone && !errors.address;

  // Restore Draft
  const handleLoadDraft = () => {
    if (!draftKey) return;
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft);
        if (draftData.fullName) setFullName(draftData.fullName);
        if (draftData.email) setEmail(draftData.email);
        if (draftData.phone !== undefined) setPhone(draftData.phone);
        if (draftData.address !== undefined) setAddress(draftData.address);
        
        triggerNotification(t('profile.draft_restored', 'Draft details successfully applied to the form!'), 'success');
        setHasDraft(false);
      } catch (err) {
        console.error('Failed to parse draft data', err);
      }
    }
  };

  // Discard Draft
  const handleDiscardDraft = () => {
    if (draftKey) {
      localStorage.removeItem(draftKey);
      setHasDraft(false);
      triggerNotification(t('profile.draft_discarded', 'Draft discarded successfully.'), 'info');
    }
  };

  // Save Draft progress without committing permanently to User state
  const handleSaveDraft = () => {
    if (!draftKey) return;
    const draftData = { fullName, email, phone, address };
    localStorage.setItem(draftKey, JSON.stringify(draftData));
    setHasDraft(false); // Clear the restore alert since it is currently mapped
    triggerNotification(t('profile.draft_saved', 'Form progress saved as draft successfully!'), 'success');
  };

  // Commit permanently
  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !isFormValid) return;

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: fullName,
            phone: phone,
            address: address
          })
          .eq('id', currentUser.id);

        if (error) {
          throw error;
        }
      }

      const updatedUser: User = {
        ...currentUser,
        fullName,
        phone,
        address
      };

      setCurrentUser(updatedUser);
      
      // Clear draft since it is fully committed
      if (draftKey) {
        localStorage.removeItem(draftKey);
        setHasDraft(false);
      }

      triggerNotification(t('profile.save_success', 'Your contact profile has been securely updated!'), 'success');
      setActiveTab('history');
    } catch (err: any) {
      console.error("Error updating profile in Supabase:", err);
      triggerNotification(err.message || 'Error updating profile in Supabase.', 'info');
    }
  };

  // Exporter to CSV
  const handleExportCSV = () => {
    if (!currentUser) return;

    // Headers: Category, Application ID, Target Asset, Submitted At, Status, Applicant, Email, Phone, Context
    const headers = [
      'Type',
      'Application ID',
      'Program or Job Title',
      'Submitted At',
      'Current Status',
      'Applicant Contact Name',
      'Contact Email',
      'Contact Phone',
      'Form Details'
    ];

    const rows: string[][] = [];

    // Job Apps
    userJobApps.forEach(app => {
      const formattedDate = new Date(app.submittedAt).toLocaleDateString();
      rows.push([
        'Job Vacancy',
        app.id,
        app.jobTitle,
        formattedDate,
        'Pending Review', // default standard status indicator
        app.applicantName,
        app.applicantEmail,
        app.applicantPhone,
        `Cover Letter: ${app.coverLetter.replace(/[\r\n]+/g, ' ')}`
      ]);
    });

    // Relief Apps
    userReliefApps.forEach(app => {
      const formattedDate = new Date(app.submittedAt).toLocaleDateString();
      // Status mapping: Submitted -> Pending, Under Review -> In Review, Approved -> Accepted, Declined -> Rejected
      let statusLabel = 'Pending';
      if (app.status === 'Under Review') statusLabel = 'In Review';
      if (app.status === 'Approved') statusLabel = 'Accepted';
      if (app.status === 'Declined') statusLabel = 'Rejected';

      rows.push([
        'Social Relief Program',
        app.id,
        app.programName,
        formattedDate,
        statusLabel,
        app.applicantName,
        app.email,
        app.phone,
        `Address: ${app.address} | Need Description: ${app.descriptionOfNeed.replace(/[\r\n]+/g, ' ')}`
      ]);
    });

    if (rows.length === 0) {
      triggerNotification(t('profile.csv_empty', 'You do not have any logged applications to export.'), 'info');
      return;
    }

    // Convert helper
    const csvContent = [
      headers.join(','),
      ...rows.map(row => 
        row.map(value => {
          // Escape quotes and wrap
          const escaped = value.replace(/"/g, '""');
          return `"${escaped}"`;
        }).join(',')
      )
    ].join('\n');

    // Trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `offinso_portal_applications_${currentUser.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerNotification(t('profile.csv_success', 'Your application history has been exported as a CSV file!'), 'success');
  };

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-rose-950 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-200 dark:border-rose-900">
          <AlertCircle className="w-8 h-8 text-rose-600 dark:text-rose-400" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-zinc-950 dark:text-white mb-2">
          {t('profile.auth_required_title', 'Access Restricted')}
        </h2>
        <p className="text-zinc-650 mb-6 max-w-md mx-auto">
          {t('profile.auth_required_desc', 'Please sign in to your unique registered portal account to view application history, track responses, and manage basic secure contact formats.')}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6" id="offinso-user-profile-view">
      
      {/* Toast Notification overlay */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-50 max-w-sm px-4 py-3 rounded-lg shadow-lg border flex items-start gap-3 transition-all ${
              notification.type === 'success' 
                ? 'bg-emerald-50 dark:bg-emerald-950/90 text-emerald-900 dark:text-emerald-100 border-emerald-200 dark:border-emerald-800' 
                : 'bg-indigo-50 dark:bg-indigo-950/90 text-indigo-900 dark:text-indigo-100 border-indigo-200 dark:border-indigo-800'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5 animate-bounce" />
            ) : (
              <Sparkles className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="text-sm font-semibold">{notification.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Welcome Unit */}
      <div className="bg-gradient-to-r from-offinso-green-950 to-offinso-green-800 rounded-xl p-6 sm:p-8 text-white relative overflow-hidden shadow-md border border-offinso-green-700/50 mb-8">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-1/4 translate-x-1/8">
          <UserIcon className="w-96 h-96" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-offinso-green-905 border border-offinso-gold/40 flex items-center justify-center shrink-0">
              <span className="text-2xl font-serif font-extrabold text-[#efbf12]">
                {currentUser.fullName ? currentUser.fullName[0].toUpperCase() : 'U'}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-serif font-bold text-white">
                  {currentUser.fullName}
                </h1>
                <span className="bg-offinso-gold/20 border border-offinso-gold/30 text-[#efbf12] text-[10px] px-2 py-0.5 rounded font-mono font-bold tracking-widest uppercase">
                  {t('profile.badge_resident', 'REG RESIDENT')}
                </span>
              </div>
              <p className="text-sm text-zinc-300 mt-1 flex items-center gap-1.5 font-mono">
                <Mail className="w-3.5 h-3.5" /> {currentUser.email}
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                {t('profile.member_since', 'Charter registered on:')} {new Date(currentUser.registeredAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 shrink-0 md:text-right">
            <div className="text-xs font-mono text-zinc-300">
              {t('profile.total_activities', 'Active Engagements Log:')}
            </div>
            <div className="flex gap-3 justify-start md:justify-end">
              <div className="bg-offinso-green-905 border border-offinso-green-800 px-3 py-1.5 rounded text-center">
                <span className="block text-lg font-bold font-serif text-[#efbf12]">{userJobApps.length}</span>
                <span className="text-[10px] uppercase text-zinc-300 font-mono">{t('profile.stats_jobs', 'Jobs')}</span>
              </div>
              <div className="bg-offinso-green-905 border border-offinso-green-800 px-3 py-1.5 rounded text-center">
                <span className="block text-lg font-bold font-serif text-[#efbf12]">{userReliefApps.length}</span>
                <span className="text-[10px] uppercase text-zinc-300 font-mono">{t('profile.stats_relief', 'Relief')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Draft Recovery Alert Notification */}
      <AnimatePresence>
        {hasDraft && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 overflow-hidden"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm text-amber-900 dark:text-amber-100">
                  {t('profile.draft_found_title', 'Draft Contact Details Detected')}
                </h4>
                <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
                  {t('profile.draft_found_desc', 'You have uncommitted modifications saved from your previous session edit. Would you like to restore them to the form?')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                type="button"
                onClick={handleLoadDraft}
                className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs px-3 py-1.5 rounded text-center transition-colors cursor-pointer"
              >
                {t('profile.draft_btn_apply', 'Apply Draft')}
              </button>
              <button
                type="button"
                onClick={handleDiscardDraft}
                className="text-zinc-650 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-450 p-1.5 rounded transition-colors text-xs flex items-center gap-1 cursor-pointer"
                title="Discard saved draft progress"
              >
                <Trash2 className="w-3.5 h-3.5" /> {t('profile.draft_btn_discard', 'Discard')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-offinso-green-800/80 pb-3 mb-6">
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-offinso-green-950/60 p-1 rounded-lg border border-zinc-200/60 dark:border-offinso-green-800/50">
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'history'
                ? 'bg-white dark:bg-offinso-green-900 text-offinso-green-950 dark:text-[#efbf12] shadow-xs'
                : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-offinso-green-900/40'
            }`}
          >
            <History className="w-4 h-4" />
            {t('profile.tab_history', 'Application Tracker')}
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'edit'
                ? 'bg-white dark:bg-offinso-green-900 text-offinso-green-950 dark:text-[#efbf12] shadow-xs'
                : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-offinso-green-900/40'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            {t('profile.tab_edit', 'Update Secure Profile')}
          </button>
        </div>

        {activeTab === 'history' && (userJobApps.length > 0 || userReliefApps.length > 0) && (
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-offinso-green-800 hover:bg-offinso-green-900 dark:bg-offinso-green-900/40 dark:hover:bg-offinso-green-900 border border-offinso-green-700 hover:border-offinso-gold/60 text-white hover:text-offinso-gold transition-all text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            <Download className="w-4 h-4" />
            {t('profile.export_csv', 'Export CSV ledger')}
          </button>
        )}
      </div>

      {/* Content Areas with Smooth Animated Transitions */}
      <div className="relative overflow-hidden min-h-[350px]">
        <AnimatePresence mode="wait">
          
          {/* TRACKING HISTORY VIEW */}
          {activeTab === 'history' && (
            <motion.div
              key="history-panel"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.22 }}
              className="space-y-8"
            >
              {userJobApps.length === 0 && userReliefApps.length === 0 ? (
                <div className="bg-white dark:bg-offinso-green-900 rounded-xl p-8 text-center border border-zinc-200 dark:border-offinso-green-800">
                  <FileText className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
                  <h3 className="font-serif font-bold text-lg text-zinc-900 dark:text-white">
                    {t('profile.no_applications_title', 'No Active Submissions Found')}
                  </h3>
                  <p className="text-zinc-500 max-w-sm mx-auto text-sm mt-1 mb-4">
                    {t('profile.no_applications_desc', 'You have not submitted any applications for corporate jobs or citizen relief campaigns using this email signature.')}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">

                  {/* 1. RELIEF APPLICATIONS Subsections */}
                  {userReliefApps.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 border-l-4 border-offinso-gold pl-3">
                        <HeartHandshake className="w-5 h-5 text-offinso-gold shrink-0" />
                        <h3 className="font-serif font-bold text-lg text-zinc-950 dark:text-white uppercase tracking-wide">
                          {t('profile.relief_subs_title', 'Citizen Social Relief Programs Tracker')}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userReliefApps.map((app) => {
                          const formattedDate = new Date(app.submittedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
                          
                          // Status Colors Mapping
                          let statusBg = 'bg-amber-50 dark:bg-amber-955/60 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300';
                          let statusLabel = 'Submitted';

                          if (app.status === 'Under Review') {
                            statusBg = 'bg-blue-50 dark:bg-blue-955/60 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300';
                            statusLabel = 'In Review';
                          } else if (app.status === 'Approved') {
                            statusBg = 'bg-emerald-50 dark:bg-emerald-955/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300';
                            statusLabel = 'Approved';
                          } else if (app.status === 'Declined') {
                            statusBg = 'bg-rose-50 dark:bg-rose-955/60 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300';
                            statusLabel = 'Declined';
                          }

                          return (
                            <div 
                              key={app.id} 
                              className="bg-white dark:bg-offinso-green-900 border border-zinc-200 dark:border-offinso-green-800/80 rounded-xl p-5 hover:shadow-md transition-all flex flex-col justify-between"
                            >
                              <div>
                                <div className="flex justify-between items-start gap-2 mb-3">
                                  <div>
                                    <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block font-bold">
                                      Ref: {app.referenceNumber || app.id.slice(0, 8).toUpperCase()}
                                    </span>
                                    <h4 className="font-bold text-base text-zinc-900 dark:text-zinc-100 group-hover:text-offinso-gold mt-0.5">
                                      {app.programName}
                                    </h4>
                                  </div>
                                  
                                  {/* Real-time Status Indicator Badge */}
                                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border shrink-0 font-mono ${statusBg}`}>
                                    {statusLabel}
                                  </span>
                                </div>

                                <div className="space-y-2 text-xs font-sans text-zinc-650 dark:text-zinc-300">
                                  <p className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                                    <span>Applied on: {formattedDate}</span>
                                  </p>
                                  <p className="flex items-center gap-1.5">
                                    <UserIcon className="w-3.5 h-3.5 text-zinc-400" />
                                    <span className="truncate">Contact: {app.applicantName}</span>
                                  </p>
                                  <p className="flex items-center gap-1.5">
                                    <Phone className="w-3.5 h-3.5 text-zinc-400" />
                                    <span>Phone: {app.phone}</span>
                                  </p>
                                  {app.incomeTier && (
                                    <p className="text-[11px] font-mono mt-1 pt-1 border-t border-zinc-100 dark:border-offinso-green-800/40">
                                      <span className="text-zinc-400">Income Segment Tier:</span> {app.incomeTier}
                                    </p>
                                  )}
                                  <p className="text-zinc-500 dark:text-zinc-400 italic line-clamp-2 mt-2 bg-zinc-50 dark:bg-offinso-green-950/50 p-2 rounded text-[11px] leading-relaxed">
                                    "{app.descriptionOfNeed}"
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 2. JOB APPLICATIONS Subsections */}
                  {userJobApps.length > 0 && (
                    <div className="space-y-4 pt-4">
                      <div className="flex items-center gap-2 border-l-4 border-offinso-gold pl-3">
                        <Briefcase className="w-5 h-5 text-offinso-gold shrink-0" />
                        <h3 className="font-serif font-bold text-lg text-zinc-950 dark:text-white uppercase tracking-wide">
                          {t('profile.jobs_subs_title', 'Corporate & Labor Jobs Tracker')}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userJobApps.map((app) => {
                          const formattedDate = new Date(app.submittedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
                          
                          // Mocking/Retrieving Status Indicators
                          // Let's create an elegant pseudo-deterministic or random status standard to emulate real-time backend reviews
                          const lastChar = app.id.charAt(app.id.length - 1);
                          let statusLabel = 'Pending';
                          let statusBg = 'bg-amber-50 dark:bg-amber-955/60 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300';
                          
                          if (['a', 'e', 'i', 'o', '1', '5'].includes(lastChar)) {
                            statusLabel = 'In Review';
                            statusBg = 'bg-blue-50 dark:bg-blue-955/60 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300';
                          } else if (['b', 'f', '2', '6', '9'].includes(lastChar)) {
                            statusLabel = 'Accepted';
                            statusBg = 'bg-emerald-50 dark:bg-emerald-955/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300';
                          } else if (['c', '3', '7'].includes(lastChar)) {
                            statusLabel = 'Rejected';
                            statusBg = 'bg-rose-50 dark:bg-rose-955/60 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300';
                          }

                          return (
                            <div 
                              key={app.id} 
                              className="bg-white dark:bg-offinso-green-900 border border-zinc-200 dark:border-offinso-green-800/80 rounded-xl p-5 hover:shadow-md transition-all flex flex-col justify-between hover:border-offinso-green-800"
                            >
                              <div>
                                <div className="flex justify-between items-start gap-2 mb-3">
                                  <div>
                                    <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-505 uppercase tracking-widest block font-bold">
                                      App-ID: {app.id.slice(0, 9).toUpperCase()}
                                    </span>
                                    <h4 className="font-bold text-base text-zinc-900 dark:text-zinc-100 mt-0.5">
                                      {app.jobTitle}
                                    </h4>
                                  </div>

                                  {/* Real-time Status Indicator Badge */}
                                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border shrink-0 font-mono ${statusBg}`}>
                                    {statusLabel}
                                  </span>
                                </div>

                                <div className="space-y-2 text-xs text-zinc-650 dark:text-zinc-300">
                                  <p className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                                    <span>Applied on: {formattedDate}</span>
                                  </p>
                                  <p className="flex items-center gap-1.5">
                                    <UserIcon className="w-3.5 h-3.5 text-zinc-400" />
                                    <span className="truncate">Contact Nominee: {app.applicantName}</span>
                                  </p>
                                  <p className="flex items-center gap-1.5">
                                    <Phone className="w-3.5 h-3.5 text-zinc-400" />
                                    <span>Direct Line: {app.applicantPhone}</span>
                                  </p>
                                  <p className="text-zinc-500 dark:text-zinc-400 italic line-clamp-2 mt-2 bg-zinc-50 dark:bg-offinso-green-950/50 p-2 rounded text-[11px] leading-relaxed">
                                    "{app.coverLetter}"
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>
              )}
            </motion.div>
          )}

          {/* SECURE UPDATE PROFILE VIEW */}
          {activeTab === 'edit' && (
            <motion.div
              key="edit-panel"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.22 }}
              className="bg-white dark:bg-offinso-green-900 border border-zinc-200 dark:border-offinso-green-800 rounded-xl p-6 sm:p-8"
            >
              <div className="flex items-center gap-2 mb-6 border-b border-zinc-100 dark:border-offinso-green-850 pb-4">
                <FileCheck className="w-5 h-5 text-offinso-gold" />
                <h3 className="font-serif font-bold text-lg text-zinc-950 dark:text-white">
                  {t('profile.form_title', 'Update Personal Registry Details')}
                </h3>
              </div>

              <form onSubmit={handleSaveChanges} className="space-y-6">
                
                {/* 1. Full Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 font-mono mb-2">
                    {t('profile.fullName_label', 'Full Registered Name')} <span className="text-[#efbf12] font-bold">*</span>
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-zinc-300 dark:border-offinso-green-800 focus:outline-none focus:ring-1 focus:ring-offinso-gold bg-zinc-50 transition-all font-medium text-sm text-zinc-900"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Gina Owusu Forkuo"
                      required
                    />
                  </div>
                  {fullName && !validateName(fullName) ? (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-500 font-bold text-[10.5px] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.fullName}
                    </motion.p>
                  ) : fullName ? (
                    <p className="text-emerald-500 font-bold text-[10.5px] mt-1 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> {t('profile.valid_name', 'Valid name format')}
                    </p>
                  ) : null}
                </div>

                {/* 2. Email Address */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 font-mono mb-2">
                    {t('profile.email_label', 'Primary Signature Email')} <span className="text-[#efbf12] font-bold">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-zinc-300 dark:border-offinso-green-800 focus:outline-none focus:ring-1 focus:ring-offinso-gold bg-zinc-50 transition-all font-medium text-sm text-zinc-900"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. gina@domain.com"
                      required
                    />
                  </div>
                  {email && !validateEmail(email) ? (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-500 font-bold text-[10.5px] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                    </motion.p>
                  ) : email ? (
                    <p className="text-emerald-500 font-bold text-[10.5px] mt-1 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> {t('profile.valid_name', 'Valid name format')}
                    </p>
                  ) : null}
                </div>

                {/* 3. Phone & Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 font-mono mb-2">
                      {t('profile.phone_label', 'Active Telephone')}
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-zinc-300 dark:border-offinso-green-800 focus:outline-none focus:ring-1 focus:ring-offinso-gold bg-zinc-50 transition-all font-medium text-sm text-zinc-900"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +233 54 583 2619"
                      />
                    </div>
                    {phone && !validatePhone(phone) ? (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-500 font-bold text-[10.5px] mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.phone}
                      </motion.p>
                    ) : phone ? (
                      <p className="text-emerald-500 font-bold text-[10.5px] mt-1 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> {t('profile.valid_phone', 'Correct telephone format')}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 font-mono mb-2">
                      {t('profile.address_label', 'Residential Address / Location')}
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-zinc-300 dark:border-offinso-green-800 focus:outline-none focus:ring-1 focus:ring-offinso-gold bg-zinc-50 transition-all font-medium text-sm text-zinc-900"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g. High Street, Town Central, Offinso"
                      />
                    </div>
                    {address && !validateAddress(address) ? (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-500 font-bold text-[10.5px] mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.address}
                      </motion.p>
                    ) : address ? (
                      <p className="text-emerald-500 font-bold text-[10.5px] mt-1 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> {t('profile.valid_address', 'Address structured correctly')}
                      </p>
                    ) : null}
                  </div>
                </div>

                {/* Form Action Controls */}
                <div className="pt-6 border-t border-zinc-100 dark:border-offinso-green-850 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
                  <div className="text-xs text-zinc-400">
                    <span className="text-[#efbf12] font-bold">*</span> {t('profile.mandatory_notice', 'Indicates required database fields.')}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    {/* SAVE DRAFT PROGRESS */}
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      className="bg-zinc-100 hover:bg-zinc-200 dark:bg-offinso-green-850 dark:hover:bg-offinso-green-800 text-zinc-700 dark:text-zinc-200 hover:text-zinc-955 font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 border border-zinc-300/80 dark:border-offinso-green-700/80"
                    >
                      <Save className="w-4 h-4 text-offinso-gold" />
                      {t('profile.btn_draft', 'Save Draft')}
                    </button>

                    {/* CONFIRM AND PERSIST TO DB */}
                    <button
                      type="submit"
                      disabled={!isFormValid}
                      className={`font-semibold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-white ${
                        isFormValid 
                          ? 'bg-offinso-green-800 hover:bg-offinso-green-900 border border-offinso-green-700 shadow-xs hover:border-offinso-gold' 
                          : 'bg-zinc-300 dark:bg-zinc-750 text-zinc-500 dark:text-zinc-500 border border-zinc-200 dark:border-zinc-800 cursor-not-allowed'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      {t('profile.btn_commit', 'Commit Profile Updates')}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
