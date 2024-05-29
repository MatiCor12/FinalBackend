import { Router } from 'express';
import { getProductsModerate } from '../moderate/products.js';
import { getCartByIdModerate } from '../moderate/carts.js';

const router = Router()

router.get('/',async (req, res)=> {
    const {payload} = await getProductsModerate({})
    return res.render('home', { productos: payload, title: 'Home'})
})

router.get('/realtimeproducts',(req, res)=>{
    return res.render('realTimeProducts', {title: 'Real time'})
})

router.get('/products', async(req,res)=>{
    const result = await getProductsModerate({...req.query})
    return res.render('products', {title:'productos', result})
})

router.get('/cart/:cid', async (req,res)=>{
    const {cid} = req.params
    const carrito = await getCartByIdModerate(cid);
    return res.render('cart', {title: 'carrito', carrito})
})

export default router