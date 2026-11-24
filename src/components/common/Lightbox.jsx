import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
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
  getTurboWarpEmbedUrl,
  isScratchProject,
} from '../../utils/helpers';

// Register Draggable plugin
gsap.registerPlugin(Draggable);

/**
 * GSAP buildSeamlessLoop Helper Function
 * (From GSAP Demo Hub: https://demos.gsap.com/demo/infinite-card-slider/)
 */
function buildSeamlessLoop(items, spacing, animateFunc) {
  let overlap = Math.ceil(1 / spacing),
    startTime = items.length * spacing + 0.5,
    loopTime = (items.length + overlap) * spacing + 1,
    rawSequence = gsap.timeline({ paused: true }),
    seamlessLoop = gsap.timeline({
      paused: true,
      repeat: -1,
      onRepeat() {
        this._time === this._dur && (this._tTime += this._dur - 0.01);
      },
    }),
    l = items.length + overlap * 2,
    time,
    i,
    index;

  for (i = 0; i < l; i++) {
    index = i % items.length;
    time = i * spacing;
    rawSequence.add(animateFunc(items[index]), time);
    i <= items.length && seamlessLoop.add('label' + i, time);
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
  return seamlessLoop;
}

export const Lightbox = ({
  item,
  items = [],
  currentIndex = 0,
  onNavigate,
  isKelas6 = false,
  isScratch = false,
  onClose,
  totalItems,
  onDelete,
}) => {
  const { data } = useData();

  // Normalize items list
  const originalItems = useMemo(() => {
    if (items && items.length > 0) return items;
    if (item) return [item];
    return [];
  }, [items, item]);

  const totalCount = totalItems || originalItems.length || 1;

  const initialIndex = useMemo(() => {
    if (currentIndex !== undefined && currentIndex >= 0) return currentIndex;
    if (item?.id) {
      const idx = originalItems.findIndex((it) => it.id === item.id);
      if (idx >= 0) return idx;
    }
    return 0;
  }, [currentIndex, item, originalItems]);

  // Ensure minimum elements for seamless loop calculation (spacing = 0.1 requires >= 14 items)
  const displayItems = useMemo(() => {
    if (originalItems.length === 0) return [];
    if (originalItems.length >= 14) {
      return originalItems.map((it, idx) => ({ ...it, originalIndex: idx }));
    }
    let list = [];
    while (list.length < 14) {
      list = list.concat(originalItems.map((it, idx) => ({ ...it, originalIndex: idx })));
    }
    return list;
  }, [originalItems]);

  const [activeIdx, setActiveIdx] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDraggingImg, setIsDraggingImg] = useState(false);
  const [dragStartImg, setDragStartImg] = useState({ x: 0, y: 0 });

  // DOM & GSAP References
  const galleryRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const cardsRef = useRef([]);
  const dragProxyRef = useRef(null);
  const seamlessLoopRef = useRef(null);
  const wrapTimeRef = useRef(null);
  const scrubRef = useRef(null);
  const playhead = useRef({ offset: 0 });
  const lastActiveIdx = useRef(initialIndex);
  const isDraggingCarousel = useRef(false);

  const spacing = 0.1;
  const snapTime = useMemo(() => gsap.utils.snap(spacing), [spacing]);

  // Reset zoom & pan when active item changes
  useEffect(() => {
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  }, [activeIdx]);

  // Scroll playhead smoothly to a target offset
  const scrollToOffset = (targetOffset) => {
    if (!scrubRef.current) return;
    const snapped = snapTime(targetOffset);
    scrubRef.current.vars.offset = snapped;
    scrubRef.current.invalidate().restart();
  };

  const handleNextSlide = () => {
    if (!scrubRef.current) return;
    scrollToOffset(scrubRef.current.vars.offset + spacing);
  };

  const handlePrevSlide = () => {
    if (!scrubRef.current) return;
    scrollToOffset(scrubRef.current.vars.offset - spacing);
  };

  // Keyboard navigation
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalOverscroll = document.body.style.overscrollBehavior;
    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
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
  }, [onClose]);

  // Build the GSAP Seamless Loop & Draggable
  useEffect(() => {
    if (displayItems.length === 0) return;
    const cards = cardsRef.current.filter(Boolean);
    if (cards.length === 0) return;

    // Set initial state of items (from GSAP demo: xPercent 400, opacity 0, scale 0)
    gsap.set(cards, { xPercent: 400, opacity: 0, scale: 0 });

    // animateFunc from GSAP Demo Hub
    const animateFunc = (element) => {
      const tl = gsap.timeline();
      tl.fromTo(
        element,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          zIndex: 100,
          duration: 0.5,
          yoyo: true,
          repeat: 1,
          ease: 'power1.in',
          immediateRender: false,
        }
      ).fromTo(
        element,
        { xPercent: 400 },
        { xPercent: -400, duration: 1, ease: 'none', immediateRender: false },
        0
      );
      return tl;
    };

    const seamlessLoop = buildSeamlessLoop(cards, spacing, animateFunc);
    seamlessLoopRef.current = seamlessLoop;

    const wrapTime = gsap.utils.wrap(0, seamlessLoop.duration());
    wrapTimeRef.current = wrapTime;

    // Scrub tween (smoothly scrubs playhead on seamlessLoop)
    const scrub = gsap.to(playhead.current, {
      offset: 0,
      onUpdate() {
        seamlessLoop.time(wrapTime(playhead.current.offset));

        // High-performance index sync: only trigger state update when active card changes!
        const curOffset = playhead.current.offset;
        const wrappedT = wrapTime(curOffset);
        const displayIdx = Math.round(wrappedT / spacing) % cards.length;
        const origIdx = displayItems[displayIdx]?.originalIndex ?? 0;
        if (origIdx !== lastActiveIdx.current) {
          lastActiveIdx.current = origIdx;
          setActiveIdx(origIdx);
          onNavigate?.(origIdx);
        }
      },
      duration: 0.5,
      ease: 'power3',
      paused: true,
    });
    scrubRef.current = scrub;

    // Start at initialIndex
    const startOffset = initialIndex * spacing;
    playhead.current.offset = startOffset;
    scrub.vars.offset = startOffset;
    seamlessLoop.time(wrapTime(startOffset));
    lastActiveIdx.current = initialIndex;
    setActiveIdx(initialIndex);

    // Draggable functionality (CodePen implementation)
    let draggableInstance = null;
    const proxy = dragProxyRef.current;
    const triggerArea = galleryRef.current;

    if (proxy && triggerArea) {
      const created = Draggable.create(proxy, {
        type: 'x',
        trigger: triggerArea,
        minimumMovement: 4,
        cursor: 'grab',
        activeCursor: 'grabbing',
        onPress() {
          isDraggingCarousel.current = true;
          this.startOffset = scrub.vars.offset;
          gsap.killTweensOf(playhead.current);
        },
        onDrag() {
          scrub.vars.offset = this.startOffset + (this.startX - this.x) * 0.001;
          scrub.invalidate().restart();
        },
        onDragEnd() {
          setTimeout(() => {
            isDraggingCarousel.current = false;
          }, 50);
          scrollToOffset(scrub.vars.offset);
        },
      });
      draggableInstance = created[0];
    }

    return () => {
      draggableInstance?.kill();
      seamlessLoop.kill();
      scrub.kill();
    };
  }, [displayItems.length, initialIndex]);

  // Click any card directly to glide it to center
  const handleCardClick = (targetDisplayIndex) => {
    if (isDraggingCarousel.current) return;
    if (!scrubRef.current || !seamlessLoopRef.current) return;
    const curOffset = scrubRef.current.vars.offset;
    const currentDisplayIdx = Math.round(curOffset / spacing) % displayItems.length;
    let diff = targetDisplayIndex - ((currentDisplayIdx + displayItems.length) % displayItems.length);
    if (diff > displayItems.length / 2) diff -= displayItems.length;
    if (diff < -displayItems.length / 2) diff += displayItems.length;
    if (diff === 0) return; // Already centered
    scrollToOffset(curOffset + diff * spacing);
  };

  if (!item || typeof document === 'undefined') return null;

  // Active item details
  const activeItem = originalItems[activeIdx] || item;
  const activeFileData = activeItem?.fileData || '';
  const activeFileExt = (activeItem?.fileExt || '').toLowerCase();
  const activeFileName = activeItem?.fileName || '';
  const activeDriveId = getDriveId(activeFileData);
  const activeDriveViewUrl = activeDriveId
    ? `https://drive.google.com/file/d/${activeDriveId}/view`
    : activeFileData;
  const activeDriveDownloadUrl = activeDriveId
    ? getDriveDownloadUrl(activeDriveId)
    : activeFileData;

  const handleDownloadBase64 = () => {
    try {
      const a = document.createElement('a');
      a.href = activeFileData;
      a.download = activeFileName || `${activeItem.title || 'dokumen'}.${activeFileExt || 'pdf'}`;
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
        className="fixed inset-0 z-[9999999] bg-[#0A0D18]/95 backdrop-blur-2xl flex flex-col items-center justify-between select-none overflow-hidden"
        style={{ width: '100vw', height: '100dvh', margin: 0, padding: 0 }}
      >
        {/* Top Header Control Bar */}
        <div className="w-full px-4 sm:px-8 py-3.5 flex items-center justify-between z-50 shrink-0 border-b border-white/10 bg-slate-900/70 backdrop-blur-xl">
          {/* Zoom & Pan Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-800/80 p-1 rounded-2xl border border-slate-700/60 shadow-lg">
            <button
              onClick={() => setZoomLevel((prev) => Math.min(prev + 0.25, 4))}
              className="p-1.5 sm:p-2 text-slate-300 hover:text-white hover:bg-slate-700/70 rounded-xl transition-all"
              title="Perbesar (Zoom In)"
            >
              <ZoomIn size={16} />
            </button>
            <span className="text-[11px] sm:text-xs font-black text-purple-300 px-1 min-w-[3rem] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((prev) => Math.max(prev - 0.25, 0.5))}
              className="p-1.5 sm:p-2 text-slate-300 hover:text-white hover:bg-slate-700/70 rounded-xl transition-all"
              title="Perkecil (Zoom Out)"
            >
              <ZoomOut size={16} />
            </button>
            <button
              onClick={() => {
                setZoomLevel(1);
                setPan({ x: 0, y: 0 });
              }}
              className="p-1.5 sm:p-2 text-slate-300 hover:text-white hover:bg-slate-700/70 rounded-xl transition-all flex items-center gap-1 text-[11px] font-bold"
              title="Kembali ke Ukuran Normal"
            >
              <RotateCcw size={14} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>

          {/* Center Info Badge */}
          <div className="hidden md:flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-black">
              {activeItem?.title || 'Karya Siswa'}
            </span>
            <span className="text-amber-200 text-xs font-handwriting font-bold">
              {activeItem?.student?.name || 'Siswa'}
            </span>
            <span className="text-[11px] font-bold text-slate-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
              {activeIdx + 1} / {totalCount}
            </span>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 sm:p-2.5 bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white rounded-2xl border border-rose-500/30 transition-all shadow-lg hover:scale-105"
            title="Tutup (Esc)"
          >
            <X size={18} />
          </button>
        </div>

        {/* The GSAP Gallery & Cards Stage (Full Mouse Drag Trigger) */}
        <div
          ref={galleryRef}
          className="gallery relative w-full flex-1 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
          style={{ touchAction: 'pan-y' }}
        >
          {/* Circular Navigation Arrow Left */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevSlide();
            }}
            className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 z-40 p-3 sm:p-4 rounded-full bg-slate-900/85 hover:bg-purple-600 text-white border border-white/20 shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:scale-110 active:scale-95 transition-all cursor-pointer"
            title="Sebelumnya (Panah Kiri)"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Cards List Stack (Driven by GSAP buildSeamlessLoop) */}
          <ul
            ref={cardsContainerRef}
            className="cards absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-72 md:w-80 lg:w-96 xl:w-[420px] 2xl:w-[460px] h-[52vh] sm:h-[58vh] max-h-[600px] list-none m-0 p-0"
            style={{ perspective: '1400px', transformStyle: 'preserve-3d' }}
          >
            {displayItems.map((subItem, index) => {
              const isCenter = subItem.originalIndex === activeIdx;
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

              return (
                <li
                  key={`card-${subItem.id}-${index}`}
                  ref={(el) => (cardsRef.current[index] = el)}
                  onClick={(e) => {
                    // Only handle click if user didn't drag
                    if (!isDraggingCarousel.current && !isCenter) {
                      e.stopPropagation();
                      handleCardClick(index);
                    }
                  }}
                  className={`absolute inset-0 list-none rounded-[2rem] overflow-hidden border-2 bg-[#0E1222] shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col select-none ${
                    isCenter
                      ? 'border-purple-400 shadow-[0_0_45px_rgba(168,85,247,0.4)]'
                      : 'border-white/20'
                  }`}
                  style={{
                    willChange: 'transform, opacity',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Card Header Bar */}
                  <div className="px-3.5 sm:px-4 py-2.5 sm:py-3 border-b border-white/10 bg-[#12162A] flex items-center justify-between gap-2 shrink-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-[10px] sm:text-[11px] font-black shrink-0">
                        {isScratchSub
                          ? '🎮 Game Scratch'
                          : isPdfSub
                          ? '📄 PDF'
                          : isOfficeSub
                          ? `📊 ${sExt.toUpperCase() || 'DOC'}`
                          : '🎨 Karya Gambar'}
                      </span>
                      <strong className="text-white text-xs sm:text-sm font-extrabold truncate">
                        {subItem.title}
                      </strong>
                    </div>

                    <div className="flex items-center gap-1.5 ml-auto shrink-0">
                      <span className="text-amber-200 text-[11px] sm:text-xs font-bold font-handwriting mr-1 hidden sm:inline truncate max-w-[120px]">
                        {studentName}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                        {subItem.originalIndex + 1}/{totalCount}
                      </span>

                      {/* Action buttons (active center card only) */}
                      {isCenter && (
                        <>
                          {subItem.fileData && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (activeDriveId) {
                                  window.open(activeDriveDownloadUrl, '_blank');
                                } else {
                                  handleDownloadBase64();
                                }
                              }}
                              className="bg-purple-600 hover:bg-purple-500 text-white p-1 sm:px-2 sm:py-1 rounded-xl text-[10px] font-bold inline-flex items-center gap-1 transition-colors shadow-sm cursor-pointer ml-1"
                              title="Download Karya Ini"
                            >
                              <Download size={12} />
                              <span className="hidden sm:inline">Download</span>
                            </button>
                          )}

                          {onDelete && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(subItem.id);
                              }}
                              className="bg-rose-600/80 hover:bg-rose-600 text-white p-1 sm:px-2 sm:py-1 rounded-xl text-[10px] font-bold inline-flex items-center gap-1 transition-colors shadow-sm cursor-pointer"
                              title="Hapus Karya Ini"
                            >
                              <Trash2 size={12} />
                              <span className="hidden sm:inline">Hapus</span>
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Card Media Stage */}
                  <div
                    className="flex-1 w-full relative flex items-center justify-center p-2.5 sm:p-4 bg-[#070913] overflow-hidden"
                    onWheel={(e) => {
                      if (!isCenter) return;
                      if (e.deltaY < 0) setZoomLevel((prev) => Math.min(prev + 0.15, 4));
                      else setZoomLevel((prev) => Math.max(prev - 0.15, 0.5));
                    }}
                    onMouseDown={(e) => {
                      if (!isCenter || zoomLevel <= 1) return;
                      e.stopPropagation();
                      setIsDraggingImg(true);
                      setDragStartImg({ x: e.clientX - pan.x, y: e.clientY - pan.y });
                    }}
                    onMouseMove={(e) => {
                      if (!isDraggingImg || zoomLevel <= 1) return;
                      setPan({ x: e.clientX - dragStartImg.x, y: e.clientY - dragStartImg.y });
                    }}
                    onMouseUp={() => setIsDraggingImg(false)}
                    onMouseLeave={() => setIsDraggingImg(false)}
                  >
                    {isScratchSub ? (
                      /* Scratch project preview */
                      <div className="w-full h-full rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-purple-600 flex flex-col items-center justify-center p-4 text-center text-white relative overflow-hidden pointer-events-none">
                        <Gamepad2 size={48} className="text-white mb-2 drop-shadow-md" />
                        <h4 className="text-sm font-black line-clamp-1">{subItem.title}</h4>
                        <span className="text-[10px] font-bold text-amber-200 mt-1 bg-black/40 px-2.5 py-0.5 rounded-full">
                          Game Scratch ({studentName})
                        </span>
                        {isCenter && (
                          <div className="mt-3 flex items-center gap-2 pointer-events-auto">
                            <a
                              href={getTurboWarpEmbedUrl(getScratchProjectId(sData)) || sData}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-black text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-lg border border-white/20 transition-all hover:scale-105"
                            >
                              <Play size={12} className="text-amber-400" /> Buka Game
                            </a>
                          </div>
                        )}
                      </div>
                    ) : isPdfSub ? (
                      /* PDF preview */
                      <div className="w-full h-full relative rounded-2xl overflow-hidden bg-slate-950 flex flex-col items-center justify-center p-4 text-center pointer-events-none">
                        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-2">
                          <FileText size={32} />
                        </div>
                        <h4 className="text-white text-xs sm:text-sm font-black truncate max-w-[90%]">
                          {subItem.fileName || subItem.title}
                        </h4>
                        <span className="text-slate-400 text-[10px] mt-0.5">Dokumen PDF Siswa</span>
                        {isCenter && (
                          <div className="pointer-events-auto">
                            <a
                              href={activeDriveViewUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="mt-3 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-lg transition-all hover:scale-105 inline-block"
                            >
                              <ExternalLink size={12} /> Baca PDF
                            </a>
                          </div>
                        )}
                      </div>
                    ) : isOfficeSub ? (
                      /* Office preview */
                      <div className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex flex-col items-center justify-center p-4 text-center text-white pointer-events-none">
                        <FileSpreadsheet size={44} className="text-white mb-2 drop-shadow-md" />
                        <h4 className="text-xs sm:text-sm font-black line-clamp-1">{subItem.title}</h4>
                        <span className="text-[10px] font-bold text-blue-200 mt-1 bg-black/30 px-2 py-0.5 rounded-full uppercase">
                          Dokumen {sExt || 'DOC'}
                        </span>
                        {isCenter && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadBase64();
                            }}
                            className="mt-3 px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-black text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-lg border border-white/20 transition-all hover:scale-105 pointer-events-auto"
                          >
                            <Download size={12} /> Unduh File
                          </button>
                        )}
                      </div>
                    ) : (
                      /* Image preview */
                      <img
                        src={imgUrl}
                        alt={subItem.title}
                        draggable="false"
                        referrerPolicy="no-referrer"
                        className="max-w-full max-h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.7)] rounded-xl select-none pointer-events-none"
                        style={{
                          transform: isCenter
                            ? `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`
                            : undefined,
                          pointerEvents: isCenter && zoomLevel > 1 ? 'auto' : 'none',
                        }}
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

                  {/* Card Bottom Bar */}
                  <div className="px-4 py-2.5 bg-[#0A0D1A] border-t border-white/5 flex flex-col items-center text-center shrink-0">
                    <p className="text-white text-xs sm:text-sm font-black truncate w-full">
                      {subItem.title}
                    </p>
                    <p className="text-amber-200 text-[11px] sm:text-xs font-handwriting font-bold truncate w-full">
                      {studentName}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Circular Navigation Arrow Right */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNextSlide();
            }}
            className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 z-40 p-3 sm:p-4 rounded-full bg-slate-900/85 hover:bg-purple-600 text-white border border-white/20 shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:scale-110 active:scale-95 transition-all cursor-pointer"
            title="Berikutnya (Panah Kanan)"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Bottom Actions Bar (Matching GSAP Demo) */}
        <div className="w-full py-4 flex flex-col items-center justify-center gap-3 z-50 shrink-0 bg-slate-900/40 backdrop-blur-md border-t border-white/5">
          {/* Quick Indicator Dots */}
          {totalCount > 1 && (
            <div className="flex items-center gap-1.5 p-1.5 px-3 rounded-full bg-slate-900/90 border border-slate-700/60 shadow-xl">
              {Array.from({ length: Math.min(totalCount, 16) }).map((_, idx) => {
                const isActive =
                  totalCount <= 16
                    ? idx === activeIdx
                    : idx === Math.round((activeIdx / (totalCount - 1)) * 15);
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

          {/* Prev / Next Bottom Action Buttons */}
          <div className="actions flex items-center justify-center gap-3">
            <button
              onClick={handlePrevSlide}
              className="px-5 py-2 rounded-full bg-slate-800 hover:bg-purple-600 text-white font-bold text-xs border border-white/10 hover:border-purple-400 shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              Prev
            </button>
            <span className="text-xs text-slate-400 font-semibold px-2">
              Karya {activeIdx + 1} dari {totalCount}
            </span>
            <button
              onClick={handleNextSlide}
              className="px-5 py-2 rounded-full bg-slate-800 hover:bg-purple-600 text-white font-bold text-xs border border-white/10 hover:border-purple-400 shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>

        {/* Real GSAP Draggable Proxy Element (visibility: hidden, NOT display: none!) */}
        <div
          ref={dragProxyRef}
          className="drag-proxy"
          style={{
            position: 'absolute',
            visibility: 'hidden',
            width: '10px',
            height: '10px',
            top: 0,
            left: 0,
            pointerEvents: 'none',
          }}
        />
      </div>
    </AnimatePresence>,
    document.body
  );
};
