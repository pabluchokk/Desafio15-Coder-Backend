import ProductModel from '../models/ProductModel.js';

class ProductDAO {
    async create(productData) {
        try {
            const product = await ProductModel.create(productData);
            return product;
        } catch (error) {
            throw new Error(`Error al crear el producto en la base de datos: ${error.message}`);
        }
    }

    async findById(productId) {
        try {
            const product = await ProductModel.findById(productId);
            return product;
        } catch (error) {
            throw new Error(`Error al encontrar el producto en la base de datos: ${error.message}`);
        }
    }
}

export default ProductDAO;
