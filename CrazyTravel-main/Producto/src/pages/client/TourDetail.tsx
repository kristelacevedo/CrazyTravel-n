import { useEffect } from 'react';
import type { CSSProperties } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// ─── Datos Simulados (Lista de Tours) ───────────────────────────────────────
const MOCK_TOURS = [
  {
    id: '1', // El ID 1 será para Chiloé
    title: 'Aventura Mágica en Chiloé',
    destination: 'Chiloé, Chile',
    price: 350000,
    days: 5,
    nights: 4,
    imageUrl: 'https://www.tipicochileno.cl/wp-content/uploads/2011/05/palafitos-de-chiloe-B.png',
    spots: 12,
    description: 'Descubre la magia, mitos y leyendas de la Isla Grande de Chiloé. Un viaje diseñado para conectarte con la naturaleza, la gastronomía local y la arquitectura patrimonial en un entorno seguro y guiado por expertos.',
    includes: [
      '🚌 Transporte en bus semi-cama exclusivo',
      '🏨 Alojamiento en hotel céntrico (4 noches)',
      '🍳 Desayuno y cena incluidos',
      '🚶‍♂️ Trekking y caminatas de oxigenación guiadas',
      '⛴️ Cruce en transbordador al continente'
    ],
    itinerary: [
      { day: 1, title: 'Salida y Cruce', description: '20:00 hrs: Salida desde punto de encuentro. Viaje nocturno con destino a Pargua para tomar el transbordador al amanecer.' },
      { day: 2, title: 'Llegada y Tour por Castro', description: '10:00 hrs: Llegada al hotel. 15:00 hrs: Tour por los palafitos de Castro y la Iglesia San Francisco. Noche bohemia opcional.' },
      { day: 3, title: 'Parque Nacional Chiloé', description: '09:00 hrs: Trekking por los senderos del Parque Nacional. Tarde libre para disfrutar de la gastronomía local.' }
    ]
  },
  {
    id: '2', // El ID 2 será para Búzios
    title: 'Vacaciones de Ensueño en Búzios',
    destination: 'Búzios, Brasil',
    price: 850000,
    days: 7,
    nights: 6,
    imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/02/23/c5/76/praia-joao-fernandes.jpg?w=900&h=500&s=1', // Imagen de playa referencial
    spots: 5,
    description: 'Relájate en las paradisíacas playas de Búzios, la península más encantadora de Brasil. Disfruta del sol, aguas cristalinas, paseos en goleta y la vibrante vida nocturna en la famosa Rua das Pedras.',
    includes: [
      '✈️ Vuelos ida y vuelta (Tasas incluidas)',
      '🚐 Traslados Aeropuerto - Hotel - Aeropuerto',
      '🏨 Alojamiento en Pousada a pasos de la playa (6 noches)',
      '🍳 Desayuno buffet tropical diario',
      '⛵ Paseo en Goleta por las playas principales con caipirinha de cortesía'
    ],
    itinerary: [
      { day: 1, title: 'Vuelo y Llegada al Paraíso', description: 'Vuelo AM hacia Río de Janeiro. Traslado directo a Búzios y check-in en la Pousada. Tarde libre para reconocer el sector.' },
      { day: 2, title: 'Navegación en Goleta', description: '10:00 hrs: Zarpamos para recorrer las playas de João Fernandes, Tartaruga y Azeda. Tarde libre.' },
      { day: 3, title: 'Día Libre y Rua das Pedras', description: 'Día a tu propio ritmo para disfrutar de la playa. En la noche, recorrido recomendado por los restaurantes y tiendas de Rua das Pedras.' }
    ]
  }
];

export default function TourDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1. Buscamos en la lista el viaje que coincida con el ID de la URL
  const tour = MOCK_TOURS.find((viaje) => viaje.id === id); 

  // Esto hace que la página empiece desde arriba al cargar
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 2. Si el cliente pone un ID que no existe (ej: /viaje/99), le mostramos un error amigable
  if (!tour) {
    return (
      <div style={{ padding: '100px', textAlign: 'center' }}>
        <h2>Viaje no encontrado 😢</h2>
        <button onClick={() => navigate(-1)} style={flyerButtonStyle}>Volver al catálogo</button>
      </div>
    );
  }

  return (
    <div>
      {/* Botón Volver */}
      <button onClick={() => navigate(-1)} style={backButtonStyle}>
        ← Volver al catálogo
      </button>

      {/* Imagen Hero */}
      <div style={heroImageContainer}>
        <img src={tour.imageUrl} alt={tour.title} style={heroImage} />
        <div style={badgeStyle}>{tour.spots} cupos disponibles</div>
      </div>

      {/* Contenedor Principal Dividido */}
      <div style={layoutGrid}>
        
        {/* COLUMNA IZQUIERDA: Información del Viaje */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <section>
            <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>
              📍 {tour.destination}
            </div>
            <h1 style={{ fontSize: '36px', color: '#0f172a', marginBottom: '16px', lineHeight: '1.2' }}>
              {tour.title}
            </h1>
            <p style={{ fontSize: '16px', color: '#475569', lineHeight: '1.6' }}>
              {tour.description}
            </p>
          </section>

          <hr style={dividerStyle} />

          {/* Qué Incluye */}
          <section>
            <h2 style={sectionTitleStyle}>¿Qué incluye tu viaje?</h2>
            <ul style={includeListStyle}>
              {tour.includes.map((item, index) => (
                <li key={index} style={{ marginBottom: '12px', color: '#334155' }}>{item}</li>
              ))}
            </ul>
          </section>

          <hr style={dividerStyle} />

          {/* Itinerario */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '22px', color: '#0f172a', margin: 0 }}>Itinerario resumido</h2>
              <button style={flyerButtonStyle}>
                📄 Descargar Flyer (PDF)
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {tour.itinerary.map((item) => (
                <div key={item.day} style={itineraryCardStyle}>
                  <div style={{ fontWeight: 'bold', color: '#0f766e', minWidth: '70px' }}>Día {item.day}</div>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', color: '#1e293b' }}>{item.title}</h4>
                    <p style={{ margin: 0, color: '#475569', fontSize: '14px', lineHeight: '1.5' }}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* COLUMNA DERECHA: Tarjeta de Reserva Flotante */}
        <div style={{ position: 'relative' }}>
          <div style={stickyBookingCard}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>
              ${tour.price.toLocaleString('es-CL')}
              <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 'normal' }}> /por persona</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', marginBottom: '24px', color: '#475569', fontSize: '14px' }}>
              <span>Duración</span>
              <span style={{ fontWeight: '600' }}>{tour.days} Días, {tour.nights} Noches</span>
            </div>

            <button 
              style={bookButtonStyle}
              onClick={() => navigate(`/reservar/${tour.id}`)}
            >
            Reservar Cupos Ahora
          </button>
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: '12px', marginTop: '12px', marginBottom: 0 }}>
              Serás redirigido para configurar tu grupo.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Estilos en Línea ────────────────────────────────────────────────────────
const backButtonStyle: CSSProperties = { background: 'none', border: 'none', color: '#0f766e', fontWeight: '600', cursor: 'pointer', padding: '0 0 20px 0', fontSize: '15px' };
const heroImageContainer: CSSProperties = { width: '100%', height: '400px', borderRadius: '20px', overflow: 'hidden', position: 'relative', marginBottom: '40px' };
const heroImage: CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };
const badgeStyle: CSSProperties = { position: 'absolute', top: '20px', left: '20px', backgroundColor: '#ffffff', color: '#0f172a', padding: '8px 16px', borderRadius: '30px', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' };
const layoutGrid: CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 380px', gap: '60px', alignItems: 'start' };
const dividerStyle: CSSProperties = { border: 'none', borderTop: '1px solid #e2e8f0', margin: '0' };
const sectionTitleStyle: CSSProperties = { fontSize: '22px', color: '#0f172a', marginBottom: '20px' };
const includeListStyle: CSSProperties = { listStyleType: 'none', padding: 0, margin: 0, fontSize: '16px' };
const flyerButtonStyle: CSSProperties = { background: '#f8fafc', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '8px', color: '#0f172a', fontWeight: '600', cursor: 'pointer', fontSize: '14px', transition: 'background 0.2s' };
const itineraryCardStyle: CSSProperties = { display: 'flex', gap: '16px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' };
const stickyBookingCard: CSSProperties = { position: 'sticky', top: '100px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' };
const bookButtonStyle: CSSProperties = { width: '100%', padding: '16px', backgroundColor: '#0f766e', color: '#ffffff', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', transition: 'background-color 0.2s' };