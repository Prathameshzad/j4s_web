'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, ArrowRight, ShieldCheck, DollarSign, Activity, Headphones, Sparkles } from 'lucide-react';
import { Button } from '@/component/ui/CustomUI';
import Link from 'next/link';

export default function PricingContact() {
  return (
    <section id="pricing" className="py-28 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Background neon light reflection */}
      <div className="absolute top-[30%] right-[-10%] -z-10 h-[450px] w-[450px] rounded-full bg-orange-500/10 blur-3xl" />
      <div className="absolute bottom-[10%] left-[-10%] -z-10 h-[400px] w-[400px] rounded-full bg-amber-500/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-orange-500 dark:border-orange-500/10 dark:bg-orange-950/20"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Pricing Architecture</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl"
          >
            Flexible & Scalable Plans <br />
            <span className="font-caveat text-5xl sm:text-7xl text-orange-500">Without Hidden Surprise Fees</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg text-slate-600 dark:text-slate-400"
          >
            Education needs are unique. We avoid rigid tables and offer custom structures
            tailored strictly to your institute size.
          </motion.p>
        </div>

        {/* Custom Pricing Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Card 1: Features value panel */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 rounded-[2.5rem] border border-slate-200/60 bg-white/60 p-8 backdrop-blur-md shadow-sm dark:border-slate-800/40 dark:bg-slate-900/60 lg:p-12 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Our Pricing Commitments
              </h3>
              <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-xl">
                We believe top-tier management portals should not break your budget. Our models ensure
                you scale without facing heavy monthly subscriptions.
              </p>

              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  {
                    icon: DollarSign,
                    title: "Affordable Pricing",
                    text: "The most economical enterprise-grade educational suite in India."
                  },
                  {
                    icon: ShieldCheck,
                    title: "No Hidden Charges",
                    text: "Absolutely zero onboarding, setup, or annual maintenance surprise fees."
                  },
                  {
                    icon: Activity,
                    title: "Scalable Model",
                    text: "Pay dynamically based on the features you adopt and active student count."
                  },
                  {
                    icon: Headphones,
                    title: "24/7 Dedicated Support",
                    text: "Full priority chat and call assistance for admins and teaching staff."
                  }
                ].map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-orange-100 dark:bg-orange-950/40 text-orange-500 dark:text-orange-400 flex items-center justify-center">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h4>
                      <p className="mt-1 text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 p-5 rounded-2xl bg-orange-50/60 dark:bg-orange-950/15 border border-orange-100/60 dark:border-orange-900/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-xs font-semibold text-orange-700 dark:text-orange-400 leading-normal max-w-md">
                Starting a new coaching center or high school? Contact us directly to claim your
                exclusive newly-established institute discount.
              </p>
              <Link href="#contact" className="text-xs font-black uppercase tracking-widest text-orange-500 flex items-center gap-1 hover:text-orange-600 transition-colors">
                Claim Offer <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>

          {/* Card 2: Interactive CTA contact box with orange glowing gradient border */}
          <motion.div
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative group rounded-[2.5rem] p-0.5 bg-gradient-to-br from-orange-500 to-amber-400 shadow-2xl shadow-orange-500/10"
          >
            <div className="h-full w-full rounded-[2.4rem] bg-white dark:bg-slate-900 p-8 lg:p-12 flex flex-col justify-between">

              <div>
                <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
                  Let's Discuss!
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                  Request a quick features walk-through demo or ask for a customized pricing proposal.
                </p>

                <div className="mt-8 space-y-4">
                  {/* Mail block */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-850 hover:bg-orange-50/50 dark:hover:bg-orange-950/10 transition-colors flex items-center gap-4 cursor-pointer"
                  >
                    <div className="h-10 w-10 rounded-xl bg-orange-100 text-orange-500 dark:bg-orange-950/40 dark:text-orange-400 flex items-center justify-center">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Write to us</p>
                      <p className="text-sm font-extrabold text-slate-950 dark:text-white">support@shikshadisha.com</p>
                    </div>
                  </motion.div>

                  {/* Phone block */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-850 hover:bg-orange-50/50 dark:hover:bg-orange-950/10 transition-colors flex items-center gap-4 cursor-pointer"
                  >
                    <div className="h-10 w-10 rounded-xl bg-orange-100 text-orange-500 dark:bg-orange-950/40 dark:text-orange-400 flex items-center justify-center">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Call sales team</p>
                      <p className="text-sm font-extrabold text-slate-950 dark:text-white">+91 7 8989-1-4040</p>
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="mt-10 space-y-4">
                <Button
                  render={<Link href="#contact" />}
                  className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
                >
                  Request a Free Demo
                  <ArrowRight className="w-4 h-4" />
                </Button>

                <p className="text-center text-[10px] font-semibold text-slate-450 uppercase tracking-widest block">
                  Typically responds in under 2 hours
                </p>
              </div>

            </div>

            {/* Glowing border overlay */}
            <div className="absolute -inset-0.5 rounded-[2.5rem] bg-gradient-to-r from-orange-500 to-amber-500 opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-300 pointer-events-none -z-10" />
          </motion.div>
        </div>

      </div>
    </section>
  );
}
