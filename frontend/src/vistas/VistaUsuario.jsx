import { useAuth } from '../context/AuthContext';

import Header from '../components/Header';

export default function VistaUsuario() {
  const { user } = useAuth();

  console.log('ROL del usuario:', user?.rol);
  console.log('Usuario completo:', user);

  return (
    <div className="vista-usuario">
      <Header />
      <main className="contenido-usuario">
        <h2 style={{ color: '#003366', fontSize: '22px', fontWeight: '600', marginBottom: '24px' }}>
          
        </h2>

  
      </main>
    </div>
  );
}
