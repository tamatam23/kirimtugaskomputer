import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  LogOut,
  Sparkles,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { springBounce } from '../../utils/motion';

export const DashboardLayout = ({
  user,
  menuItems,
  activeMenu,
  setActiveMenu,
  onLogout,
  children,
}) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Mobile drawer
  const [hoveredItemId, setHoveredItemId] = useState(null); // Floating smooth bounce popup
  const [isExpanded, setIsExpanded] = useState(() => {
    try {
      return localStorage.getItem('galeri_sidebar_expanded') === 'true';
    } catch {
      return false;
    }
  });

  const toggleSidebar = () => {
    setIsExpanded((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('galeri_sidebar_expanded', String(next));
      } catch {}
      return next;
    });
  };

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-gradient-to-br from-[#EFE9FE] via-[#F6F3FE] to-[#ECE5FD] p-2 sm:p-4 gap-4">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* DESKTOP SIDEBAR (EXPANDABLE: COMPACT DOCK <-> WIDE SIDEBAR)   */}
      {/* ============================================================== */}
      <aside
        className={`hidden md:flex relative shrink-0 h-full bg-[#0F111A]/95 backdrop-blur-2xl rounded-[2.75rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.35)] flex-col py-4 md:py-6 overflow-visible select-none transition-all duration-300 ease-in-out hover:shadow-[0_25px_60px_rgba(109,40,217,0.25)] z-40 ${
          isExpanded ? 'w-[245px] px-3.5 items-stretch' : 'w-[88px] px-3.5 items-center'
        }`}
      >
        {/* Toggle Arrow Button (Floating on the right edge) */}
        <button
          type="button"
          onClick={toggleSidebar}
          onMouseEnter={() => setHoveredItemId('toggle-arrow')}
          onMouseLeave={() => setHoveredItemId(null)}
          title={isExpanded ? 'Ciutkan Sidebar' : 'Perlebar Sidebar (Tampilkan Nama)'}
          className="absolute -right-3.5 top-7 w-7 h-7 rounded-full bg-[#181B2C] hover:bg-violet-600 text-purple-200 hover:text-white border-2 border-[#0F111A] shadow-xl flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95 z-50 group"
        >
          <ChevronRight
            size={14}
            className={`transition-transform duration-300 group-hover:scale-115 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Toggle Arrow Tooltip (when collapsed) */}
        <AnimatePresence>
          {!isExpanded && hoveredItemId === 'toggle-arrow' && (
            <motion.div
              initial={{ opacity: 0, x: -8, scale: 0.88 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -6, scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 450, damping: 24 }}
              className="absolute left-full top-7 -translate-y-1 ml-4 px-3.5 py-2 rounded-xl bg-[#121422]/95 backdrop-blur-xl text-white text-xs font-black whitespace-nowrap shadow-[0_12px_35px_rgba(0,0,0,0.5)] border border-white/15 z-50 pointer-events-none flex items-center gap-2"
            >
              <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#121422] border-l border-b border-white/15 rotate-45 pointer-events-none" />
              <span className="relative z-10">Buka Nama Menu</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Brand Header */}
        <div className="relative pb-2 md:pb-3 shrink-0">
          {!isExpanded ? (
            /* Collapsed Brand Icon */
            <div className="flex flex-col items-center">
              <motion.div
                whileHover={{ rotate: 8, scale: 1.15 }}
                whileTap={{ scale: 0.92 }}
                transition={springBounce}
                onMouseEnter={() => setHoveredItemId('brand')}
                onMouseLeave={() => setHoveredItemId(null)}
                className="w-[52px] h-[52px] flex items-center justify-center cursor-pointer filter drop-shadow-[0_8px_18px_rgba(139,92,246,0.5)] select-none"
              >
                <img src="/logo.png" alt="Galeri Karya Komputer" className="w-full h-full object-contain" />
              </motion.div>

              {/* Brand Tooltip */}
              <AnimatePresence>
                {hoveredItemId === 'brand' && (
                  <motion.div
                    initial={{ opacity: 0, x: -8, scale: 0.88 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -6, scale: 0.92 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 24 }}
                    className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3.5 py-2 rounded-xl bg-[#121422]/95 backdrop-blur-xl text-white text-xs font-black whitespace-nowrap shadow-[0_12px_35px_rgba(0,0,0,0.5)] border border-white/15 z-50 pointer-events-none flex items-center gap-2"
                  >
                    <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#121422] border-l border-b border-white/15 rotate-45 pointer-events-none" />
                    <span className="relative z-10 font-black">Galeri Komputer</span>
                    <span className="relative z-10 text-[9px] font-black tracking-wider uppercase bg-purple-500/20 text-purple-300 border border-purple-400/30 px-1.5 py-0.5 rounded-full">
                      SD
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* Expanded Brand Header */
            <div className="flex items-center gap-3 px-1 w-full">
              <motion.div
                whileHover={{ rotate: 8, scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                transition={springBounce}
                className="w-10 h-10 flex items-center justify-center filter drop-shadow-[0_6px_14px_rgba(139,92,246,0.45)] shrink-0 cursor-pointer select-none"
              >
                <img src="/logo.png" alt="Galeri Karya Komputer" className="w-full h-full object-contain" />
              </motion.div>
              <div className="flex-1 min-w-0">
                <h1 className="font-black text-white text-sm leading-tight tracking-tight truncate">
                  GALERI KARYA
                </h1>
                <span className="text-[9px] font-black tracking-widest uppercase bg-purple-500/20 text-purple-300 border border-purple-400/30 px-1.5 py-0.5 rounded-full inline-block mt-0.5">
                  KOMPUTER SD
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className={`h-px bg-white/[0.08] mb-2.5 md:mb-3.5 shrink-0 ${isExpanded ? 'w-full' : 'w-10 mx-auto'}`} />

        {/* Navigation Items */}
        <nav className={`flex-1 space-y-2.5 md:space-y-3.5 py-1 flex flex-col w-full overflow-visible ${
          isExpanded ? 'items-stretch' : 'items-center'
        }`}>
          {menuItems.map((item) => {
            const active = activeMenu === item.id;
            const Icon = item.icon;

            if (isExpanded) {
              return (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={springBounce}
                  className={`relative w-full h-[50px] px-3.5 rounded-2xl flex items-center gap-3.5 text-left transition-all ${
                    active
                      ? 'text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 shadow-[0_4px_22px_rgba(139,92,246,0.55)] border border-purple-400/30 font-extrabold'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.08] font-bold'
                  }`}
                >
                  <Icon
                    size={20}
                    className={`shrink-0 transition-colors ${
                      active ? 'text-white' : 'text-slate-400 group-hover:text-purple-300'
                    }`}
                  />
                  <span className="text-sm tracking-tight truncate flex-1 leading-none">
                    {item.label}
                  </span>
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff] shrink-0" />
                  )}
                </motion.button>
              );
            }

            return (
              <div key={item.id} className="relative flex justify-center w-full shrink-0">
                <motion.button
                  onClick={() => setActiveMenu(item.id)}
                  onMouseEnter={() => setHoveredItemId(item.id)}
                  onMouseLeave={() => setHoveredItemId(null)}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.92 }}
                  transition={springBounce}
                  className={`relative w-[52px] h-[52px] rounded-2xl flex items-center justify-center transition-colors ${
                    active
                      ? 'text-white'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  {/* Active Glowing Pill Background */}
                  {active && (
                    <motion.div
                      layoutId="activeDockPill"
                      className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-600 shadow-[0_4px_22px_rgba(139,92,246,0.55)] border border-purple-400/30"
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 28,
                      }}
                    />
                  )}

                  {/* Icon */}
                  <Icon
                    size={22}
                    className={`relative z-10 transition-colors ${
                      active ? 'text-white' : 'text-slate-400 hover:text-purple-300'
                    }`}
                  />
                </motion.button>

                {/* Smooth Bounce Popup Pill on Hover */}
                <AnimatePresence>
                  {hoveredItemId === item.id && (
                    <motion.div
                      initial={{ opacity: 0, x: -8, scale: 0.88 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -6, scale: 0.92 }}
                      transition={{ type: 'spring', stiffness: 450, damping: 24 }}
                      className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3.5 py-2 rounded-xl bg-[#121422]/95 backdrop-blur-xl text-white text-xs font-black whitespace-nowrap shadow-[0_12px_35px_rgba(0,0,0,0.5)] border border-white/15 z-50 pointer-events-none flex items-center gap-2"
                    >
                      {/* Caret pointing left to icon */}
                      <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#121422] border-l border-b border-white/15 rotate-45 pointer-events-none" />
                      <span className="relative z-10">{item.label}</span>
                      {active && (
                        <span className="relative z-10 w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#a855f7] animate-pulse" />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* Divider */}
        <div className={`h-px bg-white/[0.08] my-2.5 md:my-3.5 shrink-0 ${isExpanded ? 'w-full' : 'w-10 mx-auto'}`} />

        {/* Sidebar Footer: Logout Button */}
        <div className={`relative pt-1 w-full shrink-0 ${isExpanded ? 'px-0' : 'flex justify-center'}`}>
          {isExpanded ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={springBounce}
              onClick={onLogout}
              className="w-full h-[50px] px-3.5 rounded-2xl flex items-center gap-3.5 text-rose-400 hover:text-rose-200 hover:bg-rose-500/15 font-bold transition-colors text-left"
            >
              <LogOut size={20} className="shrink-0" />
              <span className="text-sm tracking-tight truncate flex-1 leading-none">Keluar Akun</span>
            </motion.button>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.92 }}
                transition={springBounce}
                onClick={onLogout}
                onMouseEnter={() => setHoveredItemId('logout')}
                onMouseLeave={() => setHoveredItemId(null)}
                className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center text-rose-400 hover:text-rose-200 hover:bg-rose-500/15 transition-colors"
              >
                <LogOut size={20} />
              </motion.button>

              {/* Logout Smooth Bounce Popup */}
              <AnimatePresence>
                {hoveredItemId === 'logout' && (
                  <motion.div
                    initial={{ opacity: 0, x: -8, scale: 0.88 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -6, scale: 0.92 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 24 }}
                    className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3.5 py-2 rounded-xl bg-rose-950/95 backdrop-blur-xl text-rose-200 text-xs font-black whitespace-nowrap shadow-[0_12px_35px_rgba(0,0,0,0.5)] border border-rose-500/30 z-50 pointer-events-none flex items-center gap-2"
                  >
                    <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-rose-950 border-l border-b border-rose-500/30 rotate-45 pointer-events-none" />
                    <span className="relative z-10">Keluar Akun</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </aside>

      {/* ============================================================== */}
      {/* MOBILE DRAWER SIDEBAR (SLIDE-IN OVERLAY)                       */}
      {/* ============================================================== */}
      <aside
        className={`fixed top-3 bottom-3 left-3 z-50 w-72 bg-[#0F111A]/98 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col p-5 transition-transform duration-300 ease-in-out md:hidden ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header Mobile */}
        <div className="pb-4 mb-2 flex items-center justify-between border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 flex items-center justify-center filter drop-shadow-[0_6px_14px_rgba(139,92,246,0.45)] shrink-0 select-none">
              <img src="/logo.png" alt="Galeri Karya Komputer" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-black text-white text-base leading-tight tracking-tight">
                GALERI KARYA
              </h1>
              <span className="text-[9px] font-black tracking-widest uppercase bg-purple-500/20 text-purple-300 border border-purple-400/30 px-2 py-0.5 rounded-full">
                KOMPUTER
              </span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Mobile */}
        <nav className="flex-1 py-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const active = activeMenu === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveMenu(item.id);
                  setSidebarOpen(false);
                }}
                className={`relative w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-extrabold text-sm transition-all text-left ${
                  active
                    ? 'text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 shadow-lg shadow-purple-500/35 border border-purple-400/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                <Icon size={20} className={active ? 'text-white' : 'text-slate-400'} />
                <span className="flex-1">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Mobile */}
        <div className="pt-3 border-t border-white/[0.08]">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl font-extrabold text-sm text-rose-400 hover:bg-rose-500/15 transition-colors"
          >
            <LogOut size={18} /> Keluar Akun
          </button>
        </div>
      </aside>

      {/* ============================================================== */}
      {/* MAIN CONTENT VIEWPORT                                          */}
      {/* ============================================================== */}
      <main className="flex-1 flex flex-col overflow-hidden relative min-w-0">
        {/* Mobile Header Bar (Hidden on Desktop & Tablet) */}
        <header className="md:hidden bg-white/90 backdrop-blur-xl rounded-2xl border border-white/80 shadow-sm px-4 py-3 flex items-center justify-between mb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 -ml-1 rounded-xl text-slate-600 hover:bg-purple-50"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-base font-black text-slate-800">
              {menuItems.find((m) => m.id === activeMenu)?.label}
            </h2>
          </div>
        </header>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto pb-28 md:pb-8 px-2 sm:px-4 lg:px-6 pt-3 sm:pt-4 lg:pt-5 w-full">
          <div className="w-full space-y-6">{children}</div>
        </div>

        {/* Mobile Bottom Navigation (Matching Dark Glass Aesthetic) */}
        <nav className="md:hidden fixed bottom-3 left-3 right-3 bg-[#0F111A]/95 backdrop-blur-2xl rounded-[2rem] border border-white/10 flex items-stretch px-3 py-2 z-30 shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
          {menuItems.map((item) => {
            const active = activeMenu === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveMenu(item.id);
                  setSidebarOpen(false);
                }}
                className="flex-1 min-w-0 flex flex-col items-center justify-center gap-1 py-1 active:scale-95 transition-transform"
              >
                <div
                  className={`flex items-center justify-center w-12 h-7 rounded-full transition-all ${
                    active
                      ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-purple-500/40 border border-purple-400/30'
                      : 'text-slate-400'
                  }`}
                >
                  <Icon size={18} />
                </div>
                <span
                  className={`text-[10px] leading-tight truncate max-w-full ${
                    active ? 'font-black text-purple-300' : 'font-semibold text-slate-400'
                  }`}
                >
                  {item.short || item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </main>
    </div>
  );
};
