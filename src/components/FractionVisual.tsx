import React from 'react';
import { motion } from 'motion/react';
import { VisualShape } from '../types/visual';

interface FractionVisualProps {
  num: number;
  den: number;
  colorClass: string;
  shape: VisualShape;
  sizeClass?: string;
}

const colorMap: Record<string, string> = {
  'bg-yellow-400': '#facc15',
  'bg-cyan-400': '#22d3ee',
  'bg-emerald-400': '#34d399',
  'bg-pink-400': '#f472b6',
};

const borderMap: Record<string, string> = {
  'border-yellow-500': '#eab308',
  'border-cyan-500': '#06b6d4',
  'border-emerald-500': '#10b981',
  'border-pink-500': '#ec4899',
};

const pickToken = (colorClass: string, prefix: string) =>
  colorClass.split(' ').find((token) => token.startsWith(prefix));

const getFillColor = (colorClass: string) => {
  const bg = pickToken(colorClass, 'bg-');
  return bg && colorMap[bg] ? colorMap[bg] : '#cbd5f5';
};

const getStrokeColor = (colorClass: string) => {
  const border = pickToken(colorClass, 'border-');
  return border && borderMap[border] ? borderMap[border] : '#334155';
};

const polarToCartesian = (cx: number, cy: number, r: number, angleDeg: number) => {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
};

const describeArc = (cx: number, cy: number, r: number, startAngle: number, endAngle: number) => {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    'Z',
  ].join(' ');
};

const getGridFactors = (den: number, shape: VisualShape) => {
  const root = Math.floor(Math.sqrt(den));
  for (let r = root; r >= 1; r -= 1) {
    if (den % r === 0) {
      const rows = r;
      const cols = den / r;
      if (rows === 1 && shape === 'square') {
        return { rows: den, cols: 1 };
      }
      return { rows, cols };
    }
  }
  return shape === 'square' ? { rows: den, cols: 1 } : { rows: 1, cols: den };
};

export const FractionVisual: React.FC<FractionVisualProps> = ({
  num,
  den,
  colorClass,
  shape,
  sizeClass = 'w-[clamp(100px,22vw,168px)]',
}) => {
  const wholes = Math.max(1, Math.ceil(num / den));
  const aspectRatio = shape === 'rect' ? '4 / 3' : '1 / 1';
  const roundedClass = shape === 'circle' ? 'rounded-full' : 'rounded-xl';
  const fillColor = getFillColor(colorClass);
  const strokeColor = getStrokeColor(colorClass);

  const renderGrid = (actualNum: number, actualDen: number) => {
    const { rows, cols } = getGridFactors(actualDen, shape);
    const gap = actualDen >= 16 ? 1 : actualDen >= 10 ? 2 : 4;
    const padding = actualDen >= 16 ? 4 : actualDen >= 10 ? 6 : 8;
    return (
      <div
        className="grid w-full h-full"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          gap: `${gap}px`,
          padding: `${padding}px`,
        }}
      >
        {Array.from({ length: actualDen }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.03 }}
            className={`rounded-md border-2 ${i < actualNum ? colorClass : 'bg-slate-800/50 border-slate-700'}`}
          />
        ))}
      </div>
    );
  };

  const renderCircle = (actualNum: number, actualDen: number) => {
    const angleStep = 360 / actualDen;
    return (
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
        {Array.from({ length: actualDen }).map((_, i) => {
          const start = i * angleStep;
          const end = start + angleStep;
          const path = describeArc(50, 50, 48, start, end);
          const filled = i < actualNum;
          return (
            <path
              key={i}
              d={path}
              style={{ fill: filled ? fillColor : 'rgba(30, 41, 59, 0.6)', stroke: strokeColor }}
              strokeWidth={1}
            />
          );
        })}
        <circle cx="50" cy="50" r="48" style={{ stroke: '#334155' }} strokeWidth={2} fill="none" />
      </svg>
    );
  };

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {Array.from({ length: wholes }).map((_, wIndex) => {
        const partsInThisWhole = Math.min(den, Math.max(0, num - wIndex * den));
        return (
          <div
            key={wIndex}
            className={`relative bg-slate-900 border-2 border-slate-700 overflow-hidden shadow-lg p-1 ${roundedClass} ${sizeClass}`}
            style={{ aspectRatio }}
          >
            {shape === 'circle' ? renderCircle(partsInThisWhole, den) : renderGrid(partsInThisWhole, den)}
          </div>
        );
      })}
    </div>
  );
};
