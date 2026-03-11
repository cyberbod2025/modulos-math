import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FractionInput } from '../components/FractionInput';
import { MathEquation } from '../components/MathEquation';
import { FractionVisual } from '../components/FractionVisual';
import { VisualShapeToggle } from '../components/VisualShapeToggle';
import { ArrowRight, PlusSquare, Compass, Brain, ArrowLeft, CheckCircle2, MinusSquare, XSquare } from 'lucide-react';
import { VisualShape } from '../types/visual';

interface Props {
  onBack: () => void;
  visualShape: VisualShape;
  onShapeChange: (shape: VisualShape) => void;
}

export default function AddSubModule({ onBack, visualShape, onShapeChange }: Props) {
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
  const [equivalentA, setEquivalentA] = useState({ num: 1, den: 4 });
  const [equivalentB, setEquivalentB] = useState({ num: 2, den: 4 });
  
  const lastProblemKey = useRef('');

  const generateProblem = (diff: 'facil' | 'medio' | 'dificil') => {
    let minDen = 2, maxDen = 5;
    if (diff === 'medio') { minDen = 3; maxDen = 8; }
    if (diff === 'dificil') { minDen = 5; maxDen = 12; }

    let nextA = { num: 1, den: minDen };
    let nextB = { num: 1, den: minDen };
    let key = '';

    for (let tries = 0; tries < 20; tries++) {
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
          const tempNum = numA; const tempDen = denA;
          numA = numB; denA = denB;
          numB = tempNum; denB = tempDen;
        }
      }

      key = `${numA}/${denA}|${numB}/${denB}|${operation}|${denType}`;
      if (key !== lastProblemKey.current || tries === 19) {
        nextA = { num: numA, den: denA };
        nextB = { num: numB, den: denB };
        break;
      }
    }

    lastProblemKey.current = key;
    setFractionA(nextA);
    setFractionB(nextB);

    setPracticeAnswer({ num: '', den: '' });
    setPracticeStatus('question');
  };

  const handleModeSwitch = (newMode: 'explore' | 'practice') => {
    setMode(newMode);
    if (newMode === 'practice') {
      setScore({ correct: 0, total: 0 });
      generateProblem(difficulty);
    } else {
      setFractionA({ num: 1, den: 4 });
      setFractionB({ num: 2, den: 4 });
      setDenType('same');
    }
  };

  const handleOperationSwitch = (op: 'add' | 'sub') => {
    setOperation(op);
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

  useEffect(() => {
    setEquivalentA({ num: fractionA.num, den: fractionA.den });
  }, [fractionA.num, fractionA.den]);

  useEffect(() => {
    setEquivalentB({ num: fractionB.num, den: fractionB.den });
  }, [fractionB.num, fractionB.den]);

  useEffect(() => {
    if (denType === 'same') {
      setFractionB((prev) => (prev.den === fractionA.den ? prev : { ...prev, den: fractionA.den }));
    }
  }, [denType, fractionA.den]);

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

  const areEquivalent = (left: { num: number; den: number }, right: { num: number; den: number }) => {
    return left.num * right.den === right.num * left.den;
  };

  const isEquivalentA = areEquivalent(equivalentA, fractionA);
  const isEquivalentB = areEquivalent(equivalentB, fractionB);
  const hasCommonDen = equivalentA.den === equivalentB.den;
  const canOperate = isEquivalentA && isEquivalentB && hasCommonDen;

  const applyMultiplier = (target: 'a' | 'b', mult: number) => {
    if (target === 'a') {
      setEquivalentA((prev) => ({ num: prev.num * mult, den: prev.den * mult }));
      return;
    }
    setEquivalentB((prev) => ({ num: prev.num * mult, den: prev.den * mult }));
  };

  // Helper to render a fraction grid
  const resultNum = operation === 'add'
    ? equivalentA.num + equivalentB.num
    : equivalentA.num - equivalentB.num;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30 pb-4">
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 py-3 px-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)] sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button onClick={onBack} className="text-slate-400 hover:text-blue-400 transition-colors p-2 -ml-2 flex items-center gap-2" title="Volver al menú">
              <ArrowLeft size={24} />
              <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Menú</span>
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
            <VisualShapeToggle value={visualShape} onChange={onShapeChange} />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 sm:p-6 flex flex-col items-center mt-1">
        
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
          <div className="w-full max-w-5xl bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col items-center shadow-[0_0_50px_rgba(0,0,0,0.3)]">
            <div className="w-full mb-10">
              <p className="text-center text-slate-300 text-lg leading-relaxed">
                Para <strong className="text-blue-400">sumar o restar fracciones</strong> necesitamos partes del mismo tamaño.
                Por eso se <strong className="text-blue-400">igualan los denominadores</strong>. El método de la <strong className="text-blue-400">mariposa</strong> funciona porque convierte ambas fracciones a un denominador común.
              </p>
            </div>

            <div className="grid w-full gap-8 lg:grid-cols-2">
              <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-slate-200 mb-4">Fracciones originales</h3>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                  <div className="flex flex-col items-center gap-4">
                    <FractionInput 
                      value={fractionA} 
                      onChange={setFractionA} 
                      color="text-yellow-400" 
                      borderColor="border-yellow-500/50" 
                      allowImproper
                    />
                    <FractionVisual num={fractionA.num} den={fractionA.den} colorClass="bg-yellow-400 border-yellow-500" shape={visualShape} />
                  </div>

                  <span className="text-4xl text-slate-600 font-black">{operation === 'add' ? '+' : '-'}</span>

                  <div className="flex flex-col items-center gap-4">
                    <FractionInput 
                      value={fractionB} 
                      onChange={setFractionB} 
                      color="text-cyan-400" 
                      borderColor="border-cyan-500/50" 
                      disabledDen={denType === 'same'}
                      allowImproper
                    />
                    <FractionVisual num={fractionB.num} den={fractionB.den} colorClass="bg-cyan-400 border-cyan-500" shape={visualShape} />
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-slate-200 mb-2">Fracciones equivalentes</h3>
                <p className="text-sm text-slate-400 mb-6">
                  Ajusta numerador y denominador para que ambas fracciones tengan el mismo denominador.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                  <div className="flex flex-col items-center gap-4">
                    <FractionInput 
                      value={equivalentA} 
                      onChange={setEquivalentA} 
                      color="text-yellow-400" 
                      borderColor="border-yellow-500/50" 
                      allowImproper
                    />
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {[2, 3, 4].map((mult) => (
                        <button
                          key={`a-${mult}`}
                          onClick={() => applyMultiplier('a', mult)}
                          className="px-3 py-1 text-xs font-bold rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700"
                        >
                          × {mult}
                        </button>
                      ))}
                    </div>
                    <FractionVisual num={equivalentA.num} den={equivalentA.den} colorClass="bg-yellow-400 border-yellow-500" shape={visualShape} />
                    <span className={`text-xs font-bold uppercase tracking-wider ${isEquivalentA ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {isEquivalentA ? 'Equivalente' : 'No equivalente'}
                    </span>
                  </div>

                  <span className="text-4xl text-slate-600 font-black">{operation === 'add' ? '+' : '-'}</span>

                  <div className="flex flex-col items-center gap-4">
                    <FractionInput 
                      value={equivalentB} 
                      onChange={setEquivalentB} 
                      color="text-cyan-400" 
                      borderColor="border-cyan-500/50" 
                      allowImproper
                    />
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {[2, 3, 4].map((mult) => (
                        <button
                          key={`b-${mult}`}
                          onClick={() => applyMultiplier('b', mult)}
                          className="px-3 py-1 text-xs font-bold rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700"
                        >
                          × {mult}
                        </button>
                      ))}
                    </div>
                    <FractionVisual num={equivalentB.num} den={equivalentB.den} colorClass="bg-cyan-400 border-cyan-500" shape={visualShape} />
                    <span className={`text-xs font-bold uppercase tracking-wider ${isEquivalentB ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {isEquivalentB ? 'Equivalente' : 'No equivalente'}
                    </span>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border ${hasCommonDen ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' : 'text-slate-500 border-slate-700 bg-slate-900/60'}`}>
                    {hasCommonDen ? 'Denominadores iguales' : 'Denominadores distintos'}
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full mt-10">
              <MathEquation
                fractionA={equivalentA}
                fractionB={equivalentB}
                operation={operation === 'add' ? '+' : '-'}
                result={{ num: resultNum, den: equivalentA.den }}
                showResult={canOperate}
              />

              <div className="text-center text-sm font-bold uppercase tracking-wider">
                {canOperate ? (
                  <span className="text-emerald-400">Muy bien, ya son equivalentes. Puedes sumar o restar.</span>
                ) : (
                  <span className="text-slate-500">Iguala los denominadores para desbloquear la suma o resta.</span>
                )}
              </div>
            </div>
          </div>
        )}

        {mode === 'practice' && (
          <div className="w-full max-w-3xl flex flex-col items-center">
            {/* Practice Mode UI */}
            <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-lg">
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
              <div className="flex items-center gap-3">
                <button
                  onClick={() => generateProblem(difficulty)}
                  className="px-4 py-2 bg-slate-800 text-slate-200 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-slate-700 transition-all border border-slate-700"
                >
                  Nueva Práctica
                </button>
                <div className="text-slate-300 font-bold flex items-center gap-2">
                  <span className="text-sm uppercase tracking-wider text-slate-500">Puntuación:</span>
                  <span className="text-xl text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">{score.correct}</span>
                  <span className="text-slate-600">/</span>
                  <span className="text-xl">{score.total}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl p-4 sm:p-6 w-full flex flex-col items-center shadow-[0_0_50px_rgba(0,0,0,0.3)] relative overflow-hidden">
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

              <div className="mt-10 w-full">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <FractionVisual num={fractionA.num} den={fractionA.den} colorClass="bg-yellow-400 border-yellow-500" shape={visualShape} />
                  <span className="text-4xl text-slate-600 font-black">{operation === 'add' ? '+' : '-'}</span>
                  <FractionVisual num={fractionB.num} den={fractionB.den} colorClass="bg-cyan-400 border-cyan-500" shape={visualShape} />
                </div>
                <p className="text-center text-sm text-slate-400 mt-6">
                  Primero iguala los denominadores mentalmente, luego suma o resta las partes.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
