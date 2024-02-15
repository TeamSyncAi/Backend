import  User  from '../models/user.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import upload from '../middlewares/multer.js'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export async function createAccountClient(req, res) {
    try {
    
      if (!validationResult(req).isEmpty()) {
        console.error('Validation errors:', validationResult(req).array());
        return res.status(400).json({ errors: validationResult(req).array() });
      }
  
      const newUser = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        Role: 'Client', 
       
      });
  
      console.log('New user created:', newUser);
  
      return res.status(200).json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  export async function createAccountClientSub(req, res) {
    
    if (!validationResult(req).isEmpty()) {
      res.status(400).json({ errors: validationResult(req).array() });
    } else {
      User.create({
        username: req.body.username,
        email: req.body.email,
        password: await hash(req.body.password, 10),
        Role: 'ClientSub', 
      })
        .then((newClientSub) => {
          res.status(200).json(newClientSub);
        })
        .catch((err) => {
          res.status(500).json({ error: err });
        });
    }
  }


  export async function updateUser(req, res) {
  const { username, email, password, role } = req.body;


const userFields = {};
if (username) userFields.username = username;
if (email) userFields.email = email;
if (password) userFields.password = password;
if (role) userFields.role = role;


try {
let user = await User.findById(req.params.id);


if (!user) {
return res.status(404).json({ error: 'User not found' });
}


user = await User.findByIdAndUpdate(req.params.id, { $set: userFields }, { new: true });


res.json({ message: 'User updated successfully', user });
} catch (err) {
console.error(err.message);
res.status(500).send('Server Error');
}
  }

  export async function authenticateClient(req, res) {
    const { username, password } = req.body;

    try {
      const user = await User.findByCredentials(username, password);
  
      if (user.isBanned) {
        return res.status(403).json({ error: 'User is banned. Cannot login' });
      }
  
      const token = await user.generateAuthToken();
      res.status(200).json({ message: 'Login successful', user, token });
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({ error: error.message });
    }
  }


  export async function authenticateClientSub(req, res) {
    const { username, password } = req.body;

    try {
      const user = await User.findByCredentials(username, password);
  
      if (user.isBanned) {
        return res.status(403).json({ error: 'User is banned. Cannot login' });
      }
  
      const token = await user.generateAuthToken();
      res.status(200).json({ message: 'Login successful', user, token });
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({ error: error.message });
    }
  }



  export async function getUserIdByEmail(req, res) {
    try {
      const email = req.params.email;
  
      
      const user = await User.findOne({ email });
  
      if (user && user._id) {
        const userId = user._id;
        res.status(200).json({ userId });
      } else {
        res.status(404).json({ error: 'User not found or does not have a userId' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  

  export async function displayAllUsers(req, res) {
    try {
      const users = await User.find();
      if (!users || users.length === 0) {
      return res.status(404).json({ error: 'Users not found' });
      }
      res.json(users);
      } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
      }
      }


  export async function displayUserProfile(req, res) {
    try {
      const userIdToFind = req.params._id; 
  
      console.log('User ID to find:', userIdToFind); 
  
      const user = await User.findOne({ "_id": userIdToFind });
      if (user) {
        res.status(200).json({ data: user });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }


  export async function banUser(req, res){
    const userId = req.params.id; 

    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      user.isBanned = true; 
      
      await user.save();

      res.status(200).json({ message: 'User banned successfully', user });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }


  export async function getUserById(req, res){
    try {
    const user = await User.findById(req.params.id);
    if (!user) {
    return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
    } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
    }
    }

export async function deleteUser(req, res){
  try {
    let user = await User.findById(req.params.id);
    
    
    if (!user) {
    return res.status(404).json({ error: 'User not found' });
    }
    
    
    await User.findByIdAndRemove(req.params.id);
    
    
    res.json({ message: 'User deleted successfully' });
    } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
    }
    }


export async function sendActivationCode(req, res) {
    try {
      const resetCode = Math.floor(1000 + Math.random() * 9000).toString();
      const email = req.body.email;
      const user = await User.findOne({ email });
      const username = user.username;
  
      const htmlString = `
        <body style='font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; margin: 0; padding: 0;'>
          <table width='100%' cellpadding='0' style='max-width: 600px; margin: 20px auto; background-color: #fff; border-radius: 8px; border: 1px solid #ddd; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>
            <tr>
              <td style='padding: 20px;'>
                <h2 style='color: #333;'>Activation Code Email</h2>
                <p>Dear ${username},</p>
                <p>Your activation code is: <strong style='color: #009688;'>${resetCode}</strong></p>
                <p>Please use this code to reset your password.</p>
                <p>If you did not request this code, please disregard this email.</p>
                <p>Thank you!</p>
              </td>
            </tr>
          </table>
        </body>
      `;
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SENDER_EMAIL,
          pass: process.env.PASSWORD_EMAIL
        },
      });
      transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: req.body.email,
        subject: "Your Activation Code ✔",
        html: htmlString,
      });
  
      await User.updateOne({
        email: req.body.email
      }, {
        resetCode: resetCode
      });
  
      res.status(200).json({ email: req.body.email, resetCode });
    } catch (error) {
      res.status(400).json({
        error: error
      });
    }
  }
      

export async function forgotPassword(req, res){
    const { email, newPassword, confirmPassword } = req.body;
    const user = await User.findOne({ email });
  
    if (newPassword === confirmPassword) {
      const hashedPassword = bcrypt.hashSync(newPassword, 10);
      try {
        await User.updateOne({ _id: user._id }, { password: hashedPassword });
        res.status(200).json({ data: req.body });
      } catch (err) {
        res.status(500).json({ message: err });
      }
    } else {
      res.status(500).json({ message: "Passwords don't match" });
    }
  }

  export async function changePassword(req, res){
    const { email, newPassword, confirmPassword, oldPassword } = req.body;
  
    const user = await User.findOne({ email });
  
    if (user && bcrypt.compareSync(oldPassword, user.password)) {
      if (newPassword === confirmPassword) {
        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        try {
          user.password = hashedPassword;
          await user.save();
          res.status(200).json({ data: req.body });
        } catch (err) {
          res.status(500).json({ message: err });
        }
      } else {
        res.status(200).json({ response: "Passwords don't match" });
      }
    } else {
      res.status(500).json({ message: "Email or password don't match" });
    }
  }
export async function verifyCode(req, res){
  const { resetCode, email } = req.body;
  const user = await User.findOne({ email });

  if (resetCode === user.resetCode) {
    res.status(200).json({ message: 'true' });
  } else {
    res.status(200).json({ message: 'false' });
  }
}
  
export  async function ProfilePicUpload (req,res,next){
  upload.single('picture')(req, res,async (err) => {
    if (err) {   
      return res.status(500).json({ error: err.message }); 
    } 
    
    try {         
    const authenticatedusername = req.auth.username; 
    if (authenticatedusername !== req.body.username) {
      return res.status(403).json({ error: 'Permission denied. You can only change your own picture.' });
    }

   const user = await User.findOneAndUpdate(
       { username: req.body.username },
       { picture: req.file.path },
       { new: true } 
       );             
       if (!user) {
        return res.status(404).json({ error: 'User not found' });
        }
                      
       return res.status(200).json({ message: 'Profile picture updated', user });
       } catch (error) {
          return res.status(500).json({ error: 'Failed to update profile picture' });  
      }
  })     
  
};