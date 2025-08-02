import mongoose from "mongoose";

const jotnote = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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
}, { strict: true });

export default mongoose.model('Jot', jotnote);