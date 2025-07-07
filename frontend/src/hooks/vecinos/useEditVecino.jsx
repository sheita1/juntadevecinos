import { useState } from 'react';
import { updateVecino } from '@services/vecinos.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import { formatVecinoData } from '@helpers/formatData.js';

const useEditVecino = (setVecinos) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [dataVecino, setDataVecino] = useState([]);

  const handleClickUpdate = () => {
    if (dataVecino.length > 0) {
      setIsPopupOpen(true);
    }
  };

  const handleUpdate = async (updatedVecinoData) => {
    if (updatedVecinoData && dataVecino.length > 0) {
      try {
        const formData = new FormData();

        const nombreLimpio = updatedVecinoData?.nombre?.trim();
        const rutLimpio = updatedVecinoData?.rut?.trim();
        const correoLimpio = updatedVecinoData?.correo?.trim();
        const telefonoLimpio = updatedVecinoData?.telefono?.trim();
        const archivo = updatedVecinoData?.comprobanteDomicilio;

        if (nombreLimpio) formData.append('nombre', nombreLimpio);
        if (rutLimpio) formData.append('rut', rutLimpio);
        if (correoLimpio) formData.append('correo', correoLimpio);
        if (telefonoLimpio) formData.append('telefono', telefonoLimpio);

        if (archivo instanceof File) {
          formData.append('comprobante', archivo);
        } else if (!formData.has('comprobante') && dataVecino[0].comprobanteDomicilio) {
          formData.append('comprobante', dataVecino[0].comprobanteDomicilio);
        }

        console.log("📤 FormData para enviar:");
        for (const [key, value] of formData.entries()) {
          console.log(`${key}:`, value);
        }

        const updatedVecino = await updateVecino(formData, dataVecino[0].rut);

        showSuccessAlert('¡Actualizado!', 'El vecino ha sido actualizado correctamente.');
        setIsPopupOpen(false);

        const formattedVecino = formatVecinoData(updatedVecino);
        setVecinos((prev) =>
          prev.map((vecino) =>
            vecino.rut === formattedVecino.rut ? formattedVecino : vecino
          )
        );

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
    setDataVecino,
  };
};

export default useEditVecino;
