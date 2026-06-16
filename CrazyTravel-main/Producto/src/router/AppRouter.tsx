import { Navigate, Route, Routes } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { AdminDashboard } from '../pages/admin/AdminDashboard';

// ─── Layouts ─────────────────────────────────────────────────────────────────
import AuthLayout from '../layouts/AuthLayout';
import ClientLayout from '../layouts/ClientLayout';

// ─── Páginas ─────────────────────────────────────────────────────────────────
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import UpdatePassword from '../pages/auth/UpdatePassword';
import AuthCallback from '../pages/auth/AuthCallback';

import Home from '../pages/client/Home'; 
import Viajes from '../pages/client/Viajes';
import TourDetail from '../pages/client/TourDetail';
import Profile from '../pages/client/Profile'; 
import About from '../pages/client/About';     
import Reserva from '../pages/client/Reserva';

// ─── Guardianes de Ruta ──────────────────────────────────────────────────────
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading, profileLoading } = useAuth();

  if (loading || profileLoading) {
    return (
      <p style={{ padding: '40px', textAlign: 'center', fontSize: '18px' }}>
        ⏳ Cargando sesión de Crazy Travel...
      </p>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { user, loading, profileLoading } = useAuth();

  if (loading || profileLoading) {
    return <p style={{ padding: '40px', textAlign: 'center' }}>Cargando...</p>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// ─── Enrutador Principal ─────────────────────────────────────────────────────
export default function AppRouter() {
  return (
    <Routes>
      
      {/* 🟢 ZONA PROTEGIDA CLIENTES (Layout Principal con Navbar de Cliente) */}
      <Route
        element={
          <ProtectedRoute>
            <ClientLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/viajes" element={<Viajes />} />
        <Route path="/tour/:id" element={<TourDetail />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/quienes-somos" element={<About />} />
        <Route path="/reservar/:id" element={<Reserva />} />
      </Route>

      {/* 👑 ZONA PROTEGIDA ADMINISTRADOR (Independiente y sin Navbar de Cliente) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* 🔵 ZONA PÚBLICA (Formularios de Autenticación) */}
      <Route
        element={
          <PublicOnlyRoute>
            <AuthLayout />
          </PublicOnlyRoute>
        }
      >
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* 🟠 ZONA HÍBRIDA (Recuperación de Contraseña) */}
      <Route element={<AuthLayout />}>
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/update-password" element={<UpdatePassword />} />
      </Route>

      {/* RUTAS NO ENCONTRADAS (Redirigen al inicio) */}
      <Route path="*" element={<Navigate to="/" replace />} />
      
    </Routes>
  );
}