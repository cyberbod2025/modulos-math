import React from 'react';
import { Calculator, Grid3X3, CheckCircle, Layers } from 'lucide-react';

interface Props {
  fractionA: { num: number; den: number };
  fractionB: { num: number; den: number };
  difficulty: string;
}

export const PracticeExplanation: React.FC<Props> = ({ fractionA, fractionB, difficulty }) => {
  const isWholeNumber = fractionB.den === 1;
  const resNum = fractionA.num * fractionB.num;
  const resDen = fractionA.den * fractionB.den;

  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(resNum, resDen);
  const simNum = resNum / divisor;
  const simDen = resDen / divisor;
  const canSimplify = divisor > 1;

  return (
    <div className="bg-slate-900/80 rounded-2xl p-6 sm:p-8 mt-8 border border-slate-700 text-left w-full shadow-[0_0_30px_rgba(0,0,0,0.5)]">
      <h3 className="text-xl font-black text-cyan-400 mb-6 flex items-center gap-3 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">
        <Calculator size={24} /> Explicación Paso a Paso
      </h3>
      
      <div className="space-y-6">
        {!isWholeNumber ? (
          <>
            <div className="bg-slate-950/50 p-5 rounded-xl border border-slate-800 shadow-inner">
              <h4 className="font-bold text-slate-200 flex items-center gap-2 mb-3">
                <Grid3X3 size={18} className="text-purple-400" /> 1. Encontrar el Denominador (El Todo)
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                La primera fracción divide el cuadrado en <strong className="text-yellow-400">{fractionA.den} columnas</strong>. 
                La segunda fracción lo divide en <strong className="text-cyan-400">{fractionB.den} filas</strong>. 
                Al superponerlas, se forma una cuadrícula de <strong className="text-purple-400">{fractionA.den} × {fractionB.den} = {resDen}</strong> cuadritos en total. Este es nuestro nuevo denominador.
              </p>
            </div>

            <div className="bg-slate-950/50 p-5 rounded-xl border border-slate-800 shadow-inner">
              <h4 className="font-bold text-slate-200 flex items-center gap-2 mb-3">
                <Grid3X3 size={18} className="text-emerald-400" /> 2. Encontrar el Numerador (Las Partes)
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Tomamos <strong className="text-yellow-400">{fractionA.num} columnas</strong> (amarillo) y <strong className="text-cyan-400">{fractionB.num} filas</strong> (azul). 
                El área donde se cruzan ambos colores (verde) tiene <strong className="text-emerald-400">{fractionA.num} × {fractionB.num} = {resNum}</strong> cuadritos. Este es nuestro nuevo numerador.
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-slate-950/50 p-5 rounded-xl border border-slate-800 shadow-inner">
              <h4 className="font-bold text-slate-200 flex items-center gap-2 mb-3">
                <Layers size={18} className="text-pink-400" /> 1. Entender la Multiplicación
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Multiplicar una fracción por un número entero significa que tenemos <strong className="text-pink-400">{fractionB.num} copias</strong> de esa fracción.
                En este caso, tenemos <strong className="text-pink-400">{fractionB.num}</strong> enteros, y de cada uno tomamos <strong className="text-yellow-400">{fractionA.num}/{fractionA.den}</strong>.
              </p>
            </div>

            <div className="bg-slate-950/50 p-5 rounded-xl border border-slate-800 shadow-inner">
              <h4 className="font-bold text-slate-200 flex items-center gap-2 mb-3">
                <Grid3X3 size={18} className="text-emerald-400" /> 2. Contar las Partes
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Si tomamos <strong className="text-yellow-400">{fractionA.num} partes</strong> de cada uno de los <strong className="text-pink-400">{fractionB.num} enteros</strong>, 
                en total tendremos <strong className="text-emerald-400">{fractionA.num} × {fractionB.num} = {resNum} partes</strong>.
                Como cada entero sigue estando dividido en <strong className="text-yellow-400">{fractionA.den}</strong>, el denominador no cambia.
              </p>
            </div>
          </>
        )}

        <div className="bg-slate-950/50 p-5 rounded-xl border border-slate-800 shadow-inner">
          <h4 className="font-bold text-slate-200 flex items-center gap-2 mb-4">
            <CheckCircle size={18} className="text-cyan-400" /> 3. Resultado Numérico
          </h4>
          <p className="text-slate-400 text-sm mb-6">
            Multiplicamos los numeradores y los denominadores directamente:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-2xl sm:text-3xl font-black overflow-x-auto pb-4">
            <div className="flex flex-col items-center text-yellow-400">
              <span className="border-b-4 border-yellow-400/50 px-2">{fractionA.num}</span>
              <span>{fractionA.den}</span>
            </div>
            <span className="text-slate-600">×</span>
            {isWholeNumber ? (
              <div className="flex flex-col items-center text-pink-400">
                <span>{fractionB.num}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center text-cyan-400">
                <span className="border-b-4 border-cyan-400/50 px-2">{fractionB.num}</span>
                <span>{fractionB.den}</span>
              </div>
            )}
            <span className="text-slate-600">=</span>
            <div className="flex flex-col items-center text-purple-400">
              <span className="border-b-4 border-purple-400/50 px-2">{fractionA.num} × {fractionB.num}</span>
              <span>{fractionA.den} {isWholeNumber ? '' : `× ${fractionB.den}`}</span>
            </div>
            <span className="text-slate-600">=</span>
            <div className="flex flex-col items-center text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
              <span className="border-b-4 border-emerald-400/50 px-2">{resNum}</span>
              <span>{resDen}</span>
            </div>
          </div>
          
          {canSimplify && (
            <div className="mt-6 pt-5 border-t border-slate-800 text-sm text-slate-400 bg-slate-900/50 p-4 rounded-xl">
              <strong className="text-cyan-400">Nota de simplificación:</strong> Esta fracción se puede simplificar dividiendo el numerador y el denominador entre {divisor}. El resultado simplificado es 
              <span className="font-black text-emerald-400 ml-2 text-lg drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">{simNum}/{simDen}</span>.
              {difficulty === 'dificil' && " En el nivel difícil, siempre es recomendable buscar la fracción más simple."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
