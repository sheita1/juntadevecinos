"use strict";
import { AppDataSource } from "../config/configDb.js";
import Reunion from "../entity/reunion.entity.js";

export async function createReunionService({ nombre, fecha }) {
    try {
        const reunionRepository = AppDataSource.getRepository(Reunion);
        const nuevaReunion = reunionRepository.create({ nombre, fecha });
        await reunionRepository.save(nuevaReunion);
        return [nuevaReunion, null];
    } catch (error) {
        return [null, error.message];
    }
}

export async function getReunionesService() {
    try {
        const reunionRepository = AppDataSource.getRepository(Reunion);
        const reuniones = await reunionRepository.find();
        return [reuniones, null];
    } catch (error) {
        return [null, error.message];
    }
}

export async function uploadActaService(id, actaPath) {
    try {
        const reunionRepository = AppDataSource.getRepository(Reunion);
        const reunion = await reunionRepository.findOneBy({ id });

        if (!reunion) return [null, "Reunión no encontrada"];

        console.log(`📂 Guardando acta en la reunión ID: ${id} - Ruta: ${actaPath}`);  

        reunion.acta = actaPath;
        await reunionRepository.save(reunion);

        return [reunion, null];
    } catch (error) {
        console.error("❌ Error al guardar el acta:", error);
        return [null, error.message];
    }
}

export async function deleteReunionService(id) {
    try {
        const reunionRepository = AppDataSource.getRepository(Reunion);
        const reunion = await reunionRepository.findOneBy({ id });

        if (!reunion) return [null, "Reunión no encontrada"];

        await reunionRepository.remove(reunion);

        return ["Reunión eliminada correctamente", null];
    } catch (error) {
        return [null, error.message];
    }
}

export async function updateReunionService(id, updatedData) {
    try {
        const reunionRepository = AppDataSource.getRepository(Reunion);
        const reunion = await reunionRepository.findOneBy({ id });

        if (!reunion) return [null, "Reunión no encontrada"];

        console.log(`🔄 Actualizando reunión con ID: ${id}`, updatedData);  

        reunion.nombre = updatedData.nombre || reunion.nombre;
        reunion.fecha = updatedData.fecha || reunion.fecha;
        await reunionRepository.save(reunion);

        return [reunion, null];
    } catch (error) {
        console.error("❌ Error al actualizar reunión:", error);
        return [null, error.message];
    }
}
