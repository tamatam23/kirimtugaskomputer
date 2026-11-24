import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  FileText,
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
  const [isDraggingPan, setIsDraggingPan] = useState(false);
  const [panDragStart, setPanDragStart] = useState({ x: 0, y: 0 });
  const [playerMode, setPlayerMode] = useState('turbowarp'); // 'turbowarp' or 'scratch'

  // Items list normalization
  const itemsList = useMemo(() => {
    if (items && items.length > 0) return items;
    return item ? [item] : [];
  }, [items, item]);

  const totalCount = totalItems || itemsList.length;

  // Active item tracking
  const initialIndex = useMemo(() => {
    if (currentIndex !== undefined && currentIndex >= 0) return currentIndex;
    const found = itemsList.findIndex((it) => it?.id === item?.id);
    return found >= 0 ? found : 0;
  }, [currentIndex, itemsList, item?.id]);

  const [activeIndex, setActiveIndex] = useState(initialIndex);

  useEffect(() => {
    if (currentIndex !== undefined && currentIndex >= 0 && currentIndex !== activeIndex) {
      setActiveIndex(currentIndex);
    }
  }, [currentIndex]);

  const currentItem = itemsList[activeIndex] || item || itemsList[0] || {};

  // For the infinite loop to run smoothly without visual gaps or DOM reuse collision,
  // we ensure the displayItems array contains at least 10 items.
  const displayItems = useMemo(() => {
    if (itemsList.length <= 1) return itemsList.map((it, idx) => ({ ...it, originalIndex: idx }));
    let list = itemsList.map((it, idx) => ({ ...it, originalIndex: idx }));
    while (list.length < 10) {
      list = list.concat(itemsList.map((it, idx) => ({ ...it, originalIndex: idx })));
    }
    return list;
  }, [itemsList]);

  // GSAP Seamless Loop references
  const cardsRef = useRef([]);
  const playhead = useRef({ offset: 0 });
  const seamlessLoopRef = useRef(null);
  const wrapTimeRef = useRef(null);
  const spacing = 0.1;
  const snapTime = useMemo(() => gsap.utils.snap(spacing), [spacing]);

  // Pointer drag state for smooth scrubbing
  const isDraggingCarousel = useRef(false);
  const dragStartX = useRef(0);
  const dragStartOffset = useRef(0);

  // Helper function to animate playhead to a target offset smoothly
  const scrollToOffset = (targetOffset) => {
    if (!seamlessLoopRef.current || !wrapTimeRef.current) return;
    const snapped = snapTime(targetOffset);
    gsap.killTweensOf(playhead.current);

    gsap.to(playhead.current, {
      offset: snapped,
      duration: 0.8,
      ease: 'power3.out',
      overwrite: 'auto',
      onUpdate() {
        if (seamlessLoopRef.current && wrapTimeRef.current) {
          seamlessLoopRef.current.time(wrapTimeRef.current(playhead.current.offset));
        }
      },
      onComplete() {
        const newActiveIdx = gsap.utils.wrap(
          0,
          itemsList.length,
          Math.round(playhead.current.offset / spacing)
        );
        setActiveIndex(newActiveIdx);
        if (onNavigate) onNavigate(newActiveIdx);
      },
    });
  };

  const handleNextSlide = () => {
    if (itemsList.length <= 1) return;
    scrollToOffset(playhead.current.offset + spacing);
  };

  const handlePrevSlide = () => {
    if (itemsList.length <= 1) return;
    scrollToOffset(playhead.current.offset - spacing);
  };

  // Build the GSAP Seamless Loop
  useEffect(() => {
    if (displayItems.length <= 1) return;
    const cardEls = cardsRef.current.filter(Boolean);
    if (cardEls.length === 0) return;

    if (seamlessLoopRef.current) {
      seamlessLoopRef.current.kill();
    }

    const animateFunc = (element) => {
      const tl = gsap.timeline();
      tl.fromTo(
        element,
        { scale: 0.62, opacity: 0.35, zIndex: 10 },
        { scale: 1.08, opacity: 1, zIndex: 100, duration: 0.5, yoyo: true, repeat: 1, ease: 'power2.in', immediateRender: false }
      ).fromTo(
        element,
        { xPercent: 320, rotateY: -26, rotateZ: 4 },
        { xPercent: -320, rotateY: 26, rotateZ: -4, duration: 1, ease: 'none', immediateRender: false },
        0
      );
      return tl;
    };

    const overlap = Math.ceil(1 / spacing);
    const startTime = cardEls.length * spacing + 0.5;
    const loopTime = (cardEls.length + overlap) * spacing + 1;
    const rawSequence = gsap.timeline({ paused: true });
    const seamlessLoop = gsap.timeline({
      paused: true,
      repeat: -1,
      onRepeat() {
        this._time === this._dur && (this._tTime += this._dur - 0.01);
      },
    });
    const l = cardEls.length + overlap * 2;

    for (let i = 0; i < l; i++) {
      const index = i % cardEls.length;
      const time = i * spacing;
      rawSequence.add(animateFunc(cardEls[index]), time);
    }

    rawSequence.time(startTime);
    seamlessLoop
      .to(rawSequence, {
        time: loopTime,
        duration: loopTime - startTime,
        ease: 'none',
      })
      .fromTo(
        rawSequence,
        { time: overlap * spacing + 1 },
        {
          time: startTime,
          duration: startTime - (overlap * spacing + 1),
          immediateRender: false,
          ease: 'none',
        }
      );

    seamlessLoopRef.current = seamlessLoop;
    const wrapTime = gsap.utils.wrap(0, seamlessLoop.duration());
    wrapTimeRef.current = wrapTime;

    // Start with the initial active card at center
    const initialOffset = initialIndex * spacing;
    playhead.current.offset = initialOffset;
    seamlessLoop.time(wrapTime(initialOffset));

    return () => {
      seamlessLoop.kill();
    };
  }, [displayItems.length, initialIndex]);

  // Handle pointer / touch dragging for carousel
  const handlePointerDown = (e) => {
    if (zoomLevel > 1) return; // If zoomed in, let pan handler handle it
    isDraggingCarousel.current = true;
    dragStartX.current = e.clientX ?? (e.touches && e.touches[0].clientX) ?? 0;
    dragStartOffset.current = playhead.current.offset;
    gsap.killTweensOf(playhead.current);
  };

  const handlePointerMove = (e) => {
    if (!isDraggingCarousel.current) return;
    const clientX = e.clientX ?? (e.touches && e.touches[0].clientX) ?? 0;
    const deltaX = dragStartX.current - clientX;
    playhead.current.offset = dragStartOffset.current + deltaX * 0.0012;
    if (seamlessLoopRef.current && wrapTimeRef.current) {
      seamlessLoopRef.current.time(wrapTimeRef.current(playhead.current.offset));
    }
  };

  const handlePointerUp = () => {
    if (!isDraggingCarousel.current) return;
    isDraggingCarousel.current = false;
    scrollToOffset(playhead.current.offset);
  };

  // Clicking any card directly brings it to center
  const handleCardClick = (targetOriginalIndex) => {
    if (targetOriginalIndex === activeIndex) return;
    const currentOffset = playhead.current.offset;
    const currentCenterIdx = gsap.utils.wrap(
      0,
      itemsList.length,
      Math.round(currentOffset / spacing)
    );
    let diff = targetOriginalIndex - currentCenterIdx;
    if (diff > itemsList.length / 2) diff -= itemsList.length;
    if (diff < -itemsList.length / 2) diff += itemsList.length;
    scrollToOffset(currentOffset + diff * spacing);
  };

  // Keyboard navigation & lock body scroll
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalOverscroll = document.body.style.overscrollBehavior;
    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrevSlide();
      } else if (e.key === 'ArrowRight') {
        handleNextSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.overscrollBehavior = originalOverscroll;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, itemsList.length]);

  // Reset zoom & pan when active item changes
  useEffect(() => {
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  }, [currentItem?.id]);

  if (!currentItem || typeof document === 'undefined') return null;

  // Active Item Helper Properties
  const activeFileData = currentItem.fileData || '';
  const activeFileExt = (currentItem.fileExt || '').toLowerCase();
  const activeFileName = currentItem.fileName || '';
  const activeTitle = (currentItem.title || '').toLowerCase();

  const isActiveScratch =
    isScratch ||
    isKelas6 ||
    isScratchProject(currentItem, data?.projects, data?.classes, data?.users);

  const isActivePdf =
    activeFileExt === 'pdf' ||
    (typeof activeFileData === 'string' && (
      activeFileData.startsWith('data:application/pdf') ||
      activeFileData.toLowerCase().includes('.pdf') ||
      activeFileName.toLowerCase().endsWith('.pdf') ||
      activeTitle.endsWith('.pdf')
    ));

  const isActiveOffice =
    ['ppt', 'pptx', 'xls', 'xlsx', 'doc', 'docx'].includes(activeFileExt) ||
    (typeof activeFileData === 'string' && (
      activeFileData.startsWith('data:application/vnd') ||
      activeFileData.startsWith('data:application/msword') ||
      /\.(pptx?|xlsx?|docx?)$/i.test(activeFileName || activeTitle)
    ));

  const activeScratchId = getScratchProjectId(activeFileData);
  const activeDriveId = getDriveId(activeFileData);
  const activeDirectSb3Url = getDriveDownloadUrl(activeFileData);
  const activeScratchEmbedUrl = activeScratchId ? getScratchEmbedUrl(activeScratchId) : '';
  const activeTurboWarpEmbedUrl = activeScratchId ? getTurboWarpEmbedUrl(activeScratchId) : '';
  const activeLocalPlayerUrl = `/scratch-player.html${activeDriveId ? `?id=${encodeURIComponent(activeDriveId)}` : ''}`;
  const turboWarpEditorUrl = 'https://turbowarp.org/editor';

  const activeDrivePreviewUrl = activeDriveId ? `https://drive.google.com/file/d/${activeDriveId}/preview` : '';
  const activeDriveDirectViewUrl = activeDriveId ? `https://drive.google.com/file/d/${activeDriveId}/view?usp=sharing` : '';
  const activeDriveDirectDownloadUrl = activeDriveId ? `https://drive.usercontent.google.com/download?id=${activeDriveId}&export=download` : '';

  const handleDownloadBase64 = (targetItem) => {
    try {
      const target = targetItem || currentItem;
      const a = document.createElement('a');
      a.href = target.fileData;
      a.download = target.fileName || `${target.title || 'dokumen'}.${target.fileExt || 'pdf'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenBase64InTab = (targetItem) => {
    try {
      const target = targetItem || currentItem;
      const arr = target.fileData.split(',');
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
      window.open(targetItem?.fileData || currentItem.fileData, '_blank');
    }
  };

  return createPortal(
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[9999999] bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-center select-none overflow-hidden"
        style={{ width: '100vw', height: '100dvh', margin: 0, padding: 0 }}
      >
        {/* Floating Left Arrow (Previous Card) */}
        {itemsList.length > 1 && (
          <motion.button
            whileHover={{ scale: 1.15, x: -3, boxShadow: '0 0 25px rgba(168, 85, 247, 0.65)' }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => {
              e.stopPropagation();
              handlePrevSlide();
            }}
            className="fixed left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-[10000000] p-3 sm:p-4 rounded-full bg-slate-900/90 hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 text-white backdrop-blur-2xl border border-white/25 shadow-[0_10px_35px_rgba(0,0,0,0.7)] transition-all cursor-pointer group"
            title="Karya Sebelumnya (Panah Kiri ←)"
          >
            <ChevronLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
          </motion.button>
        )}

        {/* Floating Right Arrow (Next Card) */}
        {itemsList.length > 1 && (
          <motion.button
            whileHover={{ scale: 1.15, x: 3, boxShadow: '0 0 25px rgba(168, 85, 247, 0.65)' }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => {
              e.stopPropagation();
              handleNextSlide();
            }}
            className="fixed right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-[10000000] p-3 sm:p-4 rounded-full bg-slate-900/90 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 text-white backdrop-blur-2xl border border-white/25 shadow-[0_10px_35px_rgba(0,0,0,0.7)] transition-all cursor-pointer group"
            title="Karya Berikutnya (Panah Kanan →)"
          >
            <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        )}

        {/* Top Controls Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex justify-between items-center z-50 pointer-events-none">
          {/* Zoom controls for Images */}
          {!isActiveScratch && !isActivePdf && !isActiveOffice && (
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

          {/* Close Modal Button */}
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

        {/* GSAP Infinite 3D Carousel Stage */}
        <div
          className="w-full h-full flex items-center justify-center p-2 sm:p-4 pb-12 sm:pb-14 overflow-hidden relative cursor-grab active:cursor-grabbing"
          style={{ perspective: 1300 }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          {/* Ambient Glow Aura */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
            <motion.div
              key={`glow-${currentItem?.id}`}
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 0.5, scale: 1 }}
              exit={{ opacity: 0, scale: 0.75 }}
              transition={{ duration: 0.5 }}
              className="w-[500px] h-[500px] sm:w-[680px] sm:h-[680px] rounded-full bg-gradient-to-tr from-purple-600/35 via-indigo-600/25 to-pink-500/25 blur-3xl pointer-events-none"
            />
          </div>

          {/* Central Deck Anchor Frame (Holds All Infinite Loop Cards) */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] sm:w-[480px] md:w-[560px] lg:w-[640px] xl:w-[720px] 2xl:w-[780px] h-[64vh] sm:h-[68vh] md:h-[70vh] max-h-[720px] select-none pointer-events-none"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {displayItems.map((subItem, index) => {
              const originalIdx = subItem.originalIndex ?? (index % itemsList.length);
              const isCenterActive = originalIdx === activeIndex;

              const student = subItem.student || data?.users?.find((u) => u.id === subItem.studentId);
              const studentName = student?.name || 'Siswa';
              const sExt = (subItem.fileExt || '').toLowerCase();
              const sData = subItem.fileData || '';
              const isScratchSub = isScratchProject(subItem, data?.projects, data?.classes, data?.users);
              const isPdfSub =
                sExt === 'pdf' ||
                sData.startsWith('data:application/pdf') ||
                (typeof sData === 'string' && sData.includes('.pdf'));
              const isOfficeSub = ['ppt', 'pptx', 'xls', 'xlsx', 'doc', 'docx'].includes(sExt);
              const imgUrl = getDirectImageUrl(sData);
              const subScratchId = getScratchProjectId(sData);
              const subDriveId = getDriveId(sData);
              const subDriveDirectDownloadUrl = subDriveId ? `https://drive.usercontent.google.com/download?id=${subDriveId}&export=download` : '';

              return (
                <div
                  key={`loop-card-${index}-${subItem.id}`}
                  ref={(el) => {
                    cardsRef.current[index] = el;
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isCenterActive) {
                      handleCardClick(originalIdx);
                    }
                  }}
                  className={`absolute inset-0 w-full h-full rounded-[2.25rem] overflow-hidden border-2 bg-[#0E1222] flex flex-col pointer-events-auto transition-all duration-300 ${
                    isCenterActive
                      ? 'border-purple-400/60 shadow-[0_35px_100px_rgba(0,0,0,0.95),0_0_40px_rgba(168,85,247,0.22)]'
                      : 'border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.85)] hover:border-purple-400/70 cursor-pointer'
                  }`}
                  style={{
                    transformStyle: 'preserve-3d',
                    willChange: 'transform, opacity',
                  }}
                >
                  {/* Card Header Bar */}
                  <div className="px-4 sm:px-6 py-3 sm:py-3.5 border-b border-slate-700/80 bg-[#12162A] flex items-center justify-between gap-2 sm:gap-4 shrink-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-[11px] font-black shrink-0">
                        {isScratchSub ? '🎮 Game Scratch' : isPdfSub ? '📄 PDF' : isOfficeSub ? '📊 Dokumen' : '🎨 Karya Gambar'}
                      </span>
                      <strong className="text-white text-xs sm:text-sm font-extrabold truncate">
                        {subItem.title}
                      </strong>
                    </div>

                    <div className="flex items-center gap-2 text-right shrink-0">
                      <span className="text-amber-200 text-xs sm:text-sm font-bold font-handwriting hidden sm:inline">
                        {studentName}
                      </span>
                      <span className="text-slate-400 text-[10px] bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                        {originalIdx + 1} / {totalCount}
                      </span>

                      {/* Download Button (Active Center Card) */}
                      {isCenterActive && sData && (
                        subDriveId ? (
                          <a
                            href={subDriveDirectDownloadUrl || sData}
                            target="_blank"
                            rel="noreferrer"
                            download
                            onClick={(e) => e.stopPropagation()}
                            className="bg-purple-600/90 hover:bg-purple-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
                            title="Download File"
                          >
                            <Download size={13} />
                            <span className="hidden md:inline">Download</span>
                          </a>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadBase64(subItem);
                            }}
                            className="bg-purple-600/90 hover:bg-purple-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-sm shrink-0 cursor-pointer"
                            title="Download File"
                          >
                            <Download size={13} />
                            <span className="hidden md:inline">Download</span>
                          </button>
                        )
                      )}

                      {/* Delete Button (Teacher / Admin on Active Center Card) */}
                      {isCenterActive && onDelete && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(subItem.id);
                          }}
                          className="bg-rose-600/80 hover:bg-rose-600 text-white p-1 sm:px-2.5 sm:py-1 rounded-lg text-xs font-bold inline-flex items-center gap-1 transition-colors shadow-sm shrink-0 cursor-pointer"
                          title="Hapus Karya"
                        >
                          <Trash2 size={13} />
                          <span className="hidden md:inline">Hapus</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Card Media Stage */}
                  <div
                    className="flex-1 w-full relative flex items-center justify-center p-3 sm:p-5 bg-[#070913] overflow-hidden"
                    onWheel={(e) => {
                      if (!isCenterActive || isScratchSub || isPdfSub || isOfficeSub) return;
                      if (e.deltaY < 0) setZoomLevel((prev) => Math.min(prev + 0.15, 5));
                      else setZoomLevel((prev) => Math.max(prev - 0.15, 0.5));
                    }}
                    onMouseDown={(e) => {
                      if (isCenterActive && zoomLevel > 1) {
                        e.preventDefault();
                        setIsDraggingPan(true);
                        setPanDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
                      }
                    }}
                    onMouseMove={(e) => {
                      if (isCenterActive && isDraggingPan && zoomLevel > 1) {
                        e.preventDefault();
                        setPan({ x: e.clientX - panDragStart.x, y: e.clientY - panDragStart.y });
                      }
                    }}
                    onMouseUp={() => setIsDraggingPan(false)}
                    onMouseLeave={() => setIsDraggingPan(false)}
                  >
                    {isScratchSub ? (
                      /* Scratch Game Card */
                      isCenterActive ? (
                        <div className="w-full h-full relative bg-slate-950 flex flex-col">
                          {/* TurboWarp / Scratch Player Bar */}
                          <div className="flex items-center justify-between p-2 bg-slate-900 border-b border-slate-800 text-xs text-white">
                            <span className="font-bold flex items-center gap-1">
                              <Gamepad2 size={14} className="text-amber-400" /> Mode Player:
                            </span>
                            <div className="flex items-center gap-2">
                              {subScratchId && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPlayerMode(playerMode === 'turbowarp' ? 'scratch' : 'turbowarp');
                                  }}
                                  className="px-2 py-0.5 rounded bg-purple-600 text-[11px] font-bold text-white hover:bg-purple-500 transition-colors"
                                >
                                  {playerMode === 'turbowarp' ? 'Ganti ke MIT' : 'Ganti ke TurboWarp'}
                                </button>
                              )}
                              <a
                                href={subScratchId ? `https://scratch.mit.edu/projects/${subScratchId}` : (activeDirectSb3Url || sData)}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold flex items-center gap-1"
                              >
                                <ExternalLink size={12} /> Buka Web
                              </a>
                            </div>
                          </div>
                          <iframe
                            src={
                              subScratchId
                                ? playerMode === 'turbowarp'
                                  ? activeTurboWarpEmbedUrl
                                  : activeScratchEmbedUrl
                                : activeLocalPlayerUrl
                            }
                            width="100%"
                            height="100%"
                            allow="autoplay; camera; microphone; fullscreen; gamepad"
                            frameBorder="0"
                            scrolling="no"
                            allowFullScreen
                            className="flex-1 w-full border-0"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-purple-600 flex flex-col items-center justify-center p-4 text-center text-white">
                          <Gamepad2 size={48} className="text-white mb-3 drop-shadow-md" />
                          <span className="text-sm font-black line-clamp-1">{subItem.title}</span>
                          <span className="text-xs font-bold text-amber-200 mt-2 bg-black/40 px-3 py-1 rounded-full">
                            Klik untuk mainkan game
                          </span>
                        </div>
                      )
                    ) : isPdfSub ? (
                      /* PDF Card */
                      isCenterActive ? (
                        <iframe
                          src={activeDrivePreviewUrl || sData}
                          title={subItem.title || 'PDF Preview'}
                          className="w-full h-full border-0 rounded-xl"
                        />
                      ) : (
                        <div className="w-full h-full relative rounded-xl overflow-hidden bg-slate-950 flex flex-col items-center justify-center p-4">
                          <FileText size={48} className="text-rose-500 mb-2 drop-shadow-lg" />
                          <span className="text-xs font-black text-white line-clamp-1">{subItem.title}</span>
                          <span className="text-[10px] font-bold text-rose-300 mt-1 bg-rose-950/60 border border-rose-500/30 px-2 py-0.5 rounded-full">
                            PDF Document
                          </span>
                        </div>
                      )
                    ) : isOfficeSub ? (
                      /* Office Document Card */
                      <div className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex flex-col items-center justify-center p-4 text-center text-white">
                        <FileText size={48} className="text-white mb-2 drop-shadow-md" />
                        <span className="text-sm font-black line-clamp-1">{subItem.title}</span>
                        <span className="text-[10px] font-bold text-blue-200 mt-2 bg-black/30 px-3 py-1 rounded-full uppercase">
                          Dokumen {sExt || 'DOC'}
                        </span>
                      </div>
                    ) : (
                      /* Image Artwork Card */
                      <img
                        src={imgUrl}
                        alt={subItem.title}
                        draggable="false"
                        referrerPolicy="no-referrer"
                        className="max-w-full max-h-[50vh] sm:max-h-[54vh] md:max-h-[57vh] lg:max-h-[60vh] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.7)] rounded-xl select-none"
                        style={
                          isCenterActive
                            ? {
                                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`,
                                transition: isDraggingPan ? 'none' : 'transform 0.15s ease-out',
                              }
                            : undefined
                        }
                        onError={(e) => {
                          const dId = getDriveId(sData);
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
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Quick Indicator Dots */}
        {totalCount > 1 && (
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 p-1.5 px-3 rounded-full bg-slate-900/85 border border-slate-700/60 backdrop-blur-xl shadow-2xl pointer-events-auto">
            {Array.from({ length: Math.min(totalCount, 12) }).map((_, idx) => {
              const isActive =
                totalCount <= 12
                  ? idx === activeIndex
                  : idx === Math.round((activeIndex / (totalCount - 1)) * 11);
              return (
                <motion.button
                  key={idx}
                  onClick={() => handleCardClick(idx)}
                  animate={{
                    width: isActive ? 22 : 6,
                    backgroundColor: isActive ? '#a855f7' : 'rgba(148, 163, 184, 0.35)',
                  }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className="h-1.5 rounded-full inline-block cursor-pointer"
                  title={`Pindah ke karya ke-${idx + 1}`}
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
