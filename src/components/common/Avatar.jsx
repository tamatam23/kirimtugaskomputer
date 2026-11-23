import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { driveThumb, getDriveId } from '../../utils/helpers';
import { springBounce } from '../../utils/motion';

export const Avatar = ({ name = '', photo = '', src = '', size = 44, onClick, className = '' }) => {
  const actualPhoto = photo || src || '';
  const initial = (name.trim().charAt(0) || '?').toUpperCase();
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(() => driveThumb(actualPhoto, size * 2));

  useEffect(() => {
    setCurrentSrc(driveThumb(actualPhoto, size * 2));
    setHasError(false);
  }, [actualPhoto, size]);

  const handleError = () => {
    const dId = getDriveId(actualPhoto);
    if (dId && currentSrc.includes('lh3.googleusercontent.com')) {
      // Fallback 1: Google Drive thumbnail
      setCurrentSrc(`https://drive.google.com/thumbnail?id=${dId}&sz=w${size * 2}`);
    } else if (dId && currentSrc.includes('thumbnail')) {
      // Fallback 2: Direct size variant
      setCurrentSrc(`https://lh3.googleusercontent.com/d/${dId}=s${size * 2}`);
    } else {
      setHasError(true);
    }
  };

  const showImage = Boolean(actualPhoto && !hasError && currentSrc);

  return (
    <motion.div
      onClick={onClick}
      whileHover={onClick ? { scale: 1.08, rotate: 2 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
      transition={springBounce}
      style={{ width: size, height: size }}
      className={`relative rounded-full overflow-hidden shrink-0 bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-500 text-white flex items-center justify-center font-extrabold shadow-md border-2 border-white ring-2 ring-purple-100 ${
        onClick ? 'cursor-pointer hover:ring-purple-400' : ''
      } ${className}`}
    >
      {showImage ? (
        <img
          src={currentSrc}
          alt={name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
          onError={handleError}
        />
      ) : (
        <span style={{ fontSize: Math.max(size * 0.4, 11) }} className="select-none font-black tracking-tight">
          {initial}
        </span>
      )}
    </motion.div>
  );
};
