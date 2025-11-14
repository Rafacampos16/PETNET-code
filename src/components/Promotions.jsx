import React from "react";
import "../styles/promotions.css";
import { ShoppingCart } from "lucide-react";

const Promotions = () => {
  const PromoCard = ({ title, subtitle, details, oldPrice, newPrice, isFeatured }) => (
    <div
      style={{
        backgroundColor: "#fff",
        padding: "1.5rem",
        borderRadius: "0.75rem",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        width: "320px",
        minHeight: "250px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
        e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.05)";
      }}
    >
      <div style={{ flexGrow: 1 }}>
        <h3
          style={{
            fontSize: "1.25rem",
            fontWeight: "700",
            marginBottom: "0.05rem",
            backgroundColor: "#3370EB",
            color: "white",
            padding: "1.0rem 0",
            borderRadius: "0.5rem",
          }}
        >
          {title}
        </h3>
        <p style={{ fontSize: "1rem", marginTop: "0.75rem", color: "#000000", fontWeight: "600" }}>
          {subtitle}
        </p>
        <p style={{ fontSize: "0.875rem", color: "rgba(0,0,0,0.7)", marginBottom: "1rem" }}>{details}</p>

        <div>
          {oldPrice && <p style={{ textDecoration: "line-through", color: "rgba(0,0,0,0.5)" }}>R$ {oldPrice}</p>}
          <p style={{ fontSize: "1.5rem", fontWeight: "800", color: "#3370EB" }}>R$ {newPrice}</p>
        </div>
      </div>

      <button
        style={{
          marginTop: "1rem",
          padding: "0.5rem",
          backgroundColor: "#F9EE7C",
          color: "#000",
          fontWeight: "600",
          borderRadius: "0.5rem",
          border: "none",
          cursor: "pointer",
          transition: "all 0.2s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
        }}
      >
        <ShoppingCart size={18} /> <span>Aproveitar</span>
      </button>
    </div>
  );

  return (
    <section id="promotions" style={{ backgroundColor: "#EFF6FF", padding: "4rem 0" }}>
      <div className="container" style={{ textAlign: "center" }}>
        <h2 style={{ color: "#3370EB", fontSize: "2rem", fontWeight: "700" }}>Promoções Especiais</h2>
        <div
          style={{
            width: "100px",
            height: "4px",
            backgroundColor: "#F9EE7C",
            margin: "0.5rem auto 2rem auto",
            borderRadius: "3px",
          }}
        ></div>
        <p
          style={{
            fontSize: "1rem",
            color: "rgba(0, 0, 0, 0.8)",
            marginBottom: "3rem",
            maxWidth: "600px",
            margin: "0 auto 3rem auto",
          }}
        >
          Aproveite nossas ofertas exclusivas e economize nos cuidados com seu pet.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >
          <PromoCard
            title="OFERTA ESPECIAL"
            subtitle="Pacote Mensal"
            details="4 banhos por mês com desconto especial."
            oldPrice="240,00"
            newPrice="199,90"
          />
          <PromoCard
            title="COMBO"
            subtitle="Banho + Tosa"
            details="Banho completo + tosa higiênica."
            oldPrice="90,00"
            newPrice="75,00"
          />
          <PromoCard
            title="NOVOS CLIENTES"
            subtitle="Primeira Consulta"
            details="Consulta veterinária com 20% de desconto."
            oldPrice="120,00"
            newPrice="96,00"
          />
        </div>
      </div>
    </section>
  );
};

export default Promotions;
