import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { callGas, DEFAULT_CLASSES } from '../services/api';
import { useToast } from './ToastContext';

const DataContext = createContext(null);

const LOCAL_CLASSES_KEY = 'galeri_cached_classes';

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
  } catch (e) {}
  return DEFAULT_CLASSES;
};

const LOCAL_SUBS_KEY = 'galeri_local_submissions';
const LOCAL_DELETED_SUBS_KEY = 'galeri_deleted_submissions';
let inMemoryLocalSubs = [];
let inMemoryDeletedSubs = [];

const LOCAL_USERS_KEY = 'galeri_local_users';
const LOCAL_DELETED_USERS_KEY = 'galeri_deleted_users';
let inMemoryLocalUsers = [];
let inMemoryDeletedUsers = [];

const LOCAL_PROJECTS_KEY = 'galeri_local_projects';
const LOCAL_DELETED_PROJECTS_KEY = 'galeri_deleted_projects';
let inMemoryLocalProjects = [];
let inMemoryDeletedProjects = [];

const getDeletedSubmissionIds = () => {
  try {
    const raw = localStorage.getItem(LOCAL_DELETED_SUBS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set([...parsed, ...inMemoryDeletedSubs]);
  } catch {
    return new Set(inMemoryDeletedSubs);
  }
};

const persistDeletedSubmissionId = (id) => {
  const strId = String(id);
  if (!inMemoryDeletedSubs.includes(strId)) {
    inMemoryDeletedSubs.push(strId);
  }
  try {
    const existing = Array.from(getDeletedSubmissionIds());
    if (!existing.includes(strId)) {
      localStorage.setItem(LOCAL_DELETED_SUBS_KEY, JSON.stringify([...existing, strId]));
    }
    const remSubs = getStoredSubmissions().filter((s) => String(s.id) !== strId);
    localStorage.setItem(LOCAL_SUBS_KEY, JSON.stringify(remSubs));
  } catch {}
};

const getDeletedUserIds = () => {
  try {
    const raw = localStorage.getItem(LOCAL_DELETED_USERS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set([...parsed, ...inMemoryDeletedUsers]);
  } catch {
    return new Set(inMemoryDeletedUsers);
  }
};

const persistDeletedUserId = (id) => {
  const strId = String(id);
  if (!inMemoryDeletedUsers.includes(strId)) {
    inMemoryDeletedUsers.push(strId);
  }
  try {
    const existing = Array.from(getDeletedUserIds());
    if (!existing.includes(strId)) {
      localStorage.setItem(LOCAL_DELETED_USERS_KEY, JSON.stringify([...existing, strId]));
    }
    const remUsers = getStoredUsers().filter((u) => String(u.id) !== strId);
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(remUsers));
  } catch {}
};

const getStoredProjects = () => {
  try {
    const raw = localStorage.getItem(LOCAL_PROJECTS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    const ids = new Set(parsed.map((p) => String(p.id)));
    return [...parsed, ...inMemoryLocalProjects.filter((p) => !ids.has(String(p.id)))];
  } catch {
    return inMemoryLocalProjects;
  }
};

const getDeletedProjectIds = () => {
  try {
    const raw = localStorage.getItem(LOCAL_DELETED_PROJECTS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set([...parsed, ...inMemoryDeletedProjects]);
  } catch {
    return new Set(inMemoryDeletedProjects);
  }
};

const persistLocalProject = (doc) => {
  inMemoryLocalProjects = [doc, ...inMemoryLocalProjects.filter((p) => String(p.id) !== String(doc.id))];
  try {
    const existing = getStoredProjects().filter((p) => String(p.id) !== String(doc.id));
    localStorage.setItem(LOCAL_PROJECTS_KEY, JSON.stringify([doc, ...existing]));
  } catch (e) {
    console.warn('[LocalStorage] Quota reached for projects:', e);
  }
};

const persistDeletedProjectId = (id) => {
  const strId = String(id);
  if (!inMemoryDeletedProjects.includes(strId)) {
    inMemoryDeletedProjects.push(strId);
  }
  try {
    const existing = Array.from(getDeletedProjectIds());
    if (!existing.includes(strId)) {
      localStorage.setItem(LOCAL_DELETED_PROJECTS_KEY, JSON.stringify([...existing, strId]));
    }
    const remProjects = getStoredProjects().filter((p) => String(p.id) !== strId);
    localStorage.setItem(LOCAL_PROJECTS_KEY, JSON.stringify(remProjects));
  } catch {}
};

const getStoredSubmissions = () => {
  try {
    const deletedIds = getDeletedSubmissionIds();
    const raw = localStorage.getItem(LOCAL_SUBS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    const ids = new Set(parsed.map((s) => String(s.id)));
    const all = [...parsed, ...inMemoryLocalSubs.filter((s) => !ids.has(String(s.id)))];
    return all.filter((s) => !deletedIds.has(String(s.id)));
  } catch {
    return inMemoryLocalSubs;
  }
};

const persistLocalSubmission = (doc) => {
  inMemoryLocalSubs = [doc, ...inMemoryLocalSubs.filter((s) => String(s.id) !== String(doc.id))];
  try {
    const existing = getStoredSubmissions().filter((s) => String(s.id) !== String(doc.id));
    localStorage.setItem(LOCAL_SUBS_KEY, JSON.stringify([doc, ...existing]));
  } catch (e) {
    console.warn('[LocalStorage] Quota reached for submissions:', e);
  }
};

const getStoredUsers = () => {
  try {
    const deletedUserIds = getDeletedUserIds();
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    const ids = new Set(parsed.map((u) => String(u.id)));
    const all = [...parsed, ...inMemoryLocalUsers.filter((u) => !ids.has(String(u.id)))];
    return all.filter((u) => !deletedUserIds.has(String(u.id)));
  } catch {
    return inMemoryLocalUsers;
  }
};

const persistLocalUser = (doc) => {
  inMemoryLocalUsers = [doc, ...inMemoryLocalUsers.filter((u) => String(u.id) !== String(doc.id))];
  try {
    const existing = getStoredUsers().filter((u) => String(u.id) !== String(doc.id));
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify([doc, ...existing]));
  } catch (e) {
    console.warn('[LocalStorage] Quota reached for users:', e);
  }
};

export const DataProvider = ({ children }) => {
  const [data, setData] = useState({
    users: getStoredUsers(),
    classes: getStoredClasses(),
    projects: getStoredProjects(),
    submissions: getStoredSubmissions(),
  });
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const isSyncingToCloudRef = useRef(false);
  const showToast = useToast();

  const syncLocalSubmissionsToCloud = async (unSyncedList) => {
    if (!unSyncedList || unSyncedList.length === 0 || isSyncingToCloudRef.current) return;
    isSyncingToCloudRef.current = true;

    try {
      console.log(`[AutoSync] Mendeteksi ${unSyncedList.length} karya lokal yang belum tersinkron ke cloud...`);
      for (const item of unSyncedList) {
        try {
          const { id: oldLocalId, ...payload } = item;
          console.log('[AutoSync] Mengunggah karya:', payload.title || 'Tanpa Judul');
          const remoteId = await callGas('addDocument', 'submissions', payload);
          if (remoteId && !String(remoteId).startsWith('ok-')) {
            console.log('[AutoSync] Sukses tersinkron ke Google Drive & Sheets! Remote ID:', remoteId);
            const currentStored = getStoredSubmissions().filter(
              (s) => String(s.id) !== String(oldLocalId) && String(s.id) !== String(remoteId)
            );
            const updatedDoc = { ...payload, id: remoteId };
            localStorage.setItem(LOCAL_SUBS_KEY, JSON.stringify([updatedDoc, ...currentStored]));
            inMemoryLocalSubs = [updatedDoc, ...inMemoryLocalSubs.filter((s) => String(s.id) !== String(oldLocalId))];
            
            // Perbarui state secara reaktif
            setData((prev) => ({
              ...prev,
              submissions: [
                updatedDoc,
                ...(prev.submissions || []).filter((s) => String(s.id) !== String(oldLocalId) && String(s.id) !== String(remoteId))
              ]
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

  const loadData = async (silent = false) => {
    if (!silent) setLoading(true);
    else setIsSyncing(true);

    try {
      // Pull centralized network sync for deleted items across all browsers/devices
      try {
        const syncRes = await fetch('/api/sync');
        if (syncRes.ok) {
          const syncData = await syncRes.json();
          if (Array.isArray(syncData.deletedSubmissions)) {
            syncData.deletedSubmissions.forEach((id) => persistDeletedSubmissionId(id));
          }
          if (Array.isArray(syncData.deletedProjects)) {
            syncData.deletedProjects.forEach((id) => persistDeletedProjectId(id));
          }
          if (Array.isArray(syncData.deletedUsers)) {
            syncData.deletedUsers.forEach((id) => persistDeletedUserId(id));
          }
        }
      } catch (e) {}

      const response = await callGas('getInitialData');
      if (response) {
        const deletedSubIds = getDeletedSubmissionIds();
        const localSubs = getStoredSubmissions();
        const remoteSubs = (response.submissions || []).filter(
          (s) => !deletedSubIds.has(String(s.id))
        );
        const remoteIds = new Set(remoteSubs.map((s) => String(s.id)));

        // Merge submissions: local submissions come first so latest uploads appear immediately!
        const mergedSubmissions = [
          ...localSubs.filter((s) => !remoteIds.has(String(s.id))),
          ...remoteSubs,
        ];

        // Merge users: local user updates (like profile photo) take precedence so polling never wipes them out!
        const deletedUserIds = getDeletedUserIds();
        const localUsers = getStoredUsers();
        const remoteUsers = (response.users || []).filter(
          (u) => !deletedUserIds.has(String(u.id))
        );
        const localUserMap = new Map(localUsers.map((u) => [String(u.id), u]));

        const mergedUsers = remoteUsers.map((ru) => {
          const lu = localUserMap.get(String(ru.id));
          if (lu) {
            return {
              ...ru,
              ...lu,
              photo: lu.photo || ru.photo || '',
            };
          }
          return ru;
        });

        const remoteUserIds = new Set(remoteUsers.map((u) => String(u.id)));
        for (const lu of localUsers) {
          if (!remoteUserIds.has(String(lu.id))) {
            mergedUsers.push(lu);
          }
        }

        // Merge projects: filter deleted projects, prioritize local overrides (status, targets, deadline)
        const deletedProjectIds = getDeletedProjectIds();
        const localProjects = getStoredProjects();
        const localProjectMap = new Map(localProjects.map((p) => [String(p.id), p]));
        const remoteProjects = (response.projects || []).filter(
          (p) => !deletedProjectIds.has(String(p.id))
        );

        const mergedProjects = remoteProjects.map((rp) => {
          const lp = localProjectMap.get(String(rp.id));
          if (lp) {
            return {
              ...rp,
              ...lp,
            };
          }
          return rp;
        });

        const remoteProjectIds = new Set(remoteProjects.map((p) => String(p.id)));
        for (const lp of localProjects) {
          if (!deletedProjectIds.has(String(lp.id)) && !remoteProjectIds.has(String(lp.id))) {
            mergedProjects.unshift(lp);
          }
        }

        // Cache & preserve valid classes
        const remoteClasses = (response.classes && response.classes.length > 0)
          ? response.classes.filter((c) => c && c.name && !c.name.startsWith('{'))
          : getStoredClasses();

        try {
          if (remoteClasses.length > 0) {
            localStorage.setItem(LOCAL_CLASSES_KEY, JSON.stringify(remoteClasses));
          }
        } catch (e) {}

        setData({
          ...response,
          classes: remoteClasses.length > 0 ? remoteClasses : DEFAULT_CLASSES,
          users: mergedUsers,
          projects: mergedProjects,
          submissions: mergedSubmissions,
        });

        // Auto-Sync: Deteksi karya siswa yang tersimpan di memori lokal laptop namun belum terkirim ke Google Drive/Sheets
        const unSyncedSubs = localSubs.filter((s) => {
          if (!s || deletedSubIds.has(String(s.id))) return false;
          const notInRemote = !remoteIds.has(String(s.id));
          const hasRawFile = s.fileData && String(s.fileData).startsWith('data:');
          const isLocalId = String(s.id).startsWith('ok-') || String(s.id).startsWith('doc-') || String(s.id).length < 20;
          return notInRemote && (hasRawFile || isLocalId);
        });

        if (unSyncedSubs.length > 0) {
          syncLocalSubmissionsToCloud(unSyncedSubs);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      if (!silent) showToast('Gagal memuat data dari server', 'error');
    }

    if (!silent) setLoading(false);
    else setIsSyncing(false);
  };

  const addDocument = async (colName, docData) => {
    const fallbackId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : 'doc-' + Date.now();
    let remoteId = null;

    try {
      remoteId = await callGas('addDocument', colName, docData);
    } catch (err) {
      console.warn(`[DataContext] Remote addDocument failed for ${colName}, saving locally:`, err);
    }

    const finalId = remoteId || fallbackId;
    const newDoc = {
      id: finalId,
      ...docData,
      createdAt: docData.createdAt || new Date().toISOString(),
    };

    setData((prev) => ({
      ...prev,
      [colName]: [newDoc, ...(prev[colName] || []).filter((item) => String(item.id) !== String(finalId))],
    }));

    if (colName === 'submissions') {
      persistLocalSubmission(newDoc);
    } else if (colName === 'users') {
      persistLocalUser(newDoc);
    } else if (colName === 'projects') {
      persistLocalProject(newDoc);
    }

    return finalId;
  };

  const updateDocument = async (colName, id, updateData) => {
    try {
      await callGas('updateDocument', colName, id, updateData);
    } catch (err) {
      console.warn(`[DataContext] Remote updateDocument failed for ${colName}:`, err);
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
      return {
        ...prev,
        [colName]: updatedList,
      };
    });

    return true;
  };

  const deleteDocument = async (colName, id) => {
    try {
      await callGas('deleteDocument', colName, id);
    } catch (err) {
      console.warn(`[DataContext] Remote deleteDocument failed for ${colName}:`, err);
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

    // Send delete notification to server sync middleware so other devices get it immediately
    fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', colName, id }),
    }).catch(() => {});

    return true;
  };

  useEffect(() => {
    loadData();
    // Background polling every 12 seconds for real-time feel
    const interval = setInterval(() => {
      loadData(true);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

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
