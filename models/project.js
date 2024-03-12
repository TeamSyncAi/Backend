const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const projectSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        models: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Models'
        }]
    },
    {
        timestamps: true
    }
);

module.exports = model("Project", projectSchema);