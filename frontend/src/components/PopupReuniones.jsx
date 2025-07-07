import Form from "./Form";
import "@styles/popup.css";
import CloseIcon from "@assets/XIcon.svg";

export default function PopupReuniones({ show, setShow, data, action, isEditing }) {
  const reunionData = isEditing && data.length > 0 ? data[0] : { nombre: "", fecha: "" };

  const handleSubmit = (formData) => {
    console.log(`📤 Enviando datos de reunión con ID: ${reunionData.id || "Nuevo"}`, formData);
    action(formData); 
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!reunionData.id) {
      console.warn("⚠️ No se puede subir el acta porque la reunión aún no tiene un ID.");
      return;
    }

    const formData = new FormData();
    formData.append("acta", file);

    try {
      const response = await fetch(`/api/reuniones/${reunionData.id}/acta`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error en la subida del archivo: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("📂 Acta subida correctamente:", result);
    } catch (error) {
      console.error("❌ Error al subir acta:", error);
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
              },
              {
                label: "Fecha",
                name: "fecha",
                defaultValue: reunionData.fecha || "",
                fieldType: "input",
                type: "datetime-local",
                required: true,
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
