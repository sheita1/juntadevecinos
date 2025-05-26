import axios from "./root.service.js";  

export const getReuniones = async () => {
    try {
        const response = await axios.get("/reuniones/");
        return response.data.data;
    } catch (error) {
        console.error("❌ Error al obtener reuniones:", error);
        return [];
    }
};

export const createReunion = async (reunionData) => {
    try {
        const response = await axios.post("/reuniones/", reunionData);
        return response.data.data;
    } catch (error) {
        console.error("❌ Error al crear reunión:", error);
        return null;
    }
};

export const updateReunion = async (id, updatedData) => {
    try {
        const response = await axios.patch(`/reuniones/${id}`, updatedData);  
        return response.data.data;
    } catch (error) {
        console.error("❌ Error al actualizar reunión:", error);
        return null;
    }
};

export const deleteReunion = async (id) => {
    try {
        await axios.delete(`/reuniones/${id}`);
        return true;
    } catch (error) {
        console.error("❌ Error al eliminar reunión:", error);
        return false;
    }
};
