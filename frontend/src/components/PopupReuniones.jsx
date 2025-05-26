import Form from "./Form";
import "@styles/popup.css";
import CloseIcon from "@assets/XIcon.svg";

export default function PopupReuniones({ show, setShow, data, action, isEditing }) {
    const reunionData = isEditing && data.length > 0 ? data[0] : { nombre: "", fecha: "", acta: null };

    console.log("📝 Datos de reunión en el popup:", reunionData);  // ✅ Verificar datos antes de abrir el popup

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

            const data = await response.json();
            console.log("📂 Acta subida correctamente:", data);
        } catch (error) {
            console.error("❌ Error al subir acta:", error);
        }
    };

    const handleSubmit = (formData) => {
        console.log(`📤 Enviando datos de reunión con ID: ${reunionData.id || "Nuevo"}`, formData);  
        action(formData);

        // ✅ Si no es edición, esperar a que la reunión tenga un ID antes de subir el acta
        if (!isEditing && formData.acta) {
            setTimeout(() => {
                handleFileUpload({ target: { files: [formData.acta] } });
            }, 1000);  // Esperar un momento para que la reunión se cree y tenga un ID
        }

        setShow(false);
    };

    return (
        <div>
            {show && (
                <div className="bg">
                    <div className="popup">
                        <button className="close" onClick={() => setShow(false)}>
                            <img src={CloseIcon} />
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
                                {
                                    label: "Adjuntar Acta (PDF)",
                                    name: "acta",
                                    fieldType: "input",
                                    type: "file",
                                    accept: "application/pdf",
                                    onChange: handleFileUpload,
                                }
                            ]}
                            onSubmit={handleSubmit}
                            buttonText={isEditing ? "Actualizar reunión" : "Registrar reunión"}
                            backgroundColor={"#fff"}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
