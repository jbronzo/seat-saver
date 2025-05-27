import React, { useRef } from 'react';
import GuestListItem from './GuestListItem';

const Sidebar = ({
  filteredGuests,
  searchTerm,
  setSearchTerm,
  visibleCount,
  unassignedCount,
  assignedGuests,
  totalGuests,
  onFileUpload,
  onSaveState,
  onLoadState,
  onExport,
  onDragStart,
  onShowHelp // New prop for showing help modal
}) => {
  const fileInputRef = useRef(null);
  const loadStateRef = useRef(null);

  return (
    <div className="sidebar">
      {/* Header with Help Button */}
      <div style={{ 
        marginBottom: '1.5rem',
        paddingBottom: '1rem',
        borderBottom: '2px solid #e9ecef'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: '0.5rem'
        }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#495057' }}>
              SeatSaver
            </h4>
            <small style={{ 
              color: '#6c757d', 
              fontSize: '0.85rem',
              fontStyle: 'italic',
              display: 'block',
              marginTop: '0.25rem'
            }}>
              Stress-free wedding seating
            </small>
          </div>
          <button 
            className="btn btn-outline-info"
            onClick={onShowHelp}
            title="Show Getting Started Guide"
            style={{ 
              fontSize: '0.9rem',
              padding: '0.5rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              borderRadius: '20px',
              minWidth: '80px',
              justifyContent: 'center'
            }}
          >
            ❓ Help
          </button>
        </div>
      </div>
      
      {/* Upload Section */}
      <div className="mb-3">
        <h6 style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          marginBottom: '0.75rem'
        }}>
          📁 Upload Guest List
        </h6>
        <div style={{ position: 'relative' }}>
          <input
            type="file"
            className="form-control"
            accept=".csv"
            onChange={onFileUpload}
            ref={fileInputRef}
            style={{
              padding: '0.375rem 0.75rem',
              fontSize: '1rem',
              lineHeight: '1.5',
              color: '#495057',
              backgroundColor: '#fff',
              backgroundImage: 'none',
              border: '1px solid #ced4da',
              borderRadius: '0.375rem',
              width: '100%'
            }}
          />
        </div>
        <small className="text-muted">
          CSV with guest names 
          <span 
            style={{ 
              color: '#0d6efd', 
              cursor: 'pointer', 
              textDecoration: 'underline',
              marginLeft: '0.5rem'
            }}
            onClick={onShowHelp}
          >
            (Need help?)
          </span>
        </small>
      </div>

      {/* Save/Load State */}
      <div className="mb-3">
        <h6 style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          marginBottom: '0.75rem'
        }}>
          💾 Save/Load Project
        </h6>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-success btn-sm" 
            onClick={onSaveState}
            style={{ flex: '1', minWidth: '90px' }}
          >
            💾 Save
          </button>
          <button 
            className="btn btn-info btn-sm" 
            onClick={() => loadStateRef.current?.click()}
            style={{ flex: '1', minWidth: '90px' }}
          >
            📤 Load
          </button>
        </div>
        <input
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          ref={loadStateRef}
          onChange={onLoadState}
        />
        <small className="text-muted">Save complete project with layout</small>
      </div>

      {/* Guest Search */}
      <div className="mb-3">
        <h6 style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          marginBottom: '0.75rem'
        }}>
          👥 Guest List
        </h6>
        <div className="input-group mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search guests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            className="btn btn-outline-secondary"
            onClick={() => setSearchTerm('')}
            type="button"
            style={{ borderColor: '#6c757d' }}
          >
            ✕
          </button>
        </div>
        
        {/* Guest Statistics */}
        <div style={{ 
          backgroundColor: '#f8f9fa',
          padding: '0.75rem',
          borderRadius: '6px',
          marginBottom: '0.75rem',
          fontSize: '0.85rem',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span>📋 Total Guests:</span>
            <strong>{totalGuests}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span>✅ Seated:</span>
            <strong style={{ color: '#28a745' }}>{assignedGuests}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span>⏳ Unassigned:</span>
            <strong style={{ color: unassignedCount > 0 ? '#dc3545' : '#28a745' }}>{unassignedCount}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>👁️ Showing:</span>
            <strong>{visibleCount}</strong>
          </div>
        </div>
        
        {/* Guest List */}
        <div className="guest-list" style={{ 
          maxHeight: '300px', 
          overflowY: 'auto',
          border: '1px solid #dee2e6',
          borderRadius: '6px'
        }}>
          {filteredGuests.length > 0 ? (
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {filteredGuests.map((guest, index) => (
                <GuestListItem
                  key={index}
                  guest={guest.Name}
                  onDragStart={onDragStart}
                />
              ))}
            </ul>
          ) : (
            <div style={{ 
              padding: '2rem', 
              textAlign: 'center', 
              color: '#6c757d',
              fontSize: '0.9rem'
            }}>
              {totalGuests === 0 ? (
                <div>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📁</div>
                  <div>No guests loaded</div>
                  <small>Upload a CSV file to get started</small>
                </div>
              ) : searchTerm ? (
                <div>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
                  <div>No guests match "{searchTerm}"</div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎉</div>
                  <div>All guests are seated!</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Export */}
      <div className="mb-3">
        <h6 style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          marginBottom: '0.75rem'
        }}>
          📤 Export Options
        </h6>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            className="btn btn-primary btn-sm" 
            onClick={onExport}
            disabled={assignedGuests === 0}
            style={{ 
              opacity: assignedGuests === 0 ? 0.6 : 1,
              cursor: assignedGuests === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            📄 Export Assignments CSV
          </button>
          {assignedGuests === 0 && (
            <small className="text-muted">Assign guests to tables first</small>
          )}
        </div>
      </div>

      {/* Quick Tips */}
      <div style={{ 
        backgroundColor: '#e7f3ff',
        padding: '1rem',
        borderRadius: '8px',
        border: '1px solid #0d6efd',
        fontSize: '0.85rem',
        lineHeight: '1.4'
      }}>
        <div style={{ 
          fontWeight: 'bold', 
          marginBottom: '0.5rem',
          color: '#0d6efd',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          💡 Quick Tips
        </div>
        <div style={{ color: '#495057' }}>
          • <strong>Drag guests</strong> from here to table seats<br />
          • <strong>Right-click empty seats</strong> to add new guests<br />
          • <strong>Double-click tables</strong> to customize them<br />
          • <strong>Save regularly</strong> to preserve your work
        </div>
        <div style={{ 
          marginTop: '0.75rem', 
          paddingTop: '0.5rem', 
          borderTop: '1px solid #b3d7ff' 
        }}>
          <button 
            onClick={onShowHelp}
            style={{
              background: 'none',
              border: 'none',
              color: '#0d6efd',
              textDecoration: 'underline',
              cursor: 'pointer',
              padding: 0,
              fontSize: '0.85rem'
            }}
          >
            📚 View full getting started guide →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;