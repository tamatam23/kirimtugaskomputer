import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Images,
  LayoutGrid,
  Table as TableIcon,
  Pencil,
  Download,
  Eye,
  CheckCircle2,
  FileCode,
  FileText,
  UploadCloud,
  Gamepad2,
  Play,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Modal } from '../common/Modal';
import { Lightbox } from '../common/Lightbox';
import { getDirectImageUrl, isScratchProject, getScratchProjectId, getDriveId } from '../../utils/helpers';
import { springBounce, fadeInScale, staggerFast, popCard } from '../../utils/motion';
import { KineticText, KineticLine } from '../common/MotionTypography';

export const StudentGallery = () => {
  const { data, updateDocument } = useData();
  const { user } = useAuth();
  const showToast = useToast();

  const [selectedImg, setSelectedImg] = useState(null);
  const [editingWork, setEditingWork] = useState(null);
  const [newFileData, setNewFileData] = useState('');
  const [newFilePreview, setNewFilePreview] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const userClass = data.classes.find((c) => c.id === user.classId)?.name || '';
  const isKelas6 = userClass.toLowerCase().includes('6');
  const [isGridMode, setIsGridMode] = useState(true);

  const myWorks = (data.submissions || [])
    .filter((s) => String(s.studentId).trim() === String(user?.id).trim())
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

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
      return showToast('Ukuran file maksimal 5MB', 'error');
    }

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

      setNewFileData(base64);
      if (file.type.startsWith('image/')) setNewFilePreview(base64);
      else setNewFilePreview('document');
    } catch {
      showToast('Gagal memproses file baru', 'error');
    }
  };

  const handleUpdateWork = async (e) => {
    e.preventDefault();
    if (!newFileData) return showToast('Pilih file baru terlebih dahulu', 'error');

    setIsUpdating(true);
    try {
      await updateDocument('submissions', editingWork.id, { fileData: newFileData });
      showToast('File karya berhasil diperbarui');
      setEditingWork(null);
      setNewFileData('');
      setNewFilePreview(null);
    } catch {
      showToast('Gagal memperbarui file', 'error');
    }
    setIsUpdating(false);
  };

  return (
    <motion.div initial="hidden" animate="show" variants={fadeInScale} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <KineticText
            text="Karya & Tugas Saya"
            as="h2"
            className="text-xl font-extrabold text-slate-800"
          />
          <KineticLine as="p" delay={0.06} className="text-xs text-slate-500 mt-0.5">
            Lihat karya yang telah kamu kumpulkan, nilai, dan catatan dari Guru
          </KineticLine>
        </div>

        {myWorks.length > 0 && (
          <button
            onClick={() => setIsGridMode(!isGridMode)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-purple-100 text-slate-700 font-bold text-xs shadow-sm hover:border-purple-300 transition-colors"
          >
            {isGridMode ? <TableIcon size={16} /> : <LayoutGrid size={16} />}
            <span>{isGridMode ? 'Ubah ke Tabel' : 'Ubah ke Kartu'}</span>
          </button>
        )}
      </div>

      {myWorks.length === 0 ? (
        <Card className="max-w-md mx-auto py-12 px-6 text-center border-purple-100">
          <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-3xl mx-auto flex items-center justify-center mb-4">
            <Images size={34} />
          </div>
          <KineticText text="Belum Ada Karya" as="h3" className="text-lg font-extrabold text-slate-800 mb-1 block" />
          <KineticLine as="p" delay={0.06} className="text-xs text-slate-500 max-w-xs mx-auto mb-6">
            Kamu belum mengupload karya apapun. Ayo mulai berkarya dan tunjukkan bakatmu!
          </KineticLine>
        </Card>
      ) : isGridMode ? (
        /* Cards View Mode with Staggered Punchy Pop */
        <motion.div
          variants={staggerFast}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {myWorks.map((sub) => {
            const project = data.projects.find((p) => p.id === sub.projectId);
            const feedbackText = sub.catatan || sub.feedback;
            const imgUrl = getDirectImageUrl(sub.fileData);
            const canEdit = !sub.nilai;
            const isScratch = isScratchProject(sub, data.projects, data.classes, data.users);
            const fileData = sub.fileData || '';
            const fileExt = (sub.fileExt || '').toLowerCase();
            const fileName = sub.fileName || '';
            const title = (sub.title || '').toLowerCase();

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
                className="bg-white/95 backdrop-blur-xl p-0 rounded-2xl overflow-hidden flex flex-col justify-between border border-white/80 shadow-[0_6px_20px_rgba(109,40,217,0.05)] hover:shadow-[0_12px_28px_rgba(109,40,217,0.1)] transition-all duration-300 relative"
              >
                {/* Media Preview Box */}
                <div
                  onClick={() => setSelectedImg({ ...sub })}
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

                  <div className="absolute top-2.5 left-2.5 bg-purple-600/90 backdrop-blur-sm text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm">
                    Karya Saya
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                    <span className="text-white text-[11px] font-bold flex items-center gap-1">
                      <Eye size={13} /> {isScratch ? 'Mainkan Game' : isPdf ? 'Buka PDF' : isOffice ? 'Buka Dokumen' : 'Buka Karya'}
                    </span>
                  </div>
                </div>

                {/* Score & Teacher Note */}
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                  <div className="overflow-hidden">
                    <KineticText
                      text={sub.title}
                      as="h4"
                      className="font-extrabold text-slate-800 text-sm leading-snug truncate block"
                    />
                    <KineticLine as="p" delay={0.05} className="text-[10px] text-slate-400 mt-0.5 truncate">
                      {project?.title || 'Tugas Komputer'}
                    </KineticLine>
                  </div>

                  {/* Feedback / Score Banner */}
                  {(feedbackText || sub.nilai) && (
                    <KineticLine
                      as="div"
                      delay={0.08}
                      className="p-3 bg-purple-50/70 rounded-xl border border-purple-100 flex items-center justify-between gap-2 relative overflow-hidden"
                    >
                      <div className="flex-1 min-w-0 z-10">
                        {feedbackText && (
                          <div>
                            <span className="text-[9px] font-extrabold uppercase tracking-wider text-purple-700 block">
                              Catatan Guru:
                            </span>
                            <p
                              className="text-purple-900 font-bold text-sm leading-tight line-clamp-2"
                              style={{ fontFamily: "'Kalam', cursive" }}
                            >
                              &ldquo;{feedbackText}&rdquo;
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Handwritten Score Stamp */}
                      {sub.nilai && (
                        <div className="shrink-0 z-10 transform -rotate-12 bg-white/90 px-2 py-1 rounded-xl border border-rose-200 shadow-sm">
                          <span
                            className="text-2xl font-extrabold text-rose-500 block leading-none"
                            style={{ fontFamily: "'Comic Sans MS', cursive" }}
                          >
                            {sub.nilai}
                          </span>
                        </div>
                      )}
                    </KineticLine>
                  )}

                  {/* Action: Edit work before graded */}
                  <div className="pt-2 border-t border-purple-100/60">
                    {canEdit ? (
                      <button
                        onClick={() => setEditingWork(sub)}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors border border-purple-200"
                      >
                        <Pencil size={13} /> Ganti File Karya
                      </button>
                    ) : (
                      <div className="flex items-center justify-center gap-1 py-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 rounded-lg border border-emerald-100">
                        <CheckCircle2 size={13} /> Karya Telah Dinilai
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        /* Table View Mode with Scroll Limit at ~5 rows */
        <div className="glass-card rounded-[2rem] border border-white/80 shadow-[0_12px_36px_rgba(109,40,217,0.06)] overflow-hidden">
          <div className="overflow-x-auto overflow-y-auto max-h-[390px]">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-purple-50/95 backdrop-blur-md shadow-sm border-b border-purple-100/80">
                <tr className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="p-3.5 w-12 text-center font-extrabold text-slate-400">No</th>
                  <th className="p-3.5">Tugas / Project</th>
                  <th className="p-3.5 w-32 text-center">Nilai</th>
                  <th className="p-3.5 min-w-[200px]">Catatan Guru</th>
                  <th className="p-3.5 w-44 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myWorks.map((sub, index) => {
                  const canEdit = !sub.nilai;
                  return (
                    <tr key={sub.id} className="hover:bg-purple-50/40 transition-colors">
                      <td className="p-3.5 text-center text-xs font-black text-slate-400">
                        {index + 1}
                      </td>
                      <td className="p-3.5">
                        <p className="font-extrabold text-slate-800 text-sm">{sub.title}</p>
                      </td>
                      <td className="p-3.5 text-center">
                        {sub.nilai ? (
                          <span
                            className="font-extrabold text-rose-500 text-3xl inline-block transform -rotate-6"
                            style={{ fontFamily: "'Kalam', cursive" }}
                          >
                            {sub.nilai}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs font-medium">Belum dinilai</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        {sub.catatan || sub.feedback ? (
                          <p
                            className="text-purple-900 font-bold text-base"
                            style={{ fontFamily: "'Kalam', cursive" }}
                          >
                            {sub.catatan || sub.feedback}
                          </p>
                        ) : (
                          <span className="text-slate-400 text-xs italic">Belum ada catatan</span>
                        )}
                      </td>
                      <td className="p-3.5 text-center space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs"
                          onClick={() => setSelectedImg(sub)}
                          icon={<Eye size={14} />}
                        >
                          Buka
                        </Button>
                        {canEdit && (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="w-full text-xs"
                            onClick={() => setEditingWork(sub)}
                            icon={<Pencil size={14} />}
                          >
                            Ganti File
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 bg-purple-50/50 border-t border-purple-100/70 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-bold text-slate-500">
            <span>Total: <strong className="text-purple-700">{myWorks.length}</strong> karya saya</span>
            <span className="text-[11px] text-purple-600 font-semibold">Scroll vertikal untuk melihat daftar lainnya ↓</span>
          </div>
        </div>
      )}

      {/* Modal Edit / Ganti File Karya */}
      <Modal
        isOpen={!!editingWork}
        onClose={() => {
          setEditingWork(null);
          setNewFileData('');
          setNewFilePreview(null);
        }}
        title="Ganti File Karya"
      >
        {editingWork && (
          <form onSubmit={handleUpdateWork} className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 text-xs text-slate-600">
              <p className="font-bold text-slate-800 text-sm mb-1">{editingWork.title}</p>
              <p>Ganti file karyamu sebelum dinilai secara permanen oleh Guru.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                Pilih File Baru {isClass5 ? '(Khusus Kelas 5: JPG, PNG, atau PDF)' : ''}
              </label>
              <div
                onClick={() => document.getElementById('edit-file-input').click()}
                className="border-2 border-dashed border-purple-200 hover:border-purple-400 rounded-3xl p-6 text-center bg-purple-50/30 hover:bg-purple-50/60 transition-colors cursor-pointer"
              >
                <input
                  type="file"
                  id="edit-file-input"
                  className="hidden"
                  onChange={handleFileChange}
                  accept={isClass5 ? ".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf" : ".jpg,.jpeg,.png,.pdf,.ppt,.pptx,.xls,.xlsx,.sb3"}
                />
                {newFilePreview ? (
                  <div className="flex flex-col items-center">
                    {newFilePreview !== 'document' ? (
                      <img
                        src={newFilePreview}
                        alt="Preview"
                        className="max-h-36 rounded-2xl shadow-sm mb-2"
                      />
                    ) : (
                      <FileText size={40} className="text-purple-600 mb-2" />
                    )}
                    <p className="text-xs text-emerald-600 font-bold">File baru siap dikirim!</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-slate-500">
                    <UploadCloud size={36} className="text-purple-400 mb-2" />
                    <p className="font-bold text-xs text-slate-700">
                      Klik untuk memilih file pengganti
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => {
                  setEditingWork(null);
                  setNewFileData('');
                  setNewFilePreview(null);
                }}
              >
                Batal
              </Button>
              <Button type="submit" className="flex-1" disabled={isUpdating || !newFileData}>
                {isUpdating ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Lightbox / TurboWarp Player with Left & Right Navigation */}
      {selectedImg && (() => {
        const selectedIndex = myWorks.findIndex((s) => s.id === selectedImg.id);
        const hasPrev = selectedIndex > 0;
        const hasNext = selectedIndex !== -1 && selectedIndex < myWorks.length - 1;

        const handlePrev = () => {
          if (hasPrev) {
            setSelectedImg(myWorks[selectedIndex - 1]);
          }
        };

        const handleNext = () => {
          if (hasNext) {
            setSelectedImg(myWorks[selectedIndex + 1]);
          }
        };

        const handleNavigate = (idx) => {
          if (idx >= 0 && idx < myWorks.length) {
            setSelectedImg(myWorks[idx]);
          }
        };

        return (
          <Lightbox
            item={selectedImg}
            items={myWorks}
            currentIndex={selectedIndex}
            onNavigate={handleNavigate}
            isScratch={isScratchProject(selectedImg, data.projects, data.classes, data.users)}
            onClose={() => setSelectedImg(null)}
            onPrev={handlePrev}
            onNext={handleNext}
            hasPrev={hasPrev}
            hasNext={hasNext}
            totalItems={myWorks.length}
          />
        );
      })()}
    </motion.div>
  );
};
