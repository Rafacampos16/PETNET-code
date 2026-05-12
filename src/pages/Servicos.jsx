import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import "../styles/servicos.css";

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

const iconesServicos = {
  banho: banhoIcon,
  terapeutico: terapeuticoIcon,
  tosahig: tosahigIcon,
  tosamaq: tosamaqIcon,
  tosaraca: tosaracaIcon,
  unha: unhaIcon,
  ouvido: ouvidoIcon,
  dental: dentalIcon,
  cronograma: cronogramaIcon,
  hidratacao: hidratacaoIcon,
  pele: peleIcon,
  porosidade: porosidadeIcon,
};

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

const Servicos = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const servicosSalvos = JSON.parse(localStorage.getItem("petnetServicos"));

    if (servicosSalvos && servicosSalvos.length > 0) {
      setServices(servicosSalvos.filter((servico) => servico.ativo));
    } else {
      localStorage.setItem("petnetServicos", JSON.stringify(servicosPadrao));
      setServices(servicosPadrao.filter((servico) => servico.ativo));
    }
  }, []);

  const handleAgendar = (servico) => {
    const phone = "5512992136141";
    const message = `Olá! Gostaria de agendar o serviço de ${servico}. Pode me informar os horários disponíveis?`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const buscarIcone = (iconKey) => {
    return iconesServicos[iconKey] || banhoIcon;
  };

  return (
    <>
      <Header />

      <section className="servicos-section">
        <div className="container">
          <h2 className="servicos-title">NOSSOS SERVIÇOS</h2>
          <div className="servicos-divider"></div>

          <p className="servicos-subtitle">
            No PETNET, cada pet é tratado com amor, cuidado e muita dedicação!
            <br />
            Cuidados feitos com amor para deixar seu pet limpo, feliz e ainda mais encantador.
            Descubra nossos serviços e agende o carinho que ele merece!
          </p>

          <div className="servicos-grid">
            {services.map((service) => (
              <div key={service.id} className="servico-card">
                <div className="servico-icon-circle">
                  <img
                    src={buscarIcone(service.iconKey)}
                    alt={service.title}
                    className="servico-icon"
                  />
                </div>

                <h3>{service.title}</h3>
                <p>{service.desc}</p>

                <button
                  className="btn-agendar"
                  onClick={() => handleAgendar(service.title)}
                >
                  AGENDAR
                </button>
              </div>
            ))}
          </div>

          {services.length === 0 && (
            <p className="servicos-vazio">
              Nenhum serviço ativo no momento.
            </p>
          )}
        </div>
      </section>
    </>
  );
};

export default Servicos;