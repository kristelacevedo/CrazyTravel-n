import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { Navigate } from 'react-router-dom';

// IMPORTANTE: Verifica que esta ruta hacia tu archivo supabase coincida con tus carpetas.
import { supabase } from '../../lib/supabase'; 

import AdminDashboard from './AdminDashboard';
import AdminReservas from './AdminReservas';

// Solo dejamos dos vistas para que el menú sea claro y directo
type ViewType = 'viajes' | 'reservas';

export default function AdminLayout() {
  const [currentView, setCurrentView] = useState<ViewType>('viajes');
  
  // 🛡️ Estado del guardia de seguridad
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  // 🛡️ Lógica de verificación
  useEffect(() => {
    const verificarCredenciales = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setIsAdmin(false); // No hay sesión iniciada
          return;
        }

        const { data: perfil, error } = await supabase
          .from('perfiles')
          .select('rol')
          .eq('email', user.email)
          .single();

        if (error) throw error;

        if (perfil?.rol === 'admin') {
          setIsAdmin(true); // ¡Es administrador!
        } else {
          setIsAdmin(false); // Es un cliente normal
        }
      } catch (error) {
        console.error("Error verificando seguridad:", error);
        setIsAdmin(false);
      }
    };

    verificarCredenciales();
  }, []);

  // 🛡️ Pantalla de carga mientras el guardia revisa
  if (isAdmin === null) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc', color: '#0f172a' }}>
        <h2>🔒 Verificando credenciales de seguridad...</h2>
      </div>
    );
  }

  // 🛡️ Si no es administrador, lo pateamos a la página de login
  if (isAdmin === false) {
    return <Navigate to="/auth/login" replace />;
  }

  // ─── A PARTIR DE AQUÍ ES TU CÓDIGO INTACTO ───

  // Función para renderizar la pantalla correcta en el lado derecho
  const renderView = () => {
    switch (currentView) {
      case 'viajes':
        return <AdminDashboard />; // Tu tabla de tours
      case 'reservas':
        return <AdminReservas />; // Tu tabla de pagos
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
          {/* Botón: Viajes */}
          <button 
            onClick={() => setCurrentView('viajes')} 
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '12px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: currentView === 'viajes' ? '#1e293b' : 'transparent',
              color: currentView === 'viajes' ? '#3b82f6' : '#94a3b8',
              fontSize: '15px',
              fontWeight: currentView === 'viajes' ? '600' : 'normal',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            🧳 Gestionar Viajes
          </button>
          
          {/* Botón: Reservas */}
          <button 
            onClick={() => setCurrentView('reservas')} 
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '12px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: currentView === 'reservas' ? '#1e293b' : 'transparent',
              color: currentView === 'reservas' ? '#3b82f6' : '#94a3b8',
              fontSize: '15px',
              fontWeight: currentView === 'reservas' ? '600' : 'normal',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
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

// ─── Estilos del Layout Estáticos ─────────────────────────────────────────────
const layoutStyle: CSSProperties = { display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui, sans-serif' };
const sidebarStyle: CSSProperties = { width: '260px', backgroundColor: '#0f172a', color: '#ffffff', display: 'flex', flexDirection: 'column', padding: '24px 16px', borderRight: '1px solid #1e293b', position: 'fixed', height: '100vh', boxSizing: 'border-box' };
const logoContainerStyle: CSSProperties = { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px', padding: '0 8px' };
const logoEmojiStyle: CSSProperties = { fontSize: '24px' };
const logoTextStyle: CSSProperties = { fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#f8fafc' };
const badgeStyle: CSSProperties = { backgroundColor: '#3b82f6', color: '#ffffff', fontSize: '11px', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' };
const navStyle: CSSProperties = { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 };
const mainContentStyle: CSSProperties = { flex: 1, marginLeft: '260px', minHeight: '100vh', backgroundColor: '#f8fafc' };
const footerSidebarStyle: CSSProperties = { paddingTop: '16px', borderTop: '1px solid #1e293b', textAlign: 'center' };