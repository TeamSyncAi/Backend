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

numTel: { type: Number, required: true ,unique:true },

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
    // Trouvez l'utilisateur par son ID
    const user = await this.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    // Mettez à jour les compétences de l'utilisateur
    user.specialty = skills.join(', '); // Convertissez le tableau de compétences en une chaîne séparée par des virgules
    await user.save(); // Sauvegardez les modifications dans la base de données
    return user; // Renvoyez l'utilisateur mis à jour
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


userSchema.statics.findByCredentials = async function (username, password) {
const user = await this.findOne({ username });
if (!user) {
throw new Error('Unable to login');
}
const isPasswordMatch = await bcrypt.compare(password, user.password);
if (!isPasswordMatch) {
throw new Error('Unable to login');
}
return user;
};


userSchema.pre('save', async function (next) {
if (this.isModified('password')) {
this.password = await bcrypt.hash(this.password, 8);
}
next();
});


const User = mongoose.model('User', userSchema);
export default User;