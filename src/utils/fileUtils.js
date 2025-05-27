// File utility functions for save/load/export operations

export const saveStateToFile = (allGuests, assignments, layoutData = null) => {
  const state = {
    guests: allGuests,
    assignments: assignments,
    layout: layoutData, // Include layout data with custom labels and table configurations
    timestamp: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `seatsaver_project_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const loadStateFromFile = (event, setAllGuests, setAssignments, setLayoutData = null) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const state = JSON.parse(e.target.result);
      
      if (!state.guests || !state.assignments) {
        throw new Error('Invalid state file format');
      }

      setAllGuests(state.guests);
      setAssignments(state.assignments);
      
      // Load layout data if it exists and callback is provided
      if (state.layout && setLayoutData) {
        setLayoutData(state.layout);
      }
      
      alert(`State loaded successfully! (Saved: ${new Date(state.timestamp).toLocaleString()})`);
    } catch (error) {
      console.error('Load failed:', error);
      alert('Failed to load state file. Please check the file format.');
    }
  };
  reader.readAsText(file);
  
  // Clear input
  event.target.value = '';
};

export const exportToCSV = (assignments, layoutData = null) => {
  // Helper function to get table label
  const getTableLabel = (tableId) => {
    if (layoutData && layoutData.tableLabels && layoutData.tableLabels[tableId]) {
      return layoutData.tableLabels[tableId];
    }
    return `Table ${tableId}`;
  };

  // Helper function to get table configuration
  const getTableConfig = (tableId) => {
    if (layoutData && layoutData.tableConfigs && layoutData.tableConfigs[tableId]) {
      return layoutData.tableConfigs[tableId];
    }
    return { shape: 'circle', size: 45, capacity: 10, backgroundColor: '#f8f9fa' };
  };

  let csvContent = 'Name,Table ID,Table Label,Table Shape,Table Size,Table Capacity,Background Color\n';
  assignments.forEach(assignment => {
    const tableLabel = getTableLabel(assignment.table);
    const tableConfig = getTableConfig(assignment.table);
    csvContent += `"${assignment.name}","${assignment.table}","${tableLabel}","${tableConfig.shape}","${tableConfig.size}","${tableConfig.capacity}","${tableConfig.backgroundColor}"\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `seatsaver_assignments_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportTableSummary = (assignments, layoutData = null) => {
  // Helper function to get table label
  const getTableLabel = (tableId) => {
    if (layoutData && layoutData.tableLabels && layoutData.tableLabels[tableId]) {
      return layoutData.tableLabels[tableId];
    }
    return `Table ${tableId}`;
  };

  // Helper function to get table configuration
  const getTableConfig = (tableId) => {
    if (layoutData && layoutData.tableConfigs && layoutData.tableConfigs[tableId]) {
      return layoutData.tableConfigs[tableId];
    }
    return { shape: 'circle', size: 45, capacity: 10, backgroundColor: '#f8f9fa' };
  };

  // Get all unique tables from assignments and layout
  const allTables = new Set();
  assignments.forEach(a => allTables.add(a.table));
  if (layoutData && layoutData.tablePositions) {
    Object.keys(layoutData.tablePositions).forEach(tableId => allTables.add(tableId));
  }

  // Create table summary
  const tableData = Array.from(allTables).map(tableId => {
    const tableGuests = assignments.filter(a => a.table === tableId);
    const tableConfig = getTableConfig(tableId);
    const tableLabel = getTableLabel(tableId);
    
    return {
      tableId,
      tableLabel,
      guestCount: tableGuests.length,
      capacity: tableConfig.capacity,
      shape: tableConfig.shape,
      size: tableConfig.size,
      backgroundColor: tableConfig.backgroundColor,
      guests: tableGuests.map(g => g.name).join('; ')
    };
  }).sort((a, b) => {
    // Sort by table ID numerically
    const aNum = parseInt(a.tableId);
    const bNum = parseInt(b.tableId);
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return aNum - bNum;
    }
    return a.tableId.localeCompare(b.tableId);
  });

  let csvContent = 'Table ID,Table Label,Guest Count,Capacity,Utilization %,Shape,Size,Background Color,Guests\n';
  tableData.forEach(table => {
    const utilization = Math.round((table.guestCount / table.capacity) * 100);
    csvContent += `"${table.tableId}","${table.tableLabel}","${table.guestCount}","${table.capacity}","${utilization}%","${table.shape}","${table.size}","${table.backgroundColor}","${table.guests}"\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `table_summary_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export const parseCSVFile = (file) => {
  return new Promise((resolve, reject) => {
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
        
        resolve(guests);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

// New utility function to validate table configurations
export const validateTableConfig = (config) => {
  const validShapes = ['circle', 'rectangle', 'square', 'oval'];
  
  return {
    shape: validShapes.includes(config.shape) ? config.shape : 'circle',
    size: Math.max(20, Math.min(80, parseInt(config.size) || 45)),
    capacity: Math.max(2, Math.min(20, parseInt(config.capacity) || 10)),
    backgroundColor: config.backgroundColor || '#f8f9fa'
  };
};

// Utility function to migrate old layout data to include table configurations
export const migrateLayoutData = (layoutData) => {
  if (!layoutData) return null;
  
  // If tableConfigs doesn't exist, create default configurations for existing tables
  if (!layoutData.tableConfigs && layoutData.tablePositions) {
    const tableConfigs = {};
    Object.keys(layoutData.tablePositions).forEach(tableId => {
      tableConfigs[tableId] = { shape: 'circle', size: 45, capacity: 10, backgroundColor: '#f8f9fa' };
    });
    layoutData.tableConfigs = tableConfigs;
  }
  
  return layoutData;
};