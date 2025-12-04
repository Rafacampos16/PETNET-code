import React, { useState } from "react";
import "../styles/criar_conta.css";
import { userService } from "../services/userService";

export default function Cadastro() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");

  const [erroSenha, setErroSenha] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  // ESTADO DOS CAMPOS
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
    email: ""
  });

  const [erroCampo, setErroCampo] = useState({});

  // ---------------------------- VALIDAR DIGITAÇÃO ----------------------------

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

  // ---------------------------- REGRA DE SENHA ----------------------------

  const regraTamanho = senha.length >= 8;
  const regraMaiuscula = /[A-Z]/.test(senha);
  const regraNumero = /\d/.test(senha);

  function validarSenha() {
    if (!regraTamanho || !regraMaiuscula || !regraNumero) {
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

  // ---------------------------- SUBMIT ----------------------------

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
          complement: `${form.complement}`
        },

        contact: {
          name: form.nome,
          number: form.telefone
        }
      };

      await userService.createUser(body);

      alert("Usuário cadastrado com sucesso!");
      window.location.href = "/conta";

    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      alert(error.response?.data?.error || "Erro ao cadastrar usuário.");
    }
  }


  return (
    <div className="cadastro-container">
      <div className="cadastro-content">
        <h1 className="titulo">CRIE SUA CONTA</h1>

        <form className="formulario" onSubmit={handleSubmit}>
          
          {/* Primeira linha */}
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

          {/* Segunda linha */}
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

          {/* Terceira linha */}
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

          {/* Senhas */}
          <div className="linhas">
            <div className="col-esquerda">
              <div className="campo senha">
                <label>SENHA</label>
                <div className="input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                  />
                  <span className="olho" onClick={() => setShowPassword(!showPassword)}>
                    <img
                      src={
                        showPassword
                          ? "https://cdn-icons-png.flaticon.com/512/159/159604.png"
                          : "https://cdn-icons-png.flaticon.com/512/709/709612.png"
                      }
                      width="22"
                      alt=""
                    />
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
                  />
                  <span
                    className="olho"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <img
                      src={
                        showConfirmPassword
                          ? "https://cdn-icons-png.flaticon.com/512/159/159604.png"
                          : "https://cdn-icons-png.flaticon.com/512/709/709612.png"
                      }
                      width="22"
                      alt=""
                    />
                  </span>
                </div>
              </div>
            </div>

            <div className="padrao-senha bloco requisitos">
              <strong>PADRÃO DE SENHA</strong>
              <ul>
                <li className={regraTamanho ? "validado" : "invalido"}>
                  Mínimo 8 caracteres
                </li>
                <li className={regraMaiuscula ? "validado" : "invalido"}>
                  Letra maiúscula
                </li>
                <li className={regraNumero ? "validado" : "invalido"}>
                  Número
                </li>
              </ul>
            </div>
          </div>

          {erroSenha && <p className="erro-senha">{erroSenha}</p>}
          {mensagemSucesso && <p className="sucesso-cadastro">{mensagemSucesso}</p>}

          <button type="submit" className="btn">CRIAR CONTA</button>
        </form>
      </div>
    </div>
  );
}
