import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetProblemByIdQuery,
  useUpdateProblemMutation,
} from "../redux/api/problemAPI";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";
import { FiX } from "react-icons/fi";

const UpdateProblem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading: isFetching } = useGetProblemByIdQuery(id);
  const [updateProblem, { isLoading }] = useUpdateProblemMutation();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "Easy",
    tags: "",
    constraints: [""],
    inputFormat: [""],
    outputFormat: [""],
    timeLimit: 1,
    memoryLimit: 256,
    sampleTestCases: [{ input: "", output: "", explanation: "" }],
    hiddenTestCases: [{ input: "", output: "" }],
  });

  useEffect(() => {
    if (data?.data) {
      const problem = data.data;
      setFormData({
        title: problem.title,
        description: problem.description,
        difficulty: problem.difficulty,
        tags: problem.tags.join(", "),
        constraints: problem.constraints || [""],
        inputFormat: problem.inputFormat || [""],
        outputFormat: problem.outputFormat || [""],
        timeLimit: problem.timeLimit,
        memoryLimit: problem.memoryLimit,
        sampleTestCases: problem.sampleTestCases,
        hiddenTestCases: problem.hiddenTestCases,
      });
    }
  }, [data]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTestCaseChange = (type, index, field, value) => {
    const updated = [...formData[type]];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, [type]: updated }));
  };

  const addTestCase = (type) => {
    const newCase =
      type === "sampleTestCases"
        ? { input: "", output: "", explanation: "" }
        : { input: "", output: "" };
    setFormData((prev) => ({
      ...prev,
      [type]: [...prev[type], newCase],
    }));
  };

  const removeTestCase = (type, index) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedProblem = {
      ...formData,
      tags: formData.tags.split(",").map((tag) => tag.trim()),
      constraints: formData.constraints.filter((v) => v.trim() !== ""),
      inputFormat: formData.inputFormat.filter((v) => v.trim() !== ""),
      outputFormat: formData.outputFormat.filter((v) => v.trim() !== ""),
    };

    try {
      await updateProblem({ id, ...updatedProblem }).unwrap();
      navigate("/admin");
    } catch (error) {
      if (error.status === 403) {
        toast.error("You are unauthorized to update this problem");
      }
      console.error("Update failed:", error);
    }
  };

  if (isFetching) return <PageLoader />;

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-10">
      <div className="max-w-4xl mx-auto bg-gray-900 p-6 rounded-xl border border-gray-800 shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">✏️ Update Problem</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div>
            <label className="block mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 px-3 py-2 rounded-md"
            />
          </div>
          <div>
            <label className="block mb-1">Description</label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 px-3 py-2 rounded-md resize-y"
            />
          </div>

          <div>
            <label className="block mb-1">Difficulty</label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 px-3 py-2 rounded-md"
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 px-3 py-2 rounded-md"
            />
          </div>

          {/* Dynamic Fields */}
          {["constraints", "inputFormat", "outputFormat"].map((field) => (
            <div key={field}>
              <label className="block mb-1 capitalize">{field}</label>
              {formData[field].map((value, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => {
                      const updated = [...formData[field]];
                      updated[idx] = e.target.value;
                      setFormData((prev) => ({ ...prev, [field]: updated }));
                    }}
                    className="flex-1 bg-gray-800 border border-gray-700 px-3 py-2 rounded-md"
                  />
                  {formData[field].length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const updated = formData[field].filter((_, i) => i !== idx);
                        setFormData((prev) => ({ ...prev, [field]: updated }));
                      }}
                      className="text-red-500 hover:text-red-400 cursor-pointer"
                      title={`Remove ${field}`}
                    >
                      <FiX size={20} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    [field]: [...prev[field], ""],
                  }))
                }
                className="mt-1 px-3 py-1 bg-blue-700 hover:bg-blue-600 rounded text-sm cursor-pointer"
              >
                + Add {field}
              </button>
            </div>
          ))}

          {/* Time & Memory */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Time Limit (sec)</label>
              <input
                type="number"
                name="timeLimit"
                value={formData.timeLimit}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 px-3 py-2 rounded-md"
              />
            </div>
            <div>
              <label className="block mb-1">Memory Limit (MB)</label>
              <input
                type="number"
                name="memoryLimit"
                value={formData.memoryLimit}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 px-3 py-2 rounded-md"
              />
            </div>
          </div>

          {/* Sample Test Cases */}
          <div>
            <label className="block mb-2">Sample Test Cases</label>
            {formData.sampleTestCases.map((tc, index) => (
              <div
                key={index}
                className="relative border border-gray-700 rounded-md p-4 mb-4 bg-gray-800"
              >
                <button
                  type="button"
                  onClick={() => removeTestCase("sampleTestCases", index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-400 cursor-pointer"
                  title="Remove Sample Test Case"
                >
                  <FiX size={18} />
                </button>
                {["input", "output", "explanation"].map((field) => (
                  <textarea
                    key={field}
                    placeholder={field}
                    value={tc[field]}
                    onChange={(e) =>
                      handleTestCaseChange("sampleTestCases", index, field, e.target.value)
                    }
                    rows={field === "explanation" ? 2 : 3}
                    className="w-full bg-gray-900 border border-gray-700 px-3 py-2 rounded-md resize-y mb-2"
                  />
                ))}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addTestCase("sampleTestCases")}
              className="mt-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-md cursor-pointer"
            >
              + Add Sample Test Case
            </button>
          </div>

          {/* Hidden Test Cases */}
          <div>
            <label className="block mb-2">Hidden Test Cases</label>
            {formData.hiddenTestCases.map((tc, index) => (
              <div
                key={index}
                className="relative border border-gray-700 rounded-md p-4 mb-4 bg-gray-800"
              >
                <button
                  type="button"
                  onClick={() => removeTestCase("hiddenTestCases", index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-400 cursor-pointer"
                  title="Remove Hidden Test Case"
                >
                  <FiX size={18} />
                </button>
                {["input", "output"].map((field) => (
                  <textarea
                    key={field}
                    placeholder={field}
                    value={tc[field]}
                    onChange={(e) =>
                      handleTestCaseChange("hiddenTestCases", index, field, e.target.value)
                    }
                    rows={3}
                    className="w-full bg-gray-900 border border-gray-700 px-3 py-2 rounded-md resize-y mb-2"
                  />
                ))}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addTestCase("hiddenTestCases")}
              className="mt-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-md cursor-pointer"
            >
              + Add Hidden Test Case
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-500 px-4 py-2 rounded-md font-semibold cursor-pointer"
          >
            {isLoading ? "Updating..." : "Update Problem"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProblem;
