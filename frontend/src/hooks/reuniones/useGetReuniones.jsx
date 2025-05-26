import { useState, useEffect } from "react";
import { getReuniones } from "../../services/reuniones.service.js";

export default function useReuniones() {
    const [reuniones, setReuniones] = useState([]);

    useEffect(() => {
        cargarReuniones();
    }, []);

    const cargarReuniones = async () => {
        const data = await getReuniones();
        setReuniones(data);
    };

    return { reuniones, setReuniones, cargarReuniones };
}
