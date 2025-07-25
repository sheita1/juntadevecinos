import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "@services/auth.service.js";
import "@styles/navbar.css";
import { useState, useEffect } from "react";
import { useAuth } from "@context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, setUser } = useAuth();
  const userRole = user?.rol?.toLowerCase();
  const [menuOpen, setMenuOpen] = useState(false);

  const logoutSubmit = () => {
    logout();
    sessionStorage.removeItem("usuario");
    setUser(null);
    navigate("/auth");
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const closeOnNav = () => setMenuOpen(false);
    window.addEventListener("popstate", closeOnNav);
    return () => window.removeEventListener("popstate", closeOnNav);
  }, []);

  if (!isAuthenticated) return null;

  return (
    <nav className="navbar">
      <div className={`nav-menu ${menuOpen ? "activado" : ""}`}>
        <ul>
          <li>
            <NavLink
              to="/home"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => setMenuOpen(false)}
            >
              Inicio
            </NavLink>
          </li>

          {userRole === "administrador" && (
            <>
              <li>
                <NavLink to="/users">Usuarios</NavLink>
              </li>
              <li>
                <NavLink to="/vecinos">Vecinos</NavLink>
              </li>
              <li>
                <NavLink to="/reuniones">Reuniones</NavLink>
              </li>
            </>
          )}

          {userRole === "usuario" && (
            <>
              <li>
                <NavLink to="/vecinos">Mis vecinos</NavLink>
              </li>
              <li>
                <NavLink to="/reuniones">Mis reuniones</NavLink>
              </li>
              <li>
                <NavLink to="/usuario/datos">Datos personales</NavLink>
              </li>
              <li>
                <NavLink to="/usuario/reclamos">Reclamos</NavLink>
              </li>
            </>
          )}

          <li>
            <button onClick={logoutSubmit}>Cerrar sesión</button>
          </li>
        </ul>
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
    </nav>
  );
};

export default Navbar;
