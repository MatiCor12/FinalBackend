import { Router } from 'express';
import { addProductInCart, createCart, getCartById, deleteProductsInCart, updateProductsInCart, deleteCart } from '../controllers/carts.js';

const router = Router();

router.get('/:cid',getCartById);
router.post('/',createCart);
router.post('/:cid/product/:pid',addProductInCart);
router.delete('/:cid/products/:pid', deleteProductsInCart);
router.put('/:cid/products/:pid', updateProductsInCart);
router.delete('/:cid', deleteCart)


export default router