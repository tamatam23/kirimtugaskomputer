import React, { useState, useEffect } from 'react';
import {
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Loader2,
  Send,
  FileCode,
  FileText,
  Image as ImageIcon,
  ExternalLink,
} from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

const getFileBadge = (ext = '') => {
  const clean = String(ext).toLowerCase();
  if (clean === 'sb3') return { Icon: FileCode, label: 'SB3', color: 'bg-amber-100 text-amber-700' };
  if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(clean)) {
    return { Icon: ImageIcon, label: clean.toUpperCase(), color: 'bg-purple-100 text-purple-700' };
  }
  return { Icon: FileText, label: clean ? clean.toUpperCase() : 'FILE', color: 'bg-sky-100 text-sky-700' };
};

/**
 * Modal sementara untuk mendeteksi dan mengirim karya siswa yang tersangkut
 * di penyimpanan lokal browser (localStorage) ke server Supabase.
 */
export const LocalRescueModal = ({ isOpen, onClose, isLegacyDomain = false }) => {
  const { pendingLocalSubmissions, pushSingleLocalSubmission } = useData();
  const showToast = useToast();

  // Snapshot daftar karya saat modal dibuka agar daftar tetap terlihat dengan status Selesai/Gagal
  const [items, setItems] = useState(() => pendingLocalSubmissions || []);
  const [statuses, setStatuses] = useState({});
  const [errors, setErrors] = useState({});
  const [isPushing, setIsPushing] = useState(false);

  useEffect(() => {
    if (isOpen && !isPushing) {
      setItems((prev) => {
        const doneItems = prev.filter((p) => statuses[p.id] === 'done');
        if (!pendingLocalSubmissions || pendingLocalSubmissions.length === 0) {
          return doneItems;
        }
        // Pertahankan item yang sudah 'done' di sesi modal ini, tambahkan item pending terbaru
        const pendingIds = new Set(pendingLocalSubmissions.map((p) => String(p.id)));
        const merged = [
          ...pendingLocalSubmissions,
          ...doneItems.filter((d) => !pendingIds.has(String(d.id))),
        ];
        return merged;
      });
    }
  }, [isOpen, pendingLocalSubmissions]); // eslint-disable-line

  const pendingToUpload = items.filter((item) => statuses[item.id] !== 'done');
  const doneCount = items.filter((item) => statuses[item.id] === 'done').length;
  const allDone = items.length > 0 && pendingToUpload.length === 0;

  const handlePushSingle = async (item) => {
    if (isPushing || statuses[item.id] === 'uploading' || statuses[item.id] === 'done') return;
    setStatuses((prev) => ({ ...prev, [item.id]: 'uploading' }));
    setErrors((prev) => ({ ...prev, [item.id]: '' }));

    try {
      await pushSingleLocalSubmission(item);
      setStatuses((prev) => ({ ...prev, [item.id]: 'done' }));
      showToast(`Karya "${item.title || 'Karya Siswa'}" berhasil dikirim ke server!`);
    } catch (err) {
      setStatuses((prev) => ({ ...prev, [item.id]: 'error' }));
      setErrors((prev) => ({ ...prev, [item.id]: err?.message || 'Gagal mengunggah ke server' }));
      showToast(`Gagal mengirim karya "${item.title || ''}"`, 'error');
    }
  };

  const handlePushAll = async () => {
    if (isPushing || pendingToUpload.length === 0) return;
    setIsPushing(true);

    let successCount = 0;
    let failCount = 0;

    for (const item of pendingToUpload) {
      setStatuses((prev) => ({ ...prev, [item.id]: 'uploading' }));
      setErrors((prev) => ({ ...prev, [item.id]: '' }));

      try {
        await pushSingleLocalSubmission(item);
        setStatuses((prev) => ({ ...prev, [item.id]: 'done' }));
        successCount++;
      } catch (err) {
        setStatuses((prev) => ({ ...prev, [item.id]: 'error' }));
        setErrors((prev) => ({ ...prev, [item.id]: err?.message || 'Gagal mengunggah ke server' }));
        failCount++;
      }
    }

    setIsPushing(false);

    if (successCount > 0 && failCount === 0) {
      showToast(`${successCount} karya berhasil dikirim ke server Guru!`);
    } else if (successCount > 0 && failCount > 0) {
      showToast(`${successCount} karya terkirim, ${failCount} gagal. Silakan coba ulang.`, 'error');
    } else if (failCount > 0) {
      showToast('Gagal mengirim karya. Periksa koneksi internet lalu coba lagi.', 'error');
    }
  };

  const handleGoToMainDomain = () => {
    try {
      localStorage.removeItem('galeri_local_submissions');
    } catch {}
    window.location.replace('https://kirimtugaskomputer.my.id');
  };

  if (!isOpen || items.length === 0) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={isPushing ? () => {} : onClose}
      size="lg"
      title="Karya Belum Terkirim Ditemukan di Laptop Ini"
      actions={
        allDone ? (
          isLegacyDomain ? (
            <Button onClick={handleGoToMainDomain} icon={<ExternalLink size={16} />}>
              Lanjut ke kirimtugaskomputer.my.id
            </Button>
          ) : (
            <Button onClick={onClose} icon={<CheckCircle2 size={16} />}>
              Selesai &amp; Tutup
            </Button>
          )
        ) : (
          <>
            <Button variant="outline" onClick={onClose} disabled={isPushing}>
              Tutup Sementara
            </Button>
            <Button
              onClick={handlePushAll}
              disabled={isPushing || pendingToUpload.length === 0}
              icon={
                isPushing ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )
              }
            >
              {isPushing
                ? `Mengirim (${doneCount}/${items.length})...`
                : `Kirim Semua Sekarang (${pendingToUpload.length})`}
            </Button>
          </>
        )
      }
    >
      <div className="space-y-4">
        <div
          className={`flex items-start gap-3.5 p-4 rounded-2xl border ${
            allDone
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}
        >
          <div
            className={`p-2.5 rounded-xl shrink-0 ${
              allDone ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}
          >
            {allDone ? <CheckCircle2 size={22} /> : <UploadCloud size={22} />}
          </div>
          <div className="text-xs sm:text-sm leading-relaxed">
            {allDone ? (
              <>
                <p className="font-extrabold text-emerald-800">
                  Semua karya berhasil dikirim ke server Pak Tamam!
                </p>
                <p className="text-emerald-700 mt-0.5">
                  Data tugas sudah tersimpan aman dan langsung terlihat di halaman Guru.
                </p>
              </>
            ) : (
              <>
                <p className="font-extrabold">
                  Ditemukan {pendingToUpload.length} file karya yang masih tersangkut di browser laptop ini.
                </p>
                <p className="mt-0.5 opacity-90">
                  Klik tombol <strong>Kirim Semua Sekarang</strong> agar karya tersebut langsung masuk ke sistem Guru secara permanen.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {(isPushing || doneCount > 0) && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-600">
              <span>Progres Pengiriman</span>
              <span>
                {doneCount} / {items.length} karya
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-emerald-500 transition-all duration-300"
                style={{ width: `${Math.round((doneCount / items.length) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Daftar Karya Tersangkut */}
        <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
          {items.map((item) => {
            const status = statuses[item.id] || 'pending';
            const errMsg = errors[item.id];
            const { Icon, label, color } = getFileBadge(item.fileExt);

            return (
              <div
                key={item.id}
                className={`flex items-center justify-between gap-3 p-3.5 rounded-2xl border transition-colors ${
                  status === 'done'
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : status === 'error'
                      ? 'bg-rose-50/60 border-rose-200'
                      : 'bg-slate-50/80 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                    <Icon size={20} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-slate-800 truncate">
                        {item.title || 'Tanpa Judul'}
                      </p>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-slate-200/80 text-slate-700 shrink-0">
                        {label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {item.studentName || 'Siswa'}
                      {item.className ? ` • Kelas ${item.className}` : ''}
                      {item.projectTitle ? ` • ${item.projectTitle}` : ''}
                    </p>
                    {errMsg && (
                      <p className="text-[11px] font-semibold text-rose-600 mt-0.5">{errMsg}</p>
                    )}
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {status === 'uploading' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
                      <Loader2 size={13} className="animate-spin" />
                      Mengirim
                    </span>
                  )}
                  {status === 'done' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                      <CheckCircle2 size={13} />
                      Terkirim
                    </span>
                  )}
                  {status === 'error' && (
                    <button
                      type="button"
                      onClick={() => handlePushSingle(item)}
                      disabled={isPushing}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-rose-100 hover:bg-rose-200 text-rose-700 transition-colors"
                      title="Klik untuk mencoba kirim ulang"
                    >
                      <AlertTriangle size={13} />
                      Coba Lagi
                    </button>
                  )}
                  {status === 'pending' && (
                    <button
                      type="button"
                      onClick={() => handlePushSingle(item)}
                      disabled={isPushing}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-sm hover:shadow transition-all"
                      title="Kirim karya ini sekarang"
                    >
                      <Send size={12} />
                      Kirim
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
