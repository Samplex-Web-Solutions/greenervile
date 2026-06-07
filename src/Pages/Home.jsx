import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Comment from '../Components/Comment/Comment';
import { supabase } from '../SuperBase/superbaseClient';

import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Menu, X, ArrowRight, TrendingUp,
  Globe2, Plus, Minus, Quote, User, Mail,
  ShieldCheck, Zap, Star, Phone,
  Linkedin, Twitter, Instagram
} from 'lucide-react';
import { useToast } from '../Components/Context/ToastContext';
import Logo from '../assets/images/home.webp';
import ceo from '../assets/images/ceo.jpeg';

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

// --- ANIMATED COUNTER COMPONENT ---
const AnimatedCounter = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const numericValue = parseInt(value.replace(/,/g, '').replace(/\+/g, ''));
  const suffix = value.includes('+') ? '+' : value.includes('%') ? '%' : '';

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = numericValue;
      const totalSteps = 60;
      const increment = end / totalSteps;
      const stepTime = duration / totalSteps;

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [isInView, numericValue, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};

const Home = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Faqs', href: '#faqs' },
    { name: 'Contact', href: '#contact' },
  ];

  const stats = [
    { label: "Active Investors", value: "12,400+", icon: <User size={20} /> },
    { label: "Success Rate", value: "98.2%", icon: <TrendingUp size={20} /> },
    { label: "Global Projects", value: "106", icon: <Globe2 size={20} /> }
  ];

  const testimonials = [
    { name: "Sarah Jenkins", role: "Venture Partner", text: "Greener Vile has completely transformed how we track our ESG commitments. The transparency is unmatched." },
    { name: "Marcus Chen", role: "Private Investor", text: "Finally, a platform that combines high-yield returns with actual, verifiable green impact." },
    { name: "Elena Rodriguez", role: "Sustainability Lead", text: "The interface is intuitive, and the asset verification process gives me total peace of mind." }
  ];

  const faqs = [
    { 
      q: "How do I withdraw returns?", 
      a: "Returns are distributed quarterly. You can withdraw your earnings directly to your linked traditional bank account via wire transfer or through major Cryptocurrencies for faster global settlement." 
    },
    { 
      q: "Is my personal data and capital secure?", 
      a: "We utilize AES-256 bank-grade encryption and multi-factor authentication (MFA) to protect your account. Furthermore, all capital is held in regulated escrow accounts during the project funding phase." 
    },
    { 
      q: "Can I reinvest my dividends automatically?", 
      a: "Yes. Our 'Green-Growth' feature allows you to automatically reinvest your quarterly returns into new or existing projects to maximize the power of compounding." 
    },
    { 
      q: "How does Greener Vile make money?", 
      a: "We charge a transparent 1.5% annual management fee on assets under management (AUM). There are no hidden performance fees, ensuring our interests are perfectly aligned with your growth." 
    },
    { 
      q: "What happens if a project doesn't reach its funding goal?", 
      a: "In the rare event that a project does not meet its minimum funding threshold, 100% of the committed capital is returned to the investors' wallets instantly, with no processing fees." 
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden scroll-smooth">

      {/* --- FIXED NAVIGATION --- */}
      <nav className="fixed top-0 w-full z-[100] bg-white shadow-sm py-4 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-0 group relative z-10">
            <img src={Logo} alt="Logo" className="w-auto h-14 group-hover:rotate-12 transition-transform" />
            <span className="text-xl font-black tracking-tighter text-slate-900">Greener Vile</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="text-[11px] font-bold text-slate-500 hover:text-emerald-600 uppercase tracking-[0.2em] transition-colors">
                {link.name}
              </a>
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="relative group bg-slate-900 text-white px-7 py-3 rounded-2xl overflow-hidden shadow-lg shadow-slate-100">
              <div className="absolute inset-0 bg-emerald-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 flex items-center space-x-2 text-xs font-bold uppercase tracking-widest">
                <span>Sign In</span>
              </span>
            </motion.button>
          </div>

          <button className="md:hidden p-2 text-slate-900 relative z-10" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* --- MOBILE MENU OVERLAY --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[120] bg-white p-8 flex flex-col md:hidden"
          >
            <div className="flex justify-between items-center mb-16">
              <div className="flex items-center space-x-1">
                <img src={Logo} alt="Logo" className="w-auto h-10" />
                <span className="text-xl font-black tracking-tighter text-slate-900">Greener Vile</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-slate-50 rounded-full text-slate-900">
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-col space-y-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-bold text-slate-600 uppercase tracking-[0.2em] border-b border-slate-50 pb-2"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="mt-auto grid grid-cols-2 gap-4">
              <button
                onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
                className="py-4 bg-slate-100 text-slate-900 rounded-2xl font-bold text-xs uppercase tracking-widest"
              >
                Login
              </button>
              <button
                onClick={() => { navigate('/register'); setIsMobileMenuOpen(false); }}
                className="py-4 bg-emerald-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-emerald-100"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 flex items-center">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black leading-tight tracking-tight text-slate-900 mb-6">
              The Future of <br /> <span className="text-emerald-600">Green Investing</span> <br /> is Transparent.
            </h1>
            <p className="text-slate-500 text-lg mb-8 max-w-md leading-relaxed">
              Securely manage your sustainable portfolio with real-time data insights and verified ecological impact.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
              className="relative group w-full md:w-max bg-slate-900 text-white px-8 py-4 rounded-2xl overflow-hidden shadow-lg shadow-slate-100 flex items-center justify-center">
              <div className="absolute inset-0 bg-emerald-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 flex items-center space-x-2 text-xs font-bold uppercase tracking-widest">
                <span>Get Started</span><ArrowRight size={16} />
              </span>
            </motion.button>
          </motion.div>

          {/* Optimized Chart Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8 }} 
            className="relative w-full max-w-[500px] mx-auto lg:ml-auto lg:mr-0"
          >
            <div className="bg-[#0F172A] rounded-[40px] p-6 md:p-10 shadow-2xl w-full">
              <div className="flex justify-between items-start mb-8 md:mb-12">
                <div className="space-y-1">
                  <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em]">Live Performance</p>
                  <h3 className="text-2xl md:text-3xl pt-1 font-black text-white">$742,540,918.00</h3>
                </div>
                <div className="p-3 bg-white/5 rounded-2xl"><TrendingUp className="text-emerald-500" size={24} /></div>
              </div>
              <div className="flex items-end justify-between space-x-2 h-40 md:h-56">
                {[40, 65, 35, 85, 55, 95, 70].map((h, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ height: 0 }} 
                    animate={{ height: `${h}%` }} 
                    transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity, repeatType: "reverse" }}
                    className="flex-1 bg-gradient-to-t from-emerald-600/40 via-emerald-500/20 to-emerald-400/10 rounded-t-lg md:rounded-t-xl border-t border-emerald-500/40"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col items-center text-center">
              <div className="mb-4 p-4 bg-slate-50 text-emerald-600 rounded-2xl">{stat.icon}</div>
              <h4 className="text-4xl font-black text-slate-900 mb-1">
                <AnimatedCounter value={stat.value} />
              </h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- COMPANY PROFILE SECTION --- */}
      <section id="about" className="py-24 bg-slate-50 px-6 overflow-hidden">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start"
        >
          <motion.div variants={itemVariants} className="space-y-8">
            <div>
              <motion.h2 variants={itemVariants} className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-4">Established 2009</motion.h2>
              <motion.h3 variants={itemVariants} className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight">17 Years of <br /> <span className="text-emerald-600">Investment Excellence.</span></motion.h3>
            </div>
            <motion.p variants={itemVariants} className="text-slate-500 leading-relaxed text-lg">
              Founded on February 26, 2009, Greener Vile Investment Inc. was built during one of the most transformative periods in modern financial history.
            </motion.p>
            <motion.div variants={itemVariants} className="p-8 bg-white rounded-[32px] border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform">
                <Quote size={60} />
              </div>
              <p className="text-slate-800 font-bold italic leading-relaxed relative z-10">
                "At Greener Vile Investment Inc., growth isn’t rushed. <span className="text-emerald-600">It’s engineered.</span>"
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-6"
          >
            {[
              {
                title: "Precision Over Speculation",
                desc: "Every investment decision is backed by research and risk evaluation.",
                icon: <Zap size={24} className="text-emerald-600" />
              },
              {
                title: "Capital Preservation",
                desc: "Growth matters — but protecting capital matters more. Frameworks designed for stability.",
                icon: <ShieldCheck size={24} className="text-emerald-600" />
              },
              {
                title: "Sustainable Expansion",
                desc: "Scalable opportunities that create durable economic value.",
                icon: <TrendingUp size={24} className="text-emerald-600" />
              }
            ].map((card, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="p-8 bg-white rounded-[32px] border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 transition-all group"
              >
                <div className="mb-4 p-3 bg-emerald-50 w-fit rounded-2xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                  {card.icon}
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-2">{card.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{card.desc}</p>
                <div className="mt-4 flex items-center text-emerald-600 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Learn More</span>
                  <ArrowRight size={14} className="ml-2" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* --- CEO SECTION --- */}
      <section id="ceo" className="py-24 px-6 bg-slate-900 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative aspect-square max-w-sm mx-auto md:mx-0">
            <div className="absolute inset-0 border-2 border-emerald-500 rounded-[40px] translate-x-4 translate-y-4" />
            <div className="bg-slate-800 rounded-[40px] w-full h-full overflow-hidden border border-slate-700 flex items-center justify-center">
              <img src={ceo} className='object-cover w-full h-full' alt="CEO" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
            <Quote className="text-emerald-500 w-24 h-12 mb-4 opacity-50" />
            <h2 className="text-2xl font-bold italic leading-relaxed">"Since our founding, Greener Vile Investment Inc. has been built on discipline, vision, and long-term strategy."</h2>
            <div>
                <p className="text-xl font-black text-emerald-500">Sergio Busquets</p>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">CEO & Founder</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section id="testimonials" className="py-24 bg-white px-6">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatePresence mode='wait'>
            <motion.div key={currentTestimonial} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5 }} className="space-y-8">
              <div className="flex justify-center space-x-1 mb-6">{[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} className="text-amber-400 fill-amber-400" />)}</div>
              <p className="text-2xl md:text-3xl font-medium text-slate-800 leading-snug">"{testimonials[currentTestimonial].text}"</p>
              <div><p className="text-lg font-black text-slate-900">{testimonials[currentTestimonial].name}</p><p className="text-emerald-600 text-xs font-bold uppercase tracking-widest">{testimonials[currentTestimonial].role}</p></div>
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-center space-x-2 mt-12">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setCurrentTestimonial(i)} className={`h-1.5 rounded-full transition-all ${currentTestimonial === i ? 'w-8 bg-emerald-600' : 'w-2 bg-slate-200'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* --- FAQS --- */}
      <section id="faqs" className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black mb-10 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm">
                <button onClick={() => setActiveFaq(activeFaq === i ? null : i)} className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group text-left">
                  <span className={`font-bold transition-colors ${activeFaq === i ? 'text-emerald-600' : 'text-slate-800'}`}>{faq.q}</span>
                  <div className={`transition-transform duration-300 ${activeFaq === i ? 'rotate-180' : 'rotate-0'}`}>
                    {activeFaq === i ? <Minus size={18} className="text-emerald-600" /> : <Plus size={18} className="text-slate-400" />}
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="bg-slate-50 px-6 pb-6 text-sm text-slate-500 leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CONTACT SECTION --- */}
      <section id="contact" className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-black mb-6">Get in Touch</h2>
            <p className="text-slate-500 text-lg mb-8 leading-relaxed">Reach out to our partner support team for tailored investment insights.</p>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl"><Phone size={24} /></div>
                <div><p className="text-[10px] font-black text-slate-400 uppercase">Support Line</p><p className="font-bold text-slate-900">+1 (786) 735-2463</p></div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-white text-emerald-600 rounded-2xl shadow-sm border border-slate-100"><Mail size={24} /></div>
                <div><p className="text-[10px] font-black text-slate-400 uppercase">Email Address</p><p className="font-bold text-slate-900">support@greenervileinc.com</p></div>
              </div>
            </div>
          </div>
          {/* Using your upgraded Comment component */}
          <div className="w-full max-w-md mx-auto lg:ml-auto">
            <Comment />
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white pt-24 pb-12 border-t border-slate-100 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-20">
            <div className="col-span-2 space-y-6 text-center md:text-left">
              <Link to="/" className="flex items-center justify-center md:justify-start group">
                <img src={Logo} alt="Logo" className="w-auto h-12" />
                <span className="text-xl font-black tracking-tighter text-slate-900">Greener Vile</span>
              </Link>
              <p className="text-slate-500 text-sm max-w-xs mx-auto md:mx-0 leading-relaxed">
                Empowering global investors with transparent wealth management since 2009.
              </p>
              <div className="flex items-center justify-center md:justify-start space-x-4">
                <a href="#" className="p-2 bg-slate-50 text-slate-400 hover:text-emerald-600 rounded-xl transition-all"><Linkedin size={18} /></a>
                <a href="#" className="p-2 bg-slate-50 text-slate-400 hover:text-emerald-600 rounded-xl transition-all"><Twitter size={18} /></a>
                <a href="#" className="p-2 bg-slate-50 text-slate-400 hover:text-emerald-600 rounded-xl transition-all"><Instagram size={18} /></a>
              </div>
            </div>
            <div className="space-y-6">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Company</h4>
              <ul className="space-y-4 text-sm text-slate-500 font-medium">
                <li>About Us</li>
                <li>Strategy</li>
                <li>Green Assets</li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Resources</h4>
              <ul className="space-y-4 text-sm text-slate-500 font-medium">
                <li>Help Center</li>
                <li>ESG Reports</li>
                <li>Insights</li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Legal</h4>
              <ul className="space-y-4 text-sm text-slate-500 font-medium">
                <li>Privacy Policy</li>
                <li>Terms</li>
                <li>Disclosure</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">
              © 2026 Greener Vile Asset Management.
            </p>
            <div className="flex items-center space-x-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
              <span>Verified Secure</span>
              <ShieldCheck size={14} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;