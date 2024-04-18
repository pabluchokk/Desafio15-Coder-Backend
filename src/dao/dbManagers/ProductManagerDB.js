import ProductModel from "../models/ProductsModel.js";
import ProductDAO from "../productDAO/ProductDAO.js";

class ProductManagerDB {
    constructor() {
        this.productDAO = new ProductDAO()
    }

    getProducts = async (options, query) => {
        const filter = query ? { category: query.category, status: query.status } : {};

        const products = await ProductModel.paginate(filter, options)

        const result = {
            status: "success",
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `${options.baseUrl}?page=${products.prevPage}` : null,
            nextLink: products.hasNextPage ? `${options.baseUrl}?page=${products.nextPage}` : null,
        };

        return result;
    }

    async getProductById(productId) {
        return this.productDAO.findById(productId);
    }

    async createProduct(productData) {
        return this.productDAO.create(productData);
    }

    deleteProduct = async (pid) => {
        try {
            const deletedProduct = await ProductModel.findByIdAndDelete(pid)

            if (!deletedProduct) {
                return {
                    status: "error",
                    msg: `No se encontro el producto con ID: ${pid}`
                }
            }

            return {
                status: "success",
                msg: `El producto con ID ${pid} fue eliminado exitosamente`,
                product: deletedProduct
            }
        } catch (error) {
            console.log(error)
            return {
                status: "error",
                msg: `Error al eliminar el producto con ID ${pid}`
            }
        }
    }
}

export default ProductManagerDB