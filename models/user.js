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

    picture: { type: String, required : false },
    

specialite: {
type: String,
required: true,
},


picture: { type: String, required : false },

});


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