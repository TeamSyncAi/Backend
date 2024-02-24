import express from 'express';
const router = express.Router();

import  User  from '../models/user.js';
import { createAccountClient, createAccountClientSub, updateUser , authenticateClient, authenticateClientSub, getUserIdByEmail, displayAllUsers, displayUserProfile, banUser, getUserById, deleteUser, sendActivationCode, forgotPassword, changePassword,verifyCode,ProfilePicUpload,extractSkillsFromUploadedPDF } from '../controllers/user.js';
import { body } from 'express-validator';




router.post('/registerclient', [
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], createAccountClient);

router.post('/registerclientSub', [
  body('UserName').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], createAccountClientSub);

router.put('/:id/update', updateUser);

router.post('/loginclient', authenticateClient);
router.post('/loginclientSub', authenticateClientSub);

router.get('/:id', getUserById);
router.get('/user/:email', getUserIdByEmail);

router.get('/',displayAllUsers);
router.get('/user/:_id', displayUserProfile);

router.put('/:id/ban', banUser);
router.delete('/:id/delete', deleteUser);

router.post('/reset', sendActivationCode);
router.post('/forgot', forgotPassword);
router.put('/change', changePassword);
router.post('/verify', verifyCode);
router.post('/updatePicture', ProfilePicUpload);

router.post('/extractskill',extractSkillsFromUploadedPDF);

export default router;



