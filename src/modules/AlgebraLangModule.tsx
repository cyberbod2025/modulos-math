import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Brain, ArrowLeft, RefreshCw, Variable, CheckCircle2, ArrowRight } from 'lucide-react';

interface Props {
  onBack: () => void;
}

const PHRASES = [
  { text: "Un número cualquiera", expr: "x" },
  { text: "El doble de un número", expr: "2x" },
  { text: "El triple de un número", expr: "3x" },
  { text: "La mitad de un número", expr: "x/2" },
  { text: "Un número aumentado en cinco", expr: "x + 5" },
  { text: "Un número disminuido en tres", expr: "x - 3" },
  { text: "El cuadrado de un número", expr: "x²" },
  { text: "El cubo de un número", expr: "x³" },
  { text: "La suma de dos números", expr: "x + y" }
];

export default function AlgebraLangModule({ onBack }: Props) {
  const [mode, setMode] = useState<'explore' | 'practice'>('explore');
  const [difficulty, setDifficulty] = useState<'facil' | 'medio'>('facil');
  
  // Explore Mode
  const [showPhraseIndex, setShowPhraseIndex] = useState(0);
  const [xValue, setXValue] = useState(2);
  const [yValue, setYValue] = useState(3);

  // Practice Mode
  const [practicePhrase, setPracticePhrase] = useState('');
  const [correctExpr, setCorrectExpr] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [practiceStatus, setPracticeStatus] = useState<'question' | 'correct' | 'incorrect'>('question');
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const evaluateExpression = (expr: string) => {
    try {
      if (expr === 'x') return xValue;
      if (expr === '2x') return 2 * xValue;
      if (expr === '3x') return 3 * xValue;
      if (expr === 'x/2') return xValue / 2;
      if (expr === 'x + 5') return xValue + 5;
      if (expr === 'x - 3') return xValue - 3;
      if (expr === 'x²') return Math.pow(xValue, 2);
      if (expr === 'x³') return Math.pow(xValue, 3);
      if (expr === 'x + y') return xValue + yValue;
      return '?';
    } catch {
      return '?';
    }
  };

  const generateProblem = () => {
    const item = PHRASES[Math.floor(Math.random() * PHRASES.length)];
    setPracticePhrase(item.text);
    setCorrectExpr(item.expr);
    
    // Generate distractors
    const allExpr = PHRASES.map(p => p.expr);
    let distractors = allExpr.filter(e => e !== item.expr).sort(() => Math.random() - 0.5).slice(0, 3);
    
    const finalOptions = [item.expr, ...distractors].sort(() => Math.random() - 0.5);
    setOptions(finalOptions);
    setPracticeStatus('question');
  };

  const handleModeSwitch = (newMode: 'explore' | 'practice') => {
    setMode(newMode);
    if (newMode === 'practice') {
      setScore({ correct: 0, total: 0 });
      generateProblem();
    }
  };

  const handleOptionClick = (opt: string) => {
    if (practiceStatus !== 'question') return;
    
    if (opt === correctExpr) {
      setPracticeStatus('correct');
      setScore(s => ({ correct: s.correct + 1, total: s.total + 1 }));
    } else {
      setPracticeStatus('incorrect');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-fuchsia-500/30 pb-4 flex flex-col items-center">
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 py-3 px-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)] w-full sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button onClick={onBack} className="text-slate-400 hover:text-fuchsia-400 transition-colors p-2 -ml-2 flex items-center gap-2">
              <ArrowLeft size={24} />
              <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Menú</span>
            </button>
            <div className="w-10 h-10 bg-fuchsia-500/20 border border-fuchsia-500 rounded-xl flex items-center justify-center text-fuchsia-400 font-bold shadow-[0_0_15px_rgba(217,70,239,0.3)]">
              <Variable size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-100 hidden sm:block">Lenguaje Algebraico</h1>
          </div>
          
          <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700">
            <button onClick={() => handleModeSwitch('explore')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'explore' ? 'bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/50 shadow-[0_0_10px_rgba(217,70,239,0.2)]' : 'text-slate-400 hover:text-slate-200'}`}>
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
          <div className="w-full flex md:flex-row flex-col gap-6 items-start">
            
            {/* Sidebar with List */}
            <div className="w-full md:w-1/3 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2 shadow-[0_0_20px_rgba(0,0,0,0.4)] h-[70vh] overflow-y-auto">
               <h3 className="text-sm uppercase font-bold text-slate-500 mb-2 pl-2">Glosario Algebraico</h3>
               {PHRASES.map((p, i) => (
                 <button 
                  key={i} 
                  onClick={() => setShowPhraseIndex(i)}
                  className={`text-left p-3 rounded-xl transition-all ${showPhraseIndex === i ? 'bg-fuchsia-500/20 border border-fuchsia-500 text-fuchsia-300 shadow-[0_0_10px_rgba(217,70,239,0.2)]' : 'bg-slate-950 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
                 >
                   {p.text}
                 </button>
               ))}
            </div>

            {/* Main view */}
            <div className="w-full md:w-2/3 flex flex-col gap-6">
              
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center min-h-[300px]">
                <div className="text-xl sm:text-2xl text-slate-400 text-center mb-6">
                  "{PHRASES[showPhraseIndex].text}"
                </div>

                <motion.div 
                  key={showPhraseIndex}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-6xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-indigo-400 drop-shadow-[0_0_20px_rgba(217,70,239,0.4)] tracking-wider"
                >
                  {PHRASES[showPhraseIndex].expr}
                </motion.div>
              </div>

              {/* Evaluator */}
              <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col gap-6">
                <h3 className="text-lg font-bold text-slate-300 flex items-center gap-2">
                  <RefreshCw size={20} className="text-fuchsia-400" /> Evaluación de Expresiones
                </h3>
                <p className="text-sm text-slate-400">¿Qué pasa si le damos un valor numérico a las variables?</p>
                
                <div className="flex flex-col sm:flex-row gap-6 items-center w-full justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
                  
                  <div className="flex gap-4">
                     <div className="flex flex-col items-center gap-2">
                       <span className="text-fuchsia-400 font-bold">x =</span>
                       <input 
                         type="number" value={xValue} onChange={e => setXValue(parseInt(e.target.value) || 0)}
                         className="w-16 h-12 text-center bg-slate-800 border border-slate-600 rounded-lg text-xl font-bold focus:border-fuchsia-500 focus:text-fuchsia-400 outline-none"
                       />
                     </div>
                     
                     {PHRASES[showPhraseIndex].expr.includes('y') && (
                        <div className="flex flex-col items-center gap-2">
                         <span className="text-indigo-400 font-bold">y =</span>
                         <input 
                           type="number" value={yValue} onChange={e => setYValue(parseInt(e.target.value) || 0)}
                           className="w-16 h-12 text-center bg-slate-800 border border-slate-600 rounded-lg text-xl font-bold focus:border-indigo-500 focus:text-indigo-400 outline-none"
                         />
                       </div>
                     )}
                  </div>

                  <div className="text-3xl font-black text-slate-500">=</div>

                  <div className="bg-emerald-500/10 border border-emerald-500 text-emerald-400 px-8 py-4 rounded-xl text-4xl font-black shadow-[0_0_15px_rgba(16,185,129,0.3)] min-w-[120px] text-center">
                    {evaluateExpression(PHRASES[showPhraseIndex].expr)}
                  </div>

                </div>
              </div>

            </div>

          </div>
        )}

        {mode === 'practice' && (
          <div className="w-full max-w-3xl bg-slate-900/50 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-slate-800 mb-6 flex flex-col items-center">
            
            <div className="flex flex-col sm:flex-row justify-between w-full items-center mb-8 gap-6">
              <span className="text-indigo-400 font-bold text-lg">Traduce a Lenguaje Algebraico</span>
              <div className="bg-slate-950 px-6 py-3 rounded-xl border border-slate-800 text-right">
                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Puntuación</p>
                <p className="text-3xl font-black text-indigo-400 leading-none">{score.correct} <span className="text-slate-600 text-xl">/ {score.total}</span></p>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 w-full p-8 rounded-2xl mb-8 flex justify-center text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-200">"{practicePhrase}"</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
               {options.map((opt, i) => (
                 <button
                   key={i}
                   onClick={() => handleOptionClick(opt)}
                   disabled={practiceStatus !== 'question'}
                   className={`p-6 rounded-2xl text-3xl font-black border-2 transition-all ${
                    practiceStatus === 'question' ? 'bg-slate-800 border-slate-700 hover:border-indigo-500 hover:bg-slate-700 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]' :
                    practiceStatus !== 'question' && opt === correctExpr ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]' :
                    practiceStatus === 'incorrect' && opt !== correctExpr ? 'bg-slate-900 border-slate-800 opacity-50' : 'bg-slate-800 border-slate-700'
                   }`}
                 >
                   {opt}
                 </button>
               ))}
            </div>

            <AnimatePresence>
               {practiceStatus !== 'question' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="mt-8 flex flex-col items-center gap-4"
                  >
                    {practiceStatus === 'correct' ? (
                       <p className="text-emerald-400 font-black text-2xl flex items-center gap-3"><CheckCircle2/> ¡Correcto!</p>
                    ) : (
                       <p className="text-rose-400 font-black text-xl flex items-center gap-3">Incorrecto, la respuesta correcta era: {correctExpr}</p>
                    )}
                    <button onClick={generateProblem} className="mt-2 px-8 py-3 bg-cyan-600 text-white rounded-full font-bold hover:bg-cyan-500 transition-all shadow-lg flex items-center gap-2">Siguiente <ArrowRight size={20}/></button>
                  </motion.div>
               )}
            </AnimatePresence>

          </div>
        )}

      </main>
    </div>
  );
}
