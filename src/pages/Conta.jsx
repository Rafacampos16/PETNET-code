import React, { useState } from "react";
import "../styles/conta.css";
import { useNavigate } from "react-router-dom";
import ModalCodigo from "../components/ModalCodigo";
import authService from "../services/authService";

export default function App() {
  const [showPassword, setShowPassword] = useState(false);
  const [openModalCodigo, setOpenModalCodigo] = useState(false);
  const [erroEmail, setErroEmail] = useState("");
  const [loading, setLoading] = useState(false);

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

      // Salva as infos do usuário logado no localStorage
      localStorage.setItem("userCpf", user.cpf);
      localStorage.setItem("userName", user.name);
      localStorage.setItem("userType", user.type);

      // Limpa os outros flags
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("isColaborador");
      localStorage.removeItem("isUser");

      // Redireciona conforme o tipo
      if (user.type === "Gerente") {
        localStorage.setItem("isAdmin", "true");
        window.location.href = "/admin";
      } else if (user.type === "Colaborador") {
        localStorage.setItem("isColaborador", "true");
        window.location.href = "/colaborador";
      } else {
        localStorage.setItem("isUser", "true");
        window.location.href = "/minhaconta";
      }

    } catch (error) {
      setMensagem(error.response?.data?.error || "E-mail ou senha incorretos. Tente novamente.");
    } finally {
      setLoading(false);
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

              <button
                className="link link-btn"
                type="button"
                onClick={() => {
                  if (!login.email) {
                    setErroEmail("Digite um e-mail para redefinir a senha.");
                    return;
                  }
                  setErroEmail("");
                  console.log("Código enviado para:", login.email);
                  setOpenModalCodigo(true);
                }}
              >
                Esqueci a senha
              </button>
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
                      filter: "invert(30%) sepia(100%) saturate(500%) hue-rotate(190deg)",
                    }}
                  />
                ) : (
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/709/709612.png"
                    alt="Mostrar senha"
                    width="22"
                    style={{
                      filter: "invert(30%) sepia(100%) saturate(500%) hue-rotate(190deg)",
                    }}
                  />
                )}
              </span>
            </div>

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

          <button
            className="btn-outline"
            onClick={() => navigate("/criarconta")}
          >
            Criar Conta
          </button>
        </div>
      </div>

      {openModalCodigo && (
        <ModalCodigo
          email={login.email}
          onClose={() => setOpenModalCodigo(false)}
          onSuccess={() => {
            setOpenModalCodigo(false);
            window.location.href = "/minhaconta";
          }}
        />
      )}
    </div>
  );
}
