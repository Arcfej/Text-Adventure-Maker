import React from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Creator from "./pages/Creator";
import RegisterLogin from "./pages/RegisterLogin";
import {onAuthStateChanged} from "firebase/auth";

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Creator />} />
            <Route path="/login" element={<RegisterLogin onAuthStateChanged={onAuthStateChanged} />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
