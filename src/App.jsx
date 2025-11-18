import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Servicos from "./pages/Servicos";
import Pets from "./pages/Pets";
import Conta from "./pages/Conta";
import GlobalStyles from "./components/GlobalStyles";
import Administracao from "./pages/Administracao";
import ProtectedRoute from "./components/ProtectedRoute"; // <--- importe aqui
import Criarconta from "./pages/Criar_conta";
import Minhaconta from "./pages/Minha_conta";

const App = () => (
  <Router>
    <GlobalStyles />
    <Header />
    <main style={{ marginTop: "4.5rem" }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/pets" element={<Pets />} />
        <Route path="/conta" element={<Conta />} />
        <Route path="/criarconta" element={<Criarconta />} />
        <Route path="/minhaconta" element={<Minhaconta />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Administracao />
            </ProtectedRoute>
          }
        />
      </Routes>
    </main>
    <Footer />
  </Router>
);

export default App;
