import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FractionInput } from '../components/FractionInput';
import { MathEquation } from '../components/MathEquation';
import { RefreshCw, ArrowRight, PlusSquare, Compass, Brain, ArrowLeft, CheckCircle2, MinusSquare, XSquare } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export default function AddSubModule({ onBack }: Props) {
  const [mode, setMode] = useState<'explore' | 'practice'>('explore');
  const [operation, setOperation] = useState<'add' | 'sub'>('add');
  const [denType, setDenType] = useState<'same' | 'diff'>('same');
  const [difficulty, setDifficulty] = useState<'facil' | 'medio' | 'dificil'>('facil');
  
  // Practice mode states
  const [practiceAnswer, setPracticeAnswer] = useState({ num: '', den: '' });
  const [practiceStatus, setPracticeStatus] = useState<'question' | 'correct' | 'incorrect'>('question');
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const [fractionA, setFractionA] = useState({ num: 1, den: 4 });
  const [fractionB, setFractionB] = useState({ num: 2, den: 4 });
  
  const [step, setStep] = useState(0); // 0: Input, 1: Show A & B, 2: Common Denominator (if diff), 3: Result
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 300, height: 300 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = Math.min(window.innerWidth - 40, 400);
        setContainerSize({ width, height: width });
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
    
    let denA = Math.floor(Math.random() * (maxDen - minDen + 1)) + minDen;
    let numA = Math.floor(Math.random() * (denA - 1)) + 1;
    
    let denB = denType === 'same' ? denA : Math.floor(Math.random() * (maxDen - minDen + 1)) + minDen;
    if (denType === 'diff' && denA === denB) {
      denB = denB === maxDen ? minDen : denB + 1;
    }
    
    let numB = Math.floor(Math.random() * (denB - 1)) + 1;

    // For subtraction, ensure A >= B
    if (operation === 'sub') {
      const valA = numA / denA;
      const valB = numB / denB;
      if (valB > valA) {
        // Swap
        const tempNum = numA; const tempDen = denA;
        numA = numB; denA = denB;
        numB = tempNum; denB = tempDen;
      }
    }
    
    setFractionA({ num: numA, den: denA });
    setFractionB({ num: numB, den: denB });

    setStep(0);
    setPracticeAnswer({ num: '', den: '' });
    setPracticeStatus('question');
  };

  const handleModeSwitch = (newMode: 'explore' | 'practice') => {
    setMode(newMode);
    if (newMode === 'practice') {
      setScore({ correct: 0, total: 0 });
      generateProblem(difficulty);
    } else {
      setStep(0);
      setFractionA({ num: 1, den: 4 });
      setFractionB({ num: 2, den: 4 });
      setDenType('same');
    }
  };

  const handleOperationSwitch = (op: 'add' | 'sub') => {
    setOperation(op);
    setStep(0);
    if (mode === 'practice') {
      generateProblem(difficulty);
    } else {
      if (op === 'sub') {
        const valA = fractionA.num / fractionA.den;
        const valB = fractionB.num / fractionB.den;
        if (valB > valA) {
          setFractionA(fractionB);
          setFractionB(fractionA);
        }
      }
    }
  };

  const handleDenTypeSwitch = (type: 'same' | 'diff') => {
    setDenType(type);
    setStep(0);
    if (mode === 'practice') {
      generateProblem(difficulty);
    } else {
      if (type === 'same') {
        setFractionB({ ...fractionB, den: fractionA.den });
      } else {
        setFractionB({ num: 1, den: fractionA.den === 3 ? 4 : 3 });
      }
    }
  };

  const handleDifficultyChange = (newDiff: 'facil' | 'medio' | 'dificil') => {
    setDifficulty(newDiff);
    generateProblem(newDiff);
  };

  const handleNextStep = () => {
    const maxStep = denType === 'same' ? 2 : 3;
    setStep((prev) => Math.min(prev + 1, maxStep));
  };

  const handleReset = () => {
    setStep(0);
  };

  const checkAnswer = () => {
    const pNum = parseInt(practiceAnswer.num);
    const pDen = parseInt(practiceAnswer.den);
    
    if (isNaN(pNum) || isNaN(pDen) || pDen <= 0) return;

    let expectedNum = 0;
    let expectedDen = 1;

    if (denType === 'same') {
      expectedDen = fractionA.den;
      expectedNum = operation === 'add' ? fractionA.num + fractionB.num : fractionA.num - fractionB.num;
    } else {
      expectedDen = fractionA.den * fractionB.den;
      const aNum = fractionA.num * fractionB.den;
      const bNum = fractionB.num * fractionA.den;
      expectedNum = operation === 'add' ? aNum + bNum : aNum - bNum;
    }

    // Check if equivalent
    const isCorrect = (pNum * expectedDen) === (expectedNum * pDen);

    if (isCorrect) {
      setPracticeStatus('correct');
      setScore(s => ({ ...s, correct: s.correct + 1, total: s.total + 1 }));
    } else {
      setPracticeStatus('incorrect');
      setScore(s => ({ ...s, total: s.total + 1 }));
    }
  };

  const steps = denType === 'same' ? [
    { title: "Definir Valores", description: "Introduce las fracciones." },
    { title: "Visualizar", description: "Observa las representaciones." },
    { title: "Resultado Final", description: "Combina las partes." },
  ] : [
    { title: "Definir Valores", description: "Introduce las fracciones." },
    { title: "Visualizar", description: "Observa las representaciones." },
    { title: "Denominador Común", description: "Encuentra fracciones equivalentes." },
    { title: "Resultado Final", description: "Combina las partes." },
  ];

  // Helper to render a fraction grid
  const renderGrid = (num: number, den: number, color: string, commonDen?: number) => {
    const actualDen = commonDen || den;
    const actualNum = commonDen ? (num * (commonDen / den)) : num;
    
    return (
      <div className="grid gap-1 w-full h-full p-2" style={{ 
        gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(actualDen))}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${Math.ceil(actualDen / Math.ceil(Math.sqrt(actualDen)))}, minmax(0, 1fr))`
      }}>
        {Array.from({ length: actualDen }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`rounded-md border-2 ${i < actualNum ? color : 'bg-slate-800/50 border-slate-700'}`}
          />
        ))}
      </div>
    );
  };

  const commonDen = denType === 'diff' ? fractionA.den * fractionB.den : fractionA.den;
  const aNumCommon = denType === 'diff' ? fractionA.num * fractionB.den : fractionA.num;
  const bNumCommon = denType === 'diff' ? fractionB.num * fractionA.den : fractionB.num;
  const resultNum = operation === 'add' ? aNumCommon + bNumCommon : aNumCommon - bNumCommon;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30 pb-20">
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 py-4 px-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)] sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button onClick={onBack} className="text-slate-400 hover:text-blue-400 transition-colors p-2 -ml-2">
              <ArrowLeft size={24} />
            </button>
            <div className="w-10 h-10 bg-blue-500/20 border border-blue-500 rounded-xl flex items-center justify-center text-blue-400 font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <PlusSquare size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-100 hidden sm:block">Suma y Resta</h1>
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700">
              <button
                onClick={() => handleModeSwitch('explore')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  mode === 'explore' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.2)]' : 'text-slate-400 hover:text-slate-200'
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
        
        {/* Type Selectors */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full max-w-2xl justify-center">
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 shadow-lg">
            <button
              onClick={() => handleOperationSwitch('add')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                operation === 'add' 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <PlusSquare size={16} /> Suma
            </button>
            <button
              onClick={() => handleOperationSwitch('sub')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                operation === 'sub' 
                  ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MinusSquare size={16} /> Resta
            </button>
          </div>

          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 shadow-lg">
            <button
              onClick={() => handleDenTypeSwitch('same')}
              className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                denType === 'same' 
                  ? 'bg-slate-700 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Mismo Denominador
            </button>
            <button
              onClick={() => handleDenTypeSwitch('diff')}
              className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                denType === 'diff' 
                  ? 'bg-slate-700 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Diferente Denominador
            </button>
          </div>
        </div>

        {mode === 'explore' && (
          <>
            {/* Step Indicator */}
            <div className="w-full max-w-2xl mb-12">
              <div className="flex justify-between items-center relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -z-10 rounded-full" />
                <motion.div 
                  className="absolute top-1/2 left-0 h-1 bg-blue-500 -z-10 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" 
                  initial={{ width: '0%' }}
                  animate={{ width: `${(step / (steps.length - 1)) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
                {steps.map((s, i) => (
                  <div key={i} className="flex flex-col items-center relative group">
                    <motion.div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors duration-300 ${
                        i <= step 
                          ? 'bg-slate-900 border-blue-400 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
                          : 'bg-slate-900 border-slate-700 text-slate-500'
                      }`}
                      animate={i === step ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      {i + 1}
                    </motion.div>
                    <div className="absolute top-14 w-32 text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <p className="text-xs font-bold text-slate-300">{s.title}</p>
                      <p className="text-[10px] text-slate-500">{s.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Interactive Area */}
            <div className="w-full max-w-4xl bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl p-6 sm:p-10 flex flex-col items-center shadow-[0_0_50px_rgba(0,0,0,0.3)]">
              
              {/* Equation Display */}
              <div className="mb-12 flex items-center justify-center gap-4 sm:gap-8 text-3xl sm:text-5xl font-black">
                {step === 0 ? (
                  <>
                    <FractionInput 
                      value={fractionA} 
                      onChange={setFractionA} 
                      color="text-yellow-400" 
                      borderColor="border-yellow-500/50" 
                    />
                    <span className="text-slate-500">{operation === 'add' ? '+' : '-'}</span>
                    <FractionInput 
                      value={fractionB} 
                      onChange={setFractionB} 
                      color="text-cyan-400" 
                      borderColor="border-cyan-500/50" 
                      disabledDen={denType === 'same'}
                    />
                  </>
                ) : (
                  <MathEquation 
                    fractionA={fractionA} 
                    fractionB={fractionB} 
                    operation={operation === 'add' ? '+' : '-'}
                    result={{ num: resultNum, den: commonDen }} 
                    showResult={step === (steps.length - 1)} 
                    commonDen={step >= 2 && denType === 'diff' ? commonDen : undefined}
                    aNumCommon={aNumCommon}
                    bNumCommon={bNumCommon}
                  />
                )}
              </div>

              {/* Visualizations */}
              {step >= 1 && (
                <div className="flex flex-wrap justify-center gap-8 items-center w-full">
                  {/* Fraction A */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-48 h-48 bg-slate-900 rounded-xl border-2 border-slate-700 overflow-hidden relative shadow-[0_0_20px_rgba(250,204,21,0.1)]">
                      {renderGrid(fractionA.num, fractionA.den, 'bg-yellow-400 border-yellow-500', step >= 2 && denType === 'diff' ? commonDen : undefined)}
                    </div>
                    <span className="text-yellow-400 font-bold">
                      {step >= 2 && denType === 'diff' ? `${aNumCommon}/${commonDen}` : `${fractionA.num}/${fractionA.den}`}
                    </span>
                  </div>

                  <span className="text-4xl text-slate-600 font-black">{operation === 'add' ? '+' : '-'}</span>

                  {/* Fraction B */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-48 h-48 bg-slate-900 rounded-xl border-2 border-slate-700 overflow-hidden relative shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                      {renderGrid(fractionB.num, fractionB.den, 'bg-cyan-400 border-cyan-500', step >= 2 && denType === 'diff' ? commonDen : undefined)}
                    </div>
                    <span className="text-cyan-400 font-bold">
                      {step >= 2 && denType === 'diff' ? `${bNumCommon}/${commonDen}` : `${fractionB.num}/${fractionB.den}`}
                    </span>
                  </div>

                  {step === (steps.length - 1) && (
                    <>
                      <span className="text-4xl text-slate-600 font-black">=</span>
                      {/* Result */}
                      <div className="flex flex-col items-center gap-4">
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="w-48 h-48 bg-slate-900 rounded-xl border-2 border-slate-700 overflow-hidden relative shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                        >
                          {renderGrid(resultNum, commonDen, 'bg-emerald-400 border-emerald-500')}
                        </motion.div>
                        <span className="text-emerald-400 font-bold">
                          {resultNum}/{commonDen}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Controls */}
              <div className="flex flex-wrap justify-center gap-4 mt-12 w-full max-w-md">
                <button
                  onClick={handleReset}
                  className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 border border-slate-700 text-slate-300 rounded-full font-bold hover:bg-slate-700 transition-all active:scale-95"
                >
                  <RefreshCw size={18} />
                  Reiniciar
                </button>

                {step < steps.length - 1 && (
                  <button
                    onClick={handleNextStep}
                    className="flex-[2] min-w-[160px] flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                  >
                    {step === 0 ? 'Visualizar' : step === 1 && denType === 'diff' ? 'Denominador Común' : 'Ver Resultado'}
                    <ArrowRight size={18} />
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {mode === 'practice' && (
          <div className="w-full max-w-3xl flex flex-col items-center">
            {/* Practice Mode UI */}
            <div className="w-full flex justify-between items-center mb-8 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-lg">
              <div className="flex gap-2">
                {['facil', 'medio', 'dificil'].map((d) => (
                  <button
                    key={d}
                    onClick={() => handleDifficultyChange(d as any)}
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
                <span className="text-xl text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">{score.correct}</span>
                <span className="text-slate-600">/</span>
                <span className="text-xl">{score.total}</span>
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl p-8 sm:p-12 w-full flex flex-col items-center shadow-[0_0_50px_rgba(0,0,0,0.3)] relative overflow-hidden">
              <h2 className="text-2xl font-black text-slate-200 mb-8">Resuelve la operación:</h2>
              
              <div className="flex items-center justify-center gap-4 sm:gap-8 text-4xl sm:text-6xl font-black mb-12">
                <div className="flex flex-col items-center text-yellow-400">
                  <span className="border-b-4 border-yellow-400/50 px-2">{fractionA.num}</span>
                  <span>{fractionA.den}</span>
                </div>
                <span className="text-slate-500">{operation === 'add' ? '+' : '-'}</span>
                <div className="flex flex-col items-center text-cyan-400">
                  <span className="border-b-4 border-cyan-400/50 px-2">{fractionB.num}</span>
                  <span>{fractionB.den}</span>
                </div>
                <span className="text-slate-500">=</span>
                
                {practiceStatus === 'question' ? (
                  <div className="flex flex-col items-center gap-2">
                      <input
                        type="number"
                        value={practiceAnswer.num}
                        onChange={(e) => setPracticeAnswer(p => ({ ...p, num: e.target.value }))}
                        className="w-20 h-16 bg-slate-950 border-2 border-slate-700 rounded-xl text-center text-3xl text-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                        placeholder="?"
                        min="0"
                      />
                    <div className="w-full h-1 bg-slate-700 rounded-full" />
                      <input
                        type="number"
                        value={practiceAnswer.den}
                        onChange={(e) => setPracticeAnswer(p => ({ ...p, den: e.target.value }))}
                        className="w-20 h-16 bg-slate-950 border-2 border-slate-700 rounded-xl text-center text-3xl text-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                        placeholder="?"
                        min="1"
                      />
                  </div>
                ) : (
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`flex flex-col items-center ${practiceStatus === 'correct' ? 'text-emerald-400' : 'text-rose-400'}`}
                  >
                    <span className={`border-b-4 px-2 ${practiceStatus === 'correct' ? 'border-emerald-400/50' : 'border-rose-400/50'}`}>
                      {practiceAnswer.num}
                    </span>
                    <span>{practiceAnswer.den}</span>
                  </motion.div>
                )}
              </div>

              <AnimatePresence mode="wait">
                {practiceStatus === 'question' ? (
                  <motion.button
                    key="check"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    onClick={checkAnswer}
                    disabled={!practiceAnswer.num || !practiceAnswer.den}
                    className="px-10 py-4 bg-purple-600 text-white rounded-full font-bold text-lg hover:bg-purple-500 transition-all shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_30px_rgba(147,51,234,0.6)] disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 active:translate-y-0"
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
                        <>
                          <CheckCircle2 size={32} />
                          ¡Excelente!
                        </>
                      ) : (
                        <>
                          <XSquare size={32} />
                          Sigue intentando
                        </>
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
