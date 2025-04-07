import React from 'react';
import { Routes, Route } from "react-router-dom";
import NavBar from './components/NavBar.jsx';
import Flashcard from './components/Flashcard.jsx';
import Home from './pages/Home.jsx';
import PageA from './pages/PageA.jsx';
import PageB from './pages/PageB.jsx';

function App() {
  return (

      <div>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pageA" element={<PageA />} />
          <Route path="/pageB" element={<PageB />} />
        </Routes>
      </div>

  );
}

export default App;
