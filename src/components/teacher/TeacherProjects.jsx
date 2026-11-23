import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FolderKanban,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  Users,
  Search,
  X,
  UserPlus,
  Pencil,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmContext';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Input } from '../common/Input';
import { Modal } from '../common/Modal';
import { Avatar } from '../common/Avatar';
import {
  getProjectTargetStudents,
  formatProjectDeadline,
  toDateTimeLocalValue,
} from '../../utils/helpers';
import { springBounce, fadeInScale, staggerCards, popCard } from '../../utils/motion';
import { KineticText, KineticLine } from '../common/MotionTypography';

export const TeacherProjects = () => {
  const { data, addDocument, updateDocument, deleteDocument } = useData();
  const showToast = useToast();
  const showConfirm = useConfirm();

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    classId: [], // Default: Tidak ada kelas yang terceklis!
    deadline: '',
    status: 'aktif',
  });

  // State untuk kolom target siswa (anak les / individu)
  const [studentSlots, setStudentSlots] = useState([
    { id: 1, studentId: '', query: '' },
  ]);

  const [activeFolder, setActiveFolder] = useState('all');

  // Filter classes
  const uniqueClasses = data.classes
    .filter((c) => c.name && !c.name.startsWith('{'))
    .sort((a, b) => a.name.localeCompare(b.name));

  const lesProjectsCount = data.projects.filter(
    (p) => getProjectTargetStudents(p).length > 0
  ).length;

  // Urutan project: Project yang baru diinput selalu di posisi PALING AWAL
  const sortedProjects = [...data.projects].sort((a, b) => {
    const timeA = new Date(a.createdAt || a.id || 0).getTime();
    const timeB = new Date(b.createdAt || b.id || 0).getTime();
    if (!isNaN(timeA) && !isNaN(timeB) && timeA !== timeB) {
      return timeB - timeA;
    }
    return String(b.id).localeCompare(String(a.id));
  });

  const filteredProjects = sortedProjects.filter((p) => {
    const targetStudents = getProjectTargetStudents(p);
    const isLes = targetStudents.length > 0;

    if (activeFolder === 'all') return true;
    if (activeFolder === 'les') return isLes;

    if (isLes) {
      return targetStudents.some((sid) => {
        const student = data.users.find((u) => u.id === sid);
        return student && student.classId === activeFolder;
      });
    }

    if (
      !p.classId ||
      p.classId === 'all' ||
      (Array.isArray(p.classId) && (p.classId.includes('all') || p.classId.length === 0))
    ) {
      return true;
    }
    if (Array.isArray(p.classId)) return p.classId.includes(activeFolder);
    return p.classId === activeFolder;
  });

  const handleAddStudentSlot = () => {
    setStudentSlots((prev) => [
      ...prev,
      { id: Date.now(), studentId: '', query: '' },
    ]);
  };

  const handleRemoveStudentSlot = (slotId) => {
    setStudentSlots((prev) => {
      const filtered = prev.filter((s) => s.id !== slotId);
      return filtered.length > 0 ? filtered : [{ id: Date.now(), studentId: '', query: '' }];
    });
  };

  const handleSlotQueryChange = (slotId, val) => {
    setStudentSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, query: val } : s))
    );
  };

  const handleSelectStudentForSlot = (slotId, student) => {
    setStudentSlots((prev) =>
      prev.map((s) =>
        s.id === slotId ? { ...s, studentId: student.id, query: '' } : s
      )
    );
  };

  const selectedStudentIds = studentSlots
    .map((s) => s.studentId)
    .filter(Boolean);

  const resetForm = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      desc: '',
      classId: [],
      deadline: '',
      status: 'aktif',
    });
    setStudentSlots([{ id: Date.now(), studentId: '', query: '' }]);
  };

  const handleOpenEdit = (p) => {
    setEditingProject(p);
    const targetStudents = getProjectTargetStudents(p);
    if (targetStudents.length > 0) {
      setStudentSlots(
        targetStudents.map((sid, idx) => ({
          id: Date.now() + idx,
          studentId: sid,
          query: '',
        }))
      );
    } else {
      setStudentSlots([{ id: Date.now(), studentId: '', query: '' }]);
    }

    // Bersihkan classId dari prefix student:
    let rawClassIds = [];
    if (Array.isArray(p.classId)) {
      rawClassIds = p.classId.filter(
        (id) => typeof id === 'string' && !id.startsWith('student:')
      );
    } else if (typeof p.classId === 'string') {
      rawClassIds = p.classId
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s && !s.startsWith('student:'));
    }

    setFormData({
      title: p.title || '',
      desc: p.desc || '',
      classId: rawClassIds,
      deadline: p.deadline || '',
      status: p.status || 'aktif',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.classId.length === 0 && selectedStudentIds.length === 0) {
      return showToast('Pilih target kelas atau minimal satu target siswa', 'error');
    }

    // Gabungkan target siswa ke classId dengan prefix student: untuk persistensi andal di Google Sheets
    const studentPayload = selectedStudentIds.map((id) => `student:${id}`);
    const combinedClassId = [...formData.classId, ...studentPayload];

    const payload = {
      ...formData,
      classId: combinedClassId,
      targetStudents: selectedStudentIds,
    };

    if (editingProject) {
      await updateDocument('projects', editingProject.id, payload);
      showToast('Project berhasil diperbarui');
    } else {
      await addDocument('projects', payload);
      showToast('Project baru berhasil dibuat');
    }

    setModalOpen(false);
    resetForm();
  };

  const handleDelete = async (id) => {
    const confirmed = await showConfirm('Yakin ingin menghapus project ini?');
    if (confirmed) {
      await deleteDocument('projects', id);
      showToast('Project berhasil dihapus');
    }
  };

  return (
    <motion.div initial="hidden" animate="show" variants={fadeInScale} className="space-y-6">
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/90 backdrop-blur-xl p-6 rounded-[2.25rem] border border-white/80 shadow-[0_12px_36px_rgba(109,40,217,0.06)]">
        <div>
          <KineticText
            text="Kelola Project & Tugas"
            as="h2"
            className="text-2xl font-black text-slate-800 tracking-tight"
          />
          <KineticLine as="p" delay={0.06} className="text-xs font-semibold text-slate-500 mt-1">
            Buat penugasan baru untuk seluruh kelas atau siswa les/khusus tertentu
          </KineticLine>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
          icon={<Plus size={18} />}
        >
          Buat Project Baru
        </Button>
      </div>

      {/* Class Folders Tabs (Pill Buttons) */}
      <div className="flex flex-wrap gap-2.5 pb-2">
        <button
          onClick={() => setActiveFolder('all')}
          className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 shadow-sm ${
            activeFolder === 'all'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/30'
              : 'bg-white/85 text-slate-600 hover:text-purple-700 hover:bg-white border border-purple-100'
          }`}
        >
          <FolderKanban size={17} /> Semua Project ({data.projects.length})
        </button>

        {lesProjectsCount > 0 && (
          <button
            onClick={() => setActiveFolder('les')}
            className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 shadow-sm ${
              activeFolder === 'les'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-500/30'
                : 'bg-white/85 text-amber-800 hover:text-amber-900 hover:bg-white border border-amber-200'
            }`}
          >
            <Users size={17} /> Khusus / Les ({lesProjectsCount})
          </button>
        )}

        {uniqueClasses.map((c) => {
          const count = data.projects.filter((p) => {
            const targets = getProjectTargetStudents(p);
            if (targets.length > 0) {
              return targets.some((sid) => {
                const student = data.users.find((u) => u.id === sid);
                return student && student.classId === c.id;
              });
            }
            return (
              !p.classId ||
              p.classId === 'all' ||
              (Array.isArray(p.classId) && (p.classId.includes('all') || p.classId.includes(c.id)))
            );
          }).length;

          return (
            <button
              key={c.id}
              onClick={() => setActiveFolder(c.id)}
              className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 shadow-sm ${
                activeFolder === c.id
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/30'
                  : 'bg-white/85 text-slate-600 hover:text-purple-700 hover:bg-white border border-purple-100'
              }`}
            >
              <FolderKanban size={17} /> {c.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Projects Grid with Staggered Punchy Pop (Sequential ripple per card) */}
      <motion.div
        key={activeFolder}
        variants={staggerCards}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 sm:gap-5"
      >
        {filteredProjects.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 font-bold glass-card rounded-[2rem] border border-dashed border-purple-200">
            Belum ada project di folder ini.
          </div>
        ) : (
          filteredProjects.map((p) => {
            const pTargetStudents = getProjectTargetStudents(p);

            return (
              <motion.div
                key={p.id}
                variants={popCard}
                whileHover={{ y: -6, scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                className="bg-white/95 backdrop-blur-xl rounded-[1.75rem] p-5 border border-white/80 shadow-[0_8px_24px_rgba(109,40,217,0.05)] hover:shadow-[0_16px_36px_rgba(109,40,217,0.12)] hover:border-purple-200 transition-all duration-300 flex flex-col justify-between group cursor-default"
              >
                <div>
                  {/* Header Status & Action Buttons (Edit + Delete) */}
                  <div className="flex justify-between items-center gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        p.status === 'aktif'
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          p.status === 'aktif' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                        }`}
                      />
                      {p.status}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors cursor-pointer"
                        title="Edit Project & Target Tugas"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title="Hapus Project"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="overflow-hidden mb-2">
                    <KineticText
                      text={p.title}
                      as="h3"
                      className="text-base font-black text-slate-900 leading-snug tracking-tight group-hover:text-purple-700 transition-colors line-clamp-2"
                    />
                  </div>

                  {/* Target Badge */}
                  <div className="mb-2.5 flex flex-wrap gap-1">
                    {pTargetStudents.length > 0 ? (
                      <span className="text-[11px] font-black text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-lg border border-amber-200/80 flex items-center gap-1 shadow-xs">
                        <Users size={12} className="text-amber-600" />
                        Khusus {pTargetStudents.length} Siswa (Les)
                      </span>
                    ) : !p.classId ||
                      p.classId === 'all' ||
                      (Array.isArray(p.classId) &&
                        (p.classId.includes('all') || p.classId.length === 0)) ? (
                      <span className="text-[11px] font-black text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-lg border border-purple-200/60">
                        Semua Kelas
                      </span>
                    ) : (
                      (Array.isArray(p.classId) ? p.classId : [p.classId]).map((cid) => (
                        <span
                          key={cid}
                          className="text-[11px] font-black text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-lg border border-purple-200/60"
                        >
                          {data.classes.find((c) => c.id === cid)?.name || cid}
                        </span>
                      ))
                    )}
                  </div>

                  {/* List targeted student names if private/les */}
                  {pTargetStudents.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2.5">
                      {pTargetStudents.slice(0, 3).map((sid) => {
                        const st = data.users.find((u) => u.id === sid);
                        return (
                          <span
                            key={sid}
                            className="text-[10px] font-bold text-slate-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md truncate max-w-[130px]"
                          >
                            {st?.name || 'Siswa'}
                          </span>
                        );
                      })}
                      {pTargetStudents.length > 3 && (
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-md">
                          +{pTargetStudents.length - 3} lainnya
                        </span>
                      )}
                    </div>
                  )}

                  <KineticLine
                    as="p"
                    delay={0.05}
                    className="text-xs font-medium text-slate-500 leading-relaxed line-clamp-2 mb-4"
                  >
                    {p.desc}
                  </KineticLine>
                </div>

                {/* Footer Deadline & Close/Reopen */}
                <div className="pt-3 border-t border-purple-100/60 space-y-2.5">
                  <KineticLine
                    as="div"
                    delay={0.08}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-500"
                  >
                    <Calendar size={14} className="text-purple-600 shrink-0" />
                    <span className="truncate">Batas Waktu: {formatProjectDeadline(p.deadline)}</span>
                  </KineticLine>

                  <Button
                    variant={p.status === 'aktif' ? 'outline' : 'secondary'}
                    className="w-full text-xs py-2 rounded-xl font-bold"
                    onClick={() =>
                      updateDocument('projects', p.id, {
                        status: p.status === 'aktif' ? 'selesai' : 'aktif',
                      })
                    }
                  >
                    {p.status === 'aktif' ? 'Tutup Project' : 'Buka Kembali'}
                  </Button>
                </div>
              </motion.div>
            );
          })
        )}
      </motion.div>

      {/* Modal Buat / Edit Project */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          resetForm();
        }}
        title={editingProject ? 'Edit Project / Tugas' : 'Buat Project Baru'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Judul Project"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            placeholder="Contoh: Desain Kemasan Produk di CorelDraw"
          />

          {/* Section 1: Target Kelas (Default SEMUA TIDAK TERCEKLIS) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                Target Kelas
              </label>
              <span className="text-[10px] text-slate-400 font-semibold">
                (Opsional jika sudah memilih target siswa)
              </span>
            </div>
            <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl bg-white border border-slate-200 cursor-pointer hover:bg-purple-50 transition-colors">
                <input
                  type="checkbox"
                  checked={Array.isArray(formData.classId) && formData.classId.includes('all')}
                  onChange={() => {
                    if (Array.isArray(formData.classId) && formData.classId.includes('all')) {
                      setFormData({ ...formData, classId: [] });
                    } else {
                      setFormData({ ...formData, classId: ['all'] });
                    }
                  }}
                  className="w-4 h-4 accent-purple-600 rounded"
                />
                Semua Kelas
              </label>

              {uniqueClasses.map((c) => (
                <label
                  key={c.id}
                  className="flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl bg-white border border-slate-200 cursor-pointer hover:bg-purple-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={Array.isArray(formData.classId) && formData.classId.includes(c.id)}
                    onChange={(e) => {
                      let current = Array.isArray(formData.classId)
                        ? formData.classId.filter((id) => id !== 'all')
                        : [];
                      if (e.target.checked) current.push(c.id);
                      else current = current.filter((id) => id !== c.id);
                      setFormData({
                        ...formData,
                        classId: current,
                      });
                    }}
                    className="w-4 h-4 accent-purple-600 rounded"
                  />
                  {c.name}
                </label>
              ))}
            </div>
          </div>

          {/* Section 2: Target Siswa Tertentu / Anak Les */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                Target Siswa (Khusus / Anak Les)
              </label>
              <button
                type="button"
                onClick={handleAddStudentSlot}
                className="inline-flex items-center gap-1 text-[11px] font-black text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200 transition-colors cursor-pointer shadow-xs"
              >
                <Plus size={13} /> Tambah Kolom Siswa
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Ketik min. 2 huruf nama siswa untuk mencari dari Data Siswa. Jika diisi, project ini <b>hanya</b> akan muncul pada siswa yang dipilih saja.
            </p>

            <div className="space-y-2 pt-1">
              {studentSlots.map((slot, index) => {
                const selectedStudent = slot.studentId
                  ? data.users.find((u) => u.id === slot.studentId)
                  : null;
                const studentClass = selectedStudent
                  ? data.classes.find((c) => c.id === selectedStudent.classId)?.name
                  : '';

                if (selectedStudent) {
                  return (
                    <div
                      key={slot.id}
                      className="flex items-center justify-between p-2.5 px-3 rounded-2xl bg-purple-50/70 border border-purple-200 shadow-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Avatar
                          name={selectedStudent.name}
                          photo={selectedStudent.photo}
                          size={32}
                        />
                        <div className="min-w-0">
                          <p className="font-extrabold text-xs text-slate-800 truncate">
                            {selectedStudent.name}
                          </p>
                          <span className="text-[10px] font-bold text-purple-700 bg-white px-2 py-0.5 rounded-md border border-purple-100">
                            Kelas {studentClass || '-'}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveStudentSlot(slot.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title="Hapus siswa ini"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  );
                }

                // Empty search slot
                const query = slot.query || '';
                const matchingStudents =
                  query.trim().length >= 2
                    ? data.users
                        .filter(
                          (u) =>
                            u.role === 'siswa' &&
                            u.name.toLowerCase().includes(query.toLowerCase().trim()) &&
                            !selectedStudentIds.includes(u.id)
                        )
                        .slice(0, 6)
                    : [];

                return (
                  <div key={slot.id} className="relative">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Search
                          size={15}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                        />
                        <input
                          type="text"
                          value={slot.query}
                          onChange={(e) => handleSlotQueryChange(slot.id, e.target.value)}
                          placeholder="Ketik min. 2 huruf nama siswa..."
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
                        />
                      </div>
                      {studentSlots.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveStudentSlot(slot.id)}
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                          title="Hapus kolom ini"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>

                    {/* Autocomplete Dropdown */}
                    {query.trim().length >= 2 && (
                      <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white rounded-2xl border border-purple-100 shadow-xl overflow-hidden max-h-48 overflow-y-auto">
                        {matchingStudents.length === 0 ? (
                          <div className="p-3 text-center text-xs text-slate-400 font-medium">
                            Siswa dengan nama &quot;{query}&quot; tidak ditemukan.
                          </div>
                        ) : (
                          matchingStudents.map((st) => {
                            const cName = data.classes.find((c) => c.id === st.classId)?.name;
                            return (
                              <div
                                key={st.id}
                                onClick={() => handleSelectStudentForSlot(slot.id, st)}
                                className="flex items-center justify-between p-2.5 px-3 hover:bg-purple-50 cursor-pointer transition-colors border-b border-slate-50 last:border-b-0"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <Avatar name={st.name} photo={st.photo} size={28} />
                                  <span className="font-extrabold text-xs text-slate-800 truncate">
                                    {st.name}
                                  </span>
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
                                  Kelas {cName || '-'}
                                </span>
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Notice if specific students are targeted */}
            {selectedStudentIds.length > 0 && (
              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs mt-2">
                <span className="text-base shrink-0 leading-none">🔒</span>
                <p className="text-[11px] leading-relaxed font-semibold">
                  <b>Tugas Khusus ({selectedStudentIds.length} Siswa Terpilih):</b> Project ini <u>hanya</u> akan tampil di halaman siswa yang dipilih dan tidak dapat dilihat oleh anak-anak lain.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
              Instruksi / Penjelasan Tugas
            </label>
            <textarea
              rows="3"
              value={formData.desc}
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              required
              placeholder="Jelaskan langkah-langkah atau format tugas..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium shadow-sm"
            ></textarea>
          </div>

          <Input
            type="datetime-local"
            label="Batas Waktu Pengumpulan (Tanggal & Jam)"
            value={formData.deadline ? toDateTimeLocalValue(formData.deadline) : ''}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            required
          />

          <div className="flex justify-end gap-3 pt-3">
            <Button
              variant="ghost"
              type="button"
              onClick={() => {
                setModalOpen(false);
                resetForm();
              }}
            >
              Batal
            </Button>
            <Button type="submit">
              {editingProject ? 'Simpan Perubahan' : 'Simpan Project'}
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};
