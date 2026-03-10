import React from 'react';
import { motion } from 'motion/react';
import { PieChart, ArrowLeftRight, Equal, PlusSquare, XSquare, Zap } from 'lucide-react';

interface MainMenuProps {
  onSelect: (moduleId: string) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onSelect }) => {
  const modules = [
    { id: 'part-whole', title: 'Fracción como Parte-Todo', icon: PieChart, color: 'text-pink-400', border: 'border-pink-500', bg: 'bg-pink-500/10', glow: 'hover:shadow-[0_0_30px_rgba(236,72,153,0.5)]' },
    { id: 'compare', title: 'Comparación (>, <, =)', icon: ArrowLeftRight, color: 'text-yellow-400', border: 'border-yellow-500', bg: 'bg-yellow-500/10', glow: 'hover:shadow-[0_0_30px_rgba(234,179,8,0.5)]' },
    { id: 'equivalent', title: 'Fracciones Equivalentes', icon: Equal, color: 'text-emerald-400', border: 'border-emerald-500', bg: 'bg-emerald-500/10', glow: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]' },
    { id: 'add-sub', title: 'Suma y Resta', icon: PlusSquare, color: 'text-blue-400', border: 'border-blue-500', bg: 'bg-blue-500/10', glow: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]' },
    { id: 'mult-div', title: 'Multiplicación y División', icon: XSquare, color: 'text-cyan-400', border: 'border-cyan-500', bg: 'bg-cyan-500/10', glow: 'hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]', highlight: true },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 z-10"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Zap className="text-yellow-400" size={40} />
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 drop-shadow-[0_0_15px_rgba(192,132,252,0.5)] tracking-tight">
            NEXUS MATH
          </h1>
        </div>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
          Domina las fracciones. Selecciona un módulo de entrenamiento para comenzar.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl z-10">
        {modules.map((mod, index) => {
          const Icon = mod.icon;
          return (
            <motion.button
              key={mod.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(mod.id)}
              className={`relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 ${mod.border} ${mod.bg} backdrop-blur-sm transition-all duration-300 ${mod.glow} group ${mod.highlight ? 'md:col-span-2 lg:col-span-1 lg:col-start-2' : ''}`}
            >
              {mod.highlight && (
                <div className="absolute -top-3 bg-cyan-500 text-slate-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-[0_0_10px_rgba(6,182,212,0.8)]">
                  Módulo Activo
                </div>
              )}
              <Icon size={48} className={`${mod.color} mb-4 group-hover:animate-pulse`} />
              <h2 className={`text-xl font-bold text-center ${mod.color} drop-shadow-[0_0_8px_currentColor]`}>
                {mod.title}
              </h2>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
