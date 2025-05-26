import multer from "multer";

const storageComprobantes = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("📂 [Multer] Guardando archivo en:", "uploads/comprobantes");
        cb(null, "uploads/comprobantes");  
    },
    filename: function (req, file, cb) {
        const filename = `${Date.now()}-${file.originalname}`;
        console.log("📂 [Multer] Nombre del archivo asignado:", filename);
        cb(null, filename);
    }
});

const fileFilterComprobantes = (req, file, cb) => {
    console.log("📂 [Multer] Archivo recibido antes de filtrado:", file);
    if (file.mimetype === "image/png") {
        cb(null, true);
    } else {
        console.error("❌ [Multer] Archivo rechazado, solo se permiten PNG:", file.mimetype);
        cb(new Error("Solo se permiten archivos PNG"), false);
    }
};

const uploadComprobantes = multer({ storage: storageComprobantes, fileFilter: fileFilterComprobantes });

export default uploadComprobantes;
