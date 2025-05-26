import { deleteReunion } from "../../services/reuniones.service.js";
import { showSuccessAlert, showErrorAlert } from "@helpers/sweetAlert.js";

export default function useDeleteReunion(cargarReuniones, setDataReunion) {
    const handleDelete = async (id) => {
        try {
            const success = await deleteReunion(id);
            if (success) {
                showSuccessAlert("Eliminado", "La reunión ha sido eliminada correctamente.");
                cargarReuniones();
                setDataReunion(null);
            } else {
                showErrorAlert("Error", "No se pudo eliminar la reunión.");
            }
        } catch (error) {
            console.error("Error al eliminar reunión:", error);
            showErrorAlert("Error", "No se pudo eliminar la reunión.");
        }
    };

    return { handleDelete };
}
