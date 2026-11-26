// =======================================================
// GALERI KARYA KOMPUTER - Code.gs
// BACKEND GOOGLE APPS SCRIPT DENGAN REST API GATEWAY
// Kompatibel 100% dengan Standalone React (Vite / Vercel)
// =======================================================

/**
 * PENTING: Jalankan fungsi ini SATU KALI di Apps Script Editor
 * (Klik tombol "Jalankan" / "Run" ▶) untuk memberikan izin Google Drive!
 */
function testDriveAccess() {
  var folder = getUploadFolder();
  Logger.log('SUKSES! Folder Drive Aktif: ' + folder.getName() + ' (ID: ' + folder.getId() + ')');
  return 'SUKSES! Folder Drive Aktif: ' + folder.getId();
}

var SCHEMAS = {
  users:       ['id', 'role', 'name', 'username', 'password', 'classId', 'pin', 'photo', 'createdAt'],
  classes:     ['id', 'name', 'createdAt'],
  projects:    ['id', 'title', 'desc', 'classId', 'deadline', 'status', 'createdAt', 'targetStudents'],
  submissions: ['id', 'projectId', 'studentId', 'title', 'fileData', 'fileExt', 'nilai', 'catatan', 'createdAt']
};
var COLLECTIONS = ['users', 'classes', 'projects', 'submissions'];
var ARRAY_FIELDS = { projects: ['classId', 'targetStudents'] };
var MAX_CELL = 49000;

// -------------------------------------------------------
// REST API ROUTER (Untuk Frontend Standalone React)
// -------------------------------------------------------
function doPost(e) {
  try {
    var contents = e.postData.contents;
    var req = JSON.parse(contents);
    var action = req.action;
    var args = req.args || [];
    var result;

    if (action === 'getInitialData') {
      result = getInitialData();
    } else if (action === 'addDocument') {
      result = addDocument(args[0], args[1]);
    } else if (action === 'updateDocument') {
      result = updateDocument(args[0], args[1], args[2]);
    } else if (action === 'deleteDocument') {
      result = deleteDocument(args[0], args[1]);
    } else if (action === 'getFileBase64' || action === 'getFileBase64ForDownload') {
      result = getFileBase64(args[0]);
    } else {
      throw new Error('Action tidak dikenal: ' + action);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: 'success', data: result }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  if (e && e.parameter && e.parameter.action) {
    try {
      var action = e.parameter.action;
      var result;
      if (action === 'getInitialData') {
        result = getInitialData();
      } else if (action === 'getFileBase64') {
        result = getFileBase64(e.parameter.fileUrl);
      }
      return ContentService.createTextOutput(JSON.stringify({ status: 'success', data: result }))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  // Jika diakses langsung via browser
  return ContentService.createTextOutput(JSON.stringify({ status: 'online', service: 'Galeri Karya Komputer API' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// -------------------------------------------------------
// INIT SHEET
// -------------------------------------------------------
function getSpreadsheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  COLLECTIONS.forEach(function (name) {
    if (!ss.getSheetByName(name)) {
      setupSheet_(ss.insertSheet(name), SCHEMAS[name]);
    }
  });
  var sheet1 = ss.getSheetByName('Sheet1');
  if (sheet1 && ss.getSheets().length > 1) ss.deleteSheet(sheet1);
  return ss;
}

function setupSheet_(sheet, headers) {
  if (sheet.getMaxColumns() < headers.length) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), headers.length - sheet.getMaxColumns());
  }
  sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns()).setNumberFormat('@');
  sheet.getRange(1, 1, 1, headers.length)
    .setValues([headers])
    .setFontWeight('bold')
    .setBackground('#7C3AED')
    .setFontColor('#FFFFFF');
  sheet.setFrozenRows(1);
}

function getHeaders_(sheet, collection) {
  var lastCol = Math.max(sheet.getLastColumn(), 1);
  var h = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(String);
  while (h.length && h[h.length - 1] === '') h.pop();

  if (collection && SCHEMAS[collection]) {
    var expected = SCHEMAS[collection];
    var missing = [];
    expected.forEach(function (col) {
      if (h.indexOf(col) === -1) missing.push(col);
    });
    if (missing.length > 0) {
      if (sheet.getMaxColumns() < h.length + missing.length) {
        sheet.insertColumnsAfter(sheet.getMaxColumns(), missing.length);
      }
      missing.forEach(function (col, idx) {
        var colIdx = h.length + idx + 1;
        sheet.getRange(1, colIdx).setValue(col).setFontWeight('bold').setBackground('#7C3AED').setFontColor('#FFFFFF');
        h.push(col);
      });
    }
  }
  return h;
}

function getUploadFolder() {
  var props = PropertiesService.getScriptProperties();
  var folderId = props.getProperty('DB_FOLDER_ID');
  var folder = null;
  if (folderId) {
    try { folder = DriveApp.getFolderById(folderId); } catch (e) { folder = null; }
  }
  if (!folder) {
    folder = DriveApp.createFolder('Galeri_Komputer_Uploads');
    try {
      folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (e) {}
    props.setProperty('DB_FOLDER_ID', folder.getId());
  }
  return folder;
}

// -------------------------------------------------------
// HELPER
// -------------------------------------------------------
function withLock_(fn) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try { return fn(); } finally { lock.releaseLock(); }
}

function assertCollection_(c) {
  if (COLLECTIONS.indexOf(c) === -1) throw new Error('Koleksi tidak dikenal: ' + c);
}

function serialize_(v) {
  if (v === null || v === undefined) return '';
  if (Array.isArray(v)) v = v.join(',');
  if (v instanceof Date) v = v.toISOString();
  v = String(v);
  if (v.length > MAX_CELL) throw new Error('Data terlalu panjang untuk satu sel (' + v.length + ' karakter).');
  return v;
}

function rowToObj_(collection, headers, row) {
  var obj = {};
  var arrays = ARRAY_FIELDS[collection] || [];
  headers.forEach(function (h, i) {
    if (!h) return;
    var v = row[i];
    if (v instanceof Date) v = v.toISOString();
    v = (v === null || v === undefined) ? '' : String(v);
    if (arrays.indexOf(h) > -1) {
      obj[h] = v ? v.split(',').map(function (s) { return s.trim(); }).filter(Boolean) : ['all'];
    } else {
      obj[h] = v;
    }
  });
  if (collection === 'submissions') obj.feedback = obj.catatan || '';
  return obj;
}

function readAll_(sheet, collection) {
  var headers = getHeaders_(sheet, collection);
  var last = sheet.getLastRow();
  if (last < 2) return [];
  var values = sheet.getRange(2, 1, last - 1, headers.length).getValues();
  var out = [];
  values.forEach(function (row) {
    if (row[0] === '' || row[0] === null) return;
    out.push(rowToObj_(collection, headers, row));
  });
  return out;
}

function appendObj_(sheet, collection, obj) {
  var headers = getHeaders_(sheet, collection);
  var row = headers.map(function (h) { return serialize_(obj[h]); });
  var r = sheet.getLastRow() + 1;
  if (r > sheet.getMaxRows()) sheet.insertRowsAfter(sheet.getMaxRows(), 100);
  var range = sheet.getRange(r, 1, 1, headers.length);
  range.setNumberFormat('@');
  range.setValues([row]);
}

function findRow_(sheet, id) {
  var last = sheet.getLastRow();
  if (last < 2) return -1;
  var ids = sheet.getRange(2, 1, last - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(id)) return i + 2;
  }
  return -1;
}

// ---------- FILE KE DRIVE ----------
function isDataUrl_(s) {
  return typeof s === 'string' && s.indexOf('data:') === 0;
}

function extFromMime_(type) {
  if (type.indexOf('scratch') > -1 || type.indexOf('octet-stream') > -1) return 'sb3';
  if (type.indexOf('spreadsheet') > -1 || type.indexOf('excel') > -1) return 'xlsx';
  if (type.indexOf('presentation') > -1 || type.indexOf('powerpoint') > -1) return 'pptx';
  if (type.indexOf('pdf') > -1) return 'pdf';
  if (type.indexOf('jpeg') > -1 || type.indexOf('jpg') > -1) return 'jpg';
  if (type.indexOf('png') > -1) return 'png';
  return type.split('/')[1] || 'bin';
}

function saveDataUrlToDrive_(dataUrl, prefix, id) {
  var type = dataUrl.split(';')[0].split(':')[1];
  var base64 = dataUrl.split(',')[1];
  var ext = extFromMime_(type);
  var blob = Utilities.newBlob(Utilities.base64Decode(base64), type, prefix + '_' + id + '.' + ext);
  var file = getUploadFolder().createFile(blob);
  try {
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  } catch (e) {}
  return { url: 'https://drive.google.com/uc?export=view&id=' + file.getId(), ext: ext };
}

function prepareFiles_(collection, data, id) {
  if (collection === 'submissions' && isDataUrl_(data.fileData)) {
    try {
      var saved = saveDataUrlToDrive_(data.fileData, 'Karya', id);
      data.fileData = saved.url;
      data.fileExt = saved.ext;
    } catch (e) {
      Logger.log('Peringatan Drive: ' + e.toString());
      // Fallback aman: jika Drive ditolak, tetap simpan rekaman tugas ke Spreadsheet agar nilai siswa tidak hilang
      data.fileData = 'https://drive.google.com/uc?export=view&id=local_' + id;
    }
  }
  if (collection === 'users' && isDataUrl_(data.photo)) {
    try { data.photo = saveDataUrlToDrive_(data.photo, 'Profil', id).url; }
    catch (e) { throw new Error('Gagal menyimpan foto ke Drive: ' + e.message); }
  }
}

function trashDriveFile_(url) {
  try {
    var m = String(url).match(/drive\.google\.com\/uc\?.*id=([a-zA-Z0-9_-]+)/);
    if (m) DriveApp.getFileById(m[1]).setTrashed(true);
  } catch (e) {}
}

// -------------------------------------------------------
// CRUD
// -------------------------------------------------------
function getInitialData() {
  var ss = getSpreadsheet();
  var result = {};
  COLLECTIONS.forEach(function (col) { result[col] = readAll_(ss.getSheetByName(col), col); });
  return result;
}

function addDocument(collection, data) {
  assertCollection_(collection);
  var id = Utilities.getUuid();
  data.id = id;
  data.createdAt = new Date().toISOString();
  prepareFiles_(collection, data, id);
  return withLock_(function () {
    appendObj_(getSpreadsheet().getSheetByName(collection), collection, data);
    return id;
  });
}

function updateDocument(collection, id, data) {
  assertCollection_(collection);
  if (data.feedback !== undefined && data.catatan === undefined) data.catatan = data.feedback;
  prepareFiles_(collection, data, id);
  return withLock_(function () {
    var sheet = getSpreadsheet().getSheetByName(collection);
    var headers = getHeaders_(sheet, collection);
    var rowIdx = findRow_(sheet, id);
    if (rowIdx === -1) throw new Error('Data tidak ditemukan: ' + id);

    var range = sheet.getRange(rowIdx, 1, 1, headers.length);
    var row = range.getValues()[0];
    var fileCol = headers.indexOf('fileData');
    var oldFile = (collection === 'submissions' && fileCol > -1) ? row[fileCol] : '';
    var photoCol = headers.indexOf('photo');
    var oldPhoto = (collection === 'users' && photoCol > -1) ? row[photoCol] : '';

    headers.forEach(function (h, i) {
      if (h === 'id' || h === 'createdAt') return;
      if (data[h] !== undefined) row[i] = serialize_(data[h]);
    });
    range.setNumberFormat('@');
    range.setValues([row]);

    if (oldFile && data.fileData && oldFile !== data.fileData) trashDriveFile_(oldFile);
    if (oldPhoto && data.photo !== undefined && oldPhoto !== data.photo) trashDriveFile_(oldPhoto);
    return true;
  });
}

function deleteDocument(collection, id) {
  assertCollection_(collection);
  return withLock_(function () {
    var sheet = getSpreadsheet().getSheetByName(collection);
    var headers = getHeaders_(sheet, collection);
    var rowIdx = findRow_(sheet, id);
    if (rowIdx === -1) return true;
    if (collection === 'submissions') {
      var fileCol = headers.indexOf('fileData');
      if (fileCol > -1) trashDriveFile_(sheet.getRange(rowIdx, fileCol + 1).getValue());
    }
    if (collection === 'users') {
      var photoCol = headers.indexOf('photo');
      if (photoCol > -1) trashDriveFile_(sheet.getRange(rowIdx, photoCol + 1).getValue());
    }
    sheet.deleteRow(rowIdx);
    return true;
  });
}

function getFileBase64(fileUrl) {
  try {
    var m = String(fileUrl).match(/id=([a-zA-Z0-9_-]+)/);
    if (!m) return null;
    return Utilities.base64Encode(DriveApp.getFileById(m[1]).getBlob().getBytes());
  } catch (e) {
    return null;
  }
}
