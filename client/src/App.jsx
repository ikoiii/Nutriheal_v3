import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';         
import AnalysisPage from './pages/AnalysisPage';     
import ProtectedRoute from './components/ProtectedRoute'; 

function App() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        <Routes>
          {/* Rute Publik */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Rute Terlindungi */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;