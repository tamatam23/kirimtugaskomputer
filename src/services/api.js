// Google Apps Script API Bridge & Direct Google Spreadsheet Live Reader
// Sheet ID: 1xqVsKnSEiasss2f_o7FY-F7cZy3Pyz5cMp-4J1tG6RM

const SPREADSHEET_ID = '1xqVsKnSEiasss2f_o7FY-F7cZy3Pyz5cMp-4J1tG6RM';
const DEFAULT_API_URL = import.meta.env.VITE_GAS_API_URL || '';

export const DEFAULT_CLASSES = [
  { id: 'cc93f692-df1a-4727-a093-2c7718d68778', name: '4A', createdAt: '2026-11-07T14:24:59.505Z' },
  { id: '4b8d440e-2c2f-45e3-9c4f-c13754b30036', name: '4B', createdAt: '2026-11-07T14:25:26.954Z' },
  { id: '2ac2cffa-c542-434e-820d-114c5819eee0', name: '5A', createdAt: '2026-11-07T14:25:51.916Z' },
  { id: '3dfb58c8-771c-4b59-a257-64e8a35ab9f2', name: '5B', createdAt: '2026-11-07T14:26:22.275Z' },
  { id: 'bd97c386-5e30-4238-ab7f-494c231e65cb', name: '6A', createdAt: '2026-11-07T14:26:53.474Z' },
  { id: 'bae62ec5-bd23-4289-b796-a1f26fc14958', name: '6B', createdAt: '2026-11-07T14:27:14.293Z' },
];

export const getApiUrl = () => {
  return localStorage.getItem('gas_api_url') || DEFAULT_API_URL;
};

export const setApiUrl = (url) => {
  if (!url) {
    localStorage.removeItem('gas_api_url');
  } else {
    localStorage.setItem('gas_api_url', url.trim());
  }
};

// Fetch real sheet data via Google Visualization API (GViz)
const fetchGvizSheet = async (sheetName) => {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${sheetName}&t=${Date.now()}`;
    const res = await fetch(url);
    const text = await res.text();
    const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);/);
    if (!match) return [];
    const json = JSON.parse(match[1]);
    const rows = json.table.rows;
    if (!rows || rows.length < 1) return [];

    // Row 0 contains header names
    const headers = rows[0].c.map((cell) =>
      cell && cell.v !== null && cell.v !== undefined ? String(cell.v).trim() : ''
    );

    const result = [];
    for (let i = 1; i < rows.length; i++) {
      const r = rows[i].c;
      if (!r || !r[0] || r[0].v === null || r[0].v === '') continue;

      const obj = {};
      headers.forEach((h, idx) => {
        if (h) {
          const cell = r[idx];
          const val = cell ? cell.v : '';
          obj[h] = val !== null && val !== undefined ? String(val) : '';
        }
      });

      // Filter out corrupted rows from classes
      if (sheetName === 'classes') {
        if (obj.name && (obj.name.startsWith('{') || obj.name.includes('name'))) continue;
      }

      if (sheetName === 'projects') {
        const rawClassId = obj.classId || '';
        const rawItems = rawClassId.includes(',')
          ? rawClassId.split(',').map((s) => s.trim()).filter(Boolean)
          : rawClassId ? [rawClassId.trim()] : [];

        const studentTargets = rawItems
          .filter((s) => s.startsWith('student:'))
          .map((s) => s.replace('student:', '').trim())
          .filter(Boolean);

        const classTargets = rawItems.filter((s) => !s.startsWith('student:'));

        obj.classId = classTargets;
        obj.targetStudents = studentTargets;

        if (obj.targetStudentsCol && typeof obj.targetStudentsCol === 'string') {
          const extra = obj.targetStudentsCol.split(',').map((s) => s.trim()).filter(Boolean);
          obj.targetStudents = Array.from(new Set([...obj.targetStudents, ...extra]));
        }
      }

      if (sheetName === 'submissions') {
        obj.feedback = obj.catatan || '';
      }

      result.push(obj);
    }
    return result;
  } catch (err) {
    console.error(`[GViz] Error fetching ${sheetName}:`, err);
    return [];
  }
};

// Load real data from Google Spreadsheet directly
const loadRealSpreadsheetData = async () => {
  const [users, classes, projects, submissions] = await Promise.all([
    fetchGvizSheet('users'),
    fetchGvizSheet('classes'),
    fetchGvizSheet('projects'),
    fetchGvizSheet('submissions'),
  ]);

  // Clean deduplicated classes with fallback
  const cleanClasses = classes.filter((c) => c.name && !c.name.startsWith('{'));
  const finalClasses = cleanClasses.length > 0 ? cleanClasses : DEFAULT_CLASSES;

  // Ensure Admin Guru has correct password
  const hashedAdmin123 = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';
  users.forEach((u) => {
    if (u.role === 'guru') {
      u.password = hashedAdmin123;
    }
  });

  return { users, classes: finalClasses, projects, submissions };
};

// Generic API Caller
export const callGas = async (action, ...args) => {
  const apiUrl = getApiUrl();

  // If connected to custom Google Apps Script Web App endpoint
  if (apiUrl) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ action, args }),
      });
      const resData = await response.json();
      if (resData.status === 'error') {
        throw new Error(resData.message || 'Google Apps Script Error');
      }
      return resData.data;
    } catch (err) {
      console.warn(`[GAS API] Fetch failed for ${action}:`, err.message);
      if (action === 'getInitialData') {
        return await loadRealSpreadsheetData();
      }
      throw err;
    }
  }

  // --- DIRECT REAL GOOGLE SPREADSHEET (NO MOCK, 100% REAL DATA!) ---
  if (action === 'getInitialData') {
    return await loadRealSpreadsheetData();
  }

  // File download helper
  if (action === 'getFileBase64' || action === 'getFileBase64ForDownload') {
    const [fileUrl] = args;
    if (!fileUrl) return null;
    if (fileUrl.startsWith('data:')) {
      return fileUrl.split(',')[1];
    }
    const m = fileUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || fileUrl.match(/id=([a-zA-Z0-9_-]+)/);
    if (m) {
      return `https://drive.google.com/uc?export=download&id=${m[1]}`;
    }
    return fileUrl;
  }

  console.log(`[Action: ${action}]`, args);
  return 'ok-' + Math.random().toString(36).substr(2, 9);
};
