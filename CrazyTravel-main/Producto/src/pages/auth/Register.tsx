import { useState } from 'react';
import type { FormEvent, CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

// ─── Validación de contraseña segura ────────────────────────────────────────
function getPasswordStrength(pwd: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  if (score <= 2) return { score, label: 'Débil', color: '#ef4444' };
  if (score === 3 || score === 4) return { score, label: 'Aceptable', color: '#eab308' };
  return { score, label: 'Fuerte', color: '#22c55e' };
}

function validatePassword(pwd: string): string | null {
  if (pwd.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
  if (!/[a-z]/.test(pwd)) return 'Debe incluir al menos una letra minúscula.'; 
  if (!/[A-Z]/.test(pwd)) return 'Debe incluir al menos una letra mayúscula.';
  if (!/[0-9]/.test(pwd)) return 'Debe incluir al menos un número.';
  if (!/[^A-Za-z0-9]/.test(pwd)) return 'Debe incluir al menos un carácter especial (ej: @, #, !).';
  return null;
}

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

// ─── Componente Principal ────────────────────────────────────────────────────
export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const strength = password.length > 0 ? getPasswordStrength(password) : null;

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const pwdError = validatePassword(password);
    if (pwdError) {
      setErrorMsg(pwdError);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: '',
          marketing_opt_in: marketingOptIn,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    // 1. Manejo de errores reales de Supabase
    if (error) {
      setErrorMsg(error.message);
      return;
    }

    // 🔴 2. EL TRUCO SENIOR: Detectar el falso éxito de Supabase
    if (data?.user?.identities?.length === 0) {
      setErrorMsg('Este correo ya está registrado en Crazy Travel. Por favor, inicia sesión.');
      return;
    }

    // 3. Si pasamos lo anterior, es un registro exitoso de verdad
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setMarketingOptIn(false);
    
    // 🔴 CAMBIO 1: Mensaje actualizado e inteligente
    setSuccessMsg('¡Listo! Te hemos enviado (o reenviado) un enlace seguro. Revisa tu correo o carpeta de Spam para confirmar tu cuenta.');
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
        
        <h1 className="auth-title">Crear cuenta</h1>
        <p className="auth-subtitle">
          Únete a Crazy Travel y organiza tu próxima aventura.
        </p>

        <form onSubmit={handleRegister} style={{ display: 'grid', gap: '16px' }}>
          
          {/* Correo */}
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

          {/* Contraseña */}
          <div>
            <label htmlFor="password" className="form-label">Contraseña</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Mínimo 8 caracteres"
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

            {/* Barra de fortaleza */}
            {strength && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: '4px',
                        borderRadius: '4px',
                        background: i <= strength.score ? strength.color : '#e2e8f0',
                        transition: 'background 0.3s ease-in-out',
                      }}
                    />
                  ))}
                </div>
                <p style={{ fontSize: '12px', color: strength.color, margin: 0, fontWeight: '500' }}>
                  {strength.label}
                </p>
                {strength.score < 5 && (
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    Sugerencia: Usa minúsculas, mayúsculas, números y símbolos (@, #, !).
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label htmlFor="confirmPassword" className="form-label">Confirmar contraseña</label>
            <div style={{ position: 'relative' }}>
              <input
                id="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Repite tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="form-input"
                style={{ 
                  paddingRight: '44px',
                  borderColor: confirmPassword.length > 0 ? (confirmPassword === password ? '#22c55e' : '#ef4444') : undefined
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', padding: '4px' }}
                tabIndex={-1}
              >
                {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {confirmPassword.length > 0 && (
              <p style={{ fontSize: '12px', marginTop: '6px', color: confirmPassword === password ? '#22c55e' : '#ef4444', fontWeight: '500' }}>
                {confirmPassword === password ? '✓ Las contraseñas coinciden' : '✗ Las contraseñas no coinciden'}
              </p>
            )}
          </div>

          {/* Marketing opt-in */}
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', marginTop: '4px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <input
              type="checkbox"
              checked={marketingOptIn}
              onChange={(e) => setMarketingOptIn(e.target.checked)}
              style={{ marginTop: '2px', width: '16px', height: '16px', accentColor: '#0f766e' }}
            />
            <span style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5' }}>
              Quiero recibir ofertas exclusivas, novedades y próximos destinos de Crazy Travel.
            </span>
          </label>

          {/* Alertas */}
          {errorMsg && <div className="auth-error-alert">{errorMsg}</div>}
          {successMsg && <div style={successAlertStyle}>{successMsg}</div>}

          {/* Botón */}
          <button 
            type="submit" 
            disabled={loading || successMsg !== ''} 
            className="btn-auth-submit"
            style={{
              opacity: (loading || successMsg !== '') ? 0.7 : 1,
              cursor: (loading || successMsg !== '') ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Creando cuenta segura...' : 'Registrarme'}
          </button>
        </form>

        <div style={{ textAlign: 'center', margin: '24px 0', color: '#94a3b8', fontSize: '14px' }}>
          — O regístrate de forma rápida —
        </div>

        <button type="button" onClick={handleGoogleLogin} disabled={loading} className="btn-auth-google">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '20px', height: '20px' }} />
          Continuar con Google
        </button>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>
            ¿Ya tienes cuenta? <Link to="/login" className="auth-link" style={{ fontWeight: 'bold' }}>Inicia sesión aquí</Link>
          </p>
        </div>

      </div>
    </div>
  );
}

// Único estilo en línea necesario para la alerta de éxito
const successAlertStyle: CSSProperties = { padding: '12px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', color: '#16a34a', fontSize: '14px' };