import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { supabase, uploadKaryaFile } from '../services/supabase';
import { callGas, DEFAULT_CLASSES } from '../services/api';
import { useToast } from './ToastContext';

const DataContext = createContext(null);

const LOCAL_CLASSES_KEY = 'galeri_cached_classes';
const LOCAL_SUBS_KEY = 'galeri_local_submissions';
const LOCAL_DELETED_SUBS_KEY = 'galeri_deleted_submissions';
const LOCAL_USERS_KEY = 'galeri_local_users';
const LOCAL_DELETED_USERS_KEY = 'galeri_deleted_users';
const LOCAL_PROJECTS_KEY = 'galeri_local_projects';
const LOCAL_DELETED_PROJECTS_KEY = 'galeri_deleted_projects';

let inMemoryLocalSubs = [];
let inMemoryDeletedSubs = [];
let inMemoryLocalUsers = [];
let inMemoryDeletedUsers = [];
let inMemoryLocalProjects = [];
let inMemoryDeletedProjects = [];

const getDeletedSet = (lsKey, inMemArr) => {
  try {
    const raw = localStorage.getItem(lsKey);
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set([...parsed, ...inMemArr]);
  } catch {
    return new Set(inMemArr);
  }
};

const persistDeleted = (lsKey, inMemArr, lsDataKey, getStoredFn, id) => {
  const strId = String(id);
  if (!inMemArr.includes(strId)) inMemArr.push(strId);
  try {
    const existing = Array.from(getDeletedSet(lsKey, inMemArr));
    if (!existing.includes(strId)) {
      localStorage.setItem(lsKey, JSON.stringify([...existing, strId]));
    }
    const rem = getStoredFn().filter((x) => String(x.id) !== strId);
    if (lsDataKey) localStorage.setItem(lsDataKey, JSON.stringify(rem));
  } catch {}
};

const getStoredJSON = (key, inMemArr) => {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    const ids = new Set(parsed.map((x) => String(x.id)));
    return [...parsed, ...inMemArr.filter((x) => !ids.has(String(x.id)))];
  } catch {
    return inMemArr;
  }
};

const getStoredClasses = () => {
  try {
    const raw = localStorage.getItem(LOCAL_CLASSES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const clean = parsed.filter((c) => c && c.name && !c.name.startsWith('{'));
        if (clean.length > 0) return clean;
      }
    }
  } catch {}
  return DEFAULT_CLASSES;
};

const getStoredSubmissions = () => getStoredJSON(LOCAL_SUBS_KEY, inMemoryLocalSubs);
const getStoredUsers = () => getStoredJSON(LOCAL_USERS_KEY, inMemoryLocalUsers);
const getStoredProjects = () => getStoredJSON(LOCAL_PROJECTS_KEY, inMemoryLocalProjects);

const getDeletedSubmissionIds = () => getDeletedSet(LOCAL_DELETED_SUBS_KEY, inMemoryDeletedSubs);
const getDeletedUserIds = () => getDeletedSet(LOCAL_DELETED_USERS_KEY, inMemoryDeletedUsers);
const getDeletedProjectIds = () => getDeletedSet(LOCAL_DELETED_PROJECTS_KEY, inMemoryDeletedProjects);

const persistLocalSubmission = (doc) => {
  const strId = String(doc.id);
  inMemoryLocalSubs = [doc, ...inMemoryLocalSubs.filter((s) => String(s.id) !== strId)];
  try {
    const existing = getStoredSubmissions().filter((s) => String(s.id) !== strId);
    localStorage.setItem(LOCAL_SUBS_KEY, JSON.stringify([doc, ...existing]));
  } catch {}
};

const persistLocalUser = (doc) => {
  const strId = String(doc.id);
  inMemoryLocalUsers = [doc, ...inMemoryLocalUsers.filter((u) => String(u.id) !== strId)];
  try {
    const existing = getStoredUsers().filter((u) => String(u.id) !== strId);
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify([doc, ...existing]));
  } catch {}
};

const persistLocalProject = (doc) => {
  const strId = String(doc.id);
  inMemoryLocalProjects = [doc, ...inMemoryLocalProjects.filter((p) => String(p.id) !== strId)];
  try {
    const existing = getStoredProjects().filter((p) => String(p.id) !== strId);
    localStorage.setItem(LOCAL_PROJECTS_KEY, JSON.stringify([doc, ...existing]));
  } catch {}
};

const persistDeletedSubmissionId = (id) => {
  persistDeleted(LOCAL_DELETED_SUBS_KEY, inMemoryDeletedSubs, LOCAL_SUBS_KEY, getStoredSubmissions, id);
};
const persistDeletedUserId = (id) => {
  persistDeleted(LOCAL_DELETED_USERS_KEY, inMemoryDeletedUsers, LOCAL_USERS_KEY, getStoredUsers, id);
};
const persistDeletedProjectId = (id) => {
  persistDeleted(LOCAL_DELETED_PROJECTS_KEY, inMemoryDeletedProjects, LOCAL_PROJECTS_KEY, getStoredProjects, id);
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const normalizeProject = (p) => {
  let classId = p.classId || p.class_id || [];
  if (typeof classId === 'string') {
    classId = classId ? classId.split(',').map((s) => s.trim()).filter(Boolean) : [];
  }
  let targetStudents = p.targetStudents || p.target_students || [];
  if (typeof targetStudents === 'string') {
    targetStudents = targetStudents ? targetStudents.split(',').map((s) => s.trim()).filter(Boolean) : [];
  }
  return { ...p, classId, targetStudents };
};

// ─── Provider ─────────────────────────────────────────────────────────────────

export const DataProvider = ({ children }) => {
  const showToast = useToast();
  const [data, setData] = useState({
    classes: getStoredClasses(),
    users: [],
    projects: [],
    submissions: [],
  });
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const isSyncingToCloudRef = useRef(false);
  const realtimeChannelRef = useRef(null);

  // ── Load from Supabase (primary) with GAS fallback ──────────────────────────
  const loadData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setIsSyncing(true);

    try {
      // Try Supabase first
      let fromSupabase = false;
      let classes = [], users = [], projects = [], submissions = [];

      try {
        const [clsRes, usrRes, prjRes, subRes] = await Promise.all([
          supabase.from('classes').select('*'),
          supabase.from('users').select('*'),
          supabase.from('projects').select('*'),
          supabase.from('submissions').select('*'),
        ]);

        // Only use Supabase data if at least ONE table has data or no error
        const anyError = clsRes.error || usrRes.error || prjRes.error || subRes.error;
        const anyData = (clsRes.data?.length || 0) + (usrRes.data?.length || 0) +
          (prjRes.data?.length || 0) + (subRes.data?.length || 0);

        if (!anyError && anyData > 0) {
          classes = clsRes.data || [];
          users = usrRes.data || [];
          projects = (prjRes.data || []).map(normalizeProject);
          submissions = subRes.data || [];
          fromSupabase = true;
          console.log('[Supabase] Data loaded:', { classes: classes.length, users: users.length, projects: projects.length, submissions: submissions.length });
        } else if (anyError) {
          console.warn('[Supabase] Error loading, falling back to GAS:', anyError?.message);
        } else {
          // Supabase tables are empty or not yet migrated — fall through to GAS
          console.warn('[Supabase] Tables empty, falling back to GAS');
        }
      } catch (sbErr) {
        console.warn('[Supabase] Network error, falling back to GAS:', sbErr.message);
      }

      if (!fromSupabase) {
        // Fallback: GAS / GViz
        const response = await callGas('getInitialData');
        if (response) {
          classes = response.classes || [];
          users = response.users || [];
          projects = (response.projects || []).map(normalizeProject);
          submissions = response.submissions || [];
        }
      }

      // ── Merge with local overrides ─────────────────────────────────────────
      const deletedSubIds = getDeletedSubmissionIds();
      const localSubs = getStoredSubmissions();
      const remoteSubs = submissions.filter((s) => !deletedSubIds.has(String(s.id)));
      const remoteSubIds = new Set(remoteSubs.map((s) => String(s.id)));
      const mergedSubmissions = [
        ...localSubs.filter((s) => !remoteSubIds.has(String(s.id)) && !deletedSubIds.has(String(s.id))),
        ...remoteSubs,
      ];

      const deletedUserIds = getDeletedUserIds();
      const localUsers = getStoredUsers();
      const remoteUsers = users.filter((u) => !deletedUserIds.has(String(u.id)));
      const localUserMap = new Map(localUsers.map((u) => [String(u.id), u]));
      const mergedUsers = remoteUsers.map((ru) => {
        const lu = localUserMap.get(String(ru.id));
        return lu ? { ...ru, ...lu, photo: lu.photo || ru.photo || '' } : ru;
      });
      const remoteUserIds = new Set(remoteUsers.map((u) => String(u.id)));
      for (const lu of localUsers) {
        if (!remoteUserIds.has(String(lu.id))) mergedUsers.push(lu);
      }

      const deletedProjectIds = getDeletedProjectIds();
      const localProjects = getStoredProjects();
      const localProjectMap = new Map(localProjects.map((p) => [String(p.id), p]));
      const remoteProjects = projects.filter((p) => !deletedProjectIds.has(String(p.id)));
      const mergedProjects = remoteProjects.map((rp) => {
        const lp = localProjectMap.get(String(rp.id));
        return lp ? { ...rp, ...lp } : rp;
      });
      const remoteProjectIds = new Set(remoteProjects.map((p) => String(p.id)));
      for (const lp of localProjects) {
        if (!deletedProjectIds.has(String(lp.id)) && !remoteProjectIds.has(String(lp.id))) {
          mergedProjects.unshift(lp);
        }
      }

      const remoteClasses = classes.filter((c) => c && c.name && !c.name.startsWith('{'));
      const finalClasses = remoteClasses.length > 0 ? remoteClasses : getStoredClasses();
      try {
        if (finalClasses.length > 0) localStorage.setItem(LOCAL_CLASSES_KEY, JSON.stringify(finalClasses));
      } catch {}

      setData({
        classes: finalClasses.length > 0 ? finalClasses : DEFAULT_CLASSES,
        users: mergedUsers,
        projects: mergedProjects,
        submissions: mergedSubmissions,
      });

      // Auto-sync locally-stuck submissions to Supabase
      const unSyncedSubs = localSubs.filter((s) => {
        if (!s || deletedSubIds.has(String(s.id))) return false;
        const notInRemote = !remoteSubIds.has(String(s.id));
        const hasRawFile = s.fileData && String(s.fileData).startsWith('data:');
        const isLocalId = String(s.id).startsWith('ok-') || String(s.id).startsWith('doc-') || String(s.id).length < 20;
        return notInRemote && (hasRawFile || isLocalId);
      });
      if (unSyncedSubs.length > 0 && !isSyncingToCloudRef.current) {
        syncLocalSubmissionsToSupabase(unSyncedSubs);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      if (!silent) showToast('Gagal memuat data dari server', 'error');
    }

    if (!silent) setLoading(false);
    else setIsSyncing(false);
  }, []); // eslint-disable-line

  // ── Auto-sync stuck local submissions to Supabase ───────────────────────────
  const syncLocalSubmissionsToSupabase = async (unSynced) => {
    if (isSyncingToCloudRef.current) return;
    isSyncingToCloudRef.current = true;
    try {
      for (const item of unSynced) {
        try {
          const { id: oldLocalId, fileData, ...payload } = item;
          console.log('[AutoSync] Mengunggah ke Supabase:', payload.title || 'Tanpa Judul');

          // If fileData is a base64 DataURL, upload to storage
          let storedFileData = fileData || '';
          if (storedFileData.startsWith('data:')) {
            storedFileData = await uploadKaryaFile(fileData, payload.fileName || `karya.${payload.fileExt || 'bin'}`);
          }

          const newRow = { ...payload, fileData: storedFileData };
          const { data: inserted, error: insErr } = await supabase.from('submissions').insert(newRow).select();
          if (!insErr && inserted && inserted[0]) {
            const remoteId = inserted[0].id || oldLocalId;
            console.log('[AutoSync] Sukses tersinkron ke Supabase! ID:', remoteId);
            const updatedDoc = { ...newRow, id: remoteId };
            const currentStored = getStoredSubmissions().filter(
              (s) => String(s.id) !== String(oldLocalId) && String(s.id) !== String(remoteId)
            );
            localStorage.setItem(LOCAL_SUBS_KEY, JSON.stringify([updatedDoc, ...currentStored]));
            inMemoryLocalSubs = [updatedDoc, ...inMemoryLocalSubs.filter((s) => String(s.id) !== String(oldLocalId))];
            setData((prev) => ({
              ...prev,
              submissions: [
                updatedDoc,
                ...(prev.submissions || []).filter((s) => String(s.id) !== String(oldLocalId) && String(s.id) !== String(remoteId)),
              ],
            }));
          }
        } catch (subErr) {
          console.warn('[AutoSync] Gagal menyinkronkan karya:', item.title, subErr);
        }
      }
    } finally {
      isSyncingToCloudRef.current = false;
    }
  };

  // ── Supabase Realtime subscription ──────────────────────────────────────────
  const setupRealtimeSubscription = useCallback(() => {
    if (realtimeChannelRef.current) {
      supabase.removeChannel(realtimeChannelRef.current);
    }

    const channel = supabase
      .channel('public:submissions')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'submissions' },
        (payload) => {
          console.log('[Realtime] Submission baru masuk:', payload.new?.id);
          const newSub = payload.new;
          if (!newSub) return;
          setData((prev) => {
            const exists = (prev.submissions || []).some((s) => String(s.id) === String(newSub.id));
            if (exists) return prev;
            return { ...prev, submissions: [newSub, ...prev.submissions] };
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'submissions' },
        (payload) => {
          const updated = payload.new;
          if (!updated) return;
          setData((prev) => ({
            ...prev,
            submissions: (prev.submissions || []).map((s) =>
              String(s.id) === String(updated.id) ? { ...s, ...updated } : s
            ),
          }));
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'submissions' },
        (payload) => {
          const deleted = payload.old;
          if (!deleted) return;
          setData((prev) => ({
            ...prev,
            submissions: (prev.submissions || []).filter((s) => String(s.id) !== String(deleted.id)),
          }));
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        () => loadData(true)
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'users' },
        () => loadData(true)
      )
      .subscribe((status) => {
        console.log('[Realtime] Status:', status);
      });

    realtimeChannelRef.current = channel;
  }, [loadData]);

  // ── CRUD: addDocument ────────────────────────────────────────────────────────
  const addDocument = async (colName, docData) => {
    const fallbackId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : 'doc-' + Date.now();

    let remoteId = null;
    let finalDoc = { ...docData };

    try {
      // For submissions, upload file to Supabase Storage first
      if (colName === 'submissions' && finalDoc.fileData && finalDoc.fileData.startsWith('data:')) {
        const uploadedUrl = await uploadKaryaFile(finalDoc.fileData, finalDoc.fileName || `karya.${finalDoc.fileExt || 'bin'}`);
        finalDoc = { ...finalDoc, fileData: uploadedUrl };
      }

      const { data: inserted, error } = await supabase.from(colName).insert(finalDoc).select();
      if (error) {
        console.warn(`[Supabase] Insert ${colName} failed:`, error.message);
        // Fallback to GAS
        try {
          remoteId = await callGas('addDocument', colName, docData);
        } catch {}
      } else if (inserted && inserted[0]) {
        remoteId = inserted[0].id || fallbackId;
        finalDoc = { ...finalDoc, id: remoteId };
      }
    } catch (err) {
      console.warn(`[DataContext] addDocument ${colName} error:`, err.message);
      try {
        remoteId = await callGas('addDocument', colName, docData);
      } catch {}
    }

    const finalId = remoteId || fallbackId;
    const newDoc = { id: finalId, ...finalDoc, createdAt: finalDoc.createdAt || new Date().toISOString() };

    setData((prev) => ({
      ...prev,
      [colName]: [newDoc, ...(prev[colName] || []).filter((item) => String(item.id) !== String(finalId))],
    }));

    if (colName === 'submissions') persistLocalSubmission(newDoc);
    else if (colName === 'users') persistLocalUser(newDoc);
    else if (colName === 'projects') persistLocalProject(newDoc);

    return finalId;
  };

  // ── CRUD: updateDocument ─────────────────────────────────────────────────────
  const updateDocument = async (colName, id, updateData) => {
    try {
      const { error } = await supabase.from(colName).update(updateData).eq('id', id);
      if (error) {
        console.warn(`[Supabase] Update ${colName} failed:`, error.message);
        try { await callGas('updateDocument', colName, id, updateData); } catch {}
      }
    } catch (err) {
      console.warn(`[DataContext] updateDocument ${colName}:`, err.message);
      try { await callGas('updateDocument', colName, id, updateData); } catch {}
    }

    setData((prev) => {
      const updatedList = (prev[colName] || []).map((item) =>
        String(item.id) === String(id) ? { ...item, ...updateData } : item
      );
      if (colName === 'submissions') {
        const target = updatedList.find((item) => String(item.id) === String(id));
        if (target) persistLocalSubmission(target);
      } else if (colName === 'users') {
        const target = updatedList.find((item) => String(item.id) === String(id));
        if (target) persistLocalUser(target);
      } else if (colName === 'projects') {
        const target = updatedList.find((item) => String(item.id) === String(id));
        if (target) persistLocalProject(target);
      }
      return { ...prev, [colName]: updatedList };
    });

    return true;
  };

  // ── CRUD: deleteDocument ─────────────────────────────────────────────────────
  const deleteDocument = async (colName, id) => {
    try {
      const { error } = await supabase.from(colName).delete().eq('id', id);
      if (error) {
        console.warn(`[Supabase] Delete ${colName} failed:`, error.message);
        try { await callGas('deleteDocument', colName, id); } catch {}
      }
    } catch (err) {
      console.warn(`[DataContext] deleteDocument ${colName}:`, err.message);
      try { await callGas('deleteDocument', colName, id); } catch {}
    }

    setData((prev) => ({
      ...prev,
      [colName]: (prev[colName] || []).filter((item) => String(item.id) !== String(id)),
    }));

    if (colName === 'submissions') {
      persistDeletedSubmissionId(id);
      inMemoryLocalSubs = inMemoryLocalSubs.filter((s) => String(s.id) !== String(id));
      try {
        const remaining = getStoredSubmissions().filter((s) => String(s.id) !== String(id));
        localStorage.setItem(LOCAL_SUBS_KEY, JSON.stringify(remaining));
      } catch {}
    } else if (colName === 'users') {
      persistDeletedUserId(id);
      inMemoryLocalUsers = inMemoryLocalUsers.filter((u) => String(u.id) !== String(id));
      try {
        const remaining = getStoredUsers().filter((u) => String(u.id) !== String(id));
        localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(remaining));
      } catch {}
    } else if (colName === 'projects') {
      persistDeletedProjectId(id);
    }

    // Also notify other devices via server sync endpoint
    fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', colName, id }),
    }).catch(() => {});

    return true;
  };

  // ── Lifecycle ────────────────────────────────────────────────────────────────
  useEffect(() => {
    loadData();
    setupRealtimeSubscription();

    // Background polling every 15 seconds as extra safety net (Realtime handles instant updates)
    const interval = setInterval(() => {
      loadData(true);
    }, 15000);

    return () => {
      clearInterval(interval);
      if (realtimeChannelRef.current) {
        supabase.removeChannel(realtimeChannelRef.current);
      }
    };
  }, []); // eslint-disable-line

  return (
    <DataContext.Provider
      value={{
        data,
        loading,
        isSyncing,
        loadData,
        addDocument,
        updateDocument,
        deleteDocument,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
