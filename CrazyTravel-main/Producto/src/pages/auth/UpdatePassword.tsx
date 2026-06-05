import { useState, useEffect } from 'react';
import type { FormEvent, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
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

export default function UpdatePassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [ready, setReady] = useState(false);

  const strength = password.length > 0 ? getPasswordStrength(password) : null;

  useEffect(() => {
    let mounted = true;
    const checkRecoverySession = async () => {
      for (let i = 0; i < 10; i++) {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          if (mounted) setReady(true);
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
      if (mounted) {
        navigate('/login', { replace: true });
      }
    };
    checkRecoverySession();
    return () => { mounted = false; };
  }, [navigate]);

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // 1. Validación estricta del Frontend
    const pwdError = validatePassword(password);
    if (pwdError) {
      setErrorMsg(pwdError);
      return;
    }

    if (password !== confirm) {
      setErrorMsg('Las contraseñas no coinciden.');
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      setErrorMsg('Tu enlace de recuperación ya no es válido. Solicita uno nuevo.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    // 2. Interceptar errores técnicos de Supabase
    if (error) {
      if (error.message.includes('Password should contain')) {
        setErrorMsg('La contraseña no cumple con la seguridad mínima (requiere minúsculas, mayúsculas, números y un símbolo).');
      } else {
        setErrorMsg(error.message);
      }
      return;
    }

    setSuccessMsg('¡Contraseña actualizada correctamente!');
    
    // 3. Flujo moderno: vamos al inicio de sesión para que el usuario pruebe su clave
    setTimeout(async () => {
      await supabase.auth.signOut();
      navigate('/login', { replace: true });
    }, 2000);
  };

  if (!ready) {
    return (
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '18px', color: '#64748b' }}>⏳ Verificando enlace seguro...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: '28px', marginBottom: '8px', color: '#0f172a' }}>Nueva contraseña</h1>
      <p style={{ marginBottom: '24px', color: '#475569', lineHeight: '1.5' }}>
        Crea una nueva clave de acceso segura para Crazy Travel.
      </p>

      <form onSubmit={handleUpdate} style={{ display: 'grid', gap: '16px' }}>
        {/* Contraseña */}
        <div>
          <label htmlFor="password" style={labelStyle}>Nueva contraseña</label>
          <div style={inputWrapperStyle}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ ...inputStyle, paddingRight: '44px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={eyeButtonStyle}
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
                  Asegúrate de incluir: minúsculas, mayúsculas, números y símbolos (@, #, !).
                </p>
              )}
            </div>
          )}
        </div>

        {/* Confirmar Contraseña */}
        <div>
          <label htmlFor="confirm" style={labelStyle}>Confirmar contraseña</label>
          <div style={inputWrapperStyle}>
            <input
              id="confirm"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Repite tu contraseña"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              style={{ ...inputStyle, paddingRight: '44px', borderColor: confirm.length > 0 ? (confirm === password ? '#22c55e' : '#ef4444') : '#cbd5e1' }}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              style={eyeButtonStyle}
              tabIndex={-1}
            >
              {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          {confirm.length > 0 && (
            <p style={{ fontSize: '12px', marginTop: '6px', color: confirm === password ? '#22c55e' : '#ef4444', fontWeight: '500' }}>
              {confirm === password ? '✓ Las contraseñas coinciden' : '✗ Las contraseñas no coinciden'}
            </p>
          )}
        </div>

        {/* Alertas */}
        {errorMsg && <div style={errorAlertStyle}>{errorMsg}</div>}
        {successMsg && <div style={successAlertStyle}>{successMsg}</div>}

        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? 'Actualizando...' : 'Actualizar contraseña'}
        </button>
      </form>
    </div>
  );
}

// ─── Estilos en Línea ────────────────────────────────────────────────────────
const labelStyle: CSSProperties = { display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600', color: '#1e293b' };
const inputWrapperStyle: CSSProperties = { position: 'relative' };
const inputStyle: CSSProperties = { width: '100%', padding: '14px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box', fontSize: '15px', transition: 'border-color 0.2s', backgroundColor: '#fff' };
const eyeButtonStyle: CSSProperties = { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', padding: '4px' };
const buttonStyle: CSSProperties = { width: '100%', padding: '14px', borderRadius: '10px', border: 'none', background: '#0f172a', color: '#fff', cursor: 'pointer', fontWeight: '600', fontSize: '15px', transition: 'background-color 0.2s' };
const errorAlertStyle: CSSProperties = { padding: '12px', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', color: '#dc2626', fontSize: '14px' };
const successAlertStyle: CSSProperties = { padding: '12px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', color: '#16a34a', fontSize: '14px' };