import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Brain, ArrowLeft, RefreshCw, Layers, CheckCircle2, AlertCircle, ArrowRight, Zap } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export default function IntegersSignsModule({ onBack }: Props) {
  const [mode, setMode] = useState<'explore' | 'practice'>('explore');
  const [difficulty, setDifficulty] = useState<'facil' | 'medio' | 'dificil'>('facil');
  
  // Explore Mode
  const [signA, setSignA] = useState<1 | -1>(1);
  const [signB, setSignB] = useState<1 | -1>(1);
  const [operation, setOperation] = useState<'multiply' | 'divide'>('multiply');
  const [showResult, setShowResult] = useState(false);

  // Practice Mode
  const [practiceA, setPracticeA] = useState(0);
  const [practiceB, setPracticeB] = useState(0);
  const [practiceOp, setPracticeOp] = useState<'multiply' | 'divide'>('multiply');
  const [userAnswer, setUserAnswer] = useState('');
  const [practiceStatus, setPracticeStatus] = useState<'question' | 'correct' | 'incorrect'>('question');
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const generateProblem = (diff: 'facil' | 'medio' | 'dificil') => {
    let limit = 5;
    if (diff === 'medio') limit = 10;
    if (diff === 'dificil') limit = 15;

    const op = Math.random() > 0.5 ? 'multiply' : 'divide';
    
    let a, b;
    if (op === 'multiply') {
      a = (Math.floor(Math.random() * limit) + 1) * (Math.random() > 0.5 ? 1 : -1);
      b = (Math.floor(Math.random() * limit) + 1) * (Math.random() > 0.5 ? 1 : -1);
    } else {
      b = (Math.floor(Math.random() * limit) + 1) * (Math.random() > 0.5 ? 1 : -1);
      const res = (Math.floor(Math.random() * limit) + 1) * (Math.random() > 0.5 ? 1 : -1);
      a = b * res; // Ensure integer division
    }

    setPracticeA(a);
    setPracticeB(b);
    setPracticeOp(op);
    setUserAnswer('');
    setPracticeStatus('question');
  };

  const handleModeSwitch = (newMode: 'explore' | 'practice') => {
    setMode(newMode);
    if (newMode === 'practice') {
      setScore({ correct: 0, total: 0 });
      generateProblem(difficulty);
    } else {
      setShowResult(false);
    }
  };

  const checkPracticeAnswer = () => {
    const pAns = parseInt(userAnswer);
    if (isNaN(pAns)) return;

    const expected = practiceOp === 'multiply' ? practiceA * practiceB : practiceA / practiceB;

    if (pAns === expected) {
      setPracticeStatus('correct');
      setScore(s => ({ correct: s.correct + 1, total: s.total + 1 }));
    } else {
      setPracticeStatus('incorrect');
    }
  };

  const renderSignButton = (currentVal: 1 | -1, setVal: React.Dispatch<React.SetStateAction<1 | -1>>, label: string) => (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs uppercase font-bold text-slate-500">{label}</span>
      <button 
        onClick={() => { setVal(currentVal === 1 ? -1 : 1); setShowResult(false); }}
        className={`w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-black transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)] border-4 hover:scale-105 active:scale-95 ${
          currentVal > 0 
            ? 'bg-rose-500/10 border-rose-500 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]' 
            : 'bg-indigo-500/10 border-indigo-500 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
        }`}
      >
        {currentVal > 0 ? '+' : '-'}
      </button>
    </div>
  );

  const getResultSign = () => (signA * signB);
  
  const rulesList = [
    { a: 1, b: 1, res: 1, text: '(+) por (+) da (+)' },
    { a: -1, b: -1, res: 1, text: '(-) por (-) da (+)' },
    { a: 1, b: -1, res: -1, text: '(+) por (-) da (-)' },
    { a: -1, b: 1, res: -1, text: '(-) por (+) da (-)' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-rose-500/30 pb-4 flex flex-col items-center">
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 py-3 px-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)] w-full sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button onClick={onBack} className="text-slate-400 hover:text-rose-400 transition-colors p-2 -ml-2 flex items-center gap-2">
              <ArrowLeft size={24} />
              <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Menú</span>
            </button>
            <div className="w-10 h-10 bg-amber-500/20 border border-amber-500 rounded-xl flex items-center justify-center text-amber-400 font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <Zap size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-100 hidden sm:block">Ley de los Signos</h1>
          </div>
          
          <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700">
            <button onClick={() => handleModeSwitch('explore')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'explore' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]' : 'text-slate-400 hover:text-slate-200'}`}>
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
          <div className="w-full max-w-4xl flex flex-col items-center gap-10">
            <div className="text-center space-y-4 max-w-2xl">
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                Multiplicación y División
              </h2>
              <p className="text-slate-400 text-lg">
                La regla es simple: <strong className="text-emerald-400">Signos iguales dan Positivo (+)</strong> y <strong className="text-rose-400">Signos diferentes dan Negativo (-)</strong>. ¡Aplica igual para Multiplicar y Dividir!
              </p>
            </div>

            {/* Input Form */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 bg-slate-900 border border-slate-800 p-6 sm:p-10 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.6)] w-full max-w-2xl justify-center items-center relative">
              
              {renderSignButton(signA, setSignA, 'Signo 1')}

              <div className="flex flex-col gap-4 z-10">
                 <button 
                  onClick={() => { setOperation(operation === 'multiply' ? 'divide' : 'multiply'); setShowResult(false); }}
                  className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center border-2 border-slate-600 text-3xl font-black hover:bg-slate-700 hover:border-slate-500 transition-all group shadow-lg"
                 >
                   {operation === 'multiply' ? <span className="text-slate-300">×</span> : <span className="text-slate-300">÷</span>}
                 </button>
              </div>

              {renderSignButton(signB, setSignB, 'Signo 2')}

              <div className="w-full absolute -bottom-6 flex justify-center">
                 <button
                    onClick={() => setShowResult(true)}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                  >
                    Ver Resultado <ArrowRight size={18} />
                 </button>
              </div>
            </div>

            {/* Result Display */}
            <div className="w-full h-40 flex justify-center items-center mt-6">
              <AnimatePresence mode="wait">
                {showResult ? (
                  <motion.div 
                    key="res"
                    initial={{ scale: 0.5, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className={`flex flex-col items-center gap-4 px-12 py-8 rounded-3xl border-2 shadow-[0_0_30px_rgba(0,0,0,0.5)] ${getResultSign() > 0 ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-rose-500/10 border-rose-500 text-rose-400'}`}
                  >
                     <div className="text-7xl font-black">{getResultSign() > 0 ? '+' : '-'}</div>
                     <div className="font-bold text-lg tracking-wide uppercase opacity-80">
                       {getResultSign() > 0 ? '¡Positivo!' : '¡Negativo!'}
                     </div>
                  </motion.div>
                ) : (
                   <motion.div 
                    key="placeholder"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-slate-600 font-mono text-xl"
                   >
                     Selecciona los signos y descubre el resultado
                   </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Rules Cheat Sheet */}
            <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-4">
               <h3 className="text-lg font-bold text-slate-300 mb-4 flex items-center gap-2"><Layers size={20} className="text-amber-500"/> Tabla de Reglas</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {rulesList.map((r, i) => {
                   const isActive = signA === r.a && signB === r.b && showResult;
                   return (
                     <div key={i} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${isActive ? 'bg-slate-800 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-slate-950 border-slate-800 opacity-60'}`}>
                        <div className="flex gap-2 text-2xl font-black">
                           <span className={r.a > 0 ? 'text-rose-400' : 'text-indigo-400'}>{r.a > 0 ? '+' : '-'}</span>
                           <span className="text-slate-500">×</span>
                           <span className={r.b > 0 ? 'text-rose-400' : 'text-indigo-400'}>{r.b > 0 ? '+' : '-'}</span>
                        </div>
                        <span className="text-slate-500 font-black">=</span>
                        <div className={`text-3xl font-black ${r.res > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{r.res > 0 ? '+' : '-'}</div>
                     </div>
                   )
                 })}
               </div>
            </div>

          </div>
        )}

        {mode === 'practice' && (
          <div className="w-full max-w-3xl bg-slate-900/50 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-slate-800 mb-6">
             {/* Practice header ... */}
             <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-6">
               <div className="flex gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                {(['facil', 'medio', 'dificil'] as const).map(d => (
                  <button key={d} onClick={() => { setDifficulty(d); generateProblem(d); }} className={`px-5 py-2 rounded-lg text-sm font-bold capitalize transition-all ${difficulty === d ? 'bg-indigo-500/20 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.3)]' : 'text-slate-500 hover:text-slate-300'}`}>
                    {d === 'facil' ? 'Fácil' : d === 'medio' ? 'Medio' : 'Difícil'}
                  </button>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button onClick={() => generateProblem(difficulty)} className="px-4 py-2 bg-slate-800 text-slate-200 rounded-full font-bold text-xs uppercase hover:bg-slate-700 border border-slate-700">Nuevo Reto</button>
                <div className="bg-slate-950 px-6 py-3 rounded-xl border border-slate-800 text-right">
                  <p className="text-xs text-slate-500 font-bold uppercase mb-1">Puntuación</p>
                  <p className="text-3xl font-black text-indigo-400 leading-none">{score.correct} <span className="text-slate-600 text-xl"> / {score.total}</span></p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-10 py-8">
              <div className="flex items-center justify-center gap-4 sm:gap-6 text-4xl sm:text-6xl font-black text-slate-100">
                <span className={practiceA > 0 ? 'text-emerald-400' : 'text-rose-400'}>{practiceA > 0 ? `+${practiceA}` : practiceA}</span>
                <span className="text-slate-600 px-2">{practiceOp === 'multiply' ? '×' : '÷'}</span>
                <span className={practiceB > 0 ? 'text-emerald-400' : 'text-rose-400'}>{practiceB > 0 ? `+${practiceB}` : practiceB}</span>
                <span className="text-slate-600 px-2">=</span>
                
                <input 
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    disabled={practiceStatus === 'correct'}
                    placeholder="?"
                    className={`w-28 sm:w-32 h-20 sm:h-24 text-center text-4xl sm:text-5xl font-black bg-slate-950 border-4 rounded-2xl outline-none transition-colors ${
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
                  className="px-10 py-4 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-full font-bold text-lg hover:from-indigo-400 hover:to-violet-400 transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] mt-4 disabled:opacity-50"
                >
                  Verificar
                </button>
              )}

              {practiceStatus === 'correct' && (
                  <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-4">
                    <p className="text-emerald-400 font-black text-2xl flex items-center gap-3 bg-emerald-500/10 px-8 py-3 rounded-full border border-emerald-500/30"><CheckCircle2 size={28} /> ¡Excelente!</p>
                    <button onClick={() => generateProblem(difficulty)} className="px-8 py-3 bg-cyan-600 text-white rounded-full font-bold hover:bg-cyan-500 transition-all shadow-lg flex items-center gap-2">Siguiente <ArrowRight size={20}/></button>
                  </motion.div>
              )}

              {practiceStatus === 'incorrect' && (
                  <motion.div initial={{ y: 5 }} animate={{ y: 0 }} className="flex flex-col items-center gap-4">
                    <p className="text-rose-400 font-black text-xl flex items-center gap-3 bg-rose-500/10 px-8 py-3 rounded-full border border-rose-500/30">Casi... Verifica la ley de los signos</p>
                    <button onClick={() => setPracticeStatus('question')} className="px-8 py-3 border border-slate-600 hover:bg-slate-800 text-slate-300 rounded-full font-bold transition-all">Reintentar</button>
                  </motion.div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
