import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateProblemMutation } from "../../redux/api/problemAPI";
import { useGenerateTestCasesMutation } from "../../redux/api/aiAPI";
import { FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
};

const fieldVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const DynamicField = ({ label, values, setValues }) => (
  <motion.div variants={fieldVariants} className="mb-6">
    <label className="block text-sm font-semibold mb-2">{label}</label>
    {values.map((val, idx) => (
      <div key={idx} className="flex items-center gap-2 mb-2">
        <input
          type="text"
          value={val}
          onChange={(e) => {
            const updated = [...values];
            updated[idx] = e.target.value;
            setValues(updated);
          }}
          className="flex-1 bg-gray-800 border border-gray-700 px-3 py-2 rounded-md"
        />
        {values.length > 1 && (
          <motion.button
            type="button"
            onClick={() => setValues(values.filter((_, i) => i !== idx))}
            className="text-red-500 hover:text-red-400 cursor-pointer"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiX size={20} />
          </motion.button>
        )}
      </div>
    ))}
    <motion.button
      type="button"
      onClick={() => setValues([...values, ""])}
      className="mt-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-md cursor-pointer"
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
    >
      + Add {label}
    </motion.button>
  </motion.div>
);

const TestCasesSection = ({ title, testCases, setTestCases, hasExplanation }) => (
  <motion.div variants={fieldVariants}>
    {title && <label className="block text-sm font-semibold mb-2">{title}</label>}
    {testCases.map((tc, index) => (
      <motion.div
        key={index}
        className="relative border border-gray-700 rounded-md p-4 mb-4 bg-gray-800"
        variants={fieldVariants}
      >
        <motion.button
          type="button"
          onClick={() => setTestCases(testCases.filter((_, i) => i !== index))}
          className="absolute top-2 right-2 text-red-500 hover:text-red-400 cursor-pointer"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <FiX size={18} />
        </motion.button>

        <textarea
          placeholder="Input"
          value={tc.input}
          onChange={(e) => {
            const updated = [...testCases];
            updated[index].input = e.target.value;
            setTestCases(updated);
          }}
          rows={3}
          className="w-full bg-gray-900 border border-gray-700 px-3 py-2 rounded-md resize-y mb-2"
        />
        <textarea
          placeholder="Output"
          value={tc.output}
          onChange={(e) => {
            const updated = [...testCases];
            updated[index].output = e.target.value;
            setTestCases(updated);
          }}
          rows={3}
          className="w-full bg-gray-900 border border-gray-700 px-3 py-2 rounded-md resize-y mb-2"
        />
        {hasExplanation && (
          <textarea
            placeholder="Explanation"
            value={tc.explanation}
            onChange={(e) => {
              const updated = [...testCases];
              updated[index].explanation = e.target.value;
              setTestCases(updated);
            }}
            rows={2}
            className="w-full bg-gray-900 border border-gray-700 px-3 py-2 rounded-md resize-y"
          />
        )}
      </motion.div>
    ))}

    <motion.button
      type="button"
      onClick={() =>
        setTestCases([
          ...testCases,
          hasExplanation
            ? { input: "", output: "", explanation: "" }
            : { input: "", output: "" },
        ])
      }
      className="mt-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-md cursor-pointer"
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
    >
      + Add {title}
    </motion.button>
  </motion.div>
);

const CreateProblem = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [tags, setTags] = useState("");
  const [constraints, setConstraints] = useState([""]);
  const [inputFormat, setInputFormat] = useState([""]);
  const [outputFormat, setOutputFormat] = useState([""]);
  const [timeLimit, setTimeLimit] = useState(1);
  const [memoryLimit, setMemoryLimit] = useState(256);

  const [sampleTestCases, setSampleTestCases] = useState([{ input: "", output: "", explanation: "" }]);
  const [hiddenTestCases, setHiddenTestCases] = useState([{ input: "", output: "" }]);

  const [createProblem, { isLoading }] = useCreateProblemMutation();
  const [generateTestCases, { isLoading: isGenerating }] = useGenerateTestCasesMutation();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title,
      description,
      difficulty,
      tags: tags.split(",").map(tag => tag.trim()).filter(Boolean),
      constraints: constraints.filter(c => c.trim() !== ""),
      inputFormat: inputFormat.filter(c => c.trim() !== ""),
      outputFormat: outputFormat.filter(c => c.trim() !== ""),
      timeLimit,
      memoryLimit,
      sampleTestCases,
      hiddenTestCases,
    };

    try {
      await createProblem(payload).unwrap();
      toast.success("Problem created!");
      navigate("/admin");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create problem");
    }
  };

  const handleGenerateAITestCases = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill Title and Description first");
      return;
    }

    const payload = {
      title,
      description,
      difficulty,
      constraints: constraints.filter(c => c.trim() !== ""),
      inputFormat: inputFormat.filter(c => c.trim() !== ""),
      outputFormat: outputFormat.filter(c => c.trim() !== ""),
    };

    try {
      const { testCases } = await generateTestCases(payload).unwrap();

      const parsedTestCases = [];
      const regex = /```[\s\S]*?Input:\s*([\s\S]*?)Expected Output:\s*([\s\S]*?)```/g;

      let match;
      while ((match = regex.exec(testCases)) !== null) {
        parsedTestCases.push({
          input: match[1].trim(),
          output: match[2].trim(),
        });
      }

      if (parsedTestCases.length === 0) {
        setHiddenTestCases([...hiddenTestCases, { input: testCases, output: "" }]);
        toast.error("Failed to parse test cases properly. Added as raw.");
      } else {
        setHiddenTestCases([...hiddenTestCases, ...parsedTestCases]);
        toast.success(`${parsedTestCases.length} AI test cases added!`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate AI test cases");
    }
  };

  return (
    <motion.div className="min-h-screen bg-gray-950 text-white px-4 py-10"
      initial="hidden" animate="visible" variants={containerVariants}>
      <motion.div className="max-w-4xl mx-auto bg-gray-900 p-6 rounded-xl border border-gray-800 shadow"
        variants={fieldVariants}>
        <h2 className="text-2xl font-bold mb-6 text-center">📝 Create New Problem</h2>

        <motion.form onSubmit={handleSubmit} className="space-y-6" variants={containerVariants}>
          <motion.div variants={fieldVariants}>
            <label className="block text-sm font-semibold mb-1">Title</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 px-3 py-2 rounded-md" />
          </motion.div>

          <motion.div variants={fieldVariants}>
            <label className="block text-sm font-semibold mb-1">Description</label>
            <textarea required value={description} onChange={(e) => setDescription(e.target.value)}
              rows={4} className="w-full bg-gray-800 border border-gray-700 px-3 py-2 rounded-md resize-y" />
          </motion.div>

          <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4" variants={fieldVariants}>
            <div>
              <label className="block text-sm font-semibold mb-1">Difficulty</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 px-3 py-2 rounded-md">
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Tags (comma-separated)</label>
              <input type="text" value={tags} onChange={(e) => setTags(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 px-3 py-2 rounded-md" />
            </div>
          </motion.div>

          <DynamicField label="Constraints" values={constraints} setValues={setConstraints} />
          <DynamicField label="Input Format" values={inputFormat} setValues={setInputFormat} />
          <DynamicField label="Output Format" values={outputFormat} setValues={setOutputFormat} />

          <TestCasesSection title="Sample Test Cases" testCases={sampleTestCases} setTestCases={setSampleTestCases} hasExplanation />

          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Hidden Test Cases</h3>
            <motion.button
              type="button"
              onClick={handleGenerateAITestCases}
              disabled={isGenerating}
              className={`px-4 py-2 rounded-md font-semibold cursor-pointer ${
                isGenerating ? "bg-gray-700" : "bg-purple-600 hover:bg-purple-500"
              }`}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              {isGenerating ? "Generating..." : "Generate AI Test Cases"}
            </motion.button>
          </div>

          <TestCasesSection title="" testCases={hiddenTestCases} setTestCases={setHiddenTestCases} hasExplanation={false} />

          <motion.button type="submit" disabled={isLoading}
            className={`w-full px-4 py-2 rounded-md font-semibold cursor-pointer ${
              isLoading ? "bg-gray-700" : "bg-green-600 hover:bg-green-500"
            }`}
            variants={buttonVariants} whileHover="hover" whileTap="tap">
            {isLoading ? "Creating..." : "Create Problem"}
          </motion.button>
        </motion.form>
      </motion.div>
    </motion.div>
  );
};

export default CreateProblem;
