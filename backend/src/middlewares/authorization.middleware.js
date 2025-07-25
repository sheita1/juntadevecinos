import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";
import {
  handleErrorClient,
  handleErrorServer,
} from "../handlers/responseHandlers.js";

export async function isAdmin(req, res, next) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOneBy({ email: req.user.email });

    if (!userFound) {
      console.warn("❌ Usuario no encontrado:", req.user?.email);
      return handleErrorClient(
        res,
        404,
        "Usuario no encontrado en la base de datos"
      );
    }

    const rolUser = String(userFound.rol || "").trim().toLowerCase();
    console.log("🔒 Rol decodificado:", rolUser);

    if (rolUser !== "administrador") {
      return handleErrorClient(
        res,
        403,
        "Acceso denegado",
        "Solo usuarios con rol 'administrador' pueden acceder a este recurso."
      );
    }

    next();
  } catch (error) {
    console.error("💥 Error en isAdmin middleware:", error);
    handleErrorServer(res, 500, error.message);
  }
}
