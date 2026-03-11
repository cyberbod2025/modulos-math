import React from 'react';
import { VisualShape } from '../types/visual';

interface VisualShapeToggleProps {
  value: VisualShape;
  onChange: (shape: VisualShape) => void;
  label?: string;
}

const options: { value: VisualShape; label: string }[] = [
  { value: 'square', label: 'Cuadrado' },
  { value: 'rect', label: 'Rectángulo' },
  { value: 'circle', label: 'Círculo' },
];

export const VisualShapeToggle: React.FC<VisualShapeToggleProps> = ({ value, onChange, label = 'Forma' }) => {
  return (
    <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700 rounded-full p-1">
      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 px-2">
        {label}
      </span>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold transition-all ${
            value === opt.value
              ? 'bg-slate-100 text-slate-900'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};
