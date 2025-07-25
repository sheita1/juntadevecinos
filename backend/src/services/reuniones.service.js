"use strict";
import { AppDataSource } from "../config/configDb.js";
import Reunion from "../entity/reunion.entity.js";

export async function validarReunionPorFecha(fecha) {
  try {
    const repo = AppDataSource.getRepository(Reunion);
    const existente = await repo.findOne({ where: { fecha } });
    return !!existente;
  } catch (error) {
    console.error("❌ [Validar] Error al buscar reunión existente:", error);
    return false;
  }
}

export async function createReunionService({ nombre, fecha, acta, lugar, descripcion }) {
  try {
    const repo = AppDataSource.getRepository(Reunion);
    console.log("🔍 [Crear] Verificando si ya existe una reunión el:", fecha);

    const existe = await validarReunionPorFecha(fecha);
    if (existe) {
      return [null, "Ya hay una reunión registrada en esa fecha y hora"];
    }

    const nuevaReunion = repo.create({
      nombre,
      fecha,
      acta: acta || null,
      lugar: lugar || null,
      descripcion: descripcion || null,
    });

    await repo.save(nuevaReunion);
    return [nuevaReunion, null];
  } catch (error) {
    console.error("❌ [Crear] Error interno:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getReunionesService() {
  try {
    const repo = AppDataSource.getRepository(Reunion);
    const reuniones = await repo.find();
    console.log("📋 [Listar] Reuniones encontradas:", reuniones.length);
    return [reuniones, null];
  } catch (error) {
    console.error("❌ [Listar] Error:", error);
    return [null, error.message];
  }
}

export async function uploadActaService(id, actaPath) {
  try {
    const repo = AppDataSource.getRepository(Reunion);
    const reunion = await repo.findOneBy({ id });

    if (!reunion) return [null, "Reunión no encontrada"];

    console.log(`📂 [Acta] Asociando acta a ID: ${id} - Ruta: ${actaPath}`);
    reunion.acta = actaPath;
    await repo.save(reunion);

    return [reunion, null];
  } catch (error) {
    console.error("❌ [Acta] Error al guardar:", error);
    return [null, error.message];
  }
}

export async function eliminarActaService(id) {
  try {
    const repo = AppDataSource.getRepository(Reunion);
    const reunion = await repo.findOneBy({ id });

    if (!reunion) return [null, "Reunión no encontrada"];

    reunion.acta = null;
    await repo.save(reunion);

    console.log("🗑️ [Acta] Acta eliminada para reunión ID:", id);
    return ["Acta eliminada correctamente", null];
  } catch (error) {
    console.error("❌ [Acta:delete] Error:", error);
    return [null, "Error al eliminar acta"];
  }
}

export async function deleteReunionService(id) {
  try {
    const repo = AppDataSource.getRepository(Reunion);
    const reunion = await repo.findOneBy({ id });

    if (!reunion) return [null, "Reunión no encontrada"];

    await repo.remove(reunion);
    console.log("🗑️ [Eliminar] Reunión eliminada:", reunion);
    return ["Reunión eliminada correctamente", null];
  } catch (error) {
    console.error("❌ [Eliminar] Error:", error);
    return [null, error.message];
  }
}

export async function updateReunionService(id, updatedData) {
  try {
    const repo = AppDataSource.getRepository(Reunion);
    const reunion = await repo.findOneBy({ id });

    if (!reunion) return [null, "Reunión no encontrada"];

    console.log(`🔄 [Actualizar] Reunión ${id}:`, updatedData);

    reunion.nombre = updatedData.nombre || reunion.nombre;
    reunion.fecha = updatedData.fecha || reunion.fecha;
    reunion.lugar = updatedData.lugar || reunion.lugar;
    reunion.descripcion = updatedData.descripcion || reunion.descripcion;

    await repo.save(reunion);
    return [reunion, null];
  } catch (error) {
    console.error("❌ [Actualizar] Error:", error);
    return [null, error.message];
  }
}
