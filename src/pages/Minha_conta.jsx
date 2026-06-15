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
import LoadingScreen from "../components/LoadingScreen";
import AdminSidebar from "../components/AdminSidebar";


import {
  listarNotificacoes,
  marcarNotificacaoComoLida,
} from "../utils/notificacoesLocal";


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
  Plus,
  Trash2,
} from "lucide-react";

import { userService } from "../services/userService";
import petService from "../services/petService";
import scheduleService from "../services/scheduleService";

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

  const [criandoNovoPet, setCriandoNovoPet] = useState(false);

  const [notificacoes, setNotificacoes] = useState([]);

  // 🔁 NOVO: estado para agendamentos reais
  const [agendamentos, setAgendamentos] = useState([]);
  const [carregandoAgendamentos, setCarregandoAgendamentos] = useState(false);

  const isAdmin = localStorage.getItem("isAdmin") === "true";

  useEffect(() => {
    if (modalNotificacoes) {
      //setNotificacoes(listarNotificacoes());
    }
  }, [modalNotificacoes]);

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
    if (label === "Gigante") return "XL";
    return label;
  }

  function normalizarSexo(label) {
    if (label === "Macho") return "M";
    if (label === "Fêmea" || label === "Femea") return "F";
    return label;
  }

  function preencherDadosPetNaTela(pet, contatos = [], enderecos = []) {
    if (!pet) return;

    setDados((prev) => ({
      ...prev,
      nomePet: pet.name || "",
      especiePet: pet.species || "",
      racaPet: pet.breed || "",
      portePet: pet.size || "",
      pesoPet: pet.weight || "",
      nascimentoPet: pet.birth_date
        ? new Date(pet.birth_date).toLocaleDateString("pt-BR")
        : "",
      sexoPet: pet.sex || "",
      telefone: contatos[0]?.number || "",
      contatos,
      tipo: enderecos[0]?.type || "",
      endereco: enderecos[0]?.address || "",
      numero: enderecos[0]?.number || "",
      complemento: enderecos[0]?.complement || "",
      bairro: enderecos[0]?.neighborhood || "",
      cep: enderecos[0]?.cep || "",
      localizacao: enderecos[0]?.locaticion || "",
      enderecos,
    }));
  }

  // 🔁 NOVA FUNÇÃO: Formata status para exibição
  function obterStatusVisual(status) {
    const statusNormalizado = String(status || "")
      .trim()
      .toUpperCase();

    const statusMap = {
      SCHEDULED: {
        label: "Agendado",
        classe: "agendado",
      },
      AGENDADO: {
        label: "Agendado",
        classe: "agendado",
      },

      CONFIRMED: {
        label: "Confirmado",
        classe: "confirmado",
      },
      CONFIRMADO: {
        label: "Confirmado",
        classe: "confirmado",
      },

      PENDING: {
        label: "Pendente",
        classe: "pendente",
      },
      PENDENTE: {
        label: "Pendente",
        classe: "pendente",
      },

      IN_PROGRESS: {
        label: "Em andamento",
        classe: "em-andamento",
      },
      EM_ANDAMENTO: {
        label: "Em andamento",
        classe: "em-andamento",
      },
      "EM ANDAMENTO": {
        label: "Em andamento",
        classe: "em-andamento",
      },

      FINISHED: {
        label: "Finalizado",
        classe: "finalizado",
      },
      COMPLETED: {
        label: "Finalizado",
        classe: "finalizado",
      },
      FINALIZED: {
        label: "Finalizado",
        classe: "finalizado",
      },
      FINALIZADO: {
        label: "Finalizado",
        classe: "finalizado",
      },
      CONCLUIDO: {
        label: "Finalizado",
        classe: "finalizado",
      },
      "CONCLUÍDO": {
        label: "Finalizado",
        classe: "finalizado",
      },

      DELIVERED: {
        label: "Entregue",
        classe: "entregue",
      },
      ENTREGUE: {
        label: "Entregue",
        classe: "entregue",
      },

      CANCELLED: {
        label: "Cancelado",
        classe: "cancelado",
      },
      CANCELED: {
        label: "Cancelado",
        classe: "cancelado",
      },
      CANCELADO: {
        label: "Cancelado",
        classe: "cancelado",
      },
    };

    return (
      statusMap[statusNormalizado] || {
        label: statusNormalizado
          ? statusNormalizado
            .toLowerCase()
            .replace(/_/g, " ")
            .replace(/\b\w/g, (letra) => letra.toUpperCase())
          : "Status não informado",
        classe: "neutro",
      }
    );
  }

  function statusEstaEncerrado(status) {
    const statusNormalizado = String(status || "")
      .trim()
      .toUpperCase();

    return [
      "FINISHED",
      "COMPLETED",
      "FINALIZED",
      "FINALIZADO",
      "CONCLUIDO",
      "CONCLUÍDO",
      "DELIVERED",
      "ENTREGUE",
      "CANCELLED",
      "CANCELED",
      "CANCELADO",
    ].includes(statusNormalizado);
  }

  // 🔁 NOVA FUNÇÃO: Carrega agendamentos do usuário
  async function carregarAgendamentos(cpf) {
    setCarregandoAgendamentos(true);

    try {
      const res =
        (await scheduleService.listarPorCliente?.(cpf)) ||
        (await scheduleService.listar());

      const todos = Array.isArray(res) ? res : res?.data || [];

      const meus = todos.filter(
        (agendamento) =>
          String(agendamento.client_cpf) === String(cpf)
      );

      const meusPets = Array.isArray(pets) ? pets : [];

      const agendamentosFormatados = meus.map((agendamento) => {
        const pet = meusPets.find(
          (itemPet) =>
            String(itemPet.id) === String(agendamento.pet_id)
        );

        const dataAgendamento = agendamento.date_time
          ? new Date(agendamento.date_time)
          : null;

        const statusVisual = obterStatusVisual(
          agendamento.status
        );

        return {
          id: agendamento.id,

          petNome: pet?.name || "Pet não identificado",

          servico:
            agendamento.services
              ?.map((servico) => servico.name || servico)
              .join(", ") || "Serviço não informado",

          data: dataAgendamento
            ? dataAgendamento.toLocaleDateString("pt-BR")
            : "--",

          horario: dataAgendamento
            ? dataAgendamento.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })
            : "--",

          dataOrdenacao: dataAgendamento?.getTime() || 0,

          status: statusVisual.label,
          statusClasse: statusVisual.classe,

          statusOriginal: String(
            agendamento.status || ""
          )
            .trim()
            .toUpperCase(),
        };
      });

      agendamentosFormatados.sort(
        (primeiro, segundo) =>
          segundo.dataOrdenacao - primeiro.dataOrdenacao
      );

      setAgendamentos(agendamentosFormatados);
    } catch (err) {
      console.error(
        "Erro ao carregar agendamentos:",
        err
      );

      setAgendamentos([]);
    } finally {
      setCarregandoAgendamentos(false);
    }
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
          endereco: user.addresses?.[0]?.address || "",
          bairro: user.addresses?.[0]?.neighborhood || "",
          cep: user.addresses?.[0]?.cep || "",
          complemento: user.addresses?.[0]?.complement || "",
          localizacao: user.addresses?.[0]?.locaticion || "",
          tipo: user.addresses?.[0]?.type || "",
          numero: user.addresses?.[0]?.number || "",
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
            endereco: user.addresses?.[0]?.address || "",
            bairro: user.addresses?.[0]?.neighborhood || "",
            cep: user.addresses?.[0]?.cep || "",
            complemento: user.addresses?.[0]?.complement || "",
            localizacao: user.addresses?.[0]?.locaticion || "",
            tipo: user.addresses?.[0]?.type || "",
            numero: user.addresses?.[0]?.number || "",
            nomePet: primeiroPet.name || "",
            especiePet: primeiroPet.species || "",
            racaPet: primeiroPet.breed || "",
            portePet: primeiroPet.size || "",
            pesoPet: primeiroPet.weight || "",
            nascimentoPet: primeiroPet.birth_date
              ? new Date(primeiroPet.birth_date).toLocaleDateString("pt-BR")
              : "",
            sexoPet: primeiroPet.sex || "",
          }));
        } else {
          setDados((prev) => ({
            ...(prev || {}),
            nome: user.name,
            email: user.email,
            telefone: user.contacts?.[0]?.number || "",
            endereco: user.addresses?.[0]?.address || "",
            bairro: user.addresses?.[0]?.neighborhood || "",
            cep: user.addresses?.[0]?.cep || "",
            complemento: user.addresses?.[0]?.complement || "",
            localizacao: user.addresses?.[0]?.locaticion || "",
            tipo: user.addresses?.[0]?.type || "",
            numero: user.addresses?.[0]?.number || "",
          }));
        }

        // 🔁 Carrega agendamentos após carregar pets
        await carregarAgendamentos(cpf);

      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    }

    carregarDados();
  }, []);

  // 🔁 Efeito para recarregar agendamentos quando pets mudar
  useEffect(() => {
    const cpf = localStorage.getItem("userCpf");
    if (cpf && pets.length > 0) {
      carregarAgendamentos(cpf);
    }
  }, [pets]);

  function handleFoto(e) {
    const file = e.target.files[0];
    if (file) setFoto(file);
  }

  function abrirModalEditar() {
    if (dados) {
      setFormEditar(garantirListasEdicao({ ...dados }));
    }

    setAbaEditar("pessoal");
    setModalEditar(true);
  }

  function abrirModalPet() {
    setCriandoNovoPet(false);
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
        especiePet: petAtual.species || "",
        racaPet: petAtual.breed || "",
        portePet: petAtual.size || "",
        pesoPet: petAtual.weight || "",
        nascimentoPet: petAtual.birth_date
          ? new Date(petAtual.birth_date).toISOString().split("T")[0]
          : "",
        sexoPet: petAtual.sex || "",
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
    setCriandoNovoPet(false);
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
      especiePet: petEscolhido.species || "",
      racaPet: petEscolhido.breed || "",
      portePet: petEscolhido.size || "",
      pesoPet: petEscolhido.weight || "",
      nascimentoPet: petEscolhido.birth_date
        ? new Date(petEscolhido.birth_date).toISOString().split("T")[0]
        : "",
      sexoPet: petEscolhido.sex || "",
    }));
  }

  function garantirListasEdicao(base = {}) {
    return {
      ...base,
      contatos:
        base.contatos?.length > 0
          ? base.contatos
          : [{ name: "Principal", number: base.telefone || "" }],

      enderecos:
        base.enderecos?.length > 0
          ? base.enderecos
          : [
            {
              type: base.tipo || "Casa",
              cep: base.cep || "",
              address: base.endereco || "",
              number: base.numero || "",
              neighborhood: base.bairro || "",
              complement: base.complemento || "",
              locaticion: base.localizacao || "",
            },
          ],
    };
  }

  function adicionarContato() {
    setFormEditar((prev) => ({
      ...prev,
      contatos: [
        ...(prev.contatos || []),
        {
          name: "",
          number: "",
        },
      ],
    }));
  }

  function removerContato(index) {
    setFormEditar((prev) => ({
      ...prev,
      contatos: prev.contatos.filter((_, i) => i !== index),
    }));
  }

  function alterarContato(index, campo, valor) {
    setFormEditar((prev) => ({
      ...prev,
      contatos: prev.contatos.map((contato, i) =>
        i === index ? { ...contato, [campo]: valor } : contato
      ),
    }));
  }

  function adicionarEndereco() {
    setFormEditar((prev) => ({
      ...prev,
      enderecos: [
        ...(prev.enderecos || []),
        {
          type: "",
          cep: "",
          address: "",
          number: "",
          neighborhood: "",
          complement: "",
          locaticion: "",
        },
      ],
    }));
  }

  function removerEndereco(index) {
    setFormEditar((prev) => ({
      ...prev,
      enderecos: prev.enderecos.filter((_, i) => i !== index),
    }));
  }

  function alterarEndereco(index, campo, valor) {
    setFormEditar((prev) => ({
      ...prev,
      enderecos: prev.enderecos.map((endereco, i) =>
        i === index ? { ...endereco, [campo]: valor } : endereco
      ),
    }));
  }

  function prepararNovoPet() {
    setCriandoNovoPet(true);
    setPetEmEdicaoId("");

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
  }

  async function salvarAlteracoes(e) {
    e.preventDefault();

    const cpf = localStorage.getItem("userCpf");

    try {
      if (abaEditar === "pessoal" || abaEditar === "endereco") {
        const contatosTratados = (formEditar.contatos || [])
          .filter((contato) => contato.name?.trim() || contato.number?.trim())
          .map((contato, index) => ({
            name: contato.name?.trim() || `Contato ${index + 1}`,
            number: contato.number?.replace(/\D/g, ""),
          }));

        const enderecosTratados = (formEditar.enderecos || [])
          .filter(
            (endereco) =>
              endereco.type?.trim() ||
              endereco.cep?.trim() ||
              endereco.address?.trim() ||
              endereco.number?.trim()
          )
          .map((endereco, index) => ({
            type: endereco.type?.trim() || `Endereço ${index + 1}`,
            cep: endereco.cep?.replace(/\D/g, ""),
            address: endereco.address || "",
            number: endereco.number || "",
            neighborhood: endereco.neighborhood || "",
            complement: endereco.complement || "",
            locaticion: endereco.locaticion || "",
          }));

        const body = {
          name: formEditar.nome,
          email: formEditar.email,
          contact: contatosTratados[0] || {
            name: formEditar.nome,
            number: formEditar.telefone,
          },
          address: enderecosTratados[0] || {
            type: formEditar.tipo,
            cep: formEditar.cep?.replace(/\D/g, ""),
            address: formEditar.endereco,
            number: formEditar.numero,
            neighborhood: formEditar.bairro,
            complement: formEditar.complemento || "",
            locaticion: formEditar.localizacao || "",
          },
          contacts: contatosTratados,
          addresses: enderecosTratados,
        };

        await userService.updateUser(cpf, body);

        const resUser = await userService.showUser(cpf);
        const userAtualizado = resUser.data;

        setDados({
          nome: userAtualizado.name,
          email: userAtualizado.email,
          telefone: userAtualizado.contacts?.[0]?.number || "",
          contatos: userAtualizado.contacts || [],
          endereco: userAtualizado.addresses?.[0]?.address || "",
          bairro: userAtualizado.addresses?.[0]?.neighborhood || "",
          cep: userAtualizado.addresses?.[0]?.cep || "",
          complemento: userAtualizado.addresses?.[0]?.complement || "",
          localizacao: userAtualizado.addresses?.[0]?.locaticion || "",
          tipo: userAtualizado.addresses?.[0]?.type || "",
          numero: userAtualizado.addresses?.[0]?.number || "",
          enderecos: userAtualizado.addresses || [],
          nomePet: dados?.nomePet || "",
          especiePet: dados?.especiePet || "",
          racaPet: dados?.racaPet || "",
          portePet: dados?.portePet || "",
          pesoPet: dados?.pesoPet || "",
          nascimentoPet: dados?.nascimentoPet || "",
          sexoPet: dados?.sexoPet || "",
        });

        setModalEditar(false);
        alert("Dados atualizados com sucesso!");
        return;
      }

      if (abaEditar === "pet") {
        if (!formEditar.nomePet?.trim()) {
          alert("Informe o nome do pet.");
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

        let petsAtualizados = [];

        if (criandoNovoPet || !petEmEdicaoId) {
          const response = await petService.criar(bodyPet);
          const petCriado = response?.data || response;

          petsAtualizados = [
            ...pets,
            {
              ...petCriado,
              ...bodyPet,
              id: petCriado?.id || Date.now(),
            },
          ];

          setPetSelecionadoId(petCriado?.id || petsAtualizados[petsAtualizados.length - 1].id);
          alert("Pet cadastrado com sucesso!");
        } else {
          await petService.atualizar(petEmEdicaoId, bodyPet);

          petsAtualizados = pets.map((pet) =>
            String(pet.id) === String(petEmEdicaoId)
              ? {
                ...pet,
                ...bodyPet,
              }
              : pet
          );

          alert("Pet atualizado com sucesso!");
        }

        setPets(petsAtualizados);

        const petDestaque = petsAtualizados.find(
          (pet) => String(pet.id) === String(petSelecionadoId)
        );

        if (petDestaque) {
          preencherDadosPetNaTela(petDestaque);
        }

        setModalEditar(false);
      }
    } catch (err) {
      console.error("Erro ao atualizar:", err);
      alert(err.response?.data?.error || "Erro ao atualizar dados.");
    }
  }

  async function handleSavePassword() {
    if (newPassword !== confirmPassword) {
      alert("As senhas não são iguais");
      return;
    }

    try {
      const cpf = localStorage.getItem("userCpf");

      await userService.updateUser(cpf, {
        password: newPassword,
      });

      alert("Senha alterada com sucesso!");

      setNewPassword("");
      setConfirmPassword("");
      setShowOld(false);
      setShowNew(false);
      setShowConfirm(false);

      setOpenModalSenha(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Erro ao alterar senha.");
    }
  }

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

  if (!dados) {
    return (
      <LoadingScreen
        title="Carregando sua conta"
        subtitle="Estamos buscando seus dados e informações dos seus pets."
      />
    );
  }

  return (
    <>
      {isAdmin && <AdminSidebar />}

      <div
        className={`minha-conta-page ${isAdmin ? "minha-conta-page-admin" : ""
          }`}
      >
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
              <p>
                {agendamentos.filter(
                  (agendamento) =>
                    !statusEstaEncerrado(
                      agendamento.statusOriginal
                    )
                ).length}{" "}
                agendamento(s) futuro(s)
              </p>
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
                    Tipo: {dados.tipo} <br />
                    {dados.endereco}, Nº {dados.numero} <br />

                    {dados.complemento && (
                      <>Complemento: {dados.complemento} <br /></>
                    )}

                    Bairro: {dados.bairro} <br />
                    CEP: {dados.cep} <br />

                    {dados.localizacao && (
                      <>Localização: {dados.localizacao}</>
                    )}
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
                {carregandoAgendamentos ? (
                  <p className="helper-text">Carregando agendamentos...</p>
                ) : agendamentos.length === 0 ? (
                  <p className="helper-text">Nenhum agendamento encontrado.</p>
                ) : (
                  agendamentos.slice(0, 3).map((item) => (
                    <div
                      className={`agendamento-card status-${item.statusClasse}`}
                      key={item.id}
                    >
                      <div className="agendamento-conteudo">
                        <h4>
                          <span className="agendamento-pet">
                            {item.petNome}
                          </span>

                          <span className="agendamento-separador">
                            •
                          </span>

                          <span>{item.servico}</span>
                        </h4>

                        <p className="agendamento-data">
                          <Calendar size={14} aria-hidden="true" />

                          {item.data} às {item.horario}
                        </p>
                      </div>

                      <span
                        className={`agendamento-badge ${item.statusClasse}`}
                      >
                        {item.status}
                      </span>
                    </div>
                  ))
                )}
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
                {carregandoAgendamentos ? (
                  <p className="helper-text">Carregando...</p>
                ) : agendamentos.length === 0 ? (
                  <p className="helper-text">Nenhum agendamento encontrado.</p>
                ) : (
                  agendamentos.map((item) => (
                    <div
                      className={`agend-item status-${item.statusClasse}`}
                      key={item.id}
                    >
                      <div className="agend-item-conteudo">
                        <span className="agend-title">
                          <strong>{item.petNome}</strong>

                          <span className="agendamento-separador">
                            •
                          </span>

                          {item.servico}
                        </span>

                        <p className="agend-info">
                          <Calendar size={14} aria-hidden="true" />

                          {item.data} às {item.horario}
                        </p>
                      </div>

                      <span
                        className={`agend-status ${item.statusClasse}`}
                      >
                        {item.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ... restante dos modais (editar, notificações, senha) mantidos ... */}
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
                    <label className="campo-full">
                      Nome
                      <input
                        name="nome"
                        type="text"
                        value={formEditar.nome || ""}
                        onChange={atualizarCampo}
                      />
                    </label>

                    <label className="campo-full">
                      E-mail
                      <input
                        name="email"
                        type="email"
                        value={formEditar.email || ""}
                        onChange={atualizarCampo}
                      />
                    </label>

                    <div className="editor-lista campo-full">
                      <div className="editor-lista-topo">
                        <div>
                          <h3>Contatos</h3>
                          <p>Adicione telefones com um nome para identificar cada um.</p>
                        </div>

                        <button type="button" className="btn-add-mini" onClick={adicionarContato}>
                          <Plus size={16} />
                          Adicionar contato
                        </button>
                      </div>

                      {(formEditar.contatos || []).map((contato, index) => (
                        <div className="editor-item" key={index}>
                          <label>
                            Nome do contato
                            <input
                              type="text"
                              placeholder="Ex: Principal, WhatsApp, Trabalho"
                              value={contato.name || ""}
                              onChange={(e) => alterarContato(index, "name", e.target.value)}
                            />
                          </label>

                          <label>
                            Telefone
                            <input
                              type="text"
                              placeholder="Digite o telefone"
                              value={contato.number || ""}
                              onChange={(e) => alterarContato(index, "number", e.target.value)}
                            />
                          </label>

                          {(formEditar.contatos || []).length > 1 && (
                            <button
                              type="button"
                              className="btn-remover-mini"
                              onClick={() => removerContato(index)}
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {abaEditar === "endereco" && (
                  <div className="editor-lista campo-full">
                    <div className="editor-lista-topo">
                      <div>
                        <h3>Endereços</h3>
                        <p>Cadastre mais de um endereço e dê um nome para cada um.</p>
                      </div>

                      <button type="button" className="btn-add-mini" onClick={adicionarEndereco}>
                        <Plus size={16} />
                        Adicionar endereço
                      </button>
                    </div>

                    {(formEditar.enderecos || []).map((endereco, index) => (
                      <div className="editor-item endereco-item" key={index}>
                        <label>
                          Nome do endereço
                          <input
                            type="text"
                            placeholder="Ex: Casa, Trabalho, Apartamento"
                            value={endereco.type || ""}
                            onChange={(e) => alterarEndereco(index, "type", e.target.value)}
                          />
                        </label>

                        <label>
                          CEP
                          <input
                            type="text"
                            value={endereco.cep || ""}
                            onChange={(e) => alterarEndereco(index, "cep", e.target.value)}
                          />
                        </label>

                        <label className="campo-full">
                          Endereço
                          <input
                            type="text"
                            value={endereco.address || ""}
                            onChange={(e) => alterarEndereco(index, "address", e.target.value)}
                          />
                        </label>

                        <label>
                          Número
                          <input
                            type="text"
                            value={endereco.number || ""}
                            onChange={(e) => alterarEndereco(index, "number", e.target.value)}
                          />
                        </label>

                        <label>
                          Bairro
                          <input
                            type="text"
                            value={endereco.neighborhood || ""}
                            onChange={(e) =>
                              alterarEndereco(index, "neighborhood", e.target.value)
                            }
                          />
                        </label>

                        <label>
                          Complemento
                          <input
                            type="text"
                            value={endereco.complement || ""}
                            onChange={(e) =>
                              alterarEndereco(index, "complement", e.target.value)
                            }
                          />
                        </label>

                        <label>
                          Localização
                          <input
                            type="text"
                            placeholder="Ex: Próximo ao metrô"
                            value={endereco.locaticion || ""}
                            onChange={(e) =>
                              alterarEndereco(index, "locaticion", e.target.value)
                            }
                          />
                        </label>

                        {(formEditar.enderecos || []).length > 1 && (
                          <button
                            type="button"
                            className="btn-remover-mini"
                            onClick={() => removerEndereco(index)}
                          >
                            <Trash2 size={16} />
                            Remover endereço
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {abaEditar === "pet" && (
                  <>
                    <div className="editor-lista-topo campo-full">
                      <div>
                        <h3>{criandoNovoPet ? "Novo pet" : "Editar pet"}</h3>
                        <p>
                          Escolha um pet existente para editar ou cadastre um novo companheiro.
                        </p>
                      </div>

                      <button type="button" className="btn-add-mini" onClick={prepararNovoPet}>
                        <Plus size={16} />
                        Novo pet
                      </button>
                    </div>

                    <label className="campo-full">
                      Pet cadastrado
                      <select
                        name="petId"
                        value={criandoNovoPet ? "" : petEmEdicaoId || ""}
                        onChange={trocarPetSelecionado}
                        disabled={criandoNovoPet}
                      >
                        <option value="">
                          {criandoNovoPet ? "Cadastrando novo pet" : "Selecione um pet"}
                        </option>
                        {pets.map((pet) => (
                          <option key={pet.id} value={pet.id}>
                            {pet.name}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label>
                      Nome do pet/apelido
                      <input
                        name="nomePet"
                        type="text"
                        value={formEditar.nomePet || ""}
                        onChange={atualizarCampo}
                      />
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
                {notificacoes.length === 0 ? (
                  <p className="helper-text">Nenhuma notificação por enquanto.</p>
                ) : (
                  notificacoes.map((notificacao) => (
                    <div
                      className={`notif-item ${notificacao.lida ? "lida" : ""}`}
                      key={notificacao.id}
                    >
                      <span className="notif-titulo">{notificacao.titulo}</span>

                      <p className="notif-desc">{notificacao.descricao}</p>

                      {!notificacao.lida && (
                        <button
                          type="button"
                          className="btn-marcar-lida"
                          onClick={() => {
                            marcarNotificacaoComoLida(notificacao.id);
                            setNotificacoes(listarNotificacoes());
                          }}
                        >
                          Marcar como lida
                        </button>
                      )}
                    </div>
                  ))
                )}
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
    </>
  );
}