import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Plus,
  Trash2,
  Download,
  Upload,
  Pencil,
  Camera,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmContext';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Input } from '../common/Input';
import { Avatar } from '../common/Avatar';
import { Modal } from '../common/Modal';
import { compressAvatar, driveThumb } from '../../utils/helpers';
import { springBounce, fadeInScale, popCard } from '../../utils/motion';
import { KineticText, KineticLine } from '../common/MotionTypography';

export const TeacherStudents = () => {
  const { data, addDocument, updateDocument, deleteDocument, loadData } = useData();
  const showToast = useToast();
  const showConfirm = useConfirm();

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', classId: '', pin: '', photo: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [viewPhoto, setViewPhoto] = useState(null);
  const [photoLoading, setPhotoLoading] = useState(false);

  // Bulk Delete selection
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const students = data.users.filter(
    (u) => u.role === 'siswa' && u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePhotoPick = async (e) => {
    const file = e.target.files[0];
    e.target.value = null;
    if (!file) return;
    if (!file.type.startsWith('image/')) return showToast('File harus berupa gambar', 'error');

    setPhotoLoading(true);
    try {
      const dataUrl = await compressAvatar(file);
      setFormData((prev) => ({ ...prev, photo: dataUrl }));
    } catch {
      showToast('Gagal memproses foto', 'error');
    }
    setPhotoLoading(false);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return showToast('Pilih data siswa terlebih dahulu', 'error');
    const confirmed = await showConfirm(`Yakin hapus ${selectedIds.length} data siswa terpilih?`);
    if (confirmed) {
      for (const id of selectedIds) {
        await deleteDocument('users', id);
      }
      showToast(`${selectedIds.length} data siswa berhasil dihapus!`);
      setSelectedIds([]);
      setIsSelectMode(false);
    }
  };

  const toggleSelectAll = (e) => {
    if (e.target.checked) setSelectedIds(students.map((s) => s.id));
    else setSelectedIds([]);
  };

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter((i) => i !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  const handleDownloadTemplate = () => {
    const ws_data = [
      ['Nama Siswa', 'Nama Kelas', 'PIN'],
      ...data.users
        .filter((u) => u.role === 'siswa')
        .map((s) => [
          s.name,
          data.classes.find((c) => c.id === s.classId)?.name || 'Kelas 5A',
          s.pin,
        ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    ws['!cols'] = [{ wch: 30 }, { wch: 20 }, { wch: 15 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data Siswa');
    XLSX.writeFile(wb, 'Data_Siswa.xlsx');
  };

  const handleImportExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const dataObj = XLSX.utils.sheet_to_json(wb.Sheets[wsname], { header: 1 });
        let addedCount = 0;
        let updatedCount = 0;

        for (let i = 1; i < dataObj.length; i++) {
          const row = dataObj[i];
          if (!row || !row[0]) continue;
          const name = String(row[0]).trim();
          const className = String(row[1] || '').trim();
          const pin = String(row[2] || '1234').trim();

          let targetClassId = null;
          const existingClass = data.classes.find(
            (c) => c.name.toLowerCase() === className.toLowerCase()
          );
          if (existingClass) {
            targetClassId = existingClass.id;
          } else if (className) {
            targetClassId = await addDocument('classes', { name: className });
          }

          const existingUser = data.users.find(
            (u) =>
              u.role === 'siswa' &&
              u.name.toLowerCase() === name.toLowerCase() &&
              u.classId === targetClassId
          );

          if (existingUser) {
            await updateDocument('users', existingUser.id, { pin });
            updatedCount++;
          } else {
            await addDocument('users', { role: 'siswa', name, classId: targetClassId, pin });
            addedCount++;
          }
        }
        showToast(`${addedCount} siswa baru, ${updatedCount} siswa diperbarui`);
        loadData();
      } catch (err) {
        showToast('Gagal memproses file Excel: ' + err.message, 'error');
      }
      setIsImporting(false);
      e.target.value = null;
    };
    reader.readAsBinaryString(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let finalClassId = formData.classId;
      const existingClass = data.classes.find(
        (c) =>
          c.name.toLowerCase() === finalClassId.toLowerCase() ||
          c.id === finalClassId
      );

      if (existingClass) {
        finalClassId = existingClass.id;
      } else if (finalClassId) {
        finalClassId = await addDocument('classes', { name: finalClassId });
      }

      const finalData = { ...formData, classId: finalClassId };

      if (editingId) {
        await updateDocument('users', editingId, finalData);
        showToast('Data siswa berhasil diperbarui!');
      } else {
        await addDocument('users', { ...finalData, role: 'siswa' });
        showToast('Siswa baru berhasil ditambahkan');
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await showConfirm('Yakin ingin menghapus data siswa ini?');
    if (confirmed) {
      await deleteDocument('users', id);
      showToast('Data siswa dihapus');
    }
  };

  return (
    <motion.div initial="hidden" animate="show" variants={fadeInScale} className="space-y-6">
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/90 backdrop-blur-xl p-6 rounded-[2.25rem] border border-white/80 shadow-[0_12px_36px_rgba(109,40,217,0.06)]">
        <div>
          <KineticText
            text="Data Siswa"
            as="h2"
            className="text-2xl font-black text-slate-800 tracking-tight"
          />
          <KineticLine as="p" delay={0.06} className="text-xs font-semibold text-slate-500 mt-1">
            Kelola data siswa, PIN masuk, foto profil, dan impor massal dari Excel
          </KineticLine>
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div className="flex flex-col md:flex-row justify-between gap-4 items-stretch md:items-center">
        <div className="w-full md:w-72">
          <Input
            icon={Search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama siswa..."
          />
        </div>

        <div className="flex flex-wrap gap-2.5 items-center">
          {isSelectMode ? (
            <>
              <Button variant="danger" onClick={handleBulkDelete}>
                Hapus Terpilih ({selectedIds.length})
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedIds(students.map((s) => s.id))}
              >
                Pilih Semua
              </Button>
              <Button
                variant="ghost"
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
                onClick={() => setIsSelectMode(true)}
                icon={<Trash2 size={16} />}
              >
                Hapus
              </Button>
              <Button
                variant="outline"
                onClick={handleDownloadTemplate}
                icon={<FileSpreadsheet size={16} />}
              >
                Template Excel
              </Button>
              <input
                type="file"
                id="import-excel-file"
                accept=".xlsx, .xls"
                className="hidden"
                onChange={handleImportExcel}
                disabled={isImporting}
              />
              <Button
                variant="secondary"
                onClick={() => document.getElementById('import-excel-file').click()}
                icon={<Upload size={16} />}
                disabled={isImporting}
              >
                {isImporting ? 'Memproses...' : 'Import Excel'}
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ name: '', classId: '', pin: '', photo: '' });
                  setModalOpen(true);
                }}
                icon={<Plus size={16} />}
              >
                Tambah Siswa
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Table Card with Scroll Limit at ~5 rows */}
      <div className="glass-card rounded-[2rem] border border-white/80 shadow-[0_12px_36px_rgba(109,40,217,0.06)] overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[370px]">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-purple-50/95 backdrop-blur-md shadow-sm border-b border-purple-100/80">
              <tr className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {isSelectMode && (
                  <th className="p-3.5 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.length === students.length && students.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="w-4 h-4 accent-purple-600 cursor-pointer rounded"
                    />
                  </th>
                )}
                <th className="p-3.5 w-12 text-center font-extrabold text-slate-400">No</th>
                <th className="p-3.5 w-16">Foto</th>
                <th className="p-3.5">Nama Siswa</th>
                <th className="p-3.5">Kelas</th>
                <th className="p-3.5">PIN Masuk</th>
                {!isSelectMode && <th className="p-3.5 text-center">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={isSelectMode ? 7 : 6} className="p-8 text-center text-slate-400 text-sm">
                    Tidak ada data siswa ditemukan.
                  </td>
                </tr>
              ) : (
                students.map((s, index) => (
                  <tr
                    key={s.id}
                    className={`hover:bg-purple-50/40 transition-colors ${
                      selectedIds.includes(s.id) ? 'bg-purple-50/80' : ''
                    }`}
                  >
                    {isSelectMode && (
                      <td className="p-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(s.id)}
                          onChange={() => toggleSelect(s.id)}
                          className="w-4 h-4 accent-purple-600 cursor-pointer rounded"
                        />
                      </td>
                    )}
                    <td className="p-3.5 text-center text-xs font-black text-slate-400">
                      {index + 1}
                    </td>
                    <td className="p-3.5">
                      <Avatar
                        name={s.name}
                        photo={s.photo}
                        size={38}
                        onClick={s.photo ? () => setViewPhoto(s) : undefined}
                      />
                    </td>
                    <td className="p-3.5 font-bold text-slate-800 text-sm">{s.name}</td>
                    <td className="p-3.5 text-slate-600 text-sm">
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold text-xs border border-purple-100">
                        {data.classes.find((c) => c.id === s.classId)?.name || s.classId || '-'}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-sm tracking-wider text-slate-700">
                      {s.pin}
                    </td>
                    {!isSelectMode && (
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => {
                              setEditingId(s.id);
                              const cls = data.classes.find((c) => c.id === s.classId);
                              setFormData({
                                name: s.name,
                                classId: cls ? cls.name : s.classId,
                                pin: s.pin,
                                photo: s.photo || '',
                              });
                              setModalOpen(true);
                            }}
                            className="p-1.5 text-purple-600 hover:bg-purple-100/70 rounded-xl transition-colors"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Table Footer with Count & Scroll Hint */}
        <div className="px-6 py-3 bg-purple-50/50 border-t border-purple-100/70 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-bold text-slate-500">
          <span>Total: <strong className="text-purple-700">{students.length}</strong> siswa terdaftar</span>
          <span className="text-[11px] text-purple-600 font-semibold flex items-center gap-1">
            Scroll vertikal untuk melihat daftar siswa berikutnya ↓
          </span>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center gap-3">
            <input
              type="file"
              id="student-form-photo"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoPick}
            />
            <button
              type="button"
              onClick={() => document.getElementById('student-form-photo').click()}
              className="group relative w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl bg-purple-50 flex items-center justify-center ring-2 ring-purple-200 hover:ring-purple-400 transition-all"
            >
              {formData.photo ? (
                <img
                  src={driveThumb(formData.photo, 400)}
                  alt="Siswa"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-purple-400">
                  <Camera size={30} />
                  <span className="text-[10px] font-bold mt-1">Pilih Foto</span>
                </div>
              )}
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
                {photoLoading ? 'Memproses...' : 'Ganti Foto'}
              </div>
            </button>
            {formData.photo && (
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, photo: '' }))}
                className="text-xs font-bold text-rose-500 hover:underline"
              >
                Hapus Foto
              </button>
            )}
          </div>

          <Input
            label="Nama Lengkap Siswa"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="Contoh: Budi Santoso"
          />

          <Input
            label="Kelas"
            value={formData.classId}
            onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
            required
            placeholder="Contoh: Kelas 5A"
          />

          <Input
            label="PIN Masuk (4 Digit)"
            value={formData.pin}
            onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '') })}
            maxLength={4}
            required
            placeholder="1234"
          />

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit">
              {editingId ? 'Simpan Perubahan' : 'Tambah Siswa'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Fullscreen Photo Lightbox */}
      {viewPhoto && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          <div
            className="fixed inset-0 z-[9999999] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6"
            onClick={() => setViewPhoto(null)}
          >
            <button
              onClick={() => setViewPhoto(null)}
              className="absolute top-5 right-5 text-white p-3 bg-white/10 hover:bg-white/20 rounded-full"
            >
              <X size={24} />
            </button>
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={springBounce}
              src={driveThumb(viewPhoto.photo, 800)}
              alt={viewPhoto.name}
              onClick={(e) => e.stopPropagation()}
              className="w-72 h-72 sm:w-96 sm:h-96 rounded-full object-cover border-4 border-white shadow-2xl"
            />
            <p className="mt-5 text-white font-extrabold text-lg">{viewPhoto.name}</p>
          </div>
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
  );
};
