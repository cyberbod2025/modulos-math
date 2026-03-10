import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FractionInput } from '../components/FractionInput';
import { ArrowLeft, PieChart, Compass, Brain, CheckCircle2, XSquare, ArrowRight, RefreshCw } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export default function PartWholeModule({ onBack }: Props) {
  const [mode, setMode] = useState<'explore' | 'practice'>('explore');
  const [difficulty, setDifficulty] = useState<'facil' | 'medio' | 'dificil'>('facil');
  
  const [fraction, setFraction] = useState({ num: 3, den: 4 });
  
  const [practiceAnswer, setPracticeAnswer] = useState({ num: '', den: '' });
  const [practiceStatus, setPracticeStatus] = useState<'question' | 'correct' | 'incorrect'>('question');
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const lastProblemKey = useRef('');

  const generateProblem = (diff: 'facil' | 'medio' | 'dificil') => {
    let minDen = 2, maxDen = 6;
    if (diff === 'medio') { minDen = 4; maxDen = 10; }
    if (diff === 'dificil') { minDen = 6; maxDen = 16; }

    let next = { num: 1, den: minDen };
    let key = '';

    for (let tries = 0; tries < 20; tries++) {
      const den = Math.floor(Math.random() * (maxDen - minDen + 1)) + minDen;
      const num = Math.floor(Math.random() * (den * 2)) + 1;
      key = `${num}/${den}`;
      if (key !== lastProblemKey.current || tries === 19) {
        next = { num, den };
        break;
      }
    }

    lastProblemKey.current = key;
    setFraction(next);
    setPracticeAnswer({ num: '', den: '' });
    setPracticeStatus('question');
  };

  const handleModeSwitch = (newMode: 'explore' | 'practice') => {
    setMode(newMode);
    if (newMode === 'practice') {
      setScore({ correct: 0, total: 0 });
      generateProblem(difficulty);
    } else {
      setFraction({ num: 3, den: 4 });
    }
  };

  const checkAnswer = () => {
    const pNum = parseInt(practiceAnswer.num);
    const pDen = parseInt(practiceAnswer.den);
    
    if (isNaN(pNum) || isNaN(pDen) || pDen <= 0) return;

    if (pNum === fraction.num && pDen === fraction.den) {
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
      <div className="flex flex-wrap gap-4 justify-center">
        {Array.from({ length: wholes }).map((_, wIndex) => {
          const partsInThisWhole = Math.min(den, Math.max(0, num - wIndex * den));
          return (
            <div key={wIndex} className="w-48 h-48 bg-slate-900 rounded-xl border-2 border-slate-700 overflow-hidden relative shadow-[0_0_20px_rgba(236,72,153,0.1)] p-1">
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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-pink-500/30 pb-20">
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 py-4 px-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)] sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button onClick={onBack} className="text-slate-400 hover:text-pink-400 transition-colors p-2 -ml-2">
              <ArrowLeft size={24} />
            </button>
            <div className="w-10 h-10 bg-pink-500/20 border border-pink-500 rounded-xl flex items-center justify-center text-pink-400 font-bold shadow-[0_0_15px_rgba(236,72,153,0.3)]">
              <PieChart size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-100 hidden sm:block">Parte-Todo</h1>
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700">
              <button
                onClick={() => handleModeSwitch('explore')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  mode === 'explore' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/50 shadow-[0_0_10px_rgba(236,72,153,0.2)]' : 'text-slate-400 hover:text-slate-200'
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
            <div className="mb-12 flex flex-col items-center gap-6">
              <h2 className="text-2xl font-bold text-slate-200">Define tu fracción</h2>
              <FractionInput 
                value={fraction} 
                onChange={setFraction} 
                color="text-pink-400" 
                borderColor="border-pink-500/50" 
                allowImproper
              />
            </div>

            <div className="mb-12">
              {renderFractionVisual(fraction.num, fraction.den, 'bg-pink-400 border-pink-500')}
            </div>

            <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800 max-w-2xl text-center">
              <p className="text-lg text-slate-300 leading-relaxed">
                El denominador <strong className="text-cyan-400">{fraction.den}</strong> indica que el entero se divide en {fraction.den} partes iguales.
                <br />
                El numerador <strong className="text-pink-400">{fraction.num}</strong> indica que tomamos {fraction.num} de esas partes.
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
              <h2 className="text-2xl font-black text-slate-200 mb-8">¿Qué fracción representa la imagen?</h2>
              
              <div className="mb-12">
                {renderFractionVisual(fraction.num, fraction.den, 'bg-pink-400 border-pink-500')}
              </div>

              {practiceStatus === 'question' ? (
                <div className="flex flex-col items-center gap-2 mb-8">
                  <input
                    type="number"
                    value={practiceAnswer.num}
                    onChange={(e) => setPracticeAnswer(p => ({ ...p, num: e.target.value }))}
                    className="w-24 h-20 bg-slate-950 border-2 border-slate-700 rounded-xl text-center text-4xl text-pink-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
                    placeholder="?"
                    min="0"
                  />
                  <div className="w-full h-1.5 bg-slate-700 rounded-full" />
                  <input
                    type="number"
                    value={practiceAnswer.den}
                    onChange={(e) => setPracticeAnswer(p => ({ ...p, den: e.target.value }))}
                    className="w-24 h-20 bg-slate-950 border-2 border-slate-700 rounded-xl text-center text-4xl text-pink-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
                    placeholder="?"
                    min="1"
                  />
                </div>
              ) : (
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`flex flex-col items-center text-5xl font-black mb-8 ${practiceStatus === 'correct' ? 'text-emerald-400' : 'text-rose-400'}`}
                >
                  <span className={`border-b-4 px-4 pb-2 ${practiceStatus === 'correct' ? 'border-emerald-400/50' : 'border-rose-400/50'}`}>
                    {practiceAnswer.num}
                  </span>
                  <span className="pt-2">{practiceAnswer.den}</span>
                </motion.div>
              )}

              <AnimatePresence mode="wait">
                {practiceStatus === 'question' ? (
                  <motion.button
                    key="check"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    onClick={checkAnswer}
                    disabled={!practiceAnswer.num || !practiceAnswer.den}
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
                        <><XSquare size={32} /> La respuesta correcta era {fraction.num}/{fraction.den}</>
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
