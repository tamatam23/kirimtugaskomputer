import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://mcyjsubijeadtaedwysk.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jeWpzdWJpamVhZHRhZWR3eXNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU2OTk4NDksImV4cCI6MjExMTI3NTg0OX0.j_mdsP4EJ4S8zY_5qQnzgeYof5avmwO_fSme2qSimx0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

/**
 * Upload a file (base64 data URL or File/Blob) to Supabase Storage bucket 'karya'
 * Returns the public URL, or falls back to dataUrl if storage bucket is unreachable.
 */
export const uploadKaryaFile = async (fileOrDataUrl, fileName) => {
  try {
    if (!fileOrDataUrl) return '';

    // If it's already a hosted URL (http/https), return as is
    if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('http')) {
      return fileOrDataUrl;
    }

    const ext = fileName ? fileName.split('.').pop().toLowerCase() : 'bin';
    const cleanName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`;
    const filePath = `submissions/${cleanName}`;

    let body = fileOrDataUrl;
    let contentType = 'application/octet-stream';

    if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('data:')) {
      const match = fileOrDataUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        contentType = match[1];
        const binaryString = atob(match[2]);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        body = new Blob([bytes], { type: contentType });
      }
    }

    const { data, error } = await supabase.storage
      .from('karya')
      .upload(filePath, body, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.warn('[Supabase Storage] Upload error, using inline fallback:', error.message || error);
      return typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '';
    }

    const { data: publicUrlData } = supabase.storage
      .from('karya')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.warn('[Supabase Storage] Upload caught error:', err);
    return typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '';
  }
};
