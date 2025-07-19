import mongoose from "mongoose";

const jotSchema = new mongoose.Schema({
    userId: {
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
    tag: {
        type: String,
        enum: ["Personal","Work","Other"],
        default: "Personal"
    }
});

export default mongoose.model('jotSchema', jotSchema);