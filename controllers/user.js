import  User  from '../models/user.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import upload from '../middlewares/multer.js'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import fs from 'fs';
import formidable from "formidable";
import { PdfReader } from "pdfreader";
import path from "path";
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
//import Specialty from '../models/specialty.js';
import { sendSMS } from '../utils/smsSender.js';
import otpGenerator from 'otp-generator';
import Otp from '../models/otp.js';
import { sendEmail } from '../utils/mailSender.js';


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
      numTel: req.body.numTel,
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
 /* export async function createAccountClientSub(req, res) {
    
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
  }*/


  export async function updateUser(req, res) {
  const { username, email,numTel, password, role } = req.body;


const userFields = {};
if (username) userFields.username = username;
if (email) userFields.email = email;
if (numTel) userFields.numTel = numTel;
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
     User.findOne({ username: req.body.username })
      .then(user => {
          if (!user) {
              return res.status(401).json({ message: 'User is not registered' });
          }

          bcrypt.compare(req.body.password, user.password)
              .then(valid => {
                  if (!valid) {
                      return res.status(401).json({ message: 'Password or username incorrect' });
                  } else {
                      const maxAge = 1 * 60 * 60;
                      const token = jwt.sign(
                          { userId: user._id, role: user.role },
                          "" + process.env.JWT_SECRET,
                          { expiresIn: maxAge } // 1hr in sec
                      );
                      res.cookie("jwt", token, {
                          httpOnly: true,
                          maxAge: maxAge * 1000, // 1hr in ms
                          Secure: true,
                      });

                      res.status(200).json(user);
                  }
              })
              .catch(error => {
                  console.error('Error in bcrypt.compare:', error);
                  res.status(500).json({ error: 'Internal Server Error' });
              });
      })
      .catch(error => {
          console.error('Error in User.findOne:', error);
          res.status(500).json({ error: 'Internal Server Error' });
      });
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

  export async function sendOTP(req,res,next){
    try {
      const numTelRegex = /^\d{8}$/;
      if (!numTelRegex.test(req.body.numTel)) {
        return res.status(400).json({ message: "Invalid numTel format. Please enter 8 digits." });
      }
      const existingUser = await User.findOne(
        { numTel: req.body.numTel },
      );
  
      if (existingUser) {
        return res.status(400).json({ message: "It seems you already have an account, please log in instead." });
      }
      const otp = otpGenerator.generate(6,{
        secret: process.env.JWT_SECRET,
        digits: 6,
        algorithm: 'sha256',
        epoch: Date.now(),
        upperCaseAlphabets: false, specialChars: false,
        lowerCaseAlphabets: false,
    });
          const otpDocument = new Otp({
              userId: req.body.numTel, 
              otp
          });
  
          await otpDocument.save();
          const Tnumtel ="+216" + req.body.numTel
          sendSMS(Tnumtel,otp)
          res.status(200).json({ message: "OTP Sent"});
  
  } catch (error) {
      console.error('Error generating OTP:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
  }


export async function verifyOtp(req, res, next) {
    try {
      const { numTel, otp } = req.body;
      const otpDocument = await Otp.findOne({ userId: numTel });
  
      if (!otpDocument) {
        return res.status(404).json({ error: 'OTP not found' });
      }
  
      if (otp === otpDocument.otp) {
        
        await otpDocument.deleteOne();
  
        return res.status(200).json({ message: 'OTP verified' });
      } else {
        return res.status(401).json({ error: 'Invalid OTP' });
      }
    } catch (error) {
      console.error('Error in verifyOtp:', error);
      res.status(500).json({ error: 'Internal Server Error' });
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
  /*export async function forgetPasssword(req,res,next){

    try{
      User.findOne({ numTel: req.body.numTel })
      .then(user => {
          if (!user) {
              return res.status(401).json({ message: 'User is not registered' });
          }
          const otp = otpGenerator.generate(6,{
            secret: process.env.JWT_SECRET,
            digits: 6,
            algorithm: 'sha256',
            epoch: Date.now(),
            upperCaseAlphabets: false, specialChars: false,
            lowerCaseAlphabets: false,
        });
        const otpDocument = new Otp({
          userId: req.body.numTel, 
          otp,
        });
         otpDocument.save();
        return res.status(200).json({otp})
          
        })
    }
        catch(error) {
          console.error('Error in User.findOne:', error);
          res.status(500).json({ error: 'Internal Server Error' });
      };
  }*/


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

export async function getAllspecialite(req,res,next){
  try {
    const specialite = await Specialty.find();
    res.status(200).json(specialite);
} catch (error) {
    res.status(500).json({ error: error.message });
}

}



export async function getUserSkillsById(req, res) {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const userSkills = user.specialty;
    return res.status(200).json({ userId: userId, skills: userSkills });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function getUserSkills(req, res) {
  try {
    const userId = req.params.userId;

   
    const user = await User.findById(userId);

    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

  
    res.status(200).json({ skills: user.specialty });
  } catch (error) {
    console.error('Error fetching user skills:', error);
    res.status(500).json({ error: 'Failed to fetch user skills' });
  }
}



export async function extractSkillsFromUploadedPDF(req, res) {
  try {
    
    const form = formidable({ multiples: false });
    const files = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error("Error parsing form data:", err);
          
          reject(err);
          return; 
        }
        resolve(files);
      });
    });

    const pdfFile = files.file;

    
    if (!pdfFile) {
      return res.status(400).json({ message: "No PDF file uploaded" }); 
    }

    
    

    try {
      const pdfBytes = await pdfFile.buffer();

      try {
        const pdfText = await parse(pdfBytes);

        const skills = await extractSkillInformation(pdfText); 

      
        const newUser = await User.create({
          specialite: skills 
        });

        console.log('New user created:', newUser);

        return res.status(200).json(newUser);
      } catch (error) {
        console.error("Error parsing PDF:", error);
        return res.status(500).json({ error: "Failed to extract skills" });
      }
    } catch (error) {
      console.error("Error reading file buffer:", error);
      return res.status(500).json({ error: "Failed to extract skills" });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ error: "An unexpected error occurred" }); 
  }
}

export async function parsePDF(pdfBuffer) {
  return new Promise((resolve, reject) => {
      let skills = [];
      new PdfReader().parseBuffer(pdfBuffer, (err, item) => {
          if (err) {
              reject(err);
              return;
          } else if (!item) {
             
              const formattedSkills = skills.join(" ");
              resolve(formattedSkills);
          } else if (item.text) {
              
              const extractedSkills = extractSkills(item.text);
              if (extractedSkills.length > 0) {
                  skills = [...skills, ...extractedSkills];
              }
          }
      });
  });
}

const skillList = [
  
  "communication",
  "teamwork",
  "problem solving",
  "leadership",
  "creativity",
  "time management",
  "organization",
  "analytical skills",
  "interpersonal skills",
  "adaptability",
  "attention to detail",

  "java",
  "python",
  "javascript",
  "c++",
  "c#",
  "sql",
  "html",
  "css",
  "linux",
  "machine learning",

  
  "php",
  "ruby",
  "go",
  "swift",
  "kotlin",
  "rust",
  "react",
  "angular",
  "vue.js",
  "node.js",
  "express.js",
  "django",
  "spring boot",
  "mongodb",
  "cassandra",
  "hadoop",
  "spark",
  "aws",
  "azure",
  "gcp",
  "network security",
  "devops",
  "pandas",
  "r",
  "tensorflow",
  "pytorch",
  "agile",
  "scrum",
  "ux/ui",
  "seo",
  "sem",

];
function extractSkills(text) {
 
  let lines = text.split(/\n/g);


  let extractedSkills = [];


  for (const line of lines) {
  
    const trimmedLine = line.trim().toLowerCase();

    
    if (!trimmedLine) continue;


    const lineSkills = trimmedLine.split(/[ ,]+/);

    
    extractedSkills.push(...lineSkills);
  }


  extractedSkills = extractedSkills.filter((skill, index, self) => skill && self.indexOf(skill) === index);

  const concatenatedSkills = extractedSkills.join(', ');

  console.log('Extracted Skills:', concatenatedSkills); 

  return concatenatedSkills;
}

function determineSpecialties(skills) {
  
  const specialtyMap = {
      "java": ["Java Developer"],
      "python": ["Python Developer"],
      "MongoDB":"", 
  
  };


  let specialties = [];

  for (const skill of skills) {
      if (specialtyMap[skill]) {
          specialties.push(...specialtyMap[skill]);
      }
  }

  specialties = [...new Set(specialties)];

  return specialties;
}

async function main() {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
      const pdfFileName = "cv.pdf"; 
      const pdfPath = path.join(__dirname, "..", "uploads", pdfFileName);

      
      const pdfBuffer = fs.readFileSync(pdfPath);

      
      await parsePDF(pdfBuffer);
      console.log("PDF parsing completed.");
  } catch (error) {
      console.error("Error:", error);
  }
}


main();