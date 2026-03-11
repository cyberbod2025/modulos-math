/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MainMenu } from './components/MainMenu';
import { RationalMenu } from './components/RationalMenu';
import { IntegersMenu } from './components/IntegersMenu';
import { AlgebraMenu } from './components/AlgebraMenu';

import MultiplicationModule from './modules/MultiplicationModule';
import AddSubModule from './modules/AddSubModule';
import PartWholeModule from './modules/PartWholeModule';
import CompareModule from './modules/CompareModule';
import EquivalentModule from './modules/EquivalentModule';
import IntegersIntroModule from './modules/IntegersIntroModule';
import IntegersReductionModule from './modules/IntegersReductionModule';
import IntegersSignsModule from './modules/IntegersSignsModule';
import AlgebraLangModule from './modules/AlgebraLangModule';
import AlgebraLinearModule from './modules/AlgebraLinearModule';
import AlgebraSystemsModule from './modules/AlgebraSystemsModule';
import { PlaceholderModule } from './modules/PlaceholderModule';

import { VisualShape } from './types/visual';

function App() {
  const [currentModule, setCurrentModule] = useState<string>('menu');
  const [visualShape, setVisualShape] = useState<VisualShape>('square');

  const handleBackToMenu = () => setCurrentModule('menu');
  const handleBackToRational = () => setCurrentModule('menu-rational');
  const handleBackToIntegers = () => setCurrentModule('menu-integers');
  const handleBackToAlgebra = () => setCurrentModule('menu-algebra');

  // Category Menus
  if (currentModule === 'menu') {
    return <MainMenu onSelect={setCurrentModule} />;
  }
  if (currentModule === 'menu-rational') {
    return <RationalMenu onSelect={setCurrentModule} onBack={handleBackToMenu} />;
  }
  if (currentModule === 'menu-integers') {
    return <IntegersMenu onSelect={setCurrentModule} onBack={handleBackToMenu} />;
  }
  if (currentModule === 'menu-algebra') {
    return <AlgebraMenu onSelect={setCurrentModule} onBack={handleBackToMenu} />;
  }

  // Rational Numbers Modules
  if (currentModule === 'mult-div') {
    return <MultiplicationModule onBack={handleBackToRational} visualShape={visualShape} onShapeChange={setVisualShape} />;
  }
  if (currentModule === 'add-sub') {
    return <AddSubModule onBack={handleBackToRational} visualShape={visualShape} onShapeChange={setVisualShape} />;
  }
  if (currentModule === 'part-whole') {
    return <PartWholeModule onBack={handleBackToRational} visualShape={visualShape} onShapeChange={setVisualShape} />;
  }
  if (currentModule === 'compare') {
    return <CompareModule onBack={handleBackToRational} visualShape={visualShape} onShapeChange={setVisualShape} />;
  }
  if (currentModule === 'equivalent') {
    return <EquivalentModule onBack={handleBackToRational} visualShape={visualShape} onShapeChange={setVisualShape} />;
  }

  // Integers Modules
  if (currentModule === 'integers-intro') {
    return <IntegersIntroModule onBack={handleBackToIntegers} />;
  }
  if (currentModule === 'integers-reduction') {
    return <IntegersReductionModule onBack={handleBackToIntegers} />;
  }
  if (currentModule === 'integers-signs') {
    return <IntegersSignsModule onBack={handleBackToIntegers} />;
  }

  // Algebra Modules
  if (currentModule === 'algebra-lang') {
    return <AlgebraLangModule onBack={handleBackToAlgebra} />;
  }
  if (currentModule === 'algebra-linear') {
    return <AlgebraLinearModule onBack={handleBackToAlgebra} />;
  }
  if (currentModule === 'algebra-systems') {
    return <AlgebraSystemsModule onBack={handleBackToAlgebra} />;
  }

  // Variables para Placeholders Modulos Nuevos:
  const getSubMenuBackHandler = (id: string) => {
    if (id.startsWith('integers-')) return handleBackToIntegers;
    if (id.startsWith('algebra-')) return handleBackToAlgebra;
    return handleBackToMenu;
  };
  const getSubMenuTitle = (id: string) => {
    switch (id) {
      case 'integers-intro': return 'Conceptos y Recta Numérica';
      case 'integers-reduction': return 'Reducciones de Signos';
      case 'integers-signs': return 'Ley de los Signos (Mult/Div)';
      case 'algebra-lang': return 'Lenguaje Algebraico y Evaluación';
      case 'algebra-linear': return 'Ecuaciones de 1er Grado';
      case 'algebra-systems': return 'Sistemas de Ecuaciones';
      default: return 'Módulo en desarrollo';
    }
  }

  // Placeholder para modulos de Enteros / Algebra
  return <PlaceholderModule title={getSubMenuTitle(currentModule)} onBack={getSubMenuBackHandler(currentModule)} />;
}

export default App;
