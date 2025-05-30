import React, { useRef, useState } from 'react';
import GuestListItem from './GuestListItem';
import { WEDDING_TEMPLATES } from '../data/weddingTemplates';

const Sidebar = ({
  filteredGuests,
  allGuests,
  searchTerm,
  setSearchTerm,
  selectedGroup,
  setSelectedGroup,
  availableGroups,
  visibleCount,
  unassignedCount,
  assignedGuests,
  totalGuests,
  onFileUpload,
  onSaveState,
  onLoadState,
  onLoadTemplate,
  onExport,
  onDragStart,
  onShowHelp,
  onAssignGroup
}) => {
  const fileInputRef = useRef(null);
  const loadStateRef = useRef(null);
  const searchInputRef = useRef(null); // Add ref for search input
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  // Collapsible section states - persisted in localStorage
  const [collapsedSections, setCollapsedSections] = useState(() => {
    // Try to load from localStorage, with defaults
    try {
      const saved = localStorage.getItem('seatSaver-sidebarCollapsed');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.log('Could not load sidebar state:', error);
    }
    
    // Default values if no saved state
    return {
      upload: true,        // Collapsed by default
      guestList: false,    // Open by default
      groupManagement: true, // Collapsed by default
      export: true         // Collapsed by default
    };
  });

  // Stable function to toggle sections and persist to localStorage
  const toggleSection = React.useCallback((section) => {
    setCollapsedSections(prev => {
      const newState = {
        ...prev,
        [section]: !prev[section]
      };
      
      // Save to localStorage
      try {
        localStorage.setItem('seatSaver-sidebarCollapsed', JSON.stringify(newState));
      } catch (error) {
        console.log('Could not save sidebar state:', error);
      }
      
      return newState;
    });
  }, []);

  // Prevent state loss by ensuring localStorage sync
  React.useEffect(() => {
    try {
      localStorage.setItem('seatSaver-sidebarCollapsed', JSON.stringify(collapsedSections));
    } catch (error) {
      console.log('Could not save sidebar state:', error);
    }
  }, [collapsedSections]);

  // Preserve search input focus during re-renders
  const [searchInputFocused, setSearchInputFocused] = useState(false);
  
  React.useEffect(() => {
    if (searchInputFocused && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchInputFocused, filteredGuests]);

  // Helper function to get group icons
  const getGroupIcon = (group) => {
    if (!group) return '📝';
    
    const groupIcons = {
      'Bridal Party': '🌹',
      'Family': '👨‍👩‍👧‍👦',
      'Friends': '🎓',
      'Work': '💼',
      'College': '🎓',
      'High School': '🏫',
      'Neighbors': '🏠',
      'Plus Ones': '➕',
      'Unassigned': '📝'
    };
    
    if (groupIcons[group]) return groupIcons[group];
    
    const lowerGroup = group.toLowerCase();
    if (lowerGroup.includes('family')) return '👨‍👩‍👧‍👦';
    if (lowerGroup.includes('friend')) return '🎓';
    if (lowerGroup.includes('work') || lowerGroup.includes('colleague')) return '💼';
    if (lowerGroup.includes('bridal') || lowerGroup.includes('wedding')) return '🌹';
    if (lowerGroup.includes('college') || lowerGroup.includes('university')) return '🎓';
    if (lowerGroup.includes('school')) return '🏫';
    
    return '👥';
  };

  // Handle template selection
  const handleTemplateSelect = (templateKey) => {
    const template = WEDDING_TEMPLATES[templateKey];
    if (template && onLoadTemplate) {
      const confirmLoad = window.confirm(
        `Load the "${template.name}" template?\n\n` +
        `This will replace your current layout with ${Object.keys(template.data.layout.tablePositions).length} pre-arranged tables.\n\n` +
        `Your guest list will be preserved, but any current seating assignments will be cleared.`
      );
      
      if (confirmLoad) {
        const templateData = {
          ...template.data,
          guests: allGuests.length > 0 ? allGuests : template.data.guests,
          assignments: []
        };
        
        onLoadTemplate(templateData);
        setShowTemplateModal(false);
        setSelectedTemplate(null);
      }
    }
  };

  const handleTemplatePreview = (templateKey) => {
    setSelectedTemplate(templateKey);
  };

  // Collapsible section component - simplified and stable
  const CollapsibleSection = ({ title, icon, isCollapsed, onToggle, children, color = '#0d6efd' }) => {
    return (
      <div className="mb-3">
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem',
            backgroundColor: color === '#fd7e14' ? '#fff8f0' : color === '#28a745' ? '#f8fff9' : '#e7f3ff',
            borderRadius: '8px',
            border: `1px solid ${color === '#fd7e14' ? '#fd7e14' : color === '#28a745' ? '#28a745' : '#0d6efd'}`,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            marginBottom: isCollapsed ? 0 : '0.75rem'
          }}
          onClick={onToggle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = color;
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = color === '#fd7e14' ? '#fff8f0' : color === '#28a745' ? '#f8fff9' : '#e7f3ff';
            e.currentTarget.style.color = 'inherit';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1rem' }}>{icon}</span>
            <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{title}</span>
          </div>
          <span style={{ 
            fontSize: '0.8rem', 
            transition: 'transform 0.2s ease',
            transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)'
          }}>
            ▼
          </span>
        </div>
        
        {!isCollapsed && (
          <div>
            {children}
          </div>
        )}
      </div>
    );
  };

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
          <div style={{ flex: 1 }}>
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
        </div>
        
        {/* Help Button - Now below app name and description */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            className="btn btn-outline-info"
            onClick={onShowHelp}
            title="Show Getting Started Guide"
            style={{ 
              fontSize: '0.75rem',
              padding: '0.25rem 0.5rem',
              borderRadius: '12px',
              minWidth: '45px',
              height: '28px'
            }}
          >
            ❓ Help
          </button>
        </div>
      </div>
      
      {/* Guest Statistics Display - Above Collapsible Sections */}
      {totalGuests > 0 && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          border: '1px solid #e9ecef',
          marginBottom: '1.5rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: '#495057',
              marginBottom: '0.25rem'
            }}>
              {totalGuests}
            </div>
            <div style={{ 
              fontSize: '0.8rem', 
              color: '#6c757d',
              fontWeight: '500'
            }}>
              Total
            </div>
          </div>
          
          <div style={{ 
            width: '1px', 
            backgroundColor: '#dee2e6',
            margin: '0 0.5rem'
          }} />
          
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: '#28a745',
              marginBottom: '0.25rem'
            }}>
              {assignedGuests}
            </div>
            <div style={{ 
              fontSize: '0.8rem', 
              color: '#6c757d',
              fontWeight: '500'
            }}>
              Seated
            </div>
          </div>
          
          <div style={{ 
            width: '1px', 
            backgroundColor: '#dee2e6',
            margin: '0 0.5rem'
          }} />
          
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: unassignedCount > 0 ? '#dc3545' : '#28a745',
              marginBottom: '0.25rem'
            }}>
              {unassignedCount}
            </div>
            <div style={{ 
              fontSize: '0.8rem', 
              color: '#6c757d',
              fontWeight: '500'
            }}>
              Left
            </div>
          </div>
        </div>
      )}
      
      {/* Upload & Save Section */}
      <CollapsibleSection
        title="Upload & Save"
        icon="📁"
        isCollapsed={collapsedSections.upload}
        onToggle={() => toggleSection('upload')}
        color="#0d6efd"
      >
        {/* Upload Guest List */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ 
            display: 'block',
            fontSize: '0.85rem',
            fontWeight: '600',
            marginBottom: '0.5rem',
            color: '#495057'
          }}>
            📄 Guest List CSV
          </label>
          <input
            type="file"
            className="form-control"
            accept=".csv"
            onChange={onFileUpload}
            ref={fileInputRef}
            style={{
              padding: '0.375rem 0.75rem',
              fontSize: '0.9rem',
              lineHeight: '1.4',
              color: '#495057',
              backgroundColor: '#fff',
              border: '1px solid #ced4da',
              borderRadius: '0.375rem',
              width: '100%'
            }}
          />
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

        {/* Save/Load Project */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ 
            display: 'block',
            fontSize: '0.85rem',
            fontWeight: '600',
            marginBottom: '0.5rem',
            color: '#495057'
          }}>
            💾 Save/Load Project
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
            <button 
              className="btn btn-success btn-sm" 
              onClick={onSaveState}
              style={{ flex: '1', minWidth: '80px', fontSize: '0.8rem' }}
            >
              💾 Save
            </button>
            <button 
              className="btn btn-info btn-sm" 
              onClick={() => loadStateRef.current?.click()}
              style={{ flex: '1', minWidth: '80px', fontSize: '0.8rem' }}
            >
              📤 Load
            </button>
          </div>
          <button 
            className="btn btn-primary btn-sm" 
            onClick={() => setShowTemplateModal(true)}
            style={{ 
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '0.8rem'
            }}
          >
            🎨 Load Template
          </button>
          <input
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            ref={loadStateRef}
            onChange={onLoadState}
          />
          <small className="text-muted">Save complete project with layout</small>
        </div>
      </CollapsibleSection>

      {/* Guest List Section */}
      <CollapsibleSection
        title={`Guest List`}
        icon="👥"
        isCollapsed={collapsedSections.guestList}
        onToggle={() => toggleSection('guestList')}
        color="#0d6efd"
      >
        {/* Guest count badge in header */}
        <div style={{ 
          position: 'absolute', 
          top: '0.75rem', 
          right: '2rem',
          backgroundColor: '#6c757d',
          color: 'white',
          borderRadius: '12px',
          padding: '0.25rem 0.5rem',
          fontSize: '0.7rem',
          fontWeight: 'bold',
          zIndex: 10
        }}>
          {totalGuests}
        </div>
        
        {/* Search Input */}
        <div className="input-group mb-2">
          <input
            ref={searchInputRef}
            type="text"
            className="form-control"
            placeholder="Search guests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setSearchInputFocused(true)}
            onBlur={() => setSearchInputFocused(false)}
            style={{ fontSize: '0.9rem' }}
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

        {/* Group Filter Dropdown */}
        {availableGroups && availableGroups.length > 1 && (
          <div style={{ marginBottom: '0.75rem' }}>
            <select
              className="form-control"
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              style={{
                fontSize: '0.85rem',
                padding: '0.5rem',
                backgroundColor: selectedGroup !== 'All' ? '#e7f3ff' : '#ffffff',
                borderColor: selectedGroup !== 'All' ? '#0d6efd' : '#ced4da'
              }}
            >
              {availableGroups.map(group => (
                <option key={group} value={group}>
                  {group === 'All' ? '👥 All Groups' : `${getGroupIcon(group)} ${group}`}
                </option>
              ))}
            </select>
            {selectedGroup !== 'All' && (
              <small style={{ 
                display: 'block', 
                marginTop: '0.25rem', 
                color: '#0d6efd',
                fontSize: '0.75rem'
              }}>
                Showing {selectedGroup} group • {filteredGuests.length} guests
              </small>
            )}
          </div>
        )}
        
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
                  guest={guest}
                  onDragStart={onDragStart}
                  onAssignGroup={onAssignGroup}
                  availableGroups={availableGroups}
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
              ) : searchTerm || selectedGroup !== 'All' ? (
                <div>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
                  <div>No guests match your filters</div>
                  <small>Try different search terms or group</small>
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
      </CollapsibleSection>

      {/* Group Management Section */}
      <CollapsibleSection
        title="Group Management"
        icon="🏷️"
        isCollapsed={collapsedSections.groupManagement}
        onToggle={() => toggleSection('groupManagement')}
        color="#fd7e14"
      >
        {totalGuests > 0 ? (
          <>
            {/* Instructions */}
            <div style={{ 
              fontSize: '0.75rem', 
              color: '#6c757d', 
              marginBottom: '0.75rem',
              lineHeight: '1.4'
            }}>
              <strong>To assign groups:</strong><br />
              Click any guest's colored group badge to assign them to a group.
            </div>
            
            {/* Show current groups if any exist */}
            {availableGroups && availableGroups.length > 2 && (
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: '600', 
                  marginBottom: '0.5rem',
                  color: '#495057',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span>📊 Your Groups:</span>
                  <span style={{ 
                    fontSize: '0.7rem',
                    background: '#28a745',
                    color: 'white',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '10px',
                    fontWeight: 'normal'
                  }}>
                    {availableGroups.length - 1}
                  </span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '0.25rem'
                }}>
                  {availableGroups
                    .filter(group => group !== 'All')
                    .map(group => {
                      const guestCount = allGuests.filter(g => g.Group === group).length;
                      return (
                        <span
                          key={group}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontSize: '0.7rem',
                            padding: '0.25rem 0.5rem',
                            backgroundColor: group === 'Unassigned' ? '#fff3cd' : '#e7f3ff',
                            color: group === 'Unassigned' ? '#856404' : '#0d6efd',
                            borderRadius: '12px',
                            border: `1px solid ${group === 'Unassigned' ? '#ffeaa7' : '#b3d7ff'}`
                          }}
                          title={`${guestCount} guests in ${group}`}
                        >
                          {getGroupIcon(group)} {group} ({guestCount})
                        </span>
                      );
                    })
                  }
                </div>
              </div>
            )}
            
            {/* Create new group section */}
            <div style={{
              padding: '0.75rem',
              backgroundColor: 'white',
              borderRadius: '6px',
              border: '2px dashed #dee2e6',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '0.8rem',
                fontWeight: '600',
                color: '#495057',
                marginBottom: '0.5rem'
              }}>
                ➕ Need a New Group?
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6c757d',
                marginBottom: '0.75rem',
                lineHeight: '1.4'
              }}>
                Click any guest's group badge and select "New Group" to create custom groups.
              </div>
            </div>
          </>
        ) : (
          <div style={{ 
            padding: '1rem', 
            textAlign: 'center', 
            color: '#6c757d',
            fontSize: '0.85rem'
          }}>
            Upload guests to manage groups
          </div>
        )}
      </CollapsibleSection>

      {/* Export Section */}
      <CollapsibleSection
        title="Export Options"
        icon="📤"
        isCollapsed={collapsedSections.export}
        onToggle={() => toggleSection('export')}
        color="#28a745"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            className="btn btn-primary btn-sm" 
            onClick={onExport}
            disabled={assignedGuests === 0}
            style={{ 
              opacity: assignedGuests === 0 ? 0.6 : 1,
              cursor: assignedGuests === 0 ? 'not-allowed' : 'pointer',
              fontSize: '0.85rem'
            }}
          >
            📄 Export Assignments CSV
          </button>
          {assignedGuests === 0 && (
            <small className="text-muted">Assign guests to tables first</small>
          )}
        </div>
      </CollapsibleSection>

      {/* Quick Tips */}
      <div style={{ 
        backgroundColor: '#e7f3ff',
        padding: '1rem',
        borderRadius: '8px',
        border: '1px solid #0d6efd',
        fontSize: '0.8rem',
        lineHeight: '1.4',
        marginTop: '1rem'
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
          • <strong>Drag guests</strong> from list to table seats<br />
          • <strong>Double-click tables</strong> to customize them<br />
          • <strong>Right-click seats</strong> to add new guests<br />
          • <strong>Save regularly</strong> to preserve your work
        </div>
      </div>

      {/* Template Selection Modal */}
      {showTemplateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            maxWidth: '800px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              paddingBottom: '1rem',
              borderBottom: '2px solid #e9ecef'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#495057' }}>
                🎨 Choose Template
              </h3>
              <button
                onClick={() => {
                  setShowTemplateModal(false);
                  setSelectedTemplate(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#6c757d'
                }}
              >
                ×
              </button>
            </div>

            {/* Template Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              {Object.entries(WEDDING_TEMPLATES).map(([key, template]) => (
                <div
                  key={key}
                  style={{
                    border: selectedTemplate === key ? '3px solid #28a745' : '2px solid #e9ecef',
                    borderRadius: '12px',
                    padding: '1rem',
                    backgroundColor: selectedTemplate === key ? '#f8fff9' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    textAlign: 'center'
                  }}
                  onMouseEnter={() => handleTemplatePreview(key)}
                  onMouseLeave={() => setSelectedTemplate(null)}
                  onClick={() => handleTemplateSelect(key)}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                    {template.preview}
                  </div>
                  <h4 style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    margin: '0 0 0.5rem 0',
                    color: '#495057'
                  }}>
                    {template.name}
                  </h4>
                  <p style={{
                    fontSize: '0.8rem',
                    color: '#6c757d',
                    margin: '0 0 0.5rem 0',
                    lineHeight: '1.3'
                  }}>
                    {template.guestCount}
                  </p>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#0d6efd',
                    fontWeight: '600'
                  }}>
                    {Object.keys(template.data.layout.tablePositions).length} tables
                  </div>
                  
                  {selectedTemplate === key && (
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      ✓
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{
              padding: '1rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              fontSize: '0.85rem',
              color: '#6c757d',
              textAlign: 'center'
            }}>
              💡 Templates will preserve your current guest list but clear seating assignments
            </div>
          </div>
        </div>
      )}

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            max-height: 500px;
            transform: translateY(0);
          }
        }
        
        .CollapsibleSection div[style*="position: absolute"] {
          position: relative !important;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;