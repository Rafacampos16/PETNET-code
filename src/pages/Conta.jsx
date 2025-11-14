import React, { useState } from "react";
import "../styles/conta.css";

export default function App() {
  const [showPassword, setShowPassword] = useState(false);

  const [login, setLogin] = useState({
    email: "",
    senha: "",
  });

  const [mensagem, setMensagem] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const { email, senha } = login;

    //  LOGIN DO ADMIN
    if (email === "netpetpi@gmail.com" && senha === "petnetFatec25") {
  setMensagem("Login de administrador realizado com sucesso!");

  // Marca que o usuário é admin
  localStorage.setItem("isAdmin", "true");

  // limpa campos
  setLogin({ email: "", senha: "" });

  // redireciona para admin
  window.location.href = "/admin";
  return;
}

    setMensagem("E-mail ou senha incorretos. Tente novamente.");
  }

  return (
    <div className="container">
      <div className="content">

        {/* LADO ESQUERDO */}
        <div className="left">
          <h1 className="titulo">ACESSE SUA CONTA</h1>

          {/* EXIBE MENSAGEM */}
          {mensagem && (
            <p
              style={{
                color:
                  mensagem.includes("sucesso") ? "green" : "red",
                fontWeight: "600",
                marginBottom: "15px",
                marginTop: "-10px",
              }}
            >
              {mensagem}
            </p>
          )}

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <label className="label">E-mail ou CPF/CNPJ</label>
            <input
              className="input"
              name="email"
              type="text"
              placeholder="Digite seu e-mail ou CPF/CNPJ"
              value={login.email}
              onChange={handleChange}
            />

            <div className="senha-top">
              <label className="label">Senha</label>

              {/* Esqueci a senha */}
              <button className="link link-btn" type="button">
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

            <button className="btn" type="submit">
              ENTRAR
            </button>
          </form>
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

          <button className="btn-outline">Criar Conta</button>
        </div>
      </div>
    </div>
  );
}
