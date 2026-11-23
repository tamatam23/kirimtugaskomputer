import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Gamepad2,
  ExternalLink,
  Play,
  FileText,
  FileSpreadsheet,
  File,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import {
  getDirectImageUrl,
  getDriveDownloadUrl,
  getDriveId,
  getScratchProjectId,
  getScratchEmbedUrl,
  getTurboWarpEmbedUrl,
  isScratchProject,
} from '../../utils/helpers';
import { springBounce } from '../../utils/motion';

export const Lightbox = ({
  item,
  items = [],
  currentIndex = 0,
  onNavigate,
  isKelas6 = false,
  isScratch = false,
  onClose,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
  totalItems,
  onDelete,
}) => {
  const { data } = useData();
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [playerMode, setPlayerMode] = useState('turbowarp'); // 'turbowarp' or 'scratch'
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);
  const [direction, setDirection] = useState(0);

  // Responsive window tracking for precise 3D card deck overlapping
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Compute offset from center axis so side cards peek out symmetrically with enlarged card sizes
  const getSideOffset = () => {
    if (windowWidth >= 1536) return 540;
    if (windowWidth >= 1280) return 460;
    if (windowWidth >= 1024) return 380;
    if (windowWidth >= 768) return 300;
    return 190;
  };
  const sideOffset = getSideOffset();

  // Compute active item and side items (prev & next) for the 3-card coverflow
  const activeIndex =
    currentIndex !== undefined && currentIndex >= 0
      ? currentIndex
      : items.findIndex((s) => s.id === item?.id);
  const current = (items.length > 0 && activeIndex >= 0 ? items[activeIndex] : item) || item;
  const prevItem = items.length > 0 && activeIndex > 0 ? items[activeIndex - 1] : null;
  const nextItem = items.length > 0 && activeIndex < items.length - 1 ? items[activeIndex + 1] : null;

  const centerCardRef = useRef(null);
  const isFirstMount = useRef(true);

  // GSAP 3D Slide-Flip Tween on Card Switch
  useEffect(() => {
    if (!centerCardRef.current) return;
    if (isFirstMount.current) {
      isFirstMount.current = false;
      gsap.fromTo(
        centerCardRef.current,
        { scale: 0.94, opacity: 0, y: 15 },
        { scale: 1, opacity: 1, y: 0, duration: 0.38, ease: 'power2.out', force3D: true }
      );
      return;
    }

    if (direction === 0) return;

    // Cinematic GSAP 3D Flip & Slide into Center Stage (Ultra-Smooth, Zero Bounce, Zero Ghosting)
    gsap.fromTo(
      centerCardRef.current,
      {
        x: direction > 0 ? (sideOffset * 0.92) : -(sideOffset * 0.92),
        rotationY: direction > 0 ? -18 : 18,
        rotationZ: direction > 0 ? 7 : -7,
        scale: 0.91,
        opacity: 0.65,
        transformPerspective: 1200,
        transformOrigin: 'center center',
      },
      {
        x: 0,
        rotationY: 0,
        rotationZ: 0,
        scale: 1,
        opacity: 1,
        duration: 0.52,
        ease: 'power3.out',
        force3D: true,
        clearProps: 'transformPerspective,transformOrigin',
      }
    );
  }, [item?.id, direction, sideOffset]);

  // Helper renderer for stacked side preview cards (left & right 3D deck like Microsoft Edge)
  const renderSideCard = (subItem, type) => {
    if (!subItem) return null;
    const isLeft = type === 'prev';
    const student = subItem.student || data?.users?.find((u) => u.id === subItem.studentId);
    const studentName = student?.name || 'Siswa';
    const isScratchSub = isScratchProject(subItem, data?.projects, data?.classes, data?.users);
    const sExt = (subItem.fileExt || '').toLowerCase();
    const sData = subItem.fileData || '';
    const isPdfSub =
      sExt === 'pdf' ||
      sData.startsWith('data:application/pdf') ||
      (typeof sData === 'string' && sData.includes('.pdf'));
    const isOfficeSub = ['ppt', 'pptx', 'xls', 'xlsx', 'doc', 'docx'].includes(sExt);
    const imgUrl = getDirectImageUrl(sData);

    return (
      <div
        key={`side-wrap-${type}-${subItem.id}`}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none flex items-center justify-center"
        style={{ width: 0, height: 0, transformStyle: 'preserve-3d' }}
      >
        <motion.div
          key={`side-${type}-${subItem.id}`}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{
            x: isLeft ? -sideOffset : sideOffset,
            y: 0,
            scale: 0.92,
            rotateZ: isLeft ? -7 : 7,
            rotateY: isLeft ? 14 : -14,
            opacity: zoomLevel > 1 ? 0.05 : 0.88,
          }}
          whileHover={{
            x: isLeft ? -(sideOffset + 18) : (sideOffset + 18),
            scale: 0.96,
            rotateZ: isLeft ? -3 : 3,
            rotateY: isLeft ? 5 : -5,
            opacity: 1,
            boxShadow: '0 25px 60px rgba(168, 85, 247, 0.45)',
          }}
          whileTap={{ scale: 0.88 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => {
            e.stopPropagation();
            if (isLeft) {
              setDirection(-1);
              if (onNavigate) onNavigate(activeIndex - 1);
              else if (onPrev) onPrev();
            } else {
              setDirection(1);
              if (onNavigate) onNavigate(activeIndex + 1);
              else if (onNext) onNext();
            }
          }}
          className="cursor-pointer select-none pointer-events-auto flex flex-col items-center justify-center shrink-0"
          style={{ transformStyle: 'preserve-3d' }}
          title={`Klik untuk buka karya: ${subItem.title}`}
        >
          <div className="relative rounded-[2.25rem] overflow-hidden border-2 border-white/20 bg-[#0E1222] shadow-[0_25px_60px_rgba(0,0,0,0.85)] w-60 sm:w-72 md:w-[340px] lg:w-[400px] xl:w-[450px] 2xl:w-[500px] h-[72vh] sm:h-[78vh] max-h-[840px] flex flex-col group hover:border-purple-400/90 transition-all">
            {/* Top Badge: "← Sebelumnya" or "Berikutnya →" */}
            <div className="p-3 pb-2 flex items-center justify-between z-20 shrink-0 bg-[#12162A] border-b border-white/5">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 border border-purple-400/40 text-purple-200 text-[11px] font-black shadow-lg backdrop-blur-md group-hover:bg-purple-600 group-hover:text-white transition-colors">
                {isLeft ? <ChevronLeft size={13} /> : null}
                <span>{isLeft ? 'Sebelumnya' : 'Berikutnya'}</span>
                {!isLeft ? <ChevronRight size={13} /> : null}
              </div>
              <span className="text-[10px] font-bold text-slate-400 truncate max-w-[100px]">
                {isLeft ? activeIndex : activeIndex + 2} / {totalItems}
              </span>
            </div>

            {/* Media Preview Area */}
            <div className="flex-1 w-full p-2.5 relative flex items-center justify-center overflow-hidden bg-[#070913] rounded-2xl m-2.5 mt-2.5">
              {isScratchSub ? (
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-purple-600 flex flex-col items-center justify-center p-3 text-center text-white">
                  <Gamepad2 size={40} className="text-white mb-2 drop-shadow-md" />
                  <span className="text-xs font-black line-clamp-1">{subItem.title}</span>
                  <span className="text-[10px] font-bold text-amber-200 mt-1 bg-black/30 px-2 py-0.5 rounded-full">
                    Game Scratch
                  </span>
                </div>
              ) : isPdfSub ? (
                <div className="w-full h-full relative rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center">
                  <img
                    src={imgUrl}
                    alt={subItem.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center gap-1 shadow-md">
                    <FileText size={10} /> PDF
                  </div>
                </div>
              ) : isOfficeSub ? (
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex flex-col items-center justify-center p-3 text-center text-white">
                  <FileText size={40} className="text-white mb-2 drop-shadow-md" />
                  <span className="text-xs font-black line-clamp-1">{subItem.title}</span>
                  <span className="text-[10px] font-bold text-blue-200 mt-1 bg-black/30 px-2 py-0.5 rounded-full uppercase">
                    {sExt || 'DOC'}
                  </span>
                </div>
              ) : (
                <img
                  src={imgUrl}
                  alt={subItem.title}
                  className="w-full h-full object-contain drop-shadow-lg rounded-xl"
                  onError={(e) => {
                    const dId = getDriveId(sData);
                    if (dId && e.target.src.includes('thumbnail')) {
                      e.target.src = `https://lh3.googleusercontent.com/d/${dId}=w800`;
                    } else {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/400x300/1e293b/94a3b8?text=Karya';
                    }
                  }}
                />
              )}
            </div>

            {/* Bottom Card Title & Student Name */}
            <div className="p-3 pt-2 bg-[#0A0D1A] border-t border-white/5 flex flex-col items-center text-center shrink-0">
              <p className="text-white text-xs sm:text-sm font-black truncate w-full">{subItem.title}</p>
              <p className="text-amber-200 text-xs font-handwriting font-bold truncate w-full">{studentName}</p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  // Reset zoom & pan whenever the displayed item changes (switching next/prev)
  useEffect(() => {
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  }, [item?.id]);

  // Lock body scroll and register keyboard listener (Escape, ArrowLeft, ArrowRight)
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalOverscroll = document.body.style.overscrollBehavior;
    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        if (hasPrev && onPrev) {
          setDirection(-1);
          onPrev();
        }
      } else if (e.key === 'ArrowRight') {
        if (hasNext && onNext) {
          setDirection(1);
          onNext();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.overscrollBehavior = originalOverscroll;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  if (!item || typeof document === 'undefined') return null;

  const fileData = item.fileData || '';
  const fileExt = (item.fileExt || '').toLowerCase();
  const fileName = item.fileName || '';
  const title = (item.title || '').toLowerCase();

  // 1. Detect whether this submission is a Scratch game
  const isGameScratch =
    isScratch ||
    isKelas6 ||
    isScratchProject(item, data?.projects, data?.classes, data?.users);

  // 2. Detect PDF
  const isPdf =
    fileExt === 'pdf' ||
    (typeof fileData === 'string' && (
      fileData.startsWith('data:application/pdf') ||
      fileData.toLowerCase().includes('.pdf') ||
      fileName.toLowerCase().endsWith('.pdf') ||
      title.endsWith('.pdf')
    ));

  // 3. Detect Office Document (Word, Excel, PowerPoint)
  const isOffice =
    ['ppt', 'pptx', 'xls', 'xlsx', 'doc', 'docx'].includes(fileExt) ||
    (typeof fileData === 'string' && (
      fileData.startsWith('data:application/vnd') ||
      fileData.startsWith('data:application/msword') ||
      /\.(pptx?|xlsx?|docx?)$/i.test(fileName || title)
    ));

  const scratchId = getScratchProjectId(fileData);
  const driveId = getDriveId(fileData);
  const directSb3Url = getDriveDownloadUrl(fileData);

  const scratchEmbedUrl = scratchId ? getScratchEmbedUrl(scratchId) : '';
  const turboWarpEmbedUrl = scratchId ? getTurboWarpEmbedUrl(scratchId) : '';
  const localPlayerUrl = `/scratch-player.html${driveId ? `?id=${encodeURIComponent(driveId)}` : ''}`;
  const turboWarpEditorUrl = 'https://turbowarp.org/editor';

  // Google Drive URLs
  const drivePreviewUrl = driveId ? `https://drive.google.com/file/d/${driveId}/preview` : '';
  const driveDirectViewUrl = driveId ? `https://drive.google.com/file/d/${driveId}/view?usp=sharing` : '';
  const driveDirectDownloadUrl = driveId ? `https://drive.usercontent.google.com/download?id=${driveId}&export=download` : '';

  // Direct Image URL
  const imageUrl = getDirectImageUrl(fileData);

  // Helper to open base64 PDF in a new browser tab
  const handleOpenBase64InTab = () => {
    try {
      const arr = fileData.split(',');
      const mime = arr[0].match(/:(.*?);/)?.[1] || 'application/pdf';
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const blob = new Blob([u8arr], { type: mime });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch {
      window.open(fileData, '_blank');
    }
  };

  // Helper to download base64 file
  const handleDownloadBase64 = () => {
    try {
      const a = document.createElement('a');
      a.href = fileData;
      a.download = fileName || `${item.title || 'dokumen'}.${fileExt || 'pdf'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
    }
  };

  return createPortal(
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[9999999] bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-center select-none overflow-hidden"
        style={{ width: '100vw', height: '100dvh', margin: 0, padding: 0 }}
        onTouchStart={(e) => {
          setTouchStartX(e.touches[0].clientX);
          setTouchStartY(e.touches[0].clientY);
        }}
        onTouchEnd={(e) => {
          if (touchStartX === null || touchStartY === null) return;
          const diffX = touchStartX - e.changedTouches[0].clientX;
          const diffY = touchStartY - e.changedTouches[0].clientY;
          if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
            if (diffX > 0 && hasNext && onNext) {
              setDirection(1);
              onNext();
            } else if (diffX < 0 && hasPrev && onPrev) {
              setDirection(-1);
              onPrev();
            }
          }
          setTouchStartX(null);
          setTouchStartY(null);
        }}
      >
        {/* Floating Left Arrow (Previous Project) */}
        {hasPrev && onPrev && (
          <motion.button
            whileHover={{ scale: 1.15, x: -3, boxShadow: '0 0 25px rgba(168, 85, 247, 0.65)' }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => {
              e.stopPropagation();
              setDirection(-1);
              if (onNavigate && activeIndex > 0) onNavigate(activeIndex - 1);
              else onPrev();
            }}
            className="fixed left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-[10000000] p-3 sm:p-4 rounded-full bg-slate-900/90 hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 text-white backdrop-blur-2xl border border-white/25 shadow-[0_10px_35px_rgba(0,0,0,0.7)] transition-all cursor-pointer group"
            title="Project Sebelumnya (Panah Kiri ←)"
          >
            <ChevronLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
          </motion.button>
        )}

        {/* Floating Right Arrow (Next Project) */}
        {hasNext && onNext && (
          <motion.button
            whileHover={{ scale: 1.15, x: 3, boxShadow: '0 0 25px rgba(168, 85, 247, 0.65)' }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => {
              e.stopPropagation();
              setDirection(1);
              if (onNavigate && activeIndex < totalItems - 1) onNavigate(activeIndex + 1);
              else onNext();
            }}
            className="fixed right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-[10000000] p-3 sm:p-4 rounded-full bg-slate-900/90 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 text-white backdrop-blur-2xl border border-white/25 shadow-[0_10px_35px_rgba(0,0,0,0.7)] transition-all cursor-pointer group"
            title="Project Berikutnya (Panah Kanan →)"
          >
            <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        )}

        {/* Top Controls */}
        <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex justify-between items-center z-50 pointer-events-none">
          {/* Zoom controls ONLY for Images (not for Scratch, PDF, or Office documents) */}
          {!isGameScratch && !isPdf && !isOffice && (
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 sm:gap-2 bg-slate-900/90 p-1.5 px-3 rounded-full border border-slate-700/60 backdrop-blur-xl shadow-2xl pointer-events-auto">
              <button
                onClick={() => setZoomLevel((prev) => Math.max(prev - 0.25, 0.5))}
                className="text-white hover:text-purple-400 hover:bg-slate-800 transition-all p-2 rounded-full cursor-pointer"
                title="Zoom Out (-)"
              >
                <ZoomOut size={18} />
              </button>
              <span className="text-white text-xs font-bold w-12 text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((prev) => Math.min(prev + 0.25, 5))}
                className="text-white hover:text-purple-400 hover:bg-slate-800 transition-all p-2 rounded-full cursor-pointer"
                title="Zoom In (+)"
              >
                <ZoomIn size={18} />
              </button>
              <div className="w-px h-5 bg-slate-700 mx-1"></div>
              <button
                onClick={() => {
                  setZoomLevel(1);
                  setPan({ x: 0, y: 0 });
                }}
                className="text-slate-300 hover:text-white hover:bg-slate-800 transition-all p-2 px-3 rounded-full text-xs font-bold flex items-center gap-1 cursor-pointer"
                title="Reset Ukuran"
              >
                <RotateCcw size={14} /> Reset
              </button>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={springBounce}
            onClick={onClose}
            className="text-white hover:text-rose-400 transition-colors p-3 bg-white/10 hover:bg-white/20 rounded-full ml-auto pointer-events-auto shadow-xl cursor-pointer"
            title="Tutup (Esc)"
          >
            <X size={24} />
          </motion.button>
        </div>

        {/* Content Body with 3D Carousel Stage */}
        <div
          className="w-full h-full flex items-center justify-center p-2 sm:p-4 pb-12 sm:pb-14 overflow-hidden relative"
          style={{ perspective: 1400 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          {/* Left Preview Card (Medium Size, 3D Coverflow) */}
          {prevItem && renderSideCard(prevItem, 'prev')}

          {/* Ambient Glow Aura */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
            <motion.div
              key={`glow-${item.id}`}
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 0.45, scale: 1 }}
              exit={{ opacity: 0, scale: 0.75 }}
              transition={{ duration: 0.5 }}
              className="w-[420px] h-[420px] sm:w-[580px] sm:h-[580px] rounded-full bg-gradient-to-tr from-purple-600/35 via-indigo-600/25 to-pink-500/25 blur-3xl pointer-events-none"
            />
          </div>

          {/* Center Card Container driven by GSAP 3D Engine */}
          <div
            ref={centerCardRef}
            key={`center-${item.id}`}
            className="flex items-center justify-center max-w-full max-h-full z-20 select-none"
            style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
          >
              {isGameScratch ? (
                /* 1. Interactive Scratch / TurboWarp Player Frame */
                <div className="w-full max-w-[95vw] sm:w-[560px] md:w-[680px] lg:w-[820px] xl:w-[940px] 2xl:w-[1040px] aspect-[4/3] sm:aspect-video max-h-[84vh] rounded-[2.25rem] bg-[#0E1222] border-2 border-white/25 shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col">
                  {/* Game Player Bar Header */}
                  <div className="bg-[#12162A] text-slate-200 text-xs py-3 px-4 sm:px-5 font-bold flex flex-wrap justify-between items-center gap-2 shrink-0 border-b border-slate-700/80">
                    <span className="flex items-center gap-2 min-w-0">
                      <Gamepad2 size={18} className="text-amber-400 shrink-0" />
                      <strong className="text-white text-xs sm:text-sm truncate">
                        {scratchId ? `Scratch Project #${scratchId}` : `Scratch Game — ${item.title}`}
                      </strong>
                      <span className="hidden sm:inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {scratchId ? 'Online Link' : '.sb3 File'}
                      </span>
                    </span>

                    <div className="flex items-center gap-2 ml-auto">
                      <span className="text-amber-200 text-xs sm:text-sm font-bold font-handwriting mr-1 hidden md:inline">
                        {item.student?.name || 'Siswa'}
                      </span>
                      {scratchId ? (
                        <>
                          {/* Player Switcher */}
                          <div className="flex items-center bg-slate-800 p-0.5 rounded-xl border border-slate-700">
                            <button
                              onClick={() => setPlayerMode('turbowarp')}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                playerMode === 'turbowarp'
                                  ? 'bg-purple-600 text-white shadow-sm'
                                  : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              TurboWarp
                            </button>
                            <button
                              onClick={() => setPlayerMode('scratch')}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                playerMode === 'scratch'
                                  ? 'bg-amber-600 text-white shadow-sm'
                                  : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              MIT
                            </button>
                          </div>

                          <a
                            href={`https://scratch.mit.edu/projects/${scratchId}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl font-bold transition-colors flex items-center gap-1.5 border border-slate-700 shadow-sm"
                            title="Buka Halaman Scratch MIT Resmi"
                          >
                            <ExternalLink size={13} />
                            <span className="hidden md:inline">Buka Web</span>
                          </a>
                        </>
                      ) : (
                        <>
                          <a
                            href={turboWarpEditorUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs bg-slate-800 hover:bg-slate-750 hover:text-white text-slate-300 px-3 py-1.5 rounded-xl font-bold transition-colors flex items-center gap-1.5 border border-slate-700/80 shadow-md"
                            title="Buka TurboWarp Web Editor di Tab Baru"
                          >
                            <ExternalLink size={13} />
                            <span className="hidden sm:inline">TurboWarp</span>
                          </a>
                          <a
                            href={directSb3Url || fileData}
                            target="_blank"
                            rel="noreferrer"
                            download={fileName || `${item.title}.sb3`}
                            className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
                            title="Download File .sb3"
                          >
                            <Download size={13} />
                            <span className="hidden sm:inline">Download</span>
                          </a>
                        </>
                      )}

                      {onDelete && (
                        <button
                          onClick={() => onDelete(current.id)}
                          className="bg-rose-600/80 hover:bg-rose-600 text-white p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1 transition-colors shadow-sm shrink-0 cursor-pointer"
                          title="Hapus Karya"
                        >
                          <Trash2 size={13} />
                          <span className="hidden sm:inline">Hapus</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Live Iframe Game Stage */}
                  <div className="flex-1 w-full relative bg-slate-950 flex items-center justify-center">
                    {scratchId ? (
                      <iframe
                        src={playerMode === 'turbowarp' ? turboWarpEmbedUrl : scratchEmbedUrl}
                        width="100%"
                        height="100%"
                        allow="autoplay; camera; microphone; fullscreen; gamepad"
                        frameBorder="0"
                        scrolling="no"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full border-0"
                      />
                    ) : (
                      <iframe
                        src={localPlayerUrl}
                        width="100%"
                        height="100%"
                        allow="autoplay; camera; microphone; fullscreen; gamepad"
                        frameBorder="0"
                        scrolling="no"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full border-0"
                        onLoad={(e) => {
                          if (fileData && fileData.startsWith('data:')) {
                            e.target.contentWindow?.postMessage(
                              {
                                type: 'load-base64',
                                base64: fileData,
                              },
                              '*'
                            );
                          }
                        }}
                      />
                    )}
                  </div>
                </div>
              ) : isPdf ? (
                /* 2. Fullscreen Responsive PDF Viewer */
                <div className="w-full max-w-[95vw] sm:w-[560px] md:w-[680px] lg:w-[820px] xl:w-[940px] 2xl:w-[1040px] h-[78vh] sm:h-[82vh] max-h-[880px] rounded-[2.25rem] bg-[#0E1222] border-2 border-white/25 shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col">
                  {/* PDF Header Bar */}
                  <div className="bg-[#12162A] text-slate-200 text-xs py-3 px-4 sm:px-5 font-bold flex flex-wrap justify-between items-center gap-2 shrink-0 border-b border-slate-700/80">
                    <span className="flex items-center gap-2 min-w-0">
                      <FileText size={18} className="text-rose-400 shrink-0" />
                      <strong className="text-white text-xs sm:text-sm truncate">
                        {fileName || item.title || 'Dokumen PDF'}
                      </strong>
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        PDF
                      </span>
                    </span>

                    <div className="flex items-center gap-2 ml-auto">
                      <span className="text-amber-200 text-xs sm:text-sm font-bold font-handwriting mr-1 hidden sm:inline">
                        {item.student?.name || 'Siswa'}
                      </span>
                      {driveId ? (
                        <>
                          <a
                            href={driveDirectViewUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl font-bold transition-colors flex items-center gap-1.5 border border-slate-700 shadow-sm"
                            title="Buka PDF di Tab Baru"
                          >
                            <ExternalLink size={13} />
                            <span className="hidden sm:inline">Buka Tab</span>
                          </a>
                          <a
                            href={driveDirectDownloadUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-rose-600 hover:bg-rose-500 text-white px-2.5 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
                            title="Download PDF"
                          >
                            <Download size={13} />
                            <span className="hidden sm:inline">Download</span>
                          </a>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={handleOpenBase64InTab}
                            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl font-bold transition-colors flex items-center gap-1.5 border border-slate-700 shadow-sm"
                            title="Buka PDF di Tab Baru"
                          >
                            <ExternalLink size={13} />
                            <span className="hidden sm:inline">Buka Tab</span>
                          </button>
                          <button
                            onClick={handleDownloadBase64}
                            className="bg-rose-600 hover:bg-rose-500 text-white px-2.5 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
                            title="Download PDF"
                          >
                            <Download size={13} />
                            <span className="hidden sm:inline">Download</span>
                          </button>
                        </>
                      )}

                      {onDelete && (
                        <button
                          onClick={() => onDelete(current.id)}
                          className="bg-rose-600/80 hover:bg-rose-600 text-white p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1 transition-colors shadow-sm shrink-0 cursor-pointer"
                          title="Hapus Karya Ini Secara Permanen"
                        >
                          <Trash2 size={13} />
                          <span className="hidden sm:inline">Hapus</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* PDF Frame */}
                  <div className="flex-1 w-full relative bg-slate-950 flex items-center justify-center">
                    <iframe
                      src={drivePreviewUrl || fileData}
                      title={item.title || 'PDF Preview'}
                      className="w-full h-full border-0"
                    />
                  </div>
                </div>
              ) : isOffice ? (
                /* 3. Office Document Viewer (Word, Excel, PowerPoint) */
                <div className="w-full max-w-[95vw] sm:w-[560px] md:w-[680px] lg:w-[820px] xl:w-[940px] 2xl:w-[1040px] h-[78vh] sm:h-[82vh] max-h-[880px] rounded-[2.25rem] bg-[#0E1222] border-2 border-white/25 shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col">
                  <div className="bg-[#12162A] text-slate-200 text-xs py-3 px-4 sm:px-5 font-bold flex flex-wrap justify-between items-center gap-2 shrink-0 border-b border-slate-700/80">
                    <span className="flex items-center gap-2 min-w-0">
                      <FileText size={18} className="text-blue-400 shrink-0" />
                      <strong className="text-white text-xs sm:text-sm truncate">
                        {fileName || item.title || 'Dokumen Office'}
                      </strong>
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase">
                        {fileExt || 'DOC'}
                      </span>
                    </span>
                    <div className="flex items-center gap-2 ml-auto">
                      <span className="text-amber-200 text-xs sm:text-sm font-bold font-handwriting mr-1 hidden sm:inline">
                        {item.student?.name || 'Siswa'}
                      </span>
                      {driveId ? (
                        <a
                          href={driveDirectViewUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl font-bold transition-colors flex items-center gap-1.5 border border-slate-700 shadow-sm"
                        >
                          <ExternalLink size={13} />
                          <span className="hidden sm:inline">Buka Drive</span>
                        </a>
                      ) : null}

                      {onDelete && (
                        <button
                          onClick={() => onDelete(current.id)}
                          className="bg-rose-600/80 hover:bg-rose-600 text-white p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1 transition-colors shadow-sm shrink-0 cursor-pointer"
                          title="Hapus Karya Ini Secara Permanen"
                        >
                          <Trash2 size={13} />
                          <span className="hidden sm:inline">Hapus</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 w-full relative bg-slate-950 flex items-center justify-center p-6">
                    {drivePreviewUrl ? (
                      <iframe
                        src={drivePreviewUrl}
                        title={item.title || 'Dokumen'}
                        className="w-full h-full border-0"
                      />
                    ) : (
                      <div className="bg-slate-900/90 border border-slate-700 p-8 rounded-3xl max-w-md w-full text-center space-y-4 shadow-2xl">
                        <div className="w-20 h-20 bg-blue-500/20 text-blue-400 rounded-3xl mx-auto flex items-center justify-center border border-blue-500/30">
                          <FileText size={40} />
                        </div>
                        <div>
                          <h3 className="text-lg font-extrabold text-white">{fileName || item.title}</h3>
                          <p className="text-xs text-slate-400 mt-1">
                            Dokumen {fileExt.toUpperCase()} ({item.student?.name || 'Siswa'})
                          </p>
                        </div>
                        <button
                          onClick={handleDownloadBase64}
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-xs py-3 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] transition-all"
                        >
                          <Download size={16} /> Download File Dokumen
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* 4. Interactive Image Viewer with Pan & Zoom inside 3D Card Deck */
                <div className="w-[94vw] sm:w-[560px] md:w-[680px] lg:w-[820px] xl:w-[940px] 2xl:w-[1040px] max-w-[95vw] h-[78vh] sm:h-[82vh] max-h-[880px] rounded-[2.25rem] bg-[#0E1222] border-2 border-white/25 shadow-[0_30px_90px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden">
                  {/* Card Header Bar */}
                  <div className="px-4 sm:px-6 py-3 sm:py-3.5 border-b border-slate-700/80 bg-[#12162A] flex items-center justify-between gap-2 sm:gap-4 shrink-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-[11px] font-black shrink-0">
                        🎨 Karya Gambar
                      </span>
                      <strong className="text-white text-xs sm:text-sm font-extrabold truncate">
                        {item.title}
                      </strong>
                    </div>

                    <div className="flex items-center gap-2 text-right shrink-0">
                      <span className="text-amber-200 text-xs sm:text-sm font-bold font-handwriting hidden sm:inline">
                        {item.student?.name || 'Siswa'}
                      </span>
                      {totalItems > 1 && currentIndex !== undefined && (
                        <span className="text-slate-400 text-[10px] bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                          {currentIndex + 1} / {totalItems}
                        </span>
                      )}

                      {/* Download Button */}
                      {fileData && (
                        driveId ? (
                          <a
                            href={driveDirectDownloadUrl || fileData}
                            target="_blank"
                            rel="noreferrer"
                            download
                            className="bg-purple-600/90 hover:bg-purple-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
                            title="Buka / Download File"
                          >
                            <Download size={13} />
                            <span className="hidden md:inline">Download</span>
                          </a>
                        ) : (
                          <button
                            onClick={handleDownloadBase64}
                            className="bg-purple-600/90 hover:bg-purple-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-sm shrink-0 cursor-pointer"
                            title="Download File"
                          >
                            <Download size={13} />
                            <span className="hidden md:inline">Download</span>
                          </button>
                        )
                      )}

                      {/* Delete Button (Teacher / Admin) */}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(current.id)}
                          className="bg-rose-600/80 hover:bg-rose-600 text-white p-1 sm:px-2.5 sm:py-1 rounded-lg text-xs font-bold inline-flex items-center gap-1 transition-colors shadow-sm shrink-0 cursor-pointer"
                          title="Hapus Karya Ini Secara Permanen"
                        >
                          <Trash2 size={13} />
                          <span className="hidden md:inline">Hapus</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Card Media Stage */}
                  <div
                    className="flex-1 w-full relative flex items-center justify-center p-3 sm:p-5 bg-[#070913] overflow-hidden cursor-grab active:cursor-grabbing"
                    onWheel={(e) => {
                      if (e.deltaY < 0) setZoomLevel((prev) => Math.min(prev + 0.15, 5));
                      else setZoomLevel((prev) => Math.max(prev - 0.15, 0.5));
                    }}
                    onMouseDown={(e) => {
                      if (zoomLevel > 1) {
                        e.preventDefault();
                        setIsDragging(true);
                        setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
                      }
                    }}
                    onMouseMove={(e) => {
                      if (isDragging && zoomLevel > 1) {
                        e.preventDefault();
                        setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
                      }
                    }}
                    onMouseUp={() => setIsDragging(false)}
                    onMouseLeave={() => setIsDragging(false)}
                  >
                    <img
                      src={imageUrl}
                      alt={item.title}
                      draggable="false"
                      referrerPolicy="no-referrer"
                      className="max-w-full max-h-[68vh] sm:max-h-[72vh] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.7)] rounded-xl select-none"
                      style={{
                        transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`,
                        transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                      }}
                      onError={(e) => {
                        const dId = getDriveId(item.fileData);
                        if (dId && e.target.src.includes('thumbnail')) {
                          e.target.src = `https://lh3.googleusercontent.com/d/${dId}=w1200`;
                        } else if (dId && e.target.src.includes('lh3.googleusercontent.com')) {
                          e.target.src = `https://lh3.googleusercontent.com/d/${dId}=s1200`;
                        } else {
                          e.target.onerror = null;
                          e.target.src = 'https://placehold.co/800x600/1e293b/94a3b8?text=Karya+Siswa';
                        }
                      }}
                    />
                  </div>
                </div>
              )}
          </div>

          {/* Right Preview Card (Medium Size, 3D Coverflow) */}
          {nextItem && renderSideCard(nextItem, 'next')}
        </div>

        {/* Carousel Quick Indicator Dots */}
        {totalItems > 1 && (
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 p-1.5 px-3 rounded-full bg-slate-900/85 border border-slate-700/60 backdrop-blur-xl shadow-2xl pointer-events-auto">
            {Array.from({ length: Math.min(totalItems, 12) }).map((_, idx) => {
              const isActive =
                totalItems <= 12
                  ? idx === currentIndex
                  : idx === Math.round((currentIndex / (totalItems - 1)) * 11);
              return (
                <motion.span
                  key={idx}
                  animate={{
                    width: isActive ? 22 : 6,
                    backgroundColor: isActive ? '#a855f7' : 'rgba(148, 163, 184, 0.35)',
                  }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className="h-1.5 rounded-full inline-block"
                />
              );
            })}
          </div>
        )}
      </div>
    </AnimatePresence>,
    document.body
  );
};
