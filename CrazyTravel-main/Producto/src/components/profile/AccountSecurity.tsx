import { useState } from 'react';
import type { FormEvent, CSSProperties } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AccountSecurity() {
  const { user } = useAuth();
  
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountLoading, setAccountLoading] = useState(false);
  const [accountMsg, setAccountMsg] = useState({ type: '', text: '' });

  const handleUpdateEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAccountMsg({ type: '', text: '' });
    setAccountLoading(true);
    setTimeout(() => {
      setAccountLoading(false);
      setAccountMsg({ type: 'success', text: 'Te enviamos un enlace de confirmación al nuevo correo. Revisa tu bandeja de entrada.' });
      setNewEmail('');
    }, 1500);
  };

  const handleUpdatePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAccountMsg({ type: '', text: '' });

    if (newPassword !== confirmPassword) {
      return setAccountMsg({ type: 'error', text: 'Las contraseñas no coinciden.' });
    }
    if (newPassword.length < 8) {
      return setAccountMsg({ type: 'error', text: 'La contraseña debe tener al menos 8 caracteres.' });
    }

    setAccountLoading(true);
    setTimeout(() => {
      setAccountLoading(false);
      setAccountMsg({ type: 'success', text: '¡Tu contraseña ha sido actualizada exitosamente!' });
      setNewPassword('');
      setConfirmPassword('');
    }, 1500);
  };

  return (
    <div>
      <h2 style={sectionTitleStyle}>Cuenta y Seguridad</h2>
      <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '32px' }}>
        Administra tus credenciales de acceso a la plataforma.
      </p>

      {accountMsg.text && (
        <div style={{ marginBottom: '20px', ...(accountMsg.type === 'success' ? successAlertStyle : errorAlertStyle) }}>
          {accountMsg.text}
        </div>
      )}

      {/* Formulario 1: Cambiar Correo */}
      <div style={cardBoxStyle}>
        <h3 style={{ fontSize: '18px', color: '#0f172a', marginBottom: '16px' }}>Cambiar Correo Electrónico</h3>
        <form onSubmit={handleUpdateEmail} style={{ display: 'grid', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Correo Actual</label>
            <input type="email" value={user?.email || ''} disabled style={{ ...inputStyle, backgroundColor: '#f1f5f9', color: '#94a3b8', cursor: 'not-allowed' }} />
          </div>
          <div>
            <label htmlFor="newEmail" style={labelStyle}>Nuevo Correo Electrónico</label>
            <input id="newEmail" type="email" placeholder="Ingresa tu nuevo correo" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required style={inputStyle} />
          </div>
          <button type="submit" disabled={accountLoading} style={{ ...buttonStyle, width: 'auto', justifySelf: 'start' }}>
            {accountLoading ? 'Procesando...' : 'Actualizar Correo'}
          </button>
        </form>
      </div>

      <hr style={dividerStyle} />

      {/* Formulario 2: Cambiar Contraseña */}
      <div style={cardBoxStyle}>
        <h3 style={{ fontSize: '18px', color: '#0f172a', marginBottom: '16px' }}>Cambiar Contraseña</h3>
        <form onSubmit={handleUpdatePassword} style={{ display: 'grid', gap: '16px' }}>
          <div style={twoColGrid}>
            <div>
              <label htmlFor="newPassword" style={labelStyle}>Nueva Contraseña</label>
              <input id="newPassword" type="password" placeholder="Mínimo 8 caracteres" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required style={inputStyle} />
            </div>
            <div>
              <label htmlFor="confirmPassword" style={labelStyle}>Confirmar Contraseña</label>
              <input id="confirmPassword" type="password" placeholder="Repite la contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required style={inputStyle} />
            </div>
          </div>
          <button type="submit" disabled={accountLoading} style={{ ...buttonStyle, width: 'auto', justifySelf: 'start' }}>
            {accountLoading ? 'Procesando...' : 'Actualizar Contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
}

const sectionTitleStyle: CSSProperties = { fontSize: '24px', color: '#0f172a', marginBottom: '24px', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' };
const cardBoxStyle: CSSProperties = { backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' };
const dividerStyle: CSSProperties = { border: 'none', borderTop: '1px solid #e2e8f0', margin: '32px 0' };
const twoColGrid: CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' };
const labelStyle: CSSProperties = { display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600', color: '#1e293b' };
const inputStyle: CSSProperties = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box', fontSize: '15px', backgroundColor: '#fff', color: '#0f172a' };
const buttonStyle: CSSProperties = { padding: '14px 24px', borderRadius: '8px', border: 'none', background: '#0f766e', color: '#fff', cursor: 'pointer', fontWeight: '600', fontSize: '15px', transition: 'background-color 0.2s' };
const successAlertStyle: CSSProperties = { padding: '12px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', color: '#16a34a', fontSize: '14px' };
const errorAlertStyle: CSSProperties = { padding: '12px', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', color: '#dc2626', fontSize: '14px' };