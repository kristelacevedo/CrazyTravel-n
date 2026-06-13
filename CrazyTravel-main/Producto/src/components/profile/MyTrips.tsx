import type { CSSProperties } from 'react';

const MOCK_BOOKINGS = [
  {
    id: 'RES-001',
    tourName: 'Aventura Mágica en Chiloé',
    date: '15 de Noviembre, 2026',
    status: 'Pagado',
    imageUrl: 'https://images.unsplash.com/photo-1588614959060-4d144f28b207?q=80&w=400&auto=format&fit=crop',
  }
];

export default function MyTrips() {
  return (
    <div>
      <h2 style={sectionTitleStyle}>Mis Viajes</h2>
      {MOCK_BOOKINGS.length === 0 ? (
        <div style={emptyStateStyle}>No tienes viajes programados aún.</div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {MOCK_BOOKINGS.map((booking) => (
            <div key={booking.id} style={bookingCardStyle}>
              <img src={booking.imageUrl} alt={booking.tourName} style={bookingImageStyle} />
              <div style={{ padding: '16px', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '18px', color: '#0f172a', margin: 0 }}>{booking.tourName}</h3>
                  <span style={badgeStyle}>✅ {booking.status}</span>
                </div>
                <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 8px 0' }}>Salida: {booking.date}</p>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>ID de Reserva: {booking.id}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const sectionTitleStyle: CSSProperties = { fontSize: '24px', color: '#0f172a', marginBottom: '24px', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' };
const emptyStateStyle: CSSProperties = { padding: '40px 20px', textAlign: 'center', border: '1px dashed #cbd5e1', color: '#64748b', borderRadius: '12px' };
const bookingCardStyle: CSSProperties = { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', overflow: 'hidden' };
const bookingImageStyle: CSSProperties = { width: '150px', objectFit: 'cover' };
const badgeStyle: CSSProperties = { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', backgroundColor: '#dcfce7', color: '#166534' };
