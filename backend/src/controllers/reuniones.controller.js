"use strict";
import {
    createReunionService,
    getReunionesService,
    uploadActaService,
    deleteReunionService,
    updateReunionService  
} from "../services/reuniones.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export async function createReunion(req, res) {
    try {
        const { nombre, fecha } = req.body;

        if (!nombre || !fecha) {
            console.warn("⚠️ Datos incompletos: Nombre y fecha son obligatorios.");
            return handleErrorClient(res, 400, "Nombre y fecha son obligatorios.");
        }

        console.log(`🆕 Creando reunión: ${nombre} - Fecha: ${fecha}`);

        const [nuevaReunion, errorCreateReunion] = await createReunionService({ nombre, fecha });

        if (errorCreateReunion) {
            console.error("❌ Error al crear reunión:", errorCreateReunion);
            return handleErrorClient(res, 400, errorCreateReunion);
        }

        console.log("✅ Reunión creada exitosamente:", nuevaReunion);
        handleSuccess(res, 201, "Reunión creada exitosamente", nuevaReunion);
    } catch (error) {
        console.error("❌ Error interno al crear reunión:", error);
        handleErrorServer(res, 500, error.message);
    }
}

export async function getReuniones(req, res) {
    try {
        console.log("🔍 Obteniendo todas las reuniones...");

        const [reuniones, errorReuniones] = await getReunionesService();

        if (errorReuniones) {
            console.error("❌ Error al obtener reuniones:", errorReuniones);
            return handleErrorClient(res, 404, errorReuniones);
        }

        console.log("✅ Reuniones obtenidas:", reuniones.length);
        handleSuccess(res, 200, "Reuniones encontradas", reuniones);
    } catch (error) {
        console.error("❌ Error interno al obtener reuniones:", error);
        handleErrorServer(res, 500, error.message);
    }
}

export async function uploadActa(req, res) {
    try {
        const { id } = req.params;
        const actaPath = req.file ? req.file.path : null;

        if (!actaPath) {
            console.warn("⚠️ No se proporcionó un archivo PDF.");
            return handleErrorClient(res, 400, "El archivo PDF es obligatorio.");
        }

        console.log(`📂 Subiendo acta para reunión con ID: ${id} - Archivo: ${actaPath}`);

        const [reunion, errorUploadActa] = await uploadActaService(id, actaPath);

        if (errorUploadActa) {
            console.error("❌ Error al subir acta:", errorUploadActa);
            return handleErrorClient(res, 400, errorUploadActa);
        }

        console.log("✅ Acta subida correctamente:", reunion);
        handleSuccess(res, 200, "Acta subida correctamente", reunion);
    } catch (error) {
        console.error("❌ Error interno al subir acta:", error);
        handleErrorServer(res, 500, error.message);
    }
}

export async function deleteReunion(req, res) {
    try {
        const { id } = req.params;

        

        const [mensaje, errorDeleteReunion] = await deleteReunionService(id);

        if (errorDeleteReunion) {
            console.error("❌ Error al eliminar reunión:", errorDeleteReunion);
            return handleErrorClient(res, 404, errorDeleteReunion);
        }

        
        handleSuccess(res, 200, mensaje);
    } catch (error) {
        
        handleErrorServer(res, 500, error.message);
    }
}

export async function updateReunion(req, res) {
    try {
        const { id } = req.params;
        const { nombre, fecha } = req.body;

        if (!nombre || !fecha) {
            console.warn("⚠️ Datos incompletos: Nombre y fecha son obligatorios.");
            return handleErrorClient(res, 400, "Nombre y fecha son obligatorios.");
        }

        

        const [reunionActualizada, errorUpdateReunion] = await updateReunionService(id, { nombre, fecha });

        if (errorUpdateReunion) {
            console.error("❌ Error al actualizar reunión:", errorUpdateReunion);
            return handleErrorClient(res, 404, errorUpdateReunion);
        }

        console.log("✅ Reunión actualizada correctamente:", reunionActualizada);
        handleSuccess(res, 200, "Reunión actualizada correctamente", reunionActualizada);
    } catch (error) {
        console.error("❌ Error interno al actualizar reunión:", error);
        handleErrorServer(res, 500, error.message);
    }
}
