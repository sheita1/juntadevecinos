import { useState, useEffect } from 'react';
import { getVecinos } from '@services/vecinos.service.js';
import { buildApiEndpoint } from '@helpers/urlHelper';

const useVecinos = () => {
  const [vecinos, setVecinos] = useState([]);

  const fetchVecinos = async () => {
    try {
      const url = buildApiEndpoint("/vecinos");
      const response = await getVecinos();

      if (!Array.isArray(response)) return;

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
      if (error.response) {
        
      }
    }
  };

  useEffect(() => {
    fetchVecinos();
  }, []);

  const dataLogged = (formattedData) => {
    try {
      const usuario = sessionStorage.getItem('usuario');
      const { rut } = JSON.parse(usuario);

      for (let i = 0; i < formattedData.length; i++) {
        if (formattedData[i].rut === rut) {
          formattedData.splice(i, 1);
          break;
        }
      }
    } catch (error) {
      
    }
  };

  return { vecinos, fetchVecinos, setVecinos };
};

export default useVecinos;
