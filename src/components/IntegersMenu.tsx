import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MoveHorizontal, MinusCircle, DivideSquare } from 'lucide-react';

interface IntegersMenuProps {
  onSelect: (moduleId: string) => void;
  onBack: () => void;
}

export const IntegersMenu: React.FC<IntegersMenuProps> = ({ onSelect, onBack }) => {
  const modules = [
    { id: 'integers-intro', title: 'Conceptos y Recta Numérica', icon: MoveHorizontal, color: 'text-orange-400', border: 'border-orange-500', bg: 'bg-orange-500/10', glow: 'hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]' },
    { id: 'integers-reduction', title: 'Reducciones de Signos', icon: MinusCircle, color: 'text-rose-400', border: 'border-rose-500', bg: 'bg-rose-500/10', glow: 'hover:shadow-[0_0_30px_rgba(244,63,94,0.5)]' },
    { id: 'integers-signs', title: 'Ley de los Signos (Mult/Div)', icon: DivideSquare, color: 'text-violet-400', border: 'border-violet-500', bg: 'bg-violet-500/10', glow: 'hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-rose-600/20 rounded-full blur-[100px] pointer-events-none" />

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
          <MoveHorizontal className="text-orange-400" size={40} />
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-rose-400 to-violet-400 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)] tracking-tight">
            NÚMEROS ENTEROS
          </h1>
        </div>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
          Descubre los positivos y negativos. Selecciona un submódulo para comenzar.
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
