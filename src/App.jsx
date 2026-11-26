import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Images,
  Settings,
  UploadCloud,
} from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { useData, ENABLE_LOCAL_RESCUE } from './context/DataContext';
import { LoginScreen } from './components/auth/LoginScreen';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LocalRescueModal } from './components/common/LocalRescueModal';
import { pageTransition } from './utils/motion';

// Teacher Views
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { TeacherStudents } from './components/teacher/TeacherStudents';
import { TeacherProjects } from './components/teacher/TeacherProjects';
import { TeacherGallery } from './components/teacher/TeacherGallery';
import { TeacherSettings } from './components/teacher/TeacherSettings';

// Student Views
import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentUpload } from './components/student/StudentUpload';
import { StudentGallery } from './components/student/StudentGallery';

export const App = () => {
  const { user, login, logout } = useAuth();
  const { data, supabaseReady, pendingLocalSubmissions } = useData();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [rescueOpen, setRescueOpen] = useState(false);
  const [rescueDismissed, setRescueDismissed] = useState(false);

  const isLegacyDomain =
    typeof window !== 'undefined' && window.location.hostname.endsWith('.vercel.app');

  // Buka otomatis popup rescue saat:
  // 1) Siswa masuk ke Dashboard dan ditemukan karya tersangkut di laptop tersebut, ATAU
  // 2) Laptop membuka domain lama .vercel.app yang masih menyimpan karya tersangkut.
  useEffect(() => {
    if (!ENABLE_LOCAL_RESCUE || !supabaseReady) return;

    if (isLegacyDomain && pendingLocalSubmissions.length === 0) {
      // Semua karya di domain .vercel.app sudah ada di Supabase: bersihkan cache lama & alihkan ke .my.id
      try {
        localStorage.removeItem('galeri_local_submissions');
      } catch {}
      window.location.replace(
        'https://kirimtugaskomputer.my.id' + window.location.pathname + window.location.search
      );
      return;
    }

    const isStudentUser = Boolean(user && user.role !== 'guru');
    if (pendingLocalSubmissions.length > 0 && !rescueDismissed) {
      if (isLegacyDomain || (isStudentUser && (activeMenu === 'dashboard' || activeMenu === 'upload'))) {
        setRescueOpen(true);
      }
    }
  }, [supabaseReady, pendingLocalSubmissions.length, isLegacyDomain, user, activeMenu, rescueDismissed]);

  const teacherMenus = [
    { id: 'dashboard', label: 'Dashboard', short: 'Beranda', icon: LayoutDashboard },
    { id: 'students', label: 'Data Siswa', short: 'Siswa', icon: Users },
    { id: 'projects', label: 'Kelola Project', short: 'Project', icon: FolderKanban },
    { id: 'gallery', label: 'Galeri Karya', short: 'Galeri', icon: Images },
    { id: 'settings', label: 'Pengaturan', short: 'Atur', icon: Settings },
  ];

  const studentMenus = [
    { id: 'dashboard', label: 'Dashboard', short: 'Beranda', icon: LayoutDashboard },
    { id: 'upload', label: 'Upload Karya', short: 'Upload', icon: UploadCloud },
    { id: 'gallery', label: 'Karya Saya', short: 'Karya', icon: Images },
  ];

  const rescueModalNode = ENABLE_LOCAL_RESCUE ? (
    <LocalRescueModal
      isOpen={rescueOpen}
      onClose={() => {
        setRescueOpen(false);
        setRescueDismissed(true);
      }}
      isLegacyDomain={isLegacyDomain}
    />
  ) : null;

  if (!user) {
    return (
      <>
        <LoginScreen
          onLogin={(userData) => {
            login(userData);
            setActiveMenu('dashboard');
            setRescueDismissed(false);
          }}
        />
        {rescueModalNode}
      </>
    );
  }

  const isTeacher = user.role === 'guru';
  const menus = isTeacher ? teacherMenus : studentMenus;
  const currentUser = data.users.find((u) => u.id === user.id) || user;

  return (
    <>
      <DashboardLayout
        user={currentUser}
        menuItems={menus}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        onLogout={() => {
          setRescueDismissed(false);
          logout();
        }}
      >
        <ErrorBoundary>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMenu}
              variants={pageTransition}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
            >
              {isTeacher ? (
                <>
                  {activeMenu === 'dashboard' && <TeacherDashboard setView={setActiveMenu} />}
                  {activeMenu === 'students' && <TeacherStudents />}
                  {activeMenu === 'projects' && <TeacherProjects />}
                  {activeMenu === 'gallery' && <TeacherGallery />}
                  {activeMenu === 'settings' && <TeacherSettings setView={setActiveMenu} />}
                </>
              ) : (
                <>
                  {activeMenu === 'dashboard' && (
                    <StudentDashboard
                      setView={setActiveMenu}
                      onOpenRescue={() => {
                        setRescueDismissed(false);
                        setRescueOpen(true);
                      }}
                    />
                  )}
                  {activeMenu === 'upload' && (
                    <StudentUpload
                      setView={setActiveMenu}
                      onOpenRescue={() => {
                        setRescueDismissed(false);
                        setRescueOpen(true);
                      }}
                    />
                  )}
                  {activeMenu === 'gallery' && <StudentGallery />}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </ErrorBoundary>
      </DashboardLayout>
      {rescueModalNode}
    </>
  );
};
