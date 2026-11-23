import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Camera,
  Eye,
  EyeOff,
  Link,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Input } from '../common/Input';
import { compressAvatar, driveThumb, getDriveId, hashPassword } from '../../utils/helpers';
import { getApiUrl, setApiUrl } from '../../services/api';
import { springBounce, fadeInScale, popCard } from '../../utils/motion';
import { KineticText, KineticLine } from '../common/MotionTypography';

export const TeacherSettings = ({ setView }) => {
  const { user, updateUser } = useAuth();
  const { updateDocument, loadData } = useData();
  const showToast = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    password: '',
  });
  const [photo, setPhoto] = useState(user?.photo || '');
  const [isSaving, setIsSaving] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoError, setPhotoError] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [viewPhoto, setViewPhoto] = useState(false);

  useEffect(() => {
    setPhotoError(false);
  }, [photo]);

  // Google Apps Script API Connection
  const [apiUrlInput, setApiUrlInput] = useState(getApiUrl());
  const [isTestingApi, setIsTestingApi] = useState(false);

  const handlePhotoPick = async (e) => {
    const file = e.target.files[0];
    e.target.value = null;
    if (!file) return;
    if (!file.type.startsWith('image/')) return showToast('File harus berupa gambar', 'error');

    setPhotoLoading(true);
    try {
      const dataUrl = await compressAvatar(file);
      setPhotoError(false);
      setPhoto(dataUrl);
      await updateDocument('users', user.id, { photo: dataUrl });
      updateUser({ photo: dataUrl });
      showToast('Foto profil berhasil diperbarui');
    } catch (err) {
      showToast('Gagal memproses foto', 'error');
    }
    setPhotoLoading(false);
  };

  const handleRemovePhoto = async () => {
    setPhotoLoading(true);
    try {
      setPhoto('');
      await updateDocument('users', user.id, { photo: '' });
      updateUser({ photo: '' });
      showToast('Foto profil guru dihapus');
    } catch {
      showToast('Gagal menghapus foto', 'error');
    }
    setPhotoLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return showToast('Nama guru tidak boleh kosong', 'error');

    setIsSaving(true);
    try {
      const updatePayload = {
        name: formData.name.trim(),
        username: formData.username.trim() || user.username,
      };
      if (formData.password.trim()) {
        updatePayload.password = await hashPassword(formData.password.trim());
      }
      await updateDocument('users', user.id, updatePayload);
      updateUser(updatePayload);
      showToast('Pengaturan profil berhasil disimpan');
    } catch {
      showToast('Gagal menyimpan profil', 'error');
    }
    setIsSaving(false);
  };

  const handleSaveApiUrl = async () => {
    setIsTestingApi(true);
    setApiUrl(apiUrlInput.trim());
    try {
      await loadData(false);
      showToast('Koneksi Google Apps Script Web App berhasil terhubung');
    } catch (err) {
      showToast('Gagal terhubung ke URL Google Apps Script: ' + err.message, 'error');
    }
    setIsTestingApi(false);
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={fadeInScale}
      className="max-w-3xl mx-auto space-y-6"
    >
      <div>
        <KineticText
          text="Pengaturan Akun & Sistem"
          as="h2"
          className="text-2xl font-extrabold text-slate-800 tracking-tight"
        />
        <KineticLine as="p" delay={0.06} className="text-xs text-slate-500 mt-1">
          Kelola profil guru, keamanan akun, dan integrasi Google Spreadsheet
        </KineticLine>
      </div>

      {/* Profil Guru Card */}
      <Card className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-purple-50/60 rounded-3xl border border-purple-100">
            <input
              type="file"
              id="settings-photo-input"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoPick}
            />
            <div className="relative shrink-0">
              <div
                onClick={
                  photo && !photoError
                    ? () => setViewPhoto(true)
                    : () => document.getElementById('settings-photo-input').click()
                }
                className={`w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl bg-purple-100 flex items-center justify-center ${
                  photo && !photoError ? 'cursor-zoom-in ring-2 ring-purple-300' : 'cursor-pointer hover:ring-2 hover:ring-purple-400'
                }`}
              >
                {photoLoading ? (
                  <span className="text-xs font-bold text-slate-500 animate-pulse">Memproses...</span>
                ) : photo && !photoError ? (
                  <img
                    src={driveThumb(photo, 400)}
                    alt={formData.name}
                    onError={(e) => {
                      const dId = getDriveId(photo);
                      if (dId && !e.target.src.includes('thumbnail')) {
                        e.target.src = `https://drive.google.com/thumbnail?id=${dId}&sz=w400`;
                      } else {
                        setPhotoError(true);
                      }
                    }}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-purple-400">
                    <Camera size={32} />
                    <span className="text-[10px] font-bold mt-1">Pilih Foto</span>
                  </div>
                )}
              </div>
              <button
                type="button"
                disabled={photoLoading}
                onClick={() => document.getElementById('settings-photo-input').click()}
                className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-purple-600 text-white shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
              >
                <Camera size={18} />
              </button>
            </div>
            <div className="text-center sm:text-left space-y-1.5 flex-1">
              <h4 className="font-extrabold text-slate-800 text-base">Foto Profil Guru</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Foto ini akan muncul di kartu sapaan dashboard dan penanda profil Anda.
              </p>
              <div className="flex gap-2.5 justify-center sm:justify-start pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('settings-photo-input').click()}
                >
                  {photo ? 'Ganti Foto' : 'Pilih Foto'}
                </Button>
                {photo && (
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={handleRemovePhoto}
                  >
                    Hapus
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Nama Guru"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Badrut Tamam, S.Pd."
            />

            <Input
              label="Username Login"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="admin"
            />

            <div className="relative">
              <Input
                label="Password Baru"
                type={showPwd ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Kosongkan bila tidak ingin mengubah password"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-4 top-[38px] text-slate-400 hover:text-slate-600"
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Button type="button" variant="ghost" onClick={() => setView('dashboard')}>
              Kembali ke Dashboard
            </Button>
            <Button type="submit" disabled={isSaving || photoLoading}>
              {isSaving ? 'Menyimpan...' : 'Simpan Profil'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Integrasi Google Apps Script Web App API */}
      <Card className="space-y-4 border-purple-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <Link size={24} />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">
              Integrasi Google Apps Script (Spreadsheet & Drive)
            </h3>
            <p className="text-xs text-slate-500">
              Koneksikan Web App Google Apps Script agar data tersimpan langsung ke Google Sheet & Drive asli Anda.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <Input
            label="Google Apps Script Web App URL"
            value={apiUrlInput}
            onChange={(e) => setApiUrlInput(e.target.value)}
            placeholder="https://script.google.com/macros/s/.../exec"
          />
          <p className="text-[11px] text-slate-400 leading-relaxed">
            *Jika dikosongkan, aplikasi akan berjalan menggunakan penyimpanan lokal (Mode Demo Offline) secara otomatis.
          </p>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              onClick={handleSaveApiUrl}
              disabled={isTestingApi}
              variant="primary"
            >
              {isTestingApi ? 'Menghubungkan...' : 'Simpan & Tes Koneksi'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Fullscreen Photo Lightbox */}
      {viewPhoto && photo && !photoError && typeof document !== 'undefined' && createPortal(
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
              src={driveThumb(photo, 800)}
              alt={formData.name}
              onClick={(e) => e.stopPropagation()}
              className="w-72 h-72 sm:w-96 sm:h-96 rounded-full object-cover border-4 border-white shadow-2xl"
            />
            <p className="mt-5 text-white font-extrabold text-lg">{formData.name}</p>
          </div>
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
  );
};
