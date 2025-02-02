import { StrictMode } from 'react';

import { BrowserRouter } from 'react-router-dom';
import './index.css';
import Navbar from './Components/Navbar'; // Ensure Navbar is imported
import RoutesLayout from './Routes/RoutesLayout'; // Ensure RoutesLayout is imported

function App() {
  return (
<>
      <BrowserRouter>
        <Navbar />
        <RoutesLayout /> 
      </BrowserRouter>
      </>
  );
}

export default App
