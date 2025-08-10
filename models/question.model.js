import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    domain: {
        type: String,
        required: true,
        enum: ['programming', 'aiml', 'cybersecurity', 'dsa', 'blockchain'],
    },
    questionText: {
        type: String,
        required: true,
    },
    options: {
        type: [String],
        required: true,
        validate: [arr => arr.length === 4, 'There must be exactly 4 options.'],
    },
    correctOptionIndex: {
        type: Number,
        required: true,
        min: 0,
        max: 3,
    },
});

export const Question = mongoose.model("Question", questionSchema);