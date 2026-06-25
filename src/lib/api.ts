import { supabase, isSupabaseConfigured } from './supabase';
import { JobPost, JobApplication, BidItem, ReliefApplication, Bid } from '../types';
import { INITIAL_JOBS } from '../data';

const MOCK_AUCTION_ITEMS: BidItem[] = [
  {
    id: 'auc_1',
    title: 'Handcrafted Kente Royal Stool',
    description: 'A beautiful ceremonial stool carved from sustainable cedar wood, adorned with gold leaf patterns and traditional Adinkra symbols representing wisdom and leadership. Hand-finished by local Offinso woodcarvers.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&auto=format&fit=crop',
    startingBid: 300,
    currentBid: 450,
    bidCount: 4,
    endsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Crafts & Art',
    bids: [
      { id: 'b1', bidderName: 'Kwame Mensah', amount: 450, time: new Date().toISOString() },
      { id: 'b2', bidderName: 'Ama Serwaa', amount: 400, time: new Date(Date.now() - 3600000).toISOString() },
      { id: 'b3', bidderName: 'Kofi Owusu', amount: 350, time: new Date(Date.now() - 7200000).toISOString() },
    ],
    isClosed: false
  },
  {
    id: 'auc_2',
    title: 'Pre-Loved Sewing Machine (Butterfly Brand)',
    description: 'Butterfly brand manual/treadle sewing machine in excellent functional condition. Ideal for tailoring apprentices or local workshop startups. Comes with oiling kit and spare needles.',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop',
    startingBid: 400,
    currentBid: 600,
    bidCount: 3,
    endsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Equipment',
    bids: [
      { id: 'b4', bidderName: 'Abena Osei', amount: 600, time: new Date().toISOString() },
      { id: 'b5', bidderName: 'Yao Boateng', amount: 550, time: new Date(Date.now() - 1800000).toISOString() },
    ],
    isClosed: false
  },
  {
    id: 'auc_3',
    title: 'Vintage Brass Cocoa Scale Set',
    description: 'A genuine collector\'s set of brass weights and balance scale historically used to measure dried cocoa beans at local Offinso cooperative trade centers. Perfectly preserved polished metal.',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=600&auto=format&fit=crop',
    startingBid: 150,
    currentBid: 250,
    bidCount: 2,
    endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Collectibles',
    bids: [
      { id: 'b6', bidderName: 'Adwoa Darko', amount: 250, time: new Date().toISOString() },
    ],
    isClosed: false
  }
];


export async function fetchJobs(): Promise<JobPost[]> {
  const { data, error } = await supabase
    .from('job_posts')
    .select('*')
    .order('posted_at', { ascending: false });

  if (error) {
    console.error('Error fetching jobs:', error);
    return INITIAL_JOBS;
  }

  const dbJobs: JobPost[] = (data || []).map(row => ({
    id: row.id,
    title: row.title,
    company: row.company,
    location: row.location,
    type: row.type as any,
    category: row.category,
    description: row.description,
    salaryRange: row.salary_range || '',
    requirements: row.requirements || [],
    postedAt: row.posted_at || '',
    isCustom: row.is_custom ?? false,
    isGig: row.is_gig ?? false
  }));

  const allJobsMap = new Map<string, JobPost>();
  INITIAL_JOBS.forEach(j => allJobsMap.set(j.id, j));
  dbJobs.forEach(j => allJobsMap.set(j.id, j));

  return Array.from(allJobsMap.values()).sort((a, b) => b.postedAt.localeCompare(a.postedAt));
}

export async function createJob(job: Partial<JobPost>): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id || null;

  const { error } = await supabase
    .from('job_posts')
    .insert({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      category: job.category,
      description: job.description,
      salary_range: job.salaryRange,
      requirements: job.requirements,
      posted_at: job.postedAt,
      is_custom: true,
      is_gig: job.isGig ?? false,
      posted_by: userId
    });

  if (error) {
    throw error;
  }
}

export async function fetchJobApplications(): Promise<JobApplication[]> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return [];

  const { data, error } = await supabase
    .from('job_applications')
    .select('*')
    .eq('user_id', session.user.id);

  if (error) {
    console.error('Error fetching job applications:', error);
    return [];
  }

  return (data || []).map(row => ({
    id: row.id,
    jobId: row.job_id,
    jobTitle: row.job_title || '',
    applicantName: row.applicant_name,
    applicantEmail: row.applicant_email,
    applicantPhone: row.applicant_phone || '',
    coverLetter: row.cover_letter || '',
    submittedAt: row.submitted_at
  }));
}

export async function applyForJob(application: JobApplication): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id || null;

  const { error } = await supabase
    .from('job_applications')
    .insert({
      id: application.id,
      job_id: application.jobId,
      job_title: application.jobTitle,
      applicant_name: application.applicantName,
      applicant_email: application.applicantEmail,
      applicant_phone: application.applicantPhone,
      cover_letter: application.coverLetter,
      submitted_at: application.submittedAt,
      user_id: userId
    });

  if (error) {
    throw error;
  }
}

export async function fetchAuctionItems(): Promise<BidItem[]> {
  if (!isSupabaseConfigured) {
    return MOCK_AUCTION_ITEMS;
  }

  const { data: itemsData, error: itemsError } = await supabase
    .from('auction_items')
    .select('*')
    .order('ends_at', { ascending: true });

  if (itemsError) {
    console.error('Error fetching auction items:', itemsError);
    return MOCK_AUCTION_ITEMS;
  }

  if (!itemsData || itemsData.length === 0) {
    return MOCK_AUCTION_ITEMS;
  }

  const { data: bidsData, error: bidsError } = await supabase
    .from('bids')
    .select('*')
    .order('time', { ascending: false });

  if (bidsError) {
    console.error('Error fetching bids:', bidsError);
  }

  const bidsByItem = new Map<string, Bid[]>();
  if (bidsData) {
    bidsData.forEach(row => {
      const bid: Bid = {
        id: row.id,
        bidderName: row.bidder_name || 'Anonymous',
        amount: Number(row.amount),
        time: row.time
      };
      if (!bidsByItem.has(row.item_id)) {
        bidsByItem.set(row.item_id, []);
      }
      bidsByItem.get(row.item_id)!.push(bid);
    });
  }

  return (itemsData || []).map(row => ({
    id: row.id,
    title: row.title,
    description: row.description || '',
    image: row.image || '',
    startingBid: Number(row.starting_bid) || 0,
    currentBid: Number(row.current_bid) || 0,
    bidCount: Number(row.bid_count) || 0,
    endsAt: row.ends_at || '',
    category: row.category || '',
    bids: bidsByItem.get(row.id) || [],
    isClosed: row.is_closed ?? false
  }));
}

export async function placeBid(itemId: string, bidderName: string, amount: number): Promise<void> {
  if (!isSupabaseConfigured) {
    const item = MOCK_AUCTION_ITEMS.find(i => i.id === itemId);
    if (item) {
      const newBid: Bid = {
        id: `BID-${Math.floor(Math.random() * 90000 + 10000)}`,
        bidderName,
        amount,
        time: new Date().toISOString()
      };
      item.currentBid = amount;
      item.bidCount += 1;
      item.bids = [newBid, ...item.bids];
    }
    return;
  }

  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id || null;

  const bidId = `BID-${Math.floor(Math.random() * 90000 + 10000)}`;

  const { error: bidError } = await supabase
    .from('bids')
    .insert({
      id: bidId,
      item_id: itemId,
      bidder_name: bidderName,
      amount: amount,
      user_id: userId,
      time: new Date().toISOString()
    });

  if (bidError) throw bidError;

  const { error: itemError } = await supabase
    .from('auction_items')
    .update({
      current_bid: amount
    })
    .eq('id', itemId);

  if (itemError) throw itemError;

  const { error: rpcError } = await supabase.rpc('increment_bid_count', { item_id: itemId });
  if (rpcError) {
    console.error('RPC increment_bid_count failed, updating count manually:', rpcError);
    // Manual fallback increment is not strictly possible since supabase update doesn't support relative increments directly, 
    // but the RPC function handles this.
  }
}

export async function fetchReliefApplications(): Promise<ReliefApplication[]> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return [];

  const { data, error } = await supabase
    .from('relief_applications')
    .select('*')
    .eq('user_id', session.user.id);

  if (error) {
    console.error('Error fetching relief applications:', error);
    return [];
  }

  return (data || []).map(row => ({
    id: row.id,
    programId: row.program_id,
    programName: row.program_name,
    applicantName: row.applicant_name,
    email: row.email || '',
    phone: row.phone || '',
    address: row.address || '',
    incomeTier: row.income_tier || '',
    descriptionOfNeed: row.description_of_need || '',
    submittedAt: row.submitted_at,
    status: row.status as any,
    referenceNumber: row.reference_number || ''
  }));
}

export async function submitReliefApplication(application: ReliefApplication): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id || null;

  const { error } = await supabase
    .from('relief_applications')
    .insert({
      id: application.id,
      program_id: application.programId,
      program_name: application.programName,
      applicant_name: application.applicantName,
      email: application.email,
      phone: application.phone,
      address: application.address,
      income_tier: application.incomeTier,
      description_of_need: application.descriptionOfNeed,
      submitted_at: application.submittedAt,
      status: application.status,
      reference_number: application.referenceNumber,
      user_id: userId
    });

  if (error) {
    throw error;
  }
}

export function subscribeToAuctionBids(callback: (newBid: any) => void) {
  return supabase
    .channel('public:bids')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'bids' },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();
}
