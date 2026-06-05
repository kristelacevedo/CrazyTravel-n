import { Link } from 'react-router-dom';

// ─── Datos Simulados de Testimonios ──────────────────────────────────────────
const MOCK_TESTIMONIALS = [
  {
    id: 1,
    name: 'Valentina Rojas',
    tour: 'Viaje a Búzios, Brasil',
    quote: '"La mejor experiencia de mi vida. Todo estuvo organizado a la perfección, desde los vuelos hasta el hotel. ¡No tuve que preocuparme de nada, solo de disfrutar la playa!"',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
    stars: '⭐⭐⭐⭐⭐'
  },
  {
    id: 2,
    name: 'Andrés Soto',
    tour: 'Aventura en Pucón',
    quote: '"Totalmente recomendado. El guía local conocía los mejores lugares que no salen en internet. Crazy Travel se nota que se preocupa por los detalles. Volveré a viajar con ellos."',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    stars: '⭐⭐⭐⭐⭐'
  },
  {
    id: 3,
    name: 'Camila y Pedro',
    tour: 'Mágia en Chiloé',
    quote: '"Fuimos de luna de miel y fue mágico. Los palafitos, la comida y la atención del equipo de Crazy Travel hicieron que fuera un viaje inolvidable. ¡Gracias totales!"',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop',
    stars: '⭐⭐⭐⭐⭐'
  }
];

export default function Home() {
  return (
    <div>
      {/* ─── Hero Section (Banner principal a pantalla completa) ─── */}
      <section className="hero-section">
        <h1 className="hero-title">
          Tu próxima gran aventura empieza aquí
        </h1>
        <p className="hero-subtitle">
          Descubre destinos increíbles alrededor del mundo con el mejor equipo de profesionales acompañándote en cada paso.
        </p>
        <Link to="/viajes" className="hero-btn">
          Explorar Destinos 🌍
        </Link>
      </section>

      {/* ─── Sección de Beneficios ─── */}
      <section className="features-section">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem' }}>
            ¿Por qué viajar con nosotros?
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.125rem' }}>
            Tu tranquilidad y diversión son nuestra prioridad número uno.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">🛡️</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.75rem' }}>Seguridad Garantizada</h3>
            <p style={{ color: '#475569', lineHeight: '1.6' }}>Trabajamos solo con proveedores certificados para que viajes sin ninguna preocupación.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">💸</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.75rem' }}>Los Mejores Precios</h3>
            <p style={{ color: '#475569', lineHeight: '1.6' }}>Planes a tu medida y opciones de financiamiento para que el dinero no sea un límite.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">⭐</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.75rem' }}>Experiencias Únicas</h3>
            <p style={{ color: '#475569', lineHeight: '1.6' }}>Itinerarios exclusivos diseñados por viajeros expertos que conocen los mejores secretos.</p>
          </div>
        </div>
      </section>

      {/* ─── Sección de Testimonios ─── */}
      <section className="testimonials-section">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem' }}>
            Lo que dicen nuestros viajeros
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.125rem' }}>
            Miles de clientes felices ya han vivido la experiencia Crazy Travel.
          </p>
        </div>

        <div className="testimonials-grid">
          {MOCK_TESTIMONIALS.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-stars">{testimonial.stars}</div>
              <p className="testimonial-quote">{testimonial.quote}</p>
              
              <div className="testimonial-user">
                <img src={testimonial.avatar} alt={testimonial.name} className="testimonial-avatar" />
                <div className="testimonial-info">
                  <h4>{testimonial.name}</h4>
                  <p>✈️ {testimonial.tour}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Llamado a la Acción Final ─── */}
      <section className="cta-section">
        <h2 className="cta-title">¿Listo para hacer las maletas?</h2>
        <p style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
          Únete a cientos de viajeros y comienza a planificar la escapada de tus sueños hoy mismo. No dejes para mañana el viaje que puedes hacer hoy.
        </p>
        <Link to="/viajes" className="cta-btn-final">
          Ver Catálogo de Viajes 🚀
        </Link>
      </section>

    </div>
  );
}