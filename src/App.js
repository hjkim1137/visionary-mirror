import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import GetSampleBoard from './components/GetSampleBoard/GetSampleBoard';
import MakeBoardName from './components/MakeBoardName/MakeBoardName';
import MyVisionBoard from './components/MyVisionBoard/MyVisionBoard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/getsampleboard" element={<GetSampleBoard />} />
        <Route path="/makeboardname" element={<MakeBoardName />} />
        <Route path="/myvisionboard" element={<MyVisionBoard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
