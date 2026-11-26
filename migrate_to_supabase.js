// Migration script: Google Sheets GViz -> Supabase
const SPREADSHEET_ID = '1xqVsKnSEiasss2f_o7FY-F7cZy3Pyz5cMp-4J1tG6RM';
const SUPABASE_URL = 'https://mcyjsubijeadtaedwysk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jeWpzdWJpamVhZHRhZWR3eXNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU2OTk4NDksImV4cCI6MjExMTI3NTg0OX0.j_mdsP4EJ4S8zY_5qQnzgeYof5avmwO_fSme2qSimx0';

const DEFAULT_CLASSES = [
  { id: 'cc93f692-df1a-4727-a093-2c7718d68778', name: '4A', createdAt: '2026-11-07T14:24:59.505Z' },
  { id: '4b8d440e-2c2f-45e3-9c4f-c13754b30036', name: '4B', createdAt: '2026-11-07T14:25:26.954Z' },
  { id: '2ac2cffa-c542-434e-820d-114c5819eee0', name: '5A', createdAt: '2026-11-07T14:25:51.916Z' },
  { id: '3dfb58c8-771c-4b59-a257-64e8a35ab9f2', name: '5B', createdAt: '2026-11-07T14:26:22.275Z' },
  { id: 'bd97c386-5e30-4238-ab7f-494c231e65cb', name: '6A', createdAt: '2026-11-07T14:26:53.474Z' },
  { id: 'bae62ec5-bd23-4289-b796-a1f26fc14958', name: '6B', createdAt: '2026-11-07T14:27:14.293Z' },
];

async function fetchGvizSheet(sheetName) {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${sheetName}&t=${Date.now()}`;
  const res = await fetch(url);
  const text = await res.text();
  const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);/);
  if (!match) return [];
  const json = JSON.parse(match[1]);
  const rows = json.table.rows;
  if (!rows || rows.length < 1) return [];

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

    if (sheetName === 'classes') {
      if (obj.name && (obj.name.startsWith('{') || obj.name.includes('name'))) continue;
    }

    result.push(obj);
  }
  return result;
}

async function insertSupabase(table, data) {
  if (!data || data.length === 0) return;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.text();
    console.error(`Error inserting into ${table}:`, err);
  } else {
    console.log(`Berhasil migrasi ${data.length} baris ke tabel ${table}!`);
  }
}

const GAS_URL = 'https://script.google.com/macros/s/AKfycbyw9FcaTwug8rp_38ehYUBhbmwZeK9X7Z0L4_FX-Vfh2vCAFtbJYnN1UA9uofcqcGPv/exec';

async function fetchInitialData() {
  try {
    console.log('Mengambil data dari Google Apps Script Web App...');
    const res = await fetch(GAS_URL + '?action=getInitialData', { redirect: 'follow' });
    const json = await res.json();
    if (json.status === 'success' && json.data) {
      return json.data;
    }
  } catch (err) {
    console.warn('GAS Web App fetch gagal, mencoba GViz...', err.message);
  }

  // Fallback to GViz
  const [users, classes, projects, submissions] = await Promise.all([
    fetchGvizSheet('users'),
    fetchGvizSheet('classes'),
    fetchGvizSheet('projects'),
    fetchGvizSheet('submissions'),
  ]);
  return { users, classes, projects, submissions };
}
async function runMigration() {
  console.log('Mulai migrasi data ke Supabase...');
  const data = await fetchInitialData();
  const rawClasses = data.classes || [];
  const rawUsers = data.users || [];
  const rawProjects = data.projects || [];
  const rawSubmissions = data.submissions || [];

  console.log(`Data ditarik: ${rawClasses.length} kelas, ${rawUsers.length} user, ${rawProjects.length} project, ${rawSubmissions.length} submission.`);

  // 1. Classes
  const cleanClasses = rawClasses.filter((c) => c.name && !c.name.startsWith('{'));
  const finalClasses = cleanClasses.length > 0 ? cleanClasses : DEFAULT_CLASSES;
  const formattedClasses = finalClasses.map(c => ({
    id: String(c.id).trim(),
    name: String(c.name).trim(),
    createdAt: c.createdAt || new Date().toISOString()
  }));
  await insertSupabase('classes', formattedClasses);

  // 2. Users
  const hashedAdmin123 = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';
  const formattedUsers = rawUsers.map(u => ({
    id: String(u.id).trim(),
    role: u.role || 'siswa',
    name: u.name || '',
    username: u.username || '',
    password: u.role === 'guru' ? hashedAdmin123 : (u.password || ''),
    classId: u.classId || '',
    pin: u.pin || (u.role === 'guru' ? '2389' : '1234'),
    photo: u.photo || '',
    createdAt: u.createdAt || new Date().toISOString()
  }));
  await insertSupabase('users', formattedUsers);

  // 3. Projects
  const formattedProjects = rawProjects.map(p => {
    let classArray = [];
    if (Array.isArray(p.classId)) {
      classArray = p.classId;
    } else if (typeof p.classId === 'string') {
      classArray = p.classId.includes(',')
        ? p.classId.split(',').map(s => s.trim()).filter(Boolean)
        : p.classId ? [p.classId.trim()] : [];
    }
    
    return {
      id: String(p.id).trim(),
      title: p.title || '',
      desc: p.desc || '',
      classId: classArray,
      deadline: p.deadline || '',
      status: p.status || 'aktif',
      targetStudents: Array.isArray(p.targetStudents) ? p.targetStudents : [],
      createdAt: p.createdAt || new Date().toISOString()
    };
  });
  await insertSupabase('projects', formattedProjects);

  // 4. Submissions
  const formattedSubmissions = rawSubmissions.map(s => ({
    id: String(s.id).trim(),
    projectId: String(s.projectId).trim(),
    studentId: String(s.studentId).trim(),
    title: s.title || '',
    fileData: s.fileData || '',
    fileExt: s.fileExt || '',
    nilai: s.nilai || '',
    catatan: s.catatan || '',
    feedback: s.feedback || s.catatan || '',
    studentName: s.studentName || '',
    className: s.className || '',
    createdAt: s.createdAt || new Date().toISOString()
  }));
  await insertSupabase('submissions', formattedSubmissions);

  console.log('\n🎉 MIGRASI KE SUPABASE BERHASIL 100%!');
}

runMigration().catch(console.error);
