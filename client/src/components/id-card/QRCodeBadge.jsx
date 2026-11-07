import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function QRCodeBadge({
  verificationId = 'CAMPUSPASS-DEMO',
  size = 72,
  template = 'minimal',
  className,
}) {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://campuspass.app';
  const verificationUrl = `${origin}/verify/${verificationId}`;

  return (
    <div
      className={cn(
        'bg-white p-2 rounded-xl border flex flex-col items-center justify-center shadow-sm flex-shrink-0',
        template === 'dark' ? 'border-slate-700' : 'border-slate-200',
        className
      )}
    >
      <QRCodeSVG
        value={verificationUrl}
        size={size}
        level="M"
        includeMargin={false}
        className="w-full h-auto"
      />
      <div className="mt-1 flex items-center gap-1 text-[8px] font-mono text-slate-500">
        <ShieldCheck className="w-2.5 h-2.5 text-brand-600" />
        <span>Scan to Verify</span>
      </div>
    </div>
  );
}

