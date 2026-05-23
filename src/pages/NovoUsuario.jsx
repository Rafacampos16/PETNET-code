import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiPhone, FiMapPin, FiShield } from "react-icons/fi";
import { userService } from "../services/userService";
import "../styles/novo_usuario.css";

export default function NovoUsuario() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    tipo: "Cliente",
    cep: "",
    endereco: "",
    numero: "",
    bairro: "",
    complemento: "",
    localizacao: "",
    tipoEndereco: "Casa",
  });

  const [erros, setErros] = useState({});
  const [salvando, setSalvando] = useState(false);

  function handleChange(e) {
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

    setForm((prev) => ({
      ...prev,
      [name]: novoValor,
    }));

    setErros((prev) => ({
      ...prev,
      [name]: false,
    }));
  }

  async function buscarEnderecoPorCep() {
    const cepLimpo = form.cep.replace(/\D/g, "");

    if (!cepLimpo || cepLimpo.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) return;

      setForm((prev) => ({
        ...prev,
        endereco: data.logradouro || prev.endereco,
        bairro: data.bairro || prev.bairro,
        localizacao:
          data.localidade && data.uf
            ? `${data.localidade} - ${data.uf}`
            : prev.localizacao,
      }));
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    }
  }

  function validarCampos() {
    const novosErros = {};

    if (!form.nome.trim()) novosErros.nome = true;
    if (!form.cpf.trim()) novosErros.cpf = true;
    if (!form.email.trim()) novosErros.email = true;
    if (!form.tipo.trim()) novosErros.tipo = true;

    setErros(novosErros);

    return Object.keys(novosErros).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validarCampos()) {
      alert("Preencha os campos obrigatórios.");
      return;
    }

    setSalvando(true);

    try {
      const body = {
        name: form.nome,
        cpf: form.cpf,
        email: form.email,
        type: form.tipo,

        // Usuário criado pelo admin sem senha inicial.
        // O backend precisa tratar isso e exigir criação de senha no primeiro login.
        password: null,
        must_create_password: true,
        active: true,

        contact: form.telefone
          ? {
              name: "Principal",
              number: form.telefone,
            }
          : undefined,

        address: form.endereco || form.cep
          ? {
              type: form.tipoEndereco || "Casa",
              cep: form.cep,
              address: form.endereco,
              number: form.numero,
              neighborhood: form.bairro,
              complement: form.complemento,
              locaticion: form.localizacao,
            }
          : undefined,
      };

      await userService.createUser(body);

      alert("Usuário cadastrado com sucesso!");
      navigate("/clientes");
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      alert(error.response?.data?.error || "Erro ao cadastrar usuário.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="novo-usuario-page">
      <div className="novo-usuario-header">
        <span className="novo-usuario-badge">Administração</span>
        <h1>Cadastrar novo usuário</h1>
        <p>
          Crie usuários do tipo Cliente, Colaborador ou Administrador. A senha será
          definida pelo usuário no primeiro acesso.
        </p>
      </div>

      <form className="novo-usuario-card" onSubmit={handleSubmit}>
        <div className="novo-section">
          <div className="novo-section-title">
            <FiUser />
            <span>Dados do usuário</span>
          </div>

          <div className="novo-grid">
            <label>
              Nome completo *
              <input
                name="nome"
                type="text"
                placeholder="Digite o nome"
                value={form.nome}
                onChange={handleChange}
                className={erros.nome ? "input-erro" : ""}
              />
            </label>

            <label>
              CPF *
              <input
                name="cpf"
                type="text"
                placeholder="Digite o CPF"
                value={form.cpf}
                onChange={handleChange}
                className={erros.cpf ? "input-erro" : ""}
              />
            </label>

            <label>
              E-mail *
              <input
                name="email"
                type="email"
                placeholder="Digite o e-mail"
                value={form.email}
                onChange={handleChange}
                className={erros.email ? "input-erro" : ""}
              />
            </label>

            <label>
              Tipo de usuário *
              <select
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                className={erros.tipo ? "input-erro" : ""}
              >
                <option value="Cliente">Cliente</option>
                <option value="Colaborador">Colaborador</option>
                <option value="Admin">Administrador</option>
              </select>
            </label>
          </div>
        </div>

        <div className="novo-section">
          <div className="novo-section-title">
            <FiPhone />
            <span>Contato</span>
          </div>

          <div className="novo-grid">
            <label>
              Telefone
              <input
                name="telefone"
                type="text"
                placeholder="Digite o telefone"
                value={form.telefone}
                onChange={handleChange}
              />
            </label>
          </div>
        </div>

        <div className="novo-section">
          <div className="novo-section-title">
            <FiMapPin />
            <span>Endereço</span>
          </div>

          <div className="novo-grid">
            <label>
              Nome do endereço
              <input
                name="tipoEndereco"
                type="text"
                placeholder="Ex: Casa, Trabalho"
                value={form.tipoEndereco}
                onChange={handleChange}
              />
            </label>

            <label>
              CEP
              <input
                name="cep"
                type="text"
                placeholder="Digite o CEP"
                value={form.cep}
                onChange={handleChange}
                onBlur={buscarEnderecoPorCep}
              />
            </label>

            <label className="campo-full">
              Endereço
              <input
                name="endereco"
                type="text"
                placeholder="Rua, avenida..."
                value={form.endereco}
                onChange={handleChange}
              />
            </label>

            <label>
              Número
              <input
                name="numero"
                type="text"
                placeholder="Número"
                value={form.numero}
                onChange={handleChange}
              />
            </label>

            <label>
              Bairro
              <input
                name="bairro"
                type="text"
                placeholder="Bairro"
                value={form.bairro}
                onChange={handleChange}
              />
            </label>

            <label>
              Complemento
              <input
                name="complemento"
                type="text"
                placeholder="Apartamento, bloco..."
                value={form.complemento}
                onChange={handleChange}
              />
            </label>

            <label>
              Localização
              <input
                name="localizacao"
                type="text"
                placeholder="Cidade - UF ou referência"
                value={form.localizacao}
                onChange={handleChange}
              />
            </label>
          </div>
        </div>

        <div className="senha-info-box">
          <FiShield />
          <div>
            <strong>Senha definida no primeiro acesso</strong>
            <p>
              O administrador cadastra o usuário sem senha. No primeiro login, o
              sistema deve solicitar a criação da senha.
            </p>
          </div>
        </div>

        <div className="novo-actions">
          <button
            type="button"
            className="btn-cancelar-novo"
            onClick={() => navigate("/admin/clientes")}
          >
            Cancelar
          </button>

          <button type="submit" className="btn-salvar-novo" disabled={salvando}>
            {salvando ? "Salvando..." : "Cadastrar usuário"}
          </button>
        </div>
      </form>
    </div>
  );
}