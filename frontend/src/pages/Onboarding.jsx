import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLaptopCode } from "react-icons/fa";

const Onboarding = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
  });
  
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setError("Please upload a valid image file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center px-4 py-10">
      <div className="w-full max-w-5xl bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left: Form */}
        <div className="p-8 md:p-10 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <FaLaptopCode className="text-3xl text-blue-500" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              CodeX
            </span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Welcome to CodeX</h2>
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

            <div>
              <label className="block mb-1 text-sm">
                Upload Avatar (optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="file-input file-input-bordered file-input-sm w-full bg-gray-700 text-white border-gray-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 text-lg font-semibold rounded-lg transition ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Submitting..." : "Complete Onboarding"}
            </button>
          </form>

        </div>

        {/* Right: Preview */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gray-900 p-10 border-l border-gray-700">
          <div className="text-center space-y-4">
            <div className="w-32 h-32 rounded-full overflow-hidden mx-auto border-4 border-blue-600">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="bg-gray-700 w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  No Avatar
                </div>
              )}
            </div>
            <h3 className="text-xl font-semibold">
              {formData.fullName || "Your Name"}
            </h3>
            <p className="text-gray-400 italic text-sm whitespace-pre-line">
              {formData.bio || "Your bio will appear here..."}
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Onboarding;
