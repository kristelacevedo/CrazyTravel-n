import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

export default function ClientLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1. La barra de navegación siempre arriba */}
      <Navbar />

      {/* 2. El contenido de la página irá aquí adentro */}
      <main style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>

      {/* 3. Footer Premium incrustado directamente aquí */}
      <footer className="footer-premium">
        <div className="footer-grid">
          
          {/* Columna 1: Info de la empresa */}
          <div>
            <h3 className="footer-title">✈️ Crazy Travel</h3>
            <p className="footer-text">
              Transformando sueños en destinos. Somos tu agencia de confianza para descubrir los rincones más increíbles del planeta.
            </p>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div>
            <h3 className="footer-title">Enlaces Rápidos</h3>
            <ul className="footer-links">
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/viajes">Catálogo de Viajes</Link></li>
              <li><Link to="/quienes-somos">Quiénes Somos</Link></li>
            </ul>
          </div>

          {/* Columna 3: Soporte */}
          <div>
            <h3 className="footer-title">Soporte</h3>
            <ul className="footer-links">
              <li><a href="#">Preguntas Frecuentes</a></li>
              <li><a href="#">Términos y Condiciones</a></li>
              <li><a href="#">Política de Privacidad</a></li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h3 className="footer-title">Contacto</h3>
            <ul className="footer-links">
              <li>📍 Santiago, Chile</li>
              <li>📧 hola@crazytravel.com</li>
              <li>📱 +56 9 30109933</li>
            </ul>
          </div>

        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} Crazy Travel Agencia de Viajes. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}