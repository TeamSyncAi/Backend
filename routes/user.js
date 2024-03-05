import express from 'express';
const router = express.Router();
import multer from 'multer';
import  User  from '../models/user.js';
import { createAccountClient,  updateUser , authenticateClient, authenticateClientSub,verifyOtp,sendOTP, getUserIdByEmail, displayAllUsers, displayUserProfile, banUser, getUserById, deleteUser, sendActivationCode, forgotPassword, changePassword,verifyCode,getAllspecialite,ProfilePicUpload,parsePDF } from '../controllers/user.js';
import { auth } from '../middlewares/auth.js'; 
import { body } from 'express-validator';


const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });



router.post('/registerclient', [
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('numTel').notEmpty().withMessage('numTel is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], createAccountClient);


/*router.post('/registerclientSub', [
  body('UserName').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], createAccountClientSub);*/

router
  .route('/sendOTP')
  .post(sendOTP)

  router
  .route('/verifyOTP')
  .post(verifyOtp)

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
router
  .route('/updatePicture')
  .patch(auth,ProfilePicUpload);


  router
  .route('/Speicialities')
  .get(getAllspecialite)



  router.post('/update-skills', async (req, res) => {
    try {
      const { userId, skills } = req.body;
  
     
      if (!userId || !skills) {
        return res.status(400).json({ message: 'Missing userId or skills in request body' });
      }
  
     
      const updatedUser = await User.updateSkills(userId, skills);
  
      
      res.status(200).json({ message: 'User skills updated successfully', user: updatedUser });
    } catch (error) {
      console.error('Error updating user skills:', error);
      res.status(500).json({ error: 'Failed to update user skills' });
    }
  });

router.post('/parse-pdf', upload.single('cv'), async (req, res) => {
  try {
    
    if (!req.file) {
      return res.status(400).send('No CV uploaded.');
    }

  
    const skills = await parsePDF(req.file.buffer);

    const userId = req.user.id; 
    await User.updateSkills(userId, skills);

  
    res.status(200).json({ skills: skills });
  } catch (error) {
    
    console.error("Error:", error);
    res.status(500).send("An error occurred while parsing the PDF.");
  }
});



router.get('/user-skills/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Retrieve the user from the database by ID
    const user = await User.findById(userId);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user's skills
    res.status(200).json({ skills: user.specialty });
  } catch (error) {
    console.error('Error fetching user skills:', error);
    res.status(500).json({ error: 'Failed to fetch user skills' });
  }
});
export default router;



