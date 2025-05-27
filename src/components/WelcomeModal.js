import React, { useState } from 'react';

const WelcomeModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Wedding Seating Chart! 🎉",
      content: (
        <div>
          <p>Plan your perfect wedding seating arrangement with our easy-to-use visual tool.</p>
          <h5>What you can do:</h5>
          <ul>
            <li>📝 Import your guest list from CSV</li>
            <li>🎨 Customize tables (shapes, colors, sizes)</li>
            <li>🖱️ Drag & drop guests to assign seats</li>
            <li>➕ Add last-minute guests on the fly</li>
            <li>💾 Save and export your seating chart</li>
            <li>📸 Export as image for printing</li>
          </ul>
          <p><strong>Best part:</strong> All data stays private in your browser - nothing is uploaded to servers!</p>
        </div>
      )
    },
    {
      title: "Step 1: Prepare Your Guest List 📋",
      content: (
        <div>
          <p>Create a CSV file with your guest names and optional groups. Here's the format:</p>
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '1rem', 
            borderRadius: '8px', 
            fontFamily: 'monospace',
            margin: '1rem 0'
          }}>
            Name,Group<br/>
            John Smith,Bridal Party<br/>
            Jane Doe,Family<br/>
            Mike Johnson,Friends<br/>
            Sarah Wilson,Work
          </div>
          <p><strong>Tips:</strong></p>
          <ul>
            <li>First row should be "Name,Group" (headers)</li>
            <li>Group column is <strong>optional</strong> - you can just use "Name"</li>
            <li>One guest per row</li>
            <li>Common groups: Bridal Party, Family, Friends, Work, College</li>
            <li>You can assign groups later in the app too!</li>
            <li>Save as .csv format from Excel or Google Sheets</li>
          </ul>
          <button 
            onClick={() => downloadSampleCSV()}
            className="btn btn-primary btn-sm"
            style={{ marginTop: '0.5rem' }}
          >
            📥 Download Sample CSV
          </button>
        </div>
      )
    },
    {
      title: "Step 2: Upload & Assign Guests 🎯",
      content: (
        <div>
          <h5>Upload your CSV:</h5>
          <p>Click "Upload CSV" in the sidebar and select your guest list file.</p>
          
          <h5>Assign guests to tables:</h5>
          <ul>
            <li><strong>Drag & Drop:</strong> Drag names from sidebar to table seats</li>
            <li><strong>Right-click empty seats:</strong> Create new guests on the spot</li>
            <li><strong>Left-click guests:</strong> Move between tables</li>
            <li><strong>Right-click guests:</strong> Remove from table</li>
          </ul>

          <div style={{ 
            backgroundColor: '#e7f3ff', 
            padding: '1rem', 
            borderRadius: '8px',
            border: '1px solid #0d6efd',
            marginTop: '1rem'
          }}>
            <strong>💡 Pro Tip:</strong> Start by placing your VIPs (wedding party, parents) at the front tables, then work outward!
          </div>
        </div>
      )
    },
    {
      title: "Step 3: Customize Your Layout 🎨",
      content: (
        <div>
          <h5>Add & customize tables:</h5>
          <ul>
            <li><strong>Add Tables:</strong> Click "Add Table" and click anywhere to place</li>
            <li><strong>Move Tables:</strong> Drag tables to rearrange layout</li>
            <li><strong>Customize Tables:</strong> Double-click any table to:
              <ul>
                <li>Change shape (circle, rectangle, square, oval)</li>
                <li>Adjust size and capacity (2-20 guests)</li>
                <li>Pick background colors</li>
                <li>Add custom labels</li>
              </ul>
            </li>
          </ul>

          <h5>Navigation:</h5>
          <ul>
            <li><strong>Zoom:</strong> Mouse wheel or zoom buttons</li>
            <li><strong>Pan:</strong> Drag the canvas background</li>
            <li><strong>Reset View:</strong> Click the target 🎯 button</li>
          </ul>
        </div>
      )
    },
    {
      title: "Step 4: Save & Export 💾",
      content: (
        <div>
          <h5>Save your work:</h5>
          <ul>
            <li><strong>Auto-save:</strong> Layout saves automatically to your browser</li>
            <li><strong>Save State:</strong> Download complete project file (.json)</li>
            <li><strong>Load State:</strong> Resume from saved project file</li>
          </ul>

          <h5>Export options:</h5>
          <ul>
            <li><strong>Export CSV:</strong> Guest assignments for venues</li>
            <li><strong>Export Image:</strong> High-resolution seating chart (PNG)</li>
            <li><strong>Table Summary:</strong> Detailed table breakdown</li>
          </ul>

          <div style={{ 
            backgroundColor: '#d4edda', 
            padding: '1rem', 
            borderRadius: '8px',
            border: '1px solid #28a745',
            marginTop: '1rem'
          }}>
            <strong>✅ You're all set!</strong> Your seating chart data stays private and secure in your browser. Happy planning! 🎊
          </div>
        </div>
      )
    }
  ];

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
    a.download = 'wedding_guests_sample.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #dee2e6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#f8f9fa'
        }}>
          <h4 style={{ margin: 0, color: '#495057' }}>
            {steps[currentStep].title}
          </h4>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#6c757d',
              padding: '0.25rem'
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: '2rem',
          maxHeight: '50vh',
          overflowY: 'auto',
          lineHeight: '1.6'
        }}>
          {steps[currentStep].content}
        </div>

        {/* Footer Navigation */}
        <div style={{
          padding: '1.5rem',
          borderTop: '1px solid #dee2e6',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#f8f9fa'
        }}>
          <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>
            Step {currentStep + 1} of {steps.length}
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="btn btn-outline-secondary"
              style={{ fontSize: '0.9rem' }}
            >
              ← Previous
            </button>
            
            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="btn btn-primary"
                style={{ fontSize: '0.9rem' }}
              >
                Next →
              </button>
            ) : (
              <button
                onClick={onClose}
                className="btn btn-success"
                style={{ fontSize: '0.9rem' }}
              >
                Get Started! 🚀
              </button>
            )}
          </div>
        </div>

        {/* Progress indicator */}
        <div style={{
          height: '4px',
          backgroundColor: '#e9ecef'
        }}>
          <div style={{
            height: '100%',
            backgroundColor: '#0d6efd',
            width: `${((currentStep + 1) / steps.length) * 100}%`,
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;