"use strict";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import indexRoutes from "./routes/index.routes.js";
import session from "express-session";
import passport from "passport";
import express, { json, urlencoded } from "express";
import path from "path";
import { cookieKey, HOST, PORT } from "./config/configEnv.js";
import { connectDB } from "./config/configDb.js";
import { createUsers } from "./config/initialSetup.js";
import { passportJwtSetup } from "./auth/passport.auth.js";

async function setupServer() {
  try {
    const app = express();

    app.disable("x-powered-by");

    app.use(cors({
      credentials: true,
      origin: true,
    }));

    app.use(cookieParser());
    app.use(morgan("dev"));

    app.use(session({
      secret: cookieKey,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        httpOnly: true,
        sameSite: "strict",
      },
    }));

    app.use(passport.initialize());
    app.use(passport.session());
    passportJwtSetup();

    
    app.use(json({ limit: "1mb" }));
    app.use(urlencoded({ extended: true, limit: "1mb" }));

    
    app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

    
    app.get("/api/test", (req, res) => {
      res.json({ mensaje: "✅ API funcionando correctamente" });
    });

    
    console.log("🔄 Cargando rutas desde indexRoutes...");
    app.use("/api", indexRoutes);

    app.listen(PORT, () => {
      console.log(`✅ Servidor corriendo en ${HOST}:${PORT}/api`);
    });

  } catch (error) {
    console.log("❌ Error en setupServer():", error);
  }
}

async function setupAPI() {
  try {
    await connectDB();
    await setupServer();
    await createUsers();
  } catch (error) {
    console.log("❌ Error en setupAPI():", error);
  }
}

setupAPI()
  .then(() => console.log("🚀 API Iniciada exitosamente"))
  .catch((error) => console.log("❌ Error en setupAPI():", error));
