import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CreateRoom from "./components/CreateRoom";
import Room from './components/Room.js';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateRoom />} />
        <Route path="/r/:roomID" element={<Room />} />
      </Routes>


    </BrowserRouter>
  );
}

export default App;
