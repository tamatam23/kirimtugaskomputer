import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  FolderKanban,
  Images,
  Clock,
  Camera,
  Plus,
  Settings,
  ArrowRight,
  Sparkles,
  X,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StatsCard } from '../common/StatsCard';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Avatar } from '../common/Avatar';
import { compressAvatar, driveThumb, getDriveId, getProjectTargetStudents } from '../../utils/helpers';
import { springBounce, staggerContainer, staggerCards, popCard, fadeInScale } from '../../utils/motion';
import { KineticText, KineticLine } from '../common/MotionTypography';

export const TeacherDashboard = ({ setView }) => {
  const { data, updateDocument } = useData();
  const { user, updateUser } = useAuth();
  const showToast = useToast();
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoError, setPhotoError] = useState(false);
  const [viewPhoto, setViewPhoto] = useState(false);

  useEffect(() => {
    setPhotoError(false);
  }, [user.photo]);

  const totalSiswa = data.users.filter((u) => u.role === 'siswa').length;
  const totalProject = data.projects.length;
  const totalKarya = data.submissions.length;
  const activeProjects = data.projects.filter((p) => p.status === 'aktif');
  const expectedSubmissions = activeProjects.reduce((total, p) => {
    const targets = getProjectTargetStudents(p);
    if (targets.length > 0) return total + targets.length;
    if (!p.classId || p.classId === 'all' || (Array.isArray(p.classId) && (p.classId.includes('all') || p.classId.length === 0))) {
      return total + totalSiswa;
    }
    const cids = Array.isArray(p.classId) ? p.classId : [p.classId];
    const classStudentsCount = data.users.filter((u) => u.role === 'siswa' && cids.includes(u.classId)).length;
    return total + classStudentsCount;
  }, 0);
  const actualSubmissions = data.submissions.filter((s) =>
    activeProjects.some((p) => p.id === s.projectId)
  ).length;
  const belumKumpul = Math.max(0, expectedSubmissions - actualSubmissions);

  const recentSubmissions = [...data.submissions]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const handlePhotoPick = async (e) => {
    const file = e.target.files[0];
    e.target.value = null;
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      return showToast('File harus berupa gambar', 'error');
    }
    setPhotoLoading(true);
    try {
      const dataUrl = await compressAvatar(file);
      setPhotoError(false);
      await updateDocument('users', user.id, { photo: dataUrl });
      updateUser({ photo: dataUrl });
      showToast('Foto profil berhasil diperbarui');
    } catch (err) {
      console.error(err);
      showToast('Gagal memproses foto', 'error');
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
      {/* Hero Welcome Banner */}
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
              id="teacher-self-photo"
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
                    : () => document.getElementById('teacher-self-photo').click()
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
                onClick={() => document.getElementById('teacher-self-photo').click()}
                className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-gradient-to-tr from-violet-600 to-purple-600 text-white shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform border-2 border-[#0F111A]"
              >
                <Camera size={18} />
              </button>
            </div>
          </div>

          {/* Greeting text & Quick Actions */}
          <div className="text-center sm:text-left flex-1">
            {/* Badge Panel Guru */}
            <KineticLine delay={0.04} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-purple-200 mb-2">
              <FolderKanban size={13} className="text-purple-300" />
              <span>Panel Guru</span>
            </KineticLine>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex flex-wrap items-baseline gap-2 justify-center sm:justify-start">
              <KineticText text="Selamat Datang," as="span" />
              <span className="font-handwriting font-bold text-3xl sm:text-4xl text-amber-200 tracking-wide drop-shadow-[0_2px_8px_rgba(251,191,36,0.3)]">
                <KineticText text={user.name} as="span" delay={0.12} />
              </span>
            </h1>
            <div className="flex flex-wrap gap-3 mt-6 justify-center sm:justify-start">
              <Button
                onClick={() => setView('projects')}
                variant="primary"
                className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white shadow-[0_4px_22px_rgba(139,92,246,0.55)] border border-purple-400/30 hover:opacity-95 py-3 px-6 text-sm font-extrabold"
                icon={<Plus size={18} />}
              >
                Buat Project Baru
              </Button>
              <Button
                onClick={() => setView('settings')}
                variant="outline"
                className="bg-purple-950/40 hover:bg-purple-900/60 text-white border-2 border-purple-400/70 shadow-[0_0_22px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.75)] backdrop-blur-md py-3 px-6 text-sm font-extrabold transition-all"
                icon={<Settings size={18} className="text-purple-300" />}
              >
                Pengaturan
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 4 Stats Cards with Staggered Punchy Pop (Sequential ripple) */}
      <motion.div
        variants={staggerCards}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
      >
        <StatsCard
          title="Siswa Terdaftar"
          value={totalSiswa}
          icon={Users}
          iconBg="bg-indigo-100 text-indigo-600"
          onClick={() => setView('students')}
        />
        <StatsCard
          title="Total Project"
          value={totalProject}
          icon={FolderKanban}
          iconBg="bg-purple-100 text-purple-600"
          onClick={() => setView('projects')}
        />
        <StatsCard
          title="Total Karya"
          value={totalKarya}
          icon={Images}
          iconBg="bg-emerald-100 text-emerald-600"
          onClick={() => setView('gallery')}
        />
        <StatsCard
          title="Belum Kumpul (Aktif)"
          value={belumKumpul}
          icon={Clock}
          iconBg="bg-rose-100 text-rose-600"
          onClick={() => setView('gallery')}
        />
      </motion.div>

      {/* Recent Submissions Card */}
      <motion.div variants={popCard}>
        <Card className="p-0 overflow-hidden">
          <div className="p-6 border-b border-purple-100/60 flex items-center justify-between">
            <div>
              <KineticText
                text="Aktivitas Pengumpulan Terbaru"
                as="h3"
                className="font-extrabold text-slate-800 text-base"
              />
              <KineticLine delay={0.06} as="p" className="text-xs text-slate-400 mt-0.5">
                Karya-karya yang baru saja masuk
              </KineticLine>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView('gallery')}
              icon={<ArrowRight size={16} />}
            >
              Lihat Semua
            </Button>
          </div>

          {recentSubmissions.length > 0 ? (
            <motion.div
              variants={staggerCards}
              initial="hidden"
              animate="show"
              className="divide-y divide-slate-100"
            >
              {recentSubmissions.map((sub) => {
                const student = data.users.find((u) => u.id === sub.studentId);
                const project = data.projects.find((p) => p.id === sub.projectId);
                return (
                  <motion.div
                    key={sub.id}
                    variants={popCard}
                    className="p-4 sm:p-5 flex items-center justify-between hover:bg-purple-50/40 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <Avatar name={student?.name || '?'} photo={student?.photo} size={42} />
                      <div>
                        <KineticLine className="font-bold text-slate-800 text-sm">
                          {student?.name || 'Siswa'}
                        </KineticLine>
                        <KineticLine delay={0.06} className="text-xs text-slate-500">
                          {project?.title || sub.title} &bull;{' '}
                          {new Date(sub.createdAt).toLocaleDateString('id-ID')}
                        </KineticLine>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setView('gallery')}
                    >
                      Buka
                    </Button>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <div className="p-12 text-center text-slate-400 text-sm font-medium">
              Belum ada karya yang dikumpulkan saat ini.
            </div>
          )}
        </Card>
      </motion.div>

      {/* Zoom Profile Photo Modal */}
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
