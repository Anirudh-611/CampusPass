import React from 'react';
import { RotateCw, Download, Printer, Check, Palette } from 'lucide-react';
import Button from '../common/Button';

export default function IDCardActions({
  currentTemplate,
  onSelectTemplate,
  isFlipped,
  onToggleFlip,
  onDownloadPDF,
  isDownloading = false,
}) {
  const templates = [
    { id: 'minimal', label: 'Modern Minimal', color: 'bg-white text-slate-800 border-slate-300' },
    { id: 'dark', label: 'Premium Dark', color: 'bg-slate-900 text-white border-slate-700' },
    { id: 'classic', label: 'University Classic', color: 'bg-[#fdfbf7] text-amber-950 border-amber-300' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-5">
      {/* Template Selector Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4 text-brand-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Card Design Template
          </h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelectTemplate(t.id)}
              className={`flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all ${
                t.color
              } ${
                currentTemplate === t.id
                  ? 'ring-2 ring-brand-500 shadow-md scale-[1.02]'
                  : 'hover:border-slate-400 opacity-80 hover:opacity-100'
              }`}
            >
              <span>{t.label}</span>
              {currentTemplate === t.id && (
                <Check className="w-4 h-4 text-brand-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleFlip}
          leftIcon={<RotateCw className="w-4 h-4" />}
        >
          {isFlipped ? 'View Front Face' : 'View Back (QR Face)'}
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={onDownloadPDF}
          isLoading={isDownloading}
          leftIcon={<Download className="w-4 h-4" />}
        >
          Download PDF Pass
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrint}
          leftIcon={<Printer className="w-4 h-4" />}
        >
          Print Physical Badge
        </Button>
      </div>
    </div>
  );
}

