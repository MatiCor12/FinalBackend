import ProductService from '../repositories/productsRepository.js';
import CartService from '../repositories/cartsRepository.js';

const productService = new ProductService();
const cartService = new CartService();

export default class ViewsController {
    async getProducts(req, res) {
        try {
            const products = await productService.getProducts();
            res.render('products', { products });
        } catch (error) {
            console.error('Error obtaining the products', error);
            res.status(500).send('Error obtaining the products');
        }
    }

    async getProductById(req, res) {
        const { pid } = req.params;
        try {
            const product = await productService.getProductById(pid);
            if (!product) {
                return res.status(404).send('Product not found');
            }
            res.render('productDetail', { product });
        } catch (error) {
            console.error('Error obtaining the product', error);
            res.status(500).send('Error obtaining the product');
        }
    }

    async addProductToCart(req, res) {
        const { productId, quantity } = req.body;
        try {
            const cart = await cartService.getCartByUserId(req.user._id);
            await cartService.addProductToCart(cart._id, productId, quantity);
            res.redirect('/cart');
        } catch (error) {
            console.error('Error when adding product to cart', error);
            res.status(500).send('Error when adding product to cart');
        }
    }

    async getRealTimeProducts(req, res) {
        try {
            const products = await productService.getProducts();
            res.render('realtimeproducts', { products });
        } catch (error) {
            console.error('Error obtaining the product', error);
            res.status(500).send('Error obtaining the product');
        }
    }

    async getChat(req, res) {
        try {
            res.render('chat');
        } catch (error) {
            console.error('Error loading chat view', error);
            res.status(500).send('Error loading chat view');
        }
    }

    async getLogin(req, res) {
        try {
            res.render('login');
        } catch (error) {
            console.error('Error loading login view', error);
            res.status(500).send('Error loading login view');
        }
    }

    async getRegister(req, res) {
        try {
            res.render('register');
        } catch (error) {
            console.error('Error loading register view', error);
            res.status(500).send('Error loading register view');
        }
    }
}