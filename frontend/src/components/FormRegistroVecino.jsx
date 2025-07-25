import '../styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';
import Form from '@components/Form';
import { useState, useRef } from 'react';
import { createVecino, updateVecino } from '@services/vecinos.service.js';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert.js';
import useVecinos from '@hooks/vecinos/useGetVecinos';

export default function FormRegistroVecino({
  show,
  setShow,
  setVecinos,
  dataInicial = null,
  modoEdicion = false,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const formRef = useRef(null);
  const { vecinos } = useVecinos();

  const validarDuplicado = (campo, valor) => {
    return vecinos.some((v) => {
      const mismoVecino = modoEdicion && dataInicial?.id === v.id;
      if (mismoVecino) return false;
      return v[campo]?.trim() === valor.trim();
    });
  };

  const handleCampoBlur = (campo, label) => (e) => {
    const valorIngresado = e.target.value;
    if (!valorIngresado) return;

    const duplicado = validarDuplicado(campo, valorIngresado);
    if (duplicado) {
      showErrorAlert(`${label} duplicado`, `Ya existe un vecino con ese ${label.toLowerCase()}.`);
    }
  };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value);
      });

      const file = fileInputRef.current?.files?.[0];
      if (!modoEdicion && file instanceof File) {
        formDataToSend.append("comprobante", file);
        console.log("📂 Archivo PDF adjuntado:", file.name);
      }

      if (modoEdicion && dataInicial?.rut) {
        const vecinoActualizado = await updateVecino(formDataToSend, dataInicial.rut);
        showSuccessAlert("¡Actualizado!", "El vecino ha sido modificado exitosamente.");
        setVecinos((prev) =>
          prev.map((vec) => (vec.id === vecinoActualizado.id ? vecinoActualizado : vec))
        );
      } else {
        const nuevoVecino = await createVecino(formDataToSend);
        showSuccessAlert("¡Registro exitoso!", "El vecino ha sido agregado correctamente.");
        setVecinos((prev) => [...prev, nuevoVecino]);
      }

      setShow(false);
    } catch (error) {
      console.error("❌ Error al enviar vecino:", error);
      const status = error?.response?.status;
      const mensaje = error?.response?.data || "Ocurrió un problema inesperado.";

      if (status === 409 && typeof mensaje === "string") {
        showErrorAlert("Registro duplicado", mensaje);
      } else {
        showErrorAlert("Error", mensaje);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const patternRut = new RegExp(
    /^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/
  );

  const campos = [
    {
      label: 'Nombre completo',
      name: 'nombre',
      placeholder: 'Nombre Apellido',
      fieldType: 'input',
      type: 'text',
      required: true,
      minLength: 10,
      maxLength: 50,
      pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      patternMessage: 'Debe contener solo letras y espacios',
      onBlur: handleCampoBlur('nombre', 'Nombre')
    },
    {
      label: 'Correo electrónico',
      name: 'correo',
      placeholder: 'example@gmail.cl',
      fieldType: 'input',
      type: 'email',
      required: true,
      minLength: 15,
      maxLength: 30,
      pattern: /^[a-zA-Z0-9._%+-]+@gmail\.cl$/,
      patternMessage: 'El correo debe terminar en @gmail.cl',
      onBlur: handleCampoBlur('correo', 'Correo')
    },
    {
      label: 'Rut',
      name: 'rut',
      placeholder: '21.308.770-3',
      fieldType: 'input',
      type: 'text',
      required: true,
      minLength: 9,
      maxLength: 12,
      pattern: patternRut,
      patternMessage: 'Debe ser xx.xxx.xxx-x o xxxxxxxx-x',
      onBlur: handleCampoBlur('rut', 'Rut')
    },
    {
      label: 'Teléfono',
      name: 'telefono',
      placeholder: '912345678',
      fieldType: 'input',
      type: 'text',
      required: true,
      minLength: 9,
      maxLength: 9,
      pattern: /^[0-9]{9}$/,
      patternMessage: 'Debe contener exactamente 9 dígitos numéricos',
      onBlur: handleCampoBlur('telefono', 'Teléfono')
    },
    {
      label: 'Contraseña',
      name: 'password',
      placeholder: '********',
      fieldType: 'input',
      type: 'password',
      required: true,
      minLength: 6,
      maxLength: 30,
      pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/,
      patternMessage: 'Debe contener letras y números (mínimo 6 caracteres)'
    },
    {
      label: 'Rol',
      name: 'rol',
      fieldType: 'select',
      options: [
        { value: 'usuario', label: 'Usuario' },
        { value: 'administrador', label: 'Administrador' }
      ],
      required: true
    }
  ];

  return (
    <>
      {show && (
        <div className="bg">
          <div className="popup">
            <button className="close" onClick={() => setShow(false)}>
              <img src={CloseIcon} alt="Cerrar" />
            </button>

            <Form
              ref={formRef}
              title={modoEdicion ? 'Editar Vecino' : 'Registrar Vecino'}
              fields={campos}
              defaultValues={dataInicial}
              onSubmit={handleSubmit}
              buttonText={
                isSubmitting
                  ? modoEdicion
                    ? 'Actualizando...'
                    : 'Registrando...'
                  : modoEdicion
                  ? 'Actualizar Vecino'
                  : 'Registrar Vecino'
              }
              backgroundColor="#fff"
            >
              {}
              {!modoEdicion && (
  <div className="form-group" style={{ marginTop: '8px' }}>
    <label
      htmlFor="comprobante"
      style={{
        fontWeight: '600',
        fontSize: '13px',
        marginBottom: '6px',
        display: 'block',
        color: '#003366'
      }}
    >
      Adjuntar Comprobante
    </label>
    <input
      type="file"
      id="comprobante"
      name="comprobante"
      accept="application/pdf"
      ref={fileInputRef}
      required
      className="input-file"
      style={{
        padding: '7px 10px',
        fontSize: '14px',
        borderRadius: '4px',
        border: '1px solid #003366',
        width: '100%',
        backgroundColor: '#eef7ff',
        color: '#003366',
        boxSizing: 'border-box',
        cursor: 'pointer'
      }}
    />
  </div>
)}

            </Form>
          </div>
        </div>
      )}
    </>
  );
}
