import React, { useState, useEffect } from 'react';

const LandingHeader = ({ onShowHelp, onFileUpload, onLoadProject, totalGuests }) => {
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const triggerFileInput = () => {
    // Create a temporary CSV file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv';
    fileInput.style.display = 'none';
    fileInput.addEventListener('change', onFileUpload);
    document.body.appendChild(fileInput);
    fileInput.click();
    // Clean up after use
    setTimeout(() => document.body.removeChild(fileInput), 100);
  };

  const triggerLoadProject = () => {
    // Create a temporary project file input
    const loadInput = document.createElement('input');
    loadInput.type = 'file';
    loadInput.accept = '.json';
    loadInput.style.display = 'none';
    loadInput.addEventListener('change', onLoadProject);
    document.body.appendChild(loadInput);
    loadInput.click();
    // Clean up after use
    setTimeout(() => document.body.removeChild(loadInput), 100);
  };

  const downloadSampleCSV = () => {
    const csvContent = `Name,Group
John Smith,Bridal Party
Jane Doe,Bridal Party
Mike Johnson,Family
Sarah Wilson,College Friends
Emily Brown,Family
David Lee,Work
Lisa Garcia,Friends
Tom Anderson,College Friends
Amy Taylor,Bridal Party
Chris Martin,Work
Jessica White,Friends
Ryan Clark,Family
Maria Rodriguez,Neighbors
Kevin Thompson,Work
Rachel Green,College Friends`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'seatsaver_sample_guests.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Only show when no guests are loaded
  if (totalGuests > 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(248, 249, 250, 0.98)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
      backdropFilter: 'blur(2px)',
      padding: isMobile ? '0.5rem' : '1rem',
      overflowY: 'auto'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: isMobile ? '95vw' : '600px',
        width: '100%',
        maxHeight: isMobile ? '95vh' : '80vh',
        overflowY: 'auto',
        padding: isMobile ? '1rem' : '2rem',
        backgroundColor: 'white',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e9ecef'
      }}>
        {/* Logo/Title Section */}
        <div style={{ marginBottom: isMobile ? '1.5rem' : '2rem' }}>
          <div style={{
            fontSize: isMobile ? '2.5rem' : '3rem',
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 'bold'
          }}>
            💺
          </div>
          <h1 style={{
            fontSize: isMobile ? '1.8rem' : '2.5rem',
            fontWeight: 'bold',
            margin: '0 0 0.5rem 0',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            SeatSaver
          </h1>
          <p style={{
            fontSize: isMobile ? '1rem' : '1.25rem',
            color: '#6c757d',
            margin: 0,
            fontStyle: 'italic'
          }}>
            Stress-free wedding seating charts
          </p>
        </div>

        {/* Value Proposition */}
        <div style={{ marginBottom: isMobile ? '1.5rem' : '2rem' }}>
          <p style={{
            fontSize: isMobile ? '1rem' : '1.1rem',
            color: '#495057',
            lineHeight: '1.6',
            marginBottom: '1.5rem'
          }}>
            Plan your perfect wedding seating arrangement with our easy-to-use visual tool. 
            <strong> No accounts, no fees, no stress!</strong>
          </p>

          {/* Feature highlights */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: isMobile ? '0.75rem' : '1rem',
            marginBottom: isMobile ? '1.5rem' : '2rem'
          }}>
            <div style={{
              padding: isMobile ? '0.75rem' : '1rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '12px',
              border: '1px solid #e9ecef'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🖱️</div>
              <div style={{ 
                fontWeight: '600', 
                fontSize: isMobile ? '0.85rem' : '0.9rem', 
                color: '#495057' 
              }}>
                Drag & Drop Simple
              </div>
            </div>
            <div style={{
              padding: isMobile ? '0.75rem' : '1rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '12px',
              border: '1px solid #e9ecef'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎨</div>
              <div style={{ 
                fontWeight: '600', 
                fontSize: isMobile ? '0.85rem' : '0.9rem', 
                color: '#495057' 
              }}>
                Fully Customizable
              </div>
            </div>
            <div style={{
              padding: isMobile ? '0.75rem' : '1rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '12px',
              border: '1px solid #e9ecef'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔒</div>
              <div style={{ 
                fontWeight: '600', 
                fontSize: isMobile ? '0.85rem' : '0.9rem', 
                color: '#495057' 
              }}>
                100% Private
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started Section */}
        <div style={{ marginBottom: isMobile ? '1.5rem' : '2rem' }}>
          <h3 style={{
            fontSize: isMobile ? '1.1rem' : '1.25rem',
            fontWeight: '600',
            color: '#495057',
            marginBottom: '1rem'
          }}>
            Choose how to get started:
          </h3>
          
          {/* Primary Options */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: isMobile ? '0.75rem' : '1rem',
            marginBottom: '1.5rem'
          }}>
            {/* Start Fresh */}
            <div style={{
              padding: isMobile ? '1.25rem' : '1.5rem',
              border: '2px solid #667eea',
              borderRadius: '16px',
              backgroundColor: '#f8f9ff',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onClick={triggerFileInput}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#667eea';
              e.currentTarget.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#f8f9ff';
              e.currentTarget.style.color = 'inherit';
            }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🆕</div>
              <h4 style={{ 
                fontSize: isMobile ? '1rem' : '1.1rem', 
                fontWeight: '600', 
                margin: '0 0 0.5rem 0' 
              }}>
                Start Fresh
              </h4>
              <p style={{ 
                fontSize: isMobile ? '0.85rem' : '0.9rem', 
                margin: 0, 
                opacity: 0.8 
              }}>
                Upload your guest list CSV and create a new seating chart from scratch
              </p>
            </div>

            {/* Resume Project */}
            <div style={{
              padding: isMobile ? '1.25rem' : '1.5rem',
              border: '2px solid #28a745',
              borderRadius: '16px',
              backgroundColor: '#f8fff9',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onClick={triggerLoadProject}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#28a745';
              e.currentTarget.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fff9';
              e.currentTarget.style.color = 'inherit';
            }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📂</div>
              <h4 style={{ 
                fontSize: isMobile ? '1rem' : '1.1rem', 
                fontWeight: '600', 
                margin: '0 0 0.5rem 0' 
              }}>
                Resume Project
              </h4>
              <p style={{ 
                fontSize: isMobile ? '0.85rem' : '0.9rem', 
                margin: 0, 
                opacity: 0.8 
              }}>
                Load a saved SeatSaver project file to continue where you left off
              </p>
            </div>
          </div>
        </div>

        {/* Secondary Actions */}
        <div style={{ marginBottom: isMobile ? '1.5rem' : '2rem' }}>
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '0.75rem' : '1rem',
            justifyContent: 'center'
          }}>
            <button
              onClick={downloadSampleCSV}
              style={{
                backgroundColor: 'white',
                color: '#667eea',
                border: '2px solid #667eea',
                padding: isMobile ? '0.75rem 1rem' : '0.75rem 1.5rem',
                fontSize: isMobile ? '0.9rem' : '0.95rem',
                fontWeight: '500',
                borderRadius: '25px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                width: isMobile ? '100%' : 'auto'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#667eea';
                e.target.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.color = '#667eea';
              }}
            >
              📥 Download Sample CSV
            </button>

            <button
              onClick={onShowHelp}
              style={{
                backgroundColor: 'white',
                color: '#6c757d',
                border: '2px solid #e9ecef',
                padding: isMobile ? '0.75rem 1rem' : '0.75rem 1.5rem',
                fontSize: isMobile ? '0.9rem' : '0.95rem',
                fontWeight: '500',
                borderRadius: '25px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                width: isMobile ? '100%' : 'auto'
              }}
              onMouseOver={(e) => {
                e.target.style.borderColor = '#6c757d';
                e.target.style.color = '#495057';
              }}
              onMouseOut={(e) => {
                e.target.style.borderColor = '#e9ecef';
                e.target.style.color = '#6c757d';
              }}
            >
              ❓ How It Works
            </button>
          </div>
        </div>

        {/* Trust indicators */}
        <div style={{
          marginTop: isMobile ? '1.5rem' : '2rem',
          padding: isMobile ? '1rem' : '1.5rem',
          backgroundColor: '#e7f3ff',
          borderRadius: '12px',
          border: '1px solid #b3d7ff'
        }}>
          <div style={{
            fontSize: isMobile ? '0.85rem' : '0.9rem',
            color: '#0d47a1',
            fontWeight: '500',
            marginBottom: '0.5rem'
          }}>
            🔒 Your Privacy Matters
          </div>
          <div style={{
            fontSize: isMobile ? '0.8rem' : '0.85rem',
            color: '#1565c0',
            lineHeight: '1.4'
          }}>
            All your guest data stays private in your browser. Nothing is uploaded to servers. 
            You can use SeatSaver completely offline after the page loads!
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingHeader;