import React from 'react';

export const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  icon: Icon,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 ml-1">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-4 text-purple-400 pointer-events-none">
            <Icon size={18} />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full py-3.5 rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all font-medium text-sm shadow-sm ${
            Icon ? 'pl-11 pr-4' : 'px-4'
          }`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-rose-500 ml-1 font-medium">{error}</span>}
    </div>
  );
};
