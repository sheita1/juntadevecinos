"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import vecinosRoutes from "./vecinos.routes.js";  
import reunionesRoutes from "./reuniones.routes.js"; 

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/vecinos", vecinosRoutes)  
    .use("/reuniones", reunionesRoutes); 

export default router;
