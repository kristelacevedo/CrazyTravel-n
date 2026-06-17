import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase'; // Asegúrate de que no tenga la línea roja

export default function Viajes() {
  const navigate = useNavigate();
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTours() {
      const { data, error } = await supabase.from('tours').select('*');
      if (data) setTours(data);
      if (error) console.error(error);
      setLoading(false);
    }
    loadTours();
  }, []);
  
  if (loading) return <div className="page-background" style={{ padding: '40px', textAlign: 'center' }}>Cargando destinos...</div>;

  return (
    <div className="page-background">
      <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
        <h1 className="page-title">Explora nuestros destinos</h1>
      </div>

      <div className="tours-grid">
        {tours.map((tour) => (
          <div key={tour.id} className="tour-card">
            
            {/* Imagen del viaje y Etiqueta de Cupos */}
            <div className="tour-image-container">
              <img 
                src={tour.imagen_url || 'https://via.placeholder.com/400?text=Sin+Imagen'} 
                alt={tour.titulo} 
                className="tour-image" 
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
              {tour.cupos_totales === 0 ? (
                <span className="badge-status" style={{ backgroundColor: '#ef4444' }}>Agotado</span>
              ) : (
                <span className="badge-status" style={{ backgroundColor: '#0f766e' }}>
                  Últimos {tour.cupos_totales} cupos
                </span>
              )}
            </div>

            {/* Información del viaje */}
            <div className="card-content" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                📍 {tour.destino || 'Destino por confirmar'}
              </div>
              
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.25rem' }}>
                {tour.titulo || 'Sin título'}
              </h3>
              
              {/* Fecha de salida (Opcional, ya que la tienes en la BD) */}
              {tour.fecha_salida && (
                <div style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '1rem' }}>
                  🗓️ Salida: {new Date(tour.fecha_salida).toLocaleDateString('es-CL')}
                </div>
              )}

              <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0f766e' }}>
                ${(tour.precio || 0).toLocaleString('es-CL')}
              </div>
              
              <button 
                onClick={() => navigate(`/tour/${tour.id}`)}
                className="btn-tour"
                disabled={tour.cupos_totales === 0}
                style={{ 
                  marginTop: '1rem', width: '100%', padding: '10px', 
                  backgroundColor: tour.cupos_totales === 0 ? '#cbd5e1' : '#0f766e', 
                  color: 'white', border: 'none', borderRadius: '8px', 
                  cursor: tour.cupos_totales === 0 ? 'not-allowed' : 'pointer', 
                  fontWeight: 'bold' 
                }}
              >
                {tour.cupos_totales === 0 ? 'Sin cupos' : 'Ver detalle'}
              </button>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}