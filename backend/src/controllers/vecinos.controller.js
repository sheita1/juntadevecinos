"use strict";
import {
  createVecinoService, 
  deleteVecinoService,
  getVecinoService,
  getVecinosService,
  updateVecinoService,
} from "../services/vecinos.service.js";
import {
  vecinoBodyValidation,
  vecinoQueryValidation,
} from "../validations/vecinos.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

export async function createVecino(req, res) {
  try {
     console.log("🚀 [Backend] Recibiendo solicitud para crear vecino...");
    console.log("🧐 [Headers] Encabezados de la solicitud:", req.headers);
    console.log("🧐 [Content-Type] Tipo de contenido recibido:", req.headers["content-type"]);
    console.log("📥 [Body] Datos enviados desde el frontend:", req.body);
    console.log("📂 [Archivo] req.file:", req.file);

    const { nombre, rut, correo, telefono } = req.body;
    const comprobantePath = req.file ? req.file.path : null;

    console.log("📂 [Procesado] Datos antes de guardar en la BD:", { nombre, rut, correo, telefono, comprobantePath });

    const { error } = vecinoBodyValidation.validate({ nombre, rut, correo, telefono });
    if (error) {
      console.error("❌ [Validación] Error en los datos recibidos:", error.message);
      return handleErrorClient(res, 400, error.message);
    }

    console.log("🛠️ [BD] Enviando datos a `createVecinoService`...");
    const [newVecino, errorCreateVecino] = await createVecinoService({
      nombre, rut, correo, telefono, comprobante: comprobantePath
    });

    if (errorCreateVecino) {
      console.error("❌ [BD] Error al crear vecino:", errorCreateVecino);
      return handleErrorClient(res, 400, errorCreateVecino);
    }

    console.log("✅ [BD] Vecino creado exitosamente:", newVecino);
    handleSuccess(res, 201, "Vecino creado exitosamente", newVecino);
  } catch (error) {
    console.error("❌ [Error] Fallo en `createVecino`:", error);
    handleErrorServer(res, 500, error.message);
  }
}

export async function getVecino(req, res) {
  try {
    console.log("🔍 [Backend] Buscando vecino con filtros:", req.query);
    
    const { rut, id, correo } = req.query;

    const { error } = vecinoQueryValidation.validate({ rut, id, correo });

    if (error) {
      console.error("❌ [Validación] Error en la consulta:", error.message);
      return handleErrorClient(res, 400, error.message);
    }

    const [vecino, errorVecino] = await getVecinoService({ rut, id, correo });

    if (errorVecino) {
      console.error("❌ [BD] Vecino no encontrado:", errorVecino);
      return handleErrorClient(res, 404, errorVecino);
    }

    console.log("✅ [BD] Vecino encontrado:", vecino);
    handleSuccess(res, 200, "Vecino encontrado", vecino);
  } catch (error) {
    console.error("❌ [Error] Fallo en `getVecino`:", error);
    handleErrorServer(res, 500, error.message);
  }
}

export async function getVecinos(req, res) {
  try {
    console.log("🔍 [Backend] Buscando todos los vecinos...");
    
    const [vecinos, errorVecinos] = await getVecinosService();

    if (errorVecinos) {
      console.error("❌ [BD] Error al obtener vecinos:", errorVecinos);
      return handleErrorClient(res, 404, errorVecinos);
    }

    console.log("✅ [BD] Vecinos encontrados:", vecinos.length);
    vecinos.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Vecinos encontrados", vecinos);
  } catch (error) {
    console.error("❌ [Error] Fallo en `getVecinos`:", error);
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateVecino(req, res) {
  try {
    console.log("🔄 [Backend] Recibiendo solicitud de actualización...");
    console.log("📥 [Query] Filtros enviados:", req.query);
    console.log("📂 [Body] Datos enviados desde el frontend:", req.body);
    console.log("📂 [Archivo] req.file:", req.file);

    const { rut, id, correo } = req.query;
    const { body } = req;
    const comprobantePath = req.file ? req.file.path : null;

    console.log("📂 [Procesado] Datos antes de actualizar en la BD:", { rut, id, correo, body, comprobantePath });

    const { error: queryError } = vecinoQueryValidation.validate({ rut, id, correo });

    if (queryError) {
      console.error("❌ [Validación] Error en la consulta:", queryError.message);
      return handleErrorClient(res, 400, "Error de validación en la consulta", queryError.message);
    }

    const { error: bodyError } = vecinoBodyValidation.validate(body);

    if (bodyError) {
      console.error("❌ [Validación] Error en los datos enviados:", bodyError.message);
      return handleErrorClient(res, 400, "Error de validación en los datos enviados", bodyError.message);
    }

    console.log("🛠️ [BD] Enviando datos a `updateVecinoService`...");
    const [vecino, vecinoError] = await updateVecinoService({ rut, id, correo }, { ...body, comprobante: comprobantePath });

    if (vecinoError) {
      console.error("❌ [BD] Error al modificar vecino:", vecinoError);
      return handleErrorClient(res, 400, "Error modificando al vecino", vecinoError);
    }

    console.log("✅ [BD] Vecino modificado correctamente:", vecino);
    handleSuccess(res, 200, "Vecino modificado correctamente", vecino);
  } catch (error) {
    console.error("❌ [Error] Fallo en `updateVecino`:", error);
    handleErrorServer(res, 500, error.message);
  }
}

export async function deleteVecino(req, res) {
  try {
    console.log("🗑️ [Backend] Recibiendo solicitud para eliminar vecino...");
    console.log("📥 [Query] Filtros enviados:", req.query);

    const { rut, id, correo } = req.query;

    const { error: queryError } = vecinoQueryValidation.validate({ rut, id, correo });

    if (queryError) {
      console.error("❌ [Validación] Error en la consulta:", queryError.message);
      return handleErrorClient(res, 400, "Error de validación en la consulta", queryError.message);
    }

    console.log("🛠️ [BD] Enviando datos a `deleteVecinoService`...");
    const [vecinoDelete, errorVecinoDelete] = await deleteVecinoService({ rut, id, correo });

    if (errorVecinoDelete) {
      console.error("❌ [BD] Error al eliminar vecino:", errorVecinoDelete);
      return handleErrorClient(res, 404, "Error eliminando al vecino", errorVecinoDelete);
    }

    console.log("✅ [BD] Vecino eliminado correctamente:", vecinoDelete);
    handleSuccess(res, 200, "Vecino eliminado correctamente", vecinoDelete);
  } catch (error) {
    console.error("❌ [Error] Fallo en `deleteVecino`:", error);
    handleErrorServer(res, 500, error.message);
  }
}
