import React, { useState, useEffect } from "react";
import serviceService from "../services/serviceService";
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
import focinhoIcon from "../assets/icons/pet-cliente.png";

import defaultIcon from "../assets/icons/banho.png";

const Servicos = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const iconeMap = {
    Banho: banhoIcon,
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
    Hidratação: hidratacaoIcon,
    "Hidratação de Pelagem": hidratacaoIcon,
    "Hidratação de Pele": peleIcon,
    "Teste de Porosidade": porosidadeIcon,
    Ozonioterapia: terapeuticoIcon,
  };

  useEffect(() => {
    async function carregarServicos() {
      try {
        setLoading(true);
        setErro("");

        const data = await serviceService.listar();

        const listaServicos = Array.isArray(data) ? data : [];

        setServices(listaServicos);
      } catch (err) {
        console.error("Erro ao carregar serviços:", err);
        setErro("Não foi possível carregar os serviços no momento.");
      } finally {
        setLoading(false);
      }
    }

    carregarServicos();
  }, []);

  const handleAgendar = (servico) => {
    const phone = "5512992136141";
    const message = `Olá! Gostaria de agendar o serviço de ${servico}. Pode me informar os horários disponíveis?`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <section className="servicos-section">
      <div className="container">
        <h2 className="servicos-title">NOSSOS SERVIÇOS</h2>
        <div className="servicos-divider"></div>

        <p className="servicos-subtitle">
          No PETNET, cada pet é tratado com amor, cuidado e muita dedicação!
          <br />
          Cuidados feitos com amor para deixar seu pet limpo, feliz e ainda mais
          encantador. Descubra nossos serviços e agende o carinho que ele merece!
        </p>

        {loading && (
          <div className="servicos-message-card">
            <div className="servicos-message-icon">🐾</div>
            <h3>Carregando serviços...</h3>
            <p>Aguarde um instante enquanto buscamos os serviços disponíveis.</p>
          </div>
        )}

        {!loading && erro && (
          <div className="servicos-message-card erro">
            <div className="servicos-message-icon">!</div>
            <h3>Ops, algo deu errado</h3>
            <p>{erro}</p>
          </div>
        )}

        {!loading && !erro && services.length === 0 && (
          <div className="servicos-empty-card">
            <div className="servicos-empty-icon">
              <img src={focinhoIcon} alt="Ícone de focinho" />
            </div>

            <h3>Nenhum serviço disponível no momento</h3>

            <p>
              Nossa lista de serviços está sendo atualizada. Em breve novas opções de
              cuidado para o seu pet estarão disponíveis por aqui.
            </p>

            <button
              type="button"
              className="servicos-empty-btn"
              onClick={() => window.location.reload()}
            >
              Atualizar página
            </button>
          </div>
        )}

        {!loading && !erro && services.length > 0 && (
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

                <p>
                  {service.description ||
                    "Serviço disponível para cuidado e bem-estar do seu pet."}
                </p>

                <button
                  className="btn-agendar"
                  onClick={() => handleAgendar(service.name)}
                >
                  AGENDAR
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Servicos;