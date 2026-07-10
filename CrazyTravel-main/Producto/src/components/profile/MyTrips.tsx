import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { supabase } from '../../lib/supabase'; // Asegúrate de que esta ruta a supabase sea la correcta

export default function MyTrips() {
  const [reservas, setReservas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservas();
  }, []);

  const fetchReservas = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const { data, error } = await supabase
          .from('reservas')
          .select(`
            *,
            tours (
              titulo,
              imagen_url
            )
          `)
          .eq('perfil_id', session.user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setReservas(data || []);
      }
    } catch (error) {
      console.error("Error cargando reservas:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={emptyStateStyle}>Cargando tus viajes...</div>;

  return (
    <div>
      <h2 style={sectionTitleStyle}>Mis Viajes</h2>
      {reservas.length === 0 ? (
        <div style={emptyStateStyle}>No tienes viajes programados aún.</div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {reservas.map((reserva) => (
            <div key={reserva.id} style={bookingCardStyle}>
              {/* Si el tour no tiene imagen, ponemos un placeholder de respaldo */}
              <img 
                src={reserva.tours?.imagen_url || 'https://www.tipicochileno.cl/wp-content/uploads/2011/05/palafitos-de-chiloe-B.png'} 
                alt={reserva.tours?.titulo || 'Tour'} 
                style={bookingImageStyle} 
              />
              
              <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '18px', color: '#0f172a', margin: 0 }}>{reserva.tours?.titulo}</h3>
                  <span style={{ 
                    ...badgeStyle, 
                    backgroundColor: reserva.estado === 'Pagado' ? '#dcfce7' : '#fef08a',
                    color: reserva.estado === 'Pagado' ? '#166534' : '#854d0e'
                  }}>
                    {reserva.estado === 'Pagado' ? '✅ Pagado' : '⏳ Pendiente'}
                  </span>
                </div>
                
                <div style={{ display: 'flex', gap: '24px', marginBottom: '8px' }}>
                  <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}><strong>Pasajeros:</strong> {reserva.cantidad_pasajeros}</p>
                  <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}><strong>Total:</strong> ${reserva.total_pagado?.toLocaleString('es-CL')} CLP</p>
                </div>
                
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 12px 0' }}>ID de Reserva: {reserva.id.slice(0, 8).toUpperCase()}</p>

                {/* AQUÍ APARECEN LOS ACOMPAÑANTES SÓLO SI FUERON INGRESADOS */}
                {reserva.observaciones && (
                  <div style={observacionesBox}>
                    <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#0f766e', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Acompañantes y Datos de Salud:
                    </p>
                    <p style={{ fontSize: '13px', color: '#334155', fontStyle: 'italic', margin: 0, whiteSpace: 'pre-line' }}>
                      {reserva.observaciones}
                    </p>
                  </div>
                )}
                
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Estilos
const sectionTitleStyle: CSSProperties = { fontSize: '24px', color: '#0f172a', marginBottom: '24px', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' };
const emptyStateStyle: CSSProperties = { padding: '40px 20px', textAlign: 'center', border: '1px dashed #cbd5e1', color: '#64748b', borderRadius: '12px' };
const bookingCardStyle: CSSProperties = { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', overflow: 'hidden' };
const bookingImageStyle: CSSProperties = { width: '180px', objectFit: 'cover', minHeight: '100%' };
const badgeStyle: CSSProperties = { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' };
const observacionesBox: CSSProperties = { marginTop: 'auto', padding: '12px', backgroundColor: '#f0fdfa', borderRadius: '8px', borderLeft: '4px solid #0f766e' };