import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

// ─── Iconos SVG para el Ojo ──────────────────────────────────────────────────
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      // 🔴 Diferenciamos si el error es por falta de confirmación
      if (error.message.includes('Email not confirmed') || error.message.includes('confirm')) {
        setErrorMsg('Debes confirmar tu correo antes de iniciar sesión. Por favor, revisa tu bandeja de entrada o spam.');
      } else {
        setErrorMsg('Correo o contraseña incorrectos.');
      }
      return;
    }

    navigate('/');
  };

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    }
  };

  // 🔴 AQUÍ VA EL CAMBIO: El contenedor principal con el fondo de la pantalla
  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        
        <h1 className="auth-title">Iniciar sesión</h1>
        <p className="auth-subtitle">
          Accede a tu cuenta de Crazy Travel
        </p>

        <form onSubmit={handleLogin} style={{ display: 'grid', gap: '16px' }}>
          <div>
            <label htmlFor="email" className="form-label">Correo electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="password" className="form-label">Contraseña</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
                style={{ paddingRight: '44px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', padding: '4px' }}
                tabIndex={-1}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'right', marginTop: '-8px' }}>
            <Link to="/forgot-password" className="auth-link" style={{ fontSize: '13px' }}>
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {errorMsg && <div className="auth-error-alert">{errorMsg}</div>}

          <button type="submit" disabled={loading} className="btn-auth-submit">
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div style={{ textAlign: 'center', margin: '24px 0', color: '#94a3b8', fontSize: '14px' }}>
          — O ingresa con —
        </div>

        <button type="button" onClick={handleGoogleLogin} disabled={loading} className="btn-auth-google">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google logo" style={{ width: '20px', height: '20px' }} />
          Continuar con Google
        </button>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>
            ¿No tienes cuenta? <Link to="/register" className="auth-link" style={{ fontWeight: 'bold' }}>Regístrate aquí</Link>
          </p>
        </div>

      </div>
    </div>
  );
}