import React from "react";
import "../styles/location.css";
import { MapPin, Navigation } from "lucide-react";

const Location = () => {
  const mapsLink =
    "https://www.google.com/maps?q=Av.+Nair+Toledo+de+Mira,+São+José+dos+Campos";

  const wazeLink =
    "https://waze.com/ul?q=Av.+Nair+Toledo+de+Mira,+São+José+dos+Campos";

  return (
    <section id="location" className="location-section">
      <div className="container">

        <div className="location-heading">
          <h2 className="location-title">Nossa Localização</h2>
          <div className="location-divider"></div>

          <p className="location-subtitle">
            Venha nos visitar e conhecer nosso espaço preparado para cuidar do seu pet
            com conforto, segurança e carinho.
          </p>
        </div>

        <div className="location-grid">

          {/* MAPA */}
          <div className="map-wrapper">
            <iframe
              title="Localização PETNET"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3667.4359681146384!2d-45.87720957531054!3d-23.190777298080963!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cc4a48630f7201%3A0x64e5cde5adab11b7!2sAv.%20Nair%20Toledo%20de%20Mira%20-%20Jardim%20Paulista%2C%20S%C3%A3o%20Jos%C3%A9%20dos%20Campos%20-%20SP%2C%2012215-656!5e0!3m2!1spt-BR!2sbr!4v1760902795165!5m2!1spt-BR!2sbr"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>

          {/* CARD INFO */}
          <div className="location-info-card">
            <div className="location-icon">
              <MapPin size={26} />
            </div>

            <h3>Endereço</h3>

            <p>
              Av. Nair Toledo de Mira<br />
              Jardim Paulista<br />
              São José dos Campos - SP
            </p>

            <div className="location-buttons">

              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="maps-btn"
              >
                Abrir no Google Maps
              </a>

              <a
                href={wazeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="waze-btn"
              >
                <Navigation size={18} />
                Ir pelo GPS
              </a>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;