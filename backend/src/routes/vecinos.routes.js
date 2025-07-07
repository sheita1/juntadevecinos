"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import uploadComprobantes from "../middlewares/uploadComprobantes.js";
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

router.post(
  "/",
  (req, res, next) => {
    console.log("🛬 [Ruta POST /vecinos] Ingreso...");
    console.log("🔬 HEADERS content-type:", req.headers["content-type"]);
    next();
  },
  uploadComprobantes.fields([
    { name: "comprobante", maxCount: 1 },
    { name: "nombre" },
    { name: "rut" },
    { name: "correo" },
    { name: "telefono" },
  ]),
  (req, res, next) => {
    const archivo = req.files?.comprobante?.[0];
    console.log("📂 [Archivo recibido]:", archivo?.filename || "❌ Ninguno");
    console.log("📄 [Datos del vecino]:", req.body || "❌ Vacío");
    next();
  },
  createVecino
);

router.patch(
  "/detail/",
  (req, res, next) => {
    console.log("🔧 [Ruta PATCH /vecinos/detail] Ingreso para editar...");
    console.log("🔬 HEADERS content-type:", req.headers["content-type"]);
    next();
  },
  uploadComprobantes.fields([
    { name: "comprobante", maxCount: 1 },
    { name: "nombre" },
    { name: "rut" },
    { name: "correo" },
    { name: "telefono" },
  ]),
  (req, res, next) => {
    const archivo = req.files?.comprobante?.[0];
    console.log("📂 [Archivo recibido al editar]:", archivo?.filename || "❌ Ninguno");
    console.log("📄 [Datos del vecino a editar]:", req.body || "❌ Vacío");
    next();
  },
  updateVecino
);

router.delete("/detail/", deleteVecino);

export default router;
