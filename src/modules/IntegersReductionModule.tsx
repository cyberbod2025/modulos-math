import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Brain, ArrowLeft, RefreshCw, Layers, MinusCircle, PlusCircle, ArrowRight, CheckCircle2, XSquare } from 'lucide-react';
import { DailyLifeUses } from '../components/DailyLifeUses';

interface Props {
  onBack: () => void;
}

export default function IntegersReductionModule({ onBack }: Props) {
  const [mode, setMode] = useState<'explore' | 'practice'>('explore');
  const [difficulty, setDifficulty] = useState<'facil' | 'medio' | 'dificil'>('facil');
  
  // Explore Mode
  const [numA, setNumA] = useState<number>(3);
  const [numB, setNumB] = useState<number>(-5);
  const [step, setStep] = useState(0); // 0: input, 1: showing tokens, 2: reduction, 3: result
  
  // Practice Mode
  const [practiceA, setPracticeA] = useState(0);
  const [practiceB, setPracticeB] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [practiceStatus, setPracticeStatus] = useState<'question' | 'correct' | 'incorrect'>('question');
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const generateProblem = (diff: 'facil' | 'medio' | 'dificil') => {
    let limit = 5;
    if (diff === 'medio') limit = 12;
    if (diff === 'dificil') limit = 25;

    let a = Math.floor(Math.random() * (limit * 2 + 1)) - limit;
    let b = Math.floor(Math.random() * (limit * 2 + 1)) - limit;
    
    // Avoid trivial 0 problems
    if (a === 0) a = 1;
    if (b === 0) b = -1;

    setPracticeA(a);
    setPracticeB(b);
    setUserAnswer('');
    setPracticeStatus('question');
  };

  const handleModeSwitch = (newMode: 'explore' | 'practice') => {
    setMode(newMode);
    if (newMode === 'practice') {
      setScore({ correct: 0, total: 0 });
      generateProblem(difficulty);
    } else {
      setStep(0);
    }
  };

  const checkPracticeAnswer = () => {
    const pAns = parseInt(userAnswer);
    if (isNaN(pAns)) return;

    if (pAns === practiceA + practiceB) {
      setPracticeStatus('correct');
      setScore(s => ({ correct: s.correct + 1, total: s.total + 1 }));
    } else {
      setPracticeStatus('incorrect');
    }
  };

  const renderTokens = (value: number, keyPrefix: string, active: boolean, annihilatedCount: number = 0) => {
    const isPositive = value > 0;
    const count = Math.abs(value);
    
    return Array.from({ length: count }).map((_, i) => {
      const isAnnihilated = i >= count - annihilatedCount;
      return (
        <motion.div
          key={`${keyPrefix}-${i}`}
          layout
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: active ? 1 : 0.8, 
            opacity: active ? (isAnnihilated ? 0 : 1) : 0.5 
          }}
          transition={{ type: "spring", delay: i * 0.05 }}
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${
            isPositive 
              ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)] border border-rose-400' 
              : 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)] border border-indigo-400'
          }`}
        >
          {isPositive ? '+' : '-'}
        </motion.div>
      );
    });
  };

  // Math logic for animation
  const isSameSign = (numA > 0 && numB > 0) || (numA < 0 && numB < 0);
  const minAbs = Math.min(Math.abs(numA), Math.abs(numB));
  const annihilatedA = !isSameSign && step >= 2 ? (Math.abs(numA) <= Math.abs(numB) ? Math.abs(numA) : minAbs) : 0;
  const annihilatedB = !isSameSign && step >= 2 ? (Math.abs(numB) <= Math.abs(numA) ? Math.abs(numB) : minAbs) : 0;
  const finalResult = numA + numB;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-rose-500/30 pb-4">
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 py-3 px-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)] sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button onClick={onBack} className="text-slate-400 hover:text-rose-400 transition-colors p-2 -ml-2 flex items-center gap-2">
              <ArrowLeft size={24} />
              <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Menú</span>
            </button>
            <div className="w-10 h-10 bg-rose-500/20 border border-rose-500 rounded-xl flex items-center justify-center text-rose-400 font-bold shadow-[0_0_15px_rgba(244,63,94,0.3)]">
              <MinusCircle size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-100 hidden sm:block">Reducción de Signos</h1>
          </div>
          
          <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700">
            <button onClick={() => handleModeSwitch('explore')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'explore' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.2)]' : 'text-slate-400 hover:text-slate-200'}`}>
              <Compass size={16} /> Explorar
            </button>
            <button onClick={() => handleModeSwitch('practice')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'practice' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50 shadow-[0_0_10px_rgba(99,102,241,0.2)]' : 'text-slate-400 hover:text-slate-200'}`}>
              <Brain size={16} /> Práctica
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 sm:p-6 flex flex-col items-center mt-4">
        
        {mode === 'explore' && (
          <div className="w-full max-w-4xl flex flex-col items-center gap-10">
            <div className="text-center space-y-4 max-w-2xl">
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-indigo-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.3)]">
                Fichas Positivas y Negativas
              </h2>
              <p className="text-slate-400 text-lg">
                Una ficha positiva (+) anula a una ficha negativa (-) formando un "cero". Observa cómo se agrupan o se destruyen al juntarse.
              </p>
            </div>

            {/* Input Form */}
            <div className="flex gap-4 sm:gap-8 bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-3xl shadow-lg w-full max-w-2xl justify-center items-center">
              <div className="flex flex-col items-center">
                <span className="text-xs uppercase font-bold text-slate-500 mb-2">Valor A</span>
                <input 
                  type="number" min="-15" max="15" value={numA}
                  onChange={e => { setNumA(parseInt(e.target.value) || 0); setStep(0); }}
                  className={`w-20 sm:w-24 h-16 sm:h-20 text-center text-3xl font-black bg-slate-950 border-2 rounded-xl outline-none transition-colors ${numA > 0 ? 'border-rose-500 text-rose-400 focus:shadow-[0_0_15px_rgba(244,63,94,0.3)]' : numA < 0 ? 'border-indigo-500 text-indigo-400 focus:shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'border-slate-600 text-slate-100'}`}
                />
              </div>
              <div className="text-4xl font-black text-slate-600">+</div>
              <div className="flex flex-col items-center">
                <span className="text-xs uppercase font-bold text-slate-500 mb-2">Valor B</span>
                <input 
                  type="number" min="-15" max="15" value={numB}
                  onChange={e => { setNumB(parseInt(e.target.value) || 0); setStep(0); }}
                  className={`w-20 sm:w-24 h-16 sm:h-20 text-center text-3xl font-black bg-slate-950 border-2 rounded-xl outline-none transition-colors ${numB > 0 ? 'border-rose-500 text-rose-400 focus:shadow-[0_0_15px_rgba(244,63,94,0.3)]' : numB < 0 ? 'border-indigo-500 text-indigo-400 focus:shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'border-slate-600 text-slate-100'}`}
                />
              </div>
            </div>

            {/* Visualization Stage */}
            <div className="w-full bg-slate-900/50 p-6 sm:p-10 rounded-3xl border border-slate-800 min-h-[300px] flex flex-col items-center shadow-[0_0_30px_rgba(0,0,0,0.4)]">
              
              <div className="flex justify-between items-center w-full max-w-2xl text-center font-bold text-2xl text-slate-400 mb-8 h-12">
                <motion.div animate={{ opacity: step >= 1 ? 1 : 0.3 }} className="w-1/3">
                  {numA}
                </motion.div>
                <motion.div animate={{ opacity: step >= 1 ? 1 : 0.3 }} className="w-1/3">
                  +
                </motion.div>
                <motion.div animate={{ opacity: step >= 1 ? 1 : 0.3 }} className="w-1/3">
                  {numB}
                </motion.div>
              </div>

              {step === 0 && (
                <div className="h-40 flex items-center justify-center text-slate-500 font-mono">Presiona "Visualizar"</div>
              )}

              {step >= 1 && (
                <div className="relative w-full max-w-2xl flex flex-col gap-6 items-center flex-1">
                  
                  {step <= 2 && (
                    <div className="flex w-full justify-between relative h-40">
                      {/* Section A */}
                      <motion.div 
                        animate={{ x: step === 2 ? 100 : 0 }} 
                        className="w-1/2 flex flex-wrap content-start gap-2 justify-end pr-4"
                      >
                        {renderTokens(numA, 'a', true, annihilatedA)}
                      </motion.div>
                      
                      {/* Section B */}
                      <motion.div 
                        animate={{ x: step === 2 ? -100 : 0 }} 
                        className="w-1/2 flex flex-wrap content-start gap-2 justify-start pl-4"
                      >
                        {renderTokens(numB, 'b', true, annihilatedB)}
                      </motion.div>
                    </div>
                  )}

                  {step === 3 && (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex flex-col items-center gap-6"
                    >
                      <div className="flex flex-wrap gap-2 justify-center max-w-sm">
                        {renderTokens(finalResult, 'res', true)}
                        {finalResult === 0 && <span className="text-3xl font-black text-slate-400">0 Fichas. Anulación Total.</span>}
                      </div>

                      <div className={`text-5xl font-black py-4 px-12 rounded-2xl border-2 shadow-[0_0_30px_rgba(0,0,0,0.5)] ${finalResult > 0 ? 'bg-rose-500/10 border-rose-500 text-rose-400' : finalResult < 0 ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-slate-800 border-slate-600 text-slate-200'}`}>
                        {finalResult > 0 ? `+${finalResult}` : finalResult}
                      </div>

                      <div className="text-slate-400 text-center max-w-md">
                        {isSameSign 
                         ? "Al tener el mismo signo, las fichas se suman en cantidad manteniendo su naturaleza."
                         : `Al tener diferentes signos, los pares (+ y -) se neutralizaron. Quedaron las fichas del número de mayor valor absoluto.`}
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

            </div>

             {/* Controls */}
             <div className="flex flex-wrap justify-center gap-4 mt-2 w-full max-w-md">
              <button onClick={() => setStep(0)} className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 border border-slate-700 text-slate-300 rounded-full font-bold hover:bg-slate-700 transition-all">
                <RefreshCw size={18} /> Reiniciar
              </button>

              {step < 3 && (
                <button
                  onClick={() => setStep(s => s + 1)}
                  className="flex-[2] min-w-[160px] flex items-center justify-center gap-2 px-8 py-3 bg-rose-600 text-white rounded-full font-bold hover:bg-rose-500 transition-all shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:shadow-[0_0_30px_rgba(244,63,94,0.6)]"
                >
                  {step === 0 ? 'Visualizar' : step === 1 ? 'Agrupar y Reducir' : 'Ver Resultado'}
                  <ArrowRight size={18} />
                </button>
              )}
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
                  <p className="text-3xl font-black text-indigo-400 leading-none">{score.correct} <span className="text-slate-600 text-xl">/ {score.total}</span></p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-10 py-8">
              <div className="flex items-center justify-center gap-4 sm:gap-6 text-4xl sm:text-6xl font-black text-slate-100">
                <span className={practiceA > 0 ? 'text-rose-400' : 'text-indigo-400'}>{practiceA > 0 ? `+${practiceA}` : practiceA}</span>
                <span className="text-slate-600 px-2">+</span>
                <span className={practiceB > 0 ? 'text-rose-400' : 'text-indigo-400'}>{practiceB > 0 ? `+${practiceB}` : practiceB}</span>
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
                    <p className="text-emerald-400 font-black text-2xl flex items-center gap-3 bg-emerald-500/10 px-8 py-3 rounded-full border border-emerald-500/30"><CheckCircle2 size={28} /> ¡Bien hecho!</p>
                    <button onClick={() => generateProblem(difficulty)} className="px-8 py-3 bg-cyan-600 text-white rounded-full font-bold hover:bg-cyan-500 transition-all shadow-lg flex items-center gap-2">Siguiente <ArrowRight size={20}/></button>
                  </motion.div>
              )}

              {practiceStatus === 'incorrect' && (
                  <motion.div initial={{ y: 5 }} animate={{ y: 0 }} className="flex flex-col items-center gap-4">
                    <p className="text-rose-400 font-black text-xl flex items-center gap-3 bg-rose-500/10 px-8 py-3 rounded-full border border-rose-500/30">Casi... ¡La reducción falló!</p>
                    <button onClick={() => setPracticeStatus('question')} className="px-8 py-3 border border-slate-600 hover:bg-slate-800 text-slate-300 rounded-full font-bold transition-all">Reintentar</button>
                  </motion.div>
              )}
            </div>
          </div>
        )}

              <DailyLifeUses uses={[
    { title: "Finanzas Personales", description: "Cada que recibes tu salario o mesada (positivo) y pagas un servicio o comida (negativo), tu saldo bancario hace una reducción de números enteros." },
    { title: "Puntuación en Videojuegos", description: "Ganas +500 puntos por completar un nivel, pero si fallas te penalizan con -200 puntos. Tu puntaje total es la suma matemática de ambos enteros." }
  ]} />
      </main>
    </div>
  );
}
