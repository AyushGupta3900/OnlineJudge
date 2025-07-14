import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      enum: ["cpp", "python", "java", "javascript"],
      required: true,
    },
    verdict: {
      type: String,
      enum: [
        "Accepted",
        "Wrong Answer",
        "Time Limit Exceeded",
        "Memory Limit Exceeded",
        "Runtime Error",
        "Compilation Error",
        "Pending",
      ],
      default: "Pending",
    },
    executionTime: {
      type: Number, 
    },
    memoryUsed: {
      type: Number, 
    },
    passedTestCases: {
      type: Number,
      default: 0,
    },
    totalTestCases: {
      type: Number,
      default: 0,
    },
    error: {
      type: String,
    },
    testCaseResults: [
      {
        testCase: Number,
        input: String,
        expectedOutput: String,
        actualOutput: String,
        executionTimeMs: Number,
        memoryKb: Number,
        status: {
          type: String,
          enum: ["Passed", "Failed","Time Limit Exceeded","Memory Limit Exceeded","Error"],
        },
        error: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Submission = mongoose.model("Submission", submissionSchema);
export default Submission;