/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Tag, BadgePercent, MapPin, User, ShoppingBag, CheckCircle, Search, Phone, Mail, X, Sparkles, ShoppingCart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { User as UserType } from '../types';

interface DealsSectionProps {
  searchQuery: string;
  currentUser?: UserType | null;
}

export interface CommunityDeal {
  id: string;
  title: string;
  category: 'Daily Essentials' | 'Clothing & Accessories' | 'Electronics & Telecom' | 'Personal Care';
  originalPrice: number;
  discountPrice: number;
  image: string;
  description: string;
  sellerName: string;
  sellerContact: string;
  location: string;
  stock: number;
  condition: string;
}

export interface ClaimedDeal {
  id: string;
  dealId: string;
  dealTitle: string;
  dealImage: string;
  discountPrice: number;
  sellerName: string;
  sellerContact: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  claimedAt: string;
}

const DEALS_DATA: CommunityDeal[] = [
  {
    id: 'deal_1',
    title: 'MTN 10GB High-Speed Cheap Bundle',
    category: 'Electronics & Telecom',
    originalPrice: 85,
    discountPrice: 50,
    image: 'https://images.unsplash.com/photo-1562408590-e32931084e23?q=80&w=600&auto=format&fit=crop',
    description: 'High-speed, unthrottled 10GB MTN data bundle valid for 30 days. Fast digital provisioning straight to your registered phone number.',
    sellerName: 'K. Opoku Telecom Hub',
    sellerContact: '+233 24 555 1201',
    location: 'Main Station, Offinso',
    stock: 250,
    condition: 'Digital Delivery'
  },
  {
    id: 'deal_2',
    title: 'Organic Whipped Cocoa & Shea Pomade',
    category: 'Personal Care',
    originalPrice: 40,
    discountPrice: 25,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=600&auto=format&fit=crop',
    description: 'Deeply moisturizing organic whipped pomade made from rich Offinso shea butter and local cocoa extracts. Perfect protection for hair and skin.',
    sellerName: 'Asantewaa Natural Beauty',
    sellerContact: '+233 20 888 3402',
    location: 'New Town, Offinso',
    stock: 45,
    condition: 'Fresh Stock'
  },
  {
    id: 'deal_3',
    title: 'Fresh Aloe Vera Roll-on Deodorant',
    category: 'Personal Care',
    originalPrice: 35,
    discountPrice: 20,
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=600&auto=format&fit=crop',
    description: '24-hour long-lasting fresh Aloe Vera roll-on deodorant. Stay dry and confident through hot afternoons. Gentle and safe for all skin types.',
    sellerName: 'Offinso Cosmetics & Dry Goods',
    sellerContact: '+233 27 333 4567',
    location: 'Kokote Market, Offinso',
    stock: 30,
    condition: 'Sealed Bottle'
  },
  {
    id: 'deal_4',
    title: 'Fast Charger & Premium Braided Cable',
    category: 'Electronics & Telecom',
    originalPrice: 90,
    discountPrice: 55,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=600&auto=format&fit=crop',
    description: 'Universal multi-port fast wall charger with a premium 1.5-meter braided nylon charging cable. Completely reliable and safe for iOS and Android.',
    sellerName: 'Smart Accessories & Phone Repair',
    sellerContact: '+233 24 444 9876',
    location: 'Kokote Station, Offinso',
    stock: 40,
    condition: 'Brand New'
  },
  {
    id: 'deal_5',
    title: 'Hand-tailored Cotton Boubou Dress',
    category: 'Clothing & Accessories',
    originalPrice: 180,
    discountPrice: 110,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop',
    description: 'Beautifully designed and comfortable hand-tailored clothing made from 100% premium Ghanaian cotton print. Perfect for formal or casual wear.',
    sellerName: 'Sister Faustina Fashion Design',
    sellerContact: '+233 55 999 4433',
    location: 'Anyinasaso High Street',
    stock: 12,
    condition: 'New Hand-tailored'
  },
  {
    id: 'deal_6',
    title: 'Safe Cotton Sanitary Pads (Pack of 3)',
    category: 'Personal Care',
    originalPrice: 45,
    discountPrice: 25,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop',
    description: 'Ultra-thin, highly absorbent pure cotton sanitary pads for complete leak protection and extreme comfort. Fully biodegradable and hygienic.',
    sellerName: 'Haven Light Pharmacy',
    sellerContact: '+233 24 111 2233',
    location: 'Aboffour Market Station',
    stock: 65,
    condition: 'Medical Grade'
  },
  {
    id: 'deal_7',
    title: 'Laundry Powder Detergent Box (2kg)',
    category: 'Daily Essentials',
    originalPrice: 75,
    discountPrice: 45,
    image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?q=80&w=600&auto=format&fit=crop',
    description: 'High-performance laundry detergent powder. Dissolves tough stains easily, leaving clothes bright, smelling fresh, and feeling super soft.',
    sellerName: 'Mama G Grocery Store',
    sellerContact: '+233 20 777 5566',
    location: 'Kokote Market, Offinso',
    stock: 35,
    condition: 'Fresh Batch'
  },
  {
    id: 'deal_8',
    title: 'Traditional Herbal Alata Samina Black Soap',
    category: 'Personal Care',
    originalPrice: 30,
    discountPrice: 15,
    image: 'https://images.unsplash.com/photo-1607006342411-92434a070ac1?q=80&w=600&auto=format&fit=crop',
    description: '100% organic traditional Ghanaian black soap infused with native herbs, aloe vera, and shea oil. Great for tackling acne and skin rashes.',
    sellerName: 'Abena Mansa Organic Products',
    sellerContact: '+233 27 666 4411',
    location: 'Sabronum Road, Offinso',
    stock: 50,
    condition: 'Handmade'
  },
  {
    id: 'deal_9',
    title: 'Premium Chilled Bottled Water (Box of 24)',
    category: 'Daily Essentials',
    originalPrice: 35,
    discountPrice: 22,
    image: 'https://images.unsplash.com/photo-1608885898957-a599fb1698d6?q=80&w=600&auto=format&fit=crop',
    description: 'Box of 24 clean, filtered, highly refreshing 500ml mineral bottled water. Keeps you and your family cool and hydrated during the dry weather.',
    sellerName: 'Adom Water Distributing Depot',
    sellerContact: '+233 24 888 7755',
    location: 'New Town Main Gate, Offinso',
    stock: 80,
    condition: 'Ice Chilled'
  },
  {
    id: 'deal_10',
    title: 'MTN Cheap Night & Social Media Bundle',
    category: 'Electronics & Telecom',
    originalPrice: 30,
    discountPrice: 15,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop',
    description: 'Special social bundle for unlimited WhatsApp, Facebook, Instagram, and ultra-fast night downloads. Activated instantly over the phone.',
    sellerName: 'K. Opoku Telecom Hub',
    sellerContact: '+233 24 555 1201',
    location: 'Main Station, Offinso',
    stock: 120,
    condition: 'Digital Delivery'
  },
  {
    id: 'deal_11',
    title: 'Vitamin-E Enriched Baby Pomade',
    category: 'Personal Care',
    originalPrice: 45,
    discountPrice: 28,
    image: 'https://images.unsplash.com/photo-1614859324967-bdf461fec769?q=80&w=600&auto=format&fit=crop',
    description: 'Gentle moisturizing daily pomade enriched with natural Vitamin-E. Keeps babies\' skin incredibly smooth, preventing dry patches and diaper rashes.',
    sellerName: 'Asantewaa Natural Beauty',
    sellerContact: '+233 20 888 3402',
    location: 'New Town, Offinso',
    stock: 40,
    condition: 'Fresh Batch'
  },
  {
    id: 'deal_12',
    title: 'Wireless Bluetooth Earbuds (Model-X)',
    category: 'Electronics & Telecom',
    originalPrice: 150,
    discountPrice: 85,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop',
    description: 'Deep bass wireless bluetooth earbuds featuring noise cancellation, auto-pair, and a beautiful compact charging case. Long-lasting battery.',
    sellerName: 'Smart Accessories & Phone Repair',
    sellerContact: '+233 24 444 9876',
    location: 'Kokote Station, Offinso',
    stock: 15,
    condition: 'Sealed Box'
  },
  {
    id: 'deal_13',
    title: 'Handmade Traditional Kente Scarf (Muffler)',
    category: 'Clothing & Accessories',
    originalPrice: 120,
    discountPrice: 75,
    image: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?q=80&w=600&auto=format&fit=crop',
    description: 'Beautiful authentic Ashanti Kente mufflers, hand-woven in Anyinasaso. Vibrant colors to celebrate traditional local festivals.',
    sellerName: 'Agyeman Weaving Society',
    sellerContact: '+233 20 888 3402',
    location: 'Anyinasaso Weaving Center',
    stock: 10,
    condition: 'Handwoven'
  },
  {
    id: 'deal_14',
    title: 'Fresh Citrus Liquid Laundry Detergent (3L)',
    category: 'Daily Essentials',
    originalPrice: 80,
    discountPrice: 48,
    image: 'https://images.unsplash.com/photo-1610557892470-76d74022fa36?q=80&w=600&auto=format&fit=crop',
    description: 'Premium liquid soap detergent with active grease-cutting citrus action. Safe for delicate colored clothing and handwashing alike.',
    sellerName: 'Mama G Grocery Store',
    sellerContact: '+233 20 777 5566',
    location: 'Kokote Market, Offinso',
    stock: 18,
    condition: 'Premium Liquid'
  },
  {
    id: 'deal_15',
    title: 'Antibacterial Medicated Soap (Pack of 4)',
    category: 'Personal Care',
    originalPrice: 50,
    discountPrice: 30,
    image: 'https://images.unsplash.com/photo-1546554137-f86b9593a222?q=80&w=600&auto=format&fit=crop',
    description: 'Rich lathering medicated antiseptic soap formulated to clean dirt, wash germs, and leave you feeling completely fresh all day.',
    sellerName: 'Haven Light Pharmacy',
    sellerContact: '+233 24 111 2233',
    location: 'Aboffour Market Station',
    stock: 50,
    condition: 'Sealed Pack'
  }
];

export default function AuctionSection({ searchQuery, currentUser }: DealsSectionProps) {
  const { t } = useLanguage();

  // Local States
  const [deals, setDeals] = useState<CommunityDeal[]>(DEALS_DATA);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDeal, setSelectedDeal] = useState<CommunityDeal | null>(null);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'all-deals' | 'my-claims'>('all-deals');

  // Claim Form inputs
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');

  const [claimedDeals, setClaimedDeals] = useState<ClaimedDeal[]>(() => {
    const saved = localStorage.getItem('offinso_claimed_deals');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync profile details if authenticated
  React.useEffect(() => {
    if (currentUser) {
      setBuyerName(currentUser.fullName);
      setBuyerEmail(currentUser.email);
    }
  }, [currentUser]);

  // Categories list
  const categories = ['All', 'Daily Essentials', 'Clothing & Accessories', 'Electronics & Telecom', 'Personal Care'];

  // Filter deals
  const filteredDeals = deals.filter(deal => {
    const matchesCategory = selectedCategory === 'All' || deal.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenClaimModal = (deal: CommunityDeal) => {
    setSelectedDeal(deal);
    setIsClaimModalOpen(true);
    setClaimSuccess(false);
  };

  const handleCloseClaimModal = () => {
    setIsClaimModalOpen(false);
    setSelectedDeal(null);
  };

  const handleClaimDealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeal || !buyerName.trim() || !buyerPhone.trim()) return;

    const newClaim: ClaimedDeal = {
      id: `CLM-${Math.floor(Math.random() * 90000 + 10000)}`,
      dealId: selectedDeal.id,
      dealTitle: selectedDeal.title,
      dealImage: selectedDeal.image,
      discountPrice: selectedDeal.discountPrice,
      sellerName: selectedDeal.sellerName,
      sellerContact: selectedDeal.sellerContact,
      buyerName: buyerName.trim(),
      buyerEmail: buyerEmail.trim(),
      buyerPhone: buyerPhone.trim(),
      claimedAt: new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
      })
    };

    const updatedClaims = [newClaim, ...claimedDeals];
    setClaimedDeals(updatedClaims);
    localStorage.setItem('offinso_claimed_deals', JSON.stringify(updatedClaims));

    // Reduce stock by 1 locally
    const updatedDeals = deals.map(d => {
      if (d.id === selectedDeal.id && d.stock > 0) {
        return { ...d, stock: d.stock - 1 };
      }
      return d;
    });
    setDeals(updatedDeals);

    setClaimSuccess(true);
    setTimeout(() => {
      setClaimSuccess(false);
      setIsClaimModalOpen(false);
      setSelectedDeal(null);
      // Reset non-user fields
      setBuyerPhone('');
      setActiveTab('my-claims');
    }, 2200);
  };

  return (
    <div id="offinso-deals-portal" className="space-y-8 py-4 font-sans">
      
      {/* Header Info Block */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-zinc-200 pb-5 gap-4">
        <div>
          <span className="text-xs text-amber-600 font-bold uppercase tracking-widest font-mono flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" /> Direct Community Marketplace
          </span>
          <h2 className="font-serif text-3xl font-bold text-offinso-green-900 mt-1">Community Deals Page</h2>
          <p className="text-zinc-550 text-xs mt-1 leading-relaxed max-w-2xl">
            Discover 15 exclusive ongoing sales from local farmers and artisans in the Offinso municipality. Get top-tier food, clothing, crafts, and tools at cheap, heavily discounted rates direct from source.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-zinc-100 rounded-lg p-1 border">
          <button
            onClick={() => setActiveTab('all-deals')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'all-deals' ? 'bg-white text-offinso-green-900 shadow-2xs font-bold' : 'text-zinc-650 hover:text-zinc-900'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            Active Sales
          </button>
          <button
            onClick={() => setActiveTab('my-claims')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition relative cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'my-claims' ? 'bg-white text-offinso-green-900 shadow-2xs font-bold' : 'text-zinc-650 hover:text-zinc-900'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            My Claims
            {claimedDeals.length > 0 && (
              <span className="absolute -top-1 right-0 w-4.5 h-4.5 bg-amber-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {claimedDeals.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === 'all-deals' ? (
        <div className="space-y-6">
          
          {/* Categories Bar */}
          <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-2xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wider block">Deal Categories</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                        selectedCategory === cat 
                          ? 'bg-offinso-green-800 text-white hover:bg-offinso-green-900 shadow-sm font-bold' 
                          : 'bg-zinc-50 text-zinc-650 border border-zinc-200 hover:bg-zinc-100'
                      }`}
                    >
                      {cat === 'All' ? 'All Ongoing Sales' : cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-xs text-zinc-500 font-mono text-right bg-zinc-50 px-3 py-1.5 rounded border">
                <span className="font-bold text-offinso-green-900">{filteredDeals.length}</span> Discounted Boxes Found
              </div>
            </div>
          </div>

          {/* 15 Deals Grid */}
          {filteredDeals.length === 0 ? (
            <div className="text-center py-16 bg-white border rounded-xl shadow-2xs">
              <p className="text-zinc-400 italic text-sm">No ongoing community deals match your search queries.</p>
              <button 
                onClick={() => { setSelectedCategory('All'); }}
                className="mt-4 text-xs font-bold text-offinso-green-800 hover:underline"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDeals.map((deal) => {
                const discountPct = Math.round(((deal.originalPrice - deal.discountPrice) / deal.originalPrice) * 100);
                
                return (
                  <div 
                    key={deal.id}
                    className="bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:shadow-md transition duration-300 flex flex-col justify-between"
                  >
                    {/* Visual Card Top */}
                    <div className="relative h-48 w-full bg-zinc-100 overflow-hidden shrink-0">
                      <img 
                        src={deal.image} 
                        alt={deal.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      
                      {/* Discount ribbon */}
                      <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold font-mono px-2 py-1 rounded-md shadow-xs flex items-center gap-1 uppercase tracking-wider z-10">
                        <BadgePercent className="w-3.5 h-3.5" /> Save {discountPct}%
                      </span>

                      {/* Category Badge */}
                      <span className="absolute top-3 right-3 bg-zinc-950/80 backdrop-blur-xs text-zinc-100 text-[9px] font-semibold tracking-wider font-mono px-2.5 py-1 rounded-full border border-zinc-700/50 z-10">
                        {deal.category}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-mono font-bold uppercase tracking-widest">
                          <span>{deal.condition}</span>
                          <span>•</span>
                          <span className={deal.stock <= 3 ? 'text-rose-500 font-extrabold' : 'text-zinc-500'}>
                            {deal.stock === 1 ? 'Only 1 left' : `${deal.stock} in stock`}
                          </span>
                        </div>

                        <h3 className="font-serif font-bold text-zinc-900 text-base leading-snug">
                          {deal.title}
                        </h3>

                        <p className="text-zinc-650 text-xs leading-relaxed line-clamp-3">
                          {deal.description}
                        </p>
                      </div>

                      {/* Prices and Contact details */}
                      <div className="pt-4 border-t border-zinc-100 space-y-3">
                        <div className="flex items-baseline justify-between">
                          <span className="text-[10px] uppercase font-bold text-zinc-400 block font-mono">Special Price:</span>
                          <div className="flex items-baseline gap-2">
                            <span className="text-xs text-zinc-400 line-through font-mono">GH₵ {deal.originalPrice}</span>
                            <span className="text-lg font-extrabold text-amber-700 font-mono">GH₵ {deal.discountPrice}</span>
                          </div>
                        </div>

                        {/* Location and vendor details */}
                        <div className="bg-zinc-50 rounded-lg p-2.5 space-y-1.5 text-[11px] text-zinc-600">
                          <p className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            <span className="font-semibold text-zinc-700">{deal.sellerName}</span>
                          </p>
                          <p className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            <span>{deal.location}</span>
                          </p>
                        </div>

                        {/* Action CTA */}
                        <button
                          onClick={() => handleOpenClaimModal(deal)}
                          disabled={deal.stock === 0}
                          className={`w-full text-center font-bold text-xs py-2.5 rounded-lg transition-all tracking-wider uppercase flex items-center justify-center gap-1.5 cursor-pointer ${
                            deal.stock === 0 
                              ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed' 
                              : 'bg-offinso-green-800 hover:bg-offinso-green-950 text-white shadow-xs'
                          }`}
                        >
                          <Tag className="w-4 h-4 text-offinso-gold" />
                          {deal.stock === 0 ? 'Out of Stock' : 'Claim Deal & Contact Seller'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      ) : (
        /* My Claims Tab */
        <div className="space-y-6">
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-2xs">
            <h4 className="font-serif font-bold text-sm text-[#003730] uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-amber-500 rounded-full inline-block"></span>
              Your Claimed Community Discounts
            </h4>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              Below are the local discounts and cheap item sales you have reserved under your session. Please call or meet the vendor at their specified marketplace location to finalize payment and item collection. No commissions are owed to the secretariat.
            </p>
          </div>

          {claimedDeals.length === 0 ? (
            <div className="text-center py-16 bg-white border rounded-xl shadow-2xs space-y-4">
              <div className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center mx-auto text-zinc-400 border border-dashed border-zinc-300">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <p className="text-zinc-500 font-semibold text-sm">No claimed deals yet</p>
                <p className="text-zinc-400 text-xs mt-1">Browse active sales in the other tab to reserve discounted products.</p>
              </div>
              <button
                onClick={() => setActiveTab('all-deals')}
                className="bg-offinso-green-800 hover:bg-offinso-green-900 text-white font-bold text-xs px-4 py-2 rounded-lg transition cursor-pointer"
              >
                Go to Active Sales
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {claimedDeals.map((claim) => (
                <div 
                  key={claim.id}
                  className="bg-white border border-zinc-250 rounded-xl p-5 shadow-2xs hover:border-amber-400 transition-all flex flex-col md:flex-row gap-5 justify-between"
                >
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <img 
                      src={claim.dealImage} 
                      alt={claim.dealTitle} 
                      className="w-16 h-16 rounded-lg object-cover bg-zinc-50 border shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-amber-100 text-amber-800 text-[9px] font-bold font-mono px-2 py-0.5 rounded uppercase tracking-wider">
                          Claimed: {claim.id}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {claim.claimedAt}
                        </span>
                      </div>
                      <h5 className="font-bold text-zinc-900 text-sm">{claim.dealTitle}</h5>
                      <p className="text-xs text-zinc-500">
                        Reserved for: <span className="font-bold text-zinc-700">{claim.buyerName}</span> ({claim.buyerPhone})
                      </p>
                    </div>
                  </div>

                  <div className="border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 shrink-0 flex flex-col justify-center space-y-2 text-xs">
                    <div className="flex justify-between md:justify-end gap-4 items-baseline">
                      <span className="text-[10px] uppercase font-bold text-zinc-400 font-mono">Deal Price:</span>
                      <span className="text-lg font-black text-amber-700 font-mono">GH₵ {claim.discountPrice}</span>
                    </div>

                    <div className="bg-zinc-50 rounded p-2.5 space-y-1 border text-[11px] text-zinc-650">
                      <p className="font-semibold text-zinc-800">Coordinate Pick Up:</p>
                      <p className="flex items-center gap-1">
                        <User className="w-3 h-3 text-zinc-400 shrink-0" />
                        <span>Vendor: {claim.sellerName}</span>
                      </p>
                      <p className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-zinc-400 shrink-0" />
                        <span className="font-bold text-offinso-green-905">{claim.sellerContact}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Claim Reservation Modal */}
      <AnimatePresence>
        {isClaimModalOpen && selectedDeal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-zinc-200 rounded-xl max-w-md w-full overflow-hidden shadow-2xl relative"
            >
              {/* Header */}
              <div className="bg-[#003730] text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-offinso-gold" />
                  <h4 className="font-serif font-bold text-base">Claim Community Deal</h4>
                </div>
                <button
                  onClick={handleCloseClaimModal}
                  className="text-zinc-300 hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                {claimSuccess ? (
                  <div className="py-8 text-center space-y-4">
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <h5 className="font-serif font-bold text-xl text-zinc-900">Discount Code Claimed!</h5>
                    <p className="text-xs text-zinc-500 leading-relaxed max-w-xs mx-auto">
                      Your claim for <span className="font-bold text-zinc-805">"{selectedDeal.title}"</span> has been registered. Our system logged this deal under your session dashboard.
                    </p>
                    <p className="text-xs text-amber-700 font-semibold bg-amber-50 p-2 rounded-md border border-amber-100">
                      Contact Vendor at {selectedDeal.sellerContact} to claim and pick up your cheap item!
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleClaimDealSubmit} className="space-y-4 text-xs">
                    {/* Brief item review */}
                    <div className="bg-zinc-50 border rounded-lg p-3 flex gap-3 items-center">
                      <img 
                        src={selectedDeal.image} 
                        alt={selectedDeal.title} 
                        className="w-12 h-12 rounded object-cover bg-zinc-200 shrink-0 border"
                      />
                      <div>
                        <span className="text-[8.5px] font-bold font-mono uppercase text-amber-700">Special Local Offer</span>
                        <h5 className="font-bold text-zinc-900 text-xs leading-snug line-clamp-1">{selectedDeal.title}</h5>
                        <p className="text-[11px] font-mono font-bold text-amber-700 mt-0.5">
                          Discounted Price: <span className="text-xs text-zinc-400 line-through">GH₵ {selectedDeal.originalPrice}</span> → <span className="text-sm font-black">GH₵ {selectedDeal.discountPrice}</span>
                        </p>
                      </div>
                    </div>

                    <p className="text-[11px] text-zinc-500 leading-normal">
                      Fill out your contact details below. We will reserve the discount box for you and notify the local seller so you can arrange secure cash-and-carry handoff inside Offinso.
                    </p>

                    {/* Inputs */}
                    <div className="space-y-3">
                      <div>
                        <label className="font-semibold text-zinc-700 block mb-1">Your Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Thomas Macdonalds"
                          className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-3 py-2 text-zinc-950 focus:outline-none focus:border-offinso-green-700 text-xs"
                          value={buyerName}
                          onChange={(e) => setBuyerName(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="font-semibold text-zinc-700 block mb-1">Email Address</label>
                          <input
                            type="email"
                            required
                            placeholder="e.g. thomas@example.com"
                            className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-3 py-2 text-zinc-950 focus:outline-none focus:border-offinso-green-700 text-xs"
                            value={buyerEmail}
                            onChange={(e) => setBuyerEmail(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-zinc-700 block mb-1">Phone Number</label>
                          <input
                            type="tel"
                            required
                            placeholder="e.g. +233 24 123 4567"
                            className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-3 py-2 text-zinc-955 focus:outline-none focus:border-offinso-green-700 text-xs"
                            value={buyerPhone}
                            onChange={(e) => setBuyerPhone(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Notice */}
                    <div className="text-[10px] text-zinc-400 border-t pt-3 flex gap-1.5 items-start">
                      <span className="shrink-0 text-amber-500 font-bold">ℹ</span>
                      <span>No pre-payments or online fees required. All trades are completed via physical pick-up and cash in-hand at the vendor's local market location inside Offinso, Ashanti region.</span>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      className="w-full bg-offinso-green-800 hover:bg-offinso-green-950 text-white font-bold py-2.5 rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4 text-offinso-gold" /> Confirm Discount Reservation
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
