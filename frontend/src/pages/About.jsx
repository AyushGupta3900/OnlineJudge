const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center px-6 py-16">
      <div className="max-w-3xl text-center space-y-8">
        {/* Title */}
        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text drop-shadow-lg">
          About CodeX
        </h1>

        {/* Paragraphs */}
        <p className="text-lg text-gray-300 leading-relaxed">
          <span className="font-semibold text-white">CodeX</span> is a modern online judge platform designed for aspiring developers who want to level up in
          <span className="text-blue-400 font-medium"> Data Structures</span>, 
          <span className="text-purple-400 font-medium"> Algorithms</span>, and 
          <span className="text-pink-400 font-medium"> System Design</span>.
          Whether you're preparing for interviews, tackling competitive challenges, or exploring the thrill of problem-solving — you're in the right place.
        </p>

        <p className="text-gray-400">
          Our mission is to make coding practice <span className="text-white font-semibold">seamless</span>, <span className="text-white font-semibold">enjoyable</span>, and 
          <span className="text-white font-semibold"> accessible to everyone</span>. With expertly curated problems, structured learning paths, and a growing developer community, CodeX empowers you to become <span className="text-green-400 font-semibold">interview-ready</span> and <span className="text-blue-300 font-semibold">industry-proven</span>.
        </p>

        {/* Divider */}
        <div className="w-20 h-1 mx-auto bg-gradient-to-r from-blue-400 to-purple-600 rounded-full"></div>

        {/* Footer Note */}
        <div className="mt-6 text-sm text-gray-500">
          Crafted with <span className="text-pink-400">❤️</span> by the <span className="text-white font-medium">CodeX Team</span>
        </div>
      </div>
    </div>
  );
};

export default About;
