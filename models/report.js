import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const reportSchema = new Schema({
    titre: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dateDebut: {
        type: Date,
        required: true
    },
    dateFin: {
        type: Date,
        required: true
    },
   /* createur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Utilisateur',
        required: true
    },*/
    donnees: {
        type: Object, 
        required: true
    }
},
{
    timestamps : true
});

export default model("report", reportSchema);
