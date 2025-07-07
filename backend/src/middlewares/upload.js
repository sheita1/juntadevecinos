import multer from "multer";
import fs from "fs";
import path from "path";


const actasDir = path.join("uploads", "actas");
if (!fs.existsSync(actasDir)) {
    fs.mkdirSync(actasDir, { recursive: true });
    console.log("✅ [Multer] Carpeta creada:", actasDir);
}

const storageActas = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("📂 [Multer] Guardando archivo en:", actasDir);
        cb(null, actasDir);  
    },
    filename: function (req, file, cb) {
        const filename = `${Date.now()}-${file.originalname}`;
        console.log("📂 [Multer] Nombre del archivo asignado:", filename);
        cb(null, filename);
    }
});

const fileFilterActas = (req, file, cb) => {
    console.log("📂 [Multer] Archivo recibido antes de filtrado:", file);
    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        console.error("❌ [Multer] Archivo rechazado, solo se permiten PDFs:", file.mimetype);
        cb(new Error("Solo se permiten archivos PDF"), false);
    }
};

const uploadActas = multer({ storage: storageActas, fileFilter: fileFilterActas });

export default uploadActas;
