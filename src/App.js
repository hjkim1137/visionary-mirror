import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import GetSampleBoard from './components/createVisionBoard/getSampleBoard';
import MakeBoardName from './components/createVisionBoard/makeBoardName';
import MyVisionBoard from './components/MyVisionBoard/myVisionBoard';

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
