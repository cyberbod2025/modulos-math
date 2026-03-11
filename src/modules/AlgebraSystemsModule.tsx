import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Brain, ArrowLeft, RefreshCw, Maximize, Orbit, CheckCircle2, Navigation, ArrowRight } from 'lucide-react';
import { DailyLifeUses } from '../components/DailyLifeUses';

interface Props {
  onBack: () => void;
}

type MethodType = 'reduction' | 'equalization';

// Example System:
// 2x + y = 8
// x - y = 1
// Solution: x=3, y=2
// 
// Eq1: y = 8 - 2x
// Eq2: y = x - 1

export default function AlgebraSystemsModule({ onBack }: Props) {
  const [mode, setMode] = useState<'explore' | 'practice'>('explore');
  const [method, setMethod] = useState<MethodType>('reduction');
  const [step, setStep] = useState(0);

  // Practice Mode state
  const [pracStep, setPracStep] = useState(0); // 0=solve x, 1=solve y, 2=done
  const [inputX, setInputX] = useState('');
  const [inputY, setInputY] = useState('');
  const [pracFeedback, setPracFeedback] = useState<'idle'|'correct'|'incorrect'>('idle');

  // Hardcoded equations for explore mode to simplify logic, focus strictly on beautiful UI
  const sys = {
    eq1: { A: 2, B: 1, C: 8, color: 'text-fuchsia-400', stroke: '#e879f9' },
    eq2: { A: 1, B: -1, C: 1, color: 'text-cyan-400', stroke: '#22d3ee' },
    sol: { x: 3, y: 2 }
  };

  // SVG Coordinate Conversion
  const mapPt = (x: number, y: number) => {
    // scale 1 unit = 10%
    return { cx: 50 + (x * 5), cy: 50 - (y * 5) };
  };

  // Points for drawing Eq1 (y = 8 - 2x)
  // if x=-10, y=28 (offscreen)
  // point 1: x=0, y=8
  // point 2: x=4, y=0
  const pt1A = mapPt(0, 8);
  const pt1B = mapPt(4, 0);

  // Points for Eq2 (y = x - 1)
  // point 1: x=-4, y=-5
  // point 2: x=6, y=5
  const pt2A = mapPt(-4, -5);
  const pt2B = mapPt(6, 5);

  const renderReductionSteps = () => {
    return (
      <div className="flex flex-col gap-6 text-xl text-slate-300 font-mono items-start">
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 w-full relative">
           <motion.div animate={step >= 1 ? { y: 20, opacity: 0 } : {}} className="relative z-10 w-fit mx-auto">
             <span className={sys.eq1.color}>2x + y = 8</span><br/>
             <span className={sys.eq2.color}>x - y = 1</span>
           </motion.div>
           
           {step >= 1 && (
             <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 flex flex-col items-center justify-center p-4">
                 <div className="flex text-2xl font-black w-full justify-center gap-12 border-b-2 border-slate-700 pb-2">
                    <span className={sys.eq1.color}>2x</span> + <span className={sys.eq2.color}>1x</span>
                    <span className="text-slate-600">|</span>
                    <span className="text-emerald-400 line-through decoration-emerald-500/50">+ y - y</span>
                    <span className="text-slate-600">|</span>
                    <span className={sys.eq1.color}>8</span> + <span className={sys.eq2.color}>1</span>
                 </div>
                 {step >= 2 && (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-indigo-300 font-black text-3xl mt-2 drop-shadow-[0_0_15px_rgba(165,180,252,0.8)]">
                     3x = 9  <ArrowRight className="inline mx-2 text-slate-500" />  x = 3
                   </motion.div>
                 )}
             </motion.div>
           )}
        </div>

        <AnimatePresence>
          {step >= 3 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-4 bg-slate-900/50 border-l-4 border-emerald-500 w-full rounded-r-xl">
               <p className="text-sm font-sans tracking-wide font-bold text-slate-500 mb-2 uppercase">SUSTITUIR LA LUZ X:</p>
               <p className="text-2xl text-center">
                 2(<motion.span layoutId="morph-x" className="text-indigo-400 font-black px-2 py-1 bg-indigo-500/20 rounded shadow-[0_0_15px_rgba(99,102,241,0.5)]">3</motion.span>) + y = 8
               </p>
               {step >= 4 && (
                 <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl text-center mt-4 text-emerald-300 font-black drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] border-t border-slate-800 pt-4">
                   6 + y = 8 <ArrowRight className="inline mx-2 text-slate-500" /> y = 2
                 </motion.p>
               )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderEqualizationSteps = () => {
    return (
      <div className="flex flex-col gap-6 text-xl text-slate-300 font-mono items-center">
        <div className="flex w-full gap-4 justify-center">
          <div className={`p-4 bg-slate-950 rounded-xl border border-slate-800 w-1/2 flex flex-col items-center justify-center transition-all ${step >= 1 ? 'border-fuchsia-500' : ''}`}>
             <span className={sys.eq1.color}>2x + y = 8</span>
             {step >= 1 && <motion.span initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} className="text-fuchsia-300 mt-2 font-black border-t-2 border-slate-800 w-full text-center pt-2">y = 8 - 2x</motion.span>}
          </div>
          <div className={`p-4 bg-slate-950 rounded-xl border border-slate-800 w-1/2 flex flex-col items-center justify-center transition-all ${step >= 1 ? 'border-cyan-500' : ''}`}>
             <span className={sys.eq2.color}>x - y = 1</span>
             {step >= 1 && <motion.span initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} className="text-cyan-300 mt-2 font-black border-t-2 border-slate-800 w-full text-center pt-2">y = x - 1</motion.span>}
          </div>
        </div>

        <AnimatePresence>
          {step >= 2 && (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-4 p-6 bg-slate-950 border-2 border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.2)] rounded-2xl w-full text-center">
               <span className="text-sm font-sans tracking-wide font-bold text-slate-500 mb-4 uppercase block">Fusión de Ecuaciones (Igualar)</span>
               <div className="text-3xl font-black flex justify-center items-center gap-3">
                  <motion.span layoutId="eq1" className="text-fuchsia-300">8 - 2x</motion.span> 
                  <span className="text-white">=</span> 
                  <motion.span layoutId="eq2" className="text-cyan-300">x - 1</motion.span>
               </div>
               
               {step >= 3 && (
                 <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex flex-col items-center mt-6 pt-6 border-t border-slate-800 gap-3">
                    <p className="text-slate-400 font-bold">8 + 1 = x + 2x</p>
                    <p className="text-2xl font-black text-indigo-300 drop-shadow-[0_0_15px_rgba(165,180,252,0.8)]">9 = 3x <ArrowRight className="inline text-slate-500 mx-2"/> x = 3</p>
                 </motion.div>
               )}
            </motion.div>
          )}

          {step >= 4 && (
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-2 w-full text-center">
                <p className="text-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500 rounded-full px-6 py-3 font-bold inline-block shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  Sustituimos: y = (3) - 1 <ArrowRight className="inline text-emerald-500 mx-2"/> <span className="text-white drop-shadow-md text-2xl">y = 2</span>
                </p>
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const checkPractice = () => {
    if (pracStep === 0) {
      if (inputX === '3') {
        setPracFeedback('correct');
        setTimeout(() => {
          setPracStep(1);
          setPracFeedback('idle');
        }, 1500);
      } else {
        setPracFeedback('incorrect');
        setTimeout(() => setPracFeedback('idle'), 1500);
      }
    } else if (pracStep === 1) {
      if (inputY === '2') {
        setPracFeedback('correct');
        setTimeout(() => {
          setPracStep(2);
        }, 1500);
      } else {
        setPracFeedback('incorrect');
        setTimeout(() => setPracFeedback('idle'), 1500);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 pb-4 flex flex-col items-center">
       <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 py-3 px-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)] w-full sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button onClick={onBack} className="text-slate-400 hover:text-indigo-400 transition-colors p-2 -ml-2 flex items-center gap-2">
              <ArrowLeft size={24} />
              <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Menú</span>
            </button>
            <div className="w-10 h-10 bg-indigo-500/20 border border-indigo-500 rounded-xl flex items-center justify-center text-indigo-400 font-bold shadow-[0_0_15px_rgba(99,102,241,0.3)]">
              <Orbit size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-100 hidden sm:block">Sistemas de Ecuaciones</h1>
          </div>
          
          <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700">
            <button onClick={() => {setMode('explore'); setStep(0)}} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'explore' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50 shadow-[0_0_10px_rgba(99,102,241,0.2)]' : 'text-slate-400 hover:text-slate-200'}`}>
              <Compass size={16} /> Intersección Visual
            </button>
            <button onClick={() => {setMode('practice'); setPracStep(0); setInputX(''); setInputY('')}} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'practice' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50 shadow-[0_0_10px_rgba(99,102,241,0.2)]' : 'text-slate-400 hover:text-slate-200'}`}>
              <Brain size={16} /> Práctica
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 sm:p-6 flex flex-col items-center mt-2 w-full">
        {mode === 'explore' && (
          <div className="w-full flex justify-center gap-6 mb-8 mt-2">
             <div className="bg-slate-950 p-1 rounded-full border border-slate-800 flex shadow-[0_0_15px_rgba(0,0,0,0.5)] z-20">
               <button onClick={() => {setMethod('reduction'); setStep(0)}} className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${method === 'reduction' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>1. Reducción</button>
               <button onClick={() => {setMethod('equalization'); setStep(0)}} className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${method === 'equalization' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>2. Igualación</button>
             </div>
          </div>
        )}

        {mode === 'explore' && (
          <div className="w-full flex flex-col lg:flex-row gap-8 items-start justify-center">
             
             {/* LEFT: CALCULATION PANEL */}
             <div className="w-full lg:w-1/2 bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.6)] flex flex-col min-h-[500px] z-10">
                <h3 className="text-xl font-black text-slate-100 mb-6 flex items-center gap-3">
                  <Navigation className="text-indigo-400"/> {method === 'reduction' ? 'Cálculo por Reducción' : 'Cálculo por Igualación'}
                </h3>
                
                <div className="flex-1 flex flex-col justify-center min-h-[300px]">
                  {method === 'reduction' ? renderReductionSteps() : renderEqualizationSteps()}
                </div>

                <div className="flex justify-between items-center bg-slate-950 p-2 rounded-2xl border border-slate-800 mt-6 mt-auto">
                    <button onClick={() => setStep(0)} className="p-3 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-xl transition"><RefreshCw size={20}/></button>
                    <button 
                      onClick={() => setStep(s => s + 1)}
                      disabled={step >= 4}
                      className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(79,70,229,0.3)] disabled:opacity-50 disabled:shadow-none transition"
                    >
                      Avanzar Paso <ArrowRight size={18}/>
                    </button>
                </div>
             </div>

             {/* RIGHT: LIVE CARTESIAN PLANE */}
             <div className="w-full lg:w-1/2 md:max-w-md bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden aspect-square z-10 flex flex-col">
                <div className="absolute top-4 left-6 z-20">
                   <p className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><Maximize size={14}/> Plano Dinámico</p>
                </div>

                {/* The Graph */}
                <div className="flex-1 relative mt-8 rounded-2xl overflow-hidden shadow-inner border border-slate-800/80 bg-slate-900/50">
                  <svg viewBox="0 0 100 100" className="w-full h-full shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]">
                     {/* Grid lines (simplified) */}
                     {Array.from({length: 21}).map((_, i) => (
                       <g key={i}>
                         <line x1={i*5} y1={0} x2={i*5} y2={100} stroke="#334155" strokeWidth="0.2" opacity="0.3"/>
                         <line x1={0} y1={i*5} x2={100} y2={i*5} stroke="#334155" strokeWidth="0.2" opacity="0.3"/>
                       </g>
                     ))}
                     {/* Axis */}
                     <line x1={0} y1={50} x2={100} y2={50} stroke="#475569" strokeWidth="0.8" />
                     <line x1={50} y1={0} x2={50} y2={100} stroke="#475569" strokeWidth="0.8" />

                     {/* Lines Rendering logic based on Steps */}
                     {/* Step 1 reveals the lines */}
                     {step >= 1 && (
                       <motion.line 
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, ease: 'easeInOut' }}
                        x1={pt1A.cx} y1={pt1A.cy} x2={pt1B.cx} y2={pt1B.cy} 
                        stroke={sys.eq1.stroke} strokeWidth="1.2" style={{ filter: `drop-shadow(0 0 4px ${sys.eq1.stroke})` }}
                       />
                     )}
                     {step >= 1 && (
                       <motion.line 
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, ease: 'easeInOut', delay: 0.5 }}
                        x1={pt2A.cx} y1={pt2A.cy} x2={pt2B.cx} y2={pt2B.cy} 
                        stroke={sys.eq2.stroke} strokeWidth="1.2" style={{ filter: `drop-shadow(0 0 4px ${sys.eq2.stroke})` }}
                       />
                     )}

                     {/* The Intersection Point ! */}
                     {step >= 4 && (
                       <motion.circle 
                         initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', bounce: 0.6 }}
                         cx={mapPt(3,2).cx} cy={mapPt(3,2).cy} r="2" 
                         fill="#10b981" style={{ filter: 'drop-shadow(0 0 8px #10b981)' }}
                       />
                     )}
                     {step >= 4 && (
                        <motion.text 
                           initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                           x={mapPt(3,2).cx + 3} y={mapPt(3,2).cy - 3} fill="#a7f3d0" fontSize="4" fontWeight="bold"
                           style={{ textShadow: '0px 2px 4px rgba(0,0,0,0.8)' }}
                        >
                          (3, 2)
                        </motion.text>
                     )}
                  </svg>
                </div>
                
                {/* Explain text below graph */}
                <div className="mt-4 text-center h-10">
                   {step === 0 && <span className="text-slate-500 font-mono text-sm max-w-[200px]">El plano está vacío, no sabemos dónde están las líneas.</span>}
                   {step === 1 && <span className="text-slate-300 font-mono text-sm">Dibujando la trayectoria de cada ecuación...</span>}
                   {step >= 2 && step <= 3 && <span className="text-slate-300 font-mono text-sm">Las matemáticas buscan matemáticamente dónde chocarán.</span>}
                   {step >= 4 && <span className="text-emerald-400 font-mono font-bold text-[15px] drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">¡Chocan mágicamente en x=3, y=2!</span>}
                </div>
             </div>
          </div>
        )}

        {mode === 'practice' && (
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col items-center">
            
            <p className="text-emerald-500 font-bold uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
              <Compass size={16}/> Resuelve el misterio
            </p>

            <div className="text-3xl sm:text-4xl font-mono font-black text-slate-200 mb-10 border-l-4 border-indigo-500 pl-6 space-y-4">
              <p><span className="text-fuchsia-400">2x</span> + <span className="text-fuchsia-400">y</span> <span className="text-slate-600">=</span> <span className="text-emerald-400">8</span></p>
              <p><span className="text-cyan-400">x</span> <span className="text-cyan-400">- y</span> <span className="text-slate-600">=</span> <span className="text-emerald-400">1</span></p>
            </div>

            <div className="flex flex-col sm:flex-row gap-8 w-full justify-center mb-10">
               {/* Input X */}
               <div className={`p-6 rounded-2xl flex flex-col items-center gap-4 transition-all ${pracStep === 0 ? 'bg-slate-800/80 shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-slate-700' : 'bg-slate-950 opacity-50 border-transparent'}`}>
                  <span className="font-mono text-4xl text-fuchsia-400 font-black">X =</span>
                  <input 
                    type="number" value={inputX} onChange={e => setInputX(e.target.value)} disabled={pracStep !== 0} placeholder="?"
                    className={`w-24 h-16 text-3xl font-black text-center bg-slate-900 border-2 rounded-xl outline-none transition-all ${pracStep > 0 ? 'border-emerald-500 text-emerald-400' : pracFeedback === 'incorrect' ? 'border-rose-500 text-rose-400' : 'border-slate-700 text-white focus:border-indigo-500'}`}
                  />
                  {pracStep === 0 && (
                    <button onClick={checkPractice} disabled={!inputX} className="px-6 py-2 bg-indigo-600 rounded-full font-bold mt-2 shadow-lg disabled:opacity-50 hover:bg-indigo-500">Revisar</button>
                  )}
               </div>

               {/* Input Y */}
               <div className={`p-6 rounded-2xl flex flex-col items-center gap-4 transition-all ${pracStep === 1 ? 'bg-slate-800/80 shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-slate-700' : 'bg-slate-950 opacity-50 border-transparent'}`}>
                  <span className="font-mono text-4xl text-cyan-400 font-black">Y =</span>
                  <input 
                    type="number" value={inputY} onChange={e => setInputY(e.target.value)} disabled={pracStep !== 1} placeholder="?"
                    className={`w-24 h-16 text-3xl font-black text-center bg-slate-900 border-2 rounded-xl outline-none transition-all ${pracStep > 1 ? 'border-emerald-500 text-emerald-400' : pracFeedback === 'incorrect' ? 'border-rose-500 text-rose-400' : 'border-slate-700 text-white focus:border-indigo-500'}`}
                  />
                  {pracStep === 1 && (
                    <button onClick={checkPractice} disabled={!inputY} className="px-6 py-2 bg-indigo-600 rounded-full font-bold mt-2 shadow-lg disabled:opacity-50 hover:bg-indigo-500">Revisar</button>
                  )}
               </div>
            </div>

            <AnimatePresence>
               {pracStep === 2 && (
                 <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="bg-emerald-500/10 border border-emerald-500/50 p-6 rounded-2xl w-full text-center">
                   <h3 className="text-3xl font-black text-emerald-400 mb-2 flex justify-center items-center gap-2"><CheckCircle2 size={32}/> ¡Punto de Intersección Hallado!</h3>
                   <p className="text-slate-300">Ambas rectas se cruzan mágicamente en la coordenada espacial <span className="font-bold whitespace-nowrap">(3, 2)</span>.</p>
                 </motion.div>
               )}
            </AnimatePresence>
          </div>
        )}
              <DailyLifeUses uses={[
    { title: "Elegir Planes Telefónicos", description: "La Empresa A cobra $100 fijos + $1 por mega. La Empresa B cobra $0 fijos pero $3 por mega. Con un sistema de ecuaciones encuentras en qué punto exacto te conviene cambiar de compañía." },
    { title: "Logística y Negocios", description: "Determinar cuántos camiones chicos y cuántos grandes se necesitan enviar para llevar exactamente 500 cajas, si unos cargan 30 y otros 50 cajas (optimizando costos)." }
  ]} />
      </main>
    </div>
  );
}
