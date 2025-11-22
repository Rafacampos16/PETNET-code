import React from "react";
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

const Servicos = () => {
  const services = [
    { title: "Banho", desc: "Limpeza completa com produtos de qualidade para deixar o seu pet cheiroso e feliz.", icon: banhoIcon },
    { title: "Banho Terapêutico", desc: "Banho medicinal para problemas de pele, alívio e cuidado com produtos suaves e especiais.", icon: terapeuticoIcon},
    { title: "Tosa Higiênica", desc: "Cuidados essenciais para garantir conforto, corte nas áreas íntimas para higiene diária.", icon: tosahigIcon },
    { title: "Tosa (Máq. ou Tesoura)", desc: "Tosa completa com máquina ou tesoura, corte personalizado conforme a preferência do tutor.", icon: tosamaqIcon },
    { title: "Tosa da raça", desc: "Tosa específica seguindo o padrão da raça, valorizando as características de cada pet." , icon: tosaracaIcon},
    { title: "Corte de unhas", desc: "Corte seguro e preciso para manter as patinhas do seu pet sempre bem cuidadas." , icon: unhaIcon},
    { title: "Higiene dos Ouvidos", desc: "Limpeza delicada e completa dos ouvidos, evitando desconfortos e infecções." , icon: ouvidoIcon},
    { title: "Escovação Dental", desc: "Limpeza completa dos dentes, garantindo saúde bucal, prevenção de tártaro e hálito sempre fresco.", icon: dentalIcon },
    { title: "Cronograma Capilar", desc: "Tratamento completo para os pelos, fortalecendo e revitalizando a pelagem.", icon: cronogramaIcon },
    { title: "Hidratação de Pelagem", desc: "Tratamento nutritivo que hidrata profundamente os pelos, devolvendo brilho, maciez e proteção.", icon: hidratacaoIcon },
    { title: "Hidratação de Pele", desc: "Cuidado especial para peles sensíveis, ajudando a mantê-las saudáveis e protegidas.", icon: peleIcon },
    { title: "Teste de Porosidade", desc: "Análise da saúde dos pelos para definir o tratamento ideal para o seu pet.", icon: porosidadeIcon },
  ];

  return (
    <>
      <Header />

      <section className="servicos-section">
        <div className="container">
          <h2 className="servicos-title">NOSSOS SERVIÇOS</h2>
          <p className="servicos-subtitle">
            No PETNET, cada pet é tratado com amor, cuidado e muita dedicação!
            <br />
            Cuidados feitos com amor para deixar seu pet limpo, feliz e ainda mais encantador. 
            Descubra nossos serviços e agende o carinho que ele merece!
          </p>

          <div className="servicos-grid">
            {services.map((service, index) => (
              <div key={index} className="servico-card">
               <div className="servico-icon-circle">
                  <img src={service.icon} alt={service.title} className="servico-icon" />
                </div>
                <div className="service-icon-placeholder"></div>

                <h3>{service.title}</h3>
                <p>{service.desc}</p>
                <button className="btn-agendar">AGENDAR</button>
              </div>
            ))}
          </div>
        </div>
      </section>

 
    </>
  );
};

export default Servicos;
