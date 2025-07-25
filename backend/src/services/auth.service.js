"use strict";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { comparePassword } from "../helpers/bcrypt.helper.js";
import { ACCESS_TOKEN_SECRET } from "../config/configEnv.js";

export async function loginService(user) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const { email, password } = user;

    console.log("🧾 loginService recibió:", { email, password });
    console.log("🔍 charCodes de password:", Array.from(password).map(c => c.charCodeAt(0)));
    const passwordLimpio = password.trim().normalize();
    console.log("🔍 password sin espacios:", `"${passwordLimpio}"`);

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message,
    });

    const userFound = await userRepository.findOne({ where: { email } });

    if (!userFound) {
      return [null, createErrorMessage("email", "El correo electrónico es incorrecto")];
    }

    console.log("🔍 Comparando con hash:", userFound.password);

    const isMatch = await comparePassword(password, userFound.password);
    console.log("🔐 Resultado desde helper comparePassword:", isMatch);

    if (!isMatch) {
      return [null, createErrorMessage("password", "La contraseña es incorrecta")];
    }

    const payload = {
      nombreCompleto: userFound.nombreCompleto,
      email: userFound.email,
      rut: userFound.rut,
      rol: userFound.rol,
    };

    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    console.log("✅ Login exitoso: token generado");
    return [accessToken, null];
  } catch (error) {
    console.error("❌ Error en loginService:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function registerService(user) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const { nombreCompleto, rut, email, password, rol } = user;

    const createErrorMessage = (dataInfo, message) => ({
      dataInfo,
      message,
    });

    const existingEmailUser = await userRepository.findOne({ where: { email } });
    if (existingEmailUser) {
      return [null, createErrorMessage("email", "Correo electrónico en uso")];
    }

    const existingRutUser = await userRepository.findOne({ where: { rut } });
    if (existingRutUser) {
      return [null, createErrorMessage("rut", "Rut ya asociado a una cuenta")];
    }

    
    const hashedPassword = password;

    const newUser = userRepository.create({
      nombreCompleto,
      email,
      rut,
      password: hashedPassword,
      rol: rol || "usuario",
    });

    await userRepository.save(newUser);
    console.log("✅ Usuario guardado:", newUser);

    const { password: _, ...dataUser } = newUser;
    return [dataUser, null];
  } catch (error) {
    console.error("❌ Error al registrar un usuario:", error);
    return [null, "Error interno del servidor"];
  }
}
