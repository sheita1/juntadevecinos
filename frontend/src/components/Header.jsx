import { useAuth } from '../context/AuthContext';

export default function Header() {
  const auth = useAuth();


  if (!auth) {
    console.warn('El contexto de Auth no está disponible en Header.');
    return null;
  }

  const { user } = auth;

  return (
    <header
      style={{
        backgroundColor: '#003366',
        color: 'white',
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <h1 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>
        Junta de Vecinos
      </h1>

      <div style={{ fontSize: '14px' }}>
        {user?.nombreCompleto && (
          <span style={{ marginRight: '12px' }}>
            {user.nombreCompleto}
          </span>
        )}
      </div>
    </header>
  );
}
