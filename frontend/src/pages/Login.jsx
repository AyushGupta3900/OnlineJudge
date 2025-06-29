import { useState } from "react";
import { Link } from "react-router-dom"; // fixed from "react-router"
import { FaLaptopCode } from "react-icons/fa";

const Login = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const isPending = false;
  const error = null;

  const handleLogin = (e) => {
    e.preventDefault();
    // loginMutation(loginData);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row shadow-2xl rounded-xl overflow-hidden border border-gray-700 bg-gray-800">
        
        {/* Left: Login Form */}
        <div className="w-full lg:w-1/2 p-6 sm:p-10 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <FaLaptopCode className="text-3xl text-blue-500" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              CodeX
            </span>
          </div>

          {error && <p className="text-red-500 text-sm">{error.response.data.message}</p>}

          <h2 className="text-2xl font-bold">Welcome Back</h2>
          <p className="text-gray-400 text-sm mb-6">
            Sign in to continue solving DSA challenges and track your progress.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="text-sm">Email</span>
              </label>
              <input
                type="email"
                placeholder="hello@example.com"
                className="input input-bordered bg-gray-700 text-white w-full"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="text-sm">Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered bg-gray-700 text-white w-full"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full bg-blue-600 hover:bg-blue-700 border-none"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <p className="text-sm text-center mt-4">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-400 hover:underline">
                Create one
              </Link>
            </p>
          </form>
        </div>

        {/* Right*/}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-gray-900 items-center justify-center p-10 border-l border-gray-700">
          <div className="text-center space-y-6 max-w-md">
            <div className="relative aspect-square max-w-xs mx-auto rounded-lg overflow-hidden shadow-lg">
              <img
                src="/i.jpg" 
                alt="Coding illustration"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold text-white">
              Level up your coding skills
            </h3>
            <p className="text-gray-400 text-sm">
              Solve real-world DSA problems, track your performance, and prepare for tech interviews with CodeX.
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Login;
