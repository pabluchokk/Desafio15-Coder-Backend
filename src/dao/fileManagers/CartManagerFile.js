// import fs from 'fs';
// import path from 'path';
import __dirname from "../../utils.js";
import { CartModel } from '../models/CartModel.js';

// class CartManagerFile {
//     constructor(pathFile){
//         this.path = path.join(__dirname, `/files/${pathFile}`)
//     }
//     getCarts = async () => {
//         if(fs.existsSync(this.path)){
//             const data = await fs.promises.readFile(this.path, 'utf-8')
//             const carts = JSON.parse(data)
//             return carts
//         } else {
//             return []
//         }
//     }

//     createCart = async () => {
//         await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'))
//     }
// }

// export{CartManagerFile};

class CartManagerFile {
    async getCarts() {
        try {
            const carts = await CartModel.find();
            return carts
        } catch (error) {
            throw new Error(`Error al obtener carritos: ${error.message}`)
        }
    }

    async getCartById(cartId) {
        try {
            const cart = CartModel.findById(cartId)
            if (!cart) {
                throw new Error(`Carrito con ID ${cartId} no encontrado`)
            }
            cart.products.push(productId)

            await cart.save()
            return cart
        } catch (error) {
            throw new Error(`Error al agregar el producto al carrito: ${error.message}`)
        }
    }

    async removeFromCart (productId) {
            const index = cart.products.indexOf(productId)
            if(index !== -1) {
                cart.products.splice(index, 1)
            }
            await cart.save()
            return cart;
        } 
}

export { CartManagerFile }