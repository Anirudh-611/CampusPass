import React from 'react';
import { cn } from '../../utils/cn';

export default function StudentDetails({
  fullName = 'Student Name',
  rollNumber = 'REG-0000',
  department = 'Department',
  course = 'Program',
  batch = 'Batch',
  bloodGroup,
  semester,
  template = 'minimal',
  className,
}) {
  const isDark = template === 'dark';
  const isClassic = template === 'classic';

  return (
    <div className={cn('space-y-1.5 min-w-0 flex-1', className)}>
      {/* Roll Number pill */}
      <span
        className={cn(
          'inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider',
          isDark
            ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
            : isClassic
            ? 'bg-amber-100 text-amber-900 border border-amber-300 font-serif'
            : 'bg-brand-50 text-brand-700 border border-brand-200'
        )}
      >
        {rollNumber}
      </span>

      {/* Name */}
      <h3
        className={cn(
          'text-base font-extrabold tracking-tight truncate leading-tight',
          isDark ? 'text-white' : isClassic ? 'text-amber-950 font-serif' : 'text-slate-900'
        )}
      >
        {fullName}
      </h3>

      {/* Department & Course */}
      <div className="space-y-0.5">
        <p
          className={cn(
            'text-xs font-semibold truncate',
            isDark ? 'text-slate-300' : isClassic ? 'text-amber-900' : 'text-slate-700'
          )}
        >
          {department}
        </p>
        <p
          className={cn(
            'text-[10px] truncate',
            isDark ? 'text-slate-400' : isClassic ? 'text-amber-800' : 'text-slate-500'
          )}
        >
          {course} {semester ? `• Sem ${semester}` : ''}
        </p>
      </div>

      {/* Auxiliary metadata row */}
      <div
        className={cn(
          'pt-1 flex items-center gap-3 text-[9px] font-mono',
          isDark ? 'text-slate-400' : isClassic ? 'text-amber-800/80' : 'text-slate-500'
        )}
      >
        <span>Batch: {batch}</span>
        {bloodGroup && <span>Blood: {bloodGroup}</span>}
      </div>
    </div>
  );
}

