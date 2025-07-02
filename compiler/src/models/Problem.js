import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },
    tags: [String],
    constraints: String,
    inputFormat: String,
    outputFormat: String,

    sampleTestCases: [
      {
        input: String,
        output: String,
        explanation: String,
      },
    ],

    hiddenTestCases: [
      {
        input: String,
        output: String,
      },
    ],

    timeLimit: {
      type: Number,
      default: 1, 
    },
    memoryLimit: {
      type: Number,
      default: 256, 
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Problem = mongoose.model("Problem", problemSchema);
export default Problem;
