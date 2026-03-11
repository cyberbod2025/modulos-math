import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Brain, ArrowLeft, ArrowRight, CheckCircle2, Navigation, MoveHorizontal, XSquare } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export default function IntegersIntroModule({ onBack }: Props) {
  const [mode, setMode] = useState<'explore' | 'practice'>('explore');
  const [difficulty, setDifficulty] = useState<'facil' | 'medio' | 'dificil'>('facil');
  
  // Explore state
  const [exploreValue, setExploreValue] = useState<number>(0);

  // Practice state
  const [targetNumber, setTargetNumber] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [practiceStatus, setPracticeStatus] = useState<'question' | 'correct' | 'incorrect'>('question');
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const minRange = -10;
  const maxRange = 10;

  const generateProblem = (diff: 'facil' | 'medio' | 'dificil') => {
    let min = -5;
    let max = 5;
    if (diff === 'medio') { min = -10; max = 10; }
    if (diff === 'dificil') { min = -15; max = 15; }
    
    // Generate random number excluding 0 for more interesting problems
    let target = 0;
    while (target === 0) {
      target = Math.floor(Math.random() * (max - min + 1)) + min;
    }

    setTargetNumber(target);
    setUserAnswer('');
    setPracticeStatus('question');
  };

  const handleModeSwitch = (newMode: 'explore' | 'practice') => {
    setMode(newMode);
    if (newMode === 'practice') {
      setScore({ correct: 0, total: 0 });
      generateProblem(difficulty);
    }
  };

  const checkAnswer = () => {
    const num = parseInt(userAnswer);
    if (isNaN(num)) return;

    if (num === targetNumber) {
      setPracticeStatus('correct');
      setScore(s => ({ correct: s.correct + 1, total: s.total + 1 }));
    } else {
      setPracticeStatus('incorrect');
    }
  };

  // Generate ticks for explore number line
  const ticks = [];
  for (let i = minRange; i <= maxRange; i++) {
    ticks.push(i);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-orange-500/30 pb-4">
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 py-3 px-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)] sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button onClick={onBack} className="text-slate-400 hover:text-orange-400 transition-colors p-2 -ml-2 flex items-center gap-2" title="Volver al menú">
              <ArrowLeft size={24} />
              <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Menú</span>
            </button>
            <div className="w-10 h-10 bg-orange-500/20 border border-orange-500 rounded-xl flex items-center justify-center text-orange-400 font-bold shadow-[0_0_15px_rgba(249,115,22,0.3)]">
              <MoveHorizontal size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-100 hidden sm:block">Conceptos y Recta Numérica</h1>
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700">
              <button
                onClick={() => handleModeSwitch('explore')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  mode === 'explore' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50 shadow-[0_0_10px_rgba(249,115,22,0.2)]' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Compass size={16} />
                <span>Explorar</span>
              </button>
              <button
                onClick={() => handleModeSwitch('practice')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  mode === 'practice' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50 shadow-[0_0_10px_rgba(99,102,241,0.2)]' : 'text-slate-400 hover:text-slate-200'
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
          <div className="w-full max-w-4xl flex flex-col items-center gap-10">
            
            <div className="text-center space-y-4 max-w-2xl">
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400 drop-shadow-[0_0_10px_rgba(249,115,22,0.3)]">
                ¿Qué son los números enteros?
              </h2>
              <p className="text-slate-400 text-lg">
                Los números enteros incluyen los números naturales (1, 2, 3...), el cero (0) y los números negativos (-1, -2, -3...). Nos permiten representar cantidades por encima y por debajo de un punto de referencia.
              </p>
            </div>

            {/* Input Slider */}
            <div className="bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl border border-slate-800 shadow-[0_0_30px_rgba(0,0,0,0.4)] w-full flex flex-col items-center gap-6">
              <h3 className="text-sm uppercase tracking-widest font-bold text-slate-500">Mueve el deslizador o escribe un número</h3>
              
              <div className="flex items-center gap-6 text-5xl font-black">
                <input 
                  type="number"
                  value={exploreValue}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val)) {
                      setExploreValue(Math.min(Math.max(val, -15), 15));
                    }
                  }}
                  className={`w-32 text-center bg-transparent border-b-4 outline-none transition-colors ${
                    exploreValue > 0 ? 'border-orange-500 text-orange-400 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]' :
                    exploreValue < 0 ? 'border-sky-500 text-sky-400 drop-shadow-[0_0_15px_rgba(14,165,233,0.5)]' :
                    'border-slate-500 text-slate-300'
                  }`}
                />
              </div>

              <input 
                type="range" 
                min="-10" 
                max="10" 
                value={Math.max(Math.min(exploreValue, 10), -10)} // clamp for slider visually
                onChange={(e) => setExploreValue(parseInt(e.target.value))}
                className="w-full max-w-2xl h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />

              <div className="text-center h-16 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={exploreValue > 0 ? 'pos' : exploreValue < 0 ? 'neg' : 'zero'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-lg font-medium"
                  >
                    {exploreValue > 0 && (
                      <span className="text-orange-400 bg-orange-500/10 px-4 py-2 rounded-full border border-orange-500/20">
                        Los números positivos representan ganancias, temperaturas sobre cero, etc.
                      </span>
                    )}
                    {exploreValue < 0 && (
                      <span className="text-sky-400 bg-sky-500/10 px-4 py-2 rounded-full border border-sky-500/20">
                        Los números negativos representan deudas, temperaturas bajo cero, o ir hacia la izquierda/abajo.
                      </span>
                    )}
                    {exploreValue === 0 && (
                      <span className="text-slate-300 bg-slate-800 px-4 py-2 rounded-full border border-slate-700">
                        El cero (0) es el punto de origen o referencia neutral. No es ni positivo ni negativo.
                      </span>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Interactive Number Line */}
            <div className="w-full bg-slate-900/50 p-8 sm:p-12 rounded-3xl border border-slate-800 relative overflow-hidden flex items-center">
              
              {/* Line */}
              <div className="absolute left-4 right-4 h-1 bg-slate-700 top-1/2 -translate-y-1/2 rounded-full"></div>
              
              <div className="relative w-full flex justify-between items-center h-32">
                {ticks.map((tick) => {
                  const isCurrent = tick === exploreValue;
                  const isZero = tick === 0;
                  const absValue = Math.abs(tick);
                  const isPositive = tick > 0;
                  
                  return (
                    <div key={tick} className="relative flex flex-col items-center w-0">
                      {/* Tick Mark */}
                      <div className={`w-1 transition-all ${
                        isCurrent ? 'h-8 bg-white z-10' : 
                        isZero ? 'h-6 bg-slate-500' : 'h-3 bg-slate-600'
                      }`}></div>
                      
                      {/* Label */}
                      <span className={`absolute top-10 text-sm font-bold transition-all ${
                        isCurrent ? (isPositive ? 'text-orange-400 scale-150 drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]' : tick < 0 ? 'text-sky-400 scale-150 drop-shadow-[0_0_10px_rgba(14,165,233,0.8)]' : 'text-white scale-150') :
                        isZero ? 'text-slate-300 scale-110' : 'text-slate-500'
                      }`}>
                        {tick}
                      </span>
                      
                      {/* Marker Cursor */}
                      {isCurrent && (
                        <motion.div 
                          layoutId="exploreCursor"
                          className="absolute -top-10 text-white flex flex-col items-center"
                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        >
                          <Navigation className="rotate-180 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" fill="currentColor" size={24} />
                        </motion.div>
                      )}
                    </div>
                  );
                })}

                {/* Magnitude / Absolute Value Highlight */}
                {exploreValue !== 0 && exploreValue >= minRange && exploreValue <= maxRange && (
                  <motion.div 
                    layoutId="magnitudeHighlight"
                    className={`absolute top-1/2 h-2 -translate-y-1/2 rounded-full opacity-50 ${exploreValue > 0 ? 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.8)]' : 'bg-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.8)]'}`}
                    style={{
                      left: exploreValue > 0 ? '50%' : `${((exploreValue - minRange) / (maxRange - minRange)) * 100}%`,
                      width: `${(Math.abs(exploreValue) / (maxRange - minRange)) * 100}%`,
                      transformOrigin: exploreValue > 0 ? 'left' : 'right'
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
              </div>
            </div>

            <div className="w-full bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-6 justify-between">
              <div>
                <h4 className="font-bold text-slate-200">Valor Absoluto <span className="text-slate-500 text-sm font-mono ml-2">|{exploreValue}| = {Math.abs(exploreValue)}</span></h4>
                <p className="text-sm text-slate-400 mt-1 max-w-md">
                  El valor absoluto es la distancia de un número al cero, sin importar su dirección (signo). Siempre es positivo o cero.
                </p>
              </div>
              <div className="flex bg-slate-950 p-4 rounded-xl border border-slate-800 items-center justify-center font-black text-2xl w-32 shrink-0">
                {Math.abs(exploreValue)}
              </div>
            </div>

          </div>
        )}

        {mode === 'practice' && (
          <div className="w-full max-w-3xl bg-slate-900/50 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-slate-800">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-6">
               <div className="flex gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                {(['facil', 'medio', 'dificil'] as const).map(d => (
                  <button
                    key={d}
                    onClick={() => { setDifficulty(d); generateProblem(d); }}
                    className={`px-5 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                      difficulty === d 
                        ? 'bg-indigo-500/20 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.3)]' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {d === 'facil' ? 'Fácil' : d === 'medio' ? 'Medio' : 'Difícil'}
                  </button>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-right">
                <button
                  onClick={() => generateProblem(difficulty)}
                  className="px-4 py-2 bg-slate-800 text-slate-200 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-slate-700 transition-all border border-slate-700"
                >
                  Nuevo Reto
                </button>
                <div className="bg-slate-950 px-6 py-3 rounded-xl border border-slate-800">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Puntuación</p>
                  <p className="text-3xl font-black text-indigo-400 leading-none drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]">
                    {score.correct} <span className="text-slate-600 text-xl">/ {score.total}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center py-6 text-center">
              <h2 className="text-2xl font-bold text-slate-200 mb-8 border-b border-slate-800 pb-4 inline-block">
                ¿Qué número marca la recta?
              </h2>

              <div className="w-full bg-slate-950 py-12 px-8 rounded-3xl border border-slate-800 mb-10 overflow-x-auto relative">
                {/* Number Line Visual for Practice */}
                <div className="min-w-[500px] relative h-32 flex items-center justify-between">
                  <div className="absolute left-0 right-0 h-1 bg-slate-700 rounded-full"></div>
                  
                  {(() => {
                    const localMin = difficulty === 'facil' ? -5 : difficulty === 'medio' ? -10 : -15;
                    const localMax = difficulty === 'facil' ? 5 : difficulty === 'medio' ? 10 : 15;
                    const steps = [];
                    for(let i = localMin; i <= localMax; i++) steps.push(i);

                    return steps.map((tick) => (
                      <div key={tick} className="relative flex flex-col items-center w-0">
                        <div className={`w-[2px] ${tick === 0 ? 'h-6 bg-slate-400' : 'h-3 bg-slate-600'}`}></div>
                        
                        {/* Only show label for 0 to give them a reference point */}
                        {tick === 0 && (
                          <span className="absolute top-8 text-sm font-bold text-white bg-slate-800 px-2 py-0.5 rounded-full">0</span>
                        )}

                        {tick === targetNumber && (
                          <motion.div 
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1, scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.5 }}
                            className="absolute -top-10 text-rose-500 flex flex-col items-center drop-shadow-[0_0_15px_rgba(244,63,94,0.6)]"
                          >
                            <Navigation className="rotate-180" fill="currentColor" size={32} />
                          </motion.div>
                        )}
                      </div>
                    ));
                  })()}
                </div>
              </div>

              <div className="flex flex-col items-center gap-6">
                <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 p-2 rounded-2xl shadow-inner">
                  <input 
                    type="number"
                    placeholder="Escribe el número aquí"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    disabled={practiceStatus === 'correct'}
                    className={`w-64 text-center bg-slate-950 px-6 py-4 rounded-xl text-2xl font-bold outline-none border-2 transition-colors ${
                      practiceStatus === 'correct' ? 'border-emerald-500 text-emerald-400' :
                      practiceStatus === 'incorrect' ? 'border-rose-500 text-rose-400' :
                      'border-slate-700 focus:border-indigo-500'
                    }`}
                    onKeyDown={(e) => {
                      if(e.key === 'Enter' && practiceStatus === 'question') checkAnswer();
                    }}
                  />
                </div>

                {practiceStatus === 'question' && (
                  <button 
                    onClick={checkAnswer}
                    disabled={!userAnswer}
                    className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full font-bold text-lg hover:from-indigo-500 hover:to-violet-500 transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Verificar Respuesta
                  </button>
                )}

                {practiceStatus === 'correct' && (
                  <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-4">
                    <div className="text-emerald-400 font-black text-2xl flex items-center gap-2">
                      <CheckCircle2 size={32} /> ¡Exacto!
                    </div>
                    <button 
                      onClick={() => generateProblem(difficulty)}
                      className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-full font-bold transition-all shadow-lg"
                    >
                      Siguiente Número
                    </button>
                  </motion.div>
                )}

                {practiceStatus === 'incorrect' && (
                  <motion.div initial={{ y: 5 }} animate={{ y: 0 }} className="flex flex-col items-center gap-4">
                    <div className="text-rose-400 font-bold text-xl flex items-center gap-2">
                      <XSquare size={24} /> Incorrecto. Revisa de qué lado del cero está y cuenta los espacios.
                    </div>
                    <button 
                      onClick={() => setPracticeStatus('question')}
                      className="px-8 py-3 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-full font-bold transition-all"
                    >
                      Intentar de nuevo
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
