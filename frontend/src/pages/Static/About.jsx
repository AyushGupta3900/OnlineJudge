import { motion } from "framer-motion";

const About = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 to-black text-white flex items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl w-full text-center space-y-12"
      >
        {/* Title */}
        <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-transparent bg-clip-text drop-shadow-lg">
          About CodeX
        </h1>

        {/* Description */}
        <section className="space-y-6 text-gray-300 text-lg leading-relaxed">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="font-bold text-white">CodeX</span> is a{" "}
            <span className="text-cyan-400 font-medium">cutting-edge</span>{" "}
            online judge platform for ambitious developers mastering{" "}
            <span className="text-cyan-400 font-medium">Data Structures</span>,{" "}
            <span className="text-purple-400 font-medium">Algorithms</span>, and{" "}
            <span className="text-pink-400 font-medium">System Design</span>.{" "}
            Whether preparing for interviews, competing in contests, or just
            enjoying problem-solving — this is your space to grow.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Our mission is to make coding practice{" "}
            <span className="text-white font-semibold">seamless</span>,{" "}
            <span className="text-white font-semibold">enjoyable</span>, and{" "}
            <span className="text-white font-semibold">accessible</span> to
            everyone. With curated problems, structured paths, and a vibrant
            developer community, CodeX helps you become{" "}
            <span className="text-green-400 font-semibold">interview-ready</span>{" "}
            and{" "}
            <span className="text-blue-300 font-semibold">industry-proven</span>.
          </motion.p>
        </section>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="w-24 h-1 mx-auto bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full"
        ></motion.div>

        {/* Creator */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex justify-center mt-8"
        >
          <a
            href="https://linktr.ee/Ayush_Gupta_3900"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl p-8 flex flex-col items-center space-y-4 hover:scale-105 transition-transform duration-300 cursor-pointer"
          >
            <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-purple-500 shadow-md hover:shadow-purple-700 transition-shadow duration-300">
              <img
                src="/creator.png"
                alt="Ayush Gupta"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <h3 className="text-2xl font-bold text-purple-400 drop-shadow">
              Ayush Gupta
            </h3>
            <p className="text-sm text-gray-400">
              Creator & Developer of CodeX
            </p>
            <p className="text-xs text-gray-500 italic">
              “Crafted with ❤️ for developers”
            </p>
          </a>
        </motion.section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-xs text-gray-600 mt-12"
        >
          &copy; {new Date().getFullYear()}{" "}
          <span className="text-white font-medium">CodeX</span> — All Rights
          Reserved
        </motion.footer>
      </motion.div>
    </main>
  );
};

export default About;
