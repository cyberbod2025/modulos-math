import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Brain, ArrowLeft, RefreshCw, Grid3x3, CheckCircle2, ArrowRight } from 'lucide-react';

interface Props {
  onBack: () => void;
}

type MethodType = 'reduccion' | 'igualacion';

export default function AlgebraSystemsModule({ onBack }: Props) {
  const [mode, setMode] = useState<'explore' | 'practice'>('explore');
  const [method, setMethod] = useState<MethodType>('reduccion');
  const [step, setStep] = useState(0);

  // x = 2, y = 3
  // Eq1: 2x + 3y = 13
  // Eq2: 5x - 2y = 4
  const sys1 = { a1: 2, b1: 3, c1: 13, a2: 5, b2: -2, c2: 4, x: 2, y: 3 };
  
  // Practice Mode Data
  const [practiceStatus, setPracticeStatus] = useState<'question' | 'correct' | 'incorrect'>('question');
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [userX, setUserX] = useState('');
  const [userY, setUserY] = useState('');
  
  // A random system for practice
  const [pracSys, setPracSys] = useState({ a1: 1, b1: 1, c1: 0, a2: 1, b2: -1, c2: 0, x: 0, y: 0 });

  const generateProblem = () => {
    const x = Math.floor(Math.random() * 10) - 5;
    const y = Math.floor(Math.random() * 10) - 5;
    
    // Eq1
    const a1 = Math.floor(Math.random() * 3) + 1;
    const b1 = Math.floor(Math.random() * 4) + 1;
    const c1 = a1 * x + b1 * y;
    
    // Eq2
    const a2 = Math.floor(Math.random() * 4) + 1;
    const b2 = -(Math.floor(Math.random() * 3) + 1); // Negative for variety
    const c2 = a2 * x + b2 * y;

    setPracSys({ a1, b1, c1, a2, b2, c2, x, y });
    setUserX('');
    setUserY('');
    setPracticeStatus('question');
  };

  const handleModeSwitch = (newMode: 'explore' | 'practice') => {
    setMode(newMode);
    if (newMode === 'practice') {
      setScore({ correct: 0, total: 0 });
      generateProblem();
    } else {
      setStep(0);
    }
  };

  const checkPracticeAnswer = () => {
    const px = parseInt(userX);
    const py = parseInt(userY);
    if (isNaN(px) || isNaN(py)) return;

    if (px === pracSys.x && py === pracSys.y) {
      setPracticeStatus('correct');
      setScore(s => ({ correct: s.correct + 1, total: s.total + 1 }));
    } else {
      setPracticeStatus('incorrect');
    }
  };

  const formatCoeff = (c: number, isFirst: boolean) => {
    if (c === 1 && isFirst) return '';
    if (c === -1 && isFirst) return '-';
    if (c === 1) return '+ ';
    if (c === -1) return '- ';
    return c > 0 && !isFirst ? `+ ${c}` : (c < 0 && !isFirst ? `- ${Math.abs(c)}` : `${c}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-teal-500/30 pb-4 flex flex-col items-center">
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 py-3 px-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)] w-full sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button onClick={onBack} className="text-slate-400 hover:text-teal-400 transition-colors p-2 -ml-2 flex items-center gap-2">
              <ArrowLeft size={24} />
              <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Menú</span>
            </button>
            <div className="w-10 h-10 bg-teal-500/20 border border-teal-500 rounded-xl flex items-center justify-center text-teal-400 font-bold shadow-[0_0_15px_rgba(20,184,166,0.3)]">
              <Grid3x3 size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-100 hidden sm:block">Sistemas de Ecuaciones</h1>
          </div>
          
          <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700">
            <button onClick={() => handleModeSwitch('explore')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'explore' ? 'bg-teal-500/20 text-teal-400 border border-teal-500/50 shadow-[0_0_10px_rgba(20,184,166,0.2)]' : 'text-slate-400 hover:text-slate-200'}`}>
              <Compass size={16} /> Aprender
            </button>
            <button onClick={() => handleModeSwitch('practice')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'practice' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50 shadow-[0_0_10px_rgba(99,102,241,0.2)]' : 'text-slate-400 hover:text-slate-200'}`}>
              <Brain size={16} /> Práctica
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 sm:p-6 flex flex-col items-center mt-4 w-full">
        {mode === 'explore' && (
          <div className="w-full flex flex-col gap-8 items-center">
             
            <div className="flex justify-center gap-4 bg-slate-900 border border-slate-800 p-2 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)]">
               <button onClick={() => { setMethod('reduccion'); setStep(0); }} className={`px-6 py-2 rounded-full font-bold transition-all ${method === 'reduccion' ? 'bg-teal-500/20 text-teal-400 border border-teal-500/50' : 'text-slate-400 hover:text-slate-200'}`}>
                 Método: Suma y Resta (Reducción)
               </button>
               <button onClick={() => { setMethod('igualacion'); setStep(0); }} className={`px-6 py-2 rounded-full font-bold transition-all ${method === 'igualacion' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'text-slate-400 hover:text-slate-200'}`}>
                 Método: Igualación
               </button>
            </div>

            <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 p-6 md:p-10 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.6)] min-h-[500px] flex flex-col items-center">
               
               {/* Original System */}
               <div className="flex flex-col gap-2 font-mono text-xl sm:text-2xl font-bold bg-slate-950 p-6 rounded-2xl border border-slate-800 mb-8 border-l-4 border-l-teal-500">
                 <div className="flex gap-4 items-center">
                   <span className="text-slate-600 text-sm">(1)</span>
                   <span><span className="text-fuchsia-400">{sys1.a1}x</span> {formatCoeff(sys1.b1, false)}<span className="text-indigo-400">y</span> = <span className="text-emerald-400">{sys1.c1}</span></span>
                 </div>
                 <div className="flex gap-4 items-center">
                   <span className="text-slate-600 text-sm">(2)</span>
                   <span><span className="text-fuchsia-400">{sys1.a2}x</span> {formatCoeff(sys1.b2, false)}<span className="text-indigo-400">y</span> = <span className="text-emerald-400">{sys1.c2}</span></span>
                 </div>
               </div>

               {/* Method: Eliminación */}
               {method === 'reduccion' && (
                 <div className="flex flex-col items-center w-full gap-8">
                   {step >= 1 && (
                     <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2 items-center text-center">
                        <span className="text-teal-400 font-bold uppercase text-xs tracking-wider mb-2">Paso 1: Multiplicar para eliminar Y</span>
                        <div className="font-mono text-lg bg-slate-950 px-6 py-4 rounded-xl border border-slate-700 w-full max-w-md">
                           <div className="text-slate-300">{(1)} × 2 👉 4x + 6y = 26</div>
                           <div className="text-slate-300">{(2)} × 3 👉 15x - 6y = 12</div>
                        </div>
                     </motion.div>
                   )}

                   {step >= 2 && (
                     <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2 items-center text-center">
                        <span className="text-teal-400 font-bold uppercase text-xs tracking-wider mb-2">Paso 2: Sumar ecuaciones</span>
                        <div className="font-mono text-xl font-bold bg-teal-500/10 border border-teal-500 text-teal-300 px-6 py-4 rounded-xl shadow-[0_0_15px_rgba(20,184,166,0.2)]">
                           19x = 38
                        </div>
                     </motion.div>
                   )}

                   {step >= 3 && (
                     <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2 items-center text-center">
                        <span className="text-teal-400 font-bold uppercase text-xs tracking-wider mb-2">Paso 3: Resolver x</span>
                        <div className="font-mono text-3xl font-black text-fuchsia-400 bg-slate-950 px-6 py-4 rounded-xl border border-fuchsia-500/30">
                           x = 2
                        </div>
                     </motion.div>
                   )}

                   {step >= 4 && (
                     <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-2 items-center text-center">
                        <span className="text-teal-400 font-bold uppercase text-xs tracking-wider mb-2">Paso 4: Sustituir x en (1) y resolver y</span>
                        <div className="font-mono text-lg text-slate-300 bg-slate-950 px-6 py-4 rounded-xl border border-slate-700 mb-2">
                           2(2) + 3y = 13 <br/>
                           4 + 3y = 13  <br/>
                           3y = 9
                        </div>
                        <div className="font-mono text-3xl font-black text-indigo-400 bg-slate-950 px-6 py-4 rounded-xl border border-indigo-500/30">
                           y = 3
                        </div>
                     </motion.div>
                   )}
                 </div>
               )}

               {/* Method: Igualación */}
               {method === 'igualacion' && (
                 <div className="flex flex-col items-center w-full gap-8">
                   {step >= 1 && (
                     <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2 items-center text-center w-full">
                        <span className="text-emerald-400 font-bold uppercase text-xs tracking-wider mb-2">Paso 1: Despejar Y en ambas ecuaciones</span>
                        <div className="font-mono text-lg bg-slate-950 px-6 py-4 rounded-xl border border-slate-700 flex flex-col gap-4 w-full max-w-lg">
                           <div className="text-slate-300 flex items-center justify-between"><span className="text-slate-500 text-sm">(1)</span> y = (13 - 2x) / 3</div>
                           <div className="text-slate-300 flex items-center justify-between"><span className="text-slate-500 text-sm">(2)</span> y = (5x - 4) / 2</div>
                        </div>
                     </motion.div>
                   )}

                   {step >= 2 && (
                     <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2 items-center text-center w-full">
                        <span className="text-emerald-400 font-bold uppercase text-xs tracking-wider mb-2">Paso 2 y 3: Igualar y resolver x</span>
                        <div className="font-mono bg-emerald-500/10 border border-emerald-500 text-emerald-300 px-6 py-4 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.2)] flex flex-col gap-2 w-full max-w-lg">
                           <div className="flex justify-center gap-4 text-xl font-bold border-b border-emerald-500/30 pb-4 mb-2">
                             <span><span className="text-slate-400 text-sm block -mt-4 mb-1 border-b border-slate-500">13 - 2x</span>3</span>
                             <span>=</span>
                             <span><span className="text-slate-400 text-sm block -mt-4 mb-1 border-b border-slate-500">5x - 4</span>2</span>
                           </div>
                           <div className="text-lg">2(13 - 2x) = 3(5x - 4)</div>
                           <div className="text-lg">26 - 4x = 15x - 12</div>
                           <div className="text-lg">38 = 19x</div>
                           <div className="text-2xl font-black text-fuchsia-400 mt-2">x = 2</div>
                        </div>
                     </motion.div>
                   )}

                   {step >= 4 && (
                     <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-2 items-center text-center w-full">
                        <span className="text-emerald-400 font-bold uppercase text-xs tracking-wider mb-2">Paso 4: Sustituir x y resolver y</span>
                        <div className="font-mono text-lg text-slate-300 bg-slate-950 px-6 py-4 rounded-xl border border-slate-700 mb-2">
                           y = (13 - 2(2)) / 3 <br/>
                           y = (13 - 4) / 3 = 9 / 3
                        </div>
                        <div className="font-mono text-3xl font-black text-indigo-400 bg-slate-950 px-6 py-4 rounded-xl border border-indigo-500/30">
                           y = 3
                        </div>
                     </motion.div>
                   )}
                 </div>
               )}

               {/* Controls */}
               <div className="flex justify-center gap-4 border-t border-slate-800 pt-8 mt-auto w-full">
                  <button onClick={() => setStep(0)} className="px-6 py-3 rounded-xl bg-slate-800 font-bold hover:bg-slate-700 transition">Reiniciar</button>
                  <button 
                    onClick={() => setStep(s => s + 1)}
                    disabled={step >= 4}
                    className={`px-8 py-3 rounded-xl font-bold text-white transition disabled:opacity-50 disabled:cursor-not-allowed ${method === 'reduccion' ? 'bg-teal-600 hover:bg-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.4)]' : 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]'}`}
                  >
                    {step === 4 ? 'Solución Finalizada' : 'Siguiente Paso'}
                  </button>
               </div>
            </div>

          </div>
        )}

        {mode === 'practice' && (
          <div className="w-full max-w-3xl bg-slate-900/50 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-slate-800 mb-6 flex flex-col items-center">
            
            <div className="flex flex-col sm:flex-row justify-between w-full items-center mb-8 gap-6">
               <span className="text-indigo-400 font-bold text-lg">Resuelve el Sistema</span>
              <div className="bg-slate-950 px-6 py-3 rounded-xl border border-slate-800 text-right">
                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Puntuación</p>
                <p className="text-3xl font-black text-indigo-400 leading-none">{score.correct} <span className="text-slate-600 text-xl">/ {score.total}</span></p>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 w-full max-w-lg p-8 rounded-2xl mb-8 flex flex-col items-center justify-center font-mono text-2xl font-bold border-l-4 border-l-indigo-500 gap-4">
               <div><span className="text-fuchsia-400">{pracSys.a1}x</span> {formatCoeff(pracSys.b1, false)}<span className="text-indigo-400">y</span> = <span className="text-emerald-400">{pracSys.c1}</span></div>
               <div><span className="text-fuchsia-400">{pracSys.a2}x</span> {formatCoeff(pracSys.b2, false)}<span className="text-indigo-400">y</span> = <span className="text-emerald-400">{pracSys.c2}</span></div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-8 font-mono">
               <div className="flex items-center gap-4">
                 <span className="text-4xl font-black text-fuchsia-400">x =</span>
                 <input 
                    type="number" value={userX} onChange={(e) => setUserX(e.target.value)} disabled={practiceStatus === 'correct'} placeholder="?"
                    className="w-24 h-16 text-center text-3xl font-black bg-slate-950 border-4 rounded-xl outline-none focus:border-fuchsia-500 border-slate-700 transition"
                  />
               </div>
               <div className="flex items-center gap-4">
                 <span className="text-4xl font-black text-indigo-400">y =</span>
                 <input 
                    type="number" value={userY} onChange={(e) => setUserY(e.target.value)} disabled={practiceStatus === 'correct'} placeholder="?"
                    className="w-24 h-16 text-center text-3xl font-black bg-slate-950 border-4 rounded-xl outline-none focus:border-indigo-500 border-slate-700 transition"
                  />
               </div>
            </div>

            {practiceStatus === 'question' && (
              <button 
                onClick={checkPracticeAnswer}
                disabled={!userX || !userY}
                className="px-10 py-4 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-full font-bold text-lg hover:from-indigo-400 hover:to-violet-400 transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] mt-8 disabled:opacity-50"
              >
                Comprobar Solución
              </button>
            )}

            <AnimatePresence>
               {practiceStatus !== 'question' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="mt-8 flex flex-col items-center gap-4"
                  >
                    {practiceStatus === 'correct' ? (
                       <p className="text-emerald-400 font-black text-2xl flex items-center gap-3"><CheckCircle2/> ¡Solución Exacta!</p>
                    ) : (
                       <p className="text-rose-400 font-black text-xl flex items-center gap-3">Los valores no encajan. x={pracSys.x}, y={pracSys.y}</p>
                    )}
                    <button onClick={generateProblem} className="mt-2 px-8 py-3 bg-cyan-600 text-white rounded-full font-bold hover:bg-cyan-500 transition-all shadow-lg flex items-center gap-2">Nuevo Sistema <ArrowRight size={20}/></button>
                  </motion.div>
               )}
            </AnimatePresence>

          </div>
        )}

      </main>
    </div>
  );
}
