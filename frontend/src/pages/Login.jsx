import { useNavigate } from 'react-router-dom';
import { login } from '@services/auth.service.js';
import Form from '@components/Form';
import useLogin from '@hooks/auth/useLogin.jsx';
import { useAuth } from '@context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import '@styles/form.css';

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const {
    errorEmail,
    errorPassword,
    errorData,
    handleInputChange,
  } = useLogin();

  const loginSubmit = async (data) => {
    try {
      const response = await login(data);
      const token = response.data?.token;

      if (response.status === 'Success' && token) {
        const decoded = jwtDecode(token);

        if (decoded && decoded.rol) {
          sessionStorage.setItem('usuario', JSON.stringify(decoded));
          setUser(decoded);
          navigate('/home');
        } else {
          throw new Error('Token sin datos de usuario');
        }
      } else if (response.status === 'Client error') {
        errorData(response.details);
      } else {
        console.warn('⚠️ Login sin token válido:', response);
      }
    } catch (error) {
      console.error('Error durante login:', error);
    }
  };

  return (
    <main className="container" style={{ display: 'flex', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ maxWidth: '480px', width: '100%' }}>
        <Form
          title="Iniciar sesión"
          fields={[
            {
              label: 'Correo electrónico',
              name: 'email',
              placeholder: 'example@gmail.cl',
              fieldType: 'input',
              type: 'email',
              required: true,
              minLength: 15,
              maxLength: 30,
              errorMessageData: errorEmail,
              validate: {
                emailDomain: (value) =>
                  value.endsWith('@gmail.cl') || 'El correo debe terminar en @gmail.cl',
              },
              onChange: (e) => handleInputChange('email', e.target.value),
            },
            {
              label: 'Contraseña',
              name: 'password',
              placeholder: '**********',
              fieldType: 'input',
              type: 'password',
              required: true,
              minLength: 8,
              maxLength: 26,
              pattern: /^[a-zA-Z0-9]+$/,
              patternMessage: 'Debe contener solo letras y números',
              errorMessageData: errorPassword,
              onChange: (e) => handleInputChange('password', e.target.value),
            },
          ]}
          buttonText="Iniciar sesión"
          onSubmit={loginSubmit}
          footerContent={
            <p>
              ¿No tienes cuenta?, <a href="/register">¡Regístrate aquí!</a>
            </p>
          }
        />
      </div>
    </main>
  );
};

export default Login;
