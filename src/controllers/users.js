import UserService from '../repositories/usersRepository.js';
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
    passport.authenticate('login', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/login?error=Incorrect username or password');
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            req.session.user = user;
            return res.redirect('/api/sessions/current');
        });
    })(req, res, next);
};

export const logoutUser = (req, res) => {
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

        // Respuesta con alerta y redirección
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

        // Respuesta con alerta y redirección
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
        res.render('changeRole', { user });
    } catch (error) {
        console.error('Error rendering view', error);
        res.status(500).send('Error rendering view');
    }
};

export const changeRole = async (req, res) => {
    try {
        console.log('Entering changeRole');
        const { uid } = req.params;
        const { role } = req.body;
        console.log('UID:', uid, 'Role:', role);

        const user = await userService.findUserById(uid);
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ error: 'User not founde' });
        }

        // Cambiar el rol del usuario
        if (role === 'premium') {
            user.role = 'premium';
        } else if (role === 'user') {
            user.role = 'user';
        }

        await userService.updateUserRole(user);
        console.log('Changed role');

        if (req.session.user._id.toString() === uid.toString()) {
            req.session.user.role = user.role;
        }

        return res.status(200).json({ message: 'Changed role' });
    } catch (error) {
        console.error('Error when changing Role', error);
        return res.status(500).json({ error: 'Error when changing Role' });
    }
}