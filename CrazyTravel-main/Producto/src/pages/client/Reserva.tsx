import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { CSSProperties } from 'react';

// Traemos los mismos datos
const MOCK_TOURS = [
  { id: '1', title: 'Aventura Mágica en Chiloé', price: 350000 },
  { id: '2', title: 'Vacaciones de Ensueño en Búzios', price: 850000 }
];

export default function Reserva() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 1. Estados de la página
  const [passengers, setPassengers] = useState(1);
  const [isConfirmed, setIsConfirmed] = useState(false); // 🔴 ¡Nuestro nuevo interruptor!

  // Buscamos el viaje
  const tour = MOCK_TOURS.find((t) => t.id === id);

  // Que la página inicie arriba
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!tour) {
    return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Viaje no encontrado</h2>;
  }

  const total = tour.price * passengers;

  // 2. Función que se ejecuta al hacer clic en Confirmar
  const handleConfirm = () => {
    // En el futuro, aquí enviaremos los datos a Supabase.
    // Por ahora, solo encendemos el mensaje de éxito.
    setIsConfirmed(true);
  };

  // 3. 🟢 SI LA RESERVA ESTÁ CONFIRMADA: Mostramos esta pantalla de éxito
  if (isConfirmed) {
    return (
      <div style={containerStyle}>
        <div style={{ ...cardStyle, textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '60px', marginBottom: '16px' }}>🎉</div>
          <h2 style={{ fontSize: '32px', marginBottom: '16px', color: '#0f172a' }}>
            ¡Reserva Confirmada!
          </h2>
          <p style={{ fontSize: '18px', color: '#475569', marginBottom: '32px', lineHeight: '1.5' }}>
            Tu viaje a <strong>{tour.title}</strong> para {passengers} persona(s) ha sido registrado con éxito. Te hemos enviado un correo con los detalles para el pago.
          </p>
          <button onClick={() => navigate('/perfil')} style={confirmButtonStyle}>
            Ir a mi Perfil
          </button>
        </div>
      </div>
    );
  }

  // 🔴 SI NO ESTÁ CONFIRMADA: Mostramos el formulario normal
  return (
    <div style={containerStyle}>
      <button onClick={() => navigate(-1)} style={backButtonStyle}>
        ← Volver al detalle del viaje
      </button>

      <div style={cardStyle}>
        <h1 style={{ fontSize: '24px', marginBottom: '8px', color: '#0f172a' }}>
          Finaliza tu reserva
        </h1>
        <p style={{ color: '#64748b', marginBottom: '24px' }}>
          Estás reservando: <strong>{tour.title}</strong>
        </p>

        <div style={formSection}>
          <label style={labelStyle}>¿Cuántas personas viajan?</label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button onClick={() => setPassengers(Math.max(1, passengers - 1))} style={stepperButton}>-</button>
            <span style={{ fontSize: '18px', fontWeight: 'bold', width: '30px', textAlign: 'center' }}>{passengers}</span>
            <button onClick={() => setPassengers(passengers + 1)} style={stepperButton}>+</button>
          </div>
        </div>

        <hr style={dividerStyle} />

        <div style={totalSection}>
          <span style={{ fontSize: '18px', color: '#475569' }}>Total a pagar:</span>
          <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f766e' }}>
            ${total.toLocaleString('es-CL')}
          </span>
        </div>

        {/* Le agregamos el onClick a nuestro botón */}
        <button style={confirmButtonStyle} onClick={handleConfirm}>
          Confirmar Reserva
        </button>
      </div>
    </div>
  );
}

// ─── Estilos ────────────────────────────────────────────────────────
const containerStyle: CSSProperties = { maxWidth: '600px', margin: '40px auto', padding: '0 20px' };
const backButtonStyle: CSSProperties = { background: 'none', border: 'none', color: '#0f766e', fontWeight: '600', cursor: 'pointer', padding: '0 0 20px 0', fontSize: '15px' };
const cardStyle: CSSProperties = { backgroundColor: '#ffffff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' };
const formSection: CSSProperties = { marginBottom: '24px' };
const labelStyle: CSSProperties = { display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#334155', marginBottom: '12px' };
const stepperButton: CSSProperties = { width: '40px', height: '40px', fontSize: '20px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', color: '#0f172a' };
const dividerStyle: CSSProperties = { border: 'none', borderTop: '1px solid #e2e8f0', margin: '24px 0' };
const totalSection: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' };
const confirmButtonStyle: CSSProperties = { width: '100%', padding: '16px', backgroundColor: '#0f172a', color: '#ffffff', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', transition: 'transform 0.1s' };