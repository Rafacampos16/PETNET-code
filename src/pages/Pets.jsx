import React, { useEffect, useState } from "react";
import "../styles/Pets.css";
import Header from "../components/Header";
import petService from "../services/petService";
import Footer from "../components/Footer";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
import { userService } from "../services/userService";

import {
  FiLock,
  FiCheck,
  FiUploadCloud,
  FiCalendar,
  FiTag,
  FiHeart,
} from "react-icons/fi";

function Pets() {
  const navigate = useNavigate();
  const location = useLocation();

  const isUser = localStorage.getItem("isUser") === "true";
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const usuarioLogado = isUser || isAdmin;

  const userCpf = localStorage.getItem("userCpf");
  const params = new URLSearchParams(location.search);
  const forcarNovoCadastro = params.get("novo") === "true";

  const [loadingPets, setLoadingPets] = useState(true);
  const [clientes, setClientes] = useState([]);
  const [clienteBusca, setClienteBusca] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [buscandoClientes, setBuscandoClientes] = useState(false);

  const [form, setForm] = useState({
    name: "",
    species: "",
    breed: "",
    size: "",
    weight: "",
    birth_date: "",
    sex: "",
    picture_url: null,
    observations: "",
  });

  const [erros, setErros] = useState({});

  useEffect(() => {
    async function carregarClientes() {
      if (!isAdmin) return;

      setBuscandoClientes(true);

      try {
        const response = await userService.listUsers();
        const todos = Array.isArray(response.data) ? response.data : [];

        const apenasClientes = todos.filter(
          (usuario) => usuario.type === "Cliente" || !usuario.type
        );

        setClientes(apenasClientes);
      } catch (error) {
        console.error("Erro ao carregar clientes:", error);
      } finally {
        setBuscandoClientes(false);
      }
    }

    carregarClientes();
  }, [isAdmin]);

  useEffect(() => {
    async function verificarPets() {
      if (!usuarioLogado || !userCpf) {
        setLoadingPets(false);
        return;
      }

      if (forcarNovoCadastro) {
        setLoadingPets(false);
        return;
      }

      try {
        let pets = [];

        if (isAdmin) {
          const response = await petService.listar();
          pets = Array.isArray(response) ? response : response?.data || [];
          pets = pets.filter((pet) => pet.user_cpf === userCpf);
        } else {
          const response = await petService.listar_meus_pets();
          pets = Array.isArray(response) ? response : response?.data || [];
        }

        if (pets.length > 0) {
          navigate("/meus-pets");
          return;
        }
      } catch (error) {
        console.error("Erro ao verificar pets:", error);
      } finally {
        setLoadingPets(false);
      }
    }

    verificarPets();
  }, [usuarioLogado, userCpf, isAdmin, forcarNovoCadastro, navigate]);

  function resetForm() {
    setForm({
      name: "",
      species: "",
      breed: "",
      size: "",
      weight: "",
      birth_date: "",
      sex: "",
      picture_url: null,
      observations: "",
    });

    setErros({});
    setClienteBusca("");
    setClienteSelecionado(null);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handleFileChange(e) {
    setForm({ ...form, picture_url: e.target.files[0] });
  }

  function limparCPF(cpf = "") {
    return String(cpf).replace(/\D/g, "");
  }

  function formatarCPF(cpf = "") {
    const cpfLimpo = limparCPF(cpf);

    if (cpfLimpo.length !== 11) return cpf;

    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  const clientesFiltrados = clientes
    .filter((cliente) => {
      const busca = clienteBusca.trim().toLowerCase();
      const buscaCpf = limparCPF(clienteBusca);

      if (!busca) return false;

      const nome = cliente.name?.toLowerCase() || "";
      const cpf = limparCPF(cliente.cpf);

      return nome.startsWith(busca) || cpf.startsWith(buscaCpf);
    })
    .slice(0, 8);

  function selecionarCliente(cliente) {
    setClienteSelecionado(cliente);
    setClienteBusca(cliente.name);
    setErros((prev) => ({ ...prev, cliente: false }));
  }

  function validarCampos() {
    const novosErros = {};
    const faltando = [];

    if (isAdmin && !clienteSelecionado) {
      novosErros.cliente = true;
      faltando.push("Cliente");
    }

    if (!form.name.trim()) {
      novosErros.name = true;
      faltando.push("Nome");
    }
    if (!form.species.trim()) {
      novosErros.species = true;
      faltando.push("Espécie");
    }
    if (!form.size.trim()) {
      novosErros.size = true;
      faltando.push("Porte");
    }
    if (!form.weight) {
      novosErros.weight = true;
      faltando.push("Peso");
    }
    if (!form.sex.trim()) {
      novosErros.sex = true;
      faltando.push("Sexo");
    }

    return { novosErros, faltando };
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { novosErros, faltando } = validarCampos();
    setErros(novosErros);

    if (faltando.length > 0) {
      alert(
        "Preencha os seguintes campos obrigatórios:\n\n- " +
        faltando.join("\n- ")
      );
      return;
    }

    try {
      const speciesMap = {
        CACHORRO: "dog",
        GATO: "cat",
      };

      const sizeMap = {
        PEQUENO: "S",
        MEDIO: "M",
        GRANDE: "L",
        GIGANTE: "XL",
      };

      const sexMap = {
        MACHO: "M",
        FEMEA: "F",
      };

      const cpfResponsavel = isAdmin ? clienteSelecionado?.cpf : userCpf;

      const data = {
        name: form.name,
        species: speciesMap[form.species],
        breed: form.breed.trim() || "SRD",
        size: sizeMap[form.size],
        weight: Number(form.weight),
        birth_date: form.birth_date
          ? new Date(form.birth_date).toISOString()
          : null,
        sex: sexMap[form.sex],
        user_cpf: cpfResponsavel,
        observations: form.observations,
      };

      const response = await petService.criar(data);
      console.log("SUCESSO:", response);
      alert("Pet cadastrado com sucesso!");

      resetForm();
      navigate("/meus-pets");
    } catch (erro) {
      console.error("ERRO COMPLETO ===> ", erro);
      console.error("ERRO DATA ===> ", erro.response?.data);
      alert(erro.response?.data?.error || "Erro ao cadastrar o pet.");
    }
  };

  function enviarFormularioExternamente() {
    const f = document.getElementById("petForm");
    if (!f) return;

    if (typeof f.requestSubmit === "function") {
      f.requestSubmit();
      return;
    }

    const ev = new Event("submit", { bubbles: true, cancelable: true });
    f.dispatchEvent(ev);
  }

  return (
    <>
      <Header />

      {!usuarioLogado ? (
        <div className="pet-lock-page">
          <div className="pet-lock-card">
            <div className="pet-lock-icon-wrapper">
              <div className="pet-lock-icon-circle">
                <FiLock size={58} />
              </div>
            </div>

            <h1 className="pet-lock-title">Cadastre seu pet</h1>

            <p className="pet-lock-text">
              Para cadastrar seu pet e acompanhar as informações dele, faça login
              na sua conta.
            </p>

            <button
              className="pet-lock-login-btn"
              onClick={() => navigate("/conta")}
            >
              Acessar minha conta
            </button>

            <p className="pet-lock-create-text">
              Ainda não tem uma conta?{" "}
              <span onClick={() => navigate("/criarconta")}>Criar conta</span>
            </p>

            <div className="pet-lock-divider"></div>

            <div className="pet-lock-benefits">
              <div className="pet-lock-benefit">
                <FiCheck size={18} />
                <span>Cadastrar seus pets com segurança</span>
              </div>

              <div className="pet-lock-benefit">
                <FiCheck size={18} />
                <span>Manter os dados do pet organizados</span>
              </div>

              <div className="pet-lock-benefit">
                <FiCheck size={18} />
                <span>Acompanhar histórico e informações cadastradas</span>
              </div>
            </div>
          </div>
        </div>
      ) : loadingPets ? (
        <div className="pets-page">
          <div className="pets-container">
            <LoadingScreen
              title="Carregando pets"
              subtitle="Estamos buscando os dados cadastrados do seu pet."
            />
          </div>
        </div>
      ) : (
        <div className="pets-page">
          <div className="pets-container">
            <div className="pets-hero">
              <div className="pets-hero-badge">Cadastro Petnet</div>
              <h1 className="topo2">Cadastre seu pet</h1>
              <p className="pets-subtitle">
                Preencha os dados com carinho para manter o perfil do seu pet
                sempre completo, organizado e pronto para os próximos cuidados.
              </p>
            </div>

            <div className="pets-card">
              <div className="pets-card-top">
                <div>
                  <h2>Informações do pet</h2>
                  <p>
                    Todos os campos marcados como obrigatórios devem ser preenchidos.
                  </p>
                </div>

                <div className="pets-top-tags">
                  <span>
                    <FiHeart size={14} />
                    Cadastro seguro
                  </span>
                  <span>
                    <FiTag size={14} />
                    Perfil completo
                  </span>
                </div>
              </div>

              <form id="petForm" className="form" onSubmit={handleSubmit}>
                <div className="form-left">
                  {isAdmin && (
                    <div className="form-section">
                      <h3 className="form-section-title">Cliente responsável</h3>

                      <label>BUSCAR CLIENTE</label>

                      <div className="cliente-pet-search-wrapper">
                        <input
                          type="text"
                          placeholder="Digite o nome ou CPF do cliente"
                          value={clienteBusca}
                          onChange={(e) => {
                            setClienteBusca(e.target.value);
                            setClienteSelecionado(null);
                            setErros((prev) => ({ ...prev, cliente: false }));
                          }}
                          className={erros.cliente ? "input-erro" : ""}
                          autoComplete="off"
                        />

                        {clientesFiltrados.length > 0 && !clienteSelecionado && (
                          <ul className="cliente-pet-sugestoes">
                            {clientesFiltrados.map((cliente) => (
                              <li
                                key={cliente.cpf}
                                className="cliente-pet-sugestao-item"
                                onClick={() => selecionarCliente(cliente)}
                              >
                                <div className="cliente-pet-avatar">
                                  {cliente.name?.charAt(0).toUpperCase() || "C"}
                                </div>

                                <div className="cliente-pet-info">
                                  <strong>{cliente.name}</strong>
                                  <span>CPF: {formatarCPF(cliente.cpf)}</span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {buscandoClientes && (
                        <p className="helper-text">Carregando clientes...</p>
                      )}

                      {clienteBusca.trim().length > 0 &&
                        clientesFiltrados.length === 0 &&
                        !clienteSelecionado &&
                        !buscandoClientes && (
                          <p className="helper-text">
                            Nenhum cliente encontrado com esse nome ou CPF.
                          </p>
                        )}

                      {clienteSelecionado && (
                        <p className="cliente-pet-selecionado">
                          Cliente selecionado: <strong>{clienteSelecionado.name}</strong>
                        </p>
                      )}

                      {erros.cliente && (
                        <p className="erro-service">Selecione um cliente para vincular o pet.</p>
                      )}
                    </div>
                  )}

                  <div className="form-section">
                    <h3 className="form-section-title">Dados principais</h3>

                    <label>NOME DO PET/APELIDO</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Digite o nome/apelido do seu pet"
                      onChange={handleChange}
                      value={form.name}
                      className={erros.name ? "input-erro" : ""}
                    />

                    <label>ESPÉCIE</label>
                    <select
                      name="species"
                      onChange={handleChange}
                      value={form.species}
                      className={erros.species ? "input-erro" : ""}
                    >
                      <option value="">Escolha a espécie</option>
                      <option value="CACHORRO">Cachorro</option>
                      <option value="GATO">Gato</option>
                    </select>

                    <label>RAÇA <span className="campo-opcional">(opcional)</span></label>
                    <input
                      type="text"
                      name="breed"
                      placeholder="Informe a raça do seu pet"
                      onChange={handleChange}
                      value={form.breed}
                    />
                  </div>

                  <div className="form-section">
                    <h3 className="form-section-title">Características</h3>

                    <div className="linhas dupla">
                      <div>
                        <label>PORTE</label>
                        <select
                          name="size"
                          onChange={handleChange}
                          value={form.size}
                          className={erros.size ? "input-erro" : ""}
                        >
                          <option value="">Escolha o porte</option>
                          <option value="PEQUENO">Pequeno</option>
                          <option value="MEDIO">Médio</option>
                          <option value="GRANDE">Grande</option>
                          <option value="GIGANTE">Gigante </option>
                        </select>
                      </div>

                      <div>
                        <label>PESO</label>
                        <input
                          type="number"
                          name="weight"
                          placeholder="Informe o peso em kg"
                          onChange={handleChange}
                          min="0"
                          step="0.5"
                          value={form.weight}
                          className={erros.weight ? "input-erro" : ""}
                        />
                      </div>
                    </div>

                    <div className="linhas dupla">
                      <div>
                        <label>DATA DE NASCIMENTO <span className="campo-opcional">(opcional)</span></label>
                        <div className="input-icon-wrapper">
                          <FiCalendar className="input-icon" />
                          <input
                            type="date"
                            name="birth_date"
                            onChange={handleChange}
                            value={form.birth_date}
                            className="input-with-icon"
                          />
                        </div>
                      </div>

                      <div>
                        <label>SEXO</label>
                        <select
                          name="sex"
                          onChange={handleChange}
                          value={form.sex}
                          className={erros.sex ? "input-erro" : ""}
                        >
                          <option value="">Selecione</option>
                          <option value="FEMEA">Fêmea</option>
                          <option value="MACHO">Macho</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h3 className="form-section-title">Observação</h3>

                    <label>OBSERVAÇÃO <span className="campo-opcional">(opcional)</span></label>
                    <textarea
                      name="observations"
                      placeholder="Digite uma observação sobre o pet"
                      onChange={handleChange}
                      value={form.observations}
                      rows={5}
                    />
                  </div>
                </div>

                <div className="upload-column">
                  <div className="upload-card">
                    <h3 className="upload-title">Foto do pet</h3>
                    <p className="upload-subtitle">
                      Adicione uma foto para deixar o perfil ainda mais completo.
                    </p>

                    <div className="upload-area">
                      {form.picture_url ? (
                        <div className="preview-container">
                          <img
                            src={URL.createObjectURL(form.picture_url)}
                            alt="Prévia do pet"
                            className="preview-img"
                          />
                          <button
                            type="button"
                            className="remove-btn"
                            onClick={() =>
                              setForm({ ...form, picture_url: null })
                            }
                          >
                            Remover foto
                          </button>
                        </div>
                      ) : (
                        <label className="upload-label">
                          <input type="file" onChange={handleFileChange} />
                          <div className="upload-placeholder">
                            <FiUploadCloud size={42} />
                            <span>CARREGUE UMA FOTO DO SEU PET AQUI</span>
                            <small>PNG, JPG ou JPEG</small>
                          </div>
                        </label>
                      )}
                    </div>

                    <div className="upload-tip">
                      Uma boa foto ajuda a identificar o pet com mais facilidade.
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="pets-actions">
              <button
                type="button"
                className="btn"
                onClick={enviarFormularioExternamente}
              >
                Cadastrar pet
              </button>
            </div>
          </div>
        </div>
      )}


    </>
  );
}

export default Pets;