import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { CSSProperties } from 'react';
import { supabase } from '../../lib/supabase'; // Asegúrate de que la ruta sea correcta

export default function Reserva() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [passengers, setPassengers] = useState(1);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Para evitar doble clic
  
  const [tour, setTour] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 1. Cargar el viaje al iniciar
  useEffect(() => {
    window.scrollTo(0, 0);

    async function fetchTour() {
      if (!id) return;
      const { data, error } = await supabase.from('tours').select('*').eq('id', id).single();
      if (!error && data) setTour(data);
      setLoading(false);
    }
    fetchTour();
  }, [id]);

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Cargando detalles de la reserva...</h2>;
  if (!tour) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Viaje no encontrado 😢</h2>;

  const total = (tour.precio || 0) * passengers;

  // 2. Procesar la reserva y enviarla a Supabase
  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      // Obtenemos al usuario conectado
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        alert("Debes iniciar sesión para poder reservar.");
        setIsSubmitting(false);
        return;
      }

      // Preparamos los datos exactamente como los pide tu tabla SQL
      const nuevaReserva = {
        perfil_id: session.user.id,
        tour_id: tour.id,
        cantidad_pasajeros: passengers,
        total_pagado: total,
        estado: 'pendiente'
      };

      // Insertamos en la base de datos
      const { error } = await supabase.from('reservas').insert([nuevaReserva]);

      if (error) {
        console.error("Error de Supabase:", error);
        // Si hay un error de llave foránea, es probable que el usuario no exista en la tabla 'perfiles'
        if (error.code === '23503') {
          alert("Error: Tu perfil de usuario está incompleto en la base de datos.");
        } else {
          alert("Hubo un problema al guardar la reserva. Revisa la consola.");
        }
        setIsSubmitting(false);
        return;
      }

      // ¡Éxito!
      setIsConfirmed(true);

    } catch (err) {
      console.error("Error inesperado:", err);
      alert("Ocurrió un error inesperado.");
      setIsSubmitting(false);
    }
  };

  // 🟢 PANTALLA DE ÉXITO
  if (isConfirmed) {
    return (
      <div style={containerStyle}>
        <div style={{ ...cardStyle, textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '60px', marginBottom: '16px' }}>🎉</div>
          <h2 style={{ fontSize: '32px', marginBottom: '16px', color: '#0f172a' }}>
            ¡Reserva Confirmada!
          </h2>
          <p style={{ fontSize: '18px', color: '#475569', marginBottom: '32px', lineHeight: '1.5' }}>
            Tu viaje a <strong>{tour.titulo}</strong> para {passengers} persona(s) ha sido registrado con éxito.
          </p>
          <button onClick={() => navigate('/viajes')} style={confirmButtonStyle}>
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  // 🔴 PANTALLA DE FORMULARIO
  return (
    <div style={containerStyle}>
      <button onClick={() => navigate(-1)} style={backButtonStyle}>
        ← Volver al detalle del viaje
      </button>

      <div style={cardStyle}>
        <h1 style={{ fontSize: '24px', marginBottom: '8px', color: '#0f172a' }}>Finaliza tu reserva</h1>
        <p style={{ color: '#64748b', marginBottom: '24px' }}>
          Estás reservando: <strong>{tour.titulo}</strong>
        </p>

        <div style={formSection}>
          <label style={labelStyle}>¿Cuántas personas viajan?</label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button onClick={() => setPassengers(Math.max(1, passengers - 1))} style={stepperButton}>-</button>
            <span style={{ fontSize: '18px', fontWeight: 'bold', width: '30px', textAlign: 'center' }}>{passengers}</span>
            <button 
              onClick={() => setPassengers(Math.min(tour.cupos_totales, passengers + 1))} 
              style={{ ...stepperButton, opacity: passengers >= tour.cupos_totales ? 0.5 : 1 }}
            >
              +
            </button>
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
            Cupos disponibles: {tour.cupos_totales}
          </p>
        </div>

        <hr style={dividerStyle} />

        <div style={totalSection}>
          <span style={{ fontSize: '18px', color: '#475569' }}>Total a pagar:</span>
          <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f766e' }}>
            ${total.toLocaleString('es-CL')}
          </span>
        </div>

        <button 
          style={{ ...confirmButtonStyle, opacity: isSubmitting ? 0.7 : 1 }} 
          onClick={handleConfirm}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Procesando...' : 'Confirmar Reserva'}
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