import React, { useState, useRef } from 'react';
import { WEDDING_TEMPLATES } from '../data/weddingTemplates'; // Import templates

const LandingHeader = ({ onShowHelp, onFileUpload, onLoadProject, onLoadTemplate, totalGuests }) => {
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  // Create refs for file inputs
  const csvFileInputRef = useRef(null);
  const projectFileInputRef = useRef(null);

  const triggerFileInput = () => {
    if (csvFileInputRef.current) {
      csvFileInputRef.current.click();
    }
  };

  const triggerLoadProject = () => {
    if (projectFileInputRef.current) {
      projectFileInputRef.current.click();
    }
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

  const handleTemplateSelect = (templateKey) => {
    const template = WEDDING_TEMPLATES[templateKey];
    if (template && onLoadTemplate) {
      onLoadTemplate(template.data);
    }
    setShowTemplates(false);
    setSelectedTemplate(null);
  };

  const handleTemplatePreview = (templateKey) => {
    setSelectedTemplate(templateKey);
  };

  // Only show when no guests are loaded
  if (totalGuests > 0) return null;

  return (
    <div style={{
      position: 'fixed', // Changed from absolute to fixed
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(248, 249, 250, 0.95)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000, // Increased z-index to ensure it's above canvas header
      backdropFilter: 'blur(2px)'
    }}>
      {/* Hidden file inputs */}
      <input
        type="file"
        accept=".csv"
        onChange={onFileUpload}
        ref={csvFileInputRef}
        style={{ display: 'none' }}
      />
      <input
        type="file"
        accept=".json"
        onChange={onLoadProject}
        ref={projectFileInputRef}
        style={{ display: 'none' }}
      />

      <div style={{
        textAlign: 'center',
        maxWidth: showTemplates ? '900px' : '600px',
        width: '90%',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e9ecef',
        maxHeight: '85vh', // Consistent height
        overflowY: 'auto' // Always show scrollbar when needed
      }}>
        {!showTemplates ? (
          <>
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
                    Beautiful Templates
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
                {/* Use Template - NEW! */}
                <div style={{
                  padding: '1.5rem',
                  border: '2px solid #28a745',
                  borderRadius: '16px',
                  backgroundColor: '#f8fff9',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
                onClick={() => setShowTemplates(true)}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#28a745';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fff9';
                  e.currentTarget.style.color = 'inherit';
                }}
                >
                  <div style={{ 
                    position: 'absolute', 
                    top: '8px', 
                    right: '8px', 
                    backgroundColor: '#dc3545', 
                    color: 'white', 
                    padding: '2px 6px', 
                    borderRadius: '8px', 
                    fontSize: '0.7rem', 
                    fontWeight: 'bold' 
                  }}>
                    NEW!
                  </div>
                  <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🎨</div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                    Use Template
                  </h4>
                  <p style={{ fontSize: '0.9rem', margin: 0, opacity: 0.8 }}>
                    Start with a professionally designed layout that matches your wedding style
                  </p>
                </div>

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
                  border: '2px solid #fd7e14',
                  borderRadius: '16px',
                  backgroundColor: '#fff8f0',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={triggerLoadProject}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#fd7e14';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#fff8f0';
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
            <div style={{ marginBottom: '1.5rem' }}> {/* Reduced margin */}
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
              padding: '1.25rem', // Slightly reduced padding
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
          </>
        ) : (
          <>
            {/* Template Selection Screen */}
            <div style={{ marginBottom: '2rem' }}>
              <button
                onClick={() => setShowTemplates(false)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: '20px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#6c757d'
                }}
              >
                ← Back
              </button>
              
              <h2 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                margin: '0 0 0.5rem 0',
                color: '#495057'
              }}>
                Choose Your Template
              </h2>
              <p style={{
                fontSize: '1rem',
                color: '#6c757d',
                margin: 0
              }}>
                Select a professionally designed layout that matches your wedding style and guest count
              </p>
            </div>

            {/* Template Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              {Object.entries(WEDDING_TEMPLATES).map(([key, template]) => (
                <div
                  key={key}
                  style={{
                    border: selectedTemplate === key ? '3px solid #28a745' : '2px solid #e9ecef',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    backgroundColor: selectedTemplate === key ? '#f8fff9' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={() => handleTemplatePreview(key)}
                  onMouseLeave={() => setSelectedTemplate(null)}
                  onClick={() => handleTemplateSelect(key)}
                >
                  {/* Template Preview Icon */}
                  <div style={{
                    fontSize: '3rem',
                    marginBottom: '1rem',
                    textAlign: 'center'
                  }}>
                    {template.preview}
                  </div>
                  
                  {/* Template Info */}
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    margin: '0 0 0.5rem 0',
                    color: '#495057'
                  }}>
                    {template.name}
                  </h3>
                  
                  <p style={{
                    fontSize: '0.9rem',
                    color: '#6c757d',
                    margin: '0 0 1rem 0',
                    lineHeight: '1.4'
                  }}>
                    {template.description}
                  </p>
                  
                  {/* Template Stats */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    fontSize: '0.85rem'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between' 
                    }}>
                      <span style={{ fontWeight: '600', color: '#495057' }}>Guest Count:</span>
                      <span style={{ color: '#28a745', fontWeight: '600' }}>{template.guestCount}</span>
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between' 
                    }}>
                      <span style={{ fontWeight: '600', color: '#495057' }}>Tables:</span>
                      <span style={{ color: '#0d6efd', fontWeight: '600' }}>
                        {Object.keys(template.data.layout.tablePositions).length}
                      </span>
                    </div>
                    
                    <div style={{
                      marginTop: '0.5rem',
                      padding: '0.75rem',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      color: '#6c757d',
                      fontStyle: 'italic'
                    }}>
                      {template.style}
                    </div>
                  </div>
                  
                  {/* Selection Indicator */}
                  {selectedTemplate === key && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      borderRadius: '50%',
                      width: '30px',
                      height: '30px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem',
                      fontWeight: 'bold'
                    }}>
                      ✓
                    </div>
                  )}
                  
                  {/* Hover Effect */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '1rem',
                      left: '1rem',
                      right: '1rem',
                      backgroundColor: selectedTemplate === key ? '#28a745' : '#667eea',
                      color: 'white',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      textAlign: 'center',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      opacity: selectedTemplate === key ? 1 : 0,
                      transform: selectedTemplate === key ? 'translateY(0)' : 'translateY(10px)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {selectedTemplate === key ? 'Click to Use This Template' : 'Hover to Preview'}
                  </div>
                </div>
              ))}
            </div>

            {/* Template Selection Footer */}
            <div style={{
              padding: '1.5rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '12px',
              border: '1px solid #dee2e6'
            }}>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#495057',
                margin: '0 0 0.75rem 0'
              }}>
                💡 What happens next?
              </h4>
              
              <div style={{
                fontSize: '0.9rem',
                color: '#6c757d',
                lineHeight: '1.5'
              }}>
                <p style={{ margin: '0 0 0.5rem 0' }}>
                  • <strong>Template loads instantly</strong> with pre-arranged tables and labels
                </p>
                <p style={{ margin: '0 0 0.5rem 0' }}>
                  • <strong>Upload your guest list</strong> and start assigning seats
                </p>
                <p style={{ margin: '0' }}>
                  • <strong>Customize everything</strong> - move tables, change colors, adjust sizes
                </p>
              </div>
            </div>
          </>
        )}

        {/* Custom scrollbar styles */}
        <style jsx>{`
          @media (max-width: 768px) {
            h1 {
              font-size: 2rem !important;
            }
            
            .primary-options {
              grid-template-columns: 1fr !important;
              gap: 0.75rem !important;
            }
            
            .template-grid {
              grid-template-columns: 1fr !important;
              gap: 1rem !important;
            }
            
            .secondary-buttons {
              flex-direction: column !important;
            }
            
            button {
              width: 100% !important;
              max-width: 280px;
            }
          }
          
          /* Custom scrollbar styling for all screen sizes */
          div::-webkit-scrollbar {
            width: 8px;
          }
          
          div::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.1);
            border-radius: 4px;
          }
          
          div::-webkit-scrollbar-thumb {
            background: rgba(102, 126, 234, 0.4);
            border-radius: 4px;
          }
          
          div::-webkit-scrollbar-thumb:hover {
            background: rgba(102, 126, 234, 0.6);
          }
          
          /* Firefox scrollbar styling */
          div {
            scrollbar-width: thin;
            scrollbar-color: rgba(102, 126, 234, 0.4) rgba(0,0,0,0.1);
          }
        `}</style>
      </div>
    </div>
  );
};

export default LandingHeader;