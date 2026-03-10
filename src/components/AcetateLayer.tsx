import React from 'react';
import { motion } from 'motion/react';

interface AcetateLayerProps {
  numerator: number;
  denominator: number;
  orientation: 'vertical' | 'horizontal';
  color: string; // Tailwind color class for bg, e.g., 'bg-yellow-400'
  borderColor: string; // Tailwind color class for border, e.g., 'border-yellow-600'
  width: number;
  height: number;
  isVisible?: boolean;
  isDraggable?: boolean;
  isOverlapped?: boolean;
  onDragEnd?: () => void;
  style?: React.CSSProperties;
  dragConstraints?: React.RefObject<Element>;
}

export const AcetateLayer: React.FC<AcetateLayerProps> = ({
  numerator,
  denominator,
  orientation,
  color,
  borderColor,
  width,
  height,
  isVisible = true,
  isDraggable = false,
  isOverlapped = false,
  onDragEnd,
  style,
  dragConstraints,
}) => {
  // Generate grid lines
  const lines = [];
  const step = orientation === 'vertical' ? width / denominator : height / denominator;

  for (let i = 1; i < denominator; i++) {
    const pos = i * step;
    lines.push(
      <line
        key={i}
        x1={orientation === 'vertical' ? pos : 0}
        y1={orientation === 'vertical' ? 0 : pos}
        x2={orientation === 'vertical' ? pos : width}
        y2={orientation === 'vertical' ? height : pos}
        stroke="currentColor"
        strokeWidth="2"
        className="text-gray-800 opacity-30"
      />
    );
  }

  // Generate filled area
  // For vertical (Fraction A), we fill from left to right
  // For horizontal (Fraction B), we fill from top to bottom (or bottom to top, standard is usually top-down)
  const fillWidth = orientation === 'vertical' ? (width / denominator) * numerator : width;
  const fillHeight = orientation === 'vertical' ? height : (height / denominator) * numerator;

  return (
    <motion.div
      className={`absolute top-0 left-0 overflow-hidden rounded-lg border-2 border-gray-800 shadow-lg ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{
        width,
        height,
        ...style,
      }}
      drag={isDraggable}
      dragConstraints={dragConstraints}
      dragElastic={0.1}
      dragMomentum={false}
      onDragEnd={onDragEnd}
      initial={false}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background (Transparent Acetate) */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />

      {/* Colored Part (Normal, fades out on overlap) */}
      <div
        className={`absolute top-0 left-0 ${color} transition-all duration-1000 ease-in-out`}
        style={{
          width: fillWidth,
          height: fillHeight,
          opacity: isOverlapped ? 0 : 0.85,
        }}
      />

      {/* Colored Part (Multiply, fades in on overlap) */}
      <div
        className={`absolute top-0 left-0 ${color} mix-blend-multiply transition-all duration-1000 ease-in-out`}
        style={{
          width: fillWidth,
          height: fillHeight,
          opacity: isOverlapped ? 1 : 0,
        }}
      />

      {/* Grid Lines Overlay */}
      <svg width="100%" height="100%" className="absolute inset-0 pointer-events-none">
        {lines}
      </svg>
      
      {/* Border for the whole square */}
      <div className={`absolute inset-0 border-2 ${borderColor} pointer-events-none rounded-lg opacity-50`} />
    </motion.div>
  );
};
