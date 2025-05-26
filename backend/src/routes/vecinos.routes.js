"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import uploadComprobantes from "../middlewares/uploadComprobantes.js";  // ✅ Importación manteniendo el mismo estilo
import {
  createVecino,  
  deleteVecino,
  getVecino,
  getVecinos,
  updateVecino,
} from "../controllers/vecinos.controller.js";

const router = Router();

router.get("/", getVecinos);
router.get("/detail/", getVecino);

router.post("/", (req, res, next) => {
    console.log("🚀 [Middleware] Procesando subida de archivo con `multer`...");
    console.log("📥 [Body] Datos enviados desde el frontend:", req.body);
    next();
}, uploadComprobantes.single("comprobanteDomicilio"), (req, res, next) => {
    console.log("📂 [Archivo] req.file después de `multer`:", req.file);
    console.log("📥 [Body] Datos después de `multer`:", req.body);
    next();
}, createVecino);  // ✅ Ahora maneja archivos PNG

router.patch("/detail/", updateVecino);
router.delete("/detail/", deleteVecino);

export default router;
