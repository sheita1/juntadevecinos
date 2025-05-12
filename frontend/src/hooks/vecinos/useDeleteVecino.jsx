import { deleteVecino } from '@services/vecinos.service.js';
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useDeleteVecino = (fetchVecinos, setDataVecino) => {
    const handleDelete = async (dataVecino) => {
        if (dataVecino.length > 0) {
            try {
                const result = await deleteDataAlert();
                if (result.isConfirmed) {
                    const response = await deleteVecino(dataVecino[0].rut);
                    if(response.status === 'Client error') {
                        return showErrorAlert('Error', response.details);
                    }
                    showSuccessAlert('¡Eliminado!', 'El vecino ha sido eliminado correctamente.');
                    await fetchVecinos();
                    setDataVecino([]);
                } else {
                    showErrorAlert('Cancelado', 'La operación ha sido cancelada.');
                }
            } catch (error) {
                console.error('Error al eliminar el vecino:', error);
                showErrorAlert('Cancelado', 'Ocurrió un error al eliminar el vecino.');
            }
        }
    };

    return {
        handleDelete
    };
};

export default useDeleteVecino;
