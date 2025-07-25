import { useState } from 'react';
import Header from '@components/Header';

export default function FormularioReclamos() {
  const [datos, setDatos] = useState({
    tipo: '',
    descripcion: '',
    comprobante: null,
  });

  const [mensajeExito, setMensajeExito] = useState('');

  const manejarCambio = (e) => {
    const { name, value, files } = e.target;
    if (name === 'comprobante') {
      setDatos({ ...datos, comprobante: files[0] });
    } else {
      setDatos({ ...datos, [name]: value });
    }
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    setMensajeExito('Reclamo enviado correctamente ✅');
  };

  return (
    <div className="vista-reclamos">
      <Header />
      <main
        className="formulario-wrapper"
        style={{
          minHeight: 'calc(100vh - 80px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px 24px',
          backgroundColor: '#f0fdf6',
        }}
      >
        <div
          className="formulario-card"
          style={{
            width: '100%',
            maxWidth: '560px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 2px 16px rgba(0, 0, 0, 0.06)',
            padding: '32px',
          }}
        >
          <h2
            style={{
              color: '#1B4332',
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '24px',
              textAlign: 'center',
            }}
          >
            📮 Enviar Reclamo o Solicitud
          </h2>

          <form
            onSubmit={manejarEnvio}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div>
              <label style={{ fontSize: '13px', fontWeight: '500', color: '#2D6A4F' }}>
                Tipo de reclamo
              </label>
              <select
                name="tipo"
                value={datos.tipo}
                onChange={manejarCambio}
                required
                style={{
                  padding: '8px 12px',
                  fontSize: '14px',
                  borderRadius: '8px',
                  border: '1px solid #B7D9C8',
                  backgroundColor: '#ffffff',
                  color: '#1B4332',
                  width: '100%',
                  appearance: 'none',
                }}
              >
                <option value="">Seleccione una opción</option>
                <option value="basura">Problema con basura</option>
                <option value="iluminacion">Falla de iluminación</option>
                <option value="ruido">Ruido excesivo</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '500', color: '#2D6A4F' }}>
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={datos.descripcion}
                onChange={manejarCambio}
                rows="4"
                required
                placeholder="Describe brevemente el problema..."
                style={{
                  padding: '10px 12px',
                  fontSize: '14px',
                  borderRadius: '8px',
                  border: '1px solid #B7D9C8',
                  backgroundColor: '#ffffff',
                  color: '#1B4332',
                  width: '100%',
                  resize: 'vertical',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '500', color: '#2D6A4F' }}>
                Adjuntar Comprobante
              </label>
              <input
                type="file"
                name="comprobante"
                accept="application/pdf"
                onChange={manejarCambio}
                style={{
                  padding: '7px 10px',
                  fontSize: '14px',
                  borderRadius: '8px',
                  border: '1px solid #2D6A4F',
                  backgroundColor: '#ffffff',
                  color: '#1B4332',
                  width: '100%',
                  cursor: 'pointer',
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: '12px',
                fontSize: '15px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#1B4332',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
              }}
            >
              Enviar Reclamo
            </button>

            {mensajeExito && (
              <p style={{ color: 'green', fontSize: '13px', marginTop: '6px' }}>
                {mensajeExito}
              </p>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
