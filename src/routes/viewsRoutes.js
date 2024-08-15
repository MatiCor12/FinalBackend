import { Router } from 'express';
import ViewsController from '../controllers/views.js';
import { isAuthenticated, isAdminOrPremium, isUser, isNotAuthenticated, isUserOrPremium } from '../middleware/auth.js';

const router = Router();
const viewsController = new ViewsController();

router.get('/', viewsController.getProducts.bind(viewsController));
router.get('/products/:pid', viewsController.getProductById.bind(viewsController));
router.post('/products', isAuthenticated, isUser, viewsController.addProductToCart.bind(viewsController));
router.get('/realtimeproducts', isAuthenticated, isAdminOrPremium, viewsController.getRealTimeProducts.bind(viewsController));
router.get('/chat', isAuthenticated, isUserOrPremium, viewsController.getChat.bind(viewsController));
router.get('/login', isNotAuthenticated, viewsController.getLogin.bind(viewsController));
router.get('/register', isNotAuthenticated, viewsController.getRegister.bind(viewsController));

export default router;