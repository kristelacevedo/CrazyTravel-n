import { useNavigate } from 'react-router-dom';

// ─── Datos Simulados Actualizados (v2) ─────────────────────────────────────────────
// Ahora las imágenes sí coinciden con el destino.
const MOCK_TOURS = [
  {
    id: '1',
    title: 'Aventura Mágica en Chiloé',
    destination: 'Chiloé, Chile',
    price: 350000,
    days: 5,
    nights: 4,
    // Foto de Palafitos de Castro, Chiloé
    imageUrl: 'https://www.tipicochileno.cl/wp-content/uploads/2011/05/palafitos-de-chiloe-B.png',
    spots: 12,
  },
  {
    id: '2',
    title: 'Vacaciones de Ensueño en Búzios',
    destination: 'Búzios, Brasil',
    price: 850000,
    days: 7,
    nights: 6,
    // Foto de playa Joao Fernandes, Búzios
    imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/02/23/c5/76/praia-joao-fernandes.jpg?w=900&h=500&s=1',
    spots: 5,
  },
  {
    id: '3',
    title: 'Relajo Total en Termas del Sur',
    destination: 'Pucón, Chile',
    price: 280000,
    days: 3,
    nights: 2,
    // Foto del Volcán Villarrica en Pucón
    imageUrl: 'https://www.latercera.com/resizer/v2/UHLBREPL3NDFDJD2GRFV4SENQU.jpg?auth=30b0685d113e4b5d3b8db3c4ca5717c3eab11cb69dc614f6b12c18135205e868&smart=true&width=800&height=450&quality=70',
    spots: 0, 
  },
];

export default function Viajes() {
  const navigate = useNavigate();

  return (
    // NUEVO: Envoltorio para el fondo de la página completa
    <div className="page-background">
      
      {/* Cabecera de la página */}
      <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
        <h1 className="page-title">
          Explora nuestros destinos
        </h1>
        <p className="page-subtitle">
          Encuentra tu próxima gran aventura con Crazy Travel.
        </p>
      </div>

      {/* Grilla de Tarjetas (Cards) */}
      <div className="tours-grid">
        {MOCK_TOURS.map((tour) => (
          <div key={tour.id} className="tour-card">
            
            {/* Imagen del viaje */}
            <div className="tour-image-container">
              <img src={tour.imageUrl} alt={tour.title} className="tour-image" />
              {/* Etiqueta de cupos */}
              {tour.spots === 0 ? (
                <span className="badge-status" style={{ backgroundColor: '#ef4444' }}>Agotado</span>
              ) : (
                <span className="badge-status" style={{ backgroundColor: '#0f766e' }}>
                  Últimos {tour.spots} cupos
                </span>
              )}
            </div>

            {/* Información del viaje con nueva clase card-content */}
            <div className="card-content">
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.1em' }}>
                📍 {tour.destination}
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.25rem', lineHeight: '1.3', letterSpacing: '-0.01em' }}>
                {tour.title}
              </h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', color: '#475569', marginBottom: '2rem' }}>
                <span>🗓️ {tour.days} Días / {tour.nights} Noches</span>
              </div>

              {/* Precio y Botón */}
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>Precio por persona</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0f766e', letterSpacing: '-0.02em' }}>
                    ${tour.price.toLocaleString('es-CL')}
                  </span>
                </div>
                <button 
                  onClick={() => navigate(`/tour/${tour.id}`)}
                  className="btn-tour"
                  disabled={tour.spots === 0}
                >
                  {tour.spots === 0 ? 'Sin cupos' : 'Ver detalle'}
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}