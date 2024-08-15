import { Router } from 'express'
import ProductController from '../controllers/products.js'
import { isAuthenticated, isAdmin, isPremium, isOwnerOrAdmin } from '../middleware/auth.js'

const router = Router()
const productController = new ProductController()

router.get('/products', productController.getProducts)
router.get('/products/:pid', productController.getProductById)
router.post('/products', isAuthenticated, isPremium, productController.addProduct)
router.put('/products/:pid', isAuthenticated, isOwnerOrAdmin, productController.updateProduct)
router.delete('/products/:pid', isAuthenticated, isOwnerOrAdmin, productController.deleteProduct)

export default router;