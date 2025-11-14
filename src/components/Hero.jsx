import React from "react";
import HeroImg from "../assets/icons/logopetnet.png";
import "../styles/hero.css";

const Hero = () => (
  <section id="hero" className="hero">
    <div className="container">
      <div className="hero-content">
        <div className="hero-text">
          <h1>Cuidados especiais para seu melhor amigo</h1>
          <p>
            Oferecemos serviços de alta qualidade para garantir o bem-estar e a
            felicidade do seu pet.
          </p>
          <a href="#services" className="btn-primary">
            Nossos Serviços
          </a>
        </div>
        <div className="hero-image">
          <img src={HeroImg} alt="logo PETNET" />
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
