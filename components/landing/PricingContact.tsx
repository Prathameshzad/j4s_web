'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from '@/component/ui/CustomUI';
import Link from 'next/link';

export default function PricingContact() {
  return (
    <section id="pricing" className="py-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-base font-semibold uppercase tracking-wider text-orange-500"
            >
              Pricing
            </motion.h2>
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-2 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl"
            >
              Tailored Solutions for Your Institute
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed"
            >
              We believe that every educational institution has unique needs. Instead of rigid plans, 
              we offer flexible pricing models that scale with your growth. 
              Get in touch with us to discuss a custom solution that perfectly fits your budget and requirements.
            </motion.p>
            
            <div className="mt-10 space-y-4">
              {[
                { icon: CheckIcon, text: "No hidden setup fees or maintenance charges" },
                { icon: CheckIcon, text: "Pay only for the features you actually use" },
                { icon: CheckIcon, text: "Special discounts for newly established institutes" },
                { icon: CheckIcon, text: "24/7 dedicated support for all our partners" }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3 text-slate-700 dark:text-slate-300"
                >
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <item.icon className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                  </div>
                  <span className="font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl shadow-orange-500/10 border border-slate-100 dark:border-slate-800"
          >
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Let's Talk!</h4>
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Email us at</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">contact@just4students.com</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Call us directly</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">+91 98765 43210</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  render={<Link href="#contact" />}
                  className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2"
                >
                  Request a Free Demo
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
              
              <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                Typically responds within 2 hours
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CheckIcon(props: any) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
