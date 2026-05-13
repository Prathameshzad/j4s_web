'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export default function QuoteSection() {
  return (
    <section className="bg-orange-500 py-20 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
            <Quote className="h-8 w-8 text-white" />
          </div>
        </motion.div>

        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl font-semibold text-white leading-tight font-caveat"
        >
          "Technology is just a tool. In terms of getting the kids working together and motivating them, the teacher is the most important."
        </motion.blockquote>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <div className="h-1 w-20 bg-white/30 mx-auto rounded-full mb-4" />
          <p className="text-orange-100 font-medium tracking-wide uppercase text-sm">
            Bill Gates
          </p>
        </motion.div>
      </div>
    </section>
  );
}
