import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FractionInput } from '../components/FractionInput';
import { ArrowLeft, ArrowLeftRight, Compass, Brain, CheckCircle2, XSquare, ArrowRight, RefreshCw } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export default function CompareModule({ onBack }: Props) {
  const [mode, setMode] = useState<'explore' | 'practice'>('explore');
  const [difficulty, setDifficulty] = useState<'facil' | 'medio' | 'dificil'>('facil');
  
  const [fractionA, setFractionA] = useState({ num: 1, den: 2 });
  const [fractionB, setFractionB] = useState({ num: 1, den: 3 });
  
  const [practiceStatus, setPracticeStatus] = useState<'question' | 'correct' | 'incorrect'>('question');
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const lastProblemKey = useRef('');

  const generateProblem = (diff: 'facil' | 'medio' | 'dificil') => {
    let minDen = 2, maxDen = 6;
    if (diff === 'medio') { minDen = 3; maxDen = 9; }
    if (diff === 'dificil') { minDen = 5; maxDen = 15; }

    let nextA = { num: 1, den: minDen };
    let nextB = { num: 1, den: minDen };
    let key = '';

    for (let tries = 0; tries < 20; tries++) {
      const denA = Math.floor(Math.random() * (maxDen - minDen + 1)) + minDen;
      const numA = Math.floor(Math.random() * denA) + 1;

      const denB = Math.floor(Math.random() * (maxDen - minDen + 1)) + minDen;
      const numB = Math.floor(Math.random() * denB) + 1;

      key = `${numA}/${denA}|${numB}/${denB}`;
      if (key !== lastProblemKey.current || tries === 19) {
        nextA = { num: numA, den: denA };
        nextB = { num: numB, den: denB };
        break;
      }
    }

    lastProblemKey.current = key;
    setFractionA(nextA);
    setFractionB(nextB);
    setPracticeStatus('question');
  };

  const handleModeSwitch = (newMode: 'explore' | 'practice') => {
    setMode(newMode);
    if (newMode === 'practice') {
      setScore({ correct: 0, total: 0 });
      generateProblem(difficulty);
    } else {
      setFractionA({ num: 1, den: 2 });
      setFractionB({ num: 1, den: 3 });
    }
  };

  const checkAnswer = (answer: '<' | '=' | '>') => {
    const valA = fractionA.num / fractionA.den;
    const valB = fractionB.num / fractionB.den;
    let correct = '=';
    if (valA < valB) correct = '<';
    if (valA > valB) correct = '>';

    if (answer === correct) {
      setPracticeStatus('correct');
      setScore(s => ({ ...s, correct: s.correct + 1, total: s.total + 1 }));
    } else {
      setPracticeStatus('incorrect');
      setScore(s => ({ ...s, total: s.total + 1 }));
    }
  };

  const renderFractionVisual = (num: number, den: number, color: string) => {
    const wholes = Math.max(1, Math.ceil(num / den));
    return (
      <div className="flex flex-wrap gap-2 justify-center">
        {Array.from({ length: wholes }).map((_, wIndex) => {
          const partsInThisWhole = Math.min(den, Math.max(0, num - wIndex * den));
          return (
            <div key={wIndex} className="w-32 h-32 bg-slate-900 rounded-xl border-2 border-slate-700 overflow-hidden relative shadow-lg p-1">
              <div className="grid gap-1 w-full h-full" style={{
                gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(den))}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${Math.ceil(den / Math.ceil(Math.sqrt(den)))}, minmax(0, 1fr))`
              }}>
                {Array.from({ length: den }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className={`rounded-sm border ${i < partsInThisWhole ? color : 'bg-slate-800/50 border-slate-700'}`}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const getComparisonSymbol = () => {
    const valA = fractionA.num / fractionA.den;
    const valB = fractionB.num / fractionB.den;
    if (valA < valB) return '<';
    if (valA > valB) return '>';
    return '=';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-yellow-500/30 pb-20">
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 py-4 px-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)] sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button onClick={onBack} className="text-slate-400 hover:text-yellow-400 transition-colors p-2 -ml-2">
              <ArrowLeft size={24} />
            </button>
            <div className="w-10 h-10 bg-yellow-500/20 border border-yellow-500 rounded-xl flex items-center justify-center text-yellow-400 font-bold shadow-[0_0_15px_rgba(234,179,8,0.3)]">
              <ArrowLeftRight size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-100 hidden sm:block">Comparación</h1>
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700">
              <button
                onClick={() => handleModeSwitch('explore')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  mode === 'explore' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.2)]' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Compass size={16} />
                <span>Explorar</span>
              </button>
              <button
                onClick={() => handleModeSwitch('practice')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  mode === 'practice' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.2)]' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Brain size={16} />
                <span>Práctica</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 sm:p-6 flex flex-col items-center mt-4">
        {mode === 'explore' && (
          <div className="w-full max-w-4xl bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl p-6 sm:p-10 flex flex-col items-center shadow-[0_0_50px_rgba(0,0,0,0.3)]">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 mb-12 w-full">
              <div className="flex flex-col items-center gap-6">
                <FractionInput 
                  value={fractionA} 
                  onChange={setFractionA} 
                  color="text-yellow-400" 
                  borderColor="border-yellow-500/50" 
                  allowImproper
                />
                {renderFractionVisual(fractionA.num, fractionA.den, 'bg-yellow-400 border-yellow-500')}
              </div>

              <div className="text-6xl font-black text-slate-400 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                {getComparisonSymbol()}
              </div>

              <div className="flex flex-col items-center gap-6">
                <FractionInput 
                  value={fractionB} 
                  onChange={setFractionB} 
                  color="text-cyan-400" 
                  borderColor="border-cyan-500/50" 
                  allowImproper
                />
                {renderFractionVisual(fractionB.num, fractionB.den, 'bg-cyan-400 border-cyan-500')}
              </div>
            </div>

            <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800 max-w-2xl text-center">
              <p className="text-lg text-slate-300 leading-relaxed">
                Para comparar fracciones, puedes observar qué figura tiene una mayor porción coloreada.
                <br />
                Matemáticamente, puedes multiplicar en cruz: <strong className="text-yellow-400">{fractionA.num} × {fractionB.den} = {fractionA.num * fractionB.den}</strong> y <strong className="text-cyan-400">{fractionB.num} × {fractionA.den} = {fractionB.num * fractionA.den}</strong>.
              </p>
            </div>
          </div>
        )}

        {mode === 'practice' && (
          <div className="w-full max-w-3xl flex flex-col items-center">
            <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-lg">
              <div className="flex gap-2">
                {['facil', 'medio', 'dificil'].map((d) => (
                  <button
                    key={d}
                    onClick={() => { setDifficulty(d as any); generateProblem(d as any); }}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                      difficulty === d 
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => generateProblem(difficulty)}
                  className="px-4 py-2 bg-slate-800 text-slate-200 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-slate-700 transition-all border border-slate-700"
                >
                  Nueva Práctica
                </button>
                <div className="text-slate-300 font-bold flex items-center gap-2">
                  <span className="text-sm uppercase tracking-wider text-slate-500">Puntuación:</span>
                  <span className="text-xl text-emerald-400">{score.correct}</span>
                  <span className="text-slate-600">/</span>
                  <span className="text-xl">{score.total}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl p-8 sm:p-12 w-full flex flex-col items-center shadow-[0_0_50px_rgba(0,0,0,0.3)]">
              <h2 className="text-2xl font-black text-slate-200 mb-8">Compara las fracciones</h2>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 mb-12 w-full">
                <div className="flex flex-col items-center gap-6">
                  <div className="text-4xl font-black text-yellow-400 flex flex-col items-center">
                    <span className="border-b-4 border-yellow-400/50 px-4 pb-2">{fractionA.num}</span>
                    <span className="pt-2">{fractionA.den}</span>
                  </div>
                  {difficulty !== 'dificil' && renderFractionVisual(fractionA.num, fractionA.den, 'bg-yellow-400 border-yellow-500')}
                </div>

                <div className="text-6xl font-black text-slate-600">
                  {practiceStatus === 'question' ? '?' : getComparisonSymbol()}
                </div>

                <div className="flex flex-col items-center gap-6">
                  <div className="text-4xl font-black text-cyan-400 flex flex-col items-center">
                    <span className="border-b-4 border-cyan-400/50 px-4 pb-2">{fractionB.num}</span>
                    <span className="pt-2">{fractionB.den}</span>
                  </div>
                  {difficulty !== 'dificil' && renderFractionVisual(fractionB.num, fractionB.den, 'bg-cyan-400 border-cyan-500')}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {practiceStatus === 'question' ? (
                  <motion.div
                    key="buttons"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex gap-4"
                  >
                    {['<', '=', '>'].map((sym) => (
                      <button
                        key={sym}
                        onClick={() => checkAnswer(sym as any)}
                        className="w-16 h-16 bg-purple-600 text-white rounded-2xl font-black text-3xl hover:bg-purple-500 transition-all shadow-[0_0_20px_rgba(147,51,234,0.4)] transform hover:-translate-y-1 active:translate-y-0"
                      >
                        {sym}
                      </button>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-6"
                  >
                    <div className={`flex items-center gap-3 text-2xl font-black ${practiceStatus === 'correct' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {practiceStatus === 'correct' ? (
                        <><CheckCircle2 size={32} /> ¡Excelente!</>
                      ) : (
                        <><XSquare size={32} /> Incorrecto</>
                      )}
                    </div>
                    <button
                      onClick={() => generateProblem(difficulty)}
                      className="px-8 py-3 bg-slate-800 text-slate-200 rounded-full font-bold hover:bg-slate-700 transition-all flex items-center gap-2 border border-slate-700"
                    >
                      Siguiente Problema <ArrowRight size={18} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
