import { updateReunion } from "../../services/reuniones.service.js";
import { showSuccessAlert, showErrorAlert } from "@helpers/sweetAlert.js";

export default function useEditReunion(setReuniones) {
    const handleUpdate = async (id, updatedData) => {
        if (!id) {
            
            return;
        }

        try {
            const updatedReunion = await updateReunion(id, updatedData);
            
            if (updatedReunion) {
                
                setReuniones(prevReuniones =>
                    prevReuniones.map(reunion =>
                        reunion.id === updatedReunion.id ? updatedReunion : reunion
                    )
                );
                showSuccessAlert("Actualizado", "La reunión ha sido actualizada correctamente.");
            } else {
               
                showErrorAlert("Error", "No se pudo actualizar la reunión.");
            }
        } catch (error) {
            console.error("❌ Error al actualizar reunión:", error);
            showErrorAlert("Error", "No se pudo actualizar la reunión.");
        }
    };

    return { handleUpdate };
}
