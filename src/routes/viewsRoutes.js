import { Router } from 'express';
import { getProductsService } from '../services/products.js';
import { getCartByIdService } from '../services/carts.js';

const router = Router()

router.get('/',async (req, res)=> {
    const {payload} = await getProductsService({})
    return res.render('home', { productos: payload, title: 'Home'})
})

router.get('/realtimeproducts',(req, res)=>{
    return res.render('realTimeProducts', {title: 'Real time'})
})

router.get('/chat',(req, res)=>{
    return res.render('chat', {title: 'Chat'})
})

router.get('/products', async(req,res)=>{
    const result = await getProductsService({...req.query})
    return res.render('products', {title:'productos', result})
})

router.get('/cart/:cid', async (req,res)=>{
    const {cid} = req.params
    const carrito = await getCartByIdService(cid);
    return res.render('cart', {title: 'carrito', carrito})
})

export default router