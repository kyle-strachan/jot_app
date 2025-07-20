import mongoose from "mongoose";

const jotSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    color: {
        type: String,
        enum: ["black", "red", "blue", "green", "yellow", "purple"],
        default: "black"
    }
});

export default mongoose.model('jotSchema', jotSchema);