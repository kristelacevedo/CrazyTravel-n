import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export function AdminDashboard() {
  // Pestañas y estados
  const [activeTab, setActiveTab] = useState<'tours' | 'users'>('tours');
  const [tours, setTours] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal y Formulario
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<any>(null);
  
  // Estado inicial del formulario adaptado a tu tabla real
  const [tourForm, setTourForm] = useState({
    titulo: '',
    precio: '',
    descripcion: '',
    imagen_url: '',
    cupos_totales: '10',
    fecha_salida: ''
  });

  // Cargar datos al iniciar
  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // Cargar Tours
      const { data: toursData } = await supabase.from('tours').select('*').order('created_at', { ascending: false });
      if (toursData) setTours(toursData);

      // Cargar Usuarios
      const { data: perfilesData, error: errorPerfiles } = await supabase.from('perfiles').select('*');
      if (perfilesData) {
        setUsuarios(perfilesData);
      } else if (errorPerfiles) {
        console.error("Error cargando perfiles:", errorPerfiles);
      }
    } catch (err) {
      console.error("Error general cargando datos:", err);
    } finally {
      setLoading(false);
    }
  };

  // Función para GUARDAR o EDITAR
  const handleSaveTour = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Preparamos los datos EXACTAMENTE como los pide tu base de datos
      const payload = {
        titulo: tourForm.titulo,
        destino: tourForm.titulo, // Obligatorio en tu tabla
        precio: Number(tourForm.precio),
        descripcion: tourForm.descripcion || null,
        imagen_url: tourForm.imagen_url || null,
        cupos_totales: Number(tourForm.cupos_totales),
        // Si la fecha está vacía, enviamos null para que Supabase no dé error
        fecha_salida: tourForm.fecha_salida ? tourForm.fecha_salida : null 
      };

      if (editingTour) {
        // ACTUALIZAR
        const { error } = await supabase.from('tours').update(payload).eq('id', editingTour.id);
        if (error) throw error;
        alert('¡Tour actualizado con éxito!');
      } else {
        // CREAR NUEVO
        const { error } = await supabase.from('tours').insert([payload]);
        if (error) throw error;
        alert('¡Nuevo tour publicado con éxito!');
      }

      // Limpiar y cerrar modal
      setIsModalOpen(false);
      setEditingTour(null);
      setTourForm({ titulo: '', precio: '', descripcion: '', imagen_url: '', cupos_totales: '10', fecha_salida: '' });
      
      // Recargar la tabla
      fetchAdminData();
    } catch (err: any) {
      console.error(err);
      alert(`❌ ERROR AL GUARDAR: ${err.message || 'Revisa los datos ingresados'}`);
    }
  };

  // Función para ELIMINAR
  const handleDeleteTour = async (id: string) => {
    if (window.confirm('¿Estás segura de que deseas eliminar este tour? Esta acción no se puede deshacer.')) {
      const { error } = await supabase.from('tours').delete().eq('id', id);
      if (error) {
        alert(`Error al eliminar: ${error.message}`);
      } else {
        alert('Tour eliminado correctamente.');
        fetchAdminData();
      }
    }
  };

  // Función para ABRIR MODAL DE EDICIÓN
  const openEditModal = (tour: any) => {
    setEditingTour(tour);
    setTourForm({
      titulo: tour.titulo || '',
      precio: tour.precio ? tour.precio.toString() : '',
      descripcion: tour.descripcion || '',
      imagen_url: tour.imagen_url || '',
      cupos_totales: tour.cupos_totales ? tour.cupos_totales.toString() : '10',
      fecha_salida: tour.fecha_salida || ''
    });
    setIsModalOpen(true);
  };

  // PANTALLA DE CARGA
  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
        <p style={{ fontSize: '18px', color: '#64748b', fontWeight: 'bold' }}>⏳ Cargando Panel de Administración...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif', backgroundColor: '#f8fafc', overflow: 'hidden' }}>
      
      {/* ─── BARRA LATERAL (SIDEBAR) ─── */}
      <div style={{ width: '280px', backgroundColor: '#0f172a', color: '#94a3b8', display: 'flex', flexDirection: 'column', padding: '24px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px', paddingLeft: '8px' }}>
          <span style={{ color: '#22c55e', fontSize: '18px' }}>●</span>
          <h1 style={{ color: '#ffffff', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Crazy Travel Pro</h1>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <button 
            onClick={() => setActiveTab('tours')}
            style={{ padding: '12px', backgroundColor: activeTab === 'tours' ? '#1e293b' : 'transparent', border: 'none', borderRadius: '8px', color: activeTab === 'tours' ? '#3b82f6' : '#94a3b8', cursor: 'pointer', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}
          >
            🌍 Gestión de Tours
          </button>

          <button 
            onClick={() => setActiveTab('users')}
            style={{ padding: '12px', backgroundColor: activeTab === 'users' ? '#1e293b' : 'transparent', border: 'none', borderRadius: '8px', color: activeTab === 'users' ? '#3b82f6' : '#94a3b8', cursor: 'pointer', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}
          >
            👥 Control de Usuarios
          </button>
        </nav>
      </div>

      {/* ─── ÁREA PRINCIPAL ─── */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        
        {/* VISTA DE TOURS */}
        {activeTab === 'tours' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 4px 0' }}>Gestión de Contenido</h2>
                <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>Publica, modifica o elimina productos turísticos.</p>
              </div>
              <button 
                onClick={() => { 
                  setEditingTour(null); 
                  setTourForm({ titulo: '', precio: '', descripcion: '', imagen_url: '', cupos_totales: '10', fecha_salida: '' });
                  setIsModalOpen(true); 
                }}
                style={{ backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)' }}
              >
                + Crear Nuevo Tour
              </button>
            </div>

            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: '#fafafa' }}>
                    <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: '600', fontSize: '13px' }}>Destino / Tour</th>
                    <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: '600', fontSize: '13px' }}>Cupos</th>
                    <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: '600', fontSize: '13px' }}>Precio Base</th>
                    <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: '600', fontSize: '13px', textAlign: 'right' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {tours.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>No hay tours registrados aún.</td>
                    </tr>
                  ) : (
                    tours.map((tour) => (
                      <tr key={tour.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '16px 24px', fontWeight: '600', color: '#1e293b' }}>{tour.titulo}</td>
                        <td style={{ padding: '16px 24px', color: '#475569' }}>{tour.cupos_totales}</td>
                        <td style={{ padding: '16px 24px', color: '#475569' }}>${(tour.precio || 0).toLocaleString('es-CL')}</td>
                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                          <button onClick={() => openEditModal(tour)} style={{ color: '#3b82f6', background: 'none', border: 'none', fontWeight: '600', cursor: 'pointer', marginRight: '16px' }}>Editar</button>
                          <button onClick={() => handleDeleteTour(tour.id)} style={{ color: '#ef4444', background: 'none', border: 'none', fontWeight: '600', cursor: 'pointer' }}>Eliminar</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VISTA DE USUARIOS */}
        {activeTab === 'users' && (
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 4px 0' }}>Control de Usuarios</h2>
            <p style={{ color: '#64748b', margin: '0 0 24px 0', fontSize: '14px' }}>Lista de perfiles registrados en la base de datos.</p>

            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: '#fafafa' }}>
                    <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: '600', fontSize: '13px' }}>ID Usuario</th>
                    <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: '600', fontSize: '13px' }}>Correo Electrónico</th>
                    <th style={{ padding: '16px 24px', color: '#64748b', fontWeight: '600', fontSize: '13px' }}>Rol</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.length === 0 ? (
                    <tr>
                      <td colSpan={3} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>Cargando usuarios...</td>
                    </tr>
                  ) : (
                    usuarios.map((u, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '16px 24px', color: '#64748b', fontSize: '12px' }}>{u.id.substring(0, 8)}...</td>
                        <td style={{ padding: '16px 24px', fontWeight: '500', color: '#1e293b' }}>{u.email || u.correo || 'Sin correo'}</td>
                        <td style={{ padding: '16px 24px' }}>
                          <span style={{ backgroundColor: '#ffedd5', color: '#ea580c', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>
                            {u.rol || u.role || 'Cliente'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ─── MODAL PARA CREAR / EDITAR TOUR ─── */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <form onSubmit={handleSaveTour} style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '16px', width: '440px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 8px 0' }}>
              {editingTour ? '🚀 Editar Tour' : '🚀 Nuevo Tour'}
            </h3>
            
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Nombre del Destino</label>
              <input style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '14px' }} type="text" value={tourForm.titulo} onChange={e => setTourForm({...tourForm, titulo: e.target.value})} required />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Precio ($ CLP)</label>
              <input style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '14px' }} type="number" value={tourForm.precio} onChange={e => setTourForm({...tourForm, precio: e.target.value})} required />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Descripción del Viaje</label>
              <textarea style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '14px', height: '60px', resize: 'none' }} value={tourForm.descripcion} onChange={e => setTourForm({...tourForm, descripcion: e.target.value})} />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Link de la Imagen (URL)</label>
              <input style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '14px' }} type="text" placeholder="https://..." value={tourForm.imagen_url} onChange={e => setTourForm({...tourForm, imagen_url: e.target.value})} />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Cupos Totales</label>
                <input style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '14px' }} type="number" value={tourForm.cupos_totales} onChange={e => setTourForm({...tourForm, cupos_totales: e.target.value})} required />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Fecha Salida</label>
                <input style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '14px' }} type="date" value={tourForm.fecha_salida} onChange={e => setTourForm({...tourForm, fecha_salida: e.target.value})} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ backgroundColor: '#f1f5f9', color: '#475569', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                Cancelar
              </button>
              <button type="submit" style={{ backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}