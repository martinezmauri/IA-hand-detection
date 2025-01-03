import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import Game from "./views/game/Game.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

// podria agregar motion gesture para esto y que los objetos siempre vuelvan al mismo lugar.
// buscar un fondo para el home
// implementar la nueva vista para el juego
