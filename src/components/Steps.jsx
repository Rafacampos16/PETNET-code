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
    <div
      className="step-card"
      style={{
        backgroundColor: "#EFF6FF",
        padding: "1.5rem",
        borderRadius: "0.75rem",
        boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
        position: "relative",
        textAlign: "center",
        width: "230px",
      }}
    >
      <div
        className="step-number-circle"
        style={{
          width: "3rem",
          height: "3rem",
          borderRadius: "50%",
          backgroundColor: "#3370EB",
          color: "#fff",
          fontSize: "1.5rem",
          fontWeight: "700",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "0 auto 1rem auto",
        }}
      >
        {number}
      </div>
      <h3
        className="step-title"
        style={{
          fontSize: "1.125rem",
          fontWeight: "600",
          marginBottom: "0.5rem",
          color: "#000000",
        }}
      >
        {title}
      </h3>
      <p style={{ color: "rgba(0, 0, 0, 0.8)", fontSize: "0.875rem", lineHeight: "1.4" }}>{description}</p>
    </div>
  );

  return (
    <section id="steps" style={{ position: "relative", marginTop: "3rem" }}>
      <div className="container">
        <p style={{ textAlign: "center", fontSize: "2rem", fontWeight: "900", color: "#3E75DF" }}>Como Funciona</p>
        <div
          style={{
            width: "100px",
            height: "4px",
            backgroundColor: "#F9EE7C",
            margin: "0.5rem auto 1.5rem auto",
            borderRadius: "2px",
          }}
        ></div>
        <h3
          style={{
            color: "#000",
            textAlign: "center",
            fontWeight: "400",
            marginBottom: "2rem",
            maxWidth: "600px",
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: "1.4",
          }}
        >
          Conheça o passo a passo do nosso atendimento para garantir a melhor experiência para você e seu pet.
        </h3>
        <div
          style={{
            position: "relative",
            padding: "2rem 0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "140px",
              left: "10%",
              right: "10%",
              height: "3px",
              backgroundColor: "#3370EB",
              zIndex: 1,
            }}
          ></div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              gap: "2rem",
              flexWrap: "wrap",
              position: "relative",
              zIndex: 2,
            }}
          >
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
