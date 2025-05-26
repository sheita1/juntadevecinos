import { updateReunion } from "../../services/reuniones.service.js";
import { showSuccessAlert, showErrorAlert } from "@helpers/sweetAlert.js";

export default function useEditReunion(setReuniones) {
    const handleUpdate = async (id, updatedData) => {
        if (!id) {
            console.error("❌ No se recibió un ID válido para actualizar la reunión.");
            return;
        }

        console.log(`🔄 Intentando actualizar reunión con ID: ${id}`, updatedData);  // ✅ Verificar ID y datos en consola

        try {
            const updatedReunion = await updateReunion(id, updatedData);
            
            if (updatedReunion) {
                console.log("✅ Reunión actualizada correctamente:", updatedReunion);  // ✅ Verificar respuesta del backend
                setReuniones(prevReuniones =>
                    prevReuniones.map(reunion =>
                        reunion.id === updatedReunion.id ? updatedReunion : reunion
                    )
                );
                showSuccessAlert("Actualizado", "La reunión ha sido actualizada correctamente.");
            } else {
                console.error("❌ No se pudo actualizar la reunión. Verifica que aún existe.");
                showErrorAlert("Error", "No se pudo actualizar la reunión.");
            }
        } catch (error) {
            console.error("❌ Error al actualizar reunión:", error);
            showErrorAlert("Error", "No se pudo actualizar la reunión.");
        }
    };

    return { handleUpdate };
}
