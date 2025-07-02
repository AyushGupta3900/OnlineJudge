const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white px-6 py-16 flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-10">
        {/* Title */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text drop-shadow-md">
            Contact Us
          </h1>
          <p className="text-gray-400 text-lg">
            Have a question, suggestion, or just want to say hello? We'd love to hear from you!
          </p>
        </div>

        {/* Contact Form */}
        <form className="space-y-6 bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-3 rounded-lg bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
            <textarea
              placeholder="Write your message..."
              rows="5"
              className="w-full px-4 py-3 rounded-lg bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            ></textarea>
          </div>

          <div className="text-center pt-4">
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white px-8 py-3 rounded-full font-semibold shadow-md transition duration-300 hover:cursor-pointer"
            >
              🚀 Send Message
            </button>
          </div>
        </form>

        {/* Email alternative */}
        <div className="text-center text-gray-400 text-sm">
          Or email us directly at{" "}
          <a
            href="mailto:support@codex.com"
            className="text-blue-400 hover:underline"
          >
            support@codex.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
