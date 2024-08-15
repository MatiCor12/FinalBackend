import User from '../dao/models/user.model.js';
import Cart from './models/carts.model.js';

export default class UserManager {
    async findUserByEmail(email) {
        try {
            return await User.findOne({ email }).lean();
        } catch (error) {
            console.error('Error when searching for user by email', error);
            throw error;
        }
    }

    async createUser(userData) {
        try {
            const newUser = new User(userData);
            await newUser.save();
            return newUser.toObject();
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    async createCart() {
        try {
            const newCart = new Cart();
            await newCart.save();
            return newCart.toObject();
        } catch (error) {
            console.error('Error creating cart', error);
            throw error;
        }
    }

    async updateUserCart(userId, cartId) {
        try {
            const updatedUser = await User.findByIdAndUpdate(userId, { cart: cartId }, { new: true });
            return updatedUser.toObject();
        } catch (error) {
            console.error('Error updating user cart', error);
            throw error;
        }
    }
    async savePasswordResetToken(userId, token, expires) {
        try {
            await User.findByIdAndUpdate(userId, {
                resetPasswordToken: token,
                resetPasswordExpires: expires,
            });
        } catch (error) {
            console.error('Error saving recovery token', error);
            throw error;
        }
    }

    async findUserByResetToken(token) {
        try {
            return await User.findOne({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() },
            }).lean();
        } catch (error) {
            console.error('Error when searching user by recovery token', error);
            throw error;
        }
    }

    async updatePassword(userId, hashedPassword) {
        try {
            return await User.findByIdAndUpdate(userId, {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null,
            });
        } catch (error) {
            console.error('Error updating password', error);
            throw error;
        }
    }

    async findUserById(userId) {
        try {
            return await User.findById(userId).lean();
        } catch (error) {
            console.error('Error when searching user by ID', error);
            throw error;
        }
    }

    async updateUserRole(user) {
        try {
            return await User.findByIdAndUpdate(user._id, { role: user.role }, { new: true });
        } catch (error) {
            console.error('Error updating role', error);
            throw error;
        }
    }
}