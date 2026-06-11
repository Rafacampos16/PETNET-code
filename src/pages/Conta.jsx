import React, { useState } from "react";
import "../styles/conta.css";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

export default function App() {
  const [showPassword, setShowPassword] = useState(false);
  const [openModalResetSenha, setOpenModalResetSenha] = useState(false);
  const [erroEmail, setErroEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailEnviado, setEmailEnviado] = useState(false);

  const navigate = useNavigate();

  const [login, setLogin] = useState({
    email: "",
    senha: "",
  });

  const [mensagem, setMensagem] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const { email, senha } = login;

    if (!email || !senha) {
      setMensagem("Preencha e-mail e senha.");
      return;
    }

    setLoading(true);
    setMensagem("");

    try {
      const { user } = await authService.login(email, senha);

      localStorage.setItem("userCpf", user.cpf);
      localStorage.setItem("userName", user.name);
      localStorage.setItem("userType", user.type);
      localStorage.setItem("loginTime", Date.now().toString());

      if (user.type === "Gerente") {
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("isColaborador", "false");
        localStorage.setItem("isUser", "false");

        window.location.href = "/admin";
      } else if (user.type === "Colaborador") {
        localStorage.setItem("isAdmin", "false");
        localStorage.setItem("isColaborador", "true");
        localStorage.setItem("isUser", "false");

        window.location.href = "/colaborador/agenda";
      } else {
        localStorage.setItem("isAdmin", "false");
        localStorage.setItem("isColaborador", "false");
        localStorage.setItem("isUser", "true");

        window.location.href = "/minhaconta";
      }
    } catch (error) {
      setMensagem(
        error.response?.data?.error ||
        "E-mail ou senha incorretos. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleEsqueciSenha() {
    if (!login.email) {
      setErroEmail("Digite um e-mail para redefinir a senha.");
      return;
    }
    setErroEmail("");
    setEmailEnviado(false);
    setOpenModalResetSenha(true);
  }


  async function handleEnviarRecuperacao() {
    try {
      await authService.forgotPassword(login.email);
      setEmailEnviado(true);
    } catch (error) {
      setErroEmail(
        error.response?.data?.error ||
        "Não foi possível enviar o e-mail de recuperação. Tente novamente."
      );
      setOpenModalResetSenha(false);
    }
  }

  return (
    <div className="container">
      <div className="content">
        {/* LADO ESQUERDO */}
        <div className="left">
          <h1 className="titulo">ACESSE SUA CONTA</h1>

          {mensagem && (
            <p
              style={{
                color: mensagem.includes("sucesso") ? "green" : "red",
                fontWeight: "600",
                marginBottom: "15px",
                marginTop: "-10px",
              }}
            >
              {mensagem}
            </p>
          )}

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <label className="label">E-mail</label>
            <input
              className="input"
              name="email"
              type="text"
              placeholder="Digite seu e-mail"
              value={login.email}
              onChange={handleChange}
            />

            {erroEmail && (
              <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                {erroEmail}
              </p>
            )}

            <div className="senha-top">
              <label className="label">Senha</label>
            </div>

            <div className="input-senha-container">
              <input
                className="input"
                name="senha"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                value={login.senha}
                onChange={handleChange}
              />

              <span
                className="olho"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/159/159604.png"
                    alt="Ocultar senha"
                    width="22"
                    style={{
                      filter:
                        "invert(30%) sepia(100%) saturate(500%) hue-rotate(190deg)",
                    }}
                  />
                ) : (
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/709/709612.png"
                    alt="Mostrar senha"
                    width="22"
                    style={{
                      filter:
                        "invert(30%) sepia(100%) saturate(500%) hue-rotate(190deg)",
                    }}
                  />
                )}
              </span>
            </div>

            <button
              className="forgot-password-btn"
              type="button"
              onClick={handleEsqueciSenha}
            >
              Esqueci minha senha
            </button>

            <button className="btn" type="submit" disabled={loading}>
              {loading ? "ENTRANDO..." : "ENTRAR"}
            </button>
          </form>

          <p className="criar-mobile" onClick={() => navigate("/criarconta")}>
            Não tem uma conta? <span>Crie agora</span>
          </p>
        </div>

        {/* DIVISÃO */}
        <div className="linha-vertical"></div>

        {/* LADO DIREITO */}
        <div className="right">
          <h1 className="titulo2">
            Criar sua conta é <br /> rápido, fácil e seguro!
          </h1>

          <p className="texto">
            Venha fazer parte da PETNET e aproveite serviços feitos
            especialmente para seu pet. Crie sua conta agora!
          </p>

          <button className="btn-outline" onClick={() => navigate("/criarconta")}>
            Criar Conta
          </button>
        </div>
      </div>

      {openModalResetSenha && (
        <div className="modal-bg">
          <div className="modal-container reset-modal-container">
            <button
              className="close"
              type="button"
              onClick={() => setOpenModalResetSenha(false)}
              aria-label="Fechar modal"
            >
              ×
            </button>

            <div className="reset-modal-icon">🐾</div>

            {!emailEnviado ? (
              <>
                <h2 className="reset-modal-title">Recuperar senha</h2>

                <p className="reset-modal-text">
                  Vamos enviar um link seguro para o seu e-mail. Por ele, voce podera
                  criar uma nova senha e acessar sua conta novamente.
                </p>

                <p className="reset-modal-email">{login.email}</p>

                <button
                  className="reset-modal-btn"
                  type="button"
                  onClick={handleEnviarRecuperacao}
                >
                  Enviar link para meu e-mail
                </button>
              </>
            ) : (
              <>
                <h2 className="reset-modal-title">E-mail enviado</h2>

                <p className="reset-modal-text">
                  Prontinho! Enviamos as instrucoes para o seu e-mail. Acesse o link
                  recebido para criar uma nova senha.
                </p>

                <p className="reset-modal-email">{login.email}</p>

                <button
                  className="reset-modal-btn"
                  type="button"
                  onClick={() => setOpenModalResetSenha(false)}
                >
                  Entendi
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}