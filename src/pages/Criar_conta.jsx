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
    numero: "",
    email: ""
  });


  const [erroCampo, setErroCampo] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    setErroCampo({ ...erroCampo, [name]: false });
  }

  // REGRAS DE SENHA (tempo real)
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


async function handleSubmit(e) {
  e.preventDefault();

  // valida campos vazios
// valida campos vazios (menos confirmEmail)
  let erros = {};
 

  // valida senha e confirmação
  if (!senha.trim()) erros.senha = true;
  if (!confirmSenha.trim()) erros.confirmSenha = true;

  setErroCampo(erros);

  if (Object.keys(erros).length > 0) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }


  

  // validar senha
  if (!validarSenha()) {
    alert("As senhas não correspondem ou não seguem as regras.");
    return;
  }

  try {
    // 🔥 MONTAR BODY PARA O BACK-END (SEM confirmEmail)
    const body = {
      cpf: form.cpf,
      name: form.nome,
      email: 'guilherme@gmail.com', //somente para preenchimento temporario
      type: 'Cliente', //Padrão como default
      password: senha, // senha separada do estado form
    };

    // CHAMADA AO BACK-END
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

          {/* Terceira linha - novos campos */}
          <div className="linhas">
            <div className="campo">
              <label>ESTADO (UF)</label>
              <input
                name="estado"
                type="text"
                placeholder="Ex: SP"
                value={form.estado}
                onChange={handleChange}
                className={erroCampo.estado ? "input-erro" : ""}
                maxLength="2"
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
                name="numero"
                type="text"
                placeholder="Número"
                value={form.numero}
                onChange={handleChange}
                className={erroCampo.numero ? "input-erro" : ""}
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
                  <span
                    className="olho"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <img
                      src={
                        showPassword
                          ? "https://cdn-icons-png.flaticon.com/512/159/159604.png"
                          : "https://cdn-icons-png.flaticon.com/512/709/709612.png"
                      }
                      width="22"
                      alt=""
                      className="olho-cor"
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
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
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

            {/* REQUISITOS com verde/vermelho */}
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
          {mensagemSucesso && (
            <p className="sucesso-cadastro">{mensagemSucesso}</p>
          )}

          <button type="submit" className="btn">CRIAR CONTA</button>
        </form>
      </div>
    </div>
  );
}
