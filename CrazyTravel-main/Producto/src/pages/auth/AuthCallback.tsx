import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const processAuth = async () => {
      // 1. Extraemos el hash de la URL para saber de qué tipo de correo viene
      const hash = window.location.hash;
      const isRecovery = hash.includes('type=recovery');

      // 2. Revisamos si Supabase ya levantó la sesión
      const { data } = await supabase.auth.getSession();

      if (!mounted) return;

      if (data.session) {
        // 🔴 LA MAGIA AQUÍ: Diferenciamos el destino según el tipo de enlace
        if (isRecovery) {
          navigate('/update-password', { replace: true });
        } else {
          // Si NO es recuperación (ej: confirmación de cuenta nueva), va al Inicio
          navigate('/', { replace: true });
        }
      } else {
        navigate('/login', { replace: true });
      }
    };

    processAuth();

    // Escuchador de eventos por si la sesión tarda unos milisegundos más en armarse
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      const isRecovery = window.location.hash.includes('type=recovery');

      if (event === 'PASSWORD_RECOVERY') {
        navigate('/update-password', { replace: true });
      } else if (event === 'SIGNED_IN' && session) {
        if (isRecovery) {
          navigate('/update-password', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ color: '#0f172a', marginBottom: '8px', fontFamily: 'system-ui, sans-serif' }}>✈️ Crazy Travel</h2>
        <p style={{ color: '#64748b', fontSize: '16px', fontFamily: 'system-ui, sans-serif' }}>Autenticando de forma segura...</p>
      </div>
    </div>
  );
}