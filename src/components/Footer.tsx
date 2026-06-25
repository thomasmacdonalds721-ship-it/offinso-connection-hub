/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useLanguage } from '../contexts/LanguageContext';
import { ExternalLink, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-zinc-900 text-zinc-300 border-t-8 border-offinso-green-900 pt-12 pb-8" id="offinso-portal-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Department Info & Emblem */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-6 bg-offinso-gold rounded-full"></span>
            <span className="font-serif font-bold text-lg text-white">{t('header.seal_text', 'OFFINSO PRIVATE HUB')}</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            {t('footer.para', 'Offinso Resident Private Connection Hub. Connecting citizens with digital agricultural Auctions, Jobs, specialized Literacy campaigns, relief lists, and eco-travel advisory planning.')}
          </p>

        </div>

        {/* Column 2: Private Hub Services & Guides */}
        <div>
          <h3 className="font-serif font-semibold text-sm text-white uppercase tracking-wider mb-4 pb-2 border-b border-zinc-800">
            {t('footer.header_services', 'Private Hub Services')}
          </h3>
          <ul className="text-xs space-y-2.5 font-medium">
            <li>
              <a href="#about" className="hover:text-offinso-gold transition flex items-center gap-1.5">
                {t('footer.about', 'About Our Private Hub')} <ExternalLink className="w-3 h-3 text-zinc-500" />
              </a>
            </li>
            <li>
              <a href="#traditional" className="hover:text-offinso-gold transition flex items-center gap-1.5">
                {t('footer.traditional', 'Offinso Traditional Council & Chiefs')}
              </a>
            </li>
            <li>
              <a href="#news" className="hover:text-offinso-gold transition flex items-center gap-1.5">
                {t('footer.bulletins', 'Local Hub Bulletins')}
              </a>
            </li>
            <li>
              <a href="#tenders" className="hover:text-offinso-gold transition flex items-center gap-1.5">
                {t('footer.tenders', 'Community Harvest Tenders')}
              </a>
            </li>
            <li>
              <a href="#alerts" className="hover:text-offinso-gold transition text-amber-400 flex items-center gap-1.5 font-semibold">
                {t('footer.advisories', 'Offin River Safe Commutes')}
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Resident Resources */}
        <div>
          <h3 className="font-serif font-semibold text-sm text-white uppercase tracking-wider mb-4 pb-2 border-b border-zinc-800">
            {t('footer.header_resources', 'Citizen Resources')}
          </h3>
          <ul className="text-xs space-y-2.5">
            <li>
              <a href="#cocoa-input" className="hover:text-offinso-gold transition flex items-center gap-1.5">
                {t('footer.cocoa_sub', 'Cocoa Farmer Input Subsidy Portal')}
              </a>
            </li>
            <li>
              <a href="#shea-coop" className="hover:text-offinso-gold transition flex items-center gap-1.5">
                {t('footer.shea_coop', 'Women Shea Cooperative Standards')}
              </a>
            </li>
            <li>
              <a href="#labor-rules" className="hover:text-offinso-gold transition flex items-center gap-1.5">
                {t('footer.labor_rules', 'Ghana Labor Commission Standard Rules')}
              </a>
            </li>
            <li>
              <a href="#kente-crafts" className="hover:text-[#efbf12] transition flex items-center gap-1.5">
                {t('footer.kente_crafts', 'Ashanti Traditional Crafts Guild')}
              </a>
            </li>
            <li>
              <a href="#livestock-farming" className="hover:text-offinso-gold transition flex items-center gap-1.5">
                {t('footer.livestock_farming', 'Smallholder Poultry & Layer Guides')}
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Under-Footer Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-12 pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <p>{t('footer.copyright', '© 2026 OFFINSO PRIVATE CONNECTION HUB. All Rights Reserved.')}</p>
          <span className="hidden md:inline">|</span>
          <a href="#privacy" className="hover:text-zinc-400 transition">{t('footer.privacy', 'Privacy Policy')}</a>
          <span className="hidden md:inline">•</span>
          <a href="#terms" className="hover:text-zinc-400 transition">{t('footer.terms', 'Terms of Service')}</a>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10.5px] bg-zinc-800/50 px-3 py-1 rounded text-zinc-400 border border-zinc-800">
          <ShieldCheck className="w-3.5 h-3.5 text-offinso-gold" />
          <span>{t('footer.authorization_seal', 'Licensed Resident Verification')}</span>
        </div>
      </div>
    </footer>
  );
}
