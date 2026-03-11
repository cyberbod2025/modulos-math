/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MainMenu } from './components/MainMenu';
import MultiplicationModule from './modules/MultiplicationModule';
import AddSubModule from './modules/AddSubModule';
import PartWholeModule from './modules/PartWholeModule';
import CompareModule from './modules/CompareModule';
import EquivalentModule from './modules/EquivalentModule';
import { VisualShape } from './types/visual';

function App() {
  const [currentModule, setCurrentModule] = useState<string>('menu');
  const [visualShape, setVisualShape] = useState<VisualShape>('square');

  const handleBack = () => setCurrentModule('menu');

  if (currentModule === 'menu') {
    return <MainMenu onSelect={setCurrentModule} />;
  }

  if (currentModule === 'mult-div') {
    return <MultiplicationModule onBack={handleBack} visualShape={visualShape} onShapeChange={setVisualShape} />;
  }

  if (currentModule === 'add-sub') {
    return <AddSubModule onBack={handleBack} visualShape={visualShape} onShapeChange={setVisualShape} />;
  }

  if (currentModule === 'part-whole') {
    return <PartWholeModule onBack={handleBack} visualShape={visualShape} onShapeChange={setVisualShape} />;
  }

  if (currentModule === 'compare') {
    return <CompareModule onBack={handleBack} visualShape={visualShape} onShapeChange={setVisualShape} />;
  }

  if (currentModule === 'equivalent') {
    return <EquivalentModule onBack={handleBack} visualShape={visualShape} onShapeChange={setVisualShape} />;
  }

  return <MainMenu onSelect={setCurrentModule} />;
}

export default App;


