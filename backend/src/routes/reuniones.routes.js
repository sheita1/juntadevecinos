import { Router } from "express";
import upload from "../middlewares/upload.js";  

import {
    createReunion,
    getReuniones,
    uploadActa,  
    deleteReunion,
    updateReunion
} from "../controllers/reuniones.controller.js";

const router = Router();

router.get("/", getReuniones);
router.post("/", createReunion);
router.post("/:id/acta", upload.single("acta"), uploadActa);  
router.delete("/:id", deleteReunion);
router.patch("/:id", updateReunion);

export default router;
