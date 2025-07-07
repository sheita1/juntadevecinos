import multer from "multer";
import fs from "fs";
import path from "path";


const comprobantesDir = path.join("uploads", "comprobantes");

if (!fs.existsSync(comprobantesDir)) {
  fs.mkdirSync(comprobantesDir, { recursive: true });
  console.log("✅ [Multer] Carpeta creada:", comprobantesDir);
}

const storageComprobantes = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("📂 [Multer] Guardando comprobante en:", comprobantesDir);
    cb(null, comprobantesDir);
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    console.log("📂 [Multer] Nombre del archivo asignado:", filename);
    cb(null, filename);
  }
});

const fileFilterComprobantes = (req, file, cb) => {
  console.log("📩 [Multer] Archivo recibido antes de filtrado:", file);
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    console.error("❌ [Multer] Archivo rechazado, solo PDFs permitidos:", file.mimetype);
    cb(new Error("Solo se permiten archivos PDF"), false);
  }
};

const uploadComprobantes = multer({
  storage: storageComprobantes,
  fileFilter: fileFilterComprobantes
});

export default uploadComprobantes;
