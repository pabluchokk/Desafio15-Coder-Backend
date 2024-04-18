// import fs from 'fs';
// import path from 'path';
// import __dirname from "../../utils.js"

// class ProductManagerFile {
//     constructor(pathFile){
//         this.path = path.join(__dirname, `/files/${pathFile}`)
//     }
//     getProducts = async () => {
//         if(fs.existsSync(this.path)){
//             const data = await fs.promises.readFile(this.path, 'utf-8')
//             const products = JSON.parse(data)
//             return products
//         } else {
//             return []
//         }
//     }
//     createProduct = async(product) => {
//         const products = await this.getProducts()
//         if (products.length === 0) {
//             product.id = 1;
//         } else {
//             product.id = products[products.length-1].id + 1;
//         }
//         products.push(product)
//         await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))
//         return products
//     }
// }

// export {ProductManagerFile};

import ProductModel from "../models/ProductsModel.js"

class ProductManagerFile {
    async getProducts() {
        const products = await ProductModel.find()
        return products
    }

    async getProductById(productId) {
        const product = await ProductModel.findById(productId)
        return product
    }

    async createProduct(product) {
        const newProduct = new ProductModel(product);
        await newProduct.save();
        return newProduct;
    }

    async updateProduct(productId, updatedProduct) {
        const product = await ProductModel.findByIdAndUpdate(
            productId,
            { $set: updatedProduct },
            { new: true }
        )
        return product
    }

    async deleteProduct(productId) {
        const product = await ProductModel.findByIdAndDelete(productId)
        return product;
    }
}

export default ProductManagerFile