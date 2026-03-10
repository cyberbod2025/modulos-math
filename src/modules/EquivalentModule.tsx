import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FractionInput } from '../components/FractionInput';
import { ArrowLeft, Equal, Compass, Brain, CheckCircle2, XSquare, ArrowRight, RefreshCw } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export default function EquivalentModule({ onBack }: Props) {
  const [mode, setMode] = useState<'explore' | 'practice'>('explore');
  const [difficulty, setDifficulty] = useState<'facil' | 'medio' | 'dificil'>('facil');
  
  const [fractionA, setFractionA] = useState({ num: 1, den: 2 });
  const [multiplier, setMultiplier] = useState(2);
  
  const [practiceProblem, setPracticeProblem] = useState({
    numA: 1, denA: 2, numB: 2, denB: 4, missing: 'numB'
  });
  const [practiceAnswer, setPracticeAnswer] = useState('');
  const [practiceStatus, setPracticeStatus] = useState<'question' | 'correct' | 'incorrect'>('question');
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const generateProblem = (diff: 'facil' | 'medio' | 'dificil') => {
    let minDen = 2, maxDen = 5;
    let maxMult = 3;
    if (diff === 'medio') { minDen = 3; maxDen = 8; maxMult = 5; }
    if (diff === 'dificil') { minDen = 4; maxDen = 12; maxMult = 8; }
    
    const denA = Math.floor(Math.random() * (maxDen - minDen + 1)) + minDen;
    const numA = Math.floor(Math.random() * (denA - 1)) + 1; 
    const mult = Math.floor(Math.random() * (maxMult - 2 + 1)) + 2;
    
    const numB = numA * mult;
    const denB = denA * mult;
    
    const missingOptions = ['numA', 'denA', 'numB', 'denB'];
    const missing = missingOptions[Math.floor(Math.random() * missingOptions.length)];
    
    setPracticeProblem({ numA, denA, numB, denB, missing });
    setPracticeAnswer('');
    setPracticeStatus('question');
  };

  const handleModeSwitch = (newMode: 'explore' | 'practice') => {
    setMode(newMode);
    if (newMode === 'practice') {
      setScore({ correct: 0, total: 0 });
      generateProblem(difficulty);
    } else {
      setFractionA({ num: 1, den: 2 });
      setMultiplier(2);
    }
  };

  const checkAnswer = () => {
    const ans = parseInt(practiceAnswer);
    if (isNaN(ans)) return;
    
    let isCorrect = false;
    if (practiceProblem.missing === 'numA' && ans === practiceProblem.numA) isCorrect = true;
    if (practiceProblem.missing === 'denA' && ans === practiceProblem.denA) isCorrect = true;
    if (practiceProblem.missing === 'numB' && ans === practiceProblem.numB) isCorrect = true;
    if (practiceProblem.missing === 'denB' && ans === practiceProblem.denB) isCorrect = true;

    if (isCorrect) {
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30 pb-20">
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 py-4 px-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)] sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button onClick={onBack} className="text-slate-400 hover:text-emerald-400 transition-colors p-2 -ml-2">
              <ArrowLeft size={24} />
            </button>
            <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-500 rounded-xl flex items-center justify-center text-emerald-400 font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Equal size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-100 hidden sm:block">Equivalentes</h1>
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700">
              <button
                onClick={() => handleModeSwitch('explore')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  mode === 'explore' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'text-slate-400 hover:text-slate-200'
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
                  color="text-emerald-400" 
                  borderColor="border-emerald-500/50" 
                />
                {renderFractionVisual(fractionA.num, fractionA.den, 'bg-emerald-400 border-emerald-500')}
              </div>

              <div className="flex flex-col items-center gap-4">
                <span className="text-6xl font-black text-slate-400 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">=</span>
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center gap-2">
                  <span className="text-sm text-slate-400 font-bold uppercase tracking-wider">Multiplicador</span>
                  <input 
                    type="range" 
                    min="1" 
                    max="5" 
                    value={multiplier} 
                    onChange={(e) => setMultiplier(parseInt(e.target.value))}
                    className="w-32 accent-emerald-500"
                  />
                  <span className="text-xl font-black text-emerald-400">× {multiplier}</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-6">
                <div className="text-4xl font-black text-cyan-400 flex flex-col items-center">
                  <span className="border-b-4 border-cyan-400/50 px-4 pb-2">{fractionA.num * multiplier}</span>
                  <span className="pt-2">{fractionA.den * multiplier}</span>
                </div>
                {renderFractionVisual(fractionA.num * multiplier, fractionA.den * multiplier, 'bg-cyan-400 border-cyan-500')}
              </div>
            </div>

            <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800 max-w-2xl text-center">
              <p className="text-lg text-slate-300 leading-relaxed">
                Las fracciones equivalentes representan la misma cantidad.
                <br />
                Si multiplicas (o divides) el numerador y el denominador por el mismo número, obtienes una fracción equivalente.
              </p>
            </div>
          </div>
        )}

        {mode === 'practice' && (
          <div className="w-full max-w-3xl flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-8 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-lg">
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
              <div className="text-slate-300 font-bold flex items-center gap-2">
                <span className="text-sm uppercase tracking-wider text-slate-500">Puntuación:</span>
                <span className="text-xl text-emerald-400">{score.correct}</span>
                <span className="text-slate-600">/</span>
                <span className="text-xl">{score.total}</span>
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl p-8 sm:p-12 w-full flex flex-col items-center shadow-[0_0_50px_rgba(0,0,0,0.3)]">
              <h2 className="text-2xl font-black text-slate-200 mb-8">Encuentra el valor faltante</h2>
              
              <div className="flex items-center justify-center gap-8 sm:gap-16 mb-12 w-full text-5xl font-black">
                <div className="flex flex-col items-center text-emerald-400">
                  {practiceProblem.missing === 'numA' ? (
                    <input
                      type="number"
                      value={practiceAnswer}
                      onChange={(e) => setPracticeAnswer(e.target.value)}
                      className="w-24 h-16 bg-slate-950 border-2 border-slate-700 rounded-xl text-center text-4xl text-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all mb-2"
                      placeholder="?"
                    />
                  ) : (
                    <span className="border-b-4 border-emerald-400/50 px-4 pb-2 mb-2">{practiceProblem.numA}</span>
                  )}
                  
                  {practiceProblem.missing === 'denA' ? (
                    <input
                      type="number"
                      value={practiceAnswer}
                      onChange={(e) => setPracticeAnswer(e.target.value)}
                      className="w-24 h-16 bg-slate-950 border-2 border-slate-700 rounded-xl text-center text-4xl text-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                      placeholder="?"
                    />
                  ) : (
                    <span>{practiceProblem.denA}</span>
                  )}
                </div>

                <span className="text-slate-600">=</span>

                <div className="flex flex-col items-center text-cyan-400">
                  {practiceProblem.missing === 'numB' ? (
                    <input
                      type="number"
                      value={practiceAnswer}
                      onChange={(e) => setPracticeAnswer(e.target.value)}
                      className="w-24 h-16 bg-slate-950 border-2 border-slate-700 rounded-xl text-center text-4xl text-cyan-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all mb-2"
                      placeholder="?"
                    />
                  ) : (
                    <span className="border-b-4 border-cyan-400/50 px-4 pb-2 mb-2">{practiceProblem.numB}</span>
                  )}
                  
                  {practiceProblem.missing === 'denB' ? (
                    <input
                      type="number"
                      value={practiceAnswer}
                      onChange={(e) => setPracticeAnswer(e.target.value)}
                      className="w-24 h-16 bg-slate-950 border-2 border-slate-700 rounded-xl text-center text-4xl text-cyan-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                      placeholder="?"
                    />
                  ) : (
                    <span>{practiceProblem.denB}</span>
                  )}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {practiceStatus === 'question' ? (
                  <motion.button
                    key="check"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    onClick={checkAnswer}
                    disabled={!practiceAnswer}
                    className="px-10 py-4 bg-purple-600 text-white rounded-full font-bold text-lg hover:bg-purple-500 transition-all shadow-[0_0_20px_rgba(147,51,234,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 active:translate-y-0"
                  >
                    Comprobar Respuesta
                  </motion.button>
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
