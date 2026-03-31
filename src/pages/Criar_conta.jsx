import React, { useState } from "react";
import "../styles/criar_conta.css";
import { userService } from "../services/userService";
import {
  FiEye,
  FiEyeOff,
  FiUser,
  FiMapPin,
  FiShield,
  FiCheckCircle,
} from "react-icons/fi";
import authService from "../services/authService";

export default function Cadastro() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");

  const [erroSenha, setErroSenha] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    endereco: "",
    bairro: "",
    cep: "",
    estado: "",
    cidade: "",
    complement: "",
    email: "",
  });

  const [erroCampo, setErroCampo] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    let novoValor = value;

    if (name === "cpf") {
      novoValor = value.replace(/\D/g, "").slice(0, 11);
    }

    if (name === "telefone") {
      novoValor = value.replace(/\D/g, "").slice(0, 11);
    }

    if (name === "cep") {
      novoValor = value.replace(/\D/g, "").slice(0, 8);
    }

    if (name === "nome") {
      novoValor = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
    }

    if (name === "email") {
      novoValor = value.replace(/\s/g, "");
    }

    setForm({ ...form, [name]: novoValor });
    setErroCampo({ ...erroCampo, [name]: false });
  };

  const regraTamanho = senha.length >= 8;
  const regraMaiuscula = /[A-Z]/.test(senha);
  const regraMinuscula = /[a-z]/.test(senha);
  const regraNumero = /\d/.test(senha);

  function validarSenha() {
    if (!regraTamanho || !regraMaiuscula || !regraNumero || regraMinuscula) {
      setErroSenha("Senha inválida. Verifique os requisitos.");
      return false;
    }

    if (senha !== confirmSenha) {
      setErroSenha("As senhas não correspondem.");
      return false;
    }

    setErroSenha("");
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    let erros = {};

    if (!form.nome.trim()) erros.nome = true;
    if (!form.cpf.trim()) erros.cpf = true;
    if (!form.telefone.trim()) erros.telefone = true;
    if (!form.endereco.trim()) erros.endereco = true;
    if (!form.bairro.trim()) erros.bairro = true;
    if (!form.cep.trim()) erros.cep = true;
    if (!form.estado.trim()) erros.estado = true;
    if (!form.cidade.trim()) erros.cidade = true;
    if (!form.complement.trim()) erros.complement = true;
    if (!form.email.trim()) erros.email = true;

    if (!senha.trim()) erros.senha = true;
    if (!confirmSenha.trim()) erros.confirmSenha = true;

    setErroCampo(erros);

    if (Object.keys(erros).length > 0) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    if (!validarSenha()) {
      alert("As senhas não correspondem ou não seguem as regras.");
      return;
    }

    try {
      const body = {
        name: form.nome,
        cpf: form.cpf,
        email: form.email,
        password: senha, 
        address: {     
          type: "Casa", 
          cep: form.cep,
          location: `${form.endereco}, ${form.bairro}, ${form.cidade}, ${form.estado}`,
          complement: `${form.complement}`,
        },
        contact: {
          name: form.nome,
          number: form.telefone,
        },
      };

      await authService.register(body); //atualizar rota no backend para aceitar dados de endereço e contato

      setMensagemSucesso("Conta criada com sucesso!");
      alert("Usuário cadastrado com sucesso!");
      window.location.href = "/conta";
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      alert(error.response?.data?.error || "Erro ao cadastrar usuário.");
    }
  }

  return (
    <div className="cadastro-page">
      <div className="cadastro-container">
        <div className="cadastro-hero">
          <span className="cadastro-badge">Bem-vindo à Petnet</span>
          <h1 className="titulo">Crie sua conta</h1>
          <p className="cadastro-subtitulo">
            Cadastre-se para acompanhar seus pets, manter seus dados organizados
            e aproveitar a experiência completa da Petnet com mais praticidade e
            segurança.
          </p>
        </div>

        <div className="cadastro-card">
          <div className="cadastro-card-top">
            <div>
              <h2>Cadastro do tutor</h2>
              <p>Preencha suas informações para criar sua conta.</p>
            </div>
          </div>

          <form className="formulario" onSubmit={handleSubmit}>
            <div className="form-main">
              <div className="form-section">
                <div className="section-title">
                  <FiUser />
                  <span>Dados pessoais</span>
                </div>

                <div className="linhas">
                  <div className="campo">
                    <label>NOME E SOBRENOME</label>
                    <input
                      name="nome"
                      type="text"
                      placeholder="Digite seu nome e sobrenome"
                      value={form.nome}
                      onChange={handleChange}
                      className={erroCampo.nome ? "input-erro" : ""}
                    />
                  </div>

                  <div className="campo">
                    <label>CPF/CNPJ</label>
                    <input
                      name="cpf"
                      type="text"
                      placeholder="Digite seu CPF/CNPJ"
                      value={form.cpf}
                      onChange={handleChange}
                      className={erroCampo.cpf ? "input-erro" : ""}
                    />
                  </div>

                  <div className="campo">
                    <label>TELEFONE</label>
                    <input
                      name="telefone"
                      type="text"
                      placeholder="Digite seu telefone"
                      value={form.telefone}
                      onChange={handleChange}
                      className={erroCampo.telefone ? "input-erro" : ""}
                    />
                  </div>
                </div>

                <div className="campo">
                  <label>E-MAIL</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="Digite seu e-mail"
                    value={form.email}
                    onChange={handleChange}
                    className={erroCampo.email ? "input-erro" : ""}
                  />
                </div>
              </div>

              <div className="form-section">
                <div className="section-title">
                  <FiMapPin />
                  <span>Endereço</span>
                </div>

                <div className="linhas">
                  <div className="campo">
                    <label>ENDEREÇO</label>
                    <input
                      name="endereco"
                      type="text"
                      placeholder="Digite seu endereço"
                      value={form.endereco}
                      onChange={handleChange}
                      className={erroCampo.endereco ? "input-erro" : ""}
                    />
                  </div>

                  <div className="campo">
                    <label>BAIRRO</label>
                    <input
                      name="bairro"
                      type="text"
                      placeholder="Digite seu bairro"
                      value={form.bairro}
                      onChange={handleChange}
                      className={erroCampo.bairro ? "input-erro" : ""}
                    />
                  </div>

                  <div className="campo">
                    <label>CEP</label>
                    <input
                      name="cep"
                      type="text"
                      placeholder="Digite seu CEP"
                      value={form.cep}
                      onChange={handleChange}
                      className={erroCampo.cep ? "input-erro" : ""}
                    />
                  </div>
                </div>

                <div className="linhas">
                  <div className="campo">
                    <label>ESTADO (UF)</label>
                    <input
                      name="estado"
                      type="text"
                      placeholder="Ex: SP"
                      value={form.estado}
                      onChange={handleChange}
                      maxLength="2"
                      className={erroCampo.estado ? "input-erro" : ""}
                    />
                  </div>

                  <div className="campo">
                    <label>CIDADE</label>
                    <input
                      name="cidade"
                      type="text"
                      placeholder="Digite sua cidade"
                      value={form.cidade}
                      onChange={handleChange}
                      className={erroCampo.cidade ? "input-erro" : ""}
                    />
                  </div>

                  <div className="campo">
                    <label>NÚMERO</label>
                    <input
                      name="complement"
                      type="number"
                      placeholder="Número"
                      value={form.complement}
                      onChange={handleChange}
                      className={erroCampo.complement ? "input-erro" : ""}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <div className="section-title">
                  <FiShield />
                  <span>Segurança da conta</span>
                </div>

                <div className="senha-layout">
                  <div className="col-esquerda">
                    <div className="campo senha">
                      <label>SENHA</label>
                      <div className="input-container">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Digite sua senha"
                          value={senha}
                          onChange={(e) => setSenha(e.target.value)}
                          className={erroCampo.senha ? "input-erro" : ""}
                        />
                        <span
                          className="olho"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                        </span>
                      </div>
                    </div>

                    <div className="campo senha">
                      <label>CONFIRME SUA SENHA</label>
                      <div className="input-container">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirme sua senha"
                          value={confirmSenha}
                          onChange={(e) => setConfirmSenha(e.target.value)}
                          className={erroCampo.confirmSenha ? "input-erro" : ""}
                        />
                        <span
                          className="olho"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <FiEyeOff size={20} />
                          ) : (
                            <FiEye size={20} />
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="padrao-senha bloco requisitos">
                    <strong>Padrão de senha</strong>
                    <ul>
                      <li className={regraTamanho ? "validado" : "invalido"}>
                        <FiCheckCircle size={14} />
                        Mínimo 8 caracteres
                      </li>
                      <li className={regraNumero ? "validado" : "invalido"}>
                        <FiCheckCircle size={14} />
                        Número
                      </li>
                      <li className={regraMaiuscula ? "validado" : "invalido"}>
                        <FiCheckCircle size={14} />
                        Letra maiúscula
                      </li>
                       <li className={regraMinuscula ? "validado" : "invalido"}>
                        <FiCheckCircle size={14} />
                        Letra minúscula
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {erroSenha && <p className="erro-senha">{erroSenha}</p>}
              {mensagemSucesso && (
                <p className="sucesso-cadastro">{mensagemSucesso}</p>
              )}

              <button type="submit" className="btn">
                Criar conta
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}