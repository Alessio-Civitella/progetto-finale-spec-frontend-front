import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Details from './pages/Details';
import Favourites from './pages/Favourites';
import Compare from './pages/Compare';

const App: React.FC = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/compare" element={<Compare />} />
      </Routes>
    </>
  );
};

export default App;

