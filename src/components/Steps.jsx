import React from "react";
import "../styles/steps.css";

const Steps = () => {
  const stepsData = [
    { number: 1, title: "Agendamento", description: "Agende o servico desejado pelo site ou WhatsApp." },
    { number: 2, title: "Recepcao", description: "Traga seu pet no horario marcado e faremos o check-in." },
    { number: 3, title: "Atendimento", description: "Realizamos o servico com todo cuidado, carinho e atencao." },
    { number: 4, title: "Entrega", description: "Seu pet volta para casa limpo, feliz e bem cuidado." },
  ];

  return (
    <section id="steps" className="steps-section">
      <div className="container">
        <div className="steps-heading">
          <h2 className="steps-main-title">Como Funciona</h2>
          <div className="steps-divider"></div>
          <p className="steps-subtitle">
            Um processo simples, acolhedor e organizado para garantir a melhor experiencia para voce e seu pet.
          </p>
        </div>

        <div className="steps-list">
          {stepsData.map((step) => (
            <div key={step.number} className="step-card">
              <div className="step-number-circle">{step.number}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Steps;