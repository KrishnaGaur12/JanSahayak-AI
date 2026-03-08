import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import VoiceHome from './pages/VoiceHome';
import SchemeResult from './pages/SchemeResult';
import ComplaintConfirmation from './pages/ComplaintConfirmation';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [schemeData, setSchemeData] = useState(null);
  const [complaintData, setComplaintData] = useState(null);

  const handleSchemeResult = useCallback((data) => {
    setSchemeData(data);
    setCurrentPage('scheme');
  }, []);

  const handleComplaintResult = useCallback((data) => {
    setComplaintData(data);
    setCurrentPage('complaint');
  }, []);

  const goHome = useCallback(() => {
    setCurrentPage('home');
    setSchemeData(null);
    setComplaintData(null);
  }, []);

  return (
    <>
      <Header onLogoClick={goHome} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {currentPage === 'home' && (
          <VoiceHome
            onSchemeResult={handleSchemeResult}
            onComplaintResult={handleComplaintResult}
          />
        )}
        {currentPage === 'scheme' && (
          <SchemeResult data={schemeData} onBack={goHome} />
        )}
        {currentPage === 'complaint' && (
          <ComplaintConfirmation data={complaintData} onBack={goHome} />
        )}
      </main>
    </>
  );
}
