import  User  from '../models/user.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
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
        UserName: req.body.UserName,
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
        UserName: req.body.UserName,
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
    try {
      const data = req.body;
  
   
      const user = await User.findOne({ email: data.email, Role: 'client' });
  
      if (!user) {
        return res.status(404).send('Email and password are invalid!');
      }
  
      
      if (data.password !== user.password) {
        return res.status(401).send('Email or password is invalid');
      }
  
      
      const payload = {
        _id: user._id,
        username: user.UserName,
        email: user.email,
        role: user.Role,
        
      };
  
      process.env.userId = user._id;  
      const apiKey = process.env.SECRET_KEY;
      const token = jwt.sign(payload, apiKey);
  
      
      return res.status(200).send({ token, apiKey, _id: user._id, UserName: user.UserName, email: user.email });
    } catch (error) {
      console.error(error);
      return res.status(500).send('Internal server error');
    }
  }


  export async function authenticateClientSub(req, res) {
    try {
      const data = req.body;
  
      
      const ClientSub = await User.findOne({ email: data.email, Role: 'ClientSub' });
  
      if (!ClientSub) {
        return res.status(404).send('Email and password are invalid for ClientSub!');
      }
  
      const validPass = bcrypt.compareSync(data.password, ClientSub.password);
  
      if (!validPass) {
        return res.status(401).send('Email or password is invalid for ClientSub');
      }
  
     
      const payload = {
        _id: ClientSub._id,
        username: ClientSub.UserName,
        email: ClientSub.email,
        role: ClientSub.Role, 
        
      };
  
      const apiKey = process.env.SECRET_KEY;
      const token = jwt.sign(payload, apiKey);
  
      return res.status(200).send({ token, apiKey });
    } catch (error) {
      console.error(error);
      return res.status(500).send('Internal server error');
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
  
    
      res.json({ users });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
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

  