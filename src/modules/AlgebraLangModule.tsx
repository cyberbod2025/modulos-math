import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Brain, ArrowLeft, RefreshCw, Layers, Cpu, ArrowDown } from 'lucide-react';

interface Props {
  onBack: () => void;
}

const GLOSSARY = [
  { text: "Un número cualquiera", expr: "x" },
  { text: "El doble de un número", expr: "2x" },
  { text: "La mitad de un número", expr: "x / 2" },
  { text: "Un número aumentado en 5", expr: "x + 5" },
  { text: "Un número disminuido en 3", expr: "x - 3" },
  { text: "El triple de un número aumentado en 1", expr: "3x + 1" },
];

const PIPELINES = [
  { id: '2x', name: "El Doble", ops: [{ label: 'Multiplicar por 2', math: (x:number) => x*2 }] },
  { id: 'x+5', name: "Aumentado en 5", ops: [{ label: 'Sumar 5', math: (x:number) => x+5 }] },
  { id: '3x+1', name: "Triple más 1", ops: [{ label: 'Multiplicar por 3', math: (x:number) => x*3 }, { label: 'Sumar 1', math: (x:number) => x+1 }] },
  { id: 'x/2-3', name: "Mitad menos 3", ops: [{ label: 'Dividir entre 2', math: (x:number) => x/2 }, { label: 'Restar 3', math: (x:number) => x-3 }] },
];

export default function AlgebraLangModule({ onBack }: Props) {
  const [mode, setMode] = useState<'explore' | 'practice'>('explore');

  // EXPLORE MODE
  const [pipeIndex, setPipeIndex] = useState(2);
  const [xVal, setXVal] = useState(4);
  const [machineState, setMachineState] = useState<'idle' | 'running' | 'done'>('idle');
  const [currentValue, setCurrentValue] = useState<number | null>(null);
  const [stepIndex, setStepIndex] = useState(-1);

  const runMachine = () => {
    if (machineState === 'running') return;
    setMachineState('running');
    setCurrentValue(xVal);
    setStepIndex(-1);

    const pipeline = PIPELINES[pipeIndex];
    let val = xVal;
    
    // Animate through stations
    pipeline.ops.forEach((op, idx) => {
      setTimeout(() => {
        setStepIndex(idx);
        val = op.math(val);
        setCurrentValue(val);
      }, (idx + 1) * 1500); // 1.5s per station
    });

    setTimeout(() => {
      setMachineState('done');
      setStepIndex(pipeline.ops.length);
    }, (pipeline.ops.length + 1) * 1500);
  };

  // PRACTICE MODE (Drag & Drop emulation)
  const [practiceCases, setPracticeCases] = useState<{phrase: string, target: string, options: string[]}[]>([]);
  const [currentPractice, setCurrentPractice] = useState(0);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'idle'|'correct'|'incorrect'>('idle');
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Generate practice cases
    const shuffled = [...GLOSSARY].sort(() => Math.random() - 0.5).slice(0, 5);
    const optionsPool = GLOSSARY.map(g => g.expr);

    const cases = shuffled.map(item => {
      let opts = [item.expr];
      while(opts.length < 4) {
        const r = optionsPool[Math.floor(Math.random() * optionsPool.length)];
        if (!opts.includes(r)) opts.push(r);
      }
      return { phrase: item.text, target: item.expr, options: opts.sort(() => Math.random() - 0.5) };
    });
    setPracticeCases(cases);
  }, [mode]);

  const handleSelectBlock = (block: string) => {
    setSelectedBlock(block);
    if (block === practiceCases[currentPractice].target) {
      setFeedback('correct');
      setTimeout(() => {
        setScore(s => s + 1);
        if (currentPractice < practiceCases.length - 1) {
          setCurrentPractice(c => c + 1);
          setFeedback('idle');
          setSelectedBlock(null);
        }
      }, 1500);
    } else {
      setFeedback('incorrect');
      setTimeout(() => {
        setFeedback('idle');
        setSelectedBlock(null);
      }, 1500);
    }
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
              <Layers size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-100 hidden sm:block">Lenguaje Algebraico</h1>
          </div>
          
          <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700">
            <button onClick={() => setMode('explore')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'explore' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50 shadow-[0_0_10px_rgba(99,102,241,0.2)]' : 'text-slate-400 hover:text-slate-200'}`}>
              <Compass size={16} /> Máquina de Variables
            </button>
            <button onClick={() => setMode('practice')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'practice' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50 shadow-[0_0_10px_rgba(99,102,241,0.2)]' : 'text-slate-400 hover:text-slate-200'}`}>
              <Brain size={16} /> Práctica de Bloques
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 flex flex-col items-center mt-6 w-full">
        {mode === 'explore' && (
          <div className="w-full flex justify-between gap-8 flex-col lg:flex-row">
            {/* GLOSSARY PANEL */}
            <div className="w-full lg:w-1/3 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl h-fit">
              <h3 className="text-fuchsia-400 font-black text-xl mb-6 flex items-center gap-2"><Layers/> Diccionario</h3>
              <div className="flex flex-col gap-3">
                {GLOSSARY.map((g, i) => (
                  <div key={i} className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <p className="text-slate-300 text-sm">{g.text}</p>
                    <p className="text-fuchsia-400 font-mono font-bold mt-1 text-lg">"{g.expr}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* THE VAR MACHINE */}
            <div className="w-full lg:w-2/3 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.6)] flex flex-col items-center">
              <h3 className="text-emerald-400 font-black text-2xl mb-2 flex items-center gap-3"><Cpu size={28}/> La Máquina Empacadora</h3>
              <p className="text-slate-400 mb-8 text-center max-w-sm">Inserta un valor en la variable <span className="text-fuchsia-400 font-mono font-bold">X</span> y observa cómo la máquina lo procesa.</p>

              {/* MACHINE CONTROLS */}
              <div className="flex gap-6 mb-10 w-full bg-slate-950 p-4 border border-slate-800 rounded-2xl relative z-20">
                 <div className="w-1/2">
                   <p className="text-xs uppercase text-slate-500 font-bold mb-2">Selecciona la Ecuación (Tubería)</p>
                   <select 
                     disabled={machineState === 'running'}
                     value={pipeIndex} 
                     onChange={e => {setPipeIndex(parseInt(e.target.value)); setMachineState('idle'); setStepIndex(-1)}}
                     className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-fuchsia-400 font-mono font-bold outline-none cursor-pointer focus:border-fuchsia-500 disabled:opacity-50"
                   >
                     {PIPELINES.map((p, i) => <option key={i} value={i}>{p.id} ({p.name})</option>)}
                   </select>
                 </div>
                 <div className="w-1/2">
                   <p className="text-xs uppercase text-slate-500 font-bold mb-2">Valor Inicial (Bola X)</p>
                   <input 
                     type="number" value={xVal} disabled={machineState === 'running'}
                     onChange={e => {setXVal(parseInt(e.target.value) || 0); setMachineState('idle'); setStepIndex(-1)}}
                     className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-indigo-400 font-mono font-bold text-center outline-none focus:border-indigo-500 disabled:opacity-50"
                   />
                 </div>
              </div>

              {/* VISUAL PIPELINE */}
              <div className="relative w-full max-w-sm bg-slate-800/20 border-x border-slate-700/50 py-10 px-6 flex flex-col items-center rounded-[3rem] overflow-hidden drop-shadow-2xl">
                 {/* Top Funnel */}
                 <div className="absolute top-0 w-32 h-10 bg-slate-800 rounded-b-full shadow-inner border-x border-slate-700 pointer-events-none z-10" />
                 
                 <AnimatePresence>
                   <motion.div 
                     key={machineState === 'idle' ? 'idle' : 'anim'}
                     animate={{ y: machineState === 'idle' ? -50 : (stepIndex + 1) * 110 }}
                     transition={{ type: "spring", stiffness: 80, damping: 12 }}
                     className="absolute w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center font-black text-white text-xl z-20 border-2 border-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.8)]"
                   >
                     {machineState === 'idle' ? xVal : currentValue}
                   </motion.div>
                 </AnimatePresence>

                 <div className="h-10 border-r-4 border-dashed border-slate-600/50 mb-0" />

                 {PIPELINES[pipeIndex].ops.map((op, i) => (
                   <div key={i} className="flex flex-col items-center w-full my-1">
                      {/* Station Box */}
                      <div className={`w-full py-6 px-4 bg-slate-900 border-2 rounded-2xl flex flex-col items-center overflow-hidden relative transition-all duration-300 ${stepIndex === i ? 'border-fuchsia-500 shadow-[0_0_30px_rgba(217,70,239,0.3)]' : 'border-slate-700'}`}>
                         <div className="absolute top-0 right-0 w-10 h-10 border-l border-b border-slate-800 rounded-bl-full bg-slate-950 flex items-center justify-center pointer-events-none opacity-50"><RefreshCw size={14} className={stepIndex === i ? 'animate-spin text-fuchsia-500' : 'text-slate-700'}/></div>
                         <p className="font-mono text-xl font-black text-rose-400">{op.label}</p>
                      </div>
                      {/* Pipe to next */}
                      <div className="h-14 border-r-4 border-dashed border-slate-600/50" />
                   </div>
                 ))}

                 {/* Machine bottom output */}
                 <div className="w-24 h-6 border-b-4 border-x-4 border-emerald-500 rounded-b-xl opacity-70 mt-[-10px] bg-slate-950 shadow-[0_5px_20px_rgba(16,185,129,0.3)]" />
                 
                 <AnimatePresence>
                   {machineState === 'done' && (
                     <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-8 bg-emerald-500/20 px-8 py-4 rounded-full border border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.6)]">
                       <span className="font-mono text-3xl font-black text-emerald-300">= {currentValue}</span>
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>

              <div className="mt-10 mb-4 h-12">
                 {machineState !== 'running' && (
                   <button onClick={runMachine} className="px-10 py-3 bg-fuchsia-600 hover:bg-fuchsia-500 rounded-full font-bold text-lg shadow-[0_0_15px_rgba(192,38,211,0.5)] transition flex items-center gap-2">
                     <ArrowDown size={20}/> Dejar Caer Valor
                   </button>
                 )}
              </div>
            </div>
          </div>
        )}

        {mode === 'practice' && practiceCases.length > 0 && (
          <div className="w-full max-w-4xl flex flex-col items-center">
            
            <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-8 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 border-l border-b border-indigo-500/20 bg-indigo-500/10 rounded-bl-3xl">
                 <span className="font-black text-2xl text-indigo-400">{score}<span className="text-slate-500 text-lg">/5</span></span>
               </div>
               
               <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Traductor Algebraico</p>
               
               <div className="min-h-32 mb-10 flex flex-col items-center justify-center text-center px-4">
                 <h2 className="text-3xl sm:text-4xl font-bold text-fuchsia-100 italic leading-snug">
                   "{practiceCases[currentPractice].phrase}"
                 </h2>
                 <p className="mt-6 text-slate-400">Selecciona el bloque de código Scratch que corresponde a la frase.</p>
               </div>

               {/* Scratch style blocks layout */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl mx-auto">
                 {practiceCases[currentPractice].options.map((opt, i) => (
                   <button 
                     key={i}
                     onClick={() => feedback === 'idle' && handleSelectBlock(opt)}
                     disabled={feedback !== 'idle'}
                     className={`relative p-6 font-mono text-2xl font-black text-center transition-all duration-300
                       ${
                         opt === selectedBlock && feedback === 'correct' ? 'bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.8)] text-emerald-950 scale-105 z-10' :
                         opt === selectedBlock && feedback === 'incorrect' ? 'bg-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.8)] text-rose-950 scale-95' :
                         'bg-[#ffbd2e]/90 hover:bg-[#ffbd2e] hover:-translate-y-1 shadow-lg text-[#5a4208]'
                       }
                     `}
                     style={{
                       // Making them look like basic interlocking Scratch reporter blocks (rounded pills)
                       borderRadius: '30px'
                     }}
                   >
                     {/* Scratch inner highlight reflection */}
                     <div className="absolute top-1 left-4 right-4 h-2 bg-white/30 rounded-full" />
                     {opt}
                   </button>
                 ))}
               </div>

               {/* Congratulations block */}
               {score === 5 && currentPractice === practiceCases.length - 1 && feedback === 'correct' && (
                  <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 bg-slate-900/90 backdrop-blur z-30 flex items-center justify-center flex-col text-center">
                    <h2 className="text-6xl font-black text-fuchsia-400 drop-shadow-[0_0_20px_rgba(217,70,239,0.5)] mb-4">🏆 ¡Perfecto!</h2>
                    <p className="text-xl text-slate-300 max-w-md">Has dominado la traducción de palabras a fragmentos algebraicos.</p>
                    <button onClick={() => setMode('explore')} className="mt-8 px-8 py-3 bg-indigo-600 rounded-full font-bold shadow-lg hover:bg-indigo-500 transition">Volver al Explorador</button>
                  </motion.div>
               )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
