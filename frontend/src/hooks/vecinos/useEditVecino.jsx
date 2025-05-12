import { useState } from 'react';
import { updateVecino } from '@services/vecinos.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import { formatPostUpdate } from '@helpers/formatData.js';

const useEditVecino = (setVecinos) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [dataVecino, setDataVecino] = useState([]);
    
    const handleClickUpdate = () => {
        if (dataVecino.length > 0) {
            setIsPopupOpen(true);
        }
    };

    const handleUpdate = async (updatedVecinoData) => {
        if (updatedVecinoData) {
            try {
                const updatedVecino = await updateVecino(updatedVecinoData, dataVecino[0].rut);
                showSuccessAlert('¡Actualizado!', 'El vecino ha sido actualizado correctamente.');
                setIsPopupOpen(false);
                const formattedVecino = formatPostUpdate(updatedVecino);

                setVecinos(prevVecinos => prevVecinos.map(vecino => {
                    console.log("Vecino actual:", vecino);
                    if (vecino.id === formattedVecino.id) {
                        console.log("Reemplazando con:", formattedVecino);
                    }
                    return vecino.correo === formattedVecino.correo ? formattedVecino : vecino;
                }));

                setDataVecino([]);
            } catch (error) {
                console.error('Error al actualizar el vecino:', error);
                showErrorAlert('Cancelado', 'Ocurrió un error al actualizar el vecino.');
            }
        }
    };

    return {
        handleClickUpdate,
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
        dataVecino,
        setDataVecino
    };
};

export default useEditVecino;
