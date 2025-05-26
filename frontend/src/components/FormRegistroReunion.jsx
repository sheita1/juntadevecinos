import Form from "@components/Form";
import { useState } from "react";
import { createReunion } from "@services/reuniones.service.js";
import { showSuccessAlert, showErrorAlert } from "@helpers/sweetAlert.js";

export default function FormRegistroReunion({ show, setShow, setReuniones }) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (formData) => {
        setIsSubmitting(true);

        try {
            const newReunion = await createReunion(formData);

            if (newReunion) {
                showSuccessAlert("¡Registro exitoso!", "La reunión ha sido agregada correctamente.");
                setReuniones(prevReuniones => [...prevReuniones, newReunion]);
                setShow(false);
            } else {
                showErrorAlert("Error", "No se pudo registrar la reunión.");
            }
        } catch (error) {
            console.error("Error al registrar reunión:", error);
            showErrorAlert("Error", "No se pudo registrar la reunión.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form
            title="Registrar Reunión"
            fields={[
                {
                    label: "Nombre",
                    name: "nombre",
                    placeholder: "Reunión de vecinos",
                    fieldType: "input",
                    type: "text",
                    required: true,
                    minLength: 5,
                    maxLength: 50,
                },
                {
                    label: "Fecha",
                    name: "fecha",
                    fieldType: "input",
                    type: "datetime-local",
                    required: true,
                }
            ]}
            onSubmit={handleSubmit}
            buttonText={isSubmitting ? "Registrando..." : "Registrar Reunión"}
            backgroundColor={"#fff"}
        />
    );
}
