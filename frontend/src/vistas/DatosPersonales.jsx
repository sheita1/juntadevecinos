import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import '@styles/perfil.css';

export default function DatosPersonales() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="vista-datos">
      <Header />
      <main
        className="perfil-container"
        style={{
          minHeight: 'calc(100vh - 80px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px 24px',
        }}
      >
        <div style={{ maxWidth: '560px', width: '100%' }}>
          <h2 className="perfil-titulo">👤 Mis Datos Personales</h2>

          <div className="perfil-card">
            <div className="perfil-item">
              <span className="label">Nombre completo:</span>
              <span className="valor">{user.nombreCompleto || '—'}</span>
            </div>

            <div className="perfil-item">
              <span className="label">Correo electrónico:</span>
              <span className="valor">{user.email || '—'}</span>
            </div>

            <div className="perfil-item">
              <span className="label">RUT:</span>
              <span className="valor">{user.rut || '—'}</span>
            </div>

            <div className="perfil-item">
              <span className="label">Rol:</span>
              <span className="valor">{user.rol || '—'}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
