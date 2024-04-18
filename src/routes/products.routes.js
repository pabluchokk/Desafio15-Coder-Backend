import { Router } from "express";
import ProductManagerDB from "../dao/dbManagers/ProductManagerDB.js";
import { isAdmin } from "../middleware/authMiddleware.js"; 
import { generateMockProducts } from "../mock/products.mock.js";
import UserModel from "../dao/models/userModel.js";
import { describe } from "mocha";

const path = "products.json";
const router = Router();
const productManagerDB = new ProductManagerDB(path);
const chai = require('chai')
const expect = chai.expect;
const request = require('supertest');
const app = require('../app.js')

describe('Products API', () => {
    it('Deberia devolver una lista de productos', (done) => {
        request(app)
        .get('/api/products')
        .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
            done();
        })
    })
    
    it('Debería devolver un producto específico por su ID', (done) => {
        request(app)
            .get('/api/products/1')
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.have.property('title');
                expect(res.body).to.have.property('description');
                done();
        });
    });
})

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtiene todos los productos
 *     description: Retorna una lista de todos los productos disponibles.
 *     responses:
 *       '200':
 *         description: Respuesta exitosa
 *       '500':
 *         description: Error interno del servidor
 */

router.get("/", isAdmin, async (req, res)=>{
    try {
        const { limit, page, sort, query } = req.query

        const options = {
            limit: limit ?? 10,
            page: page ?? 1,
            sort: sort ? { price: sort === "asc" ? 1 : -1 } : undefined,
            lean:true
        }

        const products = await productManagerDB.getProducts(options)

        if(products.hasPrevPage){
            products.prevLink = `${req.protocol}://${req.get("host")}${req.baseUrl}?page=${products.prevPage}`
        }
        if(products.hasNextPage){
            products.nextLink = `${req.protocol}://${req.get("host")}${req.baseUrl}?page=${products.nextPage}`
        }
    
        res.render("products", { productos: products.docs })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "error",
            msg: "Error interno del servidor"
        })
    }
})

router.get("/:pid", isAdmin, async (req, res)=>{
    const pid = req.params.pid

    res.send({
        status:"success",
        msg:`Ruta GET ID PRODUCTS con el ID: ${pid}`
    })
})

router.get('/mockingproducts', (req, res) => {
    const mockProducts = generateMockProducts();
    res.json(mockProducts);
});

router.post("/", isAdmin, async (req, res)=>{
    const {
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnails
    } = req.body

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({
        status: "error",
        msg: "Todos los campos son obligatorios, excepto thumbnails.",
        });
    }
const product = {
    title,
    description,
    code,
    price: Number(price),
    status: true,
    stock: Number(stock),
    category,
    thumbnails: thumbnails || [],
}

    const products = await productManagerDB.createProduct(product)

    res.send({
        status:"success",
        msg:"Producto creado",
        productos: products,
    })
})

router.post('/', async (req, res) => {
    const user = req.user
    if (!user.role !== "premium") {
        return res.status(403).json({error: "Solo los usuarios premium pueden crear productos"})
    }
})

router.put("/:pid", isAdmin, async (req, res)=>{
    const pid = req.params.pid;

    const products = await productManagerDB.getProducts();
    const existingProductIndex = products.findIndex(
        (product) => product.id == pid
    )

    const updatedProduct = {
        ...products[existingProductIndex],
        ...req.body,
        id: pid
    }

    products[existingProductIndex] = updatedProduct;

    await productManagerDB.createProduct(products)

    res.send({
        status: "success",
        msg: `Producto con ID ${pid} actualizado`,
        producto: updatedProduct
    })
})


router.delete("/:pid", isAdmin, async (req, res) => {
    const user = req.user; 
    const pid = req.params.pid;

    try {
        const product = await ProductModel.findById(pid);
        if (user.role === 'admin' || (user.role === 'premium' && product.owner.toString() === user._id.toString())) {
            await ProductModel.findByIdAndDelete(pid);
            return res.status(200).json({ message: "Producto eliminado correctamente" });
        } else {
            return res.status(403).json({ error: "No tienes permiso para eliminar este producto" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
});


export {router as productRouter}