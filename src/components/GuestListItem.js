import React, { useState, useEffect } from 'react';

// Mobile Table Assignment Modal Component
const MobileTableAssignment = ({ 
  guest, 
  isOpen, 
  onClose, 
  onAssign, 
  availableTables = [], 
  assignments = [] 
}) => {
  if (!isOpen) return null;

  // Calculate available spaces for each table
  const tableOptions = availableTables.map(table => {
    const currentGuests = assignments.filter(a => a.table === table.id).length;
    const available = table.capacity - currentGuests;
    return {
      ...table,
      currentGuests,
      available,
      isFull: available <= 0
    };
  }).sort((a, b) => parseInt(a.id) - parseInt(b.id));

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px 20px 0 0',
        width: '100%',
        maxWidth: '400px',
        maxHeight: '70vh',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem 1.5rem 1rem 1.5rem',
          borderBottom: '1px solid #dee2e6',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
            Assign {guest.Name}
          </h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#6c757d' }}>
            Choose a table for this guest
          </p>
        </div>

        {/* Table List */}
        <div style={{
          maxHeight: '400px',
          overflowY: 'auto',
          padding: '1rem'
        }}>
          {tableOptions.map(table => (
            <button
              key={table.id}
              onClick={() => table.isFull ? null : onAssign(guest.Name, table.id)}
              disabled={table.isFull}
              style={{
                width: '100%',
                padding: '1rem',
                marginBottom: '0.75rem',
                border: table.isFull ? '2px solid #e9ecef' : '2px solid #28a745',
                borderRadius: '12px',
                backgroundColor: table.isFull ? '#f8f9fa' : 'white',
                cursor: table.isFull ? 'not-allowed' : 'pointer',
                textAlign: 'left',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.2s ease',
                opacity: table.isFull ? 0.5 : 1
              }}
            >
              <div>
                <div style={{ 
                  fontWeight: '600', 
                  fontSize: '1rem',
                  color: table.isFull ? '#6c757d' : '#495057'
                }}>
                  {table.label || `Table ${table.id}`}
                </div>
                <div style={{ 
                  fontSize: '0.85rem', 
                  color: '#6c757d',
                  marginTop: '0.25rem'
                }}>
                  {table.currentGuests}/{table.capacity} guests
                  {table.isFull && ' • Full'}
                </div>
              </div>
              
              {!table.isFull && (
                <div style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: '600'
                }}>
                  Assign
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Cancel Button */}
        <div style={{ padding: '1rem' }}>
          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '1rem',
              border: '2px solid #6c757d',
              borderRadius: '12px',
              backgroundColor: 'white',
              color: '#6c757d',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const GuestListItem = ({ 
  guest, 
  onDragStart, 
  onAssignGroup = () => console.warn('onAssignGroup not provided'), 
  onDrop = () => console.warn('onDrop not provided'),
  availableGroups = [],
  availableTableList = [],
  assignments = []
}) => {
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showTableAssignment, setShowTableAssignment] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Safety check for guest object
  if (!guest || !guest.Name) {
    return null;
  }
  
  // Ensure guest has a Group property
  const guestGroup = guest.Group || 'Unassigned';
  
  // Ensure availableGroups is an array and filter out 'All'
  const safeAvailableGroups = Array.isArray(availableGroups) ? availableGroups.filter(g => g !== 'All') : ['Unassigned'];

  // Handle drag start (disabled on mobile)
  const handleDragStart = (e) => {
    if (!isMobile) {
      onDragStart(e, guest.Name, null);
    }
  };

  // Handle mobile assignment
  const handleMobileAssignment = () => {
    if (isMobile) {
      setShowTableAssignment(true);
    }
  };

  // Handle direct group click to show modal
  const handleGroupClick = (e) => {
    e.stopPropagation();
    setShowGroupModal(true);
  };

  // Handle group selection from modal
  const handleGroupSelect = (selectedGroup) => {
    if (selectedGroup && selectedGroup !== guestGroup) {
      onAssignGroup(guest.Name, selectedGroup);
    }
    setShowGroupModal(false);
  };

  // Handle creating new group
  const handleCreateNewGroup = () => {
    const newGroup = window.prompt('Enter new group name:', '');
    if (newGroup && newGroup.trim()) {
      const trimmedGroup = newGroup.trim();
      if (safeAvailableGroups.includes(trimmedGroup)) {
        alert(`Group "${trimmedGroup}" already exists. Please choose a different name.`);
      } else {
        // First assign the guest to the new group
        onAssignGroup(guest.Name, trimmedGroup);
        setShowGroupModal(false);
      }
    }
  };

  // Handle mobile table assignment
  const handleTableAssign = (guestName, tableId) => {
    onDrop({ name: guestName }, tableId);
    setShowTableAssignment(false);
  };

  // Group color mapping
  const getGroupColor = (group) => {
    if (!group) return '#bdc3c7';
    
    const colors = {
      'Bridal Party': '#ff6b6b',
      'Family': '#4ecdc4',
      'Friends': '#45b7d1',
      'Work': '#f39c12',
      'College': '#9b59b6',
      'High School': '#e67e22',
      'Neighbors': '#2ecc71',
      'Plus Ones': '#95a5a6',
      'Unassigned': '#bdc3c7'
    };
    
    return colors[group] || '#6c757d';
  };

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

  return (
    <>
      <li
        draggable={!isMobile}
        onDragStart={isMobile ? undefined : handleDragStart}
        onClick={isMobile ? handleMobileAssignment : undefined}
        style={{
          padding: '0.75rem',
          marginBottom: '0.25rem',
          backgroundColor: 'white',
          border: '1px solid #dee2e6',
          borderRadius: '6px',
          cursor: isMobile ? 'pointer' : 'grab',
          transition: 'all 0.2s ease',
          borderLeft: `4px solid ${getGroupColor(guestGroup)}`,
          minHeight: isMobile ? '48px' : 'auto'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#f8f9fa';
          e.target.style.transform = 'translateX(2px)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'white';
          e.target.style.transform = 'translateX(0)';
        }}
      >
        {/* Guest Info */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{
              fontWeight: '600',
              fontSize: '0.9rem',
              color: '#495057',
              marginBottom: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>{guest.Name}</span>
              {isMobile && (
                <span style={{
                  fontSize: '0.7rem',
                  color: '#28a745',
                  fontWeight: 'normal',
                  backgroundColor: '#d4edda',
                  padding: '0.15rem 0.4rem',
                  borderRadius: '8px',
                  border: '1px solid #c3e6cb'
                }}>
                  Tap to assign →
                </span>
              )}
            </div>
            
            {/* Clickable Group Badge */}
            <button
              onClick={handleGroupClick}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.75rem',
                color: getGroupColor(guestGroup),
                backgroundColor: `${getGroupColor(guestGroup)}20`,
                padding: '0.25rem 0.5rem',
                borderRadius: '12px',
                border: `1px solid ${getGroupColor(guestGroup)}40`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = `${getGroupColor(guestGroup)}30`;
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = `${getGroupColor(guestGroup)}20`;
                e.target.style.transform = 'scale(1)';
              }}
              title={`Click to change group for ${guest.Name}`}
            >
              <span>{getGroupIcon(guestGroup)}</span>
              <span>{guestGroup}</span>
              <span style={{ 
                fontSize: '0.7rem', 
                opacity: 0.7,
                marginLeft: '0.25rem'
              }}>
                ✏️
              </span>
            </button>
          </div>
        </div>
      </li>

      {/* Group Selection Modal */}
      {showGroupModal && (
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
            minWidth: '300px',
            maxWidth: '400px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            {/* Modal Header */}
            <div style={{
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              <h3 style={{
                margin: '0 0 0.5rem 0',
                fontSize: '1.25rem',
                color: '#495057'
              }}>
                Change Group
              </h3>
              <p style={{
                margin: 0,
                fontSize: '0.9rem',
                color: '#6c757d'
              }}>
                Select a group for <strong>{guest.Name}</strong>
              </p>
              <div style={{
                marginTop: '0.75rem',
                padding: '0.5rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '6px',
                fontSize: '0.85rem',
                color: '#495057'
              }}>
                Current: <span style={{ 
                  color: getGroupColor(guestGroup),
                  fontWeight: '600'
                }}>
                  {getGroupIcon(guestGroup)} {guestGroup}
                </span>
              </div>
            </div>

            {/* Group Selection */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#495057'
              }}>
                Select Group:
              </label>
              <div style={{
                display: 'grid',
                gap: '0.5rem',
                maxHeight: '200px',
                overflowY: 'auto'
              }}>
                {safeAvailableGroups.length > 0 ? (
                  safeAvailableGroups.map(group => (
                    <button
                      key={group}
                      onClick={() => handleGroupSelect(group)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        border: `2px solid ${group === guestGroup ? getGroupColor(group) : '#e9ecef'}`,
                        borderRadius: '8px',
                        backgroundColor: group === guestGroup ? `${getGroupColor(group)}10` : 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        textAlign: 'left',
                        fontSize: '0.9rem'
                      }}
                      onMouseEnter={(e) => {
                        if (group !== guestGroup) {
                          e.target.style.backgroundColor = '#f8f9fa';
                          e.target.style.borderColor = '#0d6efd';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (group !== guestGroup) {
                          e.target.style.backgroundColor = 'white';
                          e.target.style.borderColor = '#e9ecef';
                        }
                      }}
                    >
                      <span style={{ fontSize: '1.1rem' }}>
                        {getGroupIcon(group)}
                      </span>
                      <span style={{ 
                        flex: 1,
                        fontWeight: group === guestGroup ? '600' : '400',
                        color: group === guestGroup ? getGroupColor(group) : '#495057'
                      }}>
                        {group}
                      </span>
                      {group === guestGroup && (
                        <span style={{ color: getGroupColor(group) }}>✓</span>
                      )}
                    </button>
                  ))
                ) : (
                  <div style={{
                    padding: '1rem',
                    textAlign: 'center',
                    color: '#6c757d',
                    fontSize: '0.9rem'
                  }}>
                    No groups available. Create a new group below.
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              justifyContent: 'space-between'
            }}>
              <button
                onClick={handleCreateNewGroup}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: '2px solid #28a745',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  color: '#28a745',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#28a745';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.color = '#28a745';
                }}
              >
                ➕ New Group
              </button>
              
              <button
                onClick={() => setShowGroupModal(false)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: '2px solid #6c757d',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  color: '#6c757d',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#6c757d';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.color = '#6c757d';
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Table Assignment Modal */}
      {showTableAssignment && (
        <MobileTableAssignment
          guest={guest}
          isOpen={showTableAssignment}
          onClose={() => setShowTableAssignment(false)}
          onAssign={handleTableAssign}
          availableTables={availableTableList}
          assignments={assignments}
        />
      )}
    </>
  );
};

export default GuestListItem;