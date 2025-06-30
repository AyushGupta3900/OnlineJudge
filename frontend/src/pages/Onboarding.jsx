import { useState } from "react";
import { FaLaptopCode } from "react-icons/fa";
import useOnboarding from "../hooks/useOnboarding";

const Onboarding = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
  });

  const [error, setError] = useState("");

  const { submitOnboarding, isLoading } = useOnboarding();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.fullName || !formData.bio) {
      return setError("Full name and bio are required.");
    }

    await submitOnboarding({
      fullName: formData.fullName,
      bio: formData.bio,
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center px-4 py-10">
      <div className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden p-8 space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <FaLaptopCode className="text-3xl text-blue-500" />
          <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            CodeX
          </span>
        </div>
        <h2 className="text-2xl font-bold mb-2">Complete the Onboarding</h2>
        <p className="text-gray-400 text-sm">
          Let’s complete your profile to get started!
        </p>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="John Doe"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              placeholder="I'm a passionate problem solver..."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 text-lg font-semibold rounded-lg transition ${
              isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Submitting..." : "Complete Onboarding"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
