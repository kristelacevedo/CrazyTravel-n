import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        
        {/* LOGO */}
        <Link 
          to="/" 
          className="navbar-logo" 
          style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}
        >
          {/* Aquí aumentamos el tamaño cambiando el height a '65px' */}
          <img 
            src="/CrazyTravel logo.jpeg" 
            alt="Crazy Travel Logo" 
            style={{ height: '65px', width: 'auto', borderRadius: '8px' }} 
          />
          <span style={{ color: '#ffffff', fontSize: '1.2rem', fontWeight: 'bold' }}>
            Crazy Travel
          </span>
        </Link>

        {/* ENLACES Y MENÚ */}
        <nav className="nav-links">
          <Link to="/" className="nav-link">Inicio</Link>
          <Link to="/viajes" className="nav-link">Viajes</Link>
          <Link to="/quienes-somos" className="nav-link">Quiénes Somos</Link>

          {/* Lógica condicional: Si hay usuario, muestra avatar. Si no, muestra botón de Login */}
          {user ? (
            <div style={{ position: 'relative', marginLeft: '1rem' }}>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '4px' }}
              >
                <div style={{ width: '36px', height: '36px', backgroundColor: '#0f766e', color: '#ffffff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}>
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span style={{ color: '#ffffff', fontWeight: '600', fontSize: '15px' }}>
                  {user.email?.split('@')[0]}
                </span>
                <span style={{ fontSize: '10px', color: '#64748b' }}>▼</span>
              </button>

              {/* DROPDOWN MENU */}
              {isMenuOpen && (
                <div style={{ position: 'absolute', right: 0, top: '50px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', width: '180px', overflow: 'hidden', display: 'flex', flexDirection: 'column', zIndex: 100 }}>
                  
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
                    <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Conectado como:</p>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user.email}
                    </p>
                  </div>

                  <Link 
                    to="/perfil" 
                    style={{ padding: '12px 16px', textDecoration: 'none', color: '#475569', fontSize: '14px', fontWeight: '500', transition: 'background-color 0.2s' }} 
                    onClick={() => setIsMenuOpen(false)}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    👤 Mi Perfil
                  </Link>
                  
                  <button 
                    onClick={handleLogout} 
                    style={{ padding: '12px 16px', color: '#dc2626', fontSize: '14px', fontWeight: '500', background: 'none', border: 'none', borderTop: '1px solid #f1f5f9', cursor: 'pointer', textAlign: 'left', transition: 'background-color 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    🚪 Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="nav-btn" style={{ marginLeft: '1rem' }}>
              Iniciar Sesión
            </Link>
          )}
        </nav>
        
      </div>
    </header>
  );
}