/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, Search, UploadCloud, CheckCircle, FileText, BadgeInfo, Building, Sparkles, Phone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { JobPost, JobApplication, User } from '../types';

interface JobSearchSectionProps {
  jobs: JobPost[];
  applications: JobApplication[];
  onPostJob: (newJob: Omit<JobPost, 'id' | 'postedAt'>) => void;
  onApplyForJob: (application: Omit<JobApplication, 'id' | 'submittedAt'>) => void;
  searchQuery: string;
  currentUser?: User | null;
}

export default function JobSearchSection({
  jobs,
  applications,
  onPostJob,
  onApplyForJob,
  searchQuery,
  currentUser
}: JobSearchSectionProps) {
  const { t, language } = useLanguage();

  // Tabs and toggles
  const [activeSubTab, setActiveSubTab] = useState<'browse' | 'post' | 'my-applications'>('browse');
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  
  // Job Post form fields
  const [postTitle, setPostTitle] = useState('');
  const [postCompany, setPostCompany] = useState('');
  const [postLocation, setPostLocation] = useState('');
  const [postType, setPostType] = useState<'Full-time' | 'Part-time' | 'Seasonal' | 'Contract'>('Full-time');
  const [postCategory, setPostCategory] = useState('Tourism & Education');
  const [postSalary, setPostSalary] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [postRequirements, setPostRequirements] = useState('');
  const [postSuccess, setPostSuccess] = useState(false);
  const [postIsGig, setPostIsGig] = useState(false);

  // Job Application form fields
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [simulatedResumeName, setSimulatedResumeName] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState('');

  // Filtering criteria
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchJobTitle, setSearchJobTitle] = useState<string>('');
  const [searchJobLocation, setSearchJobLocation] = useState<string>('');

  const categories = ['All', ...Array.from(new Set(jobs.map(j => j.category)))];

  // Filter jobs list
  const filteredJobs = jobs.filter(job => {
    const matchesType = selectedType === 'All' || job.type === selectedType;
    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
    const matchesJobTitle = searchJobTitle === '' || job.title.toLowerCase().includes(searchJobTitle.toLowerCase());
    const matchesJobLocation = searchJobLocation === '' || job.location.toLowerCase().includes(searchJobLocation.toLowerCase());
    
    const matchesSearch = searchQuery === '' || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesCategory && matchesJobTitle && matchesJobLocation && matchesSearch;
  });

  // Handle Post Job Submit
  const handlePostJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postCompany.trim() || !postLocation.trim() || !postDescription.trim()) {
      return;
    }

    const separatedReqs = postRequirements
      .split(',')
      .map(r => r.trim())
      .filter(r => r.length > 0);

    onPostJob({
      title: postTitle.trim(),
      company: postCompany.trim(),
      location: postLocation.trim(),
      type: postType,
      category: postCategory,
      salaryRange: postSalary.trim() || 'Hourly/TDB',
      requirements: separatedReqs.length > 0 ? separatedReqs : [t('jobs.train_spirit', 'Willingness to train'), t('jobs.teamwork_spirit', 'Teamwork spirit')],
      description: postDescription.trim(),
      isGig: postIsGig
    });

    // Reset post form
    setPostTitle('');
    setPostCompany('');
    setPostLocation('');
    setPostSalary('');
    setPostDescription('');
    setPostRequirements('');
    setPostIsGig(false);
    
    setPostSuccess(true);
    setTimeout(() => {
      setPostSuccess(false);
      setActiveSubTab('browse');
    }, 2000);
  };

  // Handle Apply For Job Submit
  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    if (!applicantName.trim() || !applicantEmail.trim() || !applicantPhone.trim()) {
      setApplyError(t('jobs.contact_error', 'Please fill out all contact fields to complete your application.'));
      return;
    }

    if (!simulatedResumeName) {
      setApplyError(t('jobs.resume_error', 'Please attach or drag-and-drop a resume PDF/Word to fulfill criteria.'));
      return;
    }

    onApplyForJob({
      jobId: selectedJob.id,
      jobTitle: selectedJob.title,
      applicantName: applicantName.trim(),
      applicantEmail: applicantEmail.trim(),
      applicantPhone: applicantPhone.trim(),
      coverLetter: coverLetter.trim()
    });

    // Reset application form
    setApplicantName('');
    setApplicantEmail('');
    setApplicantPhone('');
    setCoverLetter('');
    setSimulatedResumeName('');
    setApplyError('');
    setApplySuccess(true);

    setTimeout(() => {
      setApplySuccess(false);
      setSelectedJob(null); // Close modal
    }, 2500);
  };

  // Drop File Simulator
  const handleFileDropSimulator = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSimulatedResumeName(e.target.files[0].name);
    }
  };

  // Sync applicant fields from current user session
  React.useEffect(() => {
    if (currentUser) {
      setApplicantName(currentUser.fullName);
      setApplicantEmail(currentUser.email);
    }
  }, [currentUser]);

  return (
    <div id="offinso-jobs-portal" className="space-y-8 py-4">
      
      {/* Top Header Block */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-zinc-200 pb-5 gap-4">
        <div>
          <span className="text-xs text-offinso-gold font-bold uppercase tracking-widest font-mono">{t('jobs.dept_label', 'Department of labor & Tourism')}</span>
          <h2 className="font-serif text-3xl font-bold text-offinso-green-900 mt-1">{t('jobs.board_title', 'Offinso Careers & Employment Board')}</h2>
          <p className="text-zinc-500 text-xs mt-1">
            {t('jobs.board_desc', 'Reaching out to local Offinso citizens and foreign nationals. Review openings or list your registered enterprise roles.')}
          </p>
        </div>

        {/* Local portal sub-tabs */}
        <div className="flex bg-zinc-100 rounded-md p-1 border">
          <button
            onClick={() => setActiveSubTab('browse')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition cursor-pointer ${
              activeSubTab === 'browse' ? 'bg-white text-offinso-green-900 shadow-2xs font-bold' : 'text-zinc-650 hover:text-zinc-900'
            }`}
          >
            {t('jobs.tab_listings', 'Browse Careers')}
          </button>
          <button
            onClick={() => setActiveSubTab('post')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition cursor-pointer ${
              activeSubTab === 'post' ? 'bg-white text-offinso-green-900 shadow-2xs font-bold' : 'text-zinc-655 hover:text-zinc-900'
            }`}
          >
            {t('jobs.tab_post', 'Post a Vacancy')}
          </button>
          <button
            onClick={() => {
              setActiveSubTab('my-applications');
              setSelectedJob(null);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition relative cursor-pointer ${
              activeSubTab === 'my-applications' ? 'bg-white text-offinso-green-900 shadow-2xs font-bold' : 'text-zinc-655 hover:text-zinc-900'
            }`}
          >
            {t('jobs.tab_applications', 'Sent Applications')}
            {applications.length > 0 && (
              <span className="absolute -top-1 right-0 w-4 h-4 bg-offinso-dirt text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {applications.length}
              </span>
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
              ? 'Sɛ wo hia mmoa wɔ afasɔ mu a, wobɛtumi abɔ fon nɔma yi: 0249560120.'
              : 'If you need help applying, you can contact the phone number 0249560120.'
            }
          </p>
        </div>
      </div>

      {/* Subtab Contents router */}
      {activeSubTab === 'browse' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left 1 Column: Filter Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-zinc-200 rounded-lg p-5 shadow-2xs space-y-5">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-100">
                <h4 className="font-serif font-bold text-sm text-zinc-900 uppercase tracking-wider">
                  {t('jobs.filter_title', 'Filter Careers')}
                </h4>
                <button
                  onClick={() => {
                    setSearchJobTitle('');
                    setSearchJobLocation('');
                    setSelectedType('All');
                    setSelectedCategory('All');
                  }}
                  className="text-[10px] uppercase font-mono font-bold text-offinso-dirt hover:underline cursor-pointer"
                >
                  {t('global.reset', 'Reset')}
                </button>
              </div>

              {/* Job Title Filter Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">{t('jobs.filter_job_title', 'Job Title')}</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchJobTitle}
                    onChange={(e) => setSearchJobTitle(e.target.value)}
                    placeholder={t('jobs.title_placeholder', 'e.g. Ranger, Manager, Farm hand')}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-offinso-green-700"
                  />
                  {searchJobTitle && (
                    <button onClick={() => setSearchJobTitle('')} className="absolute right-2 top-2 text-zinc-400 font-bold hover:text-zinc-650 cursor-pointer">✕</button>
                  )}
                </div>
              </div>

              {/* Job Location Filter Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">{t('jobs.filter_location', 'Location / Town')}</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchJobLocation}
                    onChange={(e) => setSearchJobLocation(e.target.value)}
                    placeholder={t('jobs.location_placeholder', 'e.g. Offinso, Abofour')}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-offinso-green-700"
                  />
                  {searchJobLocation && (
                    <button onClick={() => setSearchJobLocation('')} className="absolute right-2 top-2 text-zinc-400 hover:text-zinc-655 font-bold cursor-pointer">✕</button>
                  )}
                </div>
              </div>

              {/* Job Type Filter */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">{t('jobs.filter_classification', 'Job Classification')}</label>
                <div className="space-y-1.5 font-sans">
                  {['All', 'Full-time', 'Part-time', 'Seasonal', 'Contract'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`w-full text-left text-xs px-2.5 py-1.5 rounded transition font-medium flex justify-between items-center cursor-pointer ${
                        selectedType === type
                          ? 'bg-offinso-green-50 text-offinso-green-900 font-bold'
                          : 'text-zinc-655 hover:bg-zinc-50'
                      }`}
                    >
                      <span>{language === 'tw' && type === 'All' ? 'Nyinaa' : type}</span>
                      {selectedType === type && <span className="w-1.5 h-1.5 bg-offinso-green-700 rounded-full"></span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Job Category Filter */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">{t('jobs.industry_domain', 'Industry Domain')}</label>
                <div className="space-y-1.5 font-sans">
                  {categories.map((cat) => {
                    let displayName = cat;
                    if (language === 'tw') {
                      if (cat === 'All') displayName = 'Nyinaa';
                      if (cat === 'Tourism & Education') displayName = 'Tourism ne Sukuu';
                      if (cat === 'Fisheries & Marine') displayName = 'Mpɔtam Lɔre / Nsuom';
                      if (cat === 'Agriculture & Forestry') displayName = 'Kɔkɔɔ & Kwaeyɛ';
                      if (cat === 'Hospitality & Travel') displayName = 'Akwantuo & Hɔtel';
                      if (cat === 'Healthcare & Social') displayName = 'Ayaresabea & Amansin';
                    }
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left text-xs px-2.5 py-1.5 rounded transition font-medium flex justify-between items-center cursor-pointer ${
                          selectedCategory === cat
                            ? 'bg-offinso-green-50 text-offinso-green-900 font-bold'
                            : 'text-zinc-655 hover:bg-zinc-50'
                        }`}
                      >
                        <span className="truncate pr-1">{displayName}</span>
                        {selectedCategory === cat && <span className="w-1.5 h-1.5 bg-offinso-green-700 rounded-full"></span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Employment Rights reminder */}
            <div className="bg-offinso-gold-light/40 border border-[#efbf12]/30 rounded-lg p-5 space-y-2 text-xs">
              <span className="text-[10px] font-mono text-offinso-gold font-bold uppercase tracking-wider flex items-center gap-1.5">
                <BadgeInfo className="w-3.5 h-3.5" /> {t('jobs.wages_notice_title', 'Fair Wages Notice')}
              </span>
              <p className="leading-relaxed">
                {t('jobs.wages_notice_desc', 'Offinso minimum wage guides are based on standard sustainable livelihoods. Certified employers are subject to verification review.')}
              </p>
            </div>
          </div>

          {/* Right 3 Columns: Careers & Gigs List */}
          <div className="lg:col-span-3 space-y-8">
            
            <div className="flex justify-between items-baseline text-xs text-zinc-500 font-mono">
              <p>OPPORTUNITIES LEDGER</p>
              <p>{t('global.found', 'Found')} {filteredJobs.length} position(s)</p>
            </div>

            {filteredJobs.length === 0 ? (
              <div className="bg-white border border-zinc-200 rounded-lg p-12 text-center text-zinc-500">
                {t('jobs.no_jobs', 'No career opportunities match your combined search filters.')}
              </div>
            ) : (
              <div className="space-y-8">
                {/* 1. Job Listings Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-zinc-200 pb-2">
                    <Briefcase className="w-5 h-5 text-offinso-green-800" />
                    <h3 className="font-serif font-bold text-lg text-offinso-green-950">
                      {language === 'tw' ? 'Nnwuma Pɔtee (Job Listings)' : 'Career Job Listings'}
                    </h3>
                    <span className="text-xs bg-offinso-green-50 text-offinso-green-850 px-2.5 py-0.5 rounded-full font-bold font-mono ml-auto">
                      {filteredJobs.filter(j => !j.isGig).length}
                    </span>
                  </div>

                  {filteredJobs.filter(j => !j.isGig).length === 0 ? (
                    <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-6 text-center text-zinc-500 text-xs italic">
                      {language === 'tw' ? 'Nnwuma biara nni hɔ seesei.' : 'No active career job listings match your filters.'}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredJobs.filter(j => !j.isGig).map((job) => {
                        let translatedTitle = job.title;
                        let translatedDesc = job.description;
                        let translatedCompany = job.company;
                        let translatedLoc = job.location;

                        if (language === 'tw') {
                          if (job.id === 'job_1') {
                            translatedTitle = 'Nhyehyɛeɛ Nkabomfoɔ (Programs Coordinator)';
                            translatedCompany = 'Offensal Private Hub';
                            translatedLoc = 'Offinso Town Center';
                            translatedDesc = 'Di nhyehyɛeɛ a ɛfa mmoa sika ne aduane nhyehyɛeɛ ho anim wɔ Offinso mantam mu. Wobɛhwɛ akuafoɔ mmoa ne nhyehyɛeɛ guaso fɛfɛɛfɛ.';
                          } else if (job.id === 'job_2') {
                            translatedTitle = 'Adansiefoɔ Adwumayɛfoɔ (Construction Laborer)';
                            translatedCompany = 'Multiple Employers';
                            translatedLoc = 'Offinso Central / Abofour';
                            translatedDesc = 'Boa ma yɛnsie adan ne mmoa nkurow ahodoɔ. Wobɛfa nneɛma, masons mmoa, ne adwuma ahorow pii.';
                          } else if (job.id === 'job_3') {
                            translatedTitle = 'Okuafoɔ Dwumayɛfoɔ (Farm Laborer)';
                            translatedCompany = 'Multiple Employers';
                            translatedLoc = 'Abofour District (Offinso North)';
                            translatedDesc = 'Boa adwumakuo gu kɔkɔɔ turo mu adwuma fɛfɛɛfɛ bi te sɛ nnɔbae sua, weedu pii twene, ne kɔkɔɔ nneɛma fɛfɛ.';
                          } else if (job.id === 'job_4') {
                            translatedTitle = 'Ntadeɛ Nwunifoɔ (Fashion Designer)';
                            translatedCompany = 'Multiple Employers';
                            translatedLoc = 'Offinso Town Center';
                            translatedDesc = 'Yɛpɛ ntadeɛ nwunifoɔ anaa adwumfoɔ a ɔbɛtumi atete nnipa ntadeɛ fɛfɛɛfɛ ama kuo ne amansan. Ɛsɛ sɛ wowɔ adwuma ho nneɛma.';
                          }
                        }

                        return (
                          <div
                            key={job.id}
                            id={`job-post-${job.id}`}
                            className="bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-2xs hover:shadow-md hover:border-zinc-300 transition flex flex-col justify-between"
                          >
                            <div className="p-5 flex-1 flex flex-col justify-between">
                              <div className="space-y-2">
                                <h4 className="font-serif font-bold text-zinc-900 text-base hover:text-offinso-green-700 leading-snug cursor-pointer" onClick={() => setSelectedJob(job)}>
                                  {translatedTitle}
                                </h4>
                                <p className="text-zinc-650 text-xs leading-relaxed line-clamp-3">
                                  {translatedDesc}
                                </p>
                              </div>

                              <div className="mt-4 flex items-center justify-between text-xs text-zinc-650 border-t pt-3">
                                <span className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5 text-offinso-gold" /> {translatedCompany}</span>
                                <span className="font-bold text-offinso-green-800">{job.salaryRange}</span>
                              </div>

                              <div className="mt-4 pt-4 border-t border-zinc-150 flex items-center justify-between gap-3">
                                <span className="text-[10px] bg-zinc-100 border text-zinc-600 px-2 py-0.5 rounded font-mono font-bold uppercase">{job.type}</span>
                                <button
                                  onClick={() => setSelectedJob(job)}
                                  className="bg-offinso-green-700 hover:bg-offinso-green-800 text-white font-bold text-[11px] px-3.5 py-1.5 rounded transition uppercase tracking-wider cursor-pointer"
                                >
                                  {t('global.apply_now', 'Apply')}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 2. Gigs Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-zinc-200 pb-2">
                    <Sparkles className="w-5 h-5 text-offinso-gold" />
                    <h3 className="font-serif font-bold text-lg text-offinso-green-950">
                      {language === 'tw' ? 'Nnwuma nketewa ne Gigs (Available Gigs)' : 'Available Gigs & Tasks'}
                    </h3>
                    <span className="text-xs bg-offinso-gold/10 text-offinso-gold font-bold px-2.5 py-0.5 rounded-full font-mono ml-auto">
                      {filteredJobs.filter(j => !!j.isGig).length}
                    </span>
                  </div>

                  {filteredJobs.filter(j => !!j.isGig).length === 0 ? (
                    <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-6 text-center text-zinc-500 text-xs italic">
                      {language === 'tw' ? 'Gigs biara nni hɔ seesei.' : 'No active gigs match your filters.'}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredJobs.filter(j => !!j.isGig).map((job) => {
                        let translatedTitle = job.title;
                        let translatedDesc = job.description;
                        let translatedCompany = job.company;
                        let translatedLoc = job.location;

                        if (language === 'tw') {
                          if (job.id === 'job_1') {
                            translatedTitle = 'Nhyehyɛeɛ Nkabomfoɔ (Programs Coordinator)';
                            translatedCompany = 'Offensal Private Hub';
                            translatedLoc = 'Offinso Town Center';
                            translatedDesc = 'Di nhyehyɛeɛ a ɛfa mmoa sika ne aduane nhyehyɛeɛ ho anim wɔ Offinso mantam mu. Wobɛhwɛ akuafoɔ mmoa ne nhyehyɛeɛ guaso fɛfɛɛfɛ.';
                          } else if (job.id === 'job_2') {
                            translatedTitle = 'Adansiefoɔ Adwumayɛfoɔ (Construction Laborer)';
                            translatedCompany = 'Multiple Employers';
                            translatedLoc = 'Offinso Central / Abofour';
                            translatedDesc = 'Boa ma yɛnsie adan ne mmoa nkurow ahodoɔ. Wobɛfa nneɛma, masons mmoa, ne adwuma ahorow pii.';
                          } else if (job.id === 'job_3') {
                            translatedTitle = 'Okuafoɔ Dwumayɛfoɔ (Farm Laborer)';
                            translatedCompany = 'Multiple Employers';
                            translatedLoc = 'Abofour District (Offinso North)';
                            translatedDesc = 'Boa adwumakuo gu kɔkɔɔ turo mu adwuma fɛfɛɛfɛ bi te sɛ nnɔbae sua, weedu pii twene, ne kɔkɔɔ nneɛma fɛfɛ.';
                          } else if (job.id === 'job_4') {
                            translatedTitle = 'Ntadeɛ Nwunifoɔ (Fashion Designer)';
                            translatedCompany = 'Multiple Employers';
                            translatedLoc = 'Offinso Town Center';
                            translatedDesc = 'Yɛpɛ ntadeɛ nwunifoɔ anaa adwumfoɔ a ɔbɛtumi atete nnipa ntadeɛ fɛfɛɛfɛ ama kuo ne amansan. Ɛsɛ sɛ wowɔ adwuma ho nneɛma.';
                          }
                        }

                        return (
                          <div
                            key={job.id}
                            id={`job-post-${job.id}`}
                            className="bg-white border border-[#efbf12]/20 rounded-lg overflow-hidden shadow-2xs hover:shadow-md hover:border-[#efbf12]/40 transition flex flex-col justify-between relative"
                          >
                            <div className="absolute top-3 right-3 bg-offinso-gold-light/40 border border-[#efbf12]/30 text-offinso-gold text-[9px] font-bold font-mono px-2 py-0.5 rounded uppercase">
                              GIG
                            </div>
                            
                            <div className="p-5 flex-1 flex flex-col justify-between">
                              <div className="space-y-2">
                                <h4 className="font-serif font-bold text-zinc-900 text-base hover:text-offinso-green-700 leading-snug cursor-pointer pr-8" onClick={() => setSelectedJob(job)}>
                                  {translatedTitle}
                                </h4>
                                <p className="text-zinc-650 text-xs leading-relaxed line-clamp-3">
                                  {translatedDesc}
                                </p>
                              </div>

                              <div className="mt-4 flex items-center justify-between text-xs text-zinc-650 border-t pt-3">
                                <span className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5 text-offinso-gold" /> {translatedCompany}</span>
                                <span className="font-bold text-emerald-800">{job.salaryRange}</span>
                              </div>

                              <div className="mt-4 pt-4 border-t border-zinc-150 flex items-center justify-between gap-3">
                                <span className="text-[10px] bg-zinc-100 border text-zinc-600 px-2 py-0.5 rounded font-mono font-bold uppercase">{job.type}</span>
                                <button
                                  onClick={() => setSelectedJob(job)}
                                  className="bg-offinso-gold hover:bg-[#d8ab0f] text-zinc-950 font-bold text-[11px] px-3.5 py-1.5 rounded transition uppercase tracking-wider cursor-pointer"
                                >
                                  {language === 'tw' ? 'Gye dwuma' : 'Apply for Gig'}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        </div>
      )}

      {activeSubTab === 'post' && (
        <div className="max-w-2xl mx-auto bg-white border border-zinc-200 rounded-lg p-5 sm:p-6 shadow-2xs font-sans">
          <div className="border-b pb-3 mb-5">
            <h3 className="font-serif font-bold text-lg text-offinso-green-900">{t('jobs.post_vacancy_title', 'Establish Local Job Opening')}</h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              {t('jobs.post_vacancy_para', 'List active positions to find capable Offinso farmers, weavers, drivers, or tech managers.')}
            </p>
          </div>

          {postSuccess ? (
            <div className="space-y-4 py-8 text-center text-zinc-850">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h4 className="font-serif font-bold text-lg">{t('jobs.vacancy_published_title', 'Vacancy Published!')}</h4>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                {t('jobs.your_post_on', 'Your post')} {t('jobs.post_sync_success', 'was synchronized successfully. Transitioning you back to the board catalog...')}
              </p>
            </div>
          ) : (
            <form onSubmit={handlePostJobSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-650 block">{t('jobs.form_title', 'Position Title')}</label>
                  <input
                    type="text"
                    required
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="e.g. Cocoa Sorter"
                    className="w-full bg-zinc-50 border border-zinc-300 rounded p-2 text-zinc-950 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-zinc-650 block">{t('jobs.form_employer', 'Employer Name / Cooperative')}</label>
                  <input
                    type="text"
                    required
                    value={postCompany}
                    onChange={(e) => setPostCompany(e.target.value)}
                    placeholder="e.g. Abofour Cocoa Union"
                    className="w-full bg-zinc-50 border border-zinc-300 rounded p-2 text-zinc-955 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-650 block">{t('jobs.form_location', 'Local Community')}</label>
                  <input
                    type="text"
                    required
                    value={postLocation}
                    onChange={(e) => setPostLocation(e.target.value)}
                    placeholder="e.g. Abofour"
                    className="w-full bg-zinc-50 border border-zinc-300 rounded p-2 text-zinc-955 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-zinc-650 block">Work Schedule</label>
                  <select
                    value={postType}
                    onChange={(e) => setPostType(e.target.value as any)}
                    className="w-full bg-white border border-zinc-300 rounded p-2 text-zinc-900 focus:outline-none"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Seasonal">Seasonal</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-zinc-655 block">Industrial Category</label>
                  <select
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded p-2 text-zinc-900 focus:outline-none"
                  >
                    <option value="Tourism & Education">Tourism &amp; Education</option>
                    <option value="Fisheries & Marine">Fisheries &amp; Marine</option>
                    <option value="Agriculture & Forestry">Agriculture &amp; Forestry</option>
                    <option value="Hospitality & Travel">Hospitality &amp; Travel</option>
                    <option value="Healthcare & Social">Healthcare &amp; Social</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-650 block">Listing Classification</label>
                <div className="flex gap-4 font-sans mt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer font-medium text-zinc-700">
                    <input
                      type="radio"
                      name="postIsGig"
                      checked={!postIsGig}
                      onChange={() => setPostIsGig(false)}
                      className="accent-offinso-green-850"
                    />
                    <span>Career Job Listing</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer font-medium text-zinc-700">
                    <input
                      type="radio"
                      name="postIsGig"
                      checked={postIsGig}
                      onChange={() => setPostIsGig(true)}
                      className="accent-offinso-green-850"
                    />
                    <span>Short-term Gig / Task</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-650 block">{t('jobs.form_salary', 'Expected Pay / Compensation')}</label>
                <input
                  type="text"
                  value={postSalary}
                  onChange={(e) => setPostSalary(e.target.value)}
                  placeholder={postIsGig ? "e.g. GH₵ 95 / Project" : "e.g. GH₵ 900 / Month"}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded p-2 text-zinc-955 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-650 block">{t('jobs.form_desc', 'Detailed Job Description')}</label>
                <textarea
                  rows={4}
                  required
                  value={postDescription}
                  onChange={(e) => setPostDescription(e.target.value)}
                  placeholder="Detail daily expectations, security guidelines..."
                  className="w-full bg-zinc-50 border border-zinc-300 rounded p-2 text-zinc-955 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-650 block">{t('jobs.form_req', 'Core Requirements')}</label>
                <textarea
                  rows={3}
                  value={postRequirements}
                  onChange={(e) => setPostRequirements(e.target.value)}
                  placeholder="Format: Prior agriculture skills, Punctuality, Heavy lifting (One requirement per line)"
                  className="w-full bg-zinc-50 border border-zinc-300 rounded p-2 text-zinc-955 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-offinso-green-800 hover:bg-offinso-green-900 text-white font-bold py-2.5 rounded-lg uppercase tracking-wider transition cursor-pointer"
              >
                {t('jobs.create_post_btn', 'Verify & Post Vacancy')}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Applications list */}
      {activeSubTab === 'my-applications' && (
        <div className="max-w-4xl mx-auto bg-white border border-zinc-200 rounded-lg p-5 shadow-2xs font-sans text-xs">
          <div className="border-b pb-3 mb-5">
            <h3 className="font-serif font-bold text-lg text-offinso-green-900">Your Logged Applications</h3>
            <p className="text-zinc-500">Track all physical resumes filed for regional open positions.</p>
          </div>

          {applications.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 italic">
              <Briefcase className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
              {t('jobs.no_applications', 'You have not submitted any job proposals yet.')}
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="bg-zinc-50 border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start gap-2 border-b pb-2">
                    <div>
                      <span className="text-[10px] text-zinc-400 font-mono font-bold block">Application ID: {app.id}</span>
                      <h4 className="font-bold text-zinc-900 text-sm">{app.jobTitle}</h4>
                    </div>
                    <span className="bg-emerald-50 border border-emerald-100 text-emerald-850 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase">
                      Submitted
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-[11px] text-zinc-600">
                    <div>
                      <span className="text-[9.5px] uppercase font-bold text-zinc-400 block">Applicant</span>
                      <span className="font-semibold text-zinc-900">{app.applicantName}</span>
                    </div>
                    <div>
                      <span className="text-[9.5px] uppercase font-bold text-zinc-400 block">Email Address</span>
                      <span>{app.applicantEmail}</span>
                    </div>
                    <div>
                      <span className="text-[9.5px] uppercase font-bold text-zinc-400 block">Direct Line</span>
                      <span>{app.applicantPhone}</span>
                    </div>
                  </div>

                  {app.coverLetter && (
                    <p className="bg-white border rounded p-2.5 italic text-zinc-500 leading-relaxed text-[11px]">
                      &quot;{app.coverLetter}&quot;
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal - Job Detail & Application Submission Form */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border-t-8 border-[#004d44] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 relative custom-scrollbar animate-fade-in text-xs text-zinc-800"
              id="job-detail-modal"
            >
              <button
                onClick={() => setSelectedJob(null)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-650 focus:outline-none font-bold cursor-pointer font-sans"
              >
                ✕
              </button>

              {applySuccess ? (
                <div className="space-y-4 py-8 text-center text-zinc-850 font-sans">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                   <h4 className="font-serif font-bold text-xl">{t('jobs.application_transmitted_title', 'Application Transmitted!')}</h4>
                  <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
                    {t('jobs.application_transmitted_desc', 'Thank you. Your dossier has been secured in county directories. The hiring supervisor has been notified.')}
                  </p>
                </div>
              ) : (
                <div className="space-y-6 text-xs text-zinc-805 font-sans">
                  
                  {/* Job meta headers */}
                  <div className="border-b pb-4">
                    <div className="flex gap-2 mb-1.5">
                      <span className="bg-offinso-green-50 text-offinso-green-900 font-mono font-bold px-2 py-0.5 rounded uppercase text-[10px]">
                        {selectedJob.type}
                      </span>
                      <span className="bg-zinc-100 text-zinc-650 font-mono px-2 py-0.5 rounded text-[10px]">
                        {selectedJob.category}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-2xl text-zinc-950 leading-tight">
                      {selectedJob.title}
                    </h3>
                    <p className="text-zinc-500 font-bold text-sm mt-1">
                      {selectedJob.company} — {selectedJob.location}
                    </p>
                  </div>

                  {/* Job details summary */}
                  <div className="space-y-4 leading-relaxed">
                    <div>
                      <h4 className="text-zinc-900 font-bold font-serif text-sm mb-1 uppercase tracking-wider">{t('jobs.description', 'Job Description')}</h4>
                      <p className="text-zinc-650 leading-relaxed">{selectedJob.description}</p>
                    </div>

                    <div>
                      <h4 className="text-zinc-900 font-bold font-serif text-sm mb-1 uppercase tracking-wider">{t('jobs.requirements', 'Job Requirements')}</h4>
                      <ul className="list-disc list-inside text-zinc-600 space-y-1">
                        {selectedJob.requirements.map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-zinc-50 border p-3 rounded flex justify-between items-center font-mono">
                      <span>{t('jobs.offered_range', 'Offered Compensation Range:')}</span>
                      <strong className="text-offinso-green-800 text-sm">{selectedJob.salaryRange}</strong>
                    </div>
                  </div>

                  {/* Application Form panel */}
                  <div className="border-t-2 border-dashed pt-5 space-y-4">
                    <h4 className="font-serif font-bold text-base text-offinso-green-950 flex items-center gap-1">
                      <FileText className="w-4.5 h-4.5 text-offinso-gold" />
                      {t('jobs.candidate_apply_title', 'Apply for Local Opening')}
                    </h4>

                    <form onSubmit={handleApplySubmit} className="space-y-4" id="job-apply-form">
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="font-semibold text-zinc-700 block mb-1">{t('jobs.apply_fullName', 'Full Legal Name')}</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Kofi Mensah"
                            className="w-full bg-zinc-50 border border-zinc-300 rounded text-xs px-3 py-2 text-zinc-900 focus:outline-none focus:border-offinso-green-700"
                            value={applicantName}
                            onChange={(e) => setApplicantName(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-zinc-700 block mb-1">{t('jobs.contact_email', 'Email Address')}</label>
                          <input
                            type="email"
                            required
                            placeholder="e.g. kofi@offinso.com"
                            className="w-full bg-zinc-50 border border-zinc-300 rounded text-xs px-3 py-2 text-zinc-900 focus:outline-none focus:border-offinso-green-700"
                            value={applicantEmail}
                            onChange={(e) => setApplicantEmail(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-zinc-700 block mb-1">{t('jobs.apply_phone', 'Phone Number')}</label>
                          <input
                            type="tel"
                            required
                            placeholder="e.g. 0244-123-456"
                            className="w-full bg-zinc-50 border border-zinc-300 rounded text-xs px-3 py-2 text-zinc-900 focus:outline-none focus:border-offinso-green-700"
                            value={applicantPhone}
                            onChange={(e) => setApplicantPhone(e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-semibold text-zinc-700 block mb-1">{t('jobs.apply_experience', 'Relevant Experience')}</label>
                        <textarea
                          rows={3}
                          placeholder={t('jobs.apply_narrative_placeholder', 'Detail your background work...')}
                          className="w-full bg-zinc-50 border border-zinc-300 rounded text-xs px-3 py-2 text-zinc-900 focus:outline-none focus:border-offinso-green-700"
                          value={coverLetter}
                          onChange={(e) => setCoverLetter(e.target.value)}
                        />
                      </div>

                      {/* Resume File Upload Simulator */}
                      <div>
                        <label className="font-semibold text-zinc-705 block mb-1">{t('jobs.attach_resume', 'Attach Resume / CV')}</label>
                        <div className="border-2 border-dashed border-zinc-300 rounded-lg p-4 text-center hover:bg-zinc-50 transition relative">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileDropSimulator}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div className="space-y-1 text-zinc-500">
                             <UploadCloud className="w-8 h-8 text-zinc-400 mx-auto" />
                             <p className="text-xs font-semibold">
                              {simulatedResumeName ? (
                                <span className="text-emerald-700 font-mono">SELECTED: {simulatedResumeName}</span>
                              ) : (
                                <span>{t('jobs.drag_resume_placeholder', 'Click here or drag-and-drop your resume')}</span>
                              )}
                             </p>
                             <p className="text-[10px] text-zinc-400">{t('jobs.drag_resume_size', 'PDF, DOCX up to 4MB.')}</p>
                          </div>
                        </div>
                      </div>

                      {applyError && (
                        <div className="bg-red-50 text-red-700 text-xs p-2.5 rounded border border-red-200 mt-2 font-medium flex items-start gap-1.5 leading-snug">
                          <span>{applyError}</span>
                        </div>
                      )}

                      {/* Modal buttons */}
                      <div className="flex gap-2.5 pt-4 border-t justify-end">
                        <button
                          type="button"
                          onClick={() => setSelectedJob(null)}
                          className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold text-xs px-4 py-2 rounded cursor-pointer"
                        >
                          {t('global.cancel', 'Cancel')}
                        </button>
                        <button
                          type="submit"
                          className="bg-offinso-green-800 hover:bg-offinso-green-900 text-white font-bold text-xs px-6 py-2 rounded-md uppercase tracking-wider transition-all shadow-xs cursor-pointer"
                        >
                          {t('global.submit', 'Submit')}
                        </button>
                      </div>

                    </form>
                  </div>

                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
