const UserController = {
    uploadDocument: async (req, res) => {
        try {
            const userId = req.params.uid;
            const file = req.file;

            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            user.documents.push({
                name: file.originalname,
                reference: file.path 
            });
            await user.save();

            res.status(200).json({ message: 'Documento subido exitosamente' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },
    updateUserToPremium: async (req, res) => {
        try {
            const userId = req.params.uid;
    
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
    
            const requiredDocuments = ['Identificación', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];
            const uploadedDocuments = user.documents.map(doc => doc.name);
    
            const missingDocuments = requiredDocuments.filter(doc => !uploadedDocuments.includes(doc));
            if (missingDocuments.length > 0) {
                return res.status(400).json({ error: `Faltan los siguientes documentos: ${missingDocuments.join(', ')}` });
            }
    
            user.role = 'premium';
            await user.save();
    
            res.status(200).json({ message: 'Usuario actualizado a premium exitosamente' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

export default UserController;
