import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UploadCloud,
  CheckCircle2,
  FileCode,
  FileText,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Input } from '../common/Input';
import { extFromMime, isProjectForStudent } from '../../utils/helpers';
import { springBounce, fadeInScale, popCard } from '../../utils/motion';
import { KineticText, KineticLine } from '../common/MotionTypography';

export const StudentUpload = ({ setView }) => {
  const { data, addDocument } = useData();
  const { user } = useAuth();
  const showToast = useToast();

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const animFrameRef = useRef(null);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const [formData, setFormData] = useState({ projectId: '', title: '', fileData: '' });
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');

  const activeProjects = (data.projects || []).filter((p) => {
    const status = String(p.status || 'aktif').trim().toLowerCase();
    return status === 'aktif' && isProjectForStudent(p, user);
  });

  const mySubmissions = (data.submissions || []).filter(
    (s) => String(s.studentId).trim().toLowerCase() === String(user?.id).trim().toLowerCase()
  );
  const availableProjects = activeProjects.filter(
    (p) => !mySubmissions.some((s) => String(s.projectId).trim() === String(p.id).trim())
  );

  useEffect(() => {
    if (
      formData.projectId &&
      !availableProjects.some((p) => String(p.id) === String(formData.projectId))
    ) {
      setFormData((prev) => ({ ...prev, projectId: '' }));
    }
  }, [availableProjects, formData.projectId]);

  const userClassObj = data.classes.find((c) => c.id === user?.classId);
  const isClass5 = userClassObj ? userClassObj.name.includes('5') : false;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    if (isClass5 && !['jpg', 'jpeg', 'png', 'pdf'].includes(ext)) {
      e.target.value = '';
      return showToast('Khusus Kelas 5, format karya wajib berupa JPG, PNG, atau PDF ya!', 'error');
    }

    if (file.size > 5 * 1024 * 1024) {
      return showToast('Ukuran file maksimal 5MB ya!', 'error');
    }

    setIsUploading(true);
    setFileName(file.name);

    try {
      let base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });

      if (file.name.toLowerCase().endsWith('.sb3')) {
        base64 = base64.replace(/^data:[^;]*;/, 'data:application/x-scratch-sb3;');
      }

      setFormData((prev) => ({ ...prev, fileData: base64 }));

      if (file.type.startsWith('image/')) {
        setPreview({ type: 'image', url: base64 });
      } else if (file.name.toLowerCase().endsWith('.sb3')) {
        setPreview({ type: 'scratch', name: file.name });
      } else {
        setPreview({ type: 'document', name: file.name });
      }
    } catch {
      showToast('Gagal memproses file', 'error');
    }
    setIsUploading(false);
  };

  const handleFinalizeSubmit = async () => {
    try {
      const ext = fileName ? fileName.split('.').pop().toLowerCase() : '';
      const submissionPayload = {
        ...formData,
        fileName,
        fileExt: ext,
        studentId: user?.id,
        studentName: user?.name || '',
        classId: user?.classId || '',
        className: userClassObj?.name || '',
        createdAt: new Date().toISOString(),
      };
      await addDocument('submissions', submissionPayload);
      showToast('Karyamu berhasil dikirim!');
      setTimeout(() => {
        setView('gallery');
      }, 400);
    } catch {
      showToast('Gagal mengupload karya', 'error');
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.projectId) return showToast('Pilih tugas yang dikerjakan', 'error');
    if (!formData.title.trim()) return showToast('Tuliskan judul karyamu', 'error');
    if (!formData.fileData) return showToast('Pilih file karyamu terlebih dahulu', 'error');

    setIsSubmitting(true);
    setUploadProgress(0);

    const startTime = performance.now();
    // Kecepatan medium yang tenang, presisi dan pas: 2800ms (2.8 detik)
    const duration = 2800;

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    let lastProgress = -1;

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(Math.round((elapsed / duration) * 100), 100);

      if (progress !== lastProgress) {
        lastProgress = progress;
        setUploadProgress(progress);
      }

      if (elapsed < duration) {
        animFrameRef.current = requestAnimationFrame(tick);
      } else {
        setUploadProgress(100);
        handleFinalizeSubmit();
      }
    };

    animFrameRef.current = requestAnimationFrame(tick);
  };

  if (availableProjects.length === 0) {
    return (
      <Card className="max-w-lg mx-auto py-12 px-6 text-center border-purple-100">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl mx-auto flex items-center justify-center mb-4 shadow-sm">
          <CheckCircle2 size={36} />
        </div>
        <KineticText
          text="Semua Tugas Sudah Dikumpul!"
          as="h3"
          className="text-xl font-extrabold text-slate-800 mb-2 block"
        />
        <KineticLine as="p" delay={0.06} className="text-slate-500 text-sm max-w-sm mx-auto mb-6 leading-relaxed">
          Hebat sekali! Kamu sudah menyelesaikan semua tugas aktif saat ini.
        </KineticLine>
        <Button onClick={() => setView('gallery')}>Lihat Karyaku</Button>
      </Card>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={fadeInScale}
      className="max-w-2xl mx-auto space-y-6"
    >
      <div className="text-center">
        <KineticText
          text="Upload Karya Baru"
          as="h2"
          className="text-2xl font-extrabold text-slate-800 tracking-tight"
        />
        <KineticLine as="p" delay={0.06} className="text-xs text-slate-500 mt-1">
          Kirimkan file karyamu agar bisa dinilai dan diapresiasi oleh Guru
        </KineticLine>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Project Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
              Pilih Tugas / Project <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              required
              disabled={isSubmitting}
              className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-medium shadow-sm transition-all disabled:opacity-60"
            >
              <option value="">-- Pilih Tugas yang Dikerjakan --</option>
              {availableProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <Input
            label="Judul Karyamu"
            required
            disabled={isSubmitting}
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Contoh: Game Tembak Balon Keren / Poster Lingkungan"
          />

          {/* File Upload Box */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
              File Karya {isClass5 ? '(Khusus Kelas 5: JPG, PNG, atau PDF)' : '(Gambar / Dokumen / Scratch .sb3)'}{' '}
              <span className="text-rose-500">*</span>
            </label>

            <motion.div
              whileHover={isSubmitting ? {} : { scale: 1.01 }}
              whileTap={isSubmitting ? {} : { scale: 0.99 }}
              transition={springBounce}
              onClick={() => {
                if (!isSubmitting) document.getElementById('student-file-input').click();
              }}
              className={`border-2 border-dashed border-purple-200 hover:border-purple-400 rounded-3xl p-8 text-center bg-purple-50/30 hover:bg-purple-50/60 transition-all cursor-pointer relative ${
                isSubmitting ? 'pointer-events-none opacity-60' : ''
              }`}
            >
              <input
                type="file"
                id="student-file-input"
                className="hidden"
                disabled={isSubmitting}
                onChange={handleFileChange}
                accept={isClass5 ? ".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf" : ".jpg,.jpeg,.png,.pdf,.ppt,.pptx,.xls,.xlsx,.sb3"}
              />

              {preview ? (
                <div className="flex flex-col items-center">
                  {preview.type === 'image' && (
                    <img
                      src={preview.url}
                      alt="Preview"
                      className="max-h-48 rounded-2xl shadow-md mb-3 object-contain"
                    />
                  )}
                  {preview.type === 'scratch' && (
                    <div className="flex flex-col items-center text-purple-600 mb-2">
                      <FileCode size={48} />
                      <span className="font-extrabold text-sm text-slate-800 mt-2">
                        {preview.name}
                      </span>
                    </div>
                  )}
                  {preview.type === 'document' && (
                    <div className="flex flex-col items-center text-indigo-600 mb-2">
                      <FileText size={48} />
                      <span className="font-extrabold text-sm text-slate-800 mt-2">
                        {preview.name}
                      </span>
                    </div>
                  )}
                  <p className="text-xs text-emerald-600 font-bold mt-1">
                    File siap diupload! Klik untuk mengganti.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-slate-500">
                  <div className="w-16 h-16 rounded-3xl bg-purple-100 text-purple-600 flex items-center justify-center mb-3 shadow-inner">
                    <UploadCloud size={32} />
                  </div>
                  <p className="font-extrabold text-slate-700 text-sm">
                    Klik untuk memilih file karyamu
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Format didukung: JPG, PNG, PDF, PPT, Excel, SB3 Scratch (Maks. 5MB)
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Submit Action Area: Progress Bar or Button */}
          {isSubmitting ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full pt-10 pb-2 px-2 flex flex-col items-center"
            >
              {/* Animated Progress Bar Container matching User Reference Image */}
              <div className="relative w-full max-w-lg">
                {/* Floating Tooltip Bubble with Percentage & Downward Pointer */}
                <motion.div
                  initial={{ left: '5%' }}
                  animate={{ left: '95%' }}
                  transition={{ duration: 2.8, ease: 'linear' }}
                  className="absolute -top-11 -translate-x-1/2 flex flex-col items-center pointer-events-none z-10 will-change-transform"
                >
                  <div className="bg-[#242e35] text-white font-extrabold text-xs sm:text-sm px-3 py-1 rounded-xl shadow-md border border-slate-700/60 flex items-center justify-center">
                    {uploadProgress}%
                  </div>
                  <div className="w-0 h-0 border-x-[5px] border-x-transparent border-t-[6px] border-t-[#242e35] -mt-[0.5px]" />
                </motion.div>

                {/* Outer Pill Track with Clean Charcoal Outline */}
                <div className="w-full h-8 sm:h-9 bg-white rounded-full border-[3px] border-[#242e35] p-[3px] shadow-sm flex items-center overflow-hidden">
                  {/* Sage / Forest Green Fill Bar */}
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2.8, ease: 'linear' }}
                    className="h-full rounded-full shadow-sm will-change-[width]"
                    style={{
                      backgroundColor: '#477d5f',
                    }}
                  />
                </div>
              </div>

              <p className="text-xs font-bold text-slate-500 mt-3 animate-pulse text-center">
                {uploadProgress < 100
                  ? `Mengirim file karya ke Guru... (${uploadProgress}%)`
                  : 'Selesai 100%! Menyimpan ke Galeri...'}
              </p>
            </motion.div>
          ) : (
            <Button
              type="submit"
              disabled={
                isUploading || isSubmitting || !formData.projectId || !formData.title || !formData.fileData
              }
              className="w-full py-4 text-base rounded-2xl"
              icon={<UploadCloud size={20} />}
            >
              Kirim Karya Sekarang
            </Button>
          )}
        </form>
      </Card>
    </motion.div>
  );
};
