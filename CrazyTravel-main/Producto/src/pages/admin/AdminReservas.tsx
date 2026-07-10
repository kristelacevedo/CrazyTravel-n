import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase'; // Ajusta la ruta si tu archivo supabase.ts está en otra carpeta

export default function AdminReservas() {
  const [reservas, setReservas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservas();
  }, []);

  const fetchReservas = async () => {
    try {
      setLoading(true);
      
      // Hacemos la consulta trayendo los datos relacionados de tours y perfiles
      const { data, error } = await supabase
        .from('reservas')
        .select(`
          id,
          created_at,
          cupos,
          total_price,
          status,
          tours ( title, destination ),
          perfiles ( email, first_name )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setReservas(data);
    } catch (error: any) {
      console.error('Error cargando reservas:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para cambiar el estado (Aprobado/Rechazado) directamente desde la tabla
  const handleCambiarEstado = async (id: string, nuevoEstado: string) => {
    try {
      const { error } = await supabase
        .from('reservas')
        .update({ status: nuevoEstado })
        .eq('id', id);

      if (error) throw error;
      
      alert(`Estado actualizado a: ${nuevoEstado} 🎉`);
      fetchReservas(); // Recarga la tabla automáticamente
    } catch (error: any) {
      alert('Error al actualizar: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '32px', color: '#0f172a', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Título de la sección */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '26px', fontWeight: 'bold', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          💳 Control de Reservas y Pagos
        </h2>
        <p style={{ color: '#64748b', margin: 0, fontSize: '15px' }}>
          Historial transaccional del sistema, control de ingresos y estados de MercadoPago.
        </p>
      </div>

      {/* Tabla Contenedora */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        {loading ? (
          <p style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>Conectando con Supabase...</p>
        ) : reservas.length === 0 ? (
          <p style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>No se registran compras todavía en la plataforma.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: '600' }}>
                <th style={{ padding: '16px' }}>Pasajero / Cliente</th>
                <th style={{ padding: '16px' }}>Tour Seleccionado</th>
                <th style={{ padding: '16px', textAlign: 'center' }}>Cupos</th>
                <th style={{ padding: '16px' }}>Monto Total</th>
                <th style={{ padding: '16px' }}>Estado Pago</th>
                <th style={{ padding: '16px', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((reserva) => (
                <tr key={reserva.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  
                  {/* Cliente */}
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: '500', color: '#0f172a' }}>{reserva.perfiles?.first_name || 'Pasajero Crazy'}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{reserva.perfiles?.email || 'Sin email'}</div>
                  </td>
                  
                  {/* Tour */}
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: '500', color: '#0f172a' }}>{reserva.tours?.title || 'Tour General'}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>📍 {reserva.tours?.destination || 'Chile'}</div>
                  </td>

                  {/* Cupos */}
                  <td style={{ padding: '16px', textAlign: 'center', fontWeight: '500' }}>
                    {reserva.cupos || 1}
                  </td>

                  {/* Precio */}
                  <td style={{ padding: '16px', fontWeight: '600', color: '#0f766e' }}>
                    ${reserva.total_price ? reserva.total_price.toLocaleString('es-CL') : '0'}
                  </td>

                  {/* Estado (Badge con colores) */}
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: reserva.status === 'approved' || reserva.status === 'Aprobado' ? '#dcfce7' : '#fef9c3',
                      color: reserva.status === 'approved' || reserva.status === 'Aprobado' ? '#166534' : '#854d0e'
                    }}>
                      {reserva.status || 'Pendiente'}
                    </span>
                  </td>

                  {/* Selector para cambiar estado en la demo */}
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <select 
                      onChange={(e) => handleCambiarEstado(reserva.id, e.target.value)}
                      defaultValue=""
                      style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', backgroundColor: '#fff', cursor: 'pointer', outline: 'none' }}
                    >
                      <option value="" disabled>Gestionar</option>
                      <option value="Aprobado">Aprobar</option>
                      <option value="Rechazado">Rechazar</option>
                    </select>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}