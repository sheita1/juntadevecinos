import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cookies from 'js-cookie'; 

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const rawUser = sessionStorage.getItem("usuario");

    if (!rawUser || rawUser === "undefined") {
      console.warn("🧹 Datos corruptos en sesión. Redirigiendo...");
      sessionStorage.removeItem("usuario");
      cookies.remove("jwt");
      setUser(null);
      navigate("/auth");
      setLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(rawUser);
      if (parsed && parsed.rol) {
        setUser(parsed);

        
        if (parsed.token && !cookies.get("jwt")) {
          cookies.set("jwt", parsed.token, { expires: 1 });
          console.log("✅ Token guardado en cookie");
        }
      } else {
        throw new Error("Usuario sin rol");
      }
    } catch (error) {
      console.error("Error leyendo sesión:", error);
      sessionStorage.removeItem("usuario");
      cookies.remove("jwt");
      setUser(null);
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, setUser }}>
      {loading ? <p>Cargando usuario...</p> : children}
    </AuthContext.Provider>
  );
}
