import CartModel from "../models/CartModel.js";
import CartDTO from "../DTO/cartDTO.js";

class CartDAO {
    async createCart() {
        try {
            const cart = await CartModel.create({});
            return new CartDTO(cart._id, cart.products, cart.user);
        } catch (error) {
            throw new Error(`Error creating cart: ${error.message}`);
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error(`Cart with ID ${cartId} not found`);
            }
            return new CartDTO(cart._id, cart.products, cart.user);
        } catch (error) {
            throw new Error(`Error fetching cart: ${error.message}`);
        }
    }

}

export default CartDAO;
