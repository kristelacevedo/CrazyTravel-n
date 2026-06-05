export default function About() {
  return (
    <div>
      {/* ─── Encabezado de la página ─── */}
      <section className="about-header">
        <div>
          <h1>Nuestra Pasión es tu Aventura</h1>
          <p style={{ fontSize: '1.25rem', color: '#cbd5e1', maxWidth: '600px', margin: '0 auto' }}>
            Conoce al equipo de locos por los viajes que hace posible tus sueños.
          </p>
        </div>
      </section>

      {/* ─── Contenedor Principal (Flotante) ─── */}
      <section className="about-container">
        <div className="about-content">
          
          <h2 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '1.5rem', fontWeight: '800' }}>
            La historia de Crazy Travel
          </h2>
          
          <p>
            En <strong>Crazy Travel</strong>, no solo vendemos pasajes; creamos experiencias inolvidables. Nacimos con la convicción de que viajar debe ser accesible, seguro y, sobre todo, emocionante.
          </p>
          <p>
            Liderados por un equipo de expertos apasionados por el turismo, nos encargamos de cada detalle: desde el transporte de primer nivel hasta el alojamiento y los itinerarios exclusivos. Queremos que tu única preocupación sea disfrutar del paisaje.
          </p>
          <p>
            Conecta con la naturaleza, descubre nuevas culturas y viaja con la tranquilidad de que estás en las mejores manos. ¡Bienvenido a la familia Crazy Travel!
          </p>

          {/* ─── Grilla de Valores ─── */}
          <div className="values-grid">
            <div className="value-card">
              <span className="value-icon">🤝</span>
              <h3>Compromiso</h3>
              <p>Estamos contigo antes, durante y después de tu viaje.</p>
            </div>
            <div className="value-card">
              <span className="value-icon">🌍</span>
              <h3>Sostenibilidad</h3>
              <p>Promovemos un turismo responsable con el medio ambiente.</p>
            </div>
            <div className="value-card">
              <span className="value-icon">❤️</span>
              <h3>Pasión</h3>
              <p>Amamos lo que hacemos y se nota en cada itinerario.</p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}