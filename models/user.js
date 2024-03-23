import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



const userSchema = new mongoose.Schema({
username: {
type: String,
required: true,
unique: true,
},


email: {
type: String,
required: true,
unique: true,
},

numTel: { type: String, required: true ,unique:true },

password: {
type: String,
required: true,
},

resetCode: {
  type:String,
  required: false,
},
isBanned: { 
    type: Boolean, 
    default: false },

 
    

specialty: {
type: String,
required: false,
},


picture: { type: String, required : false },

});

userSchema.statics.updateSkills = async function(userId, skills) {
  try {
   
    const user = await this.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
   
    user.specialty = skills.join(', '); 
    await user.save(); 
    return user; 
  } catch (error) {
    throw new Error('Failed to update user skills');
  }
};


userSchema.methods.generateAuthToken = function () {
try {
const token = jwt.sign({ _id: this._id, role: this.role }, 'your_actual_secret_key');
console.log('Generated auth token:', token);
return token;
} catch (error) {
console.error('Error generating auth token:', error);
throw new Error('Unable to generate auth token');
}
};


userSchema.statics.findByCredentials = async function (email, password) {
  try {
    console.log('Attempting to find user with email:', email);

    // Find user by email
    const user = await this.findOne({ email });

    if (!user) {
      console.error('User not found for email:', email);
      throw new Error('Username or password is incorrect');
    }

    console.log('User found:', user);

    // Compare passwords
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      console.error('Password does not match for user:', email);
      throw new Error('Username or password is incorrect');
    }

    console.log('Password matched for user:', email);

    return user;
  } catch (error) {
    console.error('Error finding user by credentials:', error);
    throw new Error('Unable to login');
  }
};





userSchema.pre('save', async function (next) {
if (this.isModified('password')) {
this.password = await bcrypt.hash(this.password, 8);
}
next();
});


const User = mongoose.model('User', userSchema);
export default User;