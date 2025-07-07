import axios from './root.service.js';
import { formatVecinoData } from '@helpers/formatData.js';

export async function getVecinos() {
  try {
    const { data } = await axios.get('/vecinos/');
    return data.data.map(formatVecinoData);
  } catch (error) {
    console.error("❌ Error al obtener vecinos:", error);
    return error.response?.data || { message: 'Error al obtener vecinos' };
  }
}

export async function updateVecino(formData, rut) {
  try {
    const { data } = await axios.patch(`/vecinos/detail/?rut=${rut}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  } catch (error) {
    console.error("❌ Error al actualizar vecino:", error);
    throw error;
  }
}

export async function deleteVecino(rut) {
  try {
    const { data } = await axios.delete(`/vecinos/detail/?rut=${rut}`);
    return data;
  } catch (error) {
    console.error("❌ Error al eliminar vecino:", error);
    throw error;
  }
}

export async function createVecino(formData) {
  try {
    const { data } = await axios.post('/vecinos/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  } catch (error) {
    console.error("❌ Error al crear vecino:", error);
    throw error;
  }
}
