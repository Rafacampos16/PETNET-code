import React from "react";
import "../styles/location.css";

const Location = () => (
  <section id="location" className="location-section">
    <div className="container">
      <h2 className="location-title">
        <span> Nossa Localização</span>
      </h2>

      <div className="map-wrapper">
        <iframe
          title="Localização PETNET"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3667.4359681146384!2d-45.87720957531054!3d-23.190777298080963!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cc4a48630f7201%3A0x64e5cde5adab11b7!2sAv.%20Nair%20Toledo%20de%20Mira%20-%20Jardim%20Paulista%2C%20S%C3%A3o%20Jos%C3%A9%20dos%20Campos%20-%20SP%2C%2012215-656!5e0!3m2!1spt-BR!2sbr!4v1760902795165!5m2!1spt-BR!2sbr"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    </div>
  </section>
);

export default Location;
