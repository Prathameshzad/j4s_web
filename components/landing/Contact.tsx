'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Sparkles } from 'lucide-react';
import { Button } from '@/component/ui/CustomUI';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Message sent successfully! We will get back to you soon.');
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <section id="contact" className="py-28 bg-white dark:bg-slate-900 overflow-hidden relative">
      {/* Background glow highlights */}
      <div className="absolute top-[20%] left-[-10%] -z-10 h-[500px] w-[500px] rounded-full bg-orange-500/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Split Layout Container */}
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 items-center">

          {/* Info Side (5 Columns) */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-orange-500 dark:border-orange-500/10 dark:bg-orange-950/20"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Get In Touch</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl"
            >
              Let's Scale Your <br />
              <span className="font-caveat text-5xl sm:text-7xl text-orange-500">School Together</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed"
            >
              Have questions about pricing, features, onboarding, or want to schedule a custom demo?
              Our team is ready to assist you.
            </motion.p>

            <div className="mt-12 space-y-8">
              {[
                {
                  icon: Mail,
                  title: "Email Us",
                  detail: "info@shikshadisha.in",
                  bg: "bg-orange-50 dark:bg-orange-950/30"
                },
                {
                  icon: Phone,
                  title: "Call Us",
                  detail: "+91  7 8989 1 4040",
                  bg: "bg-orange-50 dark:bg-orange-950/30"
                },
                {
                  icon: MapPin,
                  title: "Visit Us",
                  detail: "547 Guruwar Peth Near Gauri Ali, Pune, Maharashtra, India",
                  bg: "bg-orange-50 dark:bg-orange-950/30"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-5 group"
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.bg} text-orange-500 group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{item.title}</h4>
                    <p className="text-base font-extrabold text-slate-900 dark:text-white mt-1 group-hover:text-orange-500 transition-colors duration-300">
                      {item.detail}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Form Side (7 Columns) - Premium Glass Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 rounded-[2.5rem] border border-slate-200/60 bg-slate-50/50 p-8 backdrop-blur-md dark:border-slate-800/40 dark:bg-slate-900/50 lg:p-12 shadow-2xl shadow-slate-900/5"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                {/* Name */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full rounded-2xl border border-slate-200/60 bg-white/60 px-4 py-3.5 text-sm text-slate-900 transition-all focus:border-orange-500 focus:bg-white focus:outline-none dark:border-slate-700/60 dark:bg-slate-800/40 dark:text-white dark:focus:border-orange-400 dark:focus:bg-slate-800"
                    placeholder="John Doe"
                  />
                </div>

                {/* School Name */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    School / Institute Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full rounded-2xl border border-slate-200/60 bg-white/60 px-4 py-3.5 text-sm text-slate-900 transition-all focus:border-orange-500 focus:bg-white focus:outline-none dark:border-slate-700/60 dark:bg-slate-800/40 dark:text-white dark:focus:border-orange-400 dark:focus:bg-slate-800"
                    placeholder="e.g. Modern High School"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  className="w-full rounded-2xl border border-slate-200/60 bg-white/60 px-4 py-3.5 text-sm text-slate-900 transition-all focus:border-orange-500 focus:bg-white focus:outline-none dark:border-slate-700/60 dark:bg-slate-800/40 dark:text-white dark:focus:border-orange-400 dark:focus:bg-slate-800"
                  placeholder="name@school.com"
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Message Details
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full rounded-2xl border border-slate-200/60 bg-white/60 px-4 py-3.5 text-sm text-slate-900 transition-all focus:border-orange-500 focus:bg-white focus:outline-none dark:border-slate-700/60 dark:bg-slate-800/40 dark:text-white dark:focus:border-orange-400 dark:focus:bg-slate-800 resize-none"
                  placeholder="How can we help your institute?"
                />
              </div>

              {/* Submit Button */}
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 rounded-2xl bg-orange-500 text-sm font-bold uppercase tracking-widest text-white shadow-xl shadow-orange-500/20 hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  {loading ? 'Sending Request...' : 'Send Message'}
                  <Send className="h-4 w-4" />
                </Button>
              </motion.div>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
