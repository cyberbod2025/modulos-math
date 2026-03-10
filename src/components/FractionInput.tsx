import React from 'react';
import { motion } from 'motion/react';

type FractionValue = { num: number; den: number };

type FractionInputProps = {
  label?: string;
  color: string;
  borderColor?: string;
  maxDenominator?: number;
  disabledDen?: boolean;
} & (
  | {
      value: FractionValue;
      onChange: (value: FractionValue) => void;
    }
  | {
      numerator: number;
      denominator: number;
      onChange: (numerator: number, denominator: number) => void;
    }
);

export const FractionInput: React.FC<FractionInputProps> = ({
  label,
  color,
  borderColor,
  maxDenominator = 12,
  disabledDen = false,
  ...rest
}) => {
  const isValueProps = 'value' in rest;
  const numerator = isValueProps ? rest.value.num : rest.numerator;
  const denominator = isValueProps ? rest.value.den : rest.denominator;

  const commitChange = (newNum: number, newDen: number) => {
    if (isValueProps) {
      rest.onChange({ num: newNum, den: newDen });
    } else {
      rest.onChange(newNum, newDen);
    }
  };

  const handleNumeratorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseInt(e.target.value);
    const val = Math.max(0, Math.min(denominator, isNaN(raw) ? 0 : raw));
    commitChange(val, denominator);
  };

  const handleDenominatorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(1, Math.min(maxDenominator, parseInt(e.target.value) || 1));
    // Adjust numerator if it exceeds new denominator
    const newNum = Math.min(numerator, val);
    commitChange(newNum, val);
  };

  return (
    <div className={`flex flex-col items-center p-6 rounded-2xl border-2 ${borderColor ?? 'border-slate-700'} ${color} shadow-lg backdrop-blur-sm`}>
      {label && <span className="text-sm font-bold mb-4 uppercase tracking-wider">{label}</span>}
      <div className="flex flex-col items-center gap-3">
        <input
          type="number"
          value={numerator}
          onChange={handleNumeratorChange}
          className="w-20 h-16 text-center text-3xl font-black bg-slate-900/50 border-2 border-slate-700 rounded-xl outline-none focus:border-current focus:shadow-[0_0_15px_currentColor] transition-all"
          min="0"
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
          disabled={disabledDen}
        />
      </div>
    </div>
  );
};
