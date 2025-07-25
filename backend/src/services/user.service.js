"use strict";
import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { comparePassword, encryptPassword } from "../helpers/bcrypt.helper.js";


const esHashValido = (value) =>
  typeof value === "string" && value.startsWith("$2a$") && value.length === 60;

export async function createUserService(data) {
  try {
    const { nombreCompleto, rut, email, password, rol } = data;
    const userRepository = AppDataSource.getRepository(User);

    const userExistente = await userRepository.findOne({
      where: [{ rut }, { email }],
    });

    if (userExistente) {
      return [null, "Ya existe un usuario con ese rut o email"];
    }

    const contraseñaFinal = esHashValido(password)
      ? password
      : await encryptPassword(password);

    const nuevoUsuario = userRepository.create({
      nombreCompleto,
      rut,
      email,
      password: contraseñaFinal,
      rol: String(rol || "usuario").toLowerCase().trim(),
    });

    const usuarioCreado = await userRepository.save(nuevoUsuario);
    const { password: _, ...usuarioSinPassword } = usuarioCreado;

    return [usuarioSinPassword, null];
  } catch (error) {
    console.error("❌ Error al crear usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getUserService(query) {
  try {
    const { rut, id, email } = query;
    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOne({
      where: [{ id }, { rut }, { email }],
    });

    if (!userFound) return [null, "Usuario no encontrado"];
    const { password, ...userData } = userFound;

    return [userData, null];
  } catch (error) {
    console.error("❌ Error al obtener usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getUsersService() {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find();

    if (!users || users.length === 0) return [null, "No hay usuarios"];
    const usersData = users.map(({ password, ...user }) => user);

    return [usersData, null];
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateUserService(query, body) {
  try {
    const { id, rut, email } = query;
    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOne({
      where: [{ id }, { rut }, { email }],
    });
    if (!userFound) return [null, "Usuario no encontrado"];

    const duplicado = await userRepository.findOne({
      where: [{ rut: body.rut }, { email: body.email }],
    });

    if (duplicado && duplicado.id !== userFound.id) {
      return [null, "Ya existe un usuario con el mismo rut o email"];
    }

    if (body.password) {
      const matchPassword = await comparePassword(body.password, userFound.password);
      if (!matchPassword) return [null, "La contraseña no coincide"];
    }

    const dataUserUpdate = {
      nombreCompleto: body.nombreCompleto,
      rut: body.rut,
      email: body.email,
      rol: String(body.rol).toLowerCase().trim(),
      updatedAt: new Date(),
    };

    if (body.newPassword && body.newPassword.trim() !== "") {
      dataUserUpdate.password = await encryptPassword(body.newPassword);
    }

    await userRepository.update({ id: userFound.id }, dataUserUpdate);

    const userActualizado = await userRepository.findOne({ where: { id: userFound.id } });
    if (!userActualizado) return [null, "Usuario no encontrado después de actualizar"];

    const { password, ...userUpdated } = userActualizado;
    return [userUpdated, null];
  } catch (error) {
    console.error("❌ Error al actualizar usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteUserService(query) {
  try {
    const { id, rut, email } = query;
    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOne({
      where: [{ id }, { rut }, { email }],
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    const rol = String(userFound.rol).toLowerCase().trim();
    if (rol === "administrador") {
      return [null, "No se puede eliminar un usuario con rol de administrador"];
    }

    const userDeleted = await userRepository.remove(userFound);
    const { password, ...dataUser } = userDeleted;

    return [dataUser, null];
  } catch (error) {
    console.error("❌ Error al eliminar usuario:", error);
    return [null, "Error interno del servidor"];
  }
}
