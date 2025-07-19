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
    tag: {
        type: String,
        enum: ["Personal","Work","Other"],
        default: "Personal"
    }
});

export default mongoose.model('jotSchema', jotSchema);