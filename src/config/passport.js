import passport from 'passport';
import GitHubStrategy from 'passport-github2'
import User from '../dao/models/user.model.js';
import userService from '../dao/models/user.model.js'
import cartService from '../dao/models/carts.model.js'
import { Strategy as LocalStrategy } from 'passport-local';
import { createHash, isValidPassword } from '../utils.js'

export const initializePassport = () => {
    passport.use('register', new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true
    }, async (req, email, password, done) => {
        try {
            const { first_name, last_name, age } = req.body;
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return done(null, false, { message: 'Email is already in use' });
            }
            const hashedPassword = createHash(password);
            const newUser = new User({ first_name, last_name, email, age, password: hashedPassword });
            await newUser.save();

            return done(null, newUser);
        } catch (error) {
            return done(error);
        }
    }));

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (email, password, done) => {
        try {
            const user = await User.findOne({ email }).populate('cart');
            if (!user) {
                return done(null, false, { message: 'User not found' });
            }

            const isMatch = isValidPassword(user, password);
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password' });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id).populate('cart');
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });

    passport.use("github", new GitHubStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL:process.env.NODE_ENV === 'production'
        ? process.env.CALLBACK_URL
        : process.env.CALLBACK_URL_RAILWAY
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await userService.findOne({ email: profile._json.email });
            if (!user) {
                const newUser = {
                    first_name: profile._json.name,
                    last_name: profile._json.name,
                    email: profile._json.email,
                    age: 0,
                    password: ""
                };
                let createdUser = await userService.create(newUser);
                let newCart = await cartService.create({ items: [], user: createdUser._id });
                createdUser.cart = newCart._id;
                await createdUser.save();
                done(null, createdUser);
            } else {
                done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }));
};