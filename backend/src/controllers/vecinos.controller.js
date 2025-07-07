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
    const { nombre, rut, correo, telefono } = req.body;
    const archivo = req.files?.comprobante?.[0];
    const comprobantePath = archivo?.path || null;

    console.log("📂 [Procesado] Datos antes de guardar en la BD:", {
      nombre,
      rut,
      correo,
      telefono,
      comprobantePath,
    });

    const { error } = vecinoBodyValidation.validate({ nombre, rut, correo, telefono });
    if (error) {
      console.error("❌ [Validación] Error en los datos recibidos:", error.message);
      return handleErrorClient(res, 400, error.message);
    }

    // Verificación duplicado antes de crear
    const [vecinoExistente] = await getVecinoService({ rut, correo });
    if (vecinoExistente) {
      return handleErrorClient(res, 409, "Ya existe un vecino con ese rut o correo.");
    }

    console.log("🛠️ [BD] Enviando datos a `createVecinoService`...");
    const [newVecino, errorCreateVecino] = await createVecinoService({
      nombre,
      rut,
      correo,
      telefono,
      comprobanteDomicilio: comprobantePath,
    });

    if (errorCreateVecino) {
      return handleErrorClient(res, 400, errorCreateVecino);
    }

    handleSuccess(res, 201, "Vecino creado exitosamente", newVecino);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}


export async function getVecino(req, res) {
  try {
    
    const { rut, id, correo } = req.query;
    const { error } = vecinoQueryValidation.validate({ rut, id, correo });

    if (error) {
      return handleErrorClient(res, 400, error.message);
    }

    const [vecino, errorVecino] = await getVecinoService({ rut, id, correo });

    if (errorVecino) {
      return handleErrorClient(res, 404, errorVecino);
    }

    handleSuccess(res, 200, "Vecino encontrado", vecino);
  } catch (error) {
    
    handleErrorServer(res, 500, error.message);
  }
}

export async function getVecinos(req, res) {
  try {
  

    const [vecinos, errorVecinos] = await getVecinosService();

    if (errorVecinos) {
     
      return handleErrorClient(res, 404, errorVecinos);
    }

    
    vecinos.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Vecinos encontrados", vecinos);
  } catch (error) {
   
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateVecino(req, res) {
  try {
    const { rut, id, correo } = req.query;
    const { body } = req;

    
    const comprobanteFilePath = req.file?.path;

    
    const comprobantePath = comprobanteFilePath || body?.comprobante || undefined;

    console.log("📂 [Procesado] Datos antes de actualizar en la BD:", {
      rut,
      id,
      correo,
      body,
      comprobantePath,
    });

    const { error: queryError } = vecinoQueryValidation.validate({ rut, id, correo });
    if (queryError) {
      return handleErrorClient(res, 400, "Error de validación en la consulta", queryError.message);
    }

 
    const cleanedBody = { ...body };
    delete cleanedBody.comprobante;

    const { error: bodyError } = vecinoBodyValidation.validate(cleanedBody);
    if (bodyError) {
      return handleErrorClient(res, 400, "Error de validación en los datos enviados", bodyError.message);
    }

    
    const updatedData = { ...cleanedBody };
    if (comprobantePath) {
      updatedData.comprobanteDomicilio = comprobantePath;
    }

    const [vecino, vecinoError] = await updateVecinoService(
      { rut, id, correo },
      updatedData
    );

    if (vecinoError) {
      return handleErrorClient(res, 400, "Error modificando al vecino", vecinoError);
    }

    handleSuccess(res, 200, "Vecino modificado correctamente", vecino);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}


export async function deleteVecino(req, res) {
  try {
   

    const { rut, id, correo } = req.query;
    const { error: queryError } = vecinoQueryValidation.validate({ rut, id, correo });

    if (queryError) {
      
      return handleErrorClient(res, 400, "Error de validación en la consulta", queryError.message);
    }

    
    const [vecinoDelete, errorVecinoDelete] = await deleteVecinoService({ rut, id, correo });

    if (errorVecinoDelete) {
      
      return handleErrorClient(res, 404, "Error eliminando al vecino", errorVecinoDelete);
    }

    
    handleSuccess(res, 200, "Vecino eliminado correctamente", vecinoDelete);
  } catch (error) {
    
    handleErrorServer(res, 500, error.message);
  }
}
