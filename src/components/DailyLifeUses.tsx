import React from 'react';
import { motion } from 'motion/react';
import { Lightbulb, Target } from 'lucide-react';

interface UseCase {
  title: string;
  description: string;
}

interface Props {
  uses: UseCase[];
}

export function DailyLifeUses({ uses }: Props) {
  return (
    <div className="w-full max-w-4xl mx-auto mt-12 mb-8">
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl p-8 border border-slate-800 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <Lightbulb size={28} />
          </div>
          <h2 className="text-2xl font-black text-slate-100 tracking-tight">
            Usos en la Vida Diaria
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {uses.map((use, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 hover:border-amber-500/50 hover:bg-slate-800 transition-all hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] flex flex-col gap-3 group"
            >
              <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                <Target size={18} className="text-slate-500 group-hover:text-amber-500 transition-colors" /> 
                {use.title}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {use.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
