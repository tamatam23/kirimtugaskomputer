import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderKanban,
  Search,
  Trash2,
  Download,
  LayoutGrid,
  Table as TableIcon,
  Eye,
  Check,
  Users,
  Send,
  Sparkles,
  FileCode,
  FileText,
  Gamepad2,
  Play,
} from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmContext';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Avatar } from '../common/Avatar';
import { Lightbox } from '../common/Lightbox';
import { callGas } from '../../services/api';
import {
  getDirectImageUrl,
  getLocalDateString,
  isScratchProject,
  getDriveDownloadUrl,
  getScratchProjectId,
  getDriveId,
} from '../../utils/helpers';
import { springBounce, fadeInScale, staggerFast, popCard } from '../../utils/motion';
import { KineticText, KineticLine, KineticNumber } from '../common/MotionTypography';

export const TeacherGallery = () => {
  const { data, updateDocument, deleteDocument } = useData();
  const showToast = useToast();
  const showConfirm = useConfirm();

  const [selectedImg, setSelectedImg] = useState(null);
  const [activeFolder, setActiveFolder] = useState('all');
  const [drafts, setDrafts] = useState({});
  const [isGridMode, setIsGridMode] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  // Bulk Selection
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [globalClassFilter, setGlobalClassFilter] = useState('all');
  const [activeProjectFilter, setActiveProjectFilter] = useState('all');

  const uniqueClasses = Object.values(
    data.classes.reduce((acc, current) => {
      const normalizedName = current.name
        .toLowerCase()
        .replace(/kelas/gi, '')
        .replace(/[^a-z0-9]/g, '');
      if (!acc[normalizedName] || !current.name.toLowerCase().includes('kelas')) {
        acc[normalizedName] = current;
      }
      return acc;
    }, {})
  ).sort((a, b) => a.name.localeCompare(b.name));

  const activeClassObj = uniqueClasses.find((c) => c.id === activeFolder);
  const activeFolderName = activeFolder === 'all' ? 'Semua Kelas' : activeClassObj?.name || '';
  const activeNorm = activeClassObj
    ? activeClassObj.name
        .toLowerCase()
        .replace(/kelas/gi, '')
        .replace(/[^a-z0-9]/g, '')
    : '';

  // Filter project for active class
  const availableProjectsForClass = data.projects.filter((p) => {
    if (activeFolder === 'all') return true;
    if (
      !p.classId ||
      p.classId === 'all' ||
      (Array.isArray(p.classId) && (p.classId.includes('all') || p.classId.length === 0))
    ) {
      return true;
    }
    return (Array.isArray(p.classId) ? p.classId : [p.classId]).some((cid) => {
      const cObj = data.classes.find((c) => String(c.id).trim() === String(cid).trim());
      const pNorm = cObj
        ? cObj.name
            .toLowerCase()
            .replace(/kelas/gi, '')
            .replace(/[^a-z0-9]/g, '')
        : String(cid)
            .toLowerCase()
            .replace(/kelas/gi, '')
            .replace(/[^a-z0-9]/g, '');
      return pNorm === activeNorm;
    });
  });

  // Helper: Hitung jumlah karya per tugas untuk kelas yang sedang aktif
  const getSubmissionsCountForProject = (projectId) => {
    return data.submissions.filter((sub) => {
      const subProjId = String(sub.projectId || '').trim();
      const projIdStr = String(projectId).trim();
      const projObj = data.projects.find((p) => String(p.id).trim() === projIdStr);
      const projTitle = projObj ? projObj.title.trim().toLowerCase() : '';
      const passProj = subProjId === projIdStr || (projTitle && subProjId.toLowerCase() === projTitle);
      if (!passProj) return false;

      if (activeFolder === 'all') return true;
      const student = data.users.find(
        (u) =>
          String(u.id).trim().toLowerCase() === String(sub.studentId || '').trim().toLowerCase() ||
          (u.name && sub.studentName && u.name.trim().toLowerCase() === sub.studentName.trim().toLowerCase())
      );
      const studentClassObj = student
        ? data.classes.find((c) => String(c.id).trim() === String(student.classId).trim())
        : null;
      const studentNorm = studentClassObj
        ? studentClassObj.name.toLowerCase().replace(/kelas/gi, '').replace(/[^a-z0-9]/g, '')
        : String(student?.classId || sub.className || sub.classId || '')
            .toLowerCase()
            .replace(/kelas/gi, '')
            .replace(/[^a-z0-9]/g, '');
      return studentNorm === activeNorm;
    }).length;
  };

  const totalClassSubmissions = data.submissions.filter((sub) => {
    if (activeFolder === 'all') return true;
    const student = data.users.find(
      (u) =>
        String(u.id).trim().toLowerCase() === String(sub.studentId || '').trim().toLowerCase() ||
        (u.name && sub.studentName && u.name.trim().toLowerCase() === sub.studentName.trim().toLowerCase())
    );
    const studentClassObj = student
      ? data.classes.find((c) => String(c.id).trim() === String(student.classId).trim())
      : null;
    const studentNorm = studentClassObj
      ? studentClassObj.name.toLowerCase().replace(/kelas/gi, '').replace(/[^a-z0-9]/g, '')
      : String(student?.classId || sub.className || sub.classId || '')
          .toLowerCase()
          .replace(/kelas/gi, '')
          .replace(/[^a-z0-9]/g, '');
    return studentNorm === activeNorm;
  }).length;

  // Main Submissions Filter
  const filteredSubmissions = data.submissions.filter((sub) => {
    const student = data.users.find(
      (u) =>
        String(u.id).trim().toLowerCase() === String(sub.studentId || '').trim().toLowerCase() ||
        (u.name && sub.studentName && u.name.trim().toLowerCase() === sub.studentName.trim().toLowerCase())
    );
    let passClass = true;
    if (activeFolder !== 'all') {
      const studentClassObj = student
        ? data.classes.find((c) => String(c.id).trim() === String(student.classId).trim())
        : null;
      const studentNorm = studentClassObj
        ? studentClassObj.name
            .toLowerCase()
            .replace(/kelas/gi, '')
            .replace(/[^a-z0-9]/g, '')
        : String(student?.classId || sub.className || sub.classId || '')
            .toLowerCase()
            .replace(/kelas/gi, '')
            .replace(/[^a-z0-9]/g, '');
      passClass = studentNorm === activeNorm;
    } else if (globalClassFilter !== 'all') {
      passClass =
        (student && String(student.classId).trim() === String(globalClassFilter).trim()) ||
        String(sub.classId || '').trim() === String(globalClassFilter).trim();
    }

    let passProject = true;
    if (activeProjectFilter !== 'all') {
      const subProjId = String(sub.projectId || '').trim();
      const activeFilterId = String(activeProjectFilter).trim();
      const activeProjObj = data.projects.find((p) => String(p.id).trim() === activeFilterId);
      const activeProjTitle = activeProjObj ? activeProjObj.title.trim().toLowerCase() : '';

      passProject =
        subProjId === activeFilterId ||
        (activeProjTitle && subProjId.toLowerCase() === activeProjTitle);
    }

    let passSearch = true;
    if (searchQuery.trim() !== '') {
      const sName = (student?.name || sub.studentName || '').toLowerCase();
      passSearch = sName.includes(searchQuery.toLowerCase());
    }

    return passClass && passProject && passSearch;
  });

  const isKls6Global = activeFolderName.toLowerCase().includes('6');

  // Handle Download SB3
  const handleDownloadSb3 = async (url, studentName) => {
    if (!url) return showToast('URL file tidak valid', 'error');
    setIsDownloading(true);
    showToast('Menyiapkan file .sb3 Scratch...');
    try {
      const base64 = await callGas('getFileBase64ForDownload', url);
      if (!base64) throw new Error('Gagal mengambil data');

      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: 'application/x-scratch-sb3' });
      saveAs(blob, `${studentName.replace(/[^a-zA-Z0-9]/g, '_')}_Project.sb3`);
      showToast('Download .sb3 selesai');
    } catch {
      showToast('Gagal mendownload file Scratch', 'error');
    }
    setIsDownloading(false);
  };

  // Handle Download ZIP Folder
  const handleDownloadZip = async () => {
    setIsZipping(true);
    showToast('Sedang membungkus file ke ZIP... Mohon tunggu.', 'success');
    try {
      const zip = new JSZip();
      const folderName = `Karya_${activeFolderName.replace(/\s+/g, '_')}_${getLocalDateString(
        'now'
      )}`;
      const root = zip.folder(folderName);

      for (let i = 0; i < filteredSubmissions.length; i++) {
        const sub = filteredSubmissions[i];
        const student = data.users.find((u) => u.id === sub.studentId);
        const sName = (student?.name || 'Siswa').replace(/[^a-zA-Z0-9]/g, '_');
        const pTitle = (sub.title || 'Karya').replace(/[^a-zA-Z0-9]/g, '_');

        if (sub.fileData && sub.fileData.includes('drive.google.com')) {
          const base64Str = await callGas('getFileBase64ForDownload', sub.fileData);
          if (base64Str) {
            let ext = sub.fileExt || 'jpg';
            root.file(`${sName}_${pTitle}.${ext}`, base64Str, { base64: true });
          }
        } else if (sub.fileData && sub.fileData.startsWith('data:')) {
          const base64Parts = sub.fileData.split(',');
          if (base64Parts.length === 2) {
            root.file(`${sName}_${pTitle}.jpg`, base64Parts[1], { base64: true });
          }
        }
      }

      const zipContent = await zip.generateAsync({ type: 'blob' });
      saveAs(zipContent, `${folderName}.zip`);
      showToast('Download berkas ZIP selesai');
    } catch {
      showToast('Gagal membungkus file ke ZIP', 'error');
    }
    setIsZipping(false);
  };

  // Bulk Delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return showToast('Pilih karya terlebih dahulu', 'error');
    const confirmed = await showConfirm(
      `Yakin hapus ${selectedIds.length} karya terpilih secara permanen? Karya ini juga akan terhapus permanen dari akun siswa.`
    );
    if (confirmed) {
      for (const id of selectedIds) {
        await deleteDocument('submissions', id);
      }
      showToast(`${selectedIds.length} karya berhasil dihapus permanen!`);
      setSelectedIds([]);
      setIsSelectMode(false);
    }
  };

  const toggleSelectAll = (e) => {
    if (e.target.checked) setSelectedIds(filteredSubmissions.map((s) => s.id));
    else setSelectedIds([]);
  };

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter((i) => i !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  return (
    <motion.div initial="hidden" animate="show" variants={fadeInScale} className="space-y-6">
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/90 backdrop-blur-xl p-5 sm:p-6 rounded-[2rem] border border-white/80 shadow-[0_10px_30px_rgba(109,40,217,0.05)]">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Galeri & Penilaian Karya</h2>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Lihat, nilai, dan unduh seluruh karya tugas siswa
          </p>
        </div>
      </div>

      {/* Class Folders Tabs */}
      <div className="flex flex-wrap gap-2.5 pb-2">
        <button
          onClick={() => {
            setActiveFolder('all');
            setActiveProjectFilter('all');
            setGlobalClassFilter('all');
            setSearchQuery('');
          }}
          className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 shadow-sm ${
            activeFolder === 'all'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/30'
              : 'bg-white/85 text-slate-600 hover:text-purple-700 hover:bg-white border border-purple-100'
          }`}
        >
          <FolderKanban size={17} /> Semua Karya
        </button>

        {uniqueClasses.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setActiveFolder(c.id);
              setActiveProjectFilter('all');
              setGlobalClassFilter('all');
              setSearchQuery('');
            }}
            className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 shadow-sm ${
              activeFolder === c.id
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/30'
                : 'bg-white/85 text-slate-600 hover:text-purple-700 hover:bg-white border border-purple-100'
            }`}
          >
            <FolderKanban size={17} /> {c.name}
          </button>
        ))}
      </div>

      {/* Action and Filter Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/70 backdrop-blur-sm p-4 rounded-3xl border border-purple-100/80 shadow-sm">
        {/* Left Side: Bulk Delete & ZIP Download */}
        <div className="flex flex-wrap items-center gap-2">
          {isSelectMode ? (
            <>
              <Button variant="danger" size="sm" onClick={handleBulkDelete}>
                Hapus Terpilih ({selectedIds.length})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedIds(filteredSubmissions.map((s) => s.id))}
              >
                Pilih Semua
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsSelectMode(false);
                  setSelectedIds([]);
                }}
              >
                Batal
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setIsSelectMode(true)}
                icon={<Trash2 size={16} />}
              >
                Hapus
              </Button>

              {activeFolder !== 'all' && filteredSubmissions.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isZipping}
                  onClick={handleDownloadZip}
                  icon={<Download size={16} />}
                >
                  {isZipping ? 'Mengekstrak...' : 'Download Folder (.zip)'}
                </Button>
              )}
            </>
          )}
        </div>

        {/* Right Side: Filters & View Switcher */}
        <div className="flex flex-wrap items-center gap-2.5 ml-auto">
          {/* Global Class Filter (when All is selected) */}
          {activeFolder === 'all' && (
            <select
              value={globalClassFilter}
              onChange={(e) => setGlobalClassFilter(e.target.value)}
              className="text-xs font-bold px-3 py-2 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm text-slate-700"
            >
              <option value="all">Semua Kelas</option>
              {data.classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}

          {/* Project Filter */}
          <select
            value={activeProjectFilter}
            onChange={(e) => setActiveProjectFilter(e.target.value)}
            className="text-xs font-bold px-3 py-2 rounded-2xl border border-purple-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm text-slate-700 w-auto min-w-[200px] max-w-[340px] truncate"
            title="Pilih tugas untuk menyaring karya"
          >
            <option value="all">
              -- Semua Tugas {totalClassSubmissions > 0 ? `(${totalClassSubmissions} karya)` : ''} --
            </option>
            {availableProjectsForClass.map((p) => {
              const count = getSubmissionsCountForProject(p.id);
              return (
                <option key={p.id} value={p.id}>
                  {p.title} ({count} karya)
                </option>
              );
            })}
          </select>

          {/* Search by Student Name */}
          <div className="relative flex items-center">
            <Search size={15} className="absolute left-3 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari siswa..."
              className="pl-9 pr-3 py-1.5 rounded-2xl border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm w-36 sm:w-44"
            />
          </div>

          {/* Grid / Table Mode Switch */}
          <button
            onClick={() => setIsGridMode(!isGridMode)}
            className="p-2 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-purple-600 hover:border-purple-300 transition-colors shadow-sm"
            title={isGridMode ? 'Tampilan Tabel' : 'Tampilan Kartu'}
          >
            {isGridMode ? <TableIcon size={18} /> : <LayoutGrid size={18} />}
          </button>
        </div>
      </div>

      {/* Main Content Area: Gallery + "Belum Kumpul" Sidebar Tracker */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Gallery Works View */}
        <div className="flex-1">
          {isGridMode ? (
            <motion.div
              key={`${activeFolder}-${activeProjectFilter}`}
              variants={staggerFast}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4"
            >
              {filteredSubmissions.length === 0 ? (
                <div className="col-span-full py-12 px-6 text-center glass-card rounded-3xl border border-dashed border-purple-200 space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <FolderKanban size={28} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-slate-800 text-base">
                      {activeProjectFilter !== 'all'
                        ? 'Belum Ada Karya Untuk Tugas Ini'
                        : `Belum Ada Karya di ${activeFolderName}`}
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      {activeProjectFilter !== 'all'
                        ? `Tugas "${data.projects.find((p) => String(p.id).trim() === String(activeProjectFilter).trim())?.title || 'terpilih'}" belum memiliki kiriman karya dari siswa ${activeFolderName}.`
                        : 'Belum ada kiriman karya yang cocok dengan filter yang dipilih.'}
                    </p>
                  </div>
                  {activeProjectFilter !== 'all' && totalClassSubmissions > 0 && (
                    <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => setActiveProjectFilter('all')}
                      >
                        Lihat Semua Karya {activeFolderName} ({totalClassSubmissions} Karya)
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                filteredSubmissions.map((sub) => {
                  const student = data.users.find((u) => u.id === sub.studentId);
                  const imgUrl = getDirectImageUrl(sub.fileData);
                  const isChecked = selectedIds.includes(sub.id);
                  const isScratch = isScratchProject(sub, data.projects, data.classes, data.users);
                  const fileData = sub.fileData || '';
                  const fileExt = (sub.fileExt || '').toLowerCase();
                  const fileName = sub.fileName || '';
                  const title = (sub.title || '').toLowerCase();

                  const studentClassObj = student ? data.classes.find((c) => c.id === student.classId) : null;
                  const isStudentKls5 = studentClassObj ? studentClassObj.name.includes('5') : activeFolderName.includes('5');
                  const isInvalidKls5Format =
                    isStudentKls5 &&
                    !['jpg', 'jpeg', 'png', 'pdf'].includes(fileExt) &&
                    !fileData.startsWith('data:image') &&
                    !fileData.startsWith('data:application/pdf');

                  const isPdf =
                    fileExt === 'pdf' ||
                    (typeof fileData === 'string' && (
                      fileData.startsWith('data:application/pdf') ||
                      fileData.toLowerCase().includes('.pdf') ||
                      fileName.toLowerCase().endsWith('.pdf') ||
                      title.endsWith('.pdf')
                    ));

                  const isOffice =
                    ['ppt', 'pptx', 'xls', 'xlsx', 'doc', 'docx'].includes(fileExt) ||
                    (typeof fileData === 'string' && (
                      fileData.startsWith('data:application/vnd') ||
                      fileData.startsWith('data:application/msword') ||
                      /\.(pptx?|xlsx?|docx?)$/i.test(fileName || title)
                    ));

                  return (
                    <motion.div
                      key={sub.id}
                      variants={popCard}
                      whileHover={{ y: -6, scale: 1.015 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                      className={`bg-white/95 backdrop-blur-xl p-0 rounded-2xl overflow-hidden flex flex-col justify-between border border-white/80 shadow-[0_6px_20px_rgba(109,40,217,0.05)] hover:shadow-[0_12px_28px_rgba(109,40,217,0.1)] transition-all duration-300 relative ${
                        isChecked ? 'ring-3 ring-purple-500 shadow-lg' : ''
                      }`}
                    >
                      {/* Checkbox overlay */}
                      {isSelectMode && (
                        <div className="absolute top-2.5 left-2.5 z-30">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleSelect(sub.id)}
                            className="w-4 h-4 accent-purple-600 cursor-pointer rounded"
                          />
                        </div>
                      )}

                      {/* Image Preview / Scratch SB3 Badge / PDF / Office */}
                      <div
                        onClick={() => {
                          if (isSelectMode) return toggleSelect(sub.id);
                          setSelectedImg({ ...sub, student });
                        }}
                        className="relative aspect-[16/10] bg-purple-50/60 overflow-hidden cursor-pointer group flex items-center justify-center"
                      >
                        {getScratchProjectId(sub.fileData) ? (
                          <div className="w-full h-full relative group">
                            <img
                              src={imgUrl}
                              alt={sub.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  'https://placehold.co/480x360/f59e0b/ffffff?text=Game+Scratch';
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2.5">
                              <span className="text-[10px] font-extrabold text-amber-300 bg-amber-500/20 backdrop-blur-md px-2 py-0.5 rounded-full inline-flex items-center gap-1 w-fit border border-amber-500/30">
                                <Play size={10} fill="currentColor" /> Mainkan (Scratch Online)
                              </span>
                            </div>
                          </div>
                        ) : isScratch ? (
                          <div className="flex flex-col items-center justify-center bg-gradient-to-br from-amber-500 via-orange-500 to-purple-600 text-white p-3 text-center h-full w-full relative group">
                            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-1 shadow-md group-hover:scale-110 transition-transform">
                              <Gamepad2 size={24} className="text-white" />
                            </div>
                            <p className="font-black text-xs text-white line-clamp-1 drop-shadow-sm">
                              Game Scratch (.sb3)
                            </p>
                            <span className="text-[10px] font-extrabold text-amber-100 bg-black/30 px-2.5 py-0.5 rounded-full mt-1 flex items-center gap-1 shadow-xs">
                              <Play size={10} fill="currentColor" /> Mainkan Game
                            </span>
                            {isInvalidKls5Format && (
                              <span className="absolute top-2 left-2 z-10 text-[9px] font-black text-rose-900 bg-rose-200/95 px-2 py-0.5 rounded-full shadow-sm border border-rose-300">
                                Format Nyasar (.sb3)
                              </span>
                            )}
                          </div>
                        ) : isPdf ? (
                          <div className="w-full h-full relative group">
                            <img
                              src={imgUrl}
                              alt={sub.title}
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              onError={(e) => {
                                const dId = getDriveId(sub.fileData);
                                if (dId && e.target.src.includes('thumbnail')) {
                                  e.target.src = `https://lh3.googleusercontent.com/d/${dId}=w800`;
                                } else if (dId && e.target.src.includes('lh3.googleusercontent.com')) {
                                  e.target.src = `https://lh3.googleusercontent.com/d/${dId}=s800`;
                                } else {
                                  e.target.style.display = 'none';
                                  if (e.target.nextElementSibling) {
                                    e.target.nextElementSibling.style.display = 'flex';
                                  }
                                }
                              }}
                            />
                            <div
                              style={{ display: 'none' }}
                              className="flex flex-col items-center justify-center bg-gradient-to-br from-rose-600 via-rose-500 to-amber-600 text-white p-3 text-center h-full w-full select-none"
                            >
                              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-1 shadow-md">
                                <FileText size={22} className="text-white" />
                              </div>
                              <p className="font-extrabold text-xs text-white line-clamp-1 drop-shadow-sm px-2">
                                {sub.fileName || sub.title || 'Dokumen PDF'}
                              </p>
                            </div>
                            <div className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-600/95 text-white text-[10px] font-black shadow-md backdrop-blur-xs border border-white/30">
                              <FileText size={11} /> PDF
                            </div>
                          </div>
                        ) : isOffice ? (
                          <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white p-3 text-center h-full w-full relative group select-none">
                            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-1 shadow-md group-hover:scale-110 transition-transform">
                              <FileText size={22} className="text-white" />
                            </div>
                            <p className="font-extrabold text-xs text-white line-clamp-1 drop-shadow-sm px-2">
                              {sub.fileName || sub.title || 'Dokumen Office'}
                            </p>
                            <span className="text-[10px] font-black text-blue-100 bg-black/35 px-2.5 py-0.5 rounded-full mt-1 flex items-center gap-1 shadow-xs border border-white/20 uppercase">
                              <Eye size={11} /> Buka {fileExt || 'Doc'}
                            </span>
                          </div>
                        ) : (
                          <img
                            src={imgUrl}
                            alt={sub.title}
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              const dId = getDriveId(sub.fileData);
                              if (dId && e.target.src.includes('thumbnail')) {
                                e.target.src = `https://lh3.googleusercontent.com/d/${dId}=w800`;
                              } else if (dId && e.target.src.includes('lh3.googleusercontent.com')) {
                                e.target.src = `https://lh3.googleusercontent.com/d/${dId}=s800`;
                              } else {
                                e.target.onerror = null;
                                e.target.src =
                                  'https://placehold.co/600x400/e2e8f0/475569?text=Karya+Siswa';
                              }
                            }}
                          />
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                          <span className="text-white text-[11px] font-bold flex items-center gap-1">
                            <Eye size={13} /> {isScratch ? 'Mainkan Game' : isPdf ? 'Buka PDF' : isOffice ? 'Buka Dokumen' : 'Buka Karya'}
                          </span>
                        </div>
                      </div>

                      {/* Info Box (Bersih Tanpa Input Nilai & Catatan di Mode Kartu) */}
                      <div className="p-3 sm:p-3.5 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <Avatar name={student?.name || '?'} photo={student?.photo} size={28} />
                          <div className="min-w-0 overflow-hidden">
                            <KineticText
                              text={student?.name || 'Siswa'}
                              as="p"
                              className="font-extrabold text-slate-800 text-xs truncate block"
                            />
                            <KineticLine as="p" delay={0.05} className="text-[10px] text-slate-400 truncate">
                              {sub.title}
                            </KineticLine>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {isKls6Global && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadSb3(sub.fileData, student?.name || 'Siswa');
                              }}
                              disabled={isDownloading}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors shrink-0 cursor-pointer"
                              title="Download .sb3"
                            >
                              <Download size={14} />
                            </button>
                          )}
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              const confirmed = await showConfirm(
                                `Yakin ingin menghapus karya "${sub.title}" milik ${student?.name || 'Siswa'} secara permanen? Karya ini juga akan terhapus dari akun siswa.`
                              );
                              if (confirmed) {
                                await deleteDocument('submissions', sub.id);
                                showToast('Karya siswa berhasil dihapus permanen');
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                            title="Hapus Karya Siswa Secara Permanen"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          ) : (
            /* Table Mode */
            <div className="glass-card rounded-[2rem] border border-white/80 shadow-[0_12px_36px_rgba(109,40,217,0.06)] overflow-hidden">
              <div className="overflow-x-auto overflow-y-auto max-h-[390px]">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 z-10 bg-purple-50/95 backdrop-blur-md shadow-sm border-b border-purple-100/80">
                    <tr className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {isSelectMode && (
                        <th className="p-3.5 w-12 text-center">
                          <input
                            type="checkbox"
                            checked={
                              selectedIds.length === filteredSubmissions.length &&
                              filteredSubmissions.length > 0
                            }
                            onChange={toggleSelectAll}
                            className="w-4 h-4 accent-purple-600 cursor-pointer rounded"
                          />
                        </th>
                      )}
                      <th className="p-3.5 w-12 text-center font-extrabold text-slate-400">No</th>
                      <th className="p-3.5">Siswa</th>
                      <th className="p-3.5">Karya</th>
                      <th className="p-3.5 w-28 text-center">Nilai</th>
                      <th className="p-3.5 min-w-[200px]">Catatan Guru</th>
                      <th className="p-3.5 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSubmissions.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400 text-sm">
                          <p className="font-bold text-slate-600 mb-1">
                            {activeProjectFilter !== 'all'
                              ? `Belum ada karya untuk tugas "${data.projects.find((p) => String(p.id).trim() === String(activeProjectFilter).trim())?.title || 'terpilih'}"`
                              : `Belum ada karya ditemukan di ${activeFolderName}`}
                          </p>
                          {activeProjectFilter !== 'all' && totalClassSubmissions > 0 && (
                            <button
                              onClick={() => setActiveProjectFilter('all')}
                              className="text-xs font-bold text-purple-600 hover:text-purple-700 underline mt-1 cursor-pointer"
                            >
                              Tampilkan Semua Karya di {activeFolderName} ({totalClassSubmissions} karya)
                            </button>
                          )}
                        </td>
                      </tr>
                    ) : (
                      filteredSubmissions.map((sub, index) => {
                        const student = data.users.find((u) => u.id === sub.studentId);
                        const currentNilai =
                          drafts[sub.id]?.nilai !== undefined
                            ? drafts[sub.id].nilai
                            : sub.nilai || '';
                        const currentCatatan =
                          drafts[sub.id]?.catatan !== undefined
                            ? drafts[sub.id].catatan
                            : sub.catatan || sub.feedback || '';

                        return (
                          <tr key={sub.id} className="hover:bg-purple-50/40 transition-colors">
                            {isSelectMode && (
                              <td className="p-3.5 text-center">
                                <input
                                  type="checkbox"
                                  checked={selectedIds.includes(sub.id)}
                                  onChange={() => toggleSelect(sub.id)}
                                  className="w-4 h-4 accent-purple-600 cursor-pointer rounded"
                                />
                              </td>
                            )}
                            <td className="p-3.5 text-center text-xs font-black text-slate-400">
                              {index + 1}
                            </td>
                            <td className="p-3.5">
                              <div className="flex items-center gap-3">
                                <Avatar name={student?.name || '?'} photo={student?.photo} size={36} />
                                <div>
                                  <p className="font-bold text-slate-800 text-sm">
                                    {student?.name || 'Siswa'}
                                  </p>
                                  <p className="text-xs text-slate-400">{sub.title}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-3.5">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedImg({ ...sub, student })}
                                icon={<Eye size={14} />}
                              >
                                Lihat
                              </Button>
                            </td>
                            <td className="p-3.5">
                              <input
                                type="text"
                                inputMode="numeric"
                                placeholder="Nilai"
                                maxLength={3}
                                value={currentNilai}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/[^0-9]/g, '');
                                  setDrafts((prev) => ({
                                    ...prev,
                                    [sub.id]: { ...prev[sub.id], nilai: val },
                                  }));
                                }}
                                className="w-full text-center font-extrabold text-sm py-2 px-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </td>
                            <td className="p-3.5">
                              <input
                                type="text"
                                placeholder="Tulis catatan..."
                                value={currentCatatan}
                                onChange={(e) =>
                                  setDrafts((prev) => ({
                                    ...prev,
                                    [sub.id]: { ...prev[sub.id], catatan: e.target.value },
                                  }))
                                }
                                className="w-full text-xs font-medium py-2 px-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </td>
                            <td className="p-3.5 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <Button
                                  size="sm"
                                  onClick={async () => {
                                    await updateDocument('submissions', sub.id, {
                                      nilai: currentNilai,
                                      catatan: currentCatatan,
                                      feedback: currentCatatan,
                                    });
                                    showToast('Nilai tersimpan!');
                                  }}
                                >
                                  Kirim
                                </Button>
                                <button
                                  onClick={async () => {
                                    const confirmed = await showConfirm(
                                      `Yakin ingin menghapus karya "${sub.title}" milik ${student?.name || 'Siswa'} secara permanen? Karya ini juga akan terhapus dari akun siswa.`
                                    );
                                    if (confirmed) {
                                      await deleteDocument('submissions', sub.id);
                                      showToast('Karya siswa berhasil dihapus permanen');
                                    }
                                  }}
                                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl"
                                  title="Hapus Karya Ini Permanen"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-3 bg-purple-50/50 border-t border-purple-100/70 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-bold text-slate-500">
                <span>Total: <strong className="text-purple-700">{filteredSubmissions.length}</strong> karya</span>
                <span className="text-[11px] text-purple-600 font-semibold">Scroll vertikal untuk melihat karya lainnya ↓</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: "Belum Kumpul" Sidebar Tracker */}
        {activeFolder !== 'all' && (
          <div className="w-full lg:w-80 shrink-0">
            <div className="glass-card p-6 rounded-3xl sticky top-24 border border-rose-100 shadow-lg">
              {(() => {
                const studentsInFolder = data.users.filter((u) => {
                  if (u.role !== 'siswa') return false;
                  const cls = data.classes.find((c) => String(c.id).trim() === String(u.classId).trim());
                  const norm = cls
                    ? cls.name
                        .toLowerCase()
                        .replace(/kelas/gi, '')
                        .replace(/[^a-z0-9]/g, '')
                    : String(u.classId || '')
                        .toLowerCase()
                        .replace(/kelas/gi, '')
                        .replace(/[^a-z0-9]/g, '');
                  return norm === activeNorm;
                });

                const isProjectActive = activeProjectFilter !== 'all';
                const activeProjObj = isProjectActive
                  ? data.projects.find((p) => String(p.id).trim() === String(activeProjectFilter).trim())
                  : null;
                const activeProjTitle = activeProjObj ? activeProjObj.title.trim().toLowerCase() : '';

                const submissionsToCheck = isProjectActive
                  ? data.submissions.filter((s) => {
                      const subProjId = String(s.projectId || '').trim();
                      const filterId = String(activeProjectFilter).trim();
                      return subProjId === filterId || (activeProjTitle && subProjId.toLowerCase() === activeProjTitle);
                    })
                  : data.submissions;

                const submittedStudentIds = new Set(
                  submissionsToCheck.map((s) => String(s.studentId || '').trim().toLowerCase())
                );
                const missingStudents = studentsInFolder.filter(
                  (s) => !submittedStudentIds.has(String(s.id).trim().toLowerCase())
                );

                return (
                  <div>
                    <div className="flex items-center justify-between pb-4 border-b border-rose-100 mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                          <Users size={20} />
                        </div>
                        <div>
                          <KineticText
                            text="Belum Kumpul"
                            as="h4"
                            className="font-extrabold text-slate-800 text-sm block"
                          />
                          <KineticLine as="p" delay={0.05} className="text-[11px] text-slate-400">
                            {isProjectActive ? 'Tugas Terpilih' : 'Semua Tugas'}
                          </KineticLine>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-rose-500 text-white font-extrabold text-xs rounded-full shadow-md shadow-rose-500/20">
                        <KineticNumber value={missingStudents.length} />
                      </span>
                    </div>

                    <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                      {missingStudents.length === 0 ? (
                        <div className="py-8 text-center">
                          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Check size={24} />
                          </div>
                          <p className="font-bold text-emerald-600 text-sm">Luar Biasa!</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Semua siswa sudah mengumpulkan.
                          </p>
                        </div>
                      ) : (
                        missingStudents.map((m, i) => (
                          <div
                            key={m.id}
                            className="flex items-center gap-3 p-3 rounded-2xl bg-white hover:bg-rose-50/50 transition-colors border border-slate-100 shadow-sm"
                          >
                            <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-[11px] font-bold flex items-center justify-center shrink-0">
                              {i + 1}
                            </span>
                            <KineticLine
                              as="p"
                              delay={0.02 * Math.min(i, 8)}
                              className="text-xs font-bold text-slate-700 truncate"
                            >
                              {m.name}
                            </KineticLine>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox / SB3 Player with Left & Right Navigation */}
      {selectedImg && (() => {
        const selectedIndex = filteredSubmissions.findIndex((s) => s.id === selectedImg.id);
        const hasPrev = selectedIndex > 0;
        const hasNext = selectedIndex !== -1 && selectedIndex < filteredSubmissions.length - 1;

        const handlePrev = () => {
          if (hasPrev) {
            const prevSub = filteredSubmissions[selectedIndex - 1];
            const student = data.users.find((u) => u.id === prevSub.studentId);
            setSelectedImg({ ...prevSub, student });
          }
        };

        const handleNext = () => {
          if (hasNext) {
            const nextSub = filteredSubmissions[selectedIndex + 1];
            const student = data.users.find((u) => u.id === nextSub.studentId);
            setSelectedImg({ ...nextSub, student });
          }
        };

        const handleNavigate = (idx) => {
          if (idx >= 0 && idx < filteredSubmissions.length) {
            const targetSub = filteredSubmissions[idx];
            const student = data.users.find((u) => u.id === targetSub.studentId);
            setSelectedImg({ ...targetSub, student });
          }
        };

        return (
          <Lightbox
            item={selectedImg}
            items={filteredSubmissions}
            currentIndex={selectedIndex}
            onNavigate={handleNavigate}
            isScratch={isScratchProject(selectedImg, data.projects, data.classes, data.users)}
            onClose={() => setSelectedImg(null)}
            onPrev={handlePrev}
            onNext={handleNext}
            hasPrev={hasPrev}
            hasNext={hasNext}
            totalItems={filteredSubmissions.length}
            onDelete={async (subId) => {
              const currentSub = filteredSubmissions.find((s) => s.id === subId) || selectedImg;
              const student = data.users.find((u) => u.id === currentSub?.studentId);
              const confirmed = await showConfirm(
                `Yakin ingin menghapus karya "${currentSub?.title || 'karya'}" milik ${student?.name || 'Siswa'} secara permanen? Karya ini juga akan terhapus dari akun siswa.`
              );
              if (confirmed) {
                await deleteDocument('submissions', subId);
                showToast('Karya berhasil dihapus permanen');
                setSelectedImg(null);
              }
            }}
          />
        );
      })()}
    </motion.div>
  );
};
