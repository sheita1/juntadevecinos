import { useAuth } from "@context/AuthContext";
import { Navigate } from "react-router-dom";

const Home = () => {
  const { user } = useAuth();

  if (!user) {
    return <p>No se detectó sesión activa.</p>;
  }

  if (user.rol === "administrador") {
    return (
      <section>
        <h2>Panel del Administrador</h2>
        
      </section>
    );
  }

  if (user.rol === "usuario") {
    return <Navigate to="/usuario" />;
  }

  return <p>Rol no reconocido.</p>;
};

export default Home;
