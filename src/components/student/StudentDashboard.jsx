import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  Camera,
  UploadCloud,
  GraduationCap,
  Sparkles,
  X,
  ArrowRight,
  Star,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StatsCard } from '../common/StatsCard';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { compressAvatar, driveThumb, getDriveId, isProjectForStudent } from '../../utils/helpers';
import { springBounce, staggerContainer, staggerCards, popCard, fadeInScale } from '../../utils/motion';
import { KineticText, KineticLine, KineticNumber } from '../common/MotionTypography';

export const StudentDashboard = ({ setView }) => {
  const { data, updateDocument } = useData();
  const { user, updateUser } = useAuth();
  const showToast = useToast();
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoError, setPhotoError] = useState(false);
  const [viewPhoto, setViewPhoto] = useState(false);

  useEffect(() => {
    setPhotoError(false);
  }, [user.photo]);

  const activeProjects = (data.projects || []).filter((p) => {
    const status = String(p.status || 'aktif').trim().toLowerCase();
    return status === 'aktif' && isProjectForStudent(p, user);
  });

  const mySubmissions = (data.submissions || []).filter(
    (s) => String(s.studentId).trim() === String(user?.id).trim()
  );
  const pendingProjects = activeProjects.filter(
    (p) => !mySubmissions.some((s) => s.projectId === p.id)
  );

  const handlePhotoPick = async (e) => {
    const file = e.target.files[0];
    e.target.value = null;
    if (!file) return;
    if (!file.type.startsWith('image/')) return showToast('File harus berupa gambar', 'error');

    setPhotoLoading(true);
    try {
      const dataUrl = await compressAvatar(file);
      setPhotoError(false);
      await updateDocument('users', user.id, { photo: dataUrl });
      updateUser({ photo: dataUrl });
      showToast('Foto profil berhasil diperbarui');
    } catch {
      showToast('Gagal memproses foto', 'error');
    }
    setPhotoLoading(false);
  };

  const handleRemovePhoto = async () => {
    setPhotoLoading(true);
    try {
      await updateDocument('users', user.id, { photo: '' });
      updateUser({ photo: '' });
      showToast('Foto profil dihapus');
    } catch {
      showToast('Gagal menghapus foto', 'error');
    }
    setPhotoLoading(false);
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Student Hero Banner */}
      <motion.div
        variants={fadeInScale}
        className="relative overflow-hidden rounded-4xl bg-[#0B0D18] border border-white/15 p-6 sm:p-9 text-white shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
      >
        {/* Background Image from Login */}
        <img
          src="/login-bg.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-[center_35%] opacity-70 pointer-events-none select-none"
        />

        {/* Cinematic Dark Gradient Tint (Balanced contrast for text & scenic mountain view) */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-purple-950/40 pointer-events-none" />

        {/* Ambient Subtle Glow */}
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-gradient-to-br from-violet-600/25 to-fuchsia-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-gradient-to-tr from-indigo-600/20 to-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
          {/* Avatar Profile Frame */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <input
              type="file"
              id="student-self-photo"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoPick}
            />
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={springBounce}
                onClick={
                  user.photo && !photoError
                    ? () => setViewPhoto(true)
                    : () => document.getElementById('student-self-photo').click()
                }
                className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white/90 shadow-2xl bg-white/10 flex items-center justify-center ring-4 ring-purple-500/20 ${
                  user.photo && !photoError ? 'cursor-zoom-in' : 'cursor-pointer'
                }`}
              >
                {photoLoading ? (
                  <span className="text-xs font-bold animate-pulse text-white">Menyimpan...</span>
                ) : user.photo && !photoError ? (
                  <img
                    src={driveThumb(user.photo, 400)}
                    alt={user.name}
                    onError={(e) => {
                      const dId = getDriveId(user.photo);
                      if (dId && !e.target.src.includes('thumbnail')) {
                        e.target.src = `https://drive.google.com/thumbnail?id=${dId}&sz=w400`;
                      } else {
                        setPhotoError(true);
                      }
                    }}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-white/80">
                    <Camera size={32} />
                    <span className="text-[11px] font-bold mt-1">Pasang Foto</span>
                  </div>
                )}
              </motion.div>
              <button
                type="button"
                disabled={photoLoading}
                onClick={() => document.getElementById('student-self-photo').click()}
                className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-gradient-to-tr from-violet-600 to-purple-600 text-white shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform border-2 border-[#0F111A]"
              >
                <Camera size={18} />
              </button>
            </div>
          </div>

          {/* Student Greeting */}
          <div className="text-center sm:text-left flex-1">
            {/* Badge Siswa Komputer */}
            <KineticLine
              as="div"
              delay={0.05}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-purple-200 mb-2"
            >
              <GraduationCap size={13} className="text-purple-300" />
              <span>Siswa Komputer</span>
            </KineticLine>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex flex-wrap items-baseline gap-2 justify-center sm:justify-start">
              <KineticText text="Hai," as="span" />
              <span className="font-handwriting font-bold text-3xl sm:text-4xl text-amber-200 tracking-wide drop-shadow-[0_2px_8px_rgba(251,191,36,0.3)]">
                <KineticText text={user.name} as="span" delay={0.15} />
              </span>
            </h1>
            <div className="mt-6 flex justify-center sm:justify-start">
              <Button
                onClick={() => setView('upload')}
                className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white shadow-[0_4px_22px_rgba(139,92,246,0.55)] border border-purple-400/30 hover:opacity-95 py-3 px-6 text-sm font-extrabold"
                icon={<UploadCloud size={20} />}
              >
                Upload Karya Sekarang
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3 Stats Cards with Staggered Punchy Pop (Sequential ripple) */}
      <motion.div
        variants={staggerCards}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-3 gap-5"
      >
        <StatsCard
          title="Tugas Aktif"
          value={activeProjects.length}
          icon={FolderKanban}
          iconBg="bg-purple-100 text-purple-600"
          onClick={() => setView('upload')}
        />
        <StatsCard
          title="Sudah Dikumpul"
          value={mySubmissions.length}
          icon={CheckCircle2}
          iconBg="bg-emerald-100 text-emerald-600"
          onClick={() => setView('gallery')}
        />
        <StatsCard
          title="Belum Dikumpul"
          value={pendingProjects.length}
          icon={Clock}
          iconBg="bg-amber-100 text-amber-600"
          onClick={() => setView('upload')}
        />
      </motion.div>

      {/* 2-Column Responsive Section: Tugas Perlu Dikerjakan & Karya Terbaru */}
      <motion.div
        variants={staggerCards}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full"
      >
        {/* Card 1: Tugas yang Perlu Dikerjakan */}
        <motion.div variants={popCard}>
          <Card className="p-0 overflow-hidden h-full flex flex-col">
            <div className="p-5 sm:p-6 border-b border-purple-100/60 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <FolderKanban size={18} className="text-purple-600 shrink-0" />
                  <KineticText
                    text="Tugas yang Perlu Dikerjakan"
                    as="h3"
                    className="font-black text-slate-800 text-base"
                  />
                </div>
                <KineticLine as="p" delay={0.06} className="text-xs text-slate-400 mt-0.5">
                  {pendingProjects.length > 0
                    ? `${pendingProjects.length} tugas menunggu sentuhan karyamu`
                    : 'Semua tugas telah kamu kumpulkan!'}
                </KineticLine>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setView('upload')}
                icon={<ArrowRight size={16} />}
              >
                Upload
              </Button>
            </div>

            <div className="p-5 sm:p-6 flex-1">
              {pendingProjects.length > 0 ? (
                <div className="space-y-3">
                  {pendingProjects.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100/70 hover:bg-purple-50 transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <KineticText
                          text={proj.title}
                          as="h4"
                          className="font-extrabold text-slate-800 text-sm truncate block"
                        />
                        <KineticLine
                          as="p"
                          delay={0.05}
                          className="text-xs text-slate-500 mt-0.5 line-clamp-1"
                        >
                          {proj.description || 'Belum ada deskripsi'}
                        </KineticLine>
                        {proj.deadline && (
                          <KineticLine
                            as="span"
                            delay={0.08}
                            className="inline-block mt-2 text-[10px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full"
                          >
                            Batas: {new Date(proj.deadline).toLocaleDateString('id-ID')}
                          </KineticLine>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => setView('upload')}
                        className="shrink-0 text-xs py-2 px-3.5"
                      >
                        Kumpul
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                    <CheckCircle2 size={24} />
                  </div>
                  <KineticText
                    text="Semua Tugas Selesai"
                    as="p"
                    className="font-extrabold text-slate-700 text-sm"
                  />
                  <KineticLine as="p" delay={0.06} className="text-xs text-slate-400 mt-1 max-w-xs">
                    Kerja bagus! Seluruh tugas aktif telah berhasil kamu kumpulkan.
                  </KineticLine>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Card 2: Karya Terbaru yang Sudah Dikumpul */}
        <motion.div variants={popCard}>
          <Card className="p-0 overflow-hidden h-full flex flex-col">
            <div className="p-5 sm:p-6 border-b border-purple-100/60 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Star size={18} className="text-amber-500 shrink-0" />
                  <KineticText
                    text="Karya Terbaru Saya"
                    as="h3"
                    className="font-black text-slate-800 text-base"
                  />
                </div>
                <KineticLine as="p" delay={0.06} className="text-xs text-slate-400 mt-0.5">
                  {mySubmissions.length > 0
                    ? `${mySubmissions.length} karya telah tersimpan`
                    : 'Belum ada karya yang diupload'}
                </KineticLine>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setView('gallery')}
                icon={<ArrowRight size={16} />}
              >
                Galeri Saya
              </Button>
            </div>

            <div className="p-5 sm:p-6 flex-1">
              {mySubmissions.length > 0 ? (
                <div className="space-y-3">
                  {mySubmissions.slice(0, 4).map((sub) => {
                    const project = data.projects.find((p) => p.id === sub.projectId);
                    return (
                      <div
                        key={sub.id}
                        onClick={() => setView('gallery')}
                        className="p-3.5 rounded-2xl bg-white/70 border border-purple-100/60 hover:bg-purple-50/50 transition-colors flex items-center justify-between gap-3 cursor-pointer"
                      >
                        <div className="min-w-0 flex-1">
                          <KineticText
                            text={sub.title || project?.title || 'Karya Siswa'}
                            as="h4"
                            className="font-extrabold text-slate-800 text-sm truncate block"
                          />
                          <KineticLine
                            as="p"
                            delay={0.05}
                            className="text-xs text-slate-400 mt-0.5 truncate"
                          >
                            {project?.title || 'Project'} &bull; {new Date(sub.createdAt).toLocaleDateString('id-ID')}
                          </KineticLine>
                        </div>
                        {sub.score ? (
                          <KineticLine
                            as="div"
                            delay={0.08}
                            className="shrink-0 px-2.5 py-1 rounded-xl bg-purple-100 text-purple-700 font-black text-xs"
                          >
                            ⭐ {sub.score}
                          </KineticLine>
                        ) : (
                          <KineticLine
                            as="span"
                            delay={0.08}
                            className="shrink-0 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200"
                          >
                            Menunggu Dinilai
                          </KineticLine>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
                    <UploadCloud size={24} />
                  </div>
                  <p className="font-extrabold text-slate-700 text-sm">Belum Ada Karya</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    Yuk kumpulkan tugas pertamamu sekarang dan raih nilai terbaik dari guru!
                  </p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Fullscreen Photo Lightbox */}
      {viewPhoto && user.photo && !photoError && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          <div
            className="fixed inset-0 z-[9999999] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6"
            onClick={() => setViewPhoto(false)}
          >
            <button
              onClick={() => setViewPhoto(false)}
              className="absolute top-5 right-5 text-white p-3 bg-white/10 hover:bg-white/20 rounded-full"
            >
              <X size={24} />
            </button>
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={springBounce}
              src={driveThumb(user.photo, 800)}
              alt={user.name}
              onClick={(e) => e.stopPropagation()}
              className="w-72 h-72 sm:w-96 sm:h-96 rounded-full object-cover border-4 border-white shadow-2xl"
            />
            <p className="mt-5 text-white font-extrabold text-lg">{user.name}</p>
          </div>
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
  );
};
