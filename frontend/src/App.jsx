import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components
import Nav from "./components/Nav.jsx";
import Footer from "./components/Footer.jsx";
import PageLoader from "./components/PageLoader.jsx";


// Lazy Loaded Pages
const Home = lazy(() => import("./pages/Home.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Signup = lazy(() => import("./pages/Signup.jsx"));
const Onboarding = lazy(() => import("./pages/Onboarding.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Courses = lazy(() => import("./pages/Courses.jsx"));
const Problems = lazy(() => import("./pages/Problems.jsx"));
const ProblemPage = lazy(() => import("./pages/ProblemPage.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

const App = () => {
  // Dummy State
  const isAuthenticated = true;
  const isOnboarded = true;

  return (
    <Router>
      <Nav />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated && isOnboarded ? (
                <Home />
              ) : (
                <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
              )
            }
          />
          <Route
            path="/signup"
            element={
              !isAuthenticated ? (
                <Signup />
              ) : (
                <Navigate to={isOnboarded ? "/" : "/onboarding"} />
              )
            }
          />
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <Login />
              ) : (
                <Navigate to={isOnboarded ? "/" : "/onboarding"} />
              )
            }
          />

          {/* ✅ Auth-Protected Routes */}
          <Route
            path="/onboarding"
            element={
              isAuthenticated ? <Onboarding /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/about"
            element={
              isAuthenticated ? <About /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/contact"
            element={
              isAuthenticated ? <Contact /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/problems"
            element={
              isAuthenticated ? <Problems /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/courses"
            element={
              isAuthenticated ? <Courses /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/problems/:id"
            element={
              isAuthenticated ? <ProblemPage /> : <Navigate to="/login" />
            }
          />

          {/* ✅ Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
    </Router>
  );
};

export default App;
