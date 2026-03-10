import React from 'react';
import { motion } from 'motion/react';

interface FractionInputProps {
  label: string;
  numerator: number;
  denominator: number;
  color: string;
  onChange: (numerator: number, denominator: number) => void;
  maxDenominator?: number;
}

export const FractionInput: React.FC<FractionInputProps> = ({
  label,
  numerator,
  denominator,
  color,
  onChange,
  maxDenominator = 12,
}) => {
  const handleNumeratorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(1, Math.min(denominator, parseInt(e.target.value) || 1));
    onChange(val, denominator);
  };

  const handleDenominatorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(1, Math.min(maxDenominator, parseInt(e.target.value) || 1));
    // Adjust numerator if it exceeds new denominator
    const newNum = Math.min(numerator, val);
    onChange(newNum, val);
  };

  return (
    <div className={`flex flex-col items-center p-6 rounded-2xl border-2 ${color} shadow-lg backdrop-blur-sm`}>
      <span className="text-sm font-bold mb-4 uppercase tracking-wider">{label}</span>
      <div className="flex flex-col items-center gap-3">
        <input
          type="number"
          value={numerator}
          onChange={handleNumeratorChange}
          className="w-20 h-16 text-center text-3xl font-black bg-slate-900/50 border-2 border-slate-700 rounded-xl outline-none focus:border-current focus:shadow-[0_0_15px_currentColor] transition-all"
          min="1"
          max={denominator}
        />
        <div className="w-16 h-1 bg-current rounded-full opacity-50"></div>
        <input
          type="number"
          value={denominator}
          onChange={handleDenominatorChange}
          className="w-20 h-16 text-center text-3xl font-black bg-slate-900/50 border-2 border-slate-700 rounded-xl outline-none focus:border-current focus:shadow-[0_0_15px_currentColor] transition-all"
          min="1"
          max={maxDenominator}
        />
      </div>
    </div>
  );
};
