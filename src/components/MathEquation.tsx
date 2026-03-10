import React from 'react';
import { motion } from 'motion/react';

interface MathEquationProps {
  fractionA: { num: number; den: number };
  fractionB: { num: number; den: number };
  showResult: boolean;
  operation?: '+' | '-' | 'x';
  result?: { num: number; den: number };
  commonDen?: number;
  aNumCommon?: number;
  bNumCommon?: number;
}

export const MathEquation: React.FC<MathEquationProps> = ({ 
  fractionA, 
  fractionB, 
  showResult, 
  operation = 'x',
  result,
  commonDen,
  aNumCommon,
  bNumCommon
}) => {
  const resultNum = result ? result.num : fractionA.num * fractionB.num;
  const resultDen = result ? result.den : fractionA.den * fractionB.den;

  const displayA = commonDen ? { num: aNumCommon!, den: commonDen } : fractionA;
  const displayB = commonDen ? { num: bNumCommon!, den: commonDen } : fractionB;

  return (
    <div className="flex items-center justify-center gap-4 sm:gap-8 text-3xl sm:text-5xl font-black text-slate-100 bg-slate-900/50 p-6 sm:p-8 rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.3)] border border-slate-800 backdrop-blur-sm my-8">
      {/* Fraction A */}
      <div className="flex flex-col items-center text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.3)]">
        <span className="border-b-4 border-yellow-400/50 px-3 mb-2">{displayA.num}</span>
        <span>{displayA.den}</span>
      </div>

      <span className="text-slate-600">{operation === 'x' ? '×' : operation}</span>

      {/* Fraction B */}
      <div className="flex flex-col items-center text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">
        <span className="border-b-4 border-cyan-400/50 px-3 mb-2">{displayB.num}</span>
        <span>{displayB.den}</span>
      </div>

      <span className="text-slate-600">=</span>

      {/* Result */}
      <motion.div 
        className="flex flex-col items-center text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: showResult ? 1 : 0, scale: showResult ? 1 : 0.5 }}
      >
        <span className="border-b-4 border-emerald-400/50 px-3 mb-2 font-bold">{resultNum}</span>
        <span className="font-bold">{resultDen}</span>
      </motion.div>
    </div>
  );
};
