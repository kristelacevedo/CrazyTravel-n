import { useState } from 'react';
import type { CSSProperties } from 'react';

//  Importamos los componentes que acabamos de crear en la nueva carpeta
import AccountSecurity from '../../components/profile/AccountSecurity';
import PersonalData from '../../components/profile/PersonalData';
import MyTrips from '../../components/profile/MyTrips';
import MyPoints from '../../components/profile/MyPoints';

export default function Profile() {
  const [activeTab, setActiveTab] = useState<'cuenta' | 'datos' | 'reservas' | 'puntos'>('cuenta');

  // Función para mostrar el componente correcto según la pestaña
  const renderTabContent = () => {
    switch (activeTab) {
      case 'cuenta': return <AccountSecurity />;
      case 'datos': return <PersonalData />;
      case 'reservas': return <MyTrips />;
      case 'puntos': return <MyPoints />;
      default: return <AccountSecurity />;
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto 80px auto', minHeight: '60vh', padding: '0 20px' }}>
      
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', color: '#0f172a', marginBottom: '8px' }}>Mi Panel de Viajero</h1>
        <p style={{ color: '#475569', fontSize: '16px' }}>Gestiona tu cuenta, tus próximas aventuras y tus beneficios.</p>
      </div>

      <div style={layoutGridStyle}>
        
        {/* 🗂️ COLUMNA IZQUIERDA: Menú de Navegación */}
        <div style={sidebarStyle}>
          <button onClick={() => setActiveTab('cuenta')} style={{ ...menuButtonStyle, ...(activeTab === 'cuenta' ? activeMenuButtonStyle : {}) }}>
            ⚙️ Cuenta y Seguridad
          </button>
          <button onClick={() => setActiveTab('datos')} style={{ ...menuButtonStyle, ...(activeTab === 'datos' ? activeMenuButtonStyle : {}) }}>
            👤 Mis Datos Personales
          </button>
          <button onClick={() => setActiveTab('reservas')} style={{ ...menuButtonStyle, ...(activeTab === 'reservas' ? activeMenuButtonStyle : {}) }}>
            🎒 Mis Viajes
          </button>
          <button onClick={() => setActiveTab('puntos')} style={{ ...menuButtonStyle, ...(activeTab === 'puntos' ? activeMenuButtonStyle : {}) }}>
            ⭐ Mis Puntos Crazy
          </button>
        </div>

        {/* 📄 COLUMNA DERECHA: Contenido Dinámico */}
        <div style={contentAreaStyle}>
          {renderTabContent()}
        </div>

      </div>
    </div>
  );
}

// ─── Estilos Generales del Layout ─────────────────────────────────────────────
const layoutGridStyle: CSSProperties = { display: 'grid', gridTemplateColumns: '250px 1fr', gap: '32px', alignItems: 'start' };
const sidebarStyle: CSSProperties = { display: 'flex', flexDirection: 'column', gap: '8px' };
const menuButtonStyle: CSSProperties = { padding: '14px 16px', backgroundColor: 'transparent', border: 'none', borderRadius: '12px', textAlign: 'left', fontWeight: '600', fontSize: '15px', color: '#475569', cursor: 'pointer', transition: 'all 0.2s' };
const activeMenuButtonStyle: CSSProperties = { backgroundColor: '#f1f5f9', color: '#0f766e', boxShadow: 'inset 4px 0 0 0 #0f766e' }; 
const contentAreaStyle: CSSProperties = { backgroundColor: '#ffffff', borderRadius: '16px', padding: '32px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', minHeight: '400px' };