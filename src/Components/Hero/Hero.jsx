import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowUpRight } from 'lucide-react';

const Hero = () => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.2, 
        delayChildren: 0.3 
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  return (
    // Note: If 'bg-gv-dark' is failing, check your tailwind.config.js
    <section className="relative min-h-[90vh] flex items-center bg-[#0f172a] overflow-hidden px-6 lg:px-20">
      
      {/* Background Grid - Enhanced for better contrast */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl"
      >
        <motion.span 
          variants={itemVariants} 
          className="inline-block text-[#927b5c] font-medium tracking-[0.4em] text-xs mb-6 border-l-2 border-[#927b5c] pl-4 uppercase"
        >
          Established 2009
        </motion.span>
        
        <motion.h1 
          variants={itemVariants} 
          className="text-5xl md:text-6xl lg:text-8xl font-serif text-white leading-[1.1] mb-8"
        >
          Growth isn’t rushed. <br />
          <span className="text-[#927b5c] italic font-light">It’s engineered.</span>
        </motion.h1>

        <motion.p 
          variants={itemVariants} 
          className="text-slate-400 text-lg lg:text-xl max-w-2xl mb-12 leading-relaxed"
        >
          Greener Vile Investment Inc. bridges the gap between traditional stability and modern growth. 
          We manage capital with precision, focusing on long-term wealth architecture.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6">
          <button className="group bg-[#064e3b] hover:bg-emerald-900 text-white px-10 py-5 rounded-sm font-semibold transition-all flex items-center justify-center gap-3 shadow-2xl">
            Explore Opportunities 
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button className="group border border-slate-700 hover:border-[#927b5c] text-white px-10 py-5 rounded-sm font-semibold transition-all flex items-center justify-center gap-3">
            Institutional Track Record 
            <ArrowUpRight size={18} className="text-[#927b5c] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;