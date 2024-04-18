import multer from "multer";

const uploadDestinations = {
    profile: 'uploads/profiles',
    product: 'uploads/products',
    document: 'uploads/documents'
};

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const { type } = req.body; // Asegúrate de enviar el tipo de archivo desde el cliente (perfil, producto o documento)
            const destination = uploadDestinations[type] || 'uploads'; // Por defecto, guarda en 'uploads' si no se especifica un tipo válido
            cb(null, destination);
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    })
});
