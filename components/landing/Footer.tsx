'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Globe, Share2, MessageSquare, Info } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 pt-20 pb-10 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          <div className="col-span-1 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center">
                <img src="/justlogo.png" alt="Icon" className="h-full w-full object-contain" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Shiksha Disha
              </span>
            </Link>
            <p className="mt-6 text-sm leading-relaxed">
              India's most affordable and smartest institute management application.
              Empowering education through technology.
            </p>
            <div className="mt-8 flex gap-4">
              <Link href="#" className="hover:text-orange-500 transition-colors"><Globe className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-orange-500 transition-colors"><Share2 className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-orange-500 transition-colors"><MessageSquare className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-orange-500 transition-colors"><Info className="h-5 w-5" /></Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Product</h4>
            <ul className="mt-6 space-y-4 text-sm">
              <li><Link href="#features" className="hover:text-orange-500 transition-colors">Features</Link></li>
              <li><Link href="#pricing" className="hover:text-orange-500 transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Mobile App</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Updates</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Support</h4>
            <ul className="mt-6 space-y-4 text-sm">
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition-colors">API Status</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Contact</h4>
            <ul className="mt-6 space-y-4 text-sm">
              <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-orange-500" /> info@shikshadisha.in</li>
              <li className="flex items-center gap-3"><Phone className="h-4 w-4 text-orange-500" /> +91 98765 43210</li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-orange-500 mt-0.5" />
                123 Tech Park, Hitech City, <br />Hyderabad, India
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 border-t border-slate-800 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs">
            &copy; {new Date().getFullYear()} Shiksha Disha. All rights reserved.
          </p>
          <div className="flex gap-8 text-xs">
            <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/term-and-condition" className="hover:text-white">Terms & Conditions</Link>
            <Link href="#" className="hover:text-white">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
