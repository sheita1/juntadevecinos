import Form from "./Form";
import "@styles/popup.css";
import CloseIcon from "@assets/XIcon.svg";

export default function PopupReuniones({ show, setShow, data, action, isEditing, reuniones }) {
  const reunionData =
    isEditing && data.length > 0
      ? data[0]
      : { nombre: "", fecha: "", lugar: "", descripcion: "" };

  const handleSubmit = (formData) => {
    action(formData);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !reunionData.id) return;

    const formData = new FormData();
    formData.append("acta", file);

    try {
      const response = await fetch(`/api/reuniones/${reunionData.id}/acta`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) return;

      await response.json();
    } catch (_) {
      // Silencioso
    }
  };

  return (
    show && (
      <div className="bg">
        <div className="popup">
          <button className="close" onClick={() => setShow(false)}>
            <img src={CloseIcon} alt="Cerrar" />
          </button>
          <Form
            title={isEditing ? "Editar reunión" : "Registrar reunión"}
            fields={[
              {
                label: "Nombre",
                name: "nombre",
                defaultValue: reunionData.nombre || "",
                placeholder: "Nombre de la reunión",
                fieldType: "input",
                type: "text",
                required: true,
                minLength: 5,
                maxLength: 50,
                pattern: /^[A-Za-z\s]+$/,
                patternMessage: "Solo se permiten letras y espacios",
              },
              {
                
              label: "Fecha",
              name: "fecha",
              defaultValue: reunionData.fecha || "",
              fieldType: "input",
              type: "datetime-local",
              required: true,
              customValidation: (value) => {
                if (!value || isEditing) return null;

                const ahora = new Date();
                const maxFecha = new Date();
                maxFecha.setFullYear(maxFecha.getFullYear() + 1);

                const fechaIngresada = new Date(value);
                const fechaIngresadaISO = fechaIngresada.toISOString();

                const duplicada = reuniones?.some(
                  (r) => new Date(r.fecha).toISOString() === fechaIngresadaISO
                );

                if (duplicada) {
                  return "⚠ Ya existe una reunión registrada en esa fecha y hora.";
                }

                if (fechaIngresada < ahora) {
                  return "⚠ la fecha ingresada ya caduco.";
                }

                if (fechaIngresada > maxFecha) {
                  return "⚠ La fecha no puede superar 1 año en el futuro.";
                }

    return null;
                },
              },
              {
                label: "Lugar",
                name: "lugar",
                defaultValue: reunionData.lugar || "",
                placeholder: "Ubicación del evento",
                fieldType: "input",
                type: "text",
                required: true,
                minLength: 5,
                maxLength: 100,
                pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,-]+$/,
                patternMessage: "Lugar inválido: solo letras, números y símbolos básicos"
              },
              {
                label: "Descripción",
                name: "descripcion",
                defaultValue: reunionData.descripcion || "",
                fieldType: "textarea",
                rows: 4,
                required: true,
                minLength: 10,
                maxLength: 400,
                placeholder: "Agrega detalles relevantes sobre la reunión",
              },
              ...(isEditing
                ? [
                    {
                      label: "Adjuntar Acta (PDF)",
                      name: "acta",
                      fieldType: "input",
                      type: "file",
                      accept: "application/pdf",
                      onChange: handleFileUpload,
                    },
                  ]
                : []),
            ]}
            onSubmit={handleSubmit}
            buttonText={isEditing ? "Actualizar reunión" : "Registrar reunión"}
            backgroundColor={"#fff"}
          />
        </div>
      </div>
    )
  );
}
