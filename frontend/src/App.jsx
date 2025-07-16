import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

import Nav from "./components/Nav";
import Footer from "./components/Footer";
import PageLoader from "./components/PageLoader";
import ScrollToTop from "./components/ScrollToTop";
import useAuthUser from "./hooks/useAuthUser";

// Lazy-loaded Pages
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Auth/Login"));
const Signup = lazy(() => import("./pages/Auth/Signup"));
const Onboarding = lazy(() => import("./pages/Auth/Onboarding"));
const ProfilePage = lazy(() => import("./pages/Auth/ProfilePage"));

const Problems = lazy(() => import("./pages/Problems/Problems"));
const ProblemPage = lazy(() => import("./pages/Problems/ProblemPage"));
const CreateProblem = lazy(() => import("./pages/Problems/CreateProblem"));
const UpdateProblem = lazy(() => import("./pages/Problems/UpdateProblem"));

const SubmissionPage = lazy(() => import("./pages/Submissions/SubmissionPage"));
const AllSubmissionsPage = lazy(() =>
  import("./pages/Submissions/AllSubmissionsPage")
);

const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));
const Users = lazy(() => import("./pages/Admin/Users"));
const ContactMessages = lazy(() => import("./pages/Admin/ContactMessages"));

const Courses = lazy(() => import("./pages/Courses/Courses"));
const ComingSoon = lazy(() => import("./components/ComingSoon"));

const About = lazy(() => import("./pages/Static/About"));
const Contact = lazy(() => import("./pages/Static/Contact"));
const NotFound = lazy(() => import("./pages/Static/NotFound"));

const Leaderboard = lazy(() => import("./pages/Leaderboard/Leaderboard"));

export default function App() {
  const { isLoading } = useAuthUser();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isOnboarded = useSelector((state) => state.auth.user?.isOnboarded);

  const requireAuth = (component) =>
    isAuthenticated && isOnboarded ? (
      component
    ) : (
      <Navigate to={isAuthenticated ? "/onboarding" : "/login"} />
    );

  const requirePublic = (component) =>
    !isAuthenticated ? component : <Navigate to="/" />;

  const requireOnboarding = (component) =>
    isAuthenticated && !isOnboarded ? component : <Navigate to="/" />;

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <Router>
      <Toaster
        position="top-center"
        reverseOrder={false}
        limit={3} // 👈 maximum number of visible toasts
        toastOptions={{
          style: {
            background: "#1e2330",
            color: "#e2e8f0",
            border: "1px solid #2a2f3d",
            fontSize: "14px",
            padding: "12px 16px",
            minWidth: "240px",
            fontWeight: 500,
            letterSpacing: "0.2px",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#1e2330",
            },
            style: {
              borderLeft: "4px solid #10b981",
              background: "#15232d",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#1e2330",
            },
            style: {
              borderLeft: "4px solid #ef4444",
              background: "#2c1e1e",
            },
          },
          loading: {
            iconTheme: {
              primary: "#60a5fa",
              secondary: "#1e2330",
            },
            style: {
              borderLeft: "4px solid #60a5fa",
              background: "#1a2532",
              fontStyle: "italic",
            },
          },
        }}
      />

      <ScrollToTop />
      <Nav />
      <main className="min-h-[calc(100vh-120px)]">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={requirePublic(<Login />)} />
            <Route path="/signup" element={requirePublic(<Signup />)} />

            {/* Onboarding */}
            <Route
              path="/onboarding"
              element={requireOnboarding(<Onboarding />)}
            />

            {/* Authenticated */}
            <Route path="/" element={requireAuth(<Home />)} />
            <Route path="/profile" element={requireAuth(<ProfilePage />)} />

            <Route path="/problems" element={<Problems />} />
            <Route path="/problems/:id" element={<ProblemPage />} />

            <Route
              path="/submissions"
              element={requireAuth(<AllSubmissionsPage />)}
            />
            <Route
              path="/submissions/problem/:id"
              element={requireAuth(<SubmissionPage />)}
            />

            <Route path="/courses" element={requireAuth(<Courses />)} />
            <Route path="/courses/:id" element={requireAuth(<ComingSoon />)} />

            <Route path="/leaderboard" element={requireAuth(<Leaderboard />)} />
            <Route path="/about" element={requireAuth(<About />)} />
            <Route path="/contact" element={requireAuth(<Contact />)} />

            {/* Admin */}
            <Route path="/admin" element={requireAuth(<AdminDashboard />)} />
            <Route
              path="/admin/add-problem"
              element={requireAuth(<CreateProblem />)}
            />
            <Route
              path="/admin/edit-problem/:id"
              element={requireAuth(<UpdateProblem />)}
            />
            <Route path="/admin/users" element={requireAuth(<Users />)} />
            <Route
              path="/admin/contact-messages"
              element={requireAuth(<ContactMessages />)}
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </Router>
  );
}
