import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import ResumeBuilder from './pages/ResumeBuilder';

import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminSettings from './pages/AdminSettings';
import CandidateDetails  from './pages/CandidateDetails';

import ProtectedRoute from './components/ProtectedRoute';

import './styles/globals.css';

function AppContent() {

  const location =
    useLocation();

  const isAdminPage =
    location.pathname.startsWith(
      '/company'
    );

  return (
    <>

      {!isAdminPage &&
        <Navbar />
      }

      <Routes>

        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/about"
          element={<AboutPage />}
        />

        <Route
          path="/services"
          element={<ServicesPage />}
        />

        <Route
          path="/contact"
          element={<ContactPage />}
        />

        <Route
          path="/resume-builder"
          element={<ResumeBuilder />}
        />

        {/* LOGIN */}

        <Route
          path="/company-portal"
          element={<AdminLogin />}
        />

        {/* DASHBOARD */}

        <Route
          path="/company-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* CANDIDATE DETAILS */}
        <Route
          path='/candidate/:id'
          element={
            <ProtectedRoute>
              <CandidateDetails />
            </ProtectedRoute>
          }
          />

        {/* SETTINGS */}

        <Route
          path="/company-settings"
          element={
            <ProtectedRoute>
              <AdminSettings />
            </ProtectedRoute>
          }
        />

      </Routes>

      {!isAdminPage &&
        <Footer />
      }

      {!isAdminPage &&
        <WhatsAppButton />
      }

    </>
  );
}

export default function App() {

  return (
    <BrowserRouter>

      <AppContent />

    </BrowserRouter>
  );
}