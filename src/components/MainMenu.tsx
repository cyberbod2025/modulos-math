import React from 'react';
import { motion } from 'motion/react';
import { Zap, PieChart, PlusSquare, Variable } from 'lucide-react';

interface MainMenuProps {
  onSelect: (moduleId: string) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onSelect }) => {
  const categories = [
    { id: 'menu-rational', title: 'Números Racionales (Fracciones)', icon: PieChart, color: 'text-pink-400', border: 'border-pink-500', bg: 'bg-pink-500/10', glow: 'hover:shadow-[0_0_30px_rgba(236,72,153,0.5)]' },
    { id: 'menu-integers', title: 'Números Enteros', icon: PlusSquare, color: 'text-orange-400', border: 'border-orange-500', bg: 'bg-orange-500/10', glow: 'hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]' },
    { id: 'menu-algebra', title: 'Álgebra', icon: Variable, color: 'text-fuchsia-400', border: 'border-fuchsia-500', bg: 'bg-fuchsia-500/10', glow: 'hover:shadow-[0_0_30px_rgba(217,70,239,0.5)]' },
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
          Plataforma de entrenamiento matemático. Selecciona tu ruta de aprendizaje para comenzar.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl z-10">
        {categories.map((cat, index) => {
          const Icon = cat.icon;
          return (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(cat.id)}
              className={`relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 ${cat.border} ${cat.bg} backdrop-blur-sm transition-all duration-300 ${cat.glow} group`}
            >
              <Icon size={48} className={`${cat.color} mb-4 group-hover:animate-pulse`} />
              <h2 className={`text-xl font-bold text-center ${cat.color} drop-shadow-[0_0_8px_currentColor]`}>
                {cat.title}
              </h2>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
