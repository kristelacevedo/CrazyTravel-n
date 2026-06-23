import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { CSSProperties } from 'react';
import { supabase } from '../../lib/supabase';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function Reserva() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [passengers, setPassengers] = useState(1);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'PayPal' | 'Presencial' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [tour, setTour] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const initialOptions = {
    clientId: "AdAhWDos0pS740tzulwOf-eqhX8wSs-4HcMLKuNaJQUEBZb62SUp5Bzqj_rRP36wdgTsSLTVLIHv_v2q",
    currency: "USD",
    intent: "capture",
  };

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

  const totalCLP = (tour.precio || 0) * passengers;
  const totalUSD = (totalCLP / 900).toFixed(2);

  // Función genérica para guardar la reserva en Supabase
  const guardarReserva = async (estadoPago: 'Pagado' | 'Pendiente') => {
    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        alert("Debes iniciar sesión para poder reservar.");
        setIsSubmitting(false);
        return;
      }

      const nuevaReserva = {
        perfil_id: session.user.id,
        tour_id: tour.id,
        cantidad_pasajeros: passengers,
        total_pagado: totalCLP,
        estado: estadoPago // 'Pagado' (PayPal) o 'Pendiente' (Reservar ahora)
      };

      const { error } = await supabase.from('reservas').insert([nuevaReserva]);

      if (error) {
        console.error("Error en Supabase:", error);
        alert("Hubo un problema al guardar la reserva.");
        setIsSubmitting(false);
        return;
      }

      setPaymentMethod(estadoPago === 'Pagado' ? 'PayPal' : 'Presencial');
      setIsConfirmed(true);

    } catch (err) {
      console.error("Error inesperado:", err);
      setIsSubmitting(false);
    }
  };

  // 🟢 PANTALLA DE ÉXITO (Cambia el mensaje según cómo eligió procesarlo)
  if (isConfirmed) {
    return (
      <div style={containerStyle}>
        <div style={{ 
          ...cardStyle, 
          textAlign: 'center', 
          padding: '60px 20px', 
          backgroundColor: paymentMethod === 'PayPal' ? '#f0fdf4' : '#fefce8', 
          borderColor: paymentMethod === 'PayPal' ? '#bbf7d0' : '#fef08a' 
        }}>
          <div style={{ fontSize: '60px', marginBottom: '16px' }}>
            {paymentMethod === 'PayPal' ? '✅' : '📅'}
          </div>
          <h2 style={{ fontSize: '28px', marginBottom: '16px', color: paymentMethod === 'PayPal' ? '#166534' : '#854d0e' }}>
            {paymentMethod === 'PayPal' ? '¡Pago y Reserva Confirmados!' : '¡Reserva Registrada con Éxito!'}
          </h2>
          <p style={{ fontSize: '16px', color: paymentMethod === 'PayPal' ? '#15803d' : '#a16207', marginBottom: '32px', lineHeight: '1.5' }}>
            {paymentMethod === 'PayPal' 
              ? `Tu viaje a ${tour.titulo} para ${passengers} persona(s) ha sido pagado y reservado.`
              : `Tu cupo para ${tour.titulo} (${passengers} pers.) está asegurado. Recuerda realizar el pago correspondiente antes del viaje.`
            }
          </p>
          <button 
            onClick={() => navigate('/viajes')} 
            style={{...confirmButtonStyle, backgroundColor: paymentMethod === 'PayPal' ? '#16a34a' : '#ca8a04'}}
          >
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  // 🟡 VISTA DEL FORMULARIO CON LAS DOS OPCIONES
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
          <span style={{ fontSize: '13px', color: '#64748b', display: 'block', marginTop: '6px' }}>
            Cupos disponibles: {tour.cupos_totales}
          </span>
        </div>

        <hr style={dividerStyle} />

        <div style={totalSection}>
          <span style={{ fontSize: '18px', color: '#475569' }}>Total a pagar:</span>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f766e' }}>
              ${totalCLP.toLocaleString('es-CL')} CLP
            </div>
            <div style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
              Equivalente a ${totalUSD} USD
            </div>
          </div>
        </div>

        {/* OPCIÓN 1: BOTÓN TRADICIONAL PARA RESERVAR Y PAGAR DESPUÉS */}
        <button 
          onClick={() => guardarReserva('Pendiente')}
          disabled={isSubmitting}
          style={{ ...confirmButtonStyle, marginBottom: '16px' }}
        >
          {isSubmitting ? 'Procesando...' : 'Confirmar Reserva (Pagar después)'}
        </button>

        <div style={{ textAlign: 'center', margin: '16px 0', color: '#64748b', fontSize: '14px', fontWeight: '500' }}>
          — O PAGA AHORA AL INSTANTE —
        </div>

        {/* OPCIÓN 2: BOTONES DE PAYPAL */}
        <div style={{ pointerEvents: isSubmitting ? 'none' : 'auto', opacity: isSubmitting ? 0.5 : 1 }}>
          <PayPalScriptProvider options={initialOptions}>
            <PayPalButtons 
              style={{ layout: "vertical", shape: "rect", color: "gold" }}
              createOrder={(data: any, actions: any) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      description: `Reserva online: ${tour.titulo}`,
                      amount: {
                        currency_code: "USD",
                        value: totalUSD, 
                      },
                    },
                  ],
                });
              }}
              onApprove={async (data: any, actions: any) => {
                if (actions.order) {
                  await actions.order.capture();
                  await guardarReserva('Pagado');
                }
              }}
              onError={(err: any) => {
                console.error("Error PayPal:", err);
                alert("Hubo un error con el pago.");
              }}
            />
          </PayPalScriptProvider>
        </div>

      </div>
    </div>
  );
}

// Estilos
const containerStyle: CSSProperties = { maxWidth: '600px', margin: '40px auto', padding: '0 20px', fontFamily: 'system-ui, sans-serif' };
const backButtonStyle: CSSProperties = { background: 'none', border: 'none', color: '#0f766e', fontWeight: '600', cursor: 'pointer', padding: '0 0 20px 0', fontSize: '15px' };
const cardStyle: CSSProperties = { backgroundColor: '#ffffff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' };
const formSection: CSSProperties = { marginBottom: '24px' };
const labelStyle: CSSProperties = { display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#334155', marginBottom: '12px' };
const stepperButton: CSSProperties = { width: '40px', height: '40px', fontSize: '20px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', color: '#0f172a' };
const dividerStyle: CSSProperties = { border: 'none', borderTop: '1px solid #e2e8f0', margin: '24px 0' };
const totalSection: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' };
const confirmButtonStyle: CSSProperties = { width: '100%', padding: '16px', backgroundColor: '#1e293b', color: '#ffffff', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' };