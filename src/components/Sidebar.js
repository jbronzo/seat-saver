import React, { useRef } from 'react';
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

  // Handle bulk group creation (creates empty groups for assignment)
  const handleCreateGroupForAssignment = (groupName) => {
    // This will create the group when the first guest is assigned to it
    // For now, we'll just show an alert explaining how to use it
    alert(
      `To create and use the "${groupName}" group:\n\n` +
      `1. Click on any guest's group badge below\n` +
      `2. Select "➕ New Group" or find "${groupName}" in the list\n` +
      `3. If creating new, enter "${groupName}" as the group name\n\n` +
      `Groups are created automatically when you assign the first guest to them.`
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

      {/* Guest Search & Group Filter */}
      <div className="mb-3">
        <h6 style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          marginBottom: '0.75rem'
        }}>
          👥 Guest List
        </h6>
        
        {/* Search Input */}
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

        {/* Group Management - Improved and Clearer */}
        {totalGuests > 0 && (
          <div style={{ 
            marginBottom: '0.75rem',
            padding: '0.75rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px',
            border: '1px solid #e9ecef'
          }}>
            <div style={{ 
              fontSize: '0.8rem', 
              fontWeight: '600', 
              marginBottom: '0.5rem',
              color: '#495057'
            }}>
              🏷️ Group Management
            </div>
            
            {/* Instructions */}
            <div style={{ 
              fontSize: '0.75rem', 
              color: '#6c757d', 
              marginBottom: '0.75rem',
              lineHeight: '1.4'
            }}>
              <strong>To assign groups:</strong><br />
              Click any guest's colored group badge below to assign them to a group.
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
                    {availableGroups.length - 1} {/* Subtract 1 for 'All' */}
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
                Click any guest's group badge and select "New Group" to create custom groups like:
              </div>
              
              {/* Examples as text, not buttons */}
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
                padding: '0.5rem',
                backgroundColor: '#e7f3ff',
                borderRadius: '6px',
                border: '1px solid #b3d7ff',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#0d6efd',
                  fontWeight: '600',
                  marginBottom: '0.25rem'
                }}>
                  💡 Get Started
                </div>
                <div style={{
                  fontSize: '0.7rem',
                  color: '#495057'
                }}>
                  Click on any guest's{' '}
                  <span style={{
                    display: 'inline-block',
                    backgroundColor: '#bdc3c7',
                    color: 'white',
                    padding: '0.1rem 0.3rem',
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
          • <strong>Click group badges</strong> to change guest groups<br />
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