import React, { useRef, useState } from 'react';
import GuestListItem from './GuestListItem';

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
  onExport,
  onDragStart,
  onShowHelp,
  onAssignGroup
}) => {
  const fileInputRef = useRef(null);
  const loadStateRef = useRef(null);
  
  // State for collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    upload: false, // Start collapsed to reduce clutter
    groups: false,
    export: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Helper function to get group icons
  const getGroupIcon = (group) => {
    // Safety check for undefined/null group
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
    
    // Try exact match first
    if (groupIcons[group]) return groupIcons[group];
    
    // Try partial matches
    const lowerGroup = group.toLowerCase();
    if (lowerGroup.includes('family')) return '👨‍👩‍👧‍👦';
    if (lowerGroup.includes('friend')) return '🎓';
    if (lowerGroup.includes('work') || lowerGroup.includes('colleague')) return '💼';
    if (lowerGroup.includes('bridal') || lowerGroup.includes('wedding')) return '🌹';
    if (lowerGroup.includes('college') || lowerGroup.includes('university')) return '🎓';
    if (lowerGroup.includes('school')) return '🏫';
    
    return '👥'; // Default group icon
  };

  return (
    <div className="sidebar" style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Compact Header with Stats */}
      <div style={{ 
        marginBottom: '1.5rem',
        paddingBottom: '1rem',
        borderBottom: '2px solid #dee2e6'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '0.75rem'
        }}>
          <h4 style={{ 
            margin: 0, 
            fontSize: '1.4rem', 
            fontWeight: 'bold', 
            color: '#495057',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            💺 SeatSaver
          </h4>
          <button 
            className="btn btn-outline-info"
            onClick={onShowHelp}
            title="Show Getting Started Guide"
            style={{ 
              fontSize: '0.8rem',
              padding: '0.4rem 0.8rem',
              borderRadius: '15px',
              minWidth: '70px',
              border: '1px solid #17a2b8'
            }}
          >
            ❓ Help
          </button>
        </div>
        
        {/* Compact Stats Dashboard */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.5rem'
        }}>
          <div style={{
            textAlign: 'center',
            padding: '0.6rem 0.4rem',
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#495057' }}>
              {totalGuests}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#6c757d', fontWeight: '500' }}>Total</div>
          </div>
          <div style={{
            textAlign: 'center',
            padding: '0.6rem 0.4rem',
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#28a745' }}>
              {assignedGuests}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#6c757d', fontWeight: '500' }}>Seated</div>
          </div>
          <div style={{
            textAlign: 'center',
            padding: '0.6rem 0.4rem',
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: unassignedCount > 0 ? '#dc3545' : '#28a745' }}>
              {unassignedCount}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#6c757d', fontWeight: '500' }}>Left</div>
          </div>
        </div>
      </div>

      {/* Collapsible Upload & Save Section */}
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => toggleSection('upload')}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem',
            backgroundColor: '#e7f3ff',
            border: '1px solid #b3d7ff',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: '#0d6efd',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#d1ecf1'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#e7f3ff'}
        >
          <span>📁 Upload & Save</span>
          <span style={{ fontSize: '0.8rem' }}>
            {expandedSections.upload ? '▼' : '▶'}
          </span>
        </button>
        
        {expandedSections.upload && (
          <div style={{
            marginTop: '0.75rem',
            padding: '1rem',
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '0.85rem', 
                fontWeight: '600', 
                marginBottom: '0.5rem',
                color: '#495057'
              }}>
                📄 Upload Guest List
              </label>
              <input
                type="file"
                className="form-control"
                accept=".csv"
                onChange={onFileUpload}
                ref={fileInputRef}
                style={{
                  padding: '0.5rem',
                  fontSize: '0.85rem',
                  border: '1px solid #ced4da',
                  borderRadius: '6px',
                  width: '100%'
                }}
              />
              <small style={{ color: '#6c757d', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>
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
            
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.85rem', 
                fontWeight: '600', 
                marginBottom: '0.5rem',
                color: '#495057'
              }}>
                💾 Project Files
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  className="btn btn-success" 
                  onClick={onSaveState}
                  style={{ 
                    flex: 1, 
                    fontSize: '0.8rem',
                    padding: '0.6rem',
                    fontWeight: '600'
                  }}
                >
                  💾 Save
                </button>
                <button 
                  className="btn btn-info" 
                  onClick={() => loadStateRef.current?.click()}
                  style={{ 
                    flex: 1, 
                    fontSize: '0.8rem',
                    padding: '0.6rem',
                    fontWeight: '600'
                  }}
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
              <small style={{ 
                color: '#6c757d', 
                fontSize: '0.75rem', 
                display: 'block', 
                marginTop: '0.5rem',
                textAlign: 'center'
              }}>
                Save complete project with layout
              </small>
            </div>
          </div>
        )}
      </div>

      {/* Always Visible Guest List Section */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '0.75rem'
        }}>
          <span style={{ fontSize: '1.1rem' }}>👥</span>
          <h6 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '600', color: '#495057' }}>
            Guest List
          </h6>
          <span style={{
            fontSize: '0.75rem',
            backgroundColor: '#6c757d',
            color: 'white',
            padding: '0.15rem 0.5rem',
            borderRadius: '12px',
            fontWeight: '500'
          }}>
            {visibleCount}
          </span>
        </div>
        
        {/* Search Input */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <input
            type="text"
            placeholder="Search guests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              padding: '0.5rem',
              border: '1px solid #ced4da',
              borderRadius: '6px',
              fontSize: '0.85rem'
            }}
          />
          <button 
            onClick={() => setSearchTerm('')}
            style={{
              padding: '0.5rem 0.75rem',
              border: '1px solid #6c757d',
              borderRadius: '6px',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontSize: '0.8rem',
              color: '#6c757d'
            }}
          >
            ✕
          </button>
        </div>

        {/* Group Filter Dropdown */}
        {availableGroups && availableGroups.length > 1 && (
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ced4da',
              borderRadius: '6px',
              fontSize: '0.85rem',
              backgroundColor: selectedGroup !== 'All' ? '#e7f3ff' : 'white',
              borderColor: selectedGroup !== 'All' ? '#0d6efd' : '#ced4da',
              marginBottom: selectedGroup !== 'All' ? '0.5rem' : '0.75rem'
            }}
          >
            {availableGroups.map(group => (
              <option key={group} value={group}>
                {group === 'All' ? '👥 All Groups' : `${getGroupIcon(group)} ${group}`}
              </option>
            ))}
          </select>
        )}

        {selectedGroup !== 'All' && (
          <small style={{ 
            display: 'block', 
            marginBottom: '0.75rem',
            color: '#0d6efd',
            fontSize: '0.75rem',
            fontWeight: '500',
            textAlign: 'center',
            backgroundColor: '#e7f3ff',
            padding: '0.25rem 0.5rem',
            borderRadius: '12px'
          }}>
            Showing {selectedGroup} group • {filteredGuests.length} guests
          </small>
        )}

        {/* Guest List */}
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          maxHeight: '320px',
          overflowY: 'auto',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          {filteredGuests.length > 0 ? (
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {filteredGuests.map((guest, index) => (
                <GuestListItem
                    key={index}
                    guest={guest}
                    onDragStart={onDragStart}
                    onAssignGroup={onAssignGroup}
                    onDrop={onDrop} // Add this
                    availableGroups={availableGroups}
                    availableTableList={availableTableList} // Add this
                    assignments={assignments} // Add this
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
                  <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>No guests loaded</div>
                  <small>Upload a CSV file to get started</small>
                </div>
              ) : searchTerm || selectedGroup !== 'All' ? (
                <div>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
                  <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>No guests match your filters</div>
                  <small>Try different search terms or group</small>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎉</div>
                  <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>All guests are seated!</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Collapsible Group Management */}
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => toggleSection('groups')}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem',
            backgroundColor: '#fff3e0',
            border: '1px solid #ffcc80',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: '#f57c00',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#ffe0b2'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#fff3e0'}
        >
          <span>🏷️ Group Management</span>
          <span style={{ fontSize: '0.8rem' }}>
            {expandedSections.groups ? '▼' : '▶'}
          </span>
        </button>
        
        {expandedSections.groups && (
          <div style={{
            marginTop: '0.75rem',
            padding: '1rem',
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ 
              fontSize: '0.8rem', 
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
                  fontSize: '0.8rem', 
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
                    {availableGroups.length - 1} {/* Subtract 1 for 'All' */}
                  </span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '0.4rem'
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
                            padding: '0.3rem 0.6rem',
                            backgroundColor: group === 'Unassigned' ? '#fff3cd' : '#e7f3ff',
                            color: group === 'Unassigned' ? '#856404' : '#0d6efd',
                            borderRadius: '12px',
                            border: `1px solid ${group === 'Unassigned' ? '#ffeaa7' : '#b3d7ff'}`,
                            fontWeight: '500'
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
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
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
                Click any guest's group badge and select "New Group" to create groups like:
              </div>
              
              {/* Examples as text */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '0.7rem',
                color: '#6c757d'
              }}>
                <span>🌹 Bridal Party</span>
                <span>👨‍👩‍👧‍👦 Family</span>
                <span>🎓 Friends</span>
                <span>💼 Work</span>
                <span>🏠 Neighbors</span>
                <span>➕ Plus Ones</span>
              </div>
            </div>
            
            {/* Quick action if no groups exist yet */}
            {(!availableGroups || availableGroups.length <= 2) && (
              <div style={{
                marginTop: '0.75rem',
                padding: '0.75rem',
                backgroundColor: '#e7f3ff',
                borderRadius: '8px',
                border: '1px solid #b3d7ff',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '0.8rem',
                  color: '#0d6efd',
                  fontWeight: '600',
                  marginBottom: '0.5rem'
                }}>
                  💡 Get Started
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#495057',
                  lineHeight: '1.4'
                }}>
                  Click on any guest's{' '}
                  <span style={{
                    display: 'inline-block',
                    backgroundColor: '#bdc3c7',
                    color: 'white',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '8px',
                    margin: '0 0.25rem',
                    fontSize: '0.65rem'
                  }}>
                    📝 Unassigned
                  </span>
                  badge to create your first group!
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Collapsible Export Section */}
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => toggleSection('export')}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem',
            backgroundColor: '#e8f5e8',
            border: '1px solid #a5d6a5',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: '#28a745',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#d4f4d4'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#e8f5e8'}
        >
          <span>📤 Export Options</span>
          <span style={{ fontSize: '0.8rem' }}>
            {expandedSections.export ? '▼' : '▶'}
          </span>
        </button>
        
        {expandedSections.export && (
          <div style={{
            marginTop: '0.75rem',
            padding: '1rem',
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <button 
              className="btn btn-primary" 
              onClick={onExport}
              disabled={assignedGuests === 0}
              style={{ 
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.85rem',
                fontWeight: '600',
                opacity: assignedGuests === 0 ? 0.6 : 1,
                cursor: assignedGuests === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              📄 Export Assignments CSV
            </button>
            {assignedGuests === 0 && (
              <small style={{ 
                color: '#6c757d', 
                fontSize: '0.75rem', 
                display: 'block', 
                marginTop: '0.5rem',
                textAlign: 'center'
              }}>
                Assign guests to tables first
              </small>
            )}
          </div>
        )}
      </div>

      {/* Compact Tips */}
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
        <div style={{ color: '#495057', fontSize: '0.8rem', lineHeight: '1.5' }}>
          • <strong>Drag guests</strong> to table seats<br />
          • <strong>Click group badges</strong> to change groups<br />
          • <strong>Double-click tables</strong> to customize<br />
          • <strong>Right-click seats</strong> to add guests<br />
          • <strong>Save regularly</strong> to preserve work
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
              fontSize: '0.8rem'
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