import React, { useState, useRef, useCallback, useEffect } from 'react';
import Sidebar from './Sidebar';
import CanvasChartArea from './CanvasChartArea';
import WelcomeModal from './WelcomeModal';
import LandingHeader from './LandingHeader'; // New import
import { saveStateToFile, loadStateFromFile, exportToCSV } from '../utils/fileUtils';

const WeddingSeatingChart = () => {
  const [allGuests, setAllGuests] = useState([]);
  const [assignments, setAssignments] = useState([]); // [{name: string, table: string}]
  const [searchTerm, setSearchTerm] = useState('');
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

  // Get unassigned guests for sidebar
  const unassignedGuests = allGuests.filter(guest => 
    !assignments.find(a => a.name === guest.Name)
  );

  // Filter guests by search term
  const filteredGuests = unassignedGuests.filter(guest =>
    guest.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle CSV upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n');
        const guests = lines.slice(1)
          .filter(line => line.trim())
          .map(line => {
            const values = line.split(',');
            return { Name: values[0]?.replace(/"/g, '').trim() };
          })
          .filter(guest => guest.Name);
        
        if (guests.length === 0) {
          alert('No valid guest names found in the CSV file. Please check the format.');
          return;
        }
        
        setAllGuests(guests);
        setAssignments([]);
        console.log(`Loaded ${guests.length} guests from CSV`);
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

    // Create new guest object
    const newGuest = { Name: guestName };
    
    // Add to allGuests array
    setAllGuests(prev => [...prev, newGuest]);
    
    // Create assignment
    const newAssignment = { name: guestName, table: tableId };
    setAssignments(prev => [...prev, newAssignment]);
    
    console.log(`New guest "${guestName}" created and assigned to Table ${tableId}`);
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
      
      {/* Landing Header - shows when no guests loaded */}
      <LandingHeader 
        onShowHelp={handleShowHelp}
        onFileUpload={handleFileUpload}
        totalGuests={totalGuests}
      />
      
      <Sidebar
        filteredGuests={filteredGuests}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        visibleCount={visibleCount}
        unassignedCount={unassignedCount}
        assignedGuests={assignedGuests}
        totalGuests={totalGuests}
        onFileUpload={handleFileUpload}
        onSaveState={handleSaveState}
        onLoadState={handleLoadState}
        onExport={handleExport}
        onDragStart={handleDragStart}
        onShowHelp={handleShowHelp} // New prop for help button
      />
      <CanvasChartArea
        assignments={assignments}
        onDrop={handleDrop}
        onRemoveGuest={handleRemoveGuest}
        onDragStart={handleDragStart}
        onLayoutChange={setLayoutData}
        layoutData={layoutData}
        onAddGuest={handleAddGuest}
      />
    </div>
  );
};

export default WeddingSeatingChart;