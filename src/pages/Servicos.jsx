// adiciona import do service e do useState/useEffect
import React, { useState, useEffect } from "react";
import serviceService from "../services/serviceService";
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




// ucone padrão para serviços sem ícone mapeado
import defaultIcon from "../assets/icons/banho.png"; // ícone genérico

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

  
  const iconeMap = {
    "Banho": banhoIcon,
    "Banho Terapêutico": terapeuticoIcon,
    "Banho Medicamentoso": terapeuticoIcon,
    "Tosa Higiênica": tosahigIcon,
    "Banho e Tosa Higiênica": tosahigIcon,
    "Tosa (Máq. ou Tesoura)": tosamaqIcon,
    "Banho e Tosa na Máquina": tosamaqIcon,
    "Banho e Tosa na Tesoura": tosaracaIcon,
    "Tosa da raça": tosaracaIcon,
    "Corte de unhas": unhaIcon,
    "Corte de Unha": unhaIcon,
    "Higiene dos Ouvidos": ouvidoIcon,
    "Escovação Dental": dentalIcon,
    "Cronograma Capilar": cronogramaIcon,
    "Hidratação": hidratacaoIcon,
    "Hidratação de Pelagem": hidratacaoIcon,
    "Hidratação de Pele": peleIcon,
    "Teste de Porosidade": porosidadeIcon,
    "Ozonioterapia": terapeuticoIcon,
  };

  const [services, setServices] = useState([]);
  
  useEffect(() => {
    serviceService.listar()
      .then((data) => setServices(data))
      .catch((err) => console.error("Erro ao carregar serviços:", err));
  }, []);

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
                    src={iconeMap[service.name] || defaultIcon}
                    alt={service.name}
                    className="servico-icon"
                  />
                </div>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <button
                  className="btn-agendar"
                  onClick={() => handleAgendar(service.name)}
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
