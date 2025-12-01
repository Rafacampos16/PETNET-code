import React from "react";
import "../styles/promotions.css";
import { ShoppingCart } from "lucide-react";

const Promotions = () => {

  const handleAproveitar = (promo, price) => {
    const phone = "5512992136141"; // coloque seu número aqui DDI + DDD
    const message = `Olá! Quero aproveitar a promoção ${promo} com o valor de R$${price}. Pode me passar mais informações?`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const PromoCard = ({ title, subtitle, details, oldPrice, newPrice }) => (
    <div className="promo-card">
      <div className="promo-content">
        <h3 className="promo-title">{title}</h3>
        <p className="promo-subtitle">{subtitle}</p>
        <p className="promo-details">{details}</p>

        <div>
          {oldPrice && <p className="promo-old-price">R$ {oldPrice}</p>}
          <p className="promo-new-price">R$ {newPrice}</p>
        </div>
      </div>

      <button
        className="promo-button"
        onClick={() => handleAproveitar(subtitle, newPrice)}
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
