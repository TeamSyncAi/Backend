import user from "../models/user.js";
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


  export async function modifyUserProfile(req, res) {
    try {
      const _id = req.params._id; 
      const { UserName, email, password } = req.body;
  
      
      const user = await User.findOne({ _id });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      
      user.UserName = UserName;
      user.email = email;
      user.password = password;
      
  
      const updatedUser = await user.save();
  
      res.json({ message: 'User profile updated successfully', data: updatedUser });
    } catch (error) {
      res.status(500).json({ error: error.message });
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


  