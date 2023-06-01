import React from 'react';
import { BrowserRouter as Router, Routes } from 'react-router-dom';
import Header from './pages/Header';
// import Home from "./Home";

function App() {
  return (
    <Router>
      <Header />
      <Routes>{/* <Route path="/" element={<Home />} /> */}</Routes>
    </Router>
  );
}

export default App;
