'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Quote } from 'lucide-react';
import { useRef } from 'react';

export default function QuoteSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Connect scroll to section dimensions to trigger subtle parallax shifts
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  const yText = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  const scaleQuote = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.05, 0.95]);

  return (
    <section 
      ref={sectionRef}
      className="bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 py-24 sm:py-32 relative overflow-hidden flex items-center justify-center"
    >
      {/* Cinematic Ambient Blurs */}
      <motion.div 
        style={{ scale: scaleQuote }}
        className="absolute top-[-10%] left-[-10%] w-[50%] aspect-square bg-white/10 rounded-full blur-3xl" 
      />
      <motion.div 
        style={{ scale: scaleQuote }}
        className="absolute bottom-[-15%] right-[-10%] w-[60%] aspect-square bg-black/10 rounded-full blur-3xl" 
      />
      
      {/* Floating Ambient Circle Indicators */}
      <div className="absolute top-[20%] right-[15%] w-24 h-24 rounded-full border border-white/10 blur-[1px] animate-pulse" />
      <div className="absolute bottom-[20%] left-[10%] w-36 h-36 rounded-full border border-white/5 blur-[2px] animate-pulse" style={{ animationDuration: '4s' }} />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Floating Quote Marks Icon Container */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white/20 p-5 rounded-[2rem] backdrop-blur-md shadow-inner border border-white/20">
            <Quote className="h-10 w-10 text-white animate-pulse" />
          </div>
        </motion.div>

        {/* Cinematic Typography Quote */}
        <motion.blockquote
          style={{ y: yText }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-3xl md:text-5xl font-semibold text-white leading-tight font-caveat tracking-wide px-4 sm:px-12 select-none"
        >
          "Technology is just a tool. In terms of getting the kids working together and motivating them, the teacher is the most important."
        </motion.blockquote>

        {/* Cinematic separator & author tag */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12"
        >
          <div className="h-1.5 w-24 bg-white/25 mx-auto rounded-full mb-6" />
          <p className="text-orange-100 font-black tracking-widest uppercase text-xs sm:text-sm">
            Bill Gates
          </p>
          <p className="text-[10px] text-orange-200/80 font-bold uppercase tracking-wider mt-1.5">
            Co-Founder, Microsoft
          </p>
        </motion.div>
      </div>
    </section>
  );
}
