import React from 'react';

export const Card = ({ children, className = '', onClick, ...props }) => {
  return (
    <div
      onClick={onClick}
      className={`glass-card p-6 sm:p-7 rounded-[2rem] transition-shadow ${
        onClick ? 'cursor-pointer hover:shadow-soft-hover' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
