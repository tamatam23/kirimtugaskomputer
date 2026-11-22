import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

const DELETED_FILE = path.resolve(__dirname, 'deleted_records.json');

const getDeletedRecords = () => {
  try {
    if (fs.existsSync(DELETED_FILE)) {
      return JSON.parse(fs.readFileSync(DELETED_FILE, 'utf-8'));
    }
  } catch (e) {}
  return { deletedSubmissions: [], deletedProjects: [], deletedUsers: [] };
};

const saveDeletedRecords = (data) => {
  try {
    fs.writeFileSync(DELETED_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to save deleted records:', e);
  }
};

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'local-sync-and-scratch-proxy',
      configureServer(server) {
        // Universal Network Sync API for deletions across all teacher & student devices
        server.middlewares.use('/api/sync', (req, res, next) => {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            return res.end();
          }

          if (req.method === 'GET') {
            const data = getDeletedRecords();
            return res.end(JSON.stringify(data));
          }

          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => (body += chunk));
            req.on('end', () => {
              try {
                const { action, colName, id } = JSON.parse(body);
                const data = getDeletedRecords();
                if (action === 'delete') {
                  const strId = String(id);
                  if (colName === 'submissions' && !data.deletedSubmissions.includes(strId)) {
                    data.deletedSubmissions.push(strId);
                  } else if (colName === 'projects' && !data.deletedProjects.includes(strId)) {
                    data.deletedProjects.push(strId);
                  } else if (colName === 'users' && !data.deletedUsers.includes(strId)) {
                    data.deletedUsers.push(strId);
                  }
                  saveDeletedRecords(data);
                }
                res.end(JSON.stringify({ success: true, data }));
              } catch (e) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: e.message }));
              }
            });
            return;
          }

          next();
        });

        server.middlewares.use('/api/scratch-proxy', async (req, res) => {
          try {
            const url = new URL(req.url, 'http://localhost:3000');
            const fileId = url.searchParams.get('id');
            if (!fileId) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ error: 'Missing id parameter' }));
            }

            const driveUrl = `https://drive.usercontent.google.com/download?id=${fileId}&export=download`;
            const driveRes = await fetch(driveUrl);

            if (!driveRes.ok) {
              res.statusCode = driveRes.status;
              return res.end(JSON.stringify({ error: 'Drive fetch failed: ' + driveRes.statusText }));
            }

            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
            res.setHeader('Content-Type', 'application/x-scratch-sb3');

            const arrayBuffer = await driveRes.arrayBuffer();
            res.end(Buffer.from(arrayBuffer));
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      },
    },
  ],
  server: {
    host: true,
    port: 3000,
    open: false,
  },
});

