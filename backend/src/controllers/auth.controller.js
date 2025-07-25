"use strict";
import { loginService, registerService } from "../services/auth.service.js";
import {
  authValidation,
  registerValidation,
} from "../validations/auth.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

export async function login(req, res) {
  try {
   
    console.log("🔥 headers → Content-Type:", req.headers["content-type"]);
    console.log("🧾 req.body completo:", req.body);

    const { correo, email, password } = req.body || {};
    const credentials = {
      email: email || correo,
      password
    };

    console.log("📨 Credenciales construidas:", credentials);

    const { error } = authValidation.validate(credentials);
    if (error) {
      console.log("❗ Error de validación Joi:", error.details?.[0]?.message);
      return handleErrorClient(res, 400, "Error de validación", error.message);
    }

    const [accessToken, errorToken] = await loginService(credentials);

    if (errorToken) {
      console.log("❌ Error al iniciar sesión:", errorToken);
      return handleErrorClient(res, 400, "Error iniciando sesión", errorToken);
    }

    res.cookie("jwt", accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    console.log("✅ Login exitoso: Token generado");
    handleSuccess(res, 200, "Inicio de sesión exitoso", { token: accessToken });
  } catch (error) {
    console.error("💥 Excepción inesperada en login:", error);
    handleErrorServer(res, 500, error.message);
  }
}

export async function register(req, res) {
  try {
    console.log("📝 req.body recibido en register:", req.body);

    const { body } = req;
    const { error } = registerValidation.validate(body);

    if (error) {
      console.log("❗ Error de validación en registro:", error.details?.[0]?.message);
      return handleErrorClient(res, 400, "Error de validación", error.message);
    }

    const [newUser, errorNewUser] = await registerService(body);

    if (errorNewUser) {
      console.log("❌ Error creando usuario:", errorNewUser);
      return handleErrorClient(res, 400, "Error registrando al usuario", errorNewUser);
    }

    console.log("✅ Registro exitoso:", newUser.email);
    handleSuccess(res, 201, "Usuario registrado con éxito", newUser);
  } catch (error) {
    console.error("💥 Excepción inesperada en register:", error);
    handleErrorServer(res, 500, error.message);
  }
}

export async function logout(req, res) {
  try {
    console.log("👋 Cerrando sesión, cookies antes:", req.cookies?.jwt);
    res.clearCookie("jwt", { httpOnly: true });
    handleSuccess(res, 200, "Sesión cerrada exitosamente");
  } catch (error) {
    console.error("💥 Excepción inesperada en logout:", error);
    handleErrorServer(res, 500, error.message);
  }
}
