import React from 'react';
import { User } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function StudentPhoto({
  photoUrl,
  fullName = 'Student Photo',
  template = 'minimal',
  className,
}) {
  const isDark = template === 'dark';
  const isClassic = template === 'classic';

  return (
    <div
      className={cn(
        'relative w-24 h-28 rounded-xl overflow-hidden shadow-sm flex-shrink-0 border-2',
        isDark
          ? 'border-brand-500/40 bg-slate-900'
          : isClassic
          ? 'border-amber-900/30 bg-amber-50'
          : 'border-slate-200 bg-slate-100',
        className
      )}
    >
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={fullName}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
          <User className="w-8 h-8" />
          <span className="text-[8px] uppercase tracking-wider mt-1">No Photo</span>
        </div>
      )}
    </div>
  );
}

