const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const modelsSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        membersM: {
            type: [String],
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = model("Models", modelsSchema);