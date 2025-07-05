import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

import ScrollToTop from "./components/ScrollToTop";
import PageLoader from "./components/PageLoader";
import useAuthUser from "./hooks/useAuthUser";

// Lazy Components
const Nav = lazy(() => import("./components/Nav"));
const Footer = lazy(() => import("./components/Footer"));

const Login = lazy(() => import("./pages/Auth/Login"));
const Signup = lazy(() => import("./pages/Auth/Signup"));
const Home = lazy(() => import("./pages/Home"));
// … other lazy imports

export default function App() {
  const { isLoading } = useAuthUser();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isOnboarded = useSelector((state) => state.auth.user?.isOnboarded);

  const requireAuth = (component) =>
    isAuthenticated && isOnboarded
      ? component
      : <Navigate to={isAuthenticated ? "/onboarding" : "/login"} />;

  const requirePublic = (component) =>
    !isAuthenticated ? component : <Navigate to="/" />;

  const requireOnboarding = (component) =>
    isAuthenticated && !isOnboarded ? component : <Navigate to="/" />;

  if (isLoading) {
    return <PageLoader />; // Auth check
  }

  return (
    <Router>
      <Toaster />
      <ScrollToTop />
      {/* 👇 Only render *anything* after lazy components are ready */}
      <Suspense fallback={<PageLoader />}>
        <AppLayout>
          <Routes>
            <Route path="/login" element={requirePublic(<Login />)} />
            <Route path="/signup" element={requirePublic(<Signup />)} />
            <Route path="/" element={requireAuth(<Home />)} />
            {/* … other routes */}
          </Routes>
        </AppLayout>
      </Suspense>
    </Router>
  );
}

// 👇 helper wrapper
const AppLayout = ({ children }) => (
  <>
    <Nav />
    {children}
    <Footer />
  </>
);
