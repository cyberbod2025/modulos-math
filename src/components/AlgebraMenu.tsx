import React from 'react';
import { motion } from 'motion/react';
import { Variable, Brackets, Grid3x3, ArrowLeft } from 'lucide-react';

interface AlgebraMenuProps {
  onSelect: (moduleId: string) => void;
  onBack: () => void;
}

export const AlgebraMenu: React.FC<AlgebraMenuProps> = ({ onSelect, onBack }) => {
  const modules = [
    { id: 'algebra-lang', title: 'Lenguaje Algebraico y Evaluación', icon: Variable, color: 'text-fuchsia-400', border: 'border-fuchsia-500', bg: 'bg-fuchsia-500/10', glow: 'hover:shadow-[0_0_30px_rgba(217,70,239,0.5)]' },
    { id: 'algebra-linear', title: 'Ecuaciones de 1er Grado', icon: Brackets, color: 'text-indigo-400', border: 'border-indigo-500', bg: 'bg-indigo-500/10', glow: 'hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]' },
    { id: 'algebra-systems', title: 'Sistemas de Ecuaciones', icon: Grid3x3, color: 'text-teal-400', border: 'border-teal-500', bg: 'bg-teal-500/10', glow: 'hover:shadow-[0_0_30px_rgba(20,184,166,0.5)]' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-teal-600/20 rounded-full blur-[100px] pointer-events-none" />

      <button 
        onClick={onBack} 
        className="absolute top-6 left-6 flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors bg-slate-900/50 px-4 py-2 rounded-lg border border-cyan-900/50 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] z-20"
      >
        <ArrowLeft size={20} /> Volver a Categorías
      </button>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 z-10"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Variable className="text-fuchsia-400" size={40} />
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-indigo-400 to-teal-400 drop-shadow-[0_0_15px_rgba(217,70,239,0.5)] tracking-tight">
            ÁLGEBRA
          </h1>
        </div>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
          Descubre el poder de las variables y ecuaciones. Selecciona un submódulo para comenzar.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl z-10 justify-center">
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
              className={`relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 ${mod.border} ${mod.bg} backdrop-blur-sm transition-all duration-300 ${mod.glow} group`}
            >
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
