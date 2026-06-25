/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Bid {
  id: string;
  bidderName: string;
  amount: number;
  time: string;
}

export interface BidItem {
  id: string;
  title: string;
  description: string;
  image: string;
  startingBid: number;
  currentBid: number;
  bidCount: number;
  endsAt: string; // ISO string or relative description
  category: string;
  bids: Bid[];
  isClosed?: boolean;
}

export interface JobPost {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Seasonal' | 'Contract';
  category: string;
  description: string;
  salaryRange: string;
  requirements: string[];
  postedAt: string;
  isCustom?: boolean;
  isGig?: boolean;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  coverLetter: string;
  submittedAt: string;
}

export interface ReliefProgram {
  id: string;
  name: string;
  description: string;
  reliefAmount: string;
  eligibility: string;
}

export interface ReliefApplication {
  id: string;
  programId: string;
  programName: string;
  applicantName: string;
  email: string;
  phone: string;
  address: string;
  incomeTier: string;
  descriptionOfNeed: string;
  submittedAt: string;
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Declined';
  referenceNumber: string;
}

export interface TravelPackage {
  id: string;
  title: string;
  duration: string;
  price: number;
  rating: number;
  description: string;
  image: string;
  inclusions: string[];
  tags: string[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  address?: string;
  registeredAt: string;
}

export type ActivePage = 'home' | 'auction' | 'events' | 'health-safety' | 'jobs' | 'charity' | 'travel' | 'literacy' | 'charity-agric' | 'charity-social' | 'profile';
