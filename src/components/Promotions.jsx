import React from "react";
import "../styles/promotions.css";
import { ShoppingCart, Tag, Sparkles } from "lucide-react";

const Promotions = () => {
  const handleAproveitar = (promo) => {
    const phone = "5512996539100";

    const message = `Olá! Quero aproveitar a promoção "${promo}". Pode me passar mais informações?`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const promoItems = [
    {
      badge: "OFERTA ESPECIAL",
      title: "Pacote Mensal",
      details:
        "4 banhos por mês com desconto especial para manter seu pet sempre limpinho.",
      highlight: "Mais economia no cuidado recorrente"
    },
    {
      badge: "COMBO",
      title: "Banho + Tosa",
      details:
        "Banho completo com tosa higiênica em uma combinação prática e vantajosa.",
      highlight: "Um dos serviços mais procurados"
    },
    {
      badge: "NOVOS CLIENTES",
      title: "Primeira Consulta",
      details:
        "Consulta veterinária com desconto especial para o primeiro atendimento.",
      highlight: "Recepção acolhedora para novos pets"
    }
  ];

  return (
    <section id="promotions" className="promotions-section">
      <div className="container">
        <div className="promotions-heading">
          <h2 className="promotions-title">
            Promoções Especiais
          </h2>

          <div className="promotions-divider"></div>

          <p className="promotions-subtitle">
            Aproveite ofertas exclusivas e economize nos cuidados com seu pet
            sem abrir mão de qualidade, carinho e segurança.
          </p>
        </div>

        <div className="promotions-grid">
          {promoItems.map((promo, index) => (
            <article key={index} className="promo-card">
              <div className="promo-badge">
                <Tag size={16} />
                <span>{promo.badge}</span>
              </div>

              <div className="promo-content">
                <h3 className="promo-title">
                  {promo.title}
                </h3>

                <p className="promo-details">
                  {promo.details}
                </p>

                <div className="promo-highlight">
                  <Sparkles size={16} />
                  <span>{promo.highlight}</span>
                </div>
              </div>

              <button
                type="button"
                className="promo-button"
                onClick={() => handleAproveitar(promo.title)}
              >
                <ShoppingCart size={18} />
                <span>Aproveitar</span>
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Promotions;