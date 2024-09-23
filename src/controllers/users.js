import UserService from '../service/usersService.js';
import { createHash } from '../utils.js'
import passport from 'passport';
import nodemailer from 'nodemailer';
import 'dotenv/config';

const userService = new UserService();

export const registerUser = async (req, res) => {
    const { first_name, last_name, age, email, password } = req.body;
    try {
        const existingUser = await userService.findUserByEmail(email);
        if (existingUser) {
            return res.redirect('/register?error=Email already in use');
        }

        const newUser = await userService.createUser({ first_name, last_name, age, email, password: createHash(password) });
        const newCart = await userService.createCart();
        await userService.updateUserCart(newUser._id, newCart._id);

        return res.redirect('/login?success=Registered user. Log in.');
    } catch (error) {
        console.error('Error registering user', error);
        return res.redirect('/register?error=An error occurred while registering the user. Try again.');
    }
};

export const loginUser = async (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/login?error=Incorrect username or password');
        }
        req.logIn(user, async (err) => {
            if (err) {
                return next(err);
            }
            await userService.updateLastConnection(user._id);
            req.session.user = user;
            return res.redirect('/api/sessions/current');
        });
    })(req, res, next);
};

export const logoutUser = async (req, res) => {
    if(req.user) {
        try {
            await userService.updateLastConnection(req.user._id);
        } catch (error) {
            console.error('Error updating last connection', error);
        }
    }
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/login?success=Closed session');
    });
};

export const getCurrentSession = (req, res) => {
    if (req.isAuthenticated()) {
        return res.render("current", { user: req.session.user });
    } else {
        return res.status(401).json({ message: 'No user is logged in' });
    }
};

export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

export const sendPasswordResetEmail = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await userService.findUserByEmail(email);
        if (!user) {
            return res.status(400).send(`<script>alert('There is no user with that email'); window.location.href='/login';</script>`);
        }

        const token = await userService.generatePasswordResetToken(user._id);
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const resetUrl = `http://localhost:8080/api/sessions/reset-password/${token}`;
        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Password recovery',
            text: `Please click the following link to reset your password ${resetUrl}`,
        };
        transporter.sendMail(mailOptions);
        res.send(`<script>alert('A password reset email has been sent'); window.location.href='/login';</script>`);
    } catch (error) {
        console.error('Error sending recovery email', error);
        res.status(500).send(`<script>alert('Server error'); window.location.href='/login';</script>`);
    }
};

export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
        const user = await userService.findUserByResetToken(token);
        if (!user) {
            return res.status(400).send(`<script>alert('Invalid or expired token'); window.location.href='/login';</script>`);
        }
        await userService.updatePassword(user._id, password);
        res.send(`<script>alert('Password reset successfully'); window.location.href='/login';</script>`);
    } catch (error) {
        console.error('Password reset error', error);
        res.status(500).send(`<script>alert('Server error'); window.location.href='/login';</script>`);
    }
};

export const renderChangeRole = async (req, res) => {
    try {
        const user = await userService.findUserById(req.user._id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        const isPremium = user.role === 'premium';
        res.render('changeRole', { user, isPremium });
    } catch (error) {
        console.error('Error rendering view', error);
        res.status(500).send('Error rendering view');
    }
};

export const changeRole = async (req, res) => {
    try {
        const { uid } = req.params;
        const { role } = req.body;
        const user = await userService.findUserById(uid);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (role === 'premium') {
            const hasEnoughDocuments = user.documents && user.documents.length >= 3;
            if (!hasEnoughDocuments) {
                return res.status(400).json({ error: 'User did not upload required documentation(.txt)' });
            }
            user.role = 'premium'
        } else if (role === 'user') {
            user.role = 'user';
        }
        await userService.updateUserRole(user);
        if (req.session.user._id.toString() === uid.toString()) {
            req.session.user.role = user.role;
        }
        return res.redirect('/api/sessions/current');
    } catch (error) {
        console.error('Error when changing Role', error);
        return res.status(500).json({ error: 'Error when changing Role' });
    }
}

export const uploadDocuments = async (req, res) => {
    const { uid } = req.params;
    try {
        const user = await userService.findUserById(uid);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const documents = req.files.map(file => ({
            name: file.fieldname,
            reference: `/uploads/${file.fieldname === 'profile' ? 'profiles' : 'documents'}/${file.filename}`
        }));

        await userService.addUserDocuments(uid, documents);
        return res.json({ message: 'Documents uploaded correctly' });
    } catch (error) {
        console.error('Error uploading documents', error);
        return res.status(500).json({ error: 'Error uploading documents' });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.render('adminUsers', { users });
    } catch (error) {
        console.error('Error getting all users', error);
        res.status(500).send('Error getting all users');
    }
};

export const deleteUser = async (req, res) => {
    const { uid } = req.params;
    try {
        const user = await userService.findUserById(uid);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Deleted account',
            text: 'Your account has been deleted',
        };

        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                console.error('Error sending account deletion email', error);
                return res.status(500).json({ error: 'Error sending email' });
            } else {
                console.log('Email sent:', info.response);
                await userService.deleteUser(uid);
                return res.redirect('/api/sessions/admin/users');
            }
        });

    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Error deleting user' });
    }
};