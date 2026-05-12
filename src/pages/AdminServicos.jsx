import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import "../styles/adminServicos.css";

import banhoIcon from "../assets/icons/banho.png";
import terapeuticoIcon from "../assets/icons/terapeutico.png";
import tosahigIcon from "../assets/icons/tosahig.png";
import tosamaqIcon from "../assets/icons/tosamaq.png";
import tosaracaIcon from "../assets/icons/tosaraca.png";
import unhaIcon from "../assets/icons/unha.png";
import ouvidoIcon from "../assets/icons/ouvidos.png";
import dentalIcon from "../assets/icons/dental.png";
import cronogramaIcon from "../assets/icons/cronograma.png";
import hidratacaoIcon from "../assets/icons/hidratacao.png";
import peleIcon from "../assets/icons/pele.png";
import porosidadeIcon from "../assets/icons/porosidade.png";

const iconesDisponiveis = [
  { nome: "Banho", valor: "banho", icon: banhoIcon },
  { nome: "Terapêutico", valor: "terapeutico", icon: terapeuticoIcon },
  { nome: "Tosa Higiênica", valor: "tosahig", icon: tosahigIcon },
  { nome: "Tosa Máquina", valor: "tosamaq", icon: tosamaqIcon },
  { nome: "Tosa da Raça", valor: "tosaraca", icon: tosaracaIcon },
  { nome: "Unha", valor: "unha", icon: unhaIcon },
  { nome: "Ouvidos", valor: "ouvido", icon: ouvidoIcon },
  { nome: "Dental", valor: "dental", icon: dentalIcon },
  { nome: "Cronograma", valor: "cronograma", icon: cronogramaIcon },
  { nome: "Hidratação", valor: "hidratacao", icon: hidratacaoIcon },
  { nome: "Pele", valor: "pele", icon: peleIcon },
  { nome: "Porosidade", valor: "porosidade", icon: porosidadeIcon },
];

const servicosPadrao = [
  {
    id: 1,
    title: "Banho",
    desc: "Limpeza completa com produtos de qualidade para deixar o seu pet cheiroso e feliz.",
    iconKey: "banho",
    ativo: true,
  },
  {
    id: 2,
    title: "Banho Terapêutico",
    desc: "Banho medicinal para problemas de pele, alívio e cuidado com produtos suaves e especiais.",
    iconKey: "terapeutico",
    ativo: true,
  },
  {
    id: 3,
    title: "Tosa Higiênica",
    desc: "Cuidados essenciais para garantir conforto, corte nas áreas íntimas para higiene diária.",
    iconKey: "tosahig",
    ativo: true,
  },
  {
    id: 4,
    title: "Tosa (Máq. ou Tesoura)",
    desc: "Tosa completa com máquina ou tesoura, corte personalizado conforme a preferência do tutor.",
    iconKey: "tosamaq",
    ativo: true,
  },
  {
    id: 5,
    title: "Tosa da raça",
    desc: "Tosa específica seguindo o padrão da raça, valorizando as características de cada pet.",
    iconKey: "tosaraca",
    ativo: true,
  },
  {
    id: 6,
    title: "Corte de unhas",
    desc: "Corte seguro e preciso para manter as patinhas do seu pet sempre bem cuidadas.",
    iconKey: "unha",
    ativo: true,
  },
  {
    id: 7,
    title: "Higiene dos Ouvidos",
    desc: "Limpeza delicada e completa dos ouvidos, evitando desconfortos e infecções.",
    iconKey: "ouvido",
    ativo: true,
  },
  {
    id: 8,
    title: "Escovação Dental",
    desc: "Limpeza completa dos dentes, garantindo saúde bucal, prevenção de tártaro e hálito sempre fresco.",
    iconKey: "dental",
    ativo: true,
  },
  {
    id: 9,
    title: "Cronograma Capilar",
    desc: "Tratamento completo para os pelos, fortalecendo e revitalizando a pelagem.",
    iconKey: "cronograma",
    ativo: true,
  },
  {
    id: 10,
    title: "Hidratação de Pelagem",
    desc: "Tratamento nutritivo que hidrata profundamente os pelos, devolvendo brilho, maciez e proteção.",
    iconKey: "hidratacao",
    ativo: true,
  },
  {
    id: 11,
    title: "Hidratação de Pele",
    desc: "Cuidado especial para peles sensíveis, ajudando a mantê-las saudáveis e protegidas.",
    iconKey: "pele",
    ativo: true,
  },
  {
    id: 12,
    title: "Teste de Porosidade",
    desc: "Análise da saúde dos pelos para definir o tratamento ideal para o seu pet.",
    iconKey: "porosidade",
    ativo: true,
  },
];

const AdminServicos = () => {
  const [servicos, setServicos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    desc: "",
    iconKey: "banho",
  });

  useEffect(() => {
    const servicosSalvos = JSON.parse(localStorage.getItem("petnetServicos"));

    if (servicosSalvos && servicosSalvos.length > 0) {
      setServicos(servicosSalvos);
    } else {
      setServicos(servicosPadrao);
      localStorage.setItem("petnetServicos", JSON.stringify(servicosPadrao));
    }
  }, []);

  useEffect(() => {
    if (servicos.length > 0) {
      localStorage.setItem("petnetServicos", JSON.stringify(servicos));
    }
  }, [servicos]);

  const limparFormulario = () => {
    setForm({
      title: "",
      desc: "",
      iconKey: "banho",
    });
    setEditandoId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSalvarServico = (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.desc.trim()) {
      alert("Preencha o nome e a descrição do serviço.");
      return;
    }

    if (editandoId) {
      const servicosAtualizados = servicos.map((servico) =>
        servico.id === editandoId
          ? {
              ...servico,
              title: form.title,
              desc: form.desc,
              iconKey: form.iconKey,
            }
          : servico
      );

      setServicos(servicosAtualizados);
      limparFormulario();
      return;
    }

    const novoServico = {
      id: Date.now(),
      title: form.title,
      desc: form.desc,
      iconKey: form.iconKey,
      ativo: true,
    };

    setServicos([novoServico, ...servicos]);
    limparFormulario();
  };

  const handleEditar = (servico) => {
    setEditandoId(servico.id);
    setForm({
      title: servico.title,
      desc: servico.desc,
      iconKey: servico.iconKey,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleAlternarStatus = (id) => {
    const servicosAtualizados = servicos.map((servico) =>
      servico.id === id
        ? {
            ...servico,
            ativo: !servico.ativo,
          }
        : servico
    );

    setServicos(servicosAtualizados);
  };

  const handleExcluir = (id) => {
    const confirmar = window.confirm("Deseja excluir este serviço definitivamente?");

    if (confirmar) {
      const servicosAtualizados = servicos.filter((servico) => servico.id !== id);
      setServicos(servicosAtualizados);
    }
  };

  const buscarIcone = (iconKey) => {
    return iconesDisponiveis.find((icone) => icone.valor === iconKey)?.icon || banhoIcon;
  };

  const totalAtivos = servicos.filter((servico) => servico.ativo).length;
  const totalInativos = servicos.filter((servico) => !servico.ativo).length;

  return (
    <>
      <Header />

      <section className="admin-servicos-section">
        <div className="admin-servicos-container">
          <div className="admin-servicos-header">
            <div>
              <span className="admin-servicos-tag">Painel administrativo</span>
              <h2>Gerenciar Serviços</h2>
              <p>
                Cadastre, edite, ative ou desative os serviços exibidos na página pública do PETNET.
              </p>
            </div>

            <div className="admin-servicos-resumo">
              <div>
                <strong>{servicos.length}</strong>
                <span>Total</span>
              </div>
              <div>
                <strong>{totalAtivos}</strong>
                <span>Ativos</span>
              </div>
              <div>
                <strong>{totalInativos}</strong>
                <span>Inativos</span>
              </div>
            </div>
          </div>

          <div className="admin-servicos-content">
            <form className="admin-servicos-form" onSubmit={handleSalvarServico}>
              <h3>{editandoId ? "Editar serviço" : "Novo serviço"}</h3>

              <label>
                Nome do serviço
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Ex: Banho Premium"
                />
              </label>

              <label>
                Descrição
                <textarea
                  name="desc"
                  value={form.desc}
                  onChange={handleChange}
                  placeholder="Descreva brevemente o serviço oferecido..."
                />
              </label>

              <label>
                Ícone do serviço
                <select name="iconKey" value={form.iconKey} onChange={handleChange}>
                  {iconesDisponiveis.map((icone) => (
                    <option key={icone.valor} value={icone.valor}>
                      {icone.nome}
                    </option>
                  ))}
                </select>
              </label>

              <div className="admin-servicos-preview">
                <div className="admin-servicos-icon-circle">
                  <img src={buscarIcone(form.iconKey)} alt="Prévia do ícone" />
                </div>

                <div>
                  <strong>{form.title || "Nome do serviço"}</strong>
                  <p>{form.desc || "A descrição aparecerá aqui como prévia."}</p>
                </div>
              </div>

              <div className="admin-servicos-form-actions">
                <button type="submit" className="btn-salvar-servico">
                  {editandoId ? "SALVAR ALTERAÇÕES" : "CRIAR SERVIÇO"}
                </button>

                {editandoId && (
                  <button
                    type="button"
                    className="btn-cancelar-edicao"
                    onClick={limparFormulario}
                  >
                    CANCELAR
                  </button>
                )}
              </div>
            </form>

            <div className="admin-servicos-lista">
              <div className="admin-servicos-lista-topo">
                <h3>Serviços cadastrados</h3>
                <span>{servicos.length} registros</span>
              </div>

              <div className="admin-servicos-cards">
                {servicos.map((servico) => (
                  <div
                    key={servico.id}
                    className={`admin-servico-card ${!servico.ativo ? "inativo" : ""}`}
                  >
                    <div className="admin-servico-info">
                      <div className="admin-servicos-icon-circle small">
                        <img src={buscarIcone(servico.iconKey)} alt={servico.title} />
                      </div>

                      <div>
                        <div className="admin-servico-title-line">
                          <h4>{servico.title}</h4>
                          <span className={servico.ativo ? "status ativo" : "status inativo"}>
                            {servico.ativo ? "Ativo" : "Inativo"}
                          </span>
                        </div>

                        <p>{servico.desc}</p>
                      </div>
                    </div>

                    <div className="admin-servico-actions">
                      <button
                        type="button"
                        className="btn-editar"
                        onClick={() => handleEditar(servico)}
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        className={servico.ativo ? "btn-desativar" : "btn-ativar"}
                        onClick={() => handleAlternarStatus(servico.id)}
                      >
                        {servico.ativo ? "Desativar" : "Ativar"}
                      </button>

                      <button
                        type="button"
                        className="btn-excluir"
                        onClick={() => handleExcluir(servico.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminServicos;