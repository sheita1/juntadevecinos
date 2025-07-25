import { Router } from "express";
import upload from "../middlewares/upload.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";

import {
  createReunion,
  getReuniones,
  uploadActa,
  deleteReunion,
  updateReunion,
  eliminarActa
} from "../controllers/reuniones.controller.js";

const router = Router();


router.get("/", authenticateJwt, getReuniones);


router.post("/", authenticateJwt, isAdmin, createReunion);


router.post("/:id/acta", authenticateJwt, isAdmin, upload.single("acta"), uploadActa);

router.delete("/:id/acta", authenticateJwt, isAdmin, eliminarActa);

router.delete("/:id", authenticateJwt, isAdmin, deleteReunion);

router.patch("/:id", authenticateJwt, isAdmin, updateReunion);

export default router;
