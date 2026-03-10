import React from 'react';
import { Info } from 'lucide-react';

export const Explanation: React.FC = () => {
  return (
    <div className="bg-slate-900/80 rounded-2xl p-6 sm:p-8 shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-slate-700 max-w-2xl mx-auto mt-8 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <div className="p-4 bg-cyan-500/10 rounded-2xl text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          <Info size={32} />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-100 mb-3 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
            ¿Por qué funciona esto?
          </h3>
          <p className="text-slate-400 leading-relaxed mb-6 text-lg">
            Multiplicar fracciones significa tomar una <strong className="text-cyan-400">parte de una parte</strong>.
          </p>
          <ul className="space-y-4 text-slate-300">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-yellow-400 mt-2 shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
              <span>La <strong className="text-yellow-400">capa amarilla</strong> divide el todo en tiras verticales.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              <span>La <strong className="text-cyan-400">capa azul</strong> divide el todo en tiras horizontales.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span>Cuando se superponen, la cuadrícula crea piezas más pequeñas. El <strong className="text-emerald-400">área verde</strong> muestra las piezas que están en <strong>ambas</strong> fracciones.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
