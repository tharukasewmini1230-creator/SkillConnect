import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Matches from './pages/Matches';
import Sessions from './pages/Sessions';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';
import Leaderboard from './pages/Leaderboard';
import Settings from './pages/Settings';
import BookSession from './pages/BookSession';
import Messages from './pages/Messages';
import Achievements from './pages/Achievements';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}><div className="spinner"></div></div>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

// Layout Wrapper - shows/hides Navbar and Footer based on route
const Layout = ({ children }) => {
  const location = useLocation();

  // These pages have their own layout (with Sidebar), so no Navbar/Footer
  const pagesWithSidebar = ['/dashboard', '/sessions', '/profile', '/matches', '/leaderboard', '/settings', '/book', '/messages', '/achievements'];
  const shouldHideNavbar = pagesWithSidebar.some((path) =>
    location.pathname.startsWith(path)
  );

  if (shouldHideNavbar) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/about" element={<About />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
              <Route path="/sessions" element={<ProtectedRoute><Sessions /></ProtectedRoute>} />
              <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/book/:mentorId" element={<ProtectedRoute><BookSession /></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
              <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;