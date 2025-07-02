import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

// Components
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import PageLoader from "./components/PageLoader";
import useAuthUser from "./hooks/useAuthUser"; 
import ScrollToTop from "./components/ScrollToTop"

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Problems = lazy(() => import("./pages/Problems"));
const ProblemPage = lazy(() => import("./pages/ProblemPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const SubmissionPage = lazy(() => import("./pages/SubmissionPage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const CreateProblem = lazy(() => import("./pages/CreateProblem"));
const UpdateProblem = lazy(() => import("./pages/UpdateProblem"));
const Users = lazy(() => import("./pages/Users"));
const Courses = lazy(() => import("./pages/Courses"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

export default function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isOnboarded = useSelector((state) => state.auth.user?.isOnboarded);
  const { isLoading } = useAuthUser(); 

  if (isLoading) {
    return <PageLoader />; 
  }

  return (
    <Router>
      <Nav />
      <Toaster position="top-center" reverseOrder={false} />
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!isAuthenticated ? <Signup /> : <Navigate to="/" />}
          />

          {/* Onboarding Route */}
          <Route
            path="/onboarding"
            element={
              isAuthenticated && !isOnboarded ? (
                <Onboarding />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              isAuthenticated && isOnboarded ? (
                <Home />
              ) : (
                <Navigate to={isAuthenticated ? "/onboarding" : "/login"} />
              )
            }
          />
          <Route
            path="/problems"
            element={
              isAuthenticated && isOnboarded ? (
                <Problems />
              ) : (
                <Navigate to={isAuthenticated ? "/onboarding" : "/login"} />
              )
            }
          />
          <Route
            path="/problems/:id"
            element={
              isAuthenticated && isOnboarded ? (
                <ProblemPage />
              ) : (
                <Navigate to={isAuthenticated ? "/onboarding" : "/login"} />
              )
            }
          />
          <Route
            path="/submissions/problem/:id"
            element={
              isAuthenticated && isOnboarded ? (
                <SubmissionPage />
              ) : (
                <Navigate to={isAuthenticated ? "/onboarding" : "/login"} />
              )
            }
          />
          <Route
            path="/profile"
            element={
              isAuthenticated && isOnboarded ? (
                <ProfilePage />
              ) : (
                <Navigate to={isAuthenticated ? "/onboarding" : "/login"} />
              )
            }
          />
          <Route
            path="/courses"
            element={
              isAuthenticated && isOnboarded ? (
                <Courses />
              ) : (
                <Navigate to={isAuthenticated ? "/onboarding" : "/login"} />
              )
            }
          />
          <Route
            path="/contact"
            element={
              isAuthenticated && isOnboarded ? (
                <Contact />
              ) : (
                <Navigate to={isAuthenticated ? "/onboarding" : "/login"} />
              )
            }
          />
          <Route
            path="/about"
            element={
              isAuthenticated && isOnboarded ? (
                <About />
              ) : (
                <Navigate to={isAuthenticated ? "/onboarding" : "/login"} />
              )
            }
          />
          <Route
            path="/admin"
            element={
              isAuthenticated && isOnboarded ? (
                <AdminDashboard />
              ) : (
                <Navigate to={isAuthenticated ? "/onboarding" : "/login"} />
              )
            }
          />
          <Route
            path="/admin/add-problem"
            element={
              isAuthenticated && isOnboarded ? (
                <CreateProblem />
              ) : (
                <Navigate to={isAuthenticated ? "/onboarding" : "/login"} />
              )
            }
          />
          <Route
            path="/admin/edit-problem/:id"
            element={
              isAuthenticated && isOnboarded ? (
                <UpdateProblem />
              ) : (
                <Navigate to={isAuthenticated ? "/onboarding" : "/login"} />
              )
            }
          />
          <Route
            path="/admin/users"
            element={
              isAuthenticated && isOnboarded ? (
                <Users />
              ) : (
                <Navigate to={isAuthenticated ? "/onboarding" : "/login"} />
              )
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
    </Router>
  );
}
