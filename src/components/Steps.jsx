import React from "react";
import "../styles/steps.css";

const Steps = () => {
  const stepsData = [
    { number: 1, title: "Agendamento", description: "Agende o serviço desejado pelo site ou WhatsApp." },
    { number: 2, title: "Recepção", description: "Traga seu pet no horário marcado e faremos o check-in." },
    { number: 3, title: "Atendimento", description: "Realizamos o serviço com todo cuidado e atenção." },
    { number: 4, title: "Entrega", description: "Seu pet estará pronto para voltar para casa feliz e bem cuidado." },
  ];

  const StepCard = ({ number, title, description }) => (
    <div className="step-card">
      <div className="step-number-circle">{number}</div>
      <h3 className="step-title">{title}</h3>
      <p className="step-description">{description}</p>
    </div>
  );

  return (
    <section id="steps" className="steps-section">
      <div className="container">
        <p className="steps-main-title">Como Funciona</p>
        <div className="steps-divider"></div>
        <h3 className="steps-subtitle">
          Conheça o passo a passo do nosso atendimento para garantir a melhor experiência para você e seu pet.
        </h3>

        <div className="steps-wrapper">
          <div className="steps-line"></div>

          <div className="steps-list">
            {stepsData.map((step, index) => (
              <StepCard key={index} {...step} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Steps;
