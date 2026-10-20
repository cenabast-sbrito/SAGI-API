import multer from "multer";

const storage = multer.memoryStorage();

export const uploadExcel = multer({
    storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB máx
    fileFilter: (_req, file, cb) => {
        const allowedMimes = [
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-excel"
        ];
        if (allowedMimes.includes(file.mimetype) || file.originalname.match(/\.(xlsx|xls)$/i)) {
            cb(null, true);
        } else {
            cb(new Error("Solo se permiten archivos Excel (.xlsx, .xls)"));
        }
    }
});