import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const membreSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export default model("Membre", membreSchema);