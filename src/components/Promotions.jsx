import React from "react";
import "../styles/promotions.css";
import { ShoppingCart, Tag, Sparkles } from "lucide-react";

const Promotions = () => {
  const handleAproveitar = (promo, price) => {
    const phone = "5512992136141";
    const message = `Ola! Quero aproveitar a promocao ${promo} com o valor de R$${price}. Pode me passar mais informacoes?`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const promoItems = [
    {
      badge: "OFERTA ESPECIAL",
      title: "Pacote Mensal",
      details: "4 banhos por mes com desconto especial para manter seu pet sempre limpinho.",
      oldPrice: "240,00",
      newPrice: "199,90",
      highlight: "Mais economia no cuidado recorrente"
    },
    {
      badge: "COMBO",
      title: "Banho + Tosa",
      details: "Banho completo com tosa higienica em uma combinacao pratica e vantajosa.",
      oldPrice: "90,00",
      newPrice: "75,00",
      highlight: "Um dos servicos mais procurados"
    },
    {
      badge: "NOVOS CLIENTES",
      title: "Primeira Consulta",
      details: "Consulta veterinaria com desconto especial para o primeiro atendimento.",
      oldPrice: "120,00",
      newPrice: "96,00",
      highlight: "Recepcao acolhedora para novos pets"
    }
  ];

  return (
    <section id="promotions" className="promotions-section">
      <div className="container">
        <div className="promotions-heading">
          <h2 className="promotions-title">Promoções Especiais</h2>
          <div className="promotions-divider"></div>
          <p className="promotions-subtitle">
            Aproveite ofertas exclusivas e economize nos cuidados com seu pet
            sem abrir mao de qualidade, carinho e seguranca.
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
                <h3 className="promo-title">{promo.title}</h3>
                <p className="promo-details">{promo.details}</p>

                <div className="promo-highlight">
                  <Sparkles size={16} />
                  <span>{promo.highlight}</span>
                </div>

                <div className="promo-price-box">
                  <p className="promo-old-price">R$ {promo.oldPrice}</p>
                  <p className="promo-new-price">R$ {promo.newPrice}</p>
                </div>
              </div>

              <button
                className="promo-button"
                onClick={() => handleAproveitar(promo.title, promo.newPrice)}
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