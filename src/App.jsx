import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useStellar } from './hooks/useStellar';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import CreateBounty from './pages/CreateBounty';
import BountyDetails from './pages/BountyDetails';
import Preloader from './components/Preloader';
import './index.css';

// Wrapper to handle navigation logic inside Router context
const AppContent = () => {
  const { address, connectWallet } = useStellar();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const hasLoaded = useRef(false);

  useEffect(() => {
    // If wallet connected and user is visiting root, redirect to dashboard
    // But only if we have NOT just finished the preloader or this is a fresh revisit
    if (address && location.pathname === '/') {
        setLoading(false); 
        navigate('/dashboard');
    }
  }, [address, navigate, location.pathname]);

  const handlePreloaderComplete = () => {
    setLoading(false);
    hasLoaded.current = true;
    
    // Auto-connect wallet logic could go here if we saved a session, 
    // but for security usually we wait for user action or useStellar auto-reconnects.
    if (address) {
        navigate('/dashboard');
    }
  };

  // If already loaded once, logic to skip preloader could be added here, 
  // but user requested "if wallet connected... navigate directly".
  // If not connected, show preloader on first visit.
  // For simplicity, we show preloader on strict refresh unless address is already connected (handled by useStellar auto-check).
  
  // Note: useStellar.js runs its effect on mount. It might take a split second to set 'address'.
  // We can trust the initial 'loading' state.

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && !address && location.pathname === '/' ? (
           <Preloader key="loader" onComplete={handlePreloaderComplete} />
        ) : null}
      </AnimatePresence>
      
      {!loading || address || location.pathname !== '/' ? (
        <div className="bg-background min-h-screen text-text font-sans selection:bg-primary selection:text-black">
          <Navbar />
          <main className="relative z-10 pt-20"> {/* Pad for fixed navbar */}
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create" element={<CreateBounty />} />
              <Route path="/bounty/:id" element={<BountyDetails />} />
            </Routes>
          </main>
          
          {/* Global Background Grid/Noise if needed (now in CSS body) */}
        </div>
      ) : null}
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
