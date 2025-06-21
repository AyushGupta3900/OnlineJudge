import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
// Components
import Nav from "./components/Nav.jsx"
import Footer from "./components/Footer.jsx"
import PageLoader from "./components/PageLoader.jsx"

// Lazy Loading pages 
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Signup = lazy(() => import("./pages/Signup.jsx"));
const NotFound = lazy(() => import("./pages/NotFound"));


const App = () => {
  // Getting Data 
  // const { isLoading, authUser } = useAuthUser();
  // const isAuthenticated = Boolean(authUser);
  // const isOnboarded = authUser?.isOnboarded;

  // Dummy Data
  const isLoading = false;
  const isAuthenticated = false;
  const isOnboarded = false;

  if (isLoading) return <PageLoader />;

  return (
    <Router>
      <Nav />
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
            !isAuthenticated ? <Signup /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />
          }
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? <Login /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />
          }
        />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
};
export default App;