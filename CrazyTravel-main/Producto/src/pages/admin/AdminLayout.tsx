import { useState } from 'react';
import type { CSSProperties } from 'react';
import AdminDashboard from './AdminDashboard'; // El que hicimos antes
import AdminViajes from './AdminViajes';
import AdminReservas from './AdminReservas';

type ViewType = 'dashboard' | 'viajes' | 'reservas';

export default function AdminLayout() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  // Función para renderizar la pantalla correcta en el lado derecho
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'viajes':
        return <AdminViajes />;
      case 'reservas':
        return <AdminReservas />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div style={layoutStyle}>
      {/* ─── SIDEBAR (BARRA LATERAL IZQUIERDA) ─── */}
      <aside style={sidebarStyle}>
        <div style={logoContainerStyle}>
          <span style={logoEmojiStyle}>⚡</span>
          <h1 style={logoTextStyle}>CrazyTravel</h1>
          <span style={badgeStyle}>Admin</span>
        </div>

        <nav style={navStyle}>
          <button 
            onClick={() => setCurrentView('dashboard')} 
            style={getTabStyle(currentView === 'dashboard')}
          >
            📊 Dashboard
          </button>
          
          <button 
            onClick={() => setCurrentView('viajes')} 
            style={getTabStyle(currentView === 'viajes')}
          >
            🧳 Gestionar Viajes
          </button>
          
          <button 
            onClick={() => setCurrentView('reservas')} 
            style={getTabStyle(currentView === 'reservas')}
          >
            🎫 Reservas y Pagos
          </button>
        </nav>

        <div style={footerSidebarStyle}>
          <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>v1.0.0</p>
        </div>
      </aside>

      {/* ─── CONTENIDO PRINCIPAL (LADO DERECHO) ─── */}
      <main style={mainContentStyle}>
        {renderView()}
      </main>
    </div>
  );
}

// ─── Estilos del Layout (Diseño Oscuro Elegante para el Sidebar) ────────────────
const layoutStyle: CSSProperties = { display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui, sans-serif' };

const sidebarStyle: CSSProperties = { width: '260px', backgroundColor: '#0f172a', color: '#ffffff', display: 'flex', flexDirection: 'column', padding: '24px 16px', borderRight: '1px solid #1e293b', position: 'fixed', height: '100vh', boxSizing: 'border-box' };

const logoContainerStyle: CSSProperties = { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px', padding: '0 8px' };
const logoEmojiStyle: CSSProperties = { fontSize: '24px' };
const logoTextStyle: CSSProperties = { fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#f8fafc' };
const badgeStyle: CSSProperties = { backgroundColor: '#3b82f6', color: '#ffffff', fontSize: '11px', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' };

const navStyle: CSSProperties = { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 };

const mainContentStyle: CSSProperties = { flex: 1, marginLeft: '260px', minHeight: '100vh', backgroundColor: '#f8fafc' };

const footerSidebarStyle: CSSProperties = { paddingTop: '16px', borderTop: '1px solid #1e293b', textAlign: 'center' };

// Dinámico: Cambia el color del botón si está activo o no
function getTabStyle(isActive: boolean): CSSProperties {
  return {
    width: '100%',
    textAlign: 'left',
    padding: '12px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: isActive ? '#1e293b' : 'transparent',
    color: isActive ? '#3b82f6' : '#94a3b8',
    fontSize: '15px',
    fontWeight: isActive ? '600' : 'normal',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };
}