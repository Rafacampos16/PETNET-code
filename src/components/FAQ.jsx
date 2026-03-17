import React, { useState } from "react";
import "../styles/faq.css";
import { ChevronDown, MessageCircleMore } from "lucide-react";
import { FaPaw } from "react-icons/fa";

const faqItems = [
  {
    q: "Quanto tempo dura o banho e tosa?",
    a: "O tempo varia conforme o porte, a raca e a condicao da pelagem. Em media, o processo completo leva de 2 a 3 horas.",
  },
  {
    q: "Preciso agendar com antecedencia?",
    a: "Sim, principalmente em fins de semana e feriados, para garantir o melhor horario para voce e seu pet.",
  },
  {
    q: "Quais vacinas meu pet precisa ter?",
    a: "As vacinas essenciais dependem da avaliacao do veterinario, mas geralmente incluem V8 ou V10 para caes, triplice para gatos e antirrabica.",
  },
  {
    q: "Como funciona o banho medicamentoso?",
    a: "Ele e realizado com orientacao adequada e produtos especificos para tratamento da pele, respeitando o tempo de acao necessario.",
  },
  {
    q: "Voces atendem emergencias?",
    a: "Atendemos emergencias dentro do horario de funcionamento. O ideal e entrar em contato antes para prepararmos o atendimento.",
  },
];

const AccordionItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`faq-item ${isOpen ? "open" : ""}`}>
      <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        <span>{question}</span>
        <ChevronDown size={20} className={`faq-chevron ${isOpen ? "rotate" : ""}`} />
      </button>

      {isOpen && (
        <div className="faq-answer">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

const FAQ = () => {
  return (
    <section id="faq" className="faq-section">
      <div className="container faq-container">
        <div className="faq-heading">
          <h2 className="faq-title">Duvidas Frequentes</h2>
          <div className="faq-divider"></div>
        </div>

        <div className="faq-list">
          {faqItems.map((item, i) => (
            <AccordionItem key={i} question={item.q} answer={item.a} />
          ))}
        </div>

        <div className="faq-contact-box">
          <div className="faq-contact-left">
            <FaPaw className="faq-paw" />
            <div>
              <strong>Restou alguma duvida?</strong>
              <p>Fale com a nossa equipe e receba atendimento rapido pelo WhatsApp.</p>
            </div>
          </div>

          <a
            href={`https://wa.me/5512992136141?text=${encodeURIComponent(
              "Ola! Restou uma duvida e gostaria de mais informacoes, pode me ajudar?"
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="faq-contact-button"
          >
            Entre em contato
            <MessageCircleMore size={18} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;