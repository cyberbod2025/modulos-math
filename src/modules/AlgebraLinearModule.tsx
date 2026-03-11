import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Brain, ArrowLeft, RefreshCw, Brackets, CheckCircle2, ArrowRight, Scale } from 'lucide-react';

interface Props {
  onBack: () => void;
}

type EquationType = 'ax=b' | 'ax+b=c';

export default function AlgebraLinearModule({ onBack }: Props) {
  const [mode, setMode] = useState<'explore' | 'practice'>('explore');
  const [eqType, setEqType] = useState<EquationType>('ax=b');
  const [step, setStep] = useState(0);

  // Explore Mode Data
  const [aVal, setAVal] = useState(2);
  const [bVal, setBVal] = useState(4);
  const [cVal, setCVal] = useState(10);

  // Practice Mode Data
  const [practiceEq, setPracticeEq] = useState({ a: 2, b: 0, c: 6, type: 'ax=b' as EquationType });
  const [userAnswer, setUserAnswer] = useState('');
  const [practiceStatus, setPracticeStatus] = useState<'question' | 'correct' | 'incorrect'>('question');
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const generateProblem = (type: EquationType) => {
    let a, b, c;
    if (type === 'ax=b') {
      a = Math.floor(Math.random() * 8) + 2; 
      const x = Math.floor(Math.random() * 10) + 1; 
      c = a * x;
      b = 0;
    } else {
      a = Math.floor(Math.random() * 5) + 2; 
      b = Math.floor(Math.random() * 10) + 1; 
      const x = Math.floor(Math.random() * 10) + 1; 
      c = (a * x) + b;
    }

    setPracticeEq({ a, b, c, type });
    setUserAnswer('');
    setPracticeStatus('question');
  };

  const handleModeSwitch = (newMode: 'explore' | 'practice') => {
    setMode(newMode);
    if (newMode === 'practice') {
      setScore({ correct: 0, total: 0 });
      generateProblem('ax=b');
    } else {
      setStep(0);
    }
  };

  const checkPracticeAnswer = () => {
    const pAns = parseInt(userAnswer);
    if (isNaN(pAns)) return;

    let expected = 0;
    if (practiceEq.type === 'ax=b') {
      expected = practiceEq.c / practiceEq.a;
    } else {
      expected = (practiceEq.c - practiceEq.b) / practiceEq.a;
    }

    if (pAns === expected) {
      setPracticeStatus('correct');
      setScore(s => ({ correct: s.correct + 1, total: s.total + 1 }));
    } else {
      setPracticeStatus('incorrect');
    }
  };

  // Rendering weights on the balance
  const renderBalanceSide = (isLeft: boolean) => {
    // Current state based on step
    let currentA = isLeft ? aVal : 0;
    let currentB = 0;
    let currentC = 0;

    if (eqType === 'ax+b=c') {
      currentB = isLeft && step < 2 ? bVal : 0; // step 1 shows removing b, step 2 b is gone
      currentC = !isLeft ? (step < 2 ? cVal : cVal - bVal) : 0; 
    } else {
      currentC = !isLeft ? cVal : 0;
    }

    // Step 3 (division): show grouping
    let groupMode = step >= (eqType === 'ax+b=c' ? 3 : 2);
    let finalRes = eqType === 'ax+b=c' ? (cVal - bVal) / aVal : cVal / aVal;

    if (groupMode) {
      if (isLeft) currentA = 1;
      if (!isLeft) currentC = finalRes;
    }

    return (
      <div className="flex flex-wrap justify-center items-end gap-2 w-full h-32 p-4 content-end relative z-10">
        <AnimatePresence>
           {/* Rendering X boxes */}
           {Array.from({ length: currentA }).map((_, i) => (
             <motion.div 
               key={`x-${i}`} layout
               initial={{ scale: 0, y: -50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0, opacity: 0 }}
               className="w-12 h-14 bg-gradient-to-b from-fuchsia-500 to-indigo-600 rounded-lg shadow-[0_4px_15px_rgba(217,70,239,0.5)] border-2 border-fuchsia-400 flex items-center justify-center font-black text-white text-xl"
             >
               X
             </motion.div>
           ))}

           {/* Rendering +B constants (Left) */}
           {Array.from({ length: currentB }).map((_, i) => (
             <motion.div 
               key={`b-${i}`} layout
               initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0, y: -50, opacity: 0 }}
               className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-md border ${step === 1 ? 'bg-red-500/20 border-red-500 text-red-300' : 'bg-amber-500 border-amber-400 text-amber-950'}`}
             >
               1
             </motion.div>
           ))}

           {/* Rendering C constants (Right) */}
           {Array.from({ length: currentC }).map((_, i) => (
             <motion.div 
               key={`c-${i}`} layout
               initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0, y: -50, opacity: 0 }}
               className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-md border ${
                 step === 1 && i >= cVal - bVal ? 'bg-red-500/20 border-red-500 text-red-300' : 'bg-emerald-500 border-emerald-400 text-emerald-950'
               }`}
             >
               1
             </motion.div>
           ))}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 pb-4 flex flex-col items-center">
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 py-3 px-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)] w-full sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button onClick={onBack} className="text-slate-400 hover:text-indigo-400 transition-colors p-2 -ml-2 flex items-center gap-2">
              <ArrowLeft size={24} />
              <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Menú</span>
            </button>
            <div className="w-10 h-10 bg-indigo-500/20 border border-indigo-500 rounded-xl flex items-center justify-center text-indigo-400 font-bold shadow-[0_0_15px_rgba(99,102,241,0.3)]">
              <Scale size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-100 hidden sm:block">La Balanza Algebraica</h1>
          </div>
          
          <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700">
            <button onClick={() => handleModeSwitch('explore')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'explore' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50 shadow-[0_0_10px_rgba(99,102,241,0.2)]' : 'text-slate-400 hover:text-slate-200'}`}>
              <Compass size={16} /> Explorar
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
               <button onClick={() => { setEqType('ax=b'); setStep(0); }} className={`px-6 py-2 rounded-full font-bold transition-all ${eqType === 'ax=b' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50' : 'text-slate-400 hover:text-slate-200'}`}>
                 Forma: <span className="font-mono">ax = c</span>
               </button>
               <button onClick={() => { setEqType('ax+b=c'); setStep(0); }} className={`px-6 py-2 rounded-full font-bold transition-all ${eqType === 'ax+b=c' ? 'bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/50' : 'text-slate-400 hover:text-slate-200'}`}>
                 Forma: <span className="font-mono">ax + b = c</span>
               </button>
            </div>

            <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 p-6 md:p-10 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.6)]">
               
               {/* Controls for values */}
               <div className="flex items-center justify-center gap-8 mb-12 opacity-80 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                 <div className="flex flex-col gap-1 items-center">
                    <span className="text-xs font-bold uppercase text-fuchsia-500">Valor a (Cajas X)</span>
                    <input type="number" min="1" max="10" value={aVal} onChange={e => {setAVal(Math.max(1, parseInt(e.target.value) || 1)); setStep(0)}} className="w-16 h-10 text-center bg-slate-800 border-2 border-fuchsia-500/30 rounded-lg font-mono font-bold text-fuchsia-300 focus:border-fuchsia-500 outline-none" />
                 </div>
                 {eqType === 'ax+b=c' && (
                   <div className="flex flex-col gap-1 items-center">
                      <span className="text-xs font-bold uppercase text-amber-500">Valor b (Pesos extra)</span>
                      <input type="number" min="1" max="20" value={bVal} onChange={e => {setBVal(parseInt(e.target.value) || 0); setStep(0)}} className="w-16 h-10 text-center bg-slate-800 border-2 border-amber-500/30 rounded-lg font-mono font-bold text-amber-300 focus:border-amber-500 outline-none" />
                   </div>
                 )}
                 <div className="flex flex-col gap-1 items-center">
                    <span className="text-xs font-bold uppercase text-emerald-500">Valor c (Total)</span>
                     <input type="number" min="1" max="40" value={cVal} onChange={e => {setCVal(parseInt(e.target.value) || 0); setStep(0)}} className="w-16 h-10 text-center bg-slate-800 border-2 border-emerald-500/30 rounded-lg font-mono font-bold text-emerald-300 focus:border-emerald-500 outline-none" />
                 </div>
               </div>

               {/* MAGIC BALANCE SCALE */}
               <div className="relative w-full h-[350px] flex flex-col items-center justify-end mb-8 pt-10 mt-10">
                 
                 <div className="flex w-full max-w-2xl px-8 absolute bottom-24 justify-between z-10 transition-transform duration-700 ease-in-out">
                    <div className="w-5/12 flex justify-center border-b-4 border-slate-600 relative">
                       {renderBalanceSide(true)}
                       <div className="absolute -bottom-4 w-6 h-6 rotate-45 bg-slate-600 border-t-4 border-l-4 border-slate-500" />
                    </div>
                    
                    <div className="text-6xl font-black text-slate-700 flex items-end pb-4 drop-shadow-md">=</div>

                    <div className="w-5/12 flex justify-center border-b-4 border-slate-600 relative">
                       {renderBalanceSide(false)}
                       <div className="absolute -bottom-4 w-6 h-6 rotate-45 bg-slate-600 border-t-4 border-l-4 border-slate-500" />
                    </div>
                 </div>

                 {/* Center Fulcrum */}
                 <div className="w-12 h-[100px] bg-gradient-to-t from-slate-700 to-slate-500 rounded-t-full shadow-2xl z-0 relative flex justify-center">
                   <div className="w-4 h-4 rounded-full bg-slate-300 mt-2 shadow-inner" />
                 </div>
                 <div className="w-32 h-4 bg-slate-800 rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.5)]" />
                 
                 {/* Tooltip explaining current step */}
                 <div className="absolute top-0 w-full text-center">
                    <span className="bg-slate-800/80 backdrop-blur border border-indigo-500/50 text-indigo-200 px-6 py-3 rounded-full font-medium inline-block shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                      {step === 0 && "Balanza equilibrada: La ecuación original"}
                      {eqType === 'ax+b=c' && step === 1 && "Restando el mismo peso en ambos lados para no perder equilibrio"}
                      {((eqType === 'ax+b=c' && step === 2) || (eqType === 'ax=b' && step === 1)) && "Simplificando: Hemos despejado las cajas X"}
                      {((eqType === 'ax+b=c' && step === 3) || (eqType === 'ax=b' && step === 2)) && "Dividiendo la carga: ¿Cuánto peso le toca a 1 sola caja X?"}
                    </span>
                 </div>
               </div>

               {/* Mathematical Logic text below the balance */}
               <div className="flex flex-col items-center font-mono text-3xl font-black gap-2 tracking-wide text-slate-400">
                 {step >= 0 && (
                   <motion.div className={step === 0 ? "text-slate-100 scale-110 transition-all font-bold" : "text-slate-600 text-xl"}>
                     <span className="text-fuchsia-400">{aVal}</span>x {eqType === 'ax+b=c' && <span className="text-amber-400">+ {bVal}</span>} = <span className="text-emerald-400">{cVal}</span>
                   </motion.div>
                 )}
                 {eqType === 'ax+b=c' && step >= 1 && (
                   <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className={step === 1 ? "text-slate-100 scale-110 transition-all font-bold" : "text-slate-600 text-xl"}>
                     <span className="text-fuchsia-400">{aVal}</span>x = <span className="text-emerald-400">{cVal}</span> <span className="text-rose-400">- {bVal}</span>
                   </motion.div>
                 )}
                 {((eqType === 'ax+b=c' && step >= 2) || (eqType === 'ax=b' && step >= 1)) && (
                   <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className={step === (eqType === 'ax+b=c' ? 2 : 1) ? "text-slate-100 scale-110 transition-all font-bold" : "text-slate-600 text-xl"}>
                     <span className="text-fuchsia-400">{aVal}</span>x = <span className="text-emerald-400">{eqType === 'ax+b=c' ? cVal - bVal : cVal}</span>
                   </motion.div>
                 )}
                 {((eqType === 'ax+b=c' && step >= 3) || (eqType === 'ax=b' && step >= 2)) && (
                   <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-indigo-400 scale-125 pt-4 border-t-4 border-slate-700 mt-2 font-bold drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                     x = <span className="text-emerald-300">{(eqType === 'ax+b=c' ? cVal - bVal : cVal) / aVal}</span>
                   </motion.div>
                 )}
               </div>

               
               {/* Controls */}
               <div className="flex justify-center gap-4 border-t border-slate-800 pt-8 mt-12">
                  <button onClick={() => setStep(0)} className="px-6 py-3 rounded-xl bg-slate-800 font-bold hover:bg-slate-700 transition flex items-center gap-2"><RefreshCw size={18}/> Reiniciar</button>
                  <button 
                    onClick={() => setStep(s => s + 1)}
                    disabled={(eqType === 'ax+b=c' && step >= 3) || (eqType === 'ax=b' && step >= 2)}
                    className="flex text-lg items-center gap-2 px-10 py-3 rounded-xl bg-indigo-600 font-bold text-white hover:bg-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                  >
                    Mover Balanza <ArrowRight size={20} />
                  </button>
               </div>
            </div>

          </div>
        )}

        {mode === 'practice' && (
          <div className="w-full max-w-3xl bg-slate-900/50 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-slate-800 mb-6 flex flex-col items-center">
            {/* Practice mode logic */}
            
            <div className="flex flex-col sm:flex-row justify-between w-full items-center mb-8 gap-6">
               <div className="flex gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                {(['ax=b', 'ax+b=c'] as const).map(d => (
                  <button key={d} onClick={() => generateProblem(d)} className={`px-5 py-2 rounded-lg text-sm font-bold uppercase transition-all ${practiceEq.type === d ? 'bg-indigo-500/20 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.3)]' : 'text-slate-500 hover:text-slate-300'}`}>
                    {d}
                  </button>
                ))}
              </div>
              <div className="bg-slate-950 px-6 py-3 rounded-xl border border-slate-800 text-right">
                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Puntuación</p>
                <p className="text-3xl font-black text-indigo-400 leading-none">{score.correct} <span className="text-slate-600 text-xl">/ {score.total}</span></p>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 w-full p-8 rounded-2xl mb-8 flex justify-center text-center">
              <h2 className="text-4xl sm:text-5xl font-mono font-black text-slate-200">
                 <span className={practiceEq.type === 'ax=b' ? 'text-indigo-400' : 'text-fuchsia-400'}>{practiceEq.a}</span>x 
                 {practiceEq.type === 'ax+b=c' && <span className="text-amber-400"> + {practiceEq.b}</span>}
                 <span className="text-slate-500 mx-4">=</span>
                 <span className="text-emerald-400">{practiceEq.c}</span>
              </h2>
            </div>

            <div className="flex items-center gap-6">
               <span className="text-5xl font-mono font-black text-slate-400">x =</span>
               <input 
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  disabled={practiceStatus === 'correct'}
                  placeholder="?"
                  className={`w-32 h-20 text-center text-4xl sm:text-5xl font-black bg-slate-950 border-4 rounded-2xl outline-none transition-colors ${
                    practiceStatus === 'correct' ? 'border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]' :
                    practiceStatus === 'incorrect' ? 'border-rose-500 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.4)]' :
                    'border-slate-700 text-white focus:border-indigo-500'
                  }`}
                  onKeyDown={e => { if(e.key === 'Enter') checkPracticeAnswer() }}
                />
            </div>

            {practiceStatus === 'question' && (
              <button 
                onClick={checkPracticeAnswer}
                disabled={!userAnswer}
                className="px-10 py-4 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-full font-bold text-lg hover:from-indigo-400 hover:to-violet-400 transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] mt-8 disabled:opacity-50"
              >
                Verificar Equilibrio
              </button>
            )}

            <AnimatePresence>
               {practiceStatus !== 'question' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="mt-8 flex flex-col items-center gap-4"
                  >
                    {practiceStatus === 'correct' ? (
                       <p className="text-emerald-400 font-black text-2xl flex items-center gap-3"><CheckCircle2/> ¡Balanza Equilibrada!</p>
                    ) : (
                       <p className="text-rose-400 font-black text-xl flex items-center gap-3">La balanza se fue de lado. Intenta de nuevo.</p>
                    )}
                    <button onClick={() => generateProblem(practiceEq.type)} className="mt-2 px-8 py-3 bg-cyan-600 text-white rounded-full font-bold hover:bg-cyan-500 transition-all shadow-lg flex items-center gap-2">Siguiente <ArrowRight size={20}/></button>
                  </motion.div>
               )}
            </AnimatePresence>

          </div>
        )}

      </main>
    </div>
  );
}
