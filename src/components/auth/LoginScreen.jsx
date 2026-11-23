import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  GraduationCap,
  Users,
  Eye,
  EyeOff,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  KeyRound,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Avatar } from '../common/Avatar';
import { hashPassword } from '../../utils/helpers';
import { springBounce } from '../../utils/motion';
import { DEFAULT_CLASSES } from '../../services/api';

// ============================================================================
// TRAVELING BORDER GLOW (OUTLINE-ONLY BEAM RUNNING AROUND THE ROUNDED FRAME)
// Strictly masked to the 2px border line so zero light sweeps inside the card
// ============================================================================
const TravelingBorderGlow = () => {
  return (
    <div
      className="absolute inset-0 rounded-[2.5rem] p-[2px] pointer-events-none overflow-hidden z-20"
      style={{
        maskImage: 'linear-gradient(#fff 0 0), linear-gradient(#fff 0 0)',
        maskClip: 'content-box, border-box',
        maskComposite: 'exclude',
        WebkitMaskImage: 'linear-gradient(#fff 0 0), linear-gradient(#fff 0 0)',
        WebkitMaskClip: 'content-box, border-box',
        WebkitMaskComposite: 'xor',
        filter: 'drop-shadow(0 0 6px rgba(168, 85, 247, 0.8))',
      }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }}
        className="absolute -inset-[150%] origin-center flex items-center justify-center pointer-events-none"
      >
        <div
          className="w-full h-full"
          style={{
            background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 270deg, rgba(56, 189, 248, 0.4) 300deg, rgba(168, 85, 247, 0.95) 335deg, rgba(244, 114, 182, 1) 352deg, #ffffff 360deg)`,
          }}
        />
      </motion.div>
    </div>
  );
};

export const LoginScreen = ({ onLogin }) => {
  const { data } = useData();
  const [role, setRole] = useState(null);
  const [activeFormRole, setActiveFormRole] = useState('siswa');
  const [formSessionKey, setFormSessionKey] = useState(0);
  const isFlipped = Boolean(role);

  const handleChooseRole = (chosenRole) => {
    setActiveFormRole(chosenRole);
    setFormSessionKey((k) => k + 1);
    setRole(chosenRole);
  };

  const handleBackToRoles = () => {
    setRole(null);
    // After card completes flip back to front, reset the form session
    setTimeout(() => {
      setFormSessionKey((k) => k + 1);
    }, 350);
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden select-none">
      {/* Background Scenic Landscape (Vector Twilight Lake & Mountains) */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/login-bg.jpg')` }}
      />

      {/* Atmospheric Subtle Vignette (Razor sharp background without blur) */}
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950/20 via-transparent to-slate-950/40 pointer-events-none" />

      {/* Floating Ambient Glowing Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.3, 0.15],
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="fixed -top-32 -left-32 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.15, 0.3, 0.15],
          x: [0, -25, 0],
          y: [0, 25, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="fixed -bottom-32 -right-32 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none"
      />

      {/* Central Glassmorphic Container Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="w-full max-w-md z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-6 flex flex-col items-center relative">
          <motion.div
            whileHover={{ scale: 1.08, rotate: [0, -3, 3, 0] }}
            whileTap={{ scale: 0.95 }}
            transition={springBounce}
            className="inline-flex mb-2 cursor-pointer select-none filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.55)]"
          >
            <img
              src="/logo.png"
              alt="GALERI KARYA KOMPUTER"
              className="w-24 h-24 sm:w-28 sm:h-28 object-contain"
            />
          </motion.div>

          {/* Title Container with Modern Kids Font, Kilatan Shimmer & Light Sweep */}
          <div className="relative inline-block px-4 py-1.5 overflow-hidden rounded-2xl select-none filter drop-shadow-[0_8px_24px_rgba(0,0,0,0.75)]">
            {/* Diagonal Kilatan Light Beam Sweep */}
            <motion.div
              animate={{ x: ['-180%', '280%'] }}
              transition={{
                duration: 3.8,
                repeat: Infinity,
                ease: [0.4, 0, 0.2, 1],
                repeatDelay: 0.5,
              }}
              className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-22deg] pointer-events-none z-20"
            />

            {/* Sparkle Stars Animation */}
            {/* Modern Heading */}
            <h1 className="relative z-10 font-kids font-bold text-3xl sm:text-4xl tracking-wider uppercase leading-tight animate-kilatan">
              GALERI KARYA KOMPUTER
            </h1>
          </div>
        </div>

        {/* 3D Perspective Flipping Card Container */}
        <div className="relative w-full [perspective:1400px]">
          <motion.div
            initial={false}
            animate={{
              rotateY: isFlipped ? 180 : 0,
            }}
            transition={{
              type: 'spring',
              stiffness: 220,
              damping: 18,
              mass: 0.9,
            }}
            style={{ transformStyle: 'preserve-3d' }}
            className="grid [grid-template-areas:'cardface'] w-full"
          >
            {/* ======================================================== */}
            {/* FRONT FACE: Role Chooser                                 */}
            {/* ======================================================== */}
            <div
              style={{
                gridArea: 'cardface',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
              className={`w-full min-h-[360px] flex flex-col justify-center items-center rounded-[2.5rem] bg-slate-950/50 backdrop-blur-2xl border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.55)] p-6 sm:p-8 select-none relative ${
                isFlipped ? 'pointer-events-none' : 'pointer-events-auto'
              }`}
            >
              {/* Animated Traveling Glow Border around Rounded Outline */}
              <TravelingBorderGlow />

              {/* Subtle Glass Highlight */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-10" />

              <div className="w-full space-y-4 my-auto relative z-10">
                {/* Siswa Option */}
                <motion.button
                  type="button"
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={springBounce}
                  onClick={() => handleChooseRole('siswa')}
                  className="w-full flex items-center gap-4 p-4 rounded-3xl bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/15 hover:border-white/35 transition-all text-left group shadow-lg cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500/90 to-indigo-500/90 text-white flex items-center justify-center shadow-md shadow-purple-500/30 border border-white/25 shrink-0 group-hover:scale-105 transition-transform">
                    <GraduationCap size={28} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-white text-lg group-hover:text-purple-200 transition-colors">
                      Siswa
                    </h3>
                    <p className="text-xs text-purple-100/70 mt-0.5 truncate">
                      Upload & pamerkan hasil karyamu
                    </p>
                  </div>
                  <ChevronRight size={22} className="text-white/40 group-hover:text-white transition-colors shrink-0" />
                </motion.button>

                {/* Guru Option */}
                <motion.button
                  type="button"
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={springBounce}
                  onClick={() => handleChooseRole('guru')}
                  className="w-full flex items-center gap-4 p-4 rounded-3xl bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/15 hover:border-white/35 transition-all text-left group shadow-lg cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500/90 to-blue-500/90 text-white flex items-center justify-center shadow-md shadow-indigo-500/30 border border-white/25 shrink-0 group-hover:scale-105 transition-transform">
                    <Users size={28} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-white text-lg group-hover:text-indigo-200 transition-colors">
                      Guru
                    </h3>
                    <p className="text-xs text-indigo-100/70 mt-0.5 truncate">
                      Kelola siswa, project, dan beri nilai
                    </p>
                  </div>
                  <ChevronRight size={22} className="text-white/40 group-hover:text-white transition-colors shrink-0" />
                </motion.button>
              </div>
            </div>

            {/* ======================================================== */}
            {/* BACK FACE: Login Form (Siswa / Guru)                     */}
            {/* ======================================================== */}
            <div
              style={{
                gridArea: 'cardface',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
              className={`w-full min-h-[360px] flex flex-col justify-between rounded-[2.5rem] bg-slate-950/50 backdrop-blur-2xl border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.55)] p-6 sm:p-8 relative ${
                !isFlipped ? 'pointer-events-none' : 'pointer-events-auto'
              }`}
            >
              {/* Animated Traveling Glow Border around Rounded Outline */}
              <TravelingBorderGlow />

              {/* Subtle Glass Highlight */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-10" />

              <div className="w-full relative z-10">
                <button
                  type="button"
                  onClick={handleBackToRoles}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white/80 hover:text-white mb-4 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 transition-all cursor-pointer hover:scale-105 active:scale-95"
                >
                  <ArrowLeft size={15} /> Kembali ke Pilihan Peran
                </button>
              </div>

              <div className="w-full my-auto flex flex-col justify-center relative z-10">
                {activeFormRole === 'guru' ? (
                  <LoginFormGuru key={`guru-${formSessionKey}`} onLogin={onLogin} users={data.users} />
                ) : (
                  <LoginFormSiswa
                    key={`siswa-${formSessionKey}`}
                    onLogin={onLogin}
                    data={data}
                    onBackToRoles={handleBackToRoles}
                    isFlipped={isFlipped}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs font-medium text-white/60 mt-6 drop-shadow">
          Galeri Karya Komputer SD &copy; 2026 &bull; SDIT / SD Kreatif
        </p>
      </motion.div>
    </div>
  );
};

const LoginFormGuru = ({ onLogin, users }) => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const showToast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin.trim() === '2389') {
      const validGuru = users.find((u) => u.role === 'guru') || {
        id: 'guru-1',
        name: 'Guru Komputer',
        role: 'guru',
        username: 'admin',
      };
      onLogin(validGuru);
      showToast(`Selamat datang, ${validGuru.name || 'Guru'}!`);
    } else {
      showToast('PIN Guru salah. Silakan coba lagi.', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full flex flex-col items-center justify-center my-auto">
      <div className="w-full max-w-[280px] text-center">
        <label className="text-xs font-black uppercase tracking-wider text-purple-200/90 block mb-2 text-center">
          Masukkan PIN Guru
        </label>
        <div className="relative">
          <input
            type={showPin ? 'text' : 'password'}
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            required
            autoFocus
            placeholder="••••"
            className="w-full px-4 py-3.5 text-center tracking-[0.4em] text-xl font-black rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white/20 shadow-inner transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPin(!showPin)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-1 transition-colors"
          >
            {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.96 }}
        transition={springBounce}
        className="w-full max-w-[280px] py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-black text-sm shadow-[0_8px_25px_rgba(99,102,241,0.4)] border border-white/20 transition-all cursor-pointer"
      >
        Masuk sebagai Guru
      </motion.button>
    </form>
  );
};

// ============================================================================
// FUTURISTIC CONCENTRIC KNOB RADIAL CLASS SELECTOR
// ============================================================================
const CircularClassSelector = ({ classes, onSelectClass, onCloseAndGoBack }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [collapsingId, setCollapsingId] = useState(null);
  const [isClosingToBack, setIsClosingToBack] = useState(false);

  const rawClasses = (classes && classes.length > 0) ? classes : DEFAULT_CLASSES;
  const validClasses = rawClasses.filter(
    (c) => c && c.name && !c.name.startsWith('{')
  );
  const cleanClasses = validClasses.length > 0 ? validClasses : DEFAULT_CLASSES;

  const N = cleanClasses.length || 6;
  const radius = 86; // px distance from center to circle rim

  const handleSelect = (c) => {
    setCollapsingId(c.id);
    setTimeout(() => {
      onSelectClass(c.id);
    }, 450);
  };

  const handleCenterClick = () => {
    if (isOpen) {
      // Dial is open: clicking center knob closes classes with animation out and flips card back!
      setIsClosingToBack(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsClosingToBack(false);
        if (onCloseAndGoBack) {
          onCloseAndGoBack();
        }
      }, 220);
    } else {
      // Dial is closed: click center knob to bloom classes open INSTANTLY!
      setIsOpen(true);
    }
  };

  const classItems = cleanClasses.map((c, index) => {
    const angleDeg = -90 + (index * 360) / N;
    const rad = (angleDeg * Math.PI) / 180;
    const x = Math.round(radius * Math.cos(rad));
    const y = Math.round(radius * Math.sin(rad));
    return { ...c, x, y, angleDeg, index };
  });

  const needleAngle =
    hoveredIndex !== null ? classItems[hoveredIndex]?.angleDeg + 90 : 0;

  return (
    <div className="flex flex-col items-center justify-center my-auto py-2 w-full min-h-[300px]">
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center select-none">
        {/* Concentric Circle Dial Background & Orbit Tracks */}
        <motion.div
          initial={false}
          animate={{
            scale: !isOpen || isClosingToBack ? 0.25 : 1,
            opacity: !isOpen || isClosingToBack ? 0 : 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 420,
            damping: 25,
          }}
          className="absolute inset-0 rounded-full bg-slate-900/95 border-2 border-white/25 shadow-[0_20px_60px_rgba(0,0,0,0.7),inset_0_2px_5px_rgba(255,255,255,0.2)] backdrop-blur-2xl flex items-center justify-center pointer-events-none"
        >
          {/* Concentric Decorative Orbit Tracks */}
          <div className="absolute inset-2.5 rounded-full border border-white/10" />
          <div className="absolute inset-6 rounded-full border border-dashed border-purple-400/20" />
          <div className="absolute inset-16 rounded-full border border-white/15" />
        </motion.div>

        {/* Central Futuristic Knob (Click to Bloom Open / Click to Collapse & Return) */}
        <motion.button
          type="button"
          onClick={handleCenterClick}
          whileHover={{
            scale: isOpen ? 1.12 : 1.18,
            transition: { type: 'spring', stiffness: 500, damping: 10, mass: 0.5 },
          }}
          whileTap={{
            scale: 0.9,
            transition: { type: 'spring', stiffness: 500, damping: 15 },
          }}
          className="relative z-30 w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border-2 border-white/35 shadow-[0_15px_40px_rgba(0,0,0,0.65),inset_0_2px_4px_rgba(255,255,255,0.4)] flex items-center justify-center cursor-pointer select-none group"
        >
          {/* Concentric Pulsing Light Rings (Only active when Closed to guide the student to click) */}
          {!isOpen && (
            <>
              <div className="absolute -inset-3 rounded-full border border-purple-400/30 animate-ping opacity-25 pointer-events-none" />
              <div className="absolute -inset-1 rounded-full border border-cyan-400/25 pointer-events-none" />
            </>
          )}

          {/* Rotating Pointer Needle (Only active when Open) */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, rotate: needleAngle }}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
              className="absolute inset-0 flex items-start justify-center pt-2 pointer-events-none"
            >
              <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-cyan-300 via-sky-400 to-transparent shadow-[0_0_12px_rgba(56,189,248,1)]" />
            </motion.div>
          )}

          {/* Inner Glowing Disc with Pure Graduation Cap Icon */}
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600/40 to-indigo-600/40 border border-white/20 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
            <GraduationCap
              size={28}
              className={`text-purple-200 drop-shadow-[0_2px_8px_rgba(168,85,247,0.8)] ${
                isOpen ? 'mt-2' : ''
              }`}
            />
          </div>
        </motion.button>

        {/* Integrated Circular Class Badges (Burst Out from Center Knob on Click!) */}
        {classItems.map((c) => {
          const isChosen = collapsingId === c.id;
          const isOtherCollapsing = (collapsingId && !isChosen) || isClosingToBack;

          return (
            <motion.button
              key={c.id}
              type="button"
              onMouseEnter={() => setHoveredIndex(c.index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handleSelect(c)}
              initial={false}
              animate={
                !isOpen || isOtherCollapsing
                  ? { x: 0, y: 0, scale: 0, opacity: 0, pointerEvents: 'none' }
                  : isChosen
                  ? { x: 0, y: 0, scale: [1, 1.35, 0.8], opacity: 1, pointerEvents: 'none' }
                  : { x: c.x, y: c.y, scale: 1, opacity: 1, pointerEvents: 'auto' }
              }
              transition={{
                type: 'spring',
                stiffness: 420,
                damping: !isOpen || isOtherCollapsing ? 26 : 17,
                mass: 0.65,
                delay:
                  !isOpen || isOtherCollapsing
                    ? (5 - c.index) * 0.015
                    : c.index * 0.025,
              }}
              whileHover={{
                scale: 1.35,
                transition: {
                  type: 'spring',
                  stiffness: 550,
                  damping: 9,
                  mass: 0.5,
                },
              }}
              whileTap={{
                scale: 0.88,
                transition: {
                  type: 'spring',
                  stiffness: 500,
                  damping: 14,
                },
              }}
              className={`absolute left-1/2 top-1/2 -ml-6 -mt-6 w-12 h-12 rounded-full flex items-center justify-center font-kids font-bold text-sm tracking-wide cursor-pointer shadow-lg backdrop-blur-xl ${
                isChosen
                  ? 'bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 text-white border-2 border-white shadow-[0_0_30px_rgba(168,85,247,1)] z-40'
                  : 'bg-slate-800/90 hover:bg-gradient-to-tr hover:from-purple-600 hover:via-indigo-600 hover:to-purple-500 text-white border-2 border-white/30 hover:border-cyan-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.95),0_0_15px_rgba(56,189,248,0.8),inset_0_2px_4px_rgba(255,255,255,0.4)] z-20 hover:z-30'
              }`}
            >
              {c.name}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

const LoginFormSiswa = ({ onLogin, data, onBackToRoles, isFlipped }) => {
  const [classId, setClassId] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [pin, setPin] = useState('');
  const [selectedSiswa, setSelectedSiswa] = useState(null);
  const showToast = useToast();

  useEffect(() => {
    if (!isFlipped) {
      const timer = setTimeout(() => {
        setClassId('');
        setSelectedSiswa(null);
        setNameInput('');
        setPin('');
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isFlipped]);

  const rawClasses = (data.classes && data.classes.length > 0) ? data.classes : DEFAULT_CLASSES;
  const validClasses = rawClasses.filter(
    (c) => c && c.name && !c.name.startsWith('{')
  );
  const cleanClasses = validClasses.length > 0 ? validClasses : DEFAULT_CLASSES;
  const selectedClassObj = cleanClasses.find((c) => c.id === classId);

  const filteredSiswa = data.users
    .filter(
      (u) =>
        u.role === 'siswa' &&
        u.classId === classId &&
        u.name.toLowerCase().includes(nameInput.toLowerCase())
    )
    .slice(0, 6);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSiswa) return showToast('Pilih namamu dari daftar', 'error');
    if (selectedSiswa.pin !== pin) return showToast('PIN yang kamu masukkan salah', 'error');

    onLogin(selectedSiswa);
    showToast(`Halo, ${selectedSiswa.name}! Selamat belajar.`);
  };

  return (
    <div className="w-full my-auto">
      {/* If no class selected yet: Show Futuristic Circular Radial Selector */}
      {!classId ? (
        <CircularClassSelector
          classes={cleanClasses}
          onSelectClass={(chosenClassId) => {
            setClassId(chosenClassId);
            setSelectedSiswa(null);
            setNameInput('');
            setPin('');
          }}
          onCloseAndGoBack={onBackToRoles}
        />
      ) : (
        /* If class selected: Show Selected Class Header + Name & PIN fields */
        <motion.form
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springBounce}
          onSubmit={handleSubmit}
          className="space-y-4 w-full"
        >
          {/* Selected Class Chip with Change Button */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white font-black text-sm shadow-md">
                {selectedClassObj?.name}
              </div>
              <div>
                <p className="text-xs font-black text-white leading-tight">
                  Kelas {selectedClassObj?.name}
                </p>
                <p className="text-[10px] text-purple-200/80">Kelas Terpilih</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setClassId('');
                setSelectedSiswa(null);
                setNameInput('');
                setPin('');
              }}
              className="text-xs font-bold text-purple-200 hover:text-white px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/15 cursor-pointer"
            >
              Ganti Kelas
            </button>
          </div>

          {/* Name Input & Autocomplete */}
          {!selectedSiswa && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-purple-200/90 block">
                Ketik Namamu
              </label>
              <input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Contoh: Andi"
                autoComplete="off"
                className="w-full px-4 py-3.5 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white/20 text-sm font-medium shadow-inner transition-all"
              />
              {nameInput.length >= 1 && (
                <div className="bg-slate-950/95 border border-white/20 rounded-2xl overflow-hidden shadow-2xl divide-y divide-white/10 max-h-48 overflow-y-auto backdrop-blur-2xl">
                  {filteredSiswa.length > 0 ? (
                    filteredSiswa.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setSelectedSiswa(s);
                          setNameInput(s.name);
                        }}
                        className="w-full flex items-center gap-3 text-left px-4 py-3 hover:bg-white/10 transition-colors text-white cursor-pointer"
                      >
                        <Avatar name={s.name} photo={s.photo} size={36} />
                        <span className="font-bold text-white text-sm">{s.name}</span>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-xs font-semibold text-slate-400 text-center">
                      Nama tidak ditemukan di kelas ini
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* Selected Siswa & PIN Field */}
          {selectedSiswa && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
              <div className="p-3.5 bg-white/15 backdrop-blur-md rounded-2xl border border-white/25 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={selectedSiswa.name} photo={selectedSiswa.photo} size={42} />
                  <div>
                    <p className="font-extrabold text-white text-sm">{selectedSiswa.name}</p>
                    <p className="text-[11px] text-purple-300 font-semibold">Siswa Terpilih</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSiswa(null);
                    setNameInput('');
                    setPin('');
                  }}
                  className="text-xs font-bold text-purple-200 hover:text-white px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors border border-white/15 cursor-pointer"
                >
                  Ganti
                </button>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-purple-200/90 block mb-1.5">
                  PIN (4 Digit Angka)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    maxLength={4}
                    required
                    placeholder="••••"
                    autoComplete="off"
                    className="w-full text-center text-2xl tracking-[0.6em] font-black px-4 py-3 rounded-2xl border border-white/25 bg-white/15 backdrop-blur-md text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-inner"
                  />
                  <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300 pointer-events-none" />
                </div>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.96 }}
                transition={springBounce}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-black text-sm shadow-[0_8px_25px_rgba(139,92,246,0.4)] border border-white/20 mt-3 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Masuk Sekarang</span>
                <ArrowRight size={16} />
              </motion.button>
            </motion.div>
          )}
        </motion.form>
      )}
    </div>
  );
};
