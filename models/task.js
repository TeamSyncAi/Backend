const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const tasksSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        user: {
            type: String,
            required: true
        }

    },
    {
        timestamps: true
    }
);

module.exports = model("Task", tasksSchema);