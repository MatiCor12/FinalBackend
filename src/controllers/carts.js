import nodemailer from 'nodemailer';
import CartService from '../service/cartsService.js';
import Ticket from '../dao/models/ticket.model.js'

const cartService = new CartService();

export default class CartController {
    async createCart(req, res) {
        try {
            const newCart = await cartService.createCart();
            res.status(201).json(newCart);
        } catch (error) {
            return res.status(500).json({msg:'Talk to administrator'})
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
            return res.status(500).json({msg:'Talk to administrator'})
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
            return res.status(500).json({msg:'Talk to administrator'})
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
            return res.status(500).json({msg:'Talk to administrator'})
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
            return res.status(500).json({msg:'Talk to administrator'})
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
            return res.status(500).json({msg:'Talk to administrator'})
        }
    }

    async removeItemFromCart(req, res) {
        try {
            const { cid, pid } = req.params;
            const updatedCart = await cartService.removeItemFromCart(cid, pid);
            res.status(200).json(updatedCart);
        } catch (error) {
            return res.status(500).json({msg:'Talk to administrator'})
        }
    }

    async clearCart(req, res) {
        try {
            const { cid } = req.params;
            const clearedCart = await cartService.clearCart(cid);
            res.status(200).json(clearedCart);
        } catch (error) {
            return res.status(500).json({msg:'Talk to administrator'})
        }
    }
}