import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FractionInput } from '../components/FractionInput';
import { AcetateLayer } from '../components/AcetateLayer';
import { MathEquation } from '../components/MathEquation';
import { Explanation } from '../components/Explanation';
import { PracticeExplanation } from '../components/PracticeExplanation';
import { RefreshCw, ArrowRight, Layers, CheckCircle2, Compass, Brain, ArrowLeft, XSquare } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export default function MultiplicationModule({ onBack }: Props) {
  const [operation, setOperation] = useState<'mult' | 'div'>('mult');
  const [mode, setMode] = useState<'explore' | 'practice'>('explore');
  const [multType, setMultType] = useState<'frac-frac' | 'frac-entero'>('frac-frac');
  const [difficulty, setDifficulty] = useState<'facil' | 'medio' | 'dificil'>('facil');
  
  // Practice mode states
  const [practiceAnswer, setPracticeAnswer] = useState({ num: '', den: '' });
  const [practiceStatus, setPracticeStatus] = useState<'question' | 'correct' | 'incorrect'>('question');
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showPracticeExplanation, setShowPracticeExplanation] = useState(false);

  const [fractionA, setFractionA] = useState({ num: 1, den: 2 });
  const [fractionB, setFractionB] = useState({ num: 1, den: 3 });
  const [wholeNumber, setWholeNumber] = useState(3);
  
  const [step, setStep] = useState(0); // 0: Input, 1: Show A, 2: Show B, 3: Overlap
  const [showExplanation, setShowExplanation] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 300, height: 300 });
  const lastProblemKey = useRef('');

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const maxByWidth = window.innerWidth - 40;
        const maxByHeight = window.innerHeight - 260;
        const width = Math.min(maxByWidth, maxByHeight, 380);
        const safeWidth = Math.max(200, width);
        setContainerSize({ width: safeWidth, height: safeWidth });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const generateProblem = (diff: 'facil' | 'medio' | 'dificil') => {
    let minDen = 2, maxDen = 5;
    if (diff === 'medio') { minDen = 3; maxDen = 8; }
    if (diff === 'dificil') { minDen = 5; maxDen = 12; }

    let nextA = { num: 1, den: minDen };
    let nextB = { num: 1, den: minDen };
    let nextWhole = 2;
    let key = '';

    for (let tries = 0; tries < 20; tries++) {
      const denA = Math.floor(Math.random() * (maxDen - minDen + 1)) + minDen;
      const numA = Math.floor(Math.random() * (denA - 1)) + 1;

      if (multType === 'frac-frac') {
        const denB = Math.floor(Math.random() * (maxDen - minDen + 1)) + minDen;
        const numB = Math.floor(Math.random() * (denB - 1)) + 1;
        key = `${numA}/${denA}|${numB}/${denB}|${multType}|${operation}`;
        if (key !== lastProblemKey.current || tries === 19) {
          nextA = { num: numA, den: denA };
          nextB = { num: numB, den: denB };
          break;
        }
      } else {
        const whole = Math.floor(Math.random() * 4) + 2;
        key = `${numA}/${denA}|${whole}|${multType}|${operation}`;
        if (key !== lastProblemKey.current || tries === 19) {
          nextA = { num: numA, den: denA };
          nextWhole = whole;
          nextB = { num: whole, den: 1 };
          break;
        }
      }
    }

    lastProblemKey.current = key;
    setFractionA(nextA);
    setFractionB(nextB);
    setWholeNumber(nextWhole);

    setStep(0);
    setPracticeAnswer({ num: '', den: '' });
    setPracticeStatus('question');
    setShowExplanation(false);
    setShowPracticeExplanation(false);
  };

  const handleModeSwitch = (newMode: 'explore' | 'practice') => {
    setMode(newMode);
    if (newMode === 'practice') {
      setScore({ correct: 0, total: 0 });
      generateProblem(difficulty);
    } else {
      setStep(0);
      setFractionA({ num: 1, den: 2 });
      setFractionB({ num: 1, den: 3 });
      setWholeNumber(3);
    }
  };

  const handleTypeSwitch = (type: 'frac-frac' | 'frac-entero') => {
    setMultType(type);
    setStep(0);
    if (mode === 'practice') {
      generateProblem(difficulty);
    } else {
      if (type === 'frac-entero') {
        setFractionB({ num: wholeNumber, den: 1 });
      }
    }
  };

  const handleOperationSwitch = (newOperation: 'mult' | 'div') => {
    setOperation(newOperation);
    setStep(0);
    setShowPracticeExplanation(false);
    if (mode === 'practice') {
      generateProblem(difficulty);
    }
  };

  const handleDifficultyChange = (newDiff: 'facil' | 'medio' | 'dificil') => {
    setDifficulty(newDiff);
    generateProblem(newDiff);
  };

  const handleNextStep = () => {
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handleReset = () => {
    setStep(0);
    setShowExplanation(false);
  };

  const steps = multType === 'frac-frac' ? [
    { title: "Definir Valores", description: "Introduce los valores a multiplicar." },
    { title: "Visualizar Primera Parte", description: "Observa la representación inicial." },
    { title: "Visualizar Segunda Parte", description: "Añadimos el segundo factor." },
    { title: "Resultado Final", description: "Combina para ver el resultado." },
  ] : [
    { title: "Definir Valores", description: "Introduce los valores a multiplicar." },
    { title: "Visualizar Enteros", description: "Representamos el número entero." },
    { title: "Aplicar Fracción", description: "Dividimos cada entero y tomamos la fracción indicada." },
    { title: "Resultado Final", description: "Agrupamos las partes para ver el total." },
  ];

  const fractionBValue = multType === 'frac-frac' ? fractionB : { num: wholeNumber, den: 1 };
  const divisionResult = {
    num: fractionA.num * fractionBValue.den,
    den: fractionA.den * fractionBValue.num,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 pb-20">
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 py-4 px-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)] sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button onClick={onBack} className="text-slate-400 hover:text-cyan-400 transition-colors p-2 -ml-2">
              <ArrowLeft size={24} />
            </button>
            <div className="w-10 h-10 bg-cyan-500/20 border border-cyan-500 rounded-xl flex items-center justify-center text-cyan-400 font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <XSquare size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-100 hidden sm:block">Multiplicación y División</h1>
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700">
              <button
                onClick={() => handleModeSwitch('explore')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  mode === 'explore' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'text-slate-400 hover:text-slate-200'
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
        
        {/* Operation + Type Selector */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 shadow-lg">
            <button
              onClick={() => handleOperationSwitch('mult')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                operation === 'mult'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Multiplicación
            </button>
            <button
              onClick={() => handleOperationSwitch('div')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                operation === 'div'
                  ? 'bg-gradient-to-r from-emerald-500 to-lime-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              División
            </button>
          </div>
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 shadow-lg">
            <button
              onClick={() => handleTypeSwitch('frac-frac')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                multType === 'frac-frac'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Fracción {operation === 'mult' ? '×' : '÷'} Fracción
            </button>
            <button
              onClick={() => handleTypeSwitch('frac-entero')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                multType === 'frac-entero'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Fracción {operation === 'mult' ? '×' : '÷'} Entero
            </button>
          </div>
        </div>

        {mode === 'explore' && operation === 'mult' && (
          <>
            {/* Step Indicator */}
            <div className="w-full max-w-2xl mb-12">
              <div className="flex justify-between items-center relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -z-10 rounded-full" />
                <motion.div 
                  className="absolute top-1/2 left-0 h-1 bg-cyan-500 -z-10 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]" 
                  initial={{ width: '0%' }}
                  animate={{ width: `${(step / 3) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />

                {[0, 1, 2, 3].map((s) => (
                  <div key={s} className="flex flex-col items-center gap-2">
                    <motion.div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                        step >= s 
                          ? 'bg-slate-900 border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]' 
                          : 'bg-slate-900 border-slate-700 text-slate-500'
                      }`}
                      animate={{ scale: step === s ? 1.2 : 1 }}
                    >
                      {step > s ? <CheckCircle2 size={20} /> : s + 1}
                    </motion.div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-6 h-12">
                <motion.h2 
                  key={step}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xl font-bold text-slate-100"
                >
                  {steps[step].title}
                </motion.h2>
                <motion.p 
                  key={`desc-${step}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-slate-400 mt-1"
                >
                  {steps[step].description}
                </motion.p>
              </div>
            </div>

            {/* Input Section */}
            <div className="w-full max-w-3xl flex flex-col md:flex-row justify-center gap-8 mb-12">
              <FractionInput
                label="Fracción A"
                numerator={fractionA.num}
                denominator={fractionA.den}
                color="border-yellow-400/50 bg-yellow-400/10 text-yellow-400"
                onChange={(n, d) => {
                  setFractionA({ num: n, den: d });
                  if (step === 3) setStep(2);
                }}
                allowImproper
              />
              
              {multType === 'frac-frac' ? (
                <FractionInput
                  label="Fracción B"
                  numerator={fractionB.num}
                  denominator={fractionB.den}
                  color="border-cyan-400/50 bg-cyan-400/10 text-cyan-400"
                  onChange={(n, d) => {
                    setFractionB({ num: n, den: d });
                    if (step === 3) setStep(2);
                  }}
                  allowImproper
                />
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">Número Entero</span>
                  <div className="flex flex-col items-center justify-center h-full">
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={wholeNumber}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        setWholeNumber(val);
                        setFractionB({ num: val, den: 1 });
                        if (step === 3) setStep(2);
                      }}
                      className="w-24 h-24 text-center text-5xl font-black bg-pink-500/10 border-2 border-pink-500/50 text-pink-400 rounded-2xl outline-none focus:border-pink-400 focus:shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all"
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {mode === 'explore' && operation === 'div' && (
          <div className="w-full max-w-4xl bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl p-6 sm:p-10 flex flex-col items-center shadow-[0_0_50px_rgba(0,0,0,0.3)]">
            <div className="w-full max-w-3xl flex flex-col md:flex-row justify-center gap-8 mb-10">
              <FractionInput
                label="Fracción A"
                numerator={fractionA.num}
                denominator={fractionA.den}
                color="border-yellow-400/50 bg-yellow-400/10 text-yellow-400"
                onChange={(n, d) => setFractionA({ num: n, den: d })}
                allowImproper
              />

              {multType === 'frac-frac' ? (
                <FractionInput
                  label="Fracción B"
                  numerator={fractionB.num}
                  denominator={fractionB.den}
                  color="border-cyan-400/50 bg-cyan-400/10 text-cyan-400"
                  onChange={(n, d) => setFractionB({ num: n, den: d })}
                  allowImproper
                />
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">Número Entero</span>
                  <div className="flex flex-col items-center justify-center h-full">
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={wholeNumber}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        setWholeNumber(val);
                        setFractionB({ num: val, den: 1 });
                      }}
                      className="w-24 h-24 text-center text-5xl font-black bg-pink-500/10 border-2 border-pink-500/50 text-pink-400 rounded-2xl outline-none focus:border-pink-400 focus:shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all"
                    />
                  </div>
                </div>
              )}
            </div>

            <MathEquation
              fractionA={fractionA}
              fractionB={fractionBValue}
              showResult={true}
              operation="÷"
              result={divisionResult}
            />

            <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800 max-w-2xl text-center">
              <p className="text-lg text-slate-300 leading-relaxed">
                Para dividir fracciones, se multiplica por el recíproco de la segunda fracción.
              </p>
            </div>
          </div>
        )}

        {mode === 'practice' && (
          <div className="w-full max-w-3xl bg-slate-900/50 backdrop-blur-sm p-8 rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-slate-800 mb-12">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-6">
              <div className="flex gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                {(['facil', 'medio', 'dificil'] as const).map(d => (
                  <button
                    key={d}
                    onClick={() => handleDifficultyChange(d)}
                    className={`px-5 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                      difficulty === d 
                        ? 'bg-purple-500/20 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]' 
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
                  Nueva Práctica
                </button>
                <div className="bg-slate-950 px-6 py-3 rounded-xl border border-slate-800">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Puntuación</p>
                  <p className="text-3xl font-black text-purple-400 leading-none drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">
                    {score.correct} <span className="text-slate-600 text-xl">/ {score.total}</span>
                  </p>
                </div>
              </div>
            </div>
            
            {/* Problem display */}
            <div className="flex flex-col items-center gap-10 py-8">
              <div className="flex items-center justify-center gap-6 sm:gap-8 text-4xl sm:text-6xl font-black text-slate-100">
                <div className="flex flex-col items-center text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.3)]">
                  <span className="border-b-4 border-yellow-400/50 px-3 mb-2">{fractionA.num}</span>
                  <span>{fractionA.den}</span>
                </div>
                <span className="text-slate-600">{operation === 'mult' ? '×' : '÷'}</span>
                
                {multType === 'frac-frac' ? (
                  <div className="flex flex-col items-center text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                    <span className="border-b-4 border-cyan-400/50 px-3 mb-2">{fractionB.num}</span>
                    <span>{fractionB.den}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-pink-400 drop-shadow-[0_0_10px_rgba(236,72,153,0.3)]">
                    <span>{wholeNumber}</span>
                  </div>
                )}

                <span className="text-slate-600">=</span>
                
                <div className="flex flex-col items-center gap-3">
                  <motion.input 
                    type="number" 
                    value={practiceAnswer.num}
                    onChange={e => setPracticeAnswer(p => ({ ...p, num: e.target.value }))}
                    className={`w-20 h-16 sm:w-24 sm:h-20 text-center text-3xl sm:text-4xl font-black border-2 rounded-xl outline-none transition-all bg-slate-950 ${
                      practiceStatus === 'correct' ? 'border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]' :
                      practiceStatus === 'incorrect' ? 'border-rose-500 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.4)]' :
                      'border-slate-700 text-slate-100 focus:border-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                    }`}
                    disabled={practiceStatus === 'correct'}
                    placeholder="?"
                    min="0"
                    animate={practiceStatus === 'incorrect' ? { x: [-5, 5, -5, 5, 0] } : practiceStatus === 'correct' ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.4 }}
                  />
                  <div className={`w-16 sm:w-20 h-1 sm:h-1.5 rounded-full transition-colors ${
                    practiceStatus === 'correct' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' :
                    practiceStatus === 'incorrect' ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' :
                    'bg-slate-700'
                  }`}></div>
                  <motion.input 
                    type="number" 
                    value={practiceAnswer.den}
                    onChange={e => setPracticeAnswer(p => ({ ...p, den: e.target.value }))}
                    className={`w-20 h-16 sm:w-24 sm:h-20 text-center text-3xl sm:text-4xl font-black border-2 rounded-xl outline-none transition-all bg-slate-950 ${
                      practiceStatus === 'correct' ? 'border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]' :
                      practiceStatus === 'incorrect' ? 'border-rose-500 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.4)]' :
                      'border-slate-700 text-slate-100 focus:border-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                    }`}
                    disabled={practiceStatus === 'correct'}
                    placeholder="?"
                    min="1"
                    animate={practiceStatus === 'incorrect' ? { x: [-5, 5, -5, 5, 0] } : practiceStatus === 'correct' ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>
              
              {practiceStatus === 'question' && (
                <button 
                  onClick={() => {
                    if (!practiceAnswer.num || !practiceAnswer.den) return;
                    const pNum = parseInt(practiceAnswer.num);
                    const pDen = parseInt(practiceAnswer.den);
                    if (isNaN(pNum) || isNaN(pDen) || pDen <= 0) return;

                    const expectedNum = operation === 'mult'
                      ? fractionA.num * (multType === 'frac-frac' ? fractionB.num : wholeNumber)
                      : fractionA.num * (multType === 'frac-frac' ? fractionB.den : 1);
                    const expectedDen = operation === 'mult'
                      ? fractionA.den * (multType === 'frac-frac' ? fractionB.den : 1)
                      : fractionA.den * (multType === 'frac-frac' ? fractionB.num : wholeNumber);

                    const isCorrect = (pNum / pDen) === (expectedNum / expectedDen);

                    setPracticeStatus(isCorrect ? 'correct' : 'incorrect');
                    setScore(s => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }));
                  }}
                  disabled={!practiceAnswer.num || !practiceAnswer.den}
                  className="px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-bold text-lg hover:from-purple-500 hover:to-indigo-500 transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                  Comprobar Respuesta
                </button>
              )}
              
              {practiceStatus === 'correct' && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-6 w-full mt-4"
                >
                  <p className="text-emerald-400 font-black text-2xl flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 px-8 py-3 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    <CheckCircle2 size={28} /> ¡Correcto!
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button 
                      onClick={() => generateProblem(difficulty)}
                      className="px-8 py-3 bg-cyan-600 text-white rounded-full font-bold hover:bg-cyan-500 transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center gap-2"
                    >
                      Siguiente problema <ArrowRight size={20} />
                    </button>
                    {operation === 'mult' && !showPracticeExplanation && (
                      <button 
                        onClick={() => {
                          setStep(3);
                          setShowPracticeExplanation(true);
                          setTimeout(() => {
                            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                          }, 100);
                        }}
                        className="text-cyan-400 text-sm font-bold hover:text-cyan-300 hover:underline px-4 py-2"
                      >
                        Ver explicación paso a paso
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
              
              {practiceStatus === 'incorrect' && (
                <motion.div 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="flex flex-col items-center gap-6 w-full mt-4"
                >
                  <p className="text-rose-400 font-black text-xl bg-rose-500/10 border border-rose-500/30 px-8 py-3 rounded-full shadow-[0_0_20px_rgba(244,63,94,0.2)]">
                    Incorrecto. ¡Inténtalo de nuevo!
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <button 
                      onClick={() => setPracticeStatus('question')}
                      className="px-8 py-3 bg-slate-800 border border-slate-600 text-slate-200 rounded-full font-bold hover:bg-slate-700 transition-colors"
                    >
                      Reintentar
                    </button>
                    {operation === 'mult' && !showPracticeExplanation && (
                      <button 
                        onClick={() => {
                          setStep(3);
                          setShowPracticeExplanation(true);
                          setTimeout(() => {
                            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                          }, 100);
                        }}
                        className="px-8 py-3 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 rounded-full font-bold hover:bg-cyan-500/30 transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                      >
                        Ver Explicación
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
              
              <AnimatePresence>
                {showPracticeExplanation && operation === 'mult' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="w-full overflow-hidden"
                  >
                    <PracticeExplanation 
                      fractionA={fractionA} 
                      fractionB={multType === 'frac-frac' ? fractionB : { num: wholeNumber, den: 1 }} 
                      difficulty={difficulty} 
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Visualization Stage */}
        {(mode === 'explore' || (mode === 'practice' && step > 0)) && operation === 'mult' && (
          <div className="relative flex flex-col items-center gap-8 w-full">
            
            {mode === 'explore' && (
              <MathEquation 
                fractionA={fractionA} 
                fractionB={fractionBValue} 
                showResult={step >= 3} 
              />
            )}

            {multType === 'frac-frac' ? (
              <div 
                ref={containerRef}
                className="relative bg-white rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.1)] border-4 border-slate-800 touch-none overflow-hidden"
                style={{ width: containerSize.width, height: containerSize.height }}
              >
                <div className="absolute inset-0 bg-white" />
                <AcetateLayer
                  numerator={fractionA.num}
                  denominator={fractionA.den}
                  orientation="vertical"
                  color="bg-yellow-300"
                  borderColor="border-yellow-500"
                  width={containerSize.width}
                  height={containerSize.height}
                  isVisible={step >= 1}
                  isOverlapped={step === 3}
                />
                <motion.div
                  className="absolute top-0 left-0 z-10"
                  initial={{ x: 20, y: 20, opacity: 0, rotate: 5 }}
                  animate={{ 
                    x: step === 3 ? 0 : (step >= 2 ? 40 : 20), 
                    y: step === 3 ? 0 : (step >= 2 ? 40 : 20),
                    rotate: step === 3 ? 0 : (step >= 2 ? 5 : 5),
                    opacity: step >= 2 ? 1 : 0,
                    scale: step === 3 ? 1 : 1.05
                  }}
                  transition={{ type: "spring", stiffness: 60, damping: 15 }}
                  style={{ touchAction: 'none' }}
                  drag={step === 2}
                  dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
                  dragElastic={0.1}
                  onDragEnd={() => setStep(3)}
                >
                  <AcetateLayer
                    numerator={fractionB.num}
                    denominator={fractionB.den}
                    orientation="horizontal"
                    color="bg-cyan-300"
                    borderColor="border-cyan-500"
                    width={containerSize.width}
                    height={containerSize.height}
                    isVisible={true}
                    isDraggable={false}
                    isOverlapped={step === 3}
                    showBackground={step !== 3}
                    showBorder={step !== 3}
                  />
                </motion.div>
                {step === 2 && (
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="bg-slate-900/80 text-cyan-400 border border-cyan-500/50 px-6 py-3 rounded-full text-sm font-bold backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                      Arrastra para superponer
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              /* Fraction x Whole Number Visualization */
              <div className="flex flex-wrap justify-center gap-4 max-w-4xl">
                {step < 3 ? (
                  Array.from({ length: wholeNumber }).map((_, i) => (
                    <motion.div
                      key={`step12-${i}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: step >= 1 ? 1 : 0, scale: step >= 1 ? 1 : 0.8 }}
                      transition={{ delay: i * 0.1 }}
                      className="relative bg-white rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] border-2 border-slate-700 overflow-hidden aspect-square"
                      style={{ width: 'clamp(90px, 18vw, 120px)' }}
                    >
                      <AcetateLayer
                        numerator={step >= 2 ? fractionA.num : 0}
                        denominator={step >= 2 ? fractionA.den : 1}
                        orientation="vertical"
                        color="bg-yellow-400"
                        borderColor="border-yellow-500"
                        width={120}
                        height={120}
                        isVisible={true}
                      />
                    </motion.div>
                  ))
                ) : (
                  // Step 3: Combined
                  Array.from({ length: Math.ceil((fractionA.num * wholeNumber) / fractionA.den) }).map((_, i) => {
                    const totalParts = fractionA.num * wholeNumber;
                    const partsInThisWhole = Math.min(fractionA.den, totalParts - i * fractionA.den);
                    return (
                      <motion.div
                        key={`step3-${i}`}
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: i * 0.1, type: "spring" }}
                        className="relative bg-white rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] border-2 border-slate-700 overflow-hidden aspect-square"
                        style={{ width: 'clamp(90px, 18vw, 120px)' }}
                      >
                        <AcetateLayer
                          numerator={partsInThisWhole}
                          denominator={fractionA.den}
                          orientation="vertical"
                          color="bg-yellow-400"
                          borderColor="border-yellow-500"
                          width={120}
                          height={120}
                          isVisible={true}
                        />
                      </motion.div>
                    );
                  })
                )}
              </div>
            )}

            {/* Controls */}
            <div className="flex flex-wrap justify-center gap-4 mt-8 w-full max-w-md">
              <button
                onClick={handleReset}
                className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 border border-slate-700 text-slate-300 rounded-full font-bold hover:bg-slate-700 transition-all active:scale-95"
              >
                <RefreshCw size={18} />
                Reiniciar
              </button>

              {step < 3 && (
                <button
                  onClick={handleNextStep}
                  className="flex-[2] min-w-[160px] flex items-center justify-center gap-2 px-8 py-3 bg-cyan-600 text-white rounded-full font-bold hover:bg-cyan-500 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                >
                  {step === 0 ? 'Visualizar' : step === 1 ? (multType === 'frac-frac' ? 'Añadir Capa B' : 'Aplicar Fracción') : 'Ver Resultado'}
                  <ArrowRight size={18} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Explanation Section */}
        <AnimatePresence>
          {showExplanation && mode === 'explore' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="w-full mt-12"
            >
              <Explanation />
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
