"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
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
router.post("/", createVecino);  
router.patch("/detail/", updateVecino);
router.delete("/detail/", deleteVecino);

export default router;
