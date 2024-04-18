import ProductModel from "./models/ProductsModel.js";

class ProductRepository {
    async getAllProducts() {
        try {
            const products = await ProductModel.find();
            return products;
        } catch (error) {
            throw new Error(`Error al obtener los productos: ${error.message}`);
        }
    }

    async getProductById(productId) {
        try {
            const product = await ProductModel.findById(productId);
            return product;
        } catch (error) {
            throw new Error(`Error al obtener el producto con ID ${productId}: ${error.message}`);
        }
    }
}

export default ProductRepository;