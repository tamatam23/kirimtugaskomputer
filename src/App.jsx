import React, { useState } from 'react';
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
import { useData } from './context/DataContext';
import { LoginScreen } from './components/auth/LoginScreen';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ErrorBoundary } from './components/common/ErrorBoundary';
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
  const { data } = useData();
  const [activeMenu, setActiveMenu] = useState('dashboard');

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

  if (!user) {
    return <LoginScreen onLogin={(userData) => { login(userData); setActiveMenu('dashboard'); }} />;
  }

  const isTeacher = user.role === 'guru';
  const menus = isTeacher ? teacherMenus : studentMenus;
  const currentUser = data.users.find((u) => u.id === user.id) || user;

  return (
    <DashboardLayout
      user={currentUser}
      menuItems={menus}
      activeMenu={activeMenu}
      setActiveMenu={setActiveMenu}
      onLogout={logout}
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
                {activeMenu === 'dashboard' && <StudentDashboard setView={setActiveMenu} />}
                {activeMenu === 'upload' && <StudentUpload setView={setActiveMenu} />}
                {activeMenu === 'gallery' && <StudentGallery />}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </ErrorBoundary>
    </DashboardLayout>
  );
};
