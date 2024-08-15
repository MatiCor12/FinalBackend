import ProductService from '../service/productsService.js';

const productService = new ProductService();

export const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    }
};

export const isNotAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return next();
    } else {
        res.redirect('/profile');
    }
};

export const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    } else {
        res.status(403).send('Access denied. Only administrators can do this part');
    }
};

export const isPremium = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'premium') {
        return next();
    } else {
        res.status(403).send('Access denied. Only user can do this part');
    }
};
export const isOwnerOrAdmin = (req, res, next) => {
    const { productId } = req.params;
    const user = req.session.user;

    if (user.role === 'admin') {
        return next();
    }
    productService.getProductById(productId).then((product) => {
        if (product.owner === user.email || user.role === 'admin') {
            return next();
        } else {
            res.status(403).send('Access denied. Only the owner or an administrator can perform this part');
        }
    }).catch((error) => {
        console.error('Error verifying product owner', error);
        res.status(500).send('Server error');
    });
};

export const isAdminOrPremium = (req, res, next) => {
    if (req.session.user && (req.session.user.role === 'admin' || req.session.user.role === 'premium')) {
        return next();
    } else {
        res.status(403).send('Acceso denegado. Solo administradores y usuarios premium pueden realizar esta acción.');
    }
};

export const isUserOrPremium = (req, res, next) => {
    if (req.session.user && (req.session.user.role === 'user' || req.session.user.role === 'premium')) {
        return next();
    } else {
        res.status(403).send('Access denied. Only users and premium users can do this part');
    }
};

export const isUser = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'user') {
        return next();
    } else {
        res.status(403).send('Access denied. Only user can do this part');
    }
};

export const isNotOwner = async (req, res, next) => {
    const user = req.session.user;
    const productId = req.params.pid;
    const product = await productService.getProductById(productId);

    if (product.owner === user.email) {
        return res.status(403).json({ error: 'You cannot add your own products to the cart' });
    }

    next();
};