import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import Sidebar from './Sidebar';
import CanvasChartArea from './CanvasChartArea';
import WelcomeModal from './WelcomeModal';
import LandingHeader from './LandingHeader';
import { saveStateToFile, loadStateFromFile, exportToCSV } from '../utils/fileUtils';

const WeddingSeatingChart = () => {
  const [allGuests, setAllGuests] = useState([]);
  const [assignments, setAssignments] = useState([]); // [{name: string, table: string}]
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('All'); // New state for group filtering
  const [layoutData, setLayoutData] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false); // New state for welcome modal

  // Show welcome modal on first visit
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setShowWelcome(true);
    }
  }, []);

  // Handle closing welcome modal
  const handleCloseWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('hasSeenWelcome', 'true');
  };

  // Function to show welcome modal again (for help button)
  const handleShowHelp = () => {
    setShowWelcome(true);
  };

  // Handle template loading
  const handleLoadTemplate = useCallback((templateData) => {
    try {
      console.log('Loading template:', templateData);
      
      // Set the template data
      setAllGuests(templateData.guests || []);
      setAssignments(templateData.assignments || []);
      setLayoutData(templateData.layout || null);
      
      // Reset filters
      setSearchTerm('');
      setSelectedGroup('All');
      
      console.log('Template loaded successfully');
      
      // Show a brief success message
      setTimeout(() => {
        if (templateData.guests && templateData.guests.length === 1 && templateData.guests[0].Name === "Sample Guest") {
          alert('Template loaded! Upload your guest list CSV to replace the sample guest and start seating your real guests.');
        } else {
          alert('Template loaded! You can now start customizing the layout or upload a new guest list.');
        }
      }, 500);
      
    } catch (error) {
      console.error('Error loading template:', error);
      alert('Failed to load template. Please try again.');
    }
  }, []);

  // Get unassigned guests for sidebar
  const unassignedGuests = allGuests.filter(guest => 
    !assignments.find(a => a.name === guest.Name)
  );

  // Filter guests by search term and group
  const filteredGuests = unassignedGuests.filter(guest => {
    const matchesSearch = guest.Name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = selectedGroup === 'All' || guest.Group === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  // Handle CSV upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n');
        
        // Check if we have headers
        const headers = lines[0].toLowerCase().split(',').map(h => h.replace(/"/g, '').trim());
        const hasGroupColumn = headers.includes('group');
        
        const guests = lines.slice(1)
          .filter(line => line.trim())
          .map(line => {
            const values = line.split(',');
            const guestData = { 
              Name: values[0]?.replace(/"/g, '').trim() 
            };
            
            // Add group if column exists
            if (hasGroupColumn && values[1]) {
              guestData.Group = values[1]?.replace(/"/g, '').trim();
            } else {
              guestData.Group = 'Unassigned';
            }
            
            return guestData;
          })
          .filter(guest => guest.Name);
        
        if (guests.length === 0) {
          alert('No valid guest names found in the CSV file. Please check the format.');
          return;
        }
        
        // If we have a template loaded (layoutData exists), keep the layout but replace guests
        setAllGuests(guests);
        
        // Clear old assignments since we have new guests
        setAssignments([]);
        
        console.log(`Loaded ${guests.length} guests from CSV${hasGroupColumn ? ' with groups' : ''}`);
        
        // Show success message
        setTimeout(() => {
          const templateMessage = layoutData ? ' Your template layout has been preserved.' : '';
          alert(`Successfully loaded ${guests.length} guests!${templateMessage} You can now start assigning them to tables.`);
        }, 300);
        
      } catch (error) {
        console.error('Error parsing CSV:', error);
        alert('Error reading CSV file. Please check the file format and try again.');
      }
    };
    
    reader.onerror = () => {
      alert('Error reading file. Please try again.');
    };
    
    reader.readAsText(file);
  };

  // Handle drag start
  const handleDragStart = useCallback((e, guestName, fromTable) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      name: guestName,
      fromTable: fromTable
    }));
  }, []);

  // Handle drop on table
  const handleDrop = useCallback((data, targetTable) => {
    const { name: guestName } = data;
    
    // Check if table is full (this will be updated based on actual table capacity)
    const currentGuestsInTable = assignments.filter(a => a.table === targetTable).length;
    if (currentGuestsInTable >= 10) {
      alert('This table is full!');
      return;
    }

    setAssignments(prev => {
      // Remove from old assignment if exists
      const filtered = prev.filter(a => a.name !== guestName);
      // Add new assignment
      return [...filtered, { name: guestName, table: targetTable }];
    });
  }, [assignments]);

  // Remove guest from table
  const handleRemoveGuest = useCallback((guestName) => {
    setAssignments(prev => prev.filter(a => a.name !== guestName));
  }, []);

  // Handle adding new guests on the fly
  const handleAddGuest = useCallback((guestName, tableId) => {
    // Check if guest already exists
    const existingGuest = allGuests.find(g => 
      g.Name.toLowerCase() === guestName.toLowerCase()
    );
    
    if (existingGuest) {
      alert(`Guest "${guestName}" already exists in your guest list.`);
      return;
    }

    // Create new guest object with default group
    const newGuest = { 
      Name: guestName,
      Group: 'Unassigned'
    };
    
    // Add to allGuests array
    setAllGuests(prev => [...prev, newGuest]);
    
    // Create assignment
    const newAssignment = { name: guestName, table: tableId };
    setAssignments(prev => [...prev, newAssignment]);
    
    console.log(`New guest "${guestName}" created and assigned to Table ${tableId}`);
  }, [allGuests]);

  // Handle guest group assignment - FIXED VERSION
  const handleAssignGroup = useCallback((guestName, newGroup) => {
    console.log(`Assigning ${guestName} to group: ${newGroup}`);
    
    setAllGuests(prev => {
      const updatedGuests = prev.map(guest => 
        guest.Name === guestName 
          ? { ...guest, Group: newGroup }
          : guest
      );
      
      console.log('Updated guests:', updatedGuests);
      return updatedGuests;
    });
    
    // Reset group filter if we were filtering by a different group
    if (selectedGroup !== 'All' && selectedGroup !== newGroup) {
      setSelectedGroup('All');
    }
    
    console.log(`Guest "${guestName}" assigned to group "${newGroup}"`);
  }, [selectedGroup]);

  // Get unique groups for filtering - IMPROVED VERSION
  const availableGroups = useMemo(() => {
    if (!allGuests || allGuests.length === 0) return ['All'];
    
    // Get all unique groups, filter out empty/undefined values
    const groups = [...new Set(
      allGuests
        .map(g => g.Group)
        .filter(group => group && group.trim() !== '')
    )];
    
    // Sort groups, but keep 'Unassigned' at the end if it exists
    const sortedGroups = groups.sort((a, b) => {
      if (a === 'Unassigned') return 1;
      if (b === 'Unassigned') return -1;
      return a.localeCompare(b);
    });
    
    console.log('Available groups:', ['All', ...sortedGroups]);
    return ['All', ...sortedGroups];
  }, [allGuests]);

  // Save state
  const handleSaveState = () => {
    if (allGuests.length === 0) {
      alert('No guest data to save! Please upload a CSV file or add some guests first.');
      return;
    }
    saveStateToFile(allGuests, assignments, layoutData);
  };

  // Load state
  const handleLoadState = (event) => {
    loadStateFromFile(event, setAllGuests, setAssignments, setLayoutData);
  };

  // Export CSV
  const handleExport = () => {
    if (assignments.length === 0) {
      alert('No seating assignments to export! Please assign some guests to tables first.');
      return;
    }
    exportToCSV(assignments, layoutData);
  };

  // Calculate statistics
  const totalGuests = allGuests.length;
  const assignedGuests = assignments.length;
  const unassignedCount = totalGuests - assignedGuests;
  const visibleCount = filteredGuests.length;

  return (
    <div className="wedding-seating-app">
      {/* Welcome Modal */}
      <WelcomeModal 
        isOpen={showWelcome} 
        onClose={handleCloseWelcome} 
      />
      
      {/* Landing Header with Templates - shows when no guests loaded */}
      <LandingHeader 
        onShowHelp={handleShowHelp}
        onFileUpload={handleFileUpload}
        onLoadProject={handleLoadState}
        onLoadTemplate={handleLoadTemplate}
        totalGuests={totalGuests}
      />
      
      <Sidebar
        filteredGuests={filteredGuests}
        allGuests={allGuests}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
        availableGroups={availableGroups}
        visibleCount={visibleCount}
        unassignedCount={unassignedCount}
        assignedGuests={assignedGuests}
        totalGuests={totalGuests}
        onFileUpload={handleFileUpload}
        onSaveState={handleSaveState}
        onLoadState={handleLoadState}
        onLoadTemplate={handleLoadTemplate} // NEW: Pass template handler to sidebar
        onExport={handleExport}
        onDragStart={handleDragStart}
        onShowHelp={handleShowHelp}
        onAssignGroup={handleAssignGroup}
      />
      <CanvasChartArea
        assignments={assignments}
        onRemoveGuest={handleRemoveGuest}
        onDrop={handleDrop}
        allGuests={allGuests}
        onDragStart={handleDragStart}
        onLayoutChange={setLayoutData}
        layoutData={layoutData}
        onAddGuest={handleAddGuest}
      />
    </div>
  );
};

export default WeddingSeatingChart;