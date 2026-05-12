import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/reset-password.css";
import focinhoIcon from "../assets/icons/paw-cat.png";
import authService from "../services/authService";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMensagem("");
    setErro("");

    if (!token) {
      setErro("Código invalido ou ausente. Solicite a recuperacao de senha novamente.");
      return;
    }

    if (!novaSenha || !confirmarSenha) {
      setErro("Preencha todos os campos.");
      return;
    }

    if (novaSenha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErro("As senhas nao coincidem.");
      return;
    }

    try {
      setCarregando(true);
      await authService.resetPassword(token, novaSenha);
      setMensagem("Senha redefinida com sucesso! Redirecionando para o login...");
      setTimeout(() => navigate("/conta"), 2000);
    } catch (error) {
      setErro(error.response?.data?.error || "Erro ao redefinir senha. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <>

      <main className="reset-password-page">
        <section className="reset-password-card">
          <div className="reset-password-icon-box">
            <img src={focinhoIcon} alt="Icone PETNET" className="reset-password-icon" />
          </div>

          <h1>Redefinir senha</h1>

          <p className="reset-password-description">
            Digite sua nova senha abaixo para recuperar o acesso a sua conta.
          </p>

          <form onSubmit={handleSubmit} className="reset-password-form">
            <div className="reset-password-field">
              <label htmlFor="novaSenha">Nova senha</label>
              <input
                type="password"
                id="novaSenha"
                placeholder="Digite sua nova senha"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
              />
            </div>

            <div className="reset-password-field">
              <label htmlFor="confirmarSenha">Confirmar senha</label>
              <input
                type="password"
                id="confirmarSenha"
                placeholder="Confirme sua nova senha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
              />
            </div>

            {erro && <p className="reset-password-error">{erro}</p>}
            {mensagem && <p className="reset-password-success">{mensagem}</p>}

            <button type="submit" disabled={carregando} className="reset-password-button">
              {carregando ? "Redefinindo..." : "Redefinir senha"}
            </button>
          </form>

          <button
            type="button"
            className="reset-password-back"
            onClick={() => navigate("/conta")}
          >
            Voltar para o login
          </button>
        </section>
      </main>

    </>
  );
}

export default ResetPassword;