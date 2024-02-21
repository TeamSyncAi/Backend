import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const reportSchema = new Schema({
    type: {
        type: String,
        enum: ['Rapport de productivité', 'Planification vs Réalisation', 'Autre'], 
        required: true
    },
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
    /*createur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Utilisateur',
        required: true
    },*/
    donnees: {
        type: Map, 
        of: String 
    }
},
{
    timestamps : true
});

export default model("Report", reportSchema);
