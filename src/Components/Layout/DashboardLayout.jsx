import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../SideBar/SideBar';
import { motion } from 'framer-motion';

const DashboardLayout = () => {
  return (
    // Main wrapper ensures background uniformity across screen extremes
    <div className="bg-slate-50 min-h-screen w-full overflow-x-hidden">
      
      {/* Centering Layout Grid Container */}
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row relative min-h-screen">
        
        {/* Navigation Sidebar Drawer/Column */}
        <Sidebar />
        
        {/* Main Display Viewport Canvas:
          - pt-[97px]: Perfect clearance for the mobile top header bar (py-8 + contents)
          - lg:pt-0: Completely drops mobile clearance constraints on desktop screens
        */}
        <main className="flex-1 flex flex-col min-w-0 pt-[97px] lg:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            // Uniform structural margins that adjust fluidly with the breakpoint grid
            className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;