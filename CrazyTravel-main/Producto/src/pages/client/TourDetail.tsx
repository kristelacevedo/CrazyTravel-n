import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function TourDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<any>(null); // 👈 Nuevo estado para ver el error

  useEffect(() => {
    window.scrollTo(0, 0);
    
    async function fetchTour() {
      // Si por alguna razón el ID de la URL no se lee bien
      if (!id) {
        setDebugInfo({ mensaje: "El ID de la URL está vacío o no se reconoció." });
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        // Guardamos el error para mostrarlo en pantalla
        setDebugInfo({ 
          errorSupabase: error, 
          idBuscado: id 
        });
      } else {
        setTour(data);
      }
      setLoading(false);
    }
    
    fetchTour();
  }, [id]);

  if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Cargando viaje...</div>;

  // 👇 SI HAY UN ERROR, LO MOSTRAMOS GIGANTE EN PANTALLA 👇
  if (debugInfo) {
    return (
      <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', backgroundColor: '#fee2e2', borderRadius: '10px', marginTop: '50px' }}>
        <h2 style={{ color: '#b91c1c' }}>🚨 Información de Depuración (Error)</h2>
        <p><strong>ID que intentó buscar:</strong> {debugInfo.idBuscado}</p>
        <p><strong>Detalle del error:</strong></p>
        <pre style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '5px', overflowX: 'auto' }}>
          {JSON.stringify(debugInfo.errorSupabase, null, 2)}
        </pre>
        <button onClick={() => navigate('/viajes')} style={{ padding: '10px 20px', cursor: 'pointer', marginTop: '20px' }}>
          Volver al catálogo
        </button>
      </div>
    );
  }

  if (!tour) {
    return (
      <div style={{ padding: '100px', textAlign: 'center' }}>
        <h2>Viaje no encontrado 😢</h2>
        <button onClick={() => navigate('/viajes')} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Volver al catálogo
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#0f766e', cursor: 'pointer', marginBottom: '20px' }}>
        ← Volver al catálogo
      </button>

      <div style={{ width: '100%', height: '400px', borderRadius: '20px', overflow: 'hidden', marginBottom: '40px' }}>
        <img src={tour.imagen_url || 'https://via.placeholder.com/800'} alt={tour.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '60px' }}>
        <div>
          <h1 style={{ fontSize: '36px', marginBottom: '16px' }}>{tour.titulo}</h1>
          <p style={{ color: '#475569', fontSize: '18px' }}>📍 {tour.destino}</p>
          <p style={{ marginTop: '20px', lineHeight: '1.6' }}>{tour.descripcion}</p>
        </div>

        <div style={{ backgroundColor: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', height: 'fit-content' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>
            ${(tour.precio || 0).toLocaleString('es-CL')}
          </div>
          <p>Cupos disponibles: <strong>{tour.cupos_totales}</strong></p>
          {tour.fecha_salida && <p>Fecha: {new Date(tour.fecha_salida).toLocaleDateString('es-CL')}</p>}
          
          <button 
            disabled={tour.cupos_totales === 0}
            onClick={() => navigate(`/reservar/${tour.id}`)}
            style={{ width: '100%', padding: '16px', backgroundColor: tour.cupos_totales === 0 ? '#cbd5e1' : '#0f766e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '20px' }}
          >
            {tour.cupos_totales === 0 ? 'Agotado' : 'Reservar ahora'}
          </button>
        </div>
      </div>
    </div>
  );
}