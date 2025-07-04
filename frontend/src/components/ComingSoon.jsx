import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";

const ComingSoon = () => {
  const {id: courseId} = useParams();
  console.log(courseId)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white flex flex-col items-center justify-center px-4"
    >
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-4"
      >
        🚧 Coming Soon
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-lg text-gray-400 text-center max-w-xl"
      >
        The course <span className="text-white font-semibold">{courseId}</span> is under construction.
        We’re working hard to bring you high-quality content soon!
      </motion.p>

      <Link
        to="/"
        className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition"
      >
      Go to Home
      </Link>
    </motion.div>
  );
};

export default ComingSoon;
