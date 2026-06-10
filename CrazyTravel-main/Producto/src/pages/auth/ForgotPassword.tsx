import { useState } from 'react';
import type { FormEvent, CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // Nos aseguramos de mandarlo al callback híbrido que creamos
      redirectTo: `${window.location.origin}/auth/callback`,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setSuccessMsg('¡Enlace enviado! Revisa tu correo electrónico para restablecer tu acceso.');
    setEmail('');
  };

  return (
    <div>
      <h1 style={{ fontSize: '28px', marginBottom: '8px', color: '#0f172a' }}>Recuperar contraseña</h1>
      <p style={{ marginBottom: '24px', color: '#475569', fontSize: '15px', lineHeight: '1.5' }}>
        Ingresa tu correo y te enviaremos un enlace seguro para restablecer tu acceso a Crazy Travel.
      </p>

      <form onSubmit={handleReset} style={{ display: 'grid', gap: '16px' }}>
        <div>
          <label htmlFor="email" style={labelStyle}>Correo electrónico</label>
          <input
            id="email"
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        {/* Alertas */}
        {errorMsg && <div style={errorAlertStyle}>{errorMsg}</div>}
        {successMsg && <div style={successAlertStyle}>{successMsg}</div>}

        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? 'Enviando enlace...' : 'Enviar enlace'}
        </button>
      </form>

      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <Link to="/login" style={{ fontSize: '14px', color: '#0f172a', fontWeight: '600', textDecoration: 'none' }}>
          ← Volver al inicio de sesión
        </Link>
      </div>
    </div>
  );
}

// ─── Estilos en Línea ────────────────────────────────────────────────────────
const labelStyle: CSSProperties = { display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600', color: '#1e293b' };
const inputStyle: CSSProperties = { width: '100%', padding: '14px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box', fontSize: '15px', transition: 'border-color 0.2s', backgroundColor: '#fff' };
const buttonStyle: CSSProperties = { width: '100%', padding: '14px', borderRadius: '10px', border: 'none', background: '#0f172a', color: '#fff', cursor: 'pointer', fontWeight: '600', fontSize: '15px', transition: 'background-color 0.2s' };
const errorAlertStyle: CSSProperties = { padding: '12px', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', color: '#dc2626', fontSize: '14px' };
const successAlertStyle: CSSProperties = { padding: '12px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', color: '#16a34a', fontSize: '14px' };