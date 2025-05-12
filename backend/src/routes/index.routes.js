"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import vecinosRoutes from "./vecinos.routes.js";  // ✅ Importamos la ruta de vecinos

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/vecinos", vecinosRoutes);  // ✅ Registramos la ruta de vecinos

export default router;
