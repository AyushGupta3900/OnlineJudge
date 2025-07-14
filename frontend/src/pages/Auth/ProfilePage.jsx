import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import {
  useDeleteAccountMutation,
  useUpdateAccountMutation,
  useGetProfileStatsQuery,
} from "../../redux/api/userAPI.js";
import { logout } from "../../redux/reducers/authReducer.js";

import {
  FaLock,
  FaUser,
  FaStar,
  FaCheckCircle,
  FaTimesCircle,
  FaRocket,
  FaMedal,
  FaCrown,
  FaLightbulb,
  FaCode,
  FaTrophy,
  FaStar as FaLegend,
} from "react-icons/fa";
import { PiCodeBlockBold } from "react-icons/pi";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const MySwal = withReactContent(Swal);

const COLORS = { Easy: "#00C49F", Medium: "#FFBB28", Hard: "#FF4444" };

const getDifficultyStats = (solvedCountByDifficulty = {}) => {
  return ["Easy", "Medium", "Hard"].map((difficulty) => ({
    name: difficulty,
    value: Number(solvedCountByDifficulty[difficulty] || 0),
    fill: COLORS[difficulty],
  }));
};

const earnedBadges = (solvedCount) =>
  [
    { threshold: 10, label: "Rookie", icon: <FaCheckCircle /> },
    { threshold: 25, label: "Novice", icon: <FaUser /> },
    { threshold: 50, label: "Apprentice", icon: <FaCode /> },
    { threshold: 75, label: "Skilled", icon: <FaLightbulb /> },
    { threshold: 100, label: "Advanced", icon: <FaRocket /> },
    { threshold: 200, label: "Expert", icon: <FaCrown /> },
    { threshold: 300, label: "Master", icon: <FaTrophy /> },
    { threshold: 400, label: "Grandmaster", icon: <FaMedal /> },
    { threshold: 500, label: "Legend", icon: <FaLegend /> },
  ].filter((b) => solvedCount >= b.threshold);

const ProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white px-3 py-8 space-y-8 animate-pulse">
      {/* Hero Section */}
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative">
          <div className="w-24 h-24 rounded-full border-4 border-gray-900 absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-700" />
        </div>
        <div className="mt-16 text-center p-4 space-y-2">
          <div className="h-5 w-1/4 mx-auto bg-gray-700 rounded" />
          <div className="h-4 w-1/3 mx-auto bg-gray-700 rounded" />
          <div className="h-3 w-1/2 mx-auto bg-gray-700 rounded" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4 max-w-4xl mx-auto">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-800 rounded-xl p-4 flex flex-col items-center gap-2 shadow"
          >
            <div className="w-10 h-10 bg-gray-700 rounded-full" />
            <div className="h-3 w-1/3 bg-gray-700 rounded" />
            <div className="h-4 w-1/4 bg-gray-700 rounded" />
          </div>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="max-w-4xl mx-auto">
        <div className="h-5 w-40 mx-auto bg-gray-700 rounded mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-center">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-800 rounded-lg p-4 text-center shadow border border-gray-700"
            >
              <div className="w-6 h-6 mx-auto bg-gray-700 rounded-full mb-2" />
              <div className="h-3 w-1/2 mx-auto bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Pie Chart Placeholder */}
      <div className="max-w-4xl mx-auto bg-gray-900 rounded-xl shadow-lg p-6">
        <div className="h-5 w-64 mx-auto bg-gray-700 rounded mb-4" />
        <div className="flex flex-col md:flex-row items-center justify-around">
          <div className="w-full md:w-1/2 h-80 flex items-center justify-center">
            <div className="w-48 h-48 bg-gray-700 rounded-full" />
          </div>
          <div className="mt-6 md:mt-0 md:w-1/3 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex justify-between px-4 py-2 bg-gray-800 rounded shadow text-sm"
              >
                <div className="h-3 w-1/4 bg-gray-700 rounded" />
                <div className="h-3 w-6 bg-gray-700 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const HeroSection = ({ user }) => (
  <motion.div className="max-w-3xl mx-auto bg-gray-900 rounded-xl shadow-lg overflow-hidden">
    <div className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative block">
      <motion.img
        src={user.avatar || "/logo.png"}
        alt="Avatar"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="w-24 h-24 rounded-full border-4 border-gray-900 absolute -bottom-12 left-1/2 transform -translate-x-1/2 shadow-lg"
      />
    </div>
    <div className="mt-16 text-center p-4">
      <h1 className="text-2xl font-bold">{user.fullName || user.username}</h1>
      <p className="text-gray-400">{user.email}</p>
      {user.bio && (
        <p className="text-sm italic mt-1 text-gray-500">{user.bio}</p>
      )}
    </div>
  </motion.div>
);

const StatsGrid = ({ user }) => {
  console.log(user)
  const stats = [
    { label: "Username", value: user.username, icon: <FaUser /> },
    { label: "Rating", value: user.computedRating, icon: <FaStar /> },
    { label: "Role", value: user.role, icon: <FaLock /> },
    { label: "Solved", value: user.totalSolved, icon: <FaCheckCircle /> },
    {
      label: "Submissions",
      value: user.totalSubmissions,
      icon: <PiCodeBlockBold />,
    },
    {
      label: "Wrong Submissions",
      value: user.totalWrongSubmissions,
      icon: <FaTimesCircle className="text-red-500" />,
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8 max-w-4xl mx-auto">
      {stats.map((s, i) => (
        <div
          key={i}
          className="bg-gray-800 rounded-xl p-4 flex flex-col items-center gap-1 shadow"
        >
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-12 max-w-5xl mx-auto px-4"
    >
      <h2 className="text-3xl font-extrabold text-center text-yellow-300 mb-8 tracking-tight">
        🏅 Earned Badges
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 justify-center">
        {badges.map((b, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.06, rotate: 1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900/80 backdrop-blur-sm rounded-xl px-4 py-6 text-center shadow-lg border border-gray-700 hover:shadow-xl transition"
          >
            <div className="text-3xl mb-2 text-teal-300 drop-shadow">{b.icon}</div>
            <div className="text-sm font-medium text-gray-200">{b.label}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const DifficultyPie = ({ pieData }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="mt-12 max-w-5xl mx-auto px-4"
  >
    <div className="bg-gray-900 rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-extrabold text-center text-pink-400 mb-8 tracking-tight">
        Problem Difficulty Distribution
      </h2>

      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Pie Chart */}
        <div className="w-full md:w-1/2 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  color: "#f8fafc",
                  borderRadius: "0.5rem",
                  border: "1px solid #334155",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="w-full md:w-1/3 space-y-4">
          {pieData.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-3 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-gray-200 font-medium">{item.name}</span>
              </div>
              <span className="text-gray-300 font-semibold">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);


const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: user, isLoading } = useGetProfileStatsQuery();
  const [deleteUserAccount] = useDeleteAccountMutation();
  const [updateUserAccount] = useUpdateAccountMutation();

  if (isLoading || !user) return <ProfileSkeleton />;

  const pieData = getDifficultyStats(user?.solvedCountByDifficulty);

  const handleDelete = async () => {
    const result = await MySwal.fire({
      title: "Delete Account?",
      text: "This is irreversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      background: "#1f2937", // dark gray
      color: "#f8fafc", // light text
      iconColor: "#f87171", // red
      customClass: {
        popup: "rounded-xl",
        confirmButton:
          "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded",
        cancelButton:
          "bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded",
      },
    });
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
      title: "Update Profile",
      html: `
      <input id="swal-input1" class="swal2-input" placeholder="Full Name" style="background:#374151; color:white;" value="${
        user.fullName || ""
      }">
      <textarea id="swal-input2" class="swal2-textarea" placeholder="Bio" style="background:#374151; color:white;">${
        user.bio || ""
      }</textarea>`,
      preConfirm: () => {
        const fullName = document.getElementById("swal-input1").value.trim();
        const bio = document.getElementById("swal-input2").value.trim();
        if (!fullName || !bio)
          Swal.showValidationMessage("Both fields are required");
        return { fullName, bio };
      },
      background: "#1f2937", // dark
      color: "#f8fafc", // light
      confirmButtonText: "Update",
      cancelButtonText: "Cancel",
      showCancelButton: true,
      iconColor: "#60a5fa", // blue
      customClass: {
        popup: "rounded-xl",
        confirmButton:
          "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded",
        cancelButton:
          "bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded",
      },
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white px-3 py-8"
    >
      <HeroSection user={user} />
      <StatsGrid user={user} />
      <BadgesGrid solvedCount={user?.totalSolved || 0} />
      <DifficultyPie pieData={pieData} />
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
    </motion.div>
  );
};

export default ProfilePage;
