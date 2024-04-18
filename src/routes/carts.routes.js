import { Router } from "express";
import CartDAO from "../dao/CartDAO.js";
import { isUser } from "../middleware/authMiddleware.js";
import ProductManagerDB from "../dao/dbManagers/ProductManagerDB.js";
import TicketModel from "../dao/models/ticketModel.js";
import CartManagerDB from "../dao/dbManagers/CartManagerDB.js";
import ProductModel from "../dao/models/ProductsModel.js";

import { generateUniqueCode, calculateTotalAmout } from "../helpers/functions.js"; 

const router = Router();
const cartDAO = new CartDAO();
const productManagerDB = new ProductManagerDB()
const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('../app'); 

describe('Carts API', () => {
    it('Debería devolver una lista de carritos', (done) => {
        request(app)
            .get('/api/carts')
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.be.an('array');
                done();
            });
    });

    it('Debería devolver un carrito específico por su ID', (done) => {
        request(app)
            .get('/api/carts/1')
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.have.property('id');
                done();
            });
    });
});

/**
 * @swagger
 * /api/carts:
 *   get:
 *     summary: Obtiene todos los carritos
 *     description: Retorna una lista de todos los carritos disponibles.
 *     responses:
 *       '200':
 *         description: Respuesta exitosa
 *       '500':
 *         description: Error interno del servidor
 */

router.get("/", async (req, res) => {
    try {
        const carts = await cartDAO.getAllCarts();
        res.json(carts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/:cid", async (req, res) => {
    const cid = req.params.cid;
    try {
        const cart = await cartDAO.getCartById(cid);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/:cid/product/:pid", isUser, async (req, res) => {
    const user = req.user
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity; 
    try {
        const product = await ProductModel.findById(pid)
        if (user.role === 'premium' && product.owner.toString() === user._id.toString()) {
            return res.status(403).json({ error: "No puedes agregar a tu carrito un producto que te pertenece" });
        }
        const updatedCart = await cartDAO.addProductToCart(cid, pid, quantity);
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/:cid/purchase", async (req, res) => {
    try {
        const cid = req.params.cid
        const cart = await CartDAO.getCartById(cid)

        const products = cart.products;
        let canPurchase = true

        for (const item of products) {
            const product = await productManagerDB.getProductById(item.product)
            if(product.stock < item.quantity) {
                canPurchase = false;
                break;
            }
        }

        if (canPurchase) {
            const ticket = new TicketModel({
                code: generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: calculateTotalAmout(cart.products),
                purchaser: req.session.user.email
            });
            await ticket.save();

            for(const item of products){
                const product = await productManagerDB.getProductById(item.product);
                product.stock -= item.quantity
                await product.save()
            }

            await CartManagerDB.clearCart(cid)

            
            res.status(200).json({
                status: "success",
                message: "Compra realizada exitosamente",
                ticket: ticket
            });
        } else {
            res.status(400).json({
                status: "error",
                message: "No hay suficiente stock para completar la compra"
            });
        }
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error interno del servidor"
        });
    }
})

router.post("/", async (req, res) => {
    try {
        const cart = await cartDAO.createCart();
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/:cid", isUser, async (req, res) => {
    const cid = req.params.cid;
    const updatedCartData = req.body; // Suponiendo que los datos actualizados del carrito se envían en el cuerpo de la solicitud
    try {
        const updatedCart = await cartDAO.updateCart(cid, updatedCartData);
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/:cid/products/:pid",isUser, async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity; // Asumiendo que la cantidad se envía en el cuerpo de la solicitud
    try {
        const updatedCart = await cartDAO.updateProductQuantity(cid, pid, quantity);
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:cid", isUser, async (req, res) => {
    const cid = req.params.cid;
    try {
        await cartDAO.deleteCart(cid);
        res.json({ message: `Cart with ID ${cid} deleted successfully` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:cid/products/:pid", isUser, async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    try {
        const updatedCart = await cartDAO.removeProductFromCart(cid, pid);
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



export { router as cartRouter };
