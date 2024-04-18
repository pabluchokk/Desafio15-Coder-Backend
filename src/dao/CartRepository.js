import CartModel from "../dao/models/CartModel.js";

class CartRepository {
    async getAllCarts() {
        try {
            const carts = await CartModel.find();
            return carts;
        } catch (error) {
            throw new Error(`Error al obtener los carritos: ${error.message}`);
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await CartModel.findById(cartId);
            return cart;
        } catch (error) {
            throw new Error(`Error al obtener el carrito con ID ${cartId}: ${error.message}`);
        }
    }

}

export default CartRepository;
