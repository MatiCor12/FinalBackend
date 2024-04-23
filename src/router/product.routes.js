import { Router } from "express";
import ProductManager from '../controllers/ProductManager.js'

const router = Router()
const product = new ProductManager()

router.get('/', async (req, res) => {
    res.send(await product.getProducts())
})

router.get('/:id', async (req, res) => {
    let id = req.params.id
    res.send(await product.getProductsById(id))
})

router.post('/', async (req, res) => {
    let newProduct = req.body
    res.send(await product.addProducts(newProduct))
})

router.put('/:id', async (req, res) => {
    let id = req.params.id
    let updateProduct = req.body
    res.send(await product.updateProducts(id, updateProduct))
})

router.delete('/:id', async (req, res) => {
    let id = req.params.id
    res.send(await product.deleteProducts(id))
})

export default router