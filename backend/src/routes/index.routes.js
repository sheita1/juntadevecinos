"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import vecinosRoutes from "./vecinos.routes.js";  // ✅ Ruta de vecinos
import reunionesRoutes from "./reuniones.routes.js";  // ✅ Nueva ruta de reuniones

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/vecinos", vecinosRoutes)  // ✅ Registramos la ruta de vecinos
    .use("/reuniones", reunionesRoutes);  // ✅ Registramos la ruta de reuniones

export default router;
