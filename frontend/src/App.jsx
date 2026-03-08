import React, { useState, useCallback } from 'react';
import LandingPage from './pages/LandingPage';
import Header from './components/Header';
import HelpModal from './components/HelpModal';
import VoiceHome from './pages/VoiceHome';
import SchemeResult from './pages/SchemeResult';
import ComplaintConfirmation from './pages/ComplaintConfirmation';
import ComplaintStatus from './pages/ComplaintStatus';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [language, setLanguage] = useState('hi');
  const [showHelp, setShowHelp] = useState(false);
  const [schemeData, setSchemeData] = useState(null);
  const [complaintData, setComplaintData] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);

  const handleSchemeResult = useCallback((data) => {
    setChatHistory(prev => [
      ...prev,
      { role: 'user', text: data.originalText },
      { role: 'system', text: data.response || `${data.scheme?.name?.hi || 'योजना'} मिली!` }
    ]);
    setSchemeData(data);
    setCurrentPage('scheme');
  }, []);

  const handleComplaintResult = useCallback((data) => {
    setChatHistory(prev => [
      ...prev,
      { role: 'user', text: data.originalText },
      { role: 'system', text: `शिकायत दर्ज — ${data.trackingId}` }
    ]);
    setComplaintData(data);
    setCurrentPage('complaint');
  }, []);

  const handleStatusLookup = useCallback((data) => {
    setStatusData(data);
    setCurrentPage('status');
  }, []);

  const goHome = useCallback(() => {
    setCurrentPage('home');
    setSchemeData(null);
    setComplaintData(null);
    setStatusData(null);
  }, []);

  const goToLanding = useCallback(() => {
    setCurrentPage('landing');
    setSchemeData(null);
    setComplaintData(null);
    setStatusData(null);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'hi' ? 'en' : 'hi');
  }, []);

  const setLang = useCallback((lang) => {
    setLanguage(lang);
  }, []);

  // Landing page — full-screen, no header
  if (currentPage === 'landing') {
    return <LandingPage onGetStarted={() => setCurrentPage('home')} />;
  }

  // Voice app pages — with header
  return (
    <>
      <Header
        language={language}
        onLogoClick={goToLanding}
        onLanguageToggle={toggleLanguage}
        onHelpClick={() => setShowHelp(true)}
      />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {currentPage === 'home' && (
          <VoiceHome
            language={language}
            onSetLanguage={setLang}
            chatHistory={chatHistory}
            onSchemeResult={handleSchemeResult}
            onComplaintResult={handleComplaintResult}
            onStatusLookup={handleStatusLookup}
            onAddMessage={(msg) => setChatHistory(prev => [...prev, msg])}
            onGoToLanding={goToLanding}
          />
        )}
        {currentPage === 'scheme' && (
          <SchemeResult data={schemeData} language={language} onBack={goHome} />
        )}
        {currentPage === 'complaint' && (
          <ComplaintConfirmation data={complaintData} language={language} onBack={goHome} />
        )}
        {currentPage === 'status' && (
          <ComplaintStatus data={statusData} language={language} onBack={goHome} />
        )}
      </main>

      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        language={language}
      />
    </>
  );
}
