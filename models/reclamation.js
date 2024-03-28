import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const reclamationSchema = new Schema({
    title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: false
  },
  
  status: {
    type: String,
    enum: ['In progress', 'Accepted', 'Rejected'],
    default: 'In progress'
  },
  type: {
    type: String,
    enum: ['ideas and suggestions', 'reporting problems', 'task and project management','support requests','feedback','health'],
    required:false
  },
  email: {
    type: String,
    validate: {
      validator: function(value) {
        // Utiliser une expression régulière pour valider le format de l'e-mail
        return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  projectName: {
    type: String,
    required: true
  }
  /*utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utilisateur',
    required: true
  }*/
},
{
    timestamps : true
});

export default model("Reclamation", reclamationSchema);