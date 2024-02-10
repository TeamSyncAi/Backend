import express from 'express';
const router = express.Router();
import  User  from '../models/user.js';
import { createAccountClient, createAccountClientSub, modifyUserProfile, authenticateClient, authenticateClientSub, getUserIdByEmail, displayAllUsers, displayUserProfile, banUser, getUserById, deleteUser, sendActivationCode, forgotPassword, changePassword } from './controllers/user.js';
import { body } from 'express-validator';




router.post('/registerclient', [
  body('UserName').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], createAccountClient);

router.post('/registerclientSub', [
  body('UserName').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], createAccountClientSub);

router.put('/user/:id', modifyUserProfile);

router.post('/login/client', authenticateClient);
router.post('/login/clientSub', authenticateClientSub);

router.get('/user/id/:id', getUserById);
router.get('/user/email/:email', getUserIdByEmail);

router.get('/users', displayAllUsers);
router.get('/user/:_id', displayUserProfile);

router.put('/user/ban/:id', banUser);
router.delete('/user/:id', deleteUser);

router.post('/send-activation-code', sendActivationCode);
router.post('/forgot-password', forgotPassword);
router.put('/change-password', changePassword);

export default router;

