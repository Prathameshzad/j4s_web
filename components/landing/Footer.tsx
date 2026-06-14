'use client';

import Link from 'next/link';
import { Mail, Phone, Globe, Share2, MessageSquare, Info } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-slate-950 pt-24 pb-12 text-slate-400 overflow-hidden z-10">

      {/* HUGE background typography text (inspired by AntiGravity) */}
      <div className="absolute bottom-[-5%] left-1/2 -translate-x-1/2 w-[120%] select-none pointer-events-none z-0 text-center overflow-hidden">
        <span className="text-[14vw] font-black uppercase tracking-widest text-slate-900/40 dark:text-slate-900/60 leading-none block select-none">
          SHIKSHA DISHA
        </span>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 pb-16 border-b border-slate-900">

          {/* Brand Info */}
          <div className="col-span-1 lg:col-span-1 flex flex-col justify-between">
            <div>
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center">
                  <img src="/justlogo.png" alt="Shiksha Disha Icon" className="h-full w-full object-contain" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white font-sans">
                  Shiksha Disha
                </span>
              </Link>
              <p className="mt-6 text-sm leading-relaxed max-w-xs text-slate-400">
                India's smartest and most affordable institute management ecosystem. Empowering education through technology.
              </p>
            </div>

            {/* Social handles */}
            <div className="mt-8 flex gap-4 text-slate-500">
              <Link href="#" className="hover:text-orange-500 transition-colors"><Globe className="h-4.5 w-4.5" /></Link>
              <Link href="#" className="hover:text-orange-500 transition-colors"><Share2 className="h-4.5 w-4.5" /></Link>
              <Link href="#" className="hover:text-orange-500 transition-colors"><MessageSquare className="h-4.5 w-4.5" /></Link>
              <Link href="#" className="hover:text-orange-500 transition-colors"><Info className="h-4.5 w-4.5" /></Link>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Product</h4>
            <ul className="mt-6 space-y-3.5 text-sm">
              {['Features', 'Pricing', 'Mobile App', 'Updates'].map((item) => (
                <li key={item}>
                  <Link
                    href={item === 'Features' || item === 'Pricing' ? `#${item.toLowerCase()}` : '#'}
                    className="hover:text-orange-400 hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Support</h4>
            <ul className="mt-6 space-y-3.5 text-sm">
              {['Documentation', 'Help Center', 'API Status', 'Contact Us'].map((item) => (
                <li key={item}>
                  <Link
                    href={item === 'Contact Us' ? '#contact' : '#'}
                    className="hover:text-orange-400 hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Contact</h4>
            <ul className="mt-6 space-y-3.5 text-sm text-slate-400">
              <li className="flex items-center gap-3">
                <Mail className="h-4.5 w-4.5 text-orange-500 flex-shrink-0" />
                <span className="hover:text-white transition-colors cursor-pointer">support@shikshadisha.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4.5 w-4.5 text-orange-500 flex-shrink-0" />
                <span className="hover:text-white transition-colors cursor-pointer">+91 98765 43210</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] text-slate-500 font-semibold tracking-wider uppercase">
          <p>
            &copy; {new Date().getFullYear()} Shiksha Disha. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/term-and-condition" className="hover:text-white transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
