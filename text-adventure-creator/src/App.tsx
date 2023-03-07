import React from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Creator from "./pages/Creator";
import RegisterLogin from "./pages/RegisterLogin";

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Creator />} />
            <Route path="/login" element={<RegisterLogin />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
