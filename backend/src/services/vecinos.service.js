"use strict";
import Vecino from "../entity/vecinos.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function createVecinoService({ nombre, rut, correo, telefono, comprobanteDomicilio }) {
  try {
    const vecinoRepository = AppDataSource.getRepository(Vecino);

    
    const existingVecino = await vecinoRepository.findOne({
      where: [{ rut }, { correo }],
    });

    if (existingVecino) return [null, "El vecino ya existe"];

    
    const newVecino = vecinoRepository.create({
      nombre,
      rut,
      correo,
      telefono,
      comprobanteDomicilio,
    });

    await vecinoRepository.save(newVecino);

    return [newVecino, null];  
  } catch (error) {
    console.error("Error al crear vecino:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getVecinoService(query) {
  try {
    const { rut, id, correo } = query;

    const vecinoRepository = AppDataSource.getRepository(Vecino);

    const vecinoFound = await vecinoRepository.findOne({
      where: [{ id }, { rut }, { correo }],
    });

    if (!vecinoFound) return [null, "Vecino no encontrado"];

    return [vecinoFound, null];
  } catch (error) {
    console.error("Error al obtener vecino:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getVecinosService() {
  try {
    const vecinoRepository = AppDataSource.getRepository(Vecino);

    const vecinos = await vecinoRepository.find();

    if (!vecinos || vecinos.length === 0) return [null, "No hay vecinos"];

    return [vecinos, null];
  } catch (error) {
    console.error("Error al obtener vecinos:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateVecinoService(query, body) {
  try {
    const { id, rut, correo } = query;

    const vecinoRepository = AppDataSource.getRepository(Vecino);

    const vecinoFound = await vecinoRepository.findOne({
      where: [{ id }, { rut }, { correo }],
    });

    if (!vecinoFound) return [null, "Vecino no encontrado"];

    const existingVecino = await vecinoRepository.findOne({
      where: [{ rut: body.rut }, { correo: body.correo }],
    });

    if (existingVecino && existingVecino.id !== vecinoFound.id) {
      return [null, "Ya existe un vecino con el mismo rut o correo"];
    }

    const dataVecinoUpdate = {
      nombre: body.nombre,
      rut: body.rut,
      correo: body.correo,
      telefono: body.telefono,
      comprobanteDomicilio: body.comprobanteDomicilio,
      updatedAt: new Date(),
    };

    await vecinoRepository.update({ id: vecinoFound.id }, dataVecinoUpdate);

    const vecinoData = await vecinoRepository.findOne({
      where: { id: vecinoFound.id },
    });

    return [vecinoData, null];
  } catch (error) {
    console.error("Error al modificar vecino:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteVecinoService(query) {
  try {
    const { id, rut, correo } = query;

    const vecinoRepository = AppDataSource.getRepository(Vecino);

    const vecinoFound = await vecinoRepository.findOne({
      where: [{ id }, { rut }, { correo }],
    });

    if (!vecinoFound) return [null, "Vecino no encontrado"];

    const vecinoDeleted = await vecinoRepository.remove(vecinoFound);

    return [vecinoDeleted, null];
  } catch (error) {
    console.error("Error al eliminar vecino:", error);
    return [null, "Error interno del servidor"];
  }
}
