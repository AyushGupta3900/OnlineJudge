import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import useAuthUser from "../../hooks/useAuthUser.js";
import {
  useDeleteUserAccountMutation,
  useUpdateUserAccountMutation,
} from "../../redux/api/authAPI.js";
import { logout } from "../../redux/reducers/authReducer.js";

import {
  FaLock, FaUser, FaStar, FaCheckCircle, FaTimesCircle, FaRocket,
  FaMedal, FaCrown, FaLightbulb, FaCode, FaTrophy, FaStar as FaLegend
} from "react-icons/fa";
import { PiCodeBlockBold } from "react-icons/pi";

import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const MySwal = withReactContent(Swal);

const COLORS = { Easy: "#00C49F", Medium: "#FFBB28", Hard: "#FF4444" };

const getDifficultyStats = (solvedProblems = [], solvedCountByDifficulty = {}) => {
  if (!solvedCountByDifficulty) solvedCountByDifficulty = {};
  return ["Easy", "Medium", "Hard"].map(difficulty => ({
    name: difficulty,
    value: Number(solvedCountByDifficulty[difficulty] || 0),
    fill: COLORS[difficulty]
  }));
};

const earnedBadges = (solvedCount) => [
  { threshold: 10, label: "Rookie", icon: <FaCheckCircle /> },
  { threshold: 25, label: "Novice", icon: <FaUser /> },
  { threshold: 50, label: "Apprentice", icon: <FaCode /> },
  { threshold: 75, label: "Skilled", icon: <FaLightbulb /> },
  { threshold: 100, label: "Advanced", icon: <FaRocket /> },
  { threshold: 200, label: "Expert", icon: <FaCrown /> },
  { threshold: 300, label: "Master", icon: <FaTrophy /> },
  { threshold: 400, label: "Grandmaster", icon: <FaMedal /> },
  { threshold: 500, label: "Legend", icon: <FaLegend /> }
].filter(b => solvedCount >= b.threshold);

const HeroSection = ({ user }) => (
  <motion.div className="max-w-3xl mx-auto bg-gray-900 rounded-xl shadow-lg overflow-hidden">
    <Link
      to="/"
      className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative block cursor-pointer"
    >
      <motion.img
        src="/logo.png"
        alt="LOGO"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="w-24 h-24 rounded-full border-4 border-gray-900 absolute -bottom-12 left-1/2 transform -translate-x-1/2 shadow-lg"
      />
    </Link>
    <div className="mt-16 text-center p-4">
      <h1 className="text-2xl font-bold">{user?.fullName || user?.username || "User"}</h1>
      <p className="text-gray-400">{user?.email || "No email"}</p>
      {user?.bio && (
        <p className="text-sm italic mt-1 text-gray-500">{user.bio}</p>
      )}
    </div>
  </motion.div>
);

const StatsGrid = ({ user }) => {
  const wrongSubmissions = user?.submissions?.filter(s => s.status !== "Accepted").length || 0;
  const stats = [
    { label: "Username", value: user?.username, icon: <FaUser /> },
    { label: "Rating", value: user?.computedRating ?? user?.rating, icon: <FaStar /> },
    { label: "Role", value: user?.role, icon: <FaLock /> },
    { label: "Solved", value: user?.solvedProblems?.length || 0, icon: <FaCheckCircle /> },
    { label: "Submissions", value: user?.submissions?.length || 0, icon: <PiCodeBlockBold /> },
    { label: "Wrong Submissions", value: wrongSubmissions, icon: <FaTimesCircle className="text-red-500" /> }
  ];

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8 max-w-4xl mx-auto">
      {stats.map((s, i) => (
        <div key={i} className="bg-gray-800 rounded-xl p-4 flex flex-col items-center gap-1 shadow">
          <div className="text-xl text-blue-400">{s.icon}</div>
          <p className="text-sm text-gray-400">{s.label}</p>
          <p className="text-lg font-semibold">{s.value}</p>
        </div>
      ))}
    </div>
  );
};

const BadgesGrid = ({ solvedCount }) => {
  const badges = earnedBadges(solvedCount);
  if (!badges.length) return null;

  return (
    <motion.div className="mt-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center text-yellow-400 mb-4">Earned Badges</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-center">
        {badges.map((b, idx) => (
          <motion.div key={idx} whileHover={{ scale: 1.05 }}
            className="bg-gray-800 rounded-lg p-3 text-center shadow border border-gray-700">
            <div className="text-xl mb-1 text-teal-300">{b.icon}</div>
            <div className="text-sm">{b.label}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const DifficultyPie = ({ pieData }) => (
  <motion.div className="mt-10 max-w-4xl mx-auto">
    <div className="bg-gray-900 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-center text-pink-300 mb-4">
        Problem Difficulty Distribution
      </h2>
      <div className="flex flex-col md:flex-row items-center justify-around">
        <div className="w-full md:w-1/2 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                innerRadius={50} outerRadius={100} paddingAngle={5}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", color: "#f8fafc" }} />
              <Legend verticalAlign="bottom" wrapperStyle={{ color: "#f8fafc" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-6 md:mt-0 md:w-1/3 text-center space-y-3">
          {pieData.map((item) => (
            <div key={item.name} className="flex justify-between px-4 py-2 bg-gray-800 rounded shadow text-sm">
              <span className="text-gray-300">{item.name}</span>
              <span style={{ color: item.fill }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

const AccountActions = ({ handleUpdate, handleDelete, createdAt, navigate }) => (
  <>
    <div className="mt-8 max-w-3xl mx-auto p-4 rounded-xl shadow flex flex-col sm:flex-row justify-center gap-4">
      <button
        onClick={handleUpdate}
        className="bg-blue-600 px-4 py-2 rounded shadow hover:bg-blue-700 cursor-pointer"
      >
        Update
      </button>
      <button
        onClick={handleDelete}
        className="bg-red-600 px-4 py-2 rounded shadow hover:bg-red-700 cursor-pointer"
      >
        Delete
      </button>
      <button
        onClick={() => navigate("/submissions")}
        className="bg-green-600 px-4 py-2 rounded shadow hover:bg-green-700 cursor-pointer"
      >
        View Submissions
      </button>
    </div>
    <p className="text-center text-xs text-gray-500 mt-4">
      🎉 Account created:{" "}
      <span className="text-gray-300">
        {createdAt ? new Date(createdAt).toDateString() : "N/A"}
      </span>
    </p>
  </>
);

const ProfilePage = () => {
  const { authUser: user } = useAuthUser();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [deleteUserAccount] = useDeleteUserAccountMutation();
  const [updateUserAccount] = useUpdateUserAccountMutation();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-blue-400 font-medium">
        <p>Loading profile...</p>
      </div>
    );
  }

  const pieData = getDifficultyStats(user?.solvedProblems, user?.solvedCountByDifficulty);

  const handleDelete = async () => {
    const result = await MySwal.fire({ title: "Delete Account?", text: "This is irreversible.", icon: "warning", showCancelButton: true });
    if (result.isConfirmed) {
      try {
        await deleteUserAccount().unwrap();
        dispatch(logout());
        toast.success("Account deleted");
        navigate("/login");
      } catch {
        toast.error("Failed to delete");
      }
    }
  };

  const handleUpdate = async () => {
    const { value } = await MySwal.fire({
      title: "Update Profile", html: `
        <input id="swal-input1" class="swal2-input" value="${user.fullName || ""}">
        <textarea id="swal-input2" class="swal2-textarea">${user.bio || ""}</textarea>`,
      preConfirm: () => {
        const fullName = document.getElementById("swal-input1").value.trim();
        const bio = document.getElementById("swal-input2").value.trim();
        if (!fullName || !bio) Swal.showValidationMessage("Both required");
        return { fullName, bio };
      }
    });
    if (value) {
      try {
        await updateUserAccount(value).unwrap();
        toast.success("Profile updated");
      } catch {
        toast.error("Update failed");
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white px-3 py-8">
      <HeroSection user={user} />
      <StatsGrid user={user} />
      <BadgesGrid solvedCount={user?.solvedProblems?.length || 0} />
      <DifficultyPie pieData={pieData} />
      <AccountActions handleUpdate={handleUpdate} handleDelete={handleDelete} createdAt={user.createdAt} navigate={navigate} />
    </motion.div>
  );
};

export default ProfilePage;
