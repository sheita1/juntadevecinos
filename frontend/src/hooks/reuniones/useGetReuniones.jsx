import { useState, useEffect } from "react";
import { getReuniones } from "../../services/reuniones.service.js";

export default function useReuniones() {
  const [reuniones, setReuniones] = useState([]);

  const cargarReuniones = async () => {
    try {
      const data = await getReuniones(); 
      setReuniones(data || []);
    } catch (error) { 
      setReuniones([]);
    }
  };

  useEffect(() => {
    cargarReuniones();
  }, []);

  return { reuniones, setReuniones, cargarReuniones };
}
