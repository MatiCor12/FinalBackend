import Cart from './models/carts.model.js';
import Product from './models/products.model.js';

export default class CartManager {
    async createCart() {
        try {
            const newCart = new Cart();
            await newCart.save();
            return newCart;
        } catch (error) {
            console.error('Error creating cart', error.message);
            throw error;
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await Cart.findById(cartId).populate("items.productId")
            return cart;
        } catch (error) {
            console.error('Error getting cart by ID:', error.message);
            throw error;
        }
    }

    async addItemToCart(cartId, productId, quantity) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Cart not found');
            }

            const product = await Product.findById(productId);
            if (!product) {
                throw new Error('Product not found');
            }

            const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ productId, quantity });
            }

            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error when adding product', error);
            throw error;
        }
    }

    async removeItemFromCart(cartId, productId) {
        try {
            const cart = await Cart.findById(cartId)
            if (!cart) throw new Error('Cart not found');

            cart.items = cart.items.filter(item => item.productId.toString() !== productId);
            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error removing product', error.message);
            throw error;
        }
    }

    async clearCart(cartId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) throw new Error('Cart not found');

            cart.items = [];
            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error emptying cart', error.message);
            throw error;
        }
    }

    async purchaseCart(cartId) {
        try {
            const { cid } = req.params;
            const cart = await Cart.findById(cartId)
            if (!cart) throw new Error('Cart not found');
            cart.items = [];
            await cart.save();
            return { message: 'Purchase successfully processed', cart };
        } catch (error) {
            console.error('Error processing the purchase', error.message);
            throw error;
        }
    }
}