import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/Authcontext';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../../assets/images/vile.png';

import {
  LayoutDashboard,
  Leaf,
  History,
  Settings,
  ShieldCheck,
  Users,
  Construction,
  LogOut,
  PlusCircle,
  Banknote,
  Menu,
  X
} from 'lucide-react';

const Sidebar = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const navigation = {
    user: [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Market Place', path: '/market', icon: Leaf },
      { name: 'Deposit', path: '/deposit', icon: PlusCircle },
      { name: 'Transactions', path: '/transaction', icon: History },
      { name: 'Withdraw', path: '/withdraw', icon: Banknote },
      { name: 'Settings', path: '/setting', icon: Settings },

    ],
    admin: [
      { name: 'Admin Overview', path: '/panel', icon: ShieldCheck },
      { name: 'Manage Users', path: '/panel/users', icon: Users },
      { name: 'Add Funds', path: '/panel/addfunds', icon: Banknote },
      { name: 'Market Settings', path: '/panel/market', icon: Construction },
      { name: 'Transaction Logs', path: '/panel/history', icon: History },
      { name: 'System Settings', path: '/panel/settings', icon: Settings },
    ]
  };

  const currentLinks = navigation[profile?.role] || [];

  return (
    <>
      {/* MOBILE HEADER BAR - Increased z-index to stay on top */}
      <div className="lg:hidden  flex items-center py-8 justify-between p-4 bg-slate-900 text-white fixed top-0 left-0 right-0 z-[100] border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <img src={Logo} alt="Logo" className="w-8 h-8 object-contain" />
          <span className="font-black text-sm tracking-tight">Greener Vile</span>
        </div>

        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-slate-800 rounded-lg text-emerald-500 active:scale-90 transition-transform"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE SIDEBAR WRAPPER */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[110] lg:hidden">
            {/* BACKDROP - Uses absolute inset-0 so it fills the parent fixed container */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* THE SIDEBAR (Mobile Version) */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute inset-y-0 left-0 w-72 bg-slate-900 text-white flex flex-col border-r border-slate-800 shadow-2xl"
            >
              <SidebarContent 
                Logo={Logo} 
                setIsOpen={setIsOpen} 
                currentLinks={currentLinks} 
                profile={profile} 
                handleLogout={handleLogout} 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR - Always visible on LG screens, uses sticky */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:h-screen lg:sticky lg:top-0 lg:z-[50] bg-slate-900 border-r border-slate-800 text-white">
        <SidebarContent 
          Logo={Logo} 
          setIsOpen={setIsOpen} 
          currentLinks={currentLinks} 
          profile={profile} 
          handleLogout={handleLogout} 
          isDesktop
        />
      </div>
    </>
  );
};

/* Extracted content to keep the code clean and ensure 
  the mobile and desktop versions look identical.
*/
const SidebarContent = ({ Logo, setIsOpen, currentLinks, profile, handleLogout, isDesktop = false }) => (
  <>
    {/* Sidebar Logo Header */}
    <div className={`p-6 border-b border-slate-800 flex items-center justify-between ${isDesktop ? 'pt-10' : 'pt-6'}`}>
      <div className="flex items-center space-x-2">
        <img
          src={Logo}
          alt="Greener Vile Logo"
          className="w-10 h-10 md:w-12 md:h-12 object-contain"
        />
        <h2 className="text-lg font-black text-white tracking-tight">
          Greener Vile
        </h2>
      </div>
      {!isDesktop && (
        <button onClick={() => setIsOpen(false)} className="p-1 text-slate-400">
          <X size={20} />
        </button>
      )}
    </div>

    {/* Navigation Links */}
    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
      {currentLinks.map((link) => {
        const Icon = link.icon;
        return (
          <NavLink
            key={link.path}
            to={link.path}
            onClick={() => setIsOpen(false)}
            end={link.path === '/panel' || link.path === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <Icon size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-sm">{link.name}</span>
          </NavLink>
        );
      })}
    </nav>

    {/* Profile & Logout Section */}
    <div className="p-4 bg-slate-950/40 border-t border-slate-800">
      <div className="flex items-center space-x-3 p-3 mb-4 bg-slate-900/50 rounded-2xl border border-slate-800">
        <div className="w-9 h-9 rounded-full bg-emerald-600/20 border border-emerald-500/50 flex items-center justify-center font-bold text-emerald-500 uppercase flex-shrink-0">
          {profile?.first_name?.[0]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-white truncate leading-none mb-1">
            {profile?.first_name} {profile?.last_name}
          </p>
          <p className="text-[10px] text-slate-500 truncate">@{profile?.username}</p>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleLogout}
        className="w-full flex items-center justify-center space-x-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white px-4 py-3 rounded-xl text-sm font-bold transition-all"
      >
        <LogOut size={18} />
        <span>Sign Out</span>
      </motion.button>
    </div>
  </>
);

export default Sidebar;