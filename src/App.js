import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// import Header from './pages/Header';
// import GetSampleBoard from './pages/GetSampleBoard';
// import MakeBoardName from './pages/MakeBoardName';
// import MyVisionBoard from './pages/MyVisionBoard';
import MyVisionBoardGrid from './pages/MyVisionBoardGrid';
// import SignIn from './pages/SignIn';
// import SignUp from './pages/SignUp';
import VisionBoardGrid from './pages/VisionBoardGrid';
import VisionBoardModal from './pages/VisionBoardModal';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Header />} />
        <Route path="/getsampleboard" element={<GetSampleBoard />} />
        <Route path="/makeBoardName" element={<MakeBoardName />} />
        <Route path="/myvisionboard" element={<MyVisionBoard />} /> */}
        <Route path="/myvisionboardgrid" element={<MyVisionBoardGrid />} />
        {/* <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} /> */}
        <Route path="/visionboardgrid" element={<VisionBoardGrid />} />
        <Route path="/modal" element={<VisionBoardModal />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
