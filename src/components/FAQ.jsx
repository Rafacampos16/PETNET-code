import React, { useState } from "react";
import "../styles/faq.css";
import { ChevronDown, MessageCircleMore } from "lucide-react";
import { FaPaw } from "react-icons/fa";

const faqItems = [
  {
    q: "Quanto tempo dura o banho e tosa?",
    a: "O tempo varia conforme o porte, a raça e a condição da pelagem. Em média, o processo completo leva de 2 a 3 horas.",
  },
  {
    q: "Preciso agendar com antecedência?",
    a: "Sim, principalmente em fins de semana e feriados, para garantir o melhor horário para você e seu pet.",
  },
  {
    q: "Quais vacinas meu pet precisa ter?",
    a: "As vacinas essenciais dependem da avaliação do veterinário, mas geralmente incluem V8 ou V10 para cães, tríplice para gatos e antirrábica.",
  },
  {
    q: "Como funciona o banho medicamentoso?",
    a: "Ele é realizado com orientação adequada e produtos específicos para tratamento da pele, respeitando o tempo de ação necessário.",
  },
  {
    q: "Vocês atendem emergências?",
    a: "Atendemos emergências dentro do horário de funcionamento. O ideal é entrar em contato antes para prepararmos o atendimento.",
  },
];

const AccordionItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`faq-item ${isOpen ? "open" : ""}`}>
      <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        <span>{question}</span>

        <ChevronDown
          size={20}
          className={`faq-chevron ${isOpen ? "rotate" : ""}`}
        />
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
          <h2 className="faq-title">Dúvidas Frequentes</h2>
          <div className="faq-divider"></div>
        </div>

        <div className="faq-list">
          {faqItems.map((item, i) => (
            <AccordionItem
              key={i}
              question={item.q}
              answer={item.a}
            />
          ))}
        </div>

        <div className="faq-contact-box">
          <div className="faq-contact-left">
            <FaPaw className="faq-paw" />

            <div>
              <strong>Restou alguma dúvida?</strong>

              <p>
                Fale com a nossa equipe e receba atendimento rápido pelo
                WhatsApp.
              </p>
            </div>
          </div>

          <a
            href={`https://wa.me/5512996539100?text=${encodeURIComponent(
              "Olá! Restou uma dúvida e gostaria de mais informações, pode me ajudar?"
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