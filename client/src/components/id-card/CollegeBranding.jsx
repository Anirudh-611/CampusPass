import React from 'react';
import { Building2, ShieldCheck } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function CollegeBranding({
  collegeName = 'Apex State Institute of Technology',
  subtitle = 'Official Academic Identification',
  template = 'minimal',
  className,
}) {
  const isDark = template === 'dark';
  const isClassic = template === 'classic';

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div
        className={cn(
          'w-9 h-9 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0',
          isDark
            ? 'bg-brand-500 text-white'
            : isClassic
            ? 'bg-amber-900 text-amber-100 border border-amber-800'
            : 'bg-brand-600 text-white'
        )}
      >
        <Building2 className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <h4
          className={cn(
            'text-xs font-extrabold uppercase tracking-tight leading-tight truncate',
            isDark ? 'text-white' : isClassic ? 'text-amber-950 font-serif' : 'text-slate-900'
          )}
        >
          {collegeName}
        </h4>
        <p
          className={cn(
            'text-[9px] font-medium tracking-wide uppercase',
            isDark ? 'text-slate-400' : isClassic ? 'text-amber-800' : 'text-slate-500'
          )}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}

