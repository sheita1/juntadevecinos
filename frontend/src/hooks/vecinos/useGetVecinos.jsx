import { useState, useEffect } from 'react';
import { getVecinos } from '@services/vecinos.service.js';

const useVecinos = () => {
    const [vecinos, setVecinos] = useState([]);

    const fetchVecinos = async () => {
        try {
            const response = await getVecinos();
            const formattedData = response.map(vecino => ({
                nombre: vecino.nombre,
                rut: vecino.rut,
                correo: vecino.correo,
                telefono: vecino.telefono,
                comprobanteDomicilio: vecino.comprobanteDomicilio,
                createdAt: vecino.createdAt
            }));
            dataLogged(formattedData);
            setVecinos(formattedData);
        } catch (error) {
            console.error("Error: ", error);
        }
    };

    useEffect(() => {
        fetchVecinos();
    }, []);

    const dataLogged = (formattedData) => {
        try {
            const { rut } = JSON.parse(sessionStorage.getItem('usuario'));
            for(let i = 0; i < formattedData.length; i++) {
                if(formattedData[i].rut === rut) {
                    formattedData.splice(i, 1);
                    break;
                }
            }
        } catch (error) {
            console.error("Error: ", error);
        }
    };

    return { vecinos, fetchVecinos, setVecinos };
};

export default useVecinos;
