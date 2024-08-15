import nodemailer from 'nodemailer';
import CartService from '../repositories/cartsRepository.js';
import Ticket from '../dao/models/ticket.model.js'

const cartService = new CartService();

export default class CartController {
    async createCart(req, res) {
        try {
            const newCart = await cartService.createCart();
            res.status(201).json(newCart);
        } catch (error) {
            console.error('Error creating cart', error);
            res.status(500).json({ error: 'Error creating cart'});
        }
    }

    async getCartById(req, res) {
        try {
            const cartId = req.user.cart._id;
            const cart = await cartService.getCartById(cartId);
            if (!cart) {
                return res.status(404).json({ error: 'Cart not found' });
            }
            res.render('cart', { cart });
        } catch (error) {
            console.error('Error getting cart', error);
            res.status(500).json({ error: 'Error getting cart' });
        }
    }

    async purchaseCart(req, res) {
        try {
            const { cid } = req.params;
            const cart = await cartService.getCartById(cid);
            if (!cart) {
                return res.status(404).send('Cart not found');
            }
    
            const amount = cart.items.reduce((total, item) => total + (item.productId.price * item.quantity), 0);
            const ticket = {
                amount,
                purchaser: req.user.email
            };
    
            res.render('purchase', { cart, ticket });
        } catch (error) {
            console.error('Error getting purchase details', error);
            res.status(500).send('Error getting purchase details');
        }
    }

    async addItemToCart(req, res) {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;
            const user = req.session.user;
            const updatedCart = await cartService.addItemToCart(cid, pid, quantity, user);
            res.status(200).json(updatedCart);
        } catch (error) {
            console.error('Error when adding product to cart', error.message);
            res.status(500).json({ error: 'Error when adding product to cart' });
        }
    }

    async payForCart(req, res) {
        try {
            const { cid } = req.params;
            const cart = await cartService.getCartById(cid);
            if (!cart) {
                return res.status(404).send('Cart not found');
            }
            cart.items = [];
            await cart.save();
            res.status(200).send('Purchase made');
        } catch (error) {
            console.error('Error when making purchase:', error);
            res.status(500).send('Error when making purchase');
        }
    }

    async sendReceipt(req, res) {
        try {
            const { cid } = req.params;
            const cart = await cartService.getCartById(cid);
            if (!cart) {
                return res.status(404).send('Cart not found');
            }
            const amount = cart.items.reduce((total, item) => total + (item.productId.price * item.quantity), 0);
            const ticket = new Ticket({
                amount,
                purchaser: req.user.email
            });
            await ticket.save();
            // Enviar email con el comprobante de compra
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                port: 587,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: "zgmq zily imux crto"
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: req.user.email,
                subject: 'Proof of your purchase',
                text: `Thank you for your purchase. Your ticket code is:${ticket.code}`
            };

            await transporter.sendMail(mailOptions);

            res.status(200).send('Proof of your purchase');
        } catch (error) {
            console.error('Error sending receipt', error);
            res.status(500).send('Error sending receipt');
        }
    }

    async removeItemFromCart(req, res) {
        try {
            const { cid, pid } = req.params;
            const updatedCart = await cartService.removeItemFromCart(cid, pid);
            res.status(200).json(updatedCart);
        } catch (error) {
            console.error('Error when removing product from cart:', error);
            res.status(500).json({ error: 'Error when removing product from cart' });
        }
    }

    async clearCart(req, res) {
        try {
            const { cid } = req.params;
            const clearedCart = await cartService.clearCart(cid);
            res.status(200).json(clearedCart);
        } catch (error) {
            console.error('Error emptying cart', error);
            res.status(500).json({ error: 'Error emptying cart' });
        }
    }
}