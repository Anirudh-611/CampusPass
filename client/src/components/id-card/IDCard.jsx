import React from 'react';
import MinimalTemplate from './templates/MinimalTemplate';
import DarkTemplate from './templates/DarkTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import { cn } from '../../utils/cn';

/**
 * Main IDCard Orchestrator Component.
 * Receives student profile, chosen template, and flip state.
 */
export default function IDCard({
  student,
  template = 'minimal',
  isFlipped = false,
  onFlip,
  cardRef,
  className,
}) {
  const templates = {
    minimal: MinimalTemplate,
    dark: DarkTemplate,
    classic: ClassicTemplate,
  };

  const SelectedComponent = templates[template] || MinimalTemplate;

  return (
    <div className={cn('perspective-1000 w-full max-w-md mx-auto select-none', className)}>
      <div
        ref={cardRef}
        id="campuspass-id-card-element"
        onClick={onFlip}
        className={cn(
          'relative w-full aspect-[1.586/1] transition-transform duration-700 transform-style-3d cursor-pointer rounded-2xl',
          isFlipped ? 'rotate-y-180' : ''
        )}
      >
        {/* Front Face */}
        <div className="absolute inset-0 backface-hidden">
          <SelectedComponent student={student} isBack={false} />
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <SelectedComponent student={student} isBack={true} />
        </div>
      </div>
    </div>
  );
}

