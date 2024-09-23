import { Router } from 'express';
import passport from 'passport';
import { registerUser, loginUser, logoutUser, getCurrentSession, isAuthenticated, sendPasswordResetEmail, resetPassword, renderChangeRole, changeRole, uploadDocuments, getAllUsers, deleteUser } from '../controllers/users.js';
import { isAdmin } from '../middleware/auth.js';
import { uploadDocument } from '../middleware/upload.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/current', isAuthenticated, getCurrentSession);
router.get('/change-role', isAuthenticated, renderChangeRole);
router.post('/change-role/:uid', isAuthenticated, changeRole);
router.post('/:uid/documents', isAuthenticated, uploadDocument.array('documents'), uploadDocuments);
router.post('/forgot-password', sendPasswordResetEmail);
router.post('/reset-password/:token', resetPassword);
router.get('/admin/users', isAuthenticated, isAdmin, getAllUsers);
router.post('/admin/users/:uid', isAuthenticated, isAdmin, deleteUser);
router.get("/github", passport.authenticate("github", { scope: 'user:email' }), (req, res) => {});
router.get("/githubcallback", passport.authenticate("github", { failureRedirect: '/login' }), (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
});

export default router;