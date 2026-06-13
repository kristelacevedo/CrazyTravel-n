import type { CSSProperties } from 'react';

export default function MyPoints() {
  return (
    <div>
      <h2 style={sectionTitleStyle}>Mis Puntos Crazy ⭐</h2>
      <div style={pointsCardStyle}>
        <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#eab308', marginBottom: '8px' }}>1,250</div>
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

const sectionTitleStyle: CSSProperties = { fontSize: '24px', color: '#0f172a', marginBottom: '24px', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' };
const pointsCardStyle: CSSProperties = { textAlign: 'center', padding: '20px' };
const buttonStyle: CSSProperties = { padding: '14px 24px', borderRadius: '8px', border: 'none', background: '#0f766e', color: '#fff', cursor: 'pointer', fontWeight: '600', fontSize: '15px', transition: 'background-color 0.2s' };