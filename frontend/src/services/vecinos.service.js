import axios from './root.service.js';
import { formatVecinoData } from '@helpers/formatData.js';

export async function getVecinos() {
    try {
        const { data } = await axios.get('/vecinos/');
        const formattedData = data.data.map(formatVecinoData);
        return formattedData;
    } catch (error) {
        return error.response.data;
    }
}

export async function updateVecino(data, rut) {
    try {
        const response = await axios.patch(`/vecinos/detail/?rut=${rut}`, data);
        console.log(response);
        return response.data.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
}

export async function deleteVecino(rut) {
    try {
        const response = await axios.delete(`/vecinos/detail/?rut=${rut}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function createVecino(data) {
    try {
        const response = await axios.post('/vecinos/', data);
        return response.data.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
}
