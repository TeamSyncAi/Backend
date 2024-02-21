import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const reportSchema = new Schema({
    titre: {
    type: String,
    required: true
  },
},
{
    timestamps : true
});

export default model("report", reportSchema);