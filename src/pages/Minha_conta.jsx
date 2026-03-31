import React, { useState, useEffect } from "react";
import "../styles/minha_conta.css";
import SinoIcon from "../assets/icons/sininho.png";
import SinoIconHover from "../assets/icons/sininho-h.png";
import IconSenha from "../assets/icons/lock.png";
import IconSenhaHover from "../assets/icons/lock-h.png";
import IconEdit from "../assets/icons/edit.png";
import IconEditHover from "../assets/icons/edit-h.png";
import IconLogout from "../assets/icons/logout.png";
import IconLogoutHover from "../assets/icons/logout-h.png";
import {
  Eye,
  EyeOff,
  Calendar,
  MapPin,
  Phone,
  Mail,
  PawPrint,
  Bell,
  User,
  Heart,
} from "lucide-react";

import { userService } from "../services/userService";
import petService from "../services/petService";

export default function MinhaConta() {
  const [foto, setFoto] = useState(null);
  const [hoverSino, setHoverSino] = useState(false);
  const [hoverSenha, setHoverSenha] = useState(false);
  const [hoverEdit, setHoverEdit] = useState(false);
  const [hoverLogout, setHoverLogout] = useState(false);

  const [openModalSenha, setOpenModalSenha] = useState(false);
  const [modalAgendamentos, setModalAgendamentos] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalNotificacoes, setModalNotificacoes] = useState(false);

  const [abaEditar, setAbaEditar] = useState("pessoal");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [receberLembretes, setReceberLembretes] = useState(true);
  const [receberPromocoes, setReceberPromocoes] = useState(false);

  const [dados, setDados] = useState(null);
  const [formEditar, setFormEditar] = useState({});
  const [pets, setPets] = useState([]);
  const [petSelecionadoId, setPetSelecionadoId] = useState("");
  const [petEmEdicaoId, setPetEmEdicaoId] = useState("");

  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const agendamentos = [
    {
      servico: "Banho e tosa",
      data: "10/10/2025",
      horario: "15:00",
      status: "Concluído",
    },
    {
      servico: "Escovação dental",
      data: "15/10/2025",
      horario: "10:30",
      status: "Aguardando",
    },
    {
      servico: "Hidratação",
      data: "20/10/2025",
      horario: "14:00",
      status: "Agendado",
    },
    {
      servico: "Corte de unhas",
      data: "25/10/2025",
      horario: "16:00",
      status: "Agendado",
    },
    {
      servico: "Consulta veterinária",
      data: "30/10/2025",
      horario: "09:00",
      status: "Aguardando",
    },
  ];

  function traduzirEspecie(species) {
    if (species === "dog") return "Cachorro";
    if (species === "cat") return "Gato";
    return "";
  }

  function traduzirPorte(size) {
    if (size === "S") return "Pequeno";
    if (size === "M") return "Médio";
    if (size === "L") return "Grande";
    if (size === "G") return "Gigante";
    return "";
  }

  function traduzirSexo(sex) {
    if (sex === "M") return "Macho";
    if (sex === "F") return "Fêmea";
    return "";
  }

  function normalizarEspecie(label) {
    if (label === "Cachorro") return "dog";
    if (label === "Gato") return "cat";
    return label;
  }

  function normalizarPorte(label) {
    if (label === "Pequeno") return "S";
    if (label === "Médio" || label === "Medio") return "M";
    if (label === "Grande") return "L";
    if (label === "Gigante") return "G";
    return label;
  }

  function normalizarSexo(label) {
    if (label === "Macho") return "M";
    if (label === "Fêmea" || label === "Femea") return "F";
    return label;
  }

  function preencherDadosPetNaTela(pet) {
    if (!pet) return;

    setDados((prev) => ({
      ...(prev || {}),
      nomePet: pet.name || "",
      especiePet: traduzirEspecie(pet.species),
      racaPet: pet.breed || "",
      portePet: traduzirPorte(pet.size),
      pesoPet: pet.weight || "",
      nascimentoPet: pet.birth_date
        ? new Date(pet.birth_date).toLocaleDateString("pt-BR")
        : "",
      sexoPet: traduzirSexo(pet.sex),
    }));
  }

  useEffect(() => {
    const cpf = localStorage.getItem("userCpf");
    if (!cpf) return;

    async function carregarDados() {
      try {
        const resUser = await userService.showUser(cpf);
        const user = resUser.data;

        setDados({
          nome: user.name,
          email: user.email,
          telefone: user.contacts?.[0]?.number || "",
          endereco: user.addresses?.[0]?.location?.split(",")[0]?.trim() || "",
          bairro: user.addresses?.[0]?.location?.split(",")[1]?.trim() || "",
          cep: user.addresses?.[0]?.cep || "",
          estado: user.addresses?.[0]?.location?.split(",")[3]?.trim() || "",
          cidade: user.addresses?.[0]?.location?.split(",")[2]?.trim() || "",
          numero: user.addresses?.[0]?.complement || "",
          nomePet: "",
          especiePet: "",
          racaPet: "",
          portePet: "",
          pesoPet: "",
          nascimentoPet: "",
          sexoPet: "",
        });

        const resPets = await petService.listar_meus_pets();
        const meusPets = Array.isArray(resPets) ? resPets : resPets?.data || [];

        setPets(meusPets);

        if (meusPets.length > 0) {
          const primeiroPet = meusPets[0];
          setPetSelecionadoId(primeiroPet.id);
          setPetEmEdicaoId(primeiroPet.id);

          setDados((prev) => ({
            ...(prev || {}),
            nome: user.name,
            email: user.email,
            telefone: user.contacts?.[0]?.number || "",
            endereco:
              user.addresses?.[0]?.location?.split(",")[0]?.trim() || "",
            bairro:
              user.addresses?.[0]?.location?.split(",")[1]?.trim() || "",
            cep: user.addresses?.[0]?.cep || "",
            estado:
              user.addresses?.[0]?.location?.split(",")[3]?.trim() || "",
            cidade:
              user.addresses?.[0]?.location?.split(",")[2]?.trim() || "",
            numero: user.addresses?.[0]?.complement || "",
            nomePet: primeiroPet.name || "",
            especiePet: traduzirEspecie(primeiroPet.species),
            racaPet: primeiroPet.breed || "",
            portePet: traduzirPorte(primeiroPet.size),
            pesoPet: primeiroPet.weight || "",
            nascimentoPet: primeiroPet.birth_date
              ? new Date(primeiroPet.birth_date).toLocaleDateString("pt-BR")
              : "",
            sexoPet: traduzirSexo(primeiroPet.sex),
          }));
        }
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    }

    carregarDados();
  }, []);

  function handleFoto(e) {
    const file = e.target.files[0];
    if (file) setFoto(file);
  }

  function abrirModalEditar() {
    if (dados) {
      setFormEditar({ ...dados });
    }
    setAbaEditar("pessoal");
    setModalEditar(true);
  }

  function abrirModalPet() {
    if (pets.length > 0) {
      const petAtual =
        pets.find((pet) => String(pet.id) === String(petSelecionadoId)) ||
        pets[0];

      setPetEmEdicaoId(petAtual.id);

      setFormEditar((prev) => ({
        ...(prev || {}),
        ...(dados || {}),
        petId: petAtual.id,
        nomePet: petAtual.name || "",
        especiePet: traduzirEspecie(petAtual.species),
        racaPet: petAtual.breed || "",
        portePet: traduzirPorte(petAtual.size),
        pesoPet: petAtual.weight || "",
        nascimentoPet: petAtual.birth_date
          ? new Date(petAtual.birth_date).toISOString().split("T")[0]
          : "",
        sexoPet: traduzirSexo(petAtual.sex),
      }));
    } else {
      setFormEditar((prev) => ({
        ...(prev || {}),
        ...(dados || {}),
        petId: "",
        nomePet: "",
        especiePet: "",
        racaPet: "",
        portePet: "",
        pesoPet: "",
        nascimentoPet: "",
        sexoPet: "",
      }));
      setPetEmEdicaoId("");
    }

    setAbaEditar("pet");
    setModalEditar(true);
  }

  function atualizarCampo(e) {
    setFormEditar({
      ...formEditar,
      [e.target.name]: e.target.value,
    });
  }

  function trocarPetSelecionado(e) {
    const idSelecionado = e.target.value;
    setPetEmEdicaoId(idSelecionado);

    const petEscolhido = pets.find(
      (pet) => String(pet.id) === String(idSelecionado)
    );

    if (!petEscolhido) return;

    setFormEditar((prev) => ({
      ...(prev || {}),
      petId: petEscolhido.id,
      nomePet: petEscolhido.name || "",
      especiePet: traduzirEspecie(petEscolhido.species),
      racaPet: petEscolhido.breed || "",
      portePet: traduzirPorte(petEscolhido.size),
      pesoPet: petEscolhido.weight || "",
      nascimentoPet: petEscolhido.birth_date
        ? new Date(petEscolhido.birth_date).toISOString().split("T")[0]
        : "",
      sexoPet: traduzirSexo(petEscolhido.sex),
    }));
  }

  async function salvarAlteracoes(e) {
    e.preventDefault();

    const cpf = localStorage.getItem("userCpf");

    try {
      if (abaEditar === "pessoal" || abaEditar === "endereco") {
        const body = {
          name: formEditar.nome,
          email: formEditar.email,
          contact: {
            name: formEditar.nome,
            number: formEditar.telefone,
          },
          address: {
            type: "Casa",
            cep: formEditar.cep?.replace(/\D/g, ""),
            location: `${formEditar.endereco}, ${formEditar.bairro}, ${formEditar.cidade}, ${formEditar.estado}`,
            complement: formEditar.numero,
          },
        };

        await userService.updateUser(cpf, body);

        setDados((prev) => ({
          ...prev,
          nome: formEditar.nome,
          email: formEditar.email,
          telefone: formEditar.telefone,
          endereco: formEditar.endereco,
          bairro: formEditar.bairro,
          cep: formEditar.cep,
          estado: formEditar.estado,
          cidade: formEditar.cidade,
          numero: formEditar.numero,
        }));

        setModalEditar(false);
        alert("Dados atualizados com sucesso!");
        return;
      }

      if (abaEditar === "pet") {
        if (!petEmEdicaoId) {
          alert("Selecione um pet para editar.");
          return;
        }

        const petAtual = pets.find(
          (pet) => String(pet.id) === String(petEmEdicaoId)
        );

        const bodyPet = {
          name: formEditar.nomePet,
          species: normalizarEspecie(formEditar.especiePet),
          breed: formEditar.racaPet,
          size: normalizarPorte(formEditar.portePet),
          weight: Number(formEditar.pesoPet),
          birth_date: formEditar.nascimentoPet
            ? new Date(formEditar.nascimentoPet).toISOString()
            : null,
          sex: normalizarSexo(formEditar.sexoPet),
          observations: petAtual?.observations || "",
          user_cpf: cpf,
        };

        await petService.atualizar(petEmEdicaoId, bodyPet);

        const petsAtualizados = pets.map((pet) =>
          String(pet.id) === String(petEmEdicaoId)
            ? {
                ...pet,
                ...bodyPet,
              }
            : pet
        );

        setPets(petsAtualizados);

        const petAtualizado = petsAtualizados.find(
          (pet) => String(pet.id) === String(petEmEdicaoId)
        );

        if (petAtualizado) {
          setPetSelecionadoId(petAtualizado.id);
          preencherDadosPetNaTela(petAtualizado);
        }

        setModalEditar(false);
        alert("Pet atualizado com sucesso!");
      }
    } catch (err) {
      console.error("Erro ao atualizar:", err);
      alert(err.response?.data?.error || "Erro ao atualizar dados.");
    }
  }

  const handleSavePassword = () => {
    alert("Senha alterada com sucesso!");
    setNewPassword("");
    setConfirmPassword("");
    setShowOld(false);
    setShowNew(false);
    setShowConfirm(false);
    setOpenModalSenha(false);
  };

  const validatePassword = (password) => {
    const minChar = password.length >= 8;
    const upper = /[A-Z]/.test(password);
    const number = /[0-9]/.test(password);

    return { minChar, upper, number };
  };

  const { minChar, upper, number } = validatePassword(newPassword);
  const passwordValid = minChar && upper && number;

  const passwordStrength = passwordValid
    ? "Senha forte ✓"
    : "A senha deve conter: mínimo 8 caracteres, letra maiúscula e número";

  function sair() {
    localStorage.clear();
    window.location.href = "/conta";
  }

  if (!dados) return <p>Carregando...</p>;

  return (
    <div className="minha-conta-page">
      <div className="minha-conta-header">
        <div>
          <span className="page-kicker">
            {isAdmin ? "Área da gerência" : "Área do cliente"}
          </span>

          <h1 className="titulo-conta">Minha conta</h1>

          <p className="subtitulo-conta">
            {isAdmin
              ? "Mantenha seus dados de acesso e informações da gerência sempre atualizados."
              : "Mantenha seu perfil atualizado e acompanhe tudo sobre você e seu pet em um só lugar."}
          </p>
        </div>

        <button
          className="btn-notificacao"
          onClick={() => setModalNotificacoes(true)}
          onMouseEnter={() => setHoverSino(true)}
          onMouseLeave={() => setHoverSino(false)}
        >
          <img
            src={hoverSino ? SinoIconHover : SinoIcon}
            alt="Notificações"
            className="icone-sino"
          />
        </button>
      </div>

      <div className="conta-top-grid">
        <div className="hero-card">
          <div className="hero-card-left">
            <div className="hero-avatar">
              {foto ? (
                <img
                  src={URL.createObjectURL(foto)}
                  alt="Perfil"
                  className="hero-avatar-img"
                />
              ) : (
                <User size={34} />
              )}
            </div>

            <div className="hero-info">
              <span className="hero-badge">
                {isAdmin ? "Gerência Petnet" : "Tutor(a) Petnet"}
              </span>
              <h2>{dados.nome}</h2>
              <p>
                {isAdmin
                  ? "Conta ativa para gestão e acompanhamento administrativo da Petnet."
                  : "Conta ativa e pronta para acompanhar o cuidado do seu pet."}
              </p>
            </div>
          </div>

          <div className="hero-actions">
            <button className="hero-btn" onClick={abrirModalEditar}>
              Editar perfil
            </button>
          </div>
        </div>

        <div className="pet-highlight-card">
          <div className="pet-highlight-top">
            <div className="pet-mini-icon">
              <PawPrint size={22} />
            </div>
            <span>Pet em destaque</span>
          </div>

          <h3>{dados.nomePet || "Nenhum pet cadastrado"}</h3>

          {dados.nomePet && (
            <>
              <div className="pet-highlight-tags">
                <span>{dados.especiePet}</span>
                <span>{dados.racaPet}</span>
                <span>{dados.portePet}</span>
              </div>
              <p>
                Peso: <strong>{dados.pesoPet} kg</strong>
              </p>
            </>
          )}
        </div>
      </div>

      <div className="resumo-cards">
        <div className="resumo-card">
          <div className="resumo-icon blue">
            <Calendar size={18} />
          </div>
          <div>
            <h4>Próximos serviços</h4>
            <p>2 agendamentos futuros</p>
          </div>
        </div>

        <div className="resumo-card">
          <div className="resumo-icon yellow">
            <Bell size={18} />
          </div>
          <div>
            <h4>Lembretes</h4>
            <p>{receberLembretes ? "Ativados" : "Desativados"}</p>
          </div>
        </div>

        <div className="resumo-card">
          <div className="resumo-icon pink">
            <Heart size={18} />
          </div>
          <div>
            <h4>Pets cadastrados</h4>
            <p>{pets.length} pet(s) registrado(s)</p>
          </div>
        </div>
      </div>

      <div className="conta-main-grid">
        <div className="left-column">
          <section className="card-conta">
            <div className="card-header">
              <h3>Dados do tutor</h3>
              <button className="btn-link" onClick={abrirModalEditar}>
                Editar
              </button>
            </div>

            <div className="info-grid">
              <div className="info-card">
                <span className="info-label">
                  <Mail size={15} /> E-mail
                </span>
                <p>{dados.email}</p>
              </div>

              <div className="info-card">
                <span className="info-label">
                  <Phone size={15} /> Telefone
                </span>
                <p>{dados.telefone}</p>
              </div>

              <div className="info-card info-card-full">
                <span className="info-label">
                  <MapPin size={15} /> Endereço
                </span>
                <p>
                  {dados.endereco}, Nº {dados.numero} <br />
                  Bairro: {dados.bairro} <br />
                  CEP: {dados.cep} <br />
                  {dados.cidade} - {dados.estado}
                </p>
              </div>
            </div>
          </section>

          <section className="card-conta">
            <div className="card-header">
              <h3>Meu pet</h3>
              <button className="btn-link" onClick={abrirModalPet}>
                Atualizar
              </button>
            </div>

            <div className="pet-details-grid">
              <div className="pet-detail-box">
                <label>Nome</label>
                <span>{dados.nomePet || "--"}</span>
              </div>

              <div className="pet-detail-box">
                <label>Espécie</label>
                <span>{dados.especiePet || "--"}</span>
              </div>

              <div className="pet-detail-box">
                <label>Raça</label>
                <span>{dados.racaPet || "--"}</span>
              </div>

              <div className="pet-detail-box">
                <label>Porte</label>
                <span>{dados.portePet || "--"}</span>
              </div>

              <div className="pet-detail-box">
                <label>Peso</label>
                <span>{dados.pesoPet ? `${dados.pesoPet} kg` : "--"}</span>
              </div>

              <div className="pet-detail-box">
                <label>Sexo</label>
                <span>{dados.sexoPet || "--"}</span>
              </div>
            </div>
          </section>

          <section className="card-conta">
            <div className="card-header">
              <h3>Meus agendamentos</h3>
              <button
                className="btn-link"
                onClick={() => setModalAgendamentos(true)}
              >
                Ver todos
              </button>
            </div>

            <div className="agendamentos-lista-home">
              {agendamentos.slice(0, 3).map((item, index) => (
                <div className="agendamento-card" key={index}>
                  <div>
                    <h4>{item.servico}</h4>
                    <p>
                      {item.data} às {item.horario}
                    </p>
                  </div>

                  <span
                    className={`agendamento-badge ${
                      item.status === "Concluído"
                        ? "concluido"
                        : item.status === "Aguardando"
                        ? "aguardando"
                        : "agendado"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="right-column">
          <section className="card-conta foto-card">
            <div className="card-header">
              <h3>Foto do tutor ou do pet</h3>
            </div>

            <div className="foto-area">
              <label className="upload-box">
                {foto ? (
                  <img
                    src={URL.createObjectURL(foto)}
                    className="foto-preview"
                    alt="Prévia"
                  />
                ) : (
                  <div className="foto-placeholder">
                    <PawPrint size={36} />
                    <p>Adicionar foto</p>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleFoto} />
              </label>

              {!foto ? (
                <button
                  className="foto-btn"
                  onClick={() =>
                    document.querySelector("#fileInputFake").click()
                  }
                >
                  Escolher foto
                </button>
              ) : (
                <div className="foto-btns">
                  <button
                    className="foto-btn trocar"
                    onClick={() =>
                      document.querySelector("#fileInputFake").click()
                    }
                  >
                    Trocar foto
                  </button>

                  <button
                    className="foto-btn remover"
                    onClick={() => setFoto(null)}
                  >
                    Remover foto
                  </button>
                </div>
              )}

              <input
                id="fileInputFake"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFoto}
              />
            </div>
          </section>

          <section className="card-conta">
            <div className="card-header">
              <h3>Preferências</h3>
            </div>

            <div className="prefs-box modern">
              <div className="toggle-line">
                <div>
                  <strong>Receber lembretes</strong>
                  <p>Notificações sobre próximos serviços</p>
                </div>

                <label className="switch">
                  <input
                    type="checkbox"
                    checked={receberLembretes}
                    onChange={() => setReceberLembretes(!receberLembretes)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>

              <div className="toggle-line">
                <div>
                  <strong>Receber promoções</strong>
                  <p>Ofertas e novidades da Petnet</p>
                </div>

                <label className="switch">
                  <input
                    type="checkbox"
                    checked={receberPromocoes}
                    onChange={() => setReceberPromocoes(!receberPromocoes)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </section>

          <section className="card-conta">
            <div className="card-header">
              <h3>Ações rápidas</h3>
            </div>

            <div className="acoes-lista">
              <button
                className="acao-item"
                onMouseEnter={() => setHoverSenha(true)}
                onMouseLeave={() => setHoverSenha(false)}
                onClick={() => setOpenModalSenha(true)}
              >
                <img
                  src={hoverSenha ? IconSenhaHover : IconSenha}
                  alt="Alterar senha"
                  className="acao-icon"
                />
                <span>Alterar senha</span>
              </button>

              <button
                className="acao-item"
                onClick={abrirModalPet}
                onMouseEnter={() => setHoverEdit(true)}
                onMouseLeave={() => setHoverEdit(false)}
              >
                <img
                  src={hoverEdit ? IconEditHover : IconEdit}
                  alt="Atualizar informações do pet"
                  className="acao-icon"
                />
                <span>Atualizar informações do pet</span>
              </button>

              <button
                className="acao-item sair-btn"
                onClick={sair}
                onMouseEnter={() => setHoverLogout(true)}
                onMouseLeave={() => setHoverLogout(false)}
              >
                <img
                  src={hoverLogout ? IconLogoutHover : IconLogout}
                  alt="Sair da conta"
                  className="acao-icon"
                />
                <span>Sair da conta</span>
              </button>
            </div>
          </section>
        </div>
      </div>

      {modalAgendamentos && (
        <div className="modal-bg" onClick={() => setModalAgendamentos(false)}>
          <div
            className="modal-agendamentos"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="agend-topo">
              <h2>Todos os Agendamentos</h2>
              <button
                className="btn-close-x"
                onClick={() => setModalAgendamentos(false)}
              >
                ×
              </button>
            </div>

            <div className="agend-lista">
              {agendamentos.map((item, index) => (
                <div className="agend-item" key={index}>
                  <span className="agend-title">{item.servico}</span>
                  <p className="agend-info">
                    {item.data} às {item.horario}
                  </p>
                  <span
                    className={`agend-status ${
                      item.status === "Concluído"
                        ? "concluido"
                        : item.status === "Aguardando"
                        ? "aguardando"
                        : "agendado"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {modalEditar && (
        <div className="modal-bg" onClick={() => setModalEditar(false)}>
          <div
            className="modal modal-editar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="tabs-editar">
              <button
                className={abaEditar === "pessoal" ? "tab ativa" : "tab"}
                onClick={() => setAbaEditar("pessoal")}
              >
                Dados pessoais
              </button>

              <button
                className={abaEditar === "endereco" ? "tab ativa" : "tab"}
                onClick={() => setAbaEditar("endereco")}
              >
                Endereço
              </button>

              <button
                className={abaEditar === "pet" ? "tab ativa" : "tab"}
                onClick={abrirModalPet}
              >
                Pet
              </button>
            </div>

            <h2 className="modal-titulo">Editar informações</h2>

            <form className="form-editar" onSubmit={salvarAlteracoes}>
              {abaEditar === "pessoal" && (
                <>
                  <label>
                    Nome
                    <input
                      name="nome"
                      type="text"
                      value={formEditar.nome || ""}
                      onChange={atualizarCampo}
                    />
                  </label>

                  <label>
                    E-mail
                    <input
                      name="email"
                      type="email"
                      value={formEditar.email || ""}
                      onChange={atualizarCampo}
                    />
                  </label>

                  <label>
                    Telefone
                    <input
                      name="telefone"
                      type="text"
                      value={formEditar.telefone || ""}
                      onChange={atualizarCampo}
                    />
                  </label>
                </>
              )}

              {abaEditar === "endereco" && (
                <>
                  <label>
                    Endereço
                    <input
                      name="endereco"
                      type="text"
                      value={formEditar.endereco || ""}
                      onChange={atualizarCampo}
                    />
                  </label>

                  <label>
                    Bairro
                    <input
                      name="bairro"
                      type="text"
                      value={formEditar.bairro || ""}
                      onChange={atualizarCampo}
                    />
                  </label>

                  <label>
                    CEP
                    <input
                      name="cep"
                      type="text"
                      value={formEditar.cep || ""}
                      onChange={atualizarCampo}
                    />
                  </label>

                  <label>
                    Estado (UF)
                    <input
                      name="estado"
                      type="text"
                      value={formEditar.estado || ""}
                      onChange={atualizarCampo}
                    />
                  </label>

                  <label>
                    Cidade
                    <input
                      name="cidade"
                      type="text"
                      value={formEditar.cidade || ""}
                      onChange={atualizarCampo}
                    />
                  </label>

                  <label>
                    Número
                    <input
                      name="numero"
                      type="text"
                      value={formEditar.numero || ""}
                      onChange={atualizarCampo}
                    />
                  </label>
                </>
              )}

              {abaEditar === "pet" && (
                <>
                  <label>
                    Nome do pet/apelido
                    <select
                      name="petId"
                      value={petEmEdicaoId || ""}
                      onChange={trocarPetSelecionado}
                    >
                      <option value="">Selecione um pet</option>
                      {pets.map((pet) => (
                        <option key={pet.id} value={pet.id}>
                          {pet.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Espécie
                    <select
                      name="especiePet"
                      value={formEditar.especiePet || ""}
                      onChange={atualizarCampo}
                    >
                      <option value="">Escolha a espécie</option>
                      <option value="Cachorro">Cachorro</option>
                      <option value="Gato">Gato</option>
                    </select>
                  </label>

                  <label>
                    Raça
                    <input
                      name="racaPet"
                      type="text"
                      value={formEditar.racaPet || ""}
                      onChange={atualizarCampo}
                    />
                  </label>

                  <label>
                    Porte
                    <select
                      name="portePet"
                      value={formEditar.portePet || ""}
                      onChange={atualizarCampo}
                    >
                      <option value="">Escolha o porte</option>
                      <option value="Pequeno">Pequeno</option>
                      <option value="Médio">Médio</option>
                      <option value="Grande">Grande</option>
                      <option value="Gigante">Gigante</option>
                    </select>
                  </label>

                  <label>
                    Peso (kg)
                    <input
                      name="pesoPet"
                      type="number"
                      value={formEditar.pesoPet || ""}
                      onChange={atualizarCampo}
                    />
                  </label>

                  <label>
                    Data de nascimento
                    <input
                      name="nascimentoPet"
                      type="date"
                      value={formEditar.nascimentoPet || ""}
                      onChange={atualizarCampo}
                    />
                  </label>

                  <label>
                    Sexo
                    <select
                      name="sexoPet"
                      value={formEditar.sexoPet || ""}
                      onChange={atualizarCampo}
                    >
                      <option value="">Selecione</option>
                      <option value="Macho">Macho</option>
                      <option value="Fêmea">Fêmea</option>
                    </select>
                  </label>
                </>
              )}

              <div className="botoes-editar">
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() => setModalEditar(false)}
                >
                  Cancelar
                </button>

                <button type="submit" className="btn-salvar">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalNotificacoes && (
        <div className="modal-bg" onClick={() => setModalNotificacoes(false)}>
          <div
            className="modal modal-notificacoes"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="notif-topo">
              <h2>Notificações</h2>
              <button
                className="btn-close-x"
                onClick={() => setModalNotificacoes(false)}
              >
                ×
              </button>
            </div>

            <div className="notif-lista">
              <div className="notif-item">
                <span className="notif-titulo">Agendamento amanhã</span>
                <p className="notif-desc">
                  Seu pet tem um banho marcado amanhã às 15h.
                </p>
              </div>

              <div className="notif-item">
                <span className="notif-titulo">Promoção ativa</span>
                <p className="notif-desc">
                  Banho e tosa com 20% OFF até sexta!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {openModalSenha && (
        <div className="modal-bg">
          <div className="modal-alterar-senha">
            <div className="senha-topo">
              <h2>Alterar Senha</h2>
              <button
                className="btn-close-x-senha"
                onClick={() => setOpenModalSenha(false)}
              >
                ×
              </button>
            </div>

            <form className="form-senha">
              <label>
                Senha Atual
                <div className="input-group">
                  <input type={showOld ? "text" : "password"} />
                  <span
                    className="eye-btn"
                    onClick={() => setShowOld(!showOld)}
                  >
                    {showOld ? (
                      <EyeOff size={20} color="#275cce" />
                    ) : (
                      <Eye size={20} color="#275cce" />
                    )}
                  </span>
                </div>
              </label>

              <label>
                Nova Senha
                <div className="input-group">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <span
                    className="eye-btn"
                    onClick={() => setShowNew(!showNew)}
                  >
                    {showNew ? (
                      <EyeOff size={20} color="#275cce" />
                    ) : (
                      <Eye size={20} color="#275cce" />
                    )}
                  </span>
                </div>

                <p className="password-strength">{passwordStrength}</p>
              </label>

              <label>
                Confirmar Nova Senha
                <div className="input-group">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <span
                    className="eye-btn"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? (
                      <EyeOff size={20} color="#275cce" />
                    ) : (
                      <Eye size={20} color="#275cce" />
                    )}
                  </span>
                </div>

                {confirmPassword && confirmPassword !== newPassword && (
                  <p className="erro-senha">As senhas não são iguais</p>
                )}
              </label>
            </form>

            <div className="senha-botoes">
              <button
                className="btn-cancelar-senha"
                onClick={() => setOpenModalSenha(false)}
              >
                Cancelar
              </button>

              <button
                className="btn-confirmar-senha"
                disabled={!passwordValid || confirmPassword !== newPassword}
                onClick={handleSavePassword}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}