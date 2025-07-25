"use strict";
import { Router } from "express";
import { login, logout, register } from "../controllers/auth.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();

router
  .post("/login", login)
  .post("/register", register)
  .post("/logout", logout);


export default router;
