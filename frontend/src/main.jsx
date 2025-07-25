import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from '@pages/Login';
import Register from '@pages/Register';
import Home from '@pages/Home';
import Users from '@pages/Users';
import Vecinos from '@pages/Vecinos';
import Reuniones from '@pages/Reuniones';
import Error404 from '@pages/Error404';
import Root from '@pages/Root';
import ProtectedRoute from '@components/ProtectedRoute';
import VistaUsuario from '@vistas/VistaUsuario';
import DatosPersonales from '@vistas/DatosPersonales';
import FormularioReclamos from '@vistas/FormularioReclamos';
import '@styles/styles.css';
import '@styles/index.css';
import '@styles/typography.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      { path: '/auth', element: <Login /> },
      { path: '/register', element: <Register /> },

      { path: '/home', element: <Home /> },

      {
        path: '/users',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Users />
          </ProtectedRoute>
        )
      },
      {
        path: '/vecinos',
        element: (
          <ProtectedRoute allowedRoles={['administrador', 'usuario']}>
            <Vecinos />
          </ProtectedRoute>
        )
      },
    {
       path: '/reuniones',
       element: (
         <ProtectedRoute allowedRoles={['administrador', 'usuario']}>
           <Reuniones />
          </ProtectedRoute>
      )
    }
      ,

      {
        path: '/usuario',
        element: (
          <ProtectedRoute allowedRoles={['usuario']}>
            <VistaUsuario />
          </ProtectedRoute>
        )
      },
      {
        path: '/usuario/datos',
        element: (
          <ProtectedRoute allowedRoles={['usuario']}>
            <DatosPersonales />
          </ProtectedRoute>
        )
      },
      {
        path: '/usuario/reclamos',
        element: (
          <ProtectedRoute allowedRoles={['usuario']}>
            <FormularioReclamos />
          </ProtectedRoute>
        )
      },
      
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
