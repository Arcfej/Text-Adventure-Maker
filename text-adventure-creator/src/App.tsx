import React from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Creator from "./pages/Creator";
import RegisterLogin from "./pages/RegisterLogin";
import {onAuthStateChanged} from "firebase/auth";
import CssBaseline from '@mui/material/CssBaseline';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';

function App() {
  return (
      <CssVarsProvider>
          <React.Fragment>
              <CssBaseline />
              <BrowserRouter>
                  <Routes>
                      <Route path="/" element={<Creator />} />
                      <Route path="/login" element={<RegisterLogin onAuthStateChanged={onAuthStateChanged} />} />
                  </Routes>
              </BrowserRouter>
          </React.Fragment>
      </CssVarsProvider>
  );
}

export default App;
