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

function App() {
  const [currentModule, setCurrentModule] = useState<string>('menu');

  const handleBack = () => setCurrentModule('menu');

  if (currentModule === 'menu') {
    return <MainMenu onSelect={setCurrentModule} />;
  }

  if (currentModule === 'mult-div') {
    return <MultiplicationModule onBack={handleBack} />;
  }

  if (currentModule === 'add-sub') {
    return <AddSubModule onBack={handleBack} />;
  }

  if (currentModule === 'part-whole') {
    return <PartWholeModule onBack={handleBack} />;
  }

  if (currentModule === 'compare') {
    return <CompareModule onBack={handleBack} />;
  }

  if (currentModule === 'equivalent') {
    return <EquivalentModule onBack={handleBack} />;
  }

  return <MainMenu onSelect={setCurrentModule} />;
}

export default App;


