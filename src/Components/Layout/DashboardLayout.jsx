import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../SideBar/SideBar';
import { motion } from 'framer-motion';
const DashboardLayout = () => {
  return (
    // This wrapper ensures the background color covers the whole screen
    <div className="bg-slate-50 min-h-screen">
      
      {/* Centering Container: This keeps everything (Sidebar + Content) in the middle */}
      <div className="max-w-[1600px] mx-auto flex relative">
        
        {/* Sidebar now lives inside the centering container */}
        <Sidebar />
        
        <main className="flex-1 min-h-screen pt-20 lg:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="p-4 pt-10 md:pt-0 md:p-8"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};
export default DashboardLayout;