import React from 'react';

const LandingHeader = ({ onShowHelp, onFileUpload, onLoadProject, totalGuests }) => {
  const triggerFileInput = () => {
    // Trigger the hidden CSV file input
    const fileInput = document.querySelector('input[type="file"][accept=".csv"]');
    if (fileInput) {
      fileInput.click();
    }
  };

  const triggerLoadProject = () => {
    // Trigger the hidden project file input
    const loadInput = document.querySelector('input[type="file"][accept=".json"]');
    if (loadInput) {
      loadInput.click();
    }
  };

  const downloadSampleCSV = () => {
    const csvContent = `Name
John Smith
Jane Doe
Mike Johnson
Sarah Wilson
Emily Brown
David Lee
Lisa Garcia
Tom Anderson
Amy Taylor
Chris Martin
Jessica White
Ryan Clark
Maria Rodriguez
Kevin Thompson
Rachel Green`;

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
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(248, 249, 250, 0.95)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
      backdropFilter: 'blur(2px)'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '600px',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e9ecef'
      }}>
        {/* Logo/Title Section */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            fontSize: '3rem',
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
            fontSize: '2.5rem',
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
            fontSize: '1.25rem',
            color: '#6c757d',
            margin: 0,
            fontStyle: 'italic'
          }}>
            Stress-free wedding seating charts
          </p>
        </div>

        {/* Value Proposition */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{
            fontSize: '1.1rem',
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              padding: '1rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '12px',
              border: '1px solid #e9ecef'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🖱️</div>
              <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#495057' }}>
                Drag & Drop Simple
              </div>
            </div>
            <div style={{
              padding: '1rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '12px',
              border: '1px solid #e9ecef'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎨</div>
              <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#495057' }}>
                Fully Customizable
              </div>
            </div>
            <div style={{
              padding: '1rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '12px',
              border: '1px solid #e9ecef'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔒</div>
              <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#495057' }}>
                100% Private
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#495057',
            marginBottom: '1rem'
          }}>
            Choose how to get started:
          </h3>
          
          {/* Primary Options */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            {/* Start Fresh */}
            <div style={{
              padding: '1.5rem',
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
              <h4 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                Start Fresh
              </h4>
              <p style={{ fontSize: '0.9rem', margin: 0, opacity: 0.8 }}>
                Upload your guest list CSV and create a new seating chart from scratch
              </p>
            </div>

            {/* Resume Project */}
            <div style={{
              padding: '1.5rem',
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
              <h4 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                Resume Project
              </h4>
              <p style={{ fontSize: '0.9rem', margin: 0, opacity: 0.8 }}>
                Load a saved SeatSaver project file to continue where you left off
              </p>
            </div>
          </div>
        </div>

        {/* Secondary Actions */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <button
              onClick={downloadSampleCSV}
              style={{
                backgroundColor: 'white',
                color: '#667eea',
                border: '2px solid #667eea',
                padding: '0.75rem 1.5rem',
                fontSize: '0.95rem',
                fontWeight: '500',
                borderRadius: '25px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
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
                padding: '0.75rem 1.5rem',
                fontSize: '0.95rem',
                fontWeight: '500',
                borderRadius: '25px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
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
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: '#e7f3ff',
          borderRadius: '12px',
          border: '1px solid #b3d7ff'
        }}>
          <div style={{
            fontSize: '0.9rem',
            color: '#0d47a1',
            fontWeight: '500',
            marginBottom: '0.5rem'
          }}>
            🔒 Your Privacy Matters
          </div>
          <div style={{
            fontSize: '0.85rem',
            color: '#1565c0',
            lineHeight: '1.4'
          }}>
            All your guest data stays private in your browser. Nothing is uploaded to servers. 
            You can use SeatSaver completely offline after the page loads!
          </div>
        </div>

        {/* Mobile responsive adjustments */}
        <style jsx>{`
          @media (max-width: 768px) {
            h1 {
              font-size: 2rem !important;
            }
            
            .primary-options {
              grid-template-columns: 1fr !important;
              gap: 0.75rem !important;
            }
            
            .secondary-buttons {
              flex-direction: column !important;
            }
            
            button {
              width: 100% !important;
              max-width: 280px;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default LandingHeader;