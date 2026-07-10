import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { supabase } from '../../lib/supabase'; // Asegúrate de que esta ruta sea la correcta

export default function MyPoints() {
  const [puntos, setPuntos] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPuntos();
  }, []);

  const fetchPuntos = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        // Consultamos la tabla 'perfiles' (o como se llame tu tabla de usuarios)
        const { data, error } = await supabase
          .from('perfiles') 
          .select('puntos') // ⚠️ CAMBIA 'puntos' si tu columna se llama diferente en Supabase
          .eq('id', session.user.id)
          .single(); // Usamos single() porque solo queremos un perfil

        if (error) throw error;
        
        // Si hay datos, guardamos los puntos. Si está vacío/null, ponemos 0.
        if (data) {
          setPuntos(data.puntos || 0);
        }
      }
    } catch (error) {
      console.error("Error cargando los puntos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={sectionTitleStyle}>Mis Puntos Crazy ⭐</h2>
      <div style={pointsCardStyle}>
        
        {/* Mostramos "Cargando..." mientras busca en la base de datos, luego el número real */}
        {loading ? (
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#cbd5e1', marginBottom: '8px', padding: '12px 0' }}>
            Calculando...
          </div>
        ) : (
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#eab308', marginBottom: '8px' }}>
            {/* toLocaleString('es-CL') le pondrá el punto de miles automáticamente */}
            {puntos.toLocaleString('es-CL')}
          </div>
        )}

        <p style={{ color: '#475569', fontSize: '16px', marginBottom: '24px' }}>Puntos acumulados</p>
        
        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', textAlign: 'left' }}>
          <h4 style={{ color: '#0f172a', margin: '0 0 8px 0', fontSize: '18px' }}>¿Cómo usar tus puntos?</h4>
          <ul style={{ color: '#475569', fontSize: '14px', margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
            <li>Cada punto equivale a <strong>$1 CLP</strong> de descuento.</li>
            <li>Acumulas puntos automáticamente con cada reserva pagada.</li>
            <li>¡Gana 5.000 puntos extra al invitar a un amigo a unirse a la familia Crazy Travel!</li>
          </ul>
        </div>
        
        <button style={{ ...buttonStyle, backgroundColor: '#0f172a', marginTop: '24px', width: 'auto', padding: '12px 32px' }}>
          Canjear en mi próxima reserva
        </button>
      </div>
    </div>
  );
}

// Estilos
const sectionTitleStyle: CSSProperties = { fontSize: '24px', color: '#0f172a', marginBottom: '24px', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' };
const pointsCardStyle: CSSProperties = { textAlign: 'center', padding: '20px' };
const buttonStyle: CSSProperties = { padding: '14px 24px', borderRadius: '8px', border: 'none', background: '#0f766e', color: '#fff', cursor: 'pointer', fontWeight: '600', fontSize: '15px', transition: 'background-color 0.2s' };