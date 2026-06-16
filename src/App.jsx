import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Servicos from "./pages/Servicos";
import Pets from "./pages/Pets";
import Conta from "./pages/Conta";
import GlobalStyles from "./components/GlobalStyles";
import Administracao from "./pages/Administracao";
import ProtectedRoute from "./components/ProtectedRoute";
import Criarconta from "./pages/Criar_conta";
import Minhaconta from "./pages/Minha_conta";
import Clientes from "./pages/Clientes";
import Agendamentos from "./pages/Agendamentos";
import GerenciarAgendamentos from "./pages/GerenciarAgendamentos";
import PetsCadastrados from "./pages/Pets_cadastrados";
import Status from "./pages/Status";
import Colaborador from "./pages/Colaborador";
import AdminServicos from "./pages/AdminServicos";
import ResetPassword from "./pages/ResetPassword";
import ScrollToTopButton from "./components/ScrollToTopButton";
import ScrollToTop from "./components/ScrollToTop";
import NovoUsuario from "./pages/NovoUsuario";
import Logs from "./pages/Logs";
import LogsMock from "./pages/LogsMock";
import MeusAgendamentos from "./pages/MeusAgendamentos";

const App = () => {
  return (
    <Router>
      <GlobalStyles />
      <ScrollToTop />
      <Header />

      <main style={{ marginTop: "4.5rem" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/servicos" element={<Servicos />} />
          <Route path="/pets" element={<Pets />} />
          <Route path="/conta" element={<Conta />} />
          <Route path="/criarconta" element={<Criarconta />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            path="/minhaconta"
            element={
              <ProtectedRoute>
                <Minhaconta />
              </ProtectedRoute>
            }
          />

          <Route
            path="/meus-pets"
            element={
              <ProtectedRoute>
                <PetsCadastrados />
              </ProtectedRoute>
            }
          />

          <Route
            path="/meus-agendamentos"
            element={
              <ProtectedRoute>
                <MeusAgendamentos />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Administracao />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/agendamentos"
            element={
              <ProtectedRoute>
                <GerenciarAgendamentos />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/agendamentos/novo"
            element={
              <ProtectedRoute>
                <Agendamentos />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/clientes"
            element={
              <ProtectedRoute>
                <Clientes />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/pets"
            element={
              <ProtectedRoute>
                <PetsCadastrados />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/status"
            element={
              <ProtectedRoute>
                <Status />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/colaborador"
            element={
              <ProtectedRoute>
                <Colaborador />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/servicos"
            element={
              <ProtectedRoute>
                <AdminServicos />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/usuarios/novo"
            element={
              <ProtectedRoute>
                <NovoUsuario />
              </ProtectedRoute>
            }
          />

          <Route
            path="/logs"
            element={
              <ProtectedRoute>
                <Logs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/logsmock"
            element={
              <ProtectedRoute>
                <LogsMock />
              </ProtectedRoute>
            }
          />

          <Route
            path="/colaborador"
            element={
              <ProtectedRoute>
                <Colaborador />
              </ProtectedRoute>
            }
          />

          <Route
            path="/colaborador/agenda"
            element={
              <ProtectedRoute>
                <Colaborador />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <ScrollToTopButton />
      <Footer />
    </Router>
  );
};

export default App;
