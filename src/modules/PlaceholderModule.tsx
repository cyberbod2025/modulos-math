import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface PlaceholderProps {
  title: string;
  onBack: () => void;
}

export const PlaceholderModule: React.FC<PlaceholderProps> = ({ title, onBack }) => (
  <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col items-center justify-center relative overflow-hidden">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
    
    <button 
      onClick={onBack} 
      className="absolute top-6 left-6 flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors bg-slate-900/50 px-4 py-2 rounded-lg border border-cyan-900/50 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] z-10"
    >
      <ArrowLeft size={20} /> Volver al Menú
    </button>
    
    <div className="z-10 text-center border-2 border-slate-800 bg-slate-900/50 backdrop-blur-md p-12 rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.5)]">
      <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-6 drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">
        {title}
      </h1>
      <p className="text-slate-400 text-xl">
        Este módulo está en construcción.
      </p>
      <div className="mt-8 flex justify-center">
        <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
      </div>
    </div>
  </div>
);
