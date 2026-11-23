// Utilities & Helpers

export const hashPassword = async (text) => {
  const msgBuffer = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

export const compressAvatar = (file, size = 200) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (ev) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const side = Math.min(img.width, img.height);
        const sx = (img.width - side) / 2;
        const sy = (img.height - side) / 2;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        canvas.getContext('2d').drawImage(img, sx, sy, side, side, 0, 0, size, size);
        // 0.72 quality at 200x200 yields clean sharp avatar ~8-12KB base64, safe under 50k cell limit!
        resolve(canvas.toDataURL('image/jpeg', 0.72));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
};

export const driveThumb = (url, size = 400) => {
  if (!url || typeof url !== 'string') return '';
  if (url.startsWith('data:')) return url;
  const driveId = getDriveId(url);
  // lh3.googleusercontent.com is Google's ultra-fast public CDN edge (HTTP 200 direct, no 302 redirect)
  return driveId ? `https://lh3.googleusercontent.com/d/${driveId}=w${size}` : url;
};

export const getDriveId = (url) => {
  if (!url || typeof url !== 'string') return '';
  const matchD = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  const matchId = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchD && matchD[1]) return matchD[1];
  if (matchId && matchId[1]) return matchId[1];
  return '';
};

export const getDriveDownloadUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  if (url.startsWith('data:')) return url;
  const driveId = getDriveId(url);
  if (driveId) {
    return `https://drive.usercontent.google.com/download?id=${driveId}&export=download`;
  }
  return url;
};

// Scratch MIT & TurboWarp URL / ID Extractor
export const getScratchProjectId = (url) => {
  if (!url || typeof url !== 'string') return '';
  const clean = url.trim();

  // Match scratch.mit.edu/projects/123456789
  const mMit = clean.match(/scratch\.mit\.edu\/projects\/(\d+)/i);
  if (mMit && mMit[1]) return mMit[1];

  // Match turbowarp.org/123456789
  const mTw = clean.match(/turbowarp\.org\/(?:embed\?project_url=[^&]*|embed\.html\?.*#)?(\d+)/i);
  if (mTw && mTw[1]) return mTw[1];

  // Match iframe embed code: <iframe src="...projects/123456789/embed"...>
  const mEmbed = clean.match(/projects\/(\d+)\/embed/i);
  if (mEmbed && mEmbed[1]) return mEmbed[1];

  // Pure numeric Scratch project ID (typically 6-12 digits)
  if (/^\d{6,14}$/.test(clean)) return clean;

  return '';
};

export const getScratchEmbedUrl = (projectId) => {
  if (!projectId) return '';
  return `https://scratch.mit.edu/projects/${projectId}/embed`;
};

export const getTurboWarpEmbedUrl = (projectId) => {
  if (!projectId) return '';
  return `https://turbowarp.org/${projectId}/embed`;
};

export const isScratchProject = (item, projects = [], classes = [], users = []) => {
  if (!item) return false;
  const title = (item.title || '').toLowerCase();
  const fileData = (item.fileData || '').toLowerCase();
  const fileExt = (item.fileExt || '').toLowerCase();

  // If the file is explicitly an image or PDF, it is NEVER a Scratch project!
  if (
    ['jpg', 'jpeg', 'png', 'pdf', 'gif', 'webp'].includes(fileExt) ||
    fileData.startsWith('data:image') ||
    fileData.startsWith('data:application/pdf')
  ) {
    return false;
  }

  // If item contains a Scratch link or project ID
  if (getScratchProjectId(item.fileData)) return true;

  // Check file extension or mime type
  if (fileExt === 'sb3' || fileData.includes('.sb3') || fileData.startsWith('data:application/x-scratch')) return true;

  // Check associated project
  const project = projects?.find((p) => p.id === item.projectId);
  if (project) {
    const pTitle = (project.title || '').toLowerCase();
    const pDesc = (project.desc || '').toLowerCase();
    if (pTitle.includes('scratch') || pTitle.includes('.sb3') || pDesc.includes('scratch') || pTitle.includes('game')) {
      return true;
    }
  }

  // Check student class (e.g. Kelas 6)
  const student = users?.find((u) => u.id === item.studentId);
  const studentClass = classes?.find((c) => c.id === student?.classId);
  if (studentClass && studentClass.name.toLowerCase().includes('6')) {
    if (title.includes('scratch') || title.includes('game') || title.includes('quiz')) return true;
    if (project && project.title.toLowerCase().includes('game')) return true;
  }

  return false;
};

export const getDirectImageUrl = (url, size = 800) => {
  if (!url || typeof url !== 'string') return '';
  if (url.startsWith('data:image')) return url;

  // Check if it's a Scratch project URL / ID -> return official Scratch project thumbnail!
  const scratchId = getScratchProjectId(url);
  if (scratchId) {
    return `https://uploads.scratch.mit.edu/get_image/project/${scratchId}_480x360.png`;
  }

  const driveId = getDriveId(url);
  if (driveId) {
    // Google Drive official thumbnail endpoint with size generates high-speed previews for images AND PDF page 1!
    return `https://drive.google.com/thumbnail?id=${driveId}&sz=w${size}`;
  }
  return url;
};

export const getLocalDateString = (dateVal) => {
  if (!dateVal) return '';
  const d = dateVal === 'now' ? new Date() : new Date(dateVal);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// Format deadline string to Indonesian readable format with date, month, and time
export const formatProjectDeadline = (deadlineStr) => {
  if (!deadlineStr || typeof deadlineStr !== 'string') return '-';
  const clean = deadlineStr.trim();
  if (!clean) return '-';

  // Match YYYY-MM-DD or YYYY-MM-DDTHH:mm or YYYY-MM-DD HH:mm
  const match = clean.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2}))?/);
  if (match) {
    const [, year, monthNum, day, hour, min] = match;
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ];
    const monthName = months[parseInt(monthNum, 10) - 1] || monthNum;
    const dayClean = parseInt(day, 10);

    if (hour !== undefined && min !== undefined) {
      return `${dayClean} ${monthName} ${year} • ${hour}:${min} WIB`;
    }
    return `${dayClean} ${monthName} ${year}`;
  }

  return clean;
};

// Normalize to datetime-local input string YYYY-MM-DDTHH:mm
export const toDateTimeLocalValue = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string') return '';
  const clean = dateStr.trim();
  if (clean.includes('T')) return clean.slice(0, 16);
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) return `${clean}T23:59`;
  return clean;
};

// Extract list of targeted student IDs from a project
export const getProjectTargetStudents = (project) => {
  if (!project) return [];
  if (Array.isArray(project.targetStudents) && project.targetStudents.length > 0) {
    return project.targetStudents.map(String);
  }
  if (Array.isArray(project.classId)) {
    return project.classId
      .filter((s) => typeof s === 'string' && s.startsWith('student:'))
      .map((s) => s.replace('student:', '').trim())
      .filter(Boolean);
  }
  if (typeof project.classId === 'string' && project.classId.includes('student:')) {
    return project.classId
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.startsWith('student:'))
      .map((s) => s.replace('student:', '').trim())
      .filter(Boolean);
  }
  return [];
};

// Strict check whether a project is visible / assigned to a specific student
export const isProjectForStudent = (project, user) => {
  if (!project || !user) return false;
  const status = String(project.status || 'aktif').trim().toLowerCase();
  if (status !== 'aktif') return false;

  const targetStudents = getProjectTargetStudents(project);

  // If specific students are targeted (Anak Les / Tugas Khusus), ONLY those students can see it!
  if (targetStudents.length > 0) {
    return targetStudents.some((id) => String(id).trim() === String(user.id).trim());
  }

  // Otherwise, fallback to class targeting
  const classId = project.classId;
  if (!classId || classId === 'all') return true;
  if (Array.isArray(classId)) {
    if (classId.length === 0 || classId.includes('all')) return true;
    return classId.some((cid) => String(cid).trim() === String(user.classId).trim());
  }
  if (typeof classId === 'string') {
    if (classId.includes(',')) {
      const cids = classId.split(',').map((s) => s.trim());
      if (cids.includes('all')) return true;
      return cids.some((cid) => String(cid).trim() === String(user.classId).trim());
    }
    return String(classId).trim() === String(user.classId).trim();
  }

  return false;
};

export const extFromMime = (type) => {
  if (type.includes('scratch') || type.includes('octet-stream')) return 'sb3';
  if (type.includes('spreadsheet') || type.includes('excel')) return 'xlsx';
  if (type.includes('presentation') || type.includes('powerpoint')) return 'pptx';
  if (type.includes('pdf')) return 'pdf';
  if (type.includes('jpeg') || type.includes('jpg')) return 'jpg';
  if (type.includes('png')) return 'png';
  return type.split('/')[1] || 'bin';
};
