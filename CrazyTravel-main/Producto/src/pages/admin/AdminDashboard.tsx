import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'tours' | 'users' | 'config'>('metrics');
  const [users, setUsers] = useState<any[]>([]);
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para el Modal de agregar/editar Tours
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<any>(null);
  const [tourForm, setTourForm] = useState({ name: '', price: '', description: '' });

  useEffect(() => {
    fetchAdminData();
  }, []);

  // 1. CARGAR DATOS (Monitoreo y Listas)
  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const { data: usersData } = await supabase.from('perfiles').select('*').order('email');
      const { data: toursData } = await supabase.from('tours').select('*').order('created_at');
      
      if (usersData) setUsers(usersData);
      if (toursData) setTours(toursData);
    } catch (error) {
      console.error("Error cargando el panel:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. CONTROL DE USUARIOS: Cambiar Rol (Admin <-> Client)
  const handleToggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'client' : 'admin';
    const { error } = await supabase
      .from('perfiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (!error) {
      alert('¡Rol actualizado con éxito!');
      fetchAdminData(); // Recargar tabla
    } else {
      alert('Error al actualizar el rol');
    }
  };

  // 3. GESTIÓN DE CONTENIDO: Borrar Tour
  const handleDeleteTour = async (tourId: string) => {
    if (window.confirm('¿Estás segura de que deseas eliminar este tour?')) {
      const { error } = await supabase.from('tours').delete().eq('id', tourId);
      if (!error) {
        alert('Tour eliminado de forma segura.');
        fetchAdminData();
      }
    }
  };

  // 4. GESTIÓN DE CONTENIDO: Guardar o Editar Tour
  const handleSaveTour = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTour) {
      // Modo Editar
      const { error } = await supabase
        .from('tours')
        .update({ name: tourForm.name, price: Number(tourForm.price) })
        .eq('id', editingTour.id);
      if (!error) alert('Tour actualizado con éxito');
    } else {
      // Modo Crear Nuevo
      const { error } = await supabase
        .from('tours')
        .insert([{ name: tourForm.name, price: Number(tourForm.price) }]);
      if (!error) alert('¡Nuevo tour publicado con éxito!');
    }
    setIsModalOpen(false);
    setEditingTour(null);
    setTourForm({ name: '', price: '', description: '' });
    fetchAdminData();
  };

  const openEditModal = (tour: any) => {
    setEditingTour(tour);
    setTourForm({ name: tour.name, price: tour.price, description: '' });
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8fafc', fontFamily: 'sans-serif' }}>
        <p style={{ fontSize: '18px', color: '#64748b', fontWeight: '500' }}>Cargando Panel de Administración...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9', fontFamily: '"Segoe UI", Roboto, sans-serif' }}>
      
      {/* MENÚ LATERAL PREMIUM */}
      <div style={{ width: '280px', backgroundColor: '#0f172a', color: '#f8fafc', padding: '30px 20px', display: 'flex', flexDirection: 'column', boxShadow: '4px 0 10px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '35px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, letterSpacing: '0.5px' }}>Crazy Travel Pro</h2>
        </div>
        
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <li style={{ padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', transition: '0.2s', backgroundColor: activeTab === 'metrics' ? '#1e293b' : 'transparent', color: activeTab === 'metrics' ? '#3b82f6' : '#94a3b8', fontWeight: '500' }} onClick={() => setActiveTab('metrics')}>📈 Monitoreo y Métricas</li>
          <li style={{ padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', transition: '0.2s', backgroundColor: activeTab === 'tours' ? '#1e293b' : 'transparent', color: activeTab === 'tours' ? '#3b82f6' : '#94a3b8', fontWeight: '500' }} onClick={() => setActiveTab('tours')}>🌍 Gestión de Tours</li>
          <li style={{ padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', transition: '0.2s', backgroundColor: activeTab === 'users' ? '#1e293b' : 'transparent', color: activeTab === 'users' ? '#3b82f6' : '#94a3b8', fontWeight: '500' }} onClick={() => setActiveTab('users')}>👥 Control de Usuarios</li>
          <li style={{ padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', transition: '0.2s', backgroundColor: activeTab === 'config' ? '#1e293b' : 'transparent', color: activeTab === 'config' ? '#3b82f6' : '#94a3b8', fontWeight: '500' }} onClick={() => setActiveTab('config')}>⚙️ Configuración del Sistema</li>
        </ul>
      </div>

      {/* ÁREA DE CONTENIDO */}
      <div style={{ flex: 1, padding: '40px 50px', overflowY: 'auto' }}>
        
        {/* TAB 1: MONITOREO Y MÉTRICAS */}
        {activeTab === 'metrics' && (
          <div>
            <h1 style={{ fontSize: '26px', color: '#1e293b', marginBottom: '8px', fontWeight: '700' }}>Panel de Control</h1>
            <p style={{ color: '#64748b', margin: '0 0 30px 0' }}>Estadísticas de rendimiento del sistema en tiempo real.</p>
            <div style={{ display: 'flex', gap: '25px' }}>
              <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', flex: 1 }}>
                <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Clientes Registrados</span>
                <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#0f172a', margin: '10px 0 0 0' }}>{users.length}</p>
              </div>
              <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', flex: 1 }}>
                <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Tours Activos en Catálogo</span>
                <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#10b981', margin: '10px 0 0 0' }}>{tours.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GESTIÓN DE TOURS */}
        {activeTab === 'tours' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', justifyContent: 'space-between' }}>
              <div>
                <h1 style={{ fontSize: '26px', color: '#1e293b', margin: 0, fontWeight: '700' }}>Gestión de Contenido</h1>
                <p style={{ color: '#64748b', margin: '5px 0 0 0' }}>Publica, modifica o elimina productos turísticos.</p>
              </div>
              <button onClick={() => { setEditingTour(null); setTourForm({ name: '', price: '', description: '' }); setIsModalOpen(true); }} style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)' }}>
                + Crear Nuevo Tour
              </button>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: '600' }}>Destino / Tour</th>
                    <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: '600' }}>Precio Base</th>
                    <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: '600', textAlign: 'right' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {tours.map((tour) => (
                    <tr key={tour.id} style={{ borderBottom: '1px solid #f1f5f9', transition: '0.2s' }}>
                      <td style={{ padding: '16px 24px', fontWeight: '600', color: '#1e293b' }}>{tour.name}</td>
                      <td style={{ padding: '16px 24px', color: '#475569' }}>${tour.price.toLocaleString('es-CL')}</td>
                      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                        <button onClick={() => openEditModal(tour)} style={{ color: '#3b82f6', background: 'none', border: 'none', fontWeight: '600', cursor: 'pointer', marginRight: '15px' }}>Editar</button>
                        <button onClick={() => handleDeleteTour(tour.id)} style={{ color: '#ef4444', background: 'none', border: 'none', fontWeight: '600', cursor: 'pointer' }}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CONTROL DE USUARIOS */}
        {activeTab === 'users' && (
          <div>
            <h1 style={{ fontSize: '26px', color: '#1e293b', margin: 0, fontWeight: '700' }}>Control de Usuarios</h1>
            <p style={{ color: '#64748b', margin: '5px 0 30px 0' }}>Administra cuentas del sistema y asigna roles de seguridad.</p>

            <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: '600' }}>Correo Electrónico</th>
                    <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: '600' }}>Rol Asignado</th>
                    <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: '600', textAlign: 'right' }}>Acciones de Acceso</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px 24px', color: '#1e293b', fontWeight: '500' }}>{u.email}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{ backgroundColor: u.role === 'admin' ? '#fef3c7' : '#e0f2fe', color: u.role === 'admin' ? '#d97706' : '#0284c7', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', textTransform: 'capitalize' }}>
                          {u.role || 'client'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                        <button onClick={() => handleToggleRole(u.id, u.role)} style={{ color: '#4f46e5', background: 'none', border: 'none', fontWeight: '600', cursor: 'pointer' }}>
                          Cambiar a {u.role === 'admin' ? 'Cliente' : 'Administrador'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: CONFIGURACIÓN GENERAL */}
        {activeTab === 'config' && (
          <div>
            <h1 style={{ fontSize: '26px', color: '#1e293b', margin: 0, fontWeight: '700' }}>Configuración del Sistema</h1>
            <p style={{ color: '#64748b', margin: '5px 0 30px 0' }}>Ajustes generales, métodos de pago y seguridad.</p>
            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#1e293b' }}>Métodos de Pago Integrados</h3>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475569', marginBottom: '10px' }}>
                <input type="checkbox" defaultChecked /> Transbank / Webpay Plus (Chile)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475569', marginBottom: '25px' }}>
                <input type="checkbox" /> PayPal International
              </label>
              <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '20px 0' }} />
              <h3 style={{ margin: '0 0 15px 0', color: '#1e293b' }}>Seguridad de la Plataforma</h3>
              <p style={{ fontSize: '14px', color: '#64748b' }}>Conexión cifrada SSL con Supabase activa y Row Level Security (RLS) monitoreado.</p>
            </div>
          </div>
        )}

      </div>

      {/* MODAL PARA CREAR Y EDITAR TOURS */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(4px)', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '35px', borderRadius: '16px', width: '450px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#1e293b' }}>{editingTour ? '✏️ Editar Tour' : '🚀 Publicar Nuevo Tour'}</h2>
            <form onSubmit={handleSaveTour} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '5px' }}>Nombre del Destino</label>
                <input type="text" required value={tourForm.name} onChange={(e) => setTourForm({ ...tourForm, name: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} placeholder="Ej: San Pedro de Atacama 3D/2N" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '5px' }}>Precio ($ CLP)</label>
                <input type="number" required value={tourForm.price} onChange={(e) => setTourForm({ ...tourForm, price: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} placeholder="Ej: 249000" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'end', gap: '10px', marginTop: '15px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '10px 15px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};