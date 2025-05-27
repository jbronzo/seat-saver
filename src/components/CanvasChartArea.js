import React, { useState, useRef } from 'react';
import { Stage, Layer, Group, Rect, Text, Circle, Line } from 'react-konva';
import CanvasTable from './CanvasTable';

const CanvasChartArea = ({ assignments, onRemoveGuest, onDrop, onLayoutChange, layoutData, onAddGuest, allGuests })=> {
  const stageRef = useRef();
  const isLoadingRef = useRef(false);
  const saveTimeoutRef = useRef(null);
  const [nextTableId, setNextTableId] = useState(17);
  
  // ALL STATE VARIABLES DECLARED FIRST
  const [stageSize, setStageSize] = useState({ width: 1200, height: 800 });
  const [zoom, setZoom] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [isDraggingTable, setIsDraggingTable] = useState(false);
  const [dragOverTable, setDragOverTable] = useState(null);
  const [sweetheartPos, setSweetheartPos] = useState({ x: 600, y: 50 });
  const [danceFloorPos, setDanceFloorPos] = useState({ x: 1060, y: 180 });
  const [danceFloorSize, setDanceFloorSize] = useState({ width: 180, height: 120 });
  const [selectedTable, setSelectedTable] = useState(null);
  const [showAddTableMode, setShowAddTableMode] = useState(false);
  const [ghostTablePos, setGhostTablePos] = useState(null);
  const [tablePositions, setTablePositions] = useState({
    '1': { x: 150, y: 150 },
    '2': { x: 320, y: 150 },
    '3': { x: 490, y: 150 },
    '4': { x: 660, y: 150 },
    '5': { x: 150, y: 310 },
    '6': { x: 320, y: 310 },
    '7': { x: 490, y: 310 },
    '8': { x: 150, y: 470 },
    '9': { x: 320, y: 470 },
    '10': { x: 490, y: 470 },
    '11': { x: 120, y: 630 },
    '12': { x: 240, y: 630 },
    '13': { x: 360, y: 630 },
    '14': { x: 480, y: 630 },
    '15': { x: 600, y: 630 },
    '16': { x: 720, y: 630 }
  });
  
  // Table customization states
  const [tableLabels, setTableLabels] = useState({});
  const [tableConfigs, setTableConfigs] = useState({});
  const [newTableConfig, setNewTableConfig] = useState({
    shape: 'circle',
    size: 45,
    capacity: 10,
    backgroundColor: '#f8f9fa'
  });
  
  // UI States
  const [showCustomizationPanel, setShowCustomizationPanel] = useState(false);
  const [customizingTableId, setCustomizingTableId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Helper function to get table label (custom or default)
  const getTableLabel = (tableId) => {
    return tableLabels[tableId] || `Table ${tableId}`;
  };

  // Helper function to get table configuration
  const getTableConfig = (tableId) => {
    return tableConfigs[tableId] || { shape: 'circle', size: 45, capacity: 10, backgroundColor: '#f8f9fa' };
  };

  // EFFECT TO LOAD LAYOUT
  React.useEffect(() => {
    isLoadingRef.current = true;
    
    if (layoutData) {
      console.log('Loading layout from state file');
      if (layoutData.tablePositions) setTablePositions(layoutData.tablePositions);
      if (layoutData.tableLabels) setTableLabels(layoutData.tableLabels);
      if (layoutData.tableConfigs) setTableConfigs(layoutData.tableConfigs);
      if (layoutData.danceFloorPos) setDanceFloorPos(layoutData.danceFloorPos);
      if (layoutData.danceFloorSize) setDanceFloorSize(layoutData.danceFloorSize);
      if (layoutData.zoom) setZoom(layoutData.zoom);
      if (layoutData.stagePos) setStagePos(layoutData.stagePos);
      if (layoutData.nextTableId) setNextTableId(layoutData.nextTableId);
    } else {
      const savedLayout = localStorage.getItem('wedding-seating-layout');
      if (savedLayout) {
        try {
          const layout = JSON.parse(savedLayout);
          if (layout.tablePositions) setTablePositions(layout.tablePositions);
          if (layout.tableLabels) setTableLabels(layout.tableLabels);
          if (layout.tableConfigs) setTableConfigs(layout.tableConfigs);
          if (layout.danceFloorPos) setDanceFloorPos(layout.danceFloorPos);
          if (layout.danceFloorSize) setDanceFloorSize(layout.danceFloorSize);
          if (layout.zoom) setZoom(layout.zoom);
          if (layout.stagePos) setStagePos(layout.stagePos);
          if (layout.nextTableId) setNextTableId(layout.nextTableId);
          console.log('Layout loaded from localStorage');
        } catch (error) {
          console.error('Error loading layout:', error);
        }
      }
    }
    
    setTimeout(() => {
      isLoadingRef.current = false;
    }, 100);
  }, [layoutData]);

  // EFFECT TO SAVE LAYOUT WHEN STATE CHANGES - WITH DEBOUNCING
  React.useEffect(() => {
    if (isLoadingRef.current || isDraggingTable) {
      return;
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      const layout = {
        tablePositions,
        tableLabels,
        tableConfigs,
        danceFloorPos,
        danceFloorSize,
        zoom,
        stagePos,
        nextTableId,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('wedding-seating-layout', JSON.stringify(layout));
      
      if (onLayoutChange) {
        onLayoutChange(layout);
      }
      
      console.log('Layout auto-saved');
    }, 500);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
      }, [tablePositions, tableLabels, tableConfigs, danceFloorPos, danceFloorSize, zoom, stagePos, nextTableId, isDraggingTable, onLayoutChange]);

      // Replace the mobile detection useEffect in CanvasChartArea.js
React.useEffect(() => {
  const checkMobile = () => {
    const mobile = window.innerWidth <= 768;
    setIsMobile(mobile);
    
    // Better mobile canvas sizing
    if (mobile) {
      const availableWidth = window.innerWidth - 16; // Account for padding
      const availableHeight = Math.max(window.innerHeight * 0.6, 300); // 60% of screen height
      
      setStageSize({ 
        width: Math.max(availableWidth, 350), // Minimum width for usability
        height: Math.max(availableHeight, 350) // Minimum height
      });
    } else {
      setStageSize({ width: 1200, height: 800 });
    }
  };

  checkMobile();
  window.addEventListener('resize', checkMobile);
  return () => window.removeEventListener('resize', checkMobile);
}, []);

  // HELPER FUNCTIONS
  const snapToGrid = (pos) => ({
    x: Math.round(pos.x / 20) * 20,
    y: Math.round(pos.y / 20) * 20
  });

  const checkCollision = (tableId, newPos, excludeId = null) => {
    for (const [otherId, otherPos] of Object.entries(tablePositions)) {
      if (otherId !== tableId && otherId !== excludeId) {
        const distance = Math.sqrt(
          Math.pow(newPos.x - otherPos.x, 2) + 
          Math.pow(newPos.y - otherPos.y, 2)
        );
        if (distance < 120) {
          return true;
        }
      }
    }
    
    // Check collision with dance floor
    const danceFloorDistance = Math.sqrt(
      Math.pow(newPos.x - danceFloorPos.x, 2) + 
      Math.pow(newPos.y - danceFloorPos.y, 2)
    );
    if (danceFloorDistance < 120) {
      return true;
    }
    
    return false;
  };

  const handleAddTable = () => {
    setShowAddTableMode(true);
    setSelectedTable(null);
    setShowCustomizationPanel(false);
  };

  const handleRemoveTable = (tableId) => {
    const tableConfig = getTableConfig(tableId);
    const tableGuests = assignments.filter(a => a.table === tableId);
    if (tableGuests.length > 0) {
      if (!window.confirm(`${getTableLabel(tableId)} has ${tableGuests.length} guests. Remove table and unassign all guests?`)) {
        return;
      }
      
      tableGuests.forEach(guest => {
        try {
          onRemoveGuest(guest.name);
        } catch (error) {
          console.error(`Failed to remove guest ${guest.name}:`, error);
        }
      });
      
      setTimeout(() => {
        setTablePositions(prev => {
          const newPositions = { ...prev };
          delete newPositions[tableId];
          return newPositions;
        });
        
        setTableLabels(prev => {
          const newLabels = { ...prev };
          delete newLabels[tableId];
          return newLabels;
        });

        setTableConfigs(prev => {
          const newConfigs = { ...prev };
          delete newConfigs[tableId];
          return newConfigs;
        });
        
        setSelectedTable(null);
        setShowCustomizationPanel(false);
        console.log(`${getTableLabel(tableId)} removed successfully`);
      }, 100);
    } else {
      setTablePositions(prev => {
        const newPositions = { ...prev };
        delete newPositions[tableId];
        return newPositions;
      });
      
      setTableLabels(prev => {
        const newLabels = { ...prev };
        delete newLabels[tableId];
        return newLabels;
      });

      setTableConfigs(prev => {
        const newConfigs = { ...prev };
        delete newConfigs[tableId];
        return newConfigs;
      });
      
      setSelectedTable(null);
      setShowCustomizationPanel(false);
      console.log(`Empty ${getTableLabel(tableId)} removed successfully`);
    }
  };

  const handleEditLabel = (tableId) => {
    const currentLabel = getTableLabel(tableId);
    const newLabel = window.prompt(
      `Edit label for Table ${tableId}:\n\nCurrent label: "${currentLabel}"\nEnter new label (or leave empty to reset to default):`, 
      tableLabels[tableId] || ''
    );
    
    if (newLabel !== null) {
      if (newLabel.trim() === '') {
        setTableLabels(prev => {
          const newLabels = { ...prev };
          delete newLabels[tableId];
          return newLabels;
        });
      } else {
        setTableLabels(prev => ({
          ...prev,
          [tableId]: newLabel.trim()
        }));
      }
    }
  };

  const handleCustomizeTable = (tableId) => {
    setCustomizingTableId(tableId);
    setShowCustomizationPanel(true);
    setSelectedTable(tableId);
  };

  const applyTableCustomization = (tableId, config) => {
    const tableGuests = assignments.filter(a => a.table === tableId);
    
    // Check if we need to move guests due to capacity reduction
    if (config.capacity < tableGuests.length) {
      const confirm = window.confirm(
        `New capacity (${config.capacity}) is less than current guests (${tableGuests.length}).\n\n` +
        `${tableGuests.length - config.capacity} guests will be removed from this table.\n\n` +
        `Continue?`
      );
      
      if (!confirm) return;
      
      // Remove excess guests
      const guestsToRemove = tableGuests.slice(config.capacity);
      guestsToRemove.forEach(guest => {
        try {
          onRemoveGuest(guest.name);
        } catch (error) {
          console.error(`Failed to remove guest ${guest.name}:`, error);
        }
      });
    }
    
    // Update table configuration
    setTableConfigs(prev => ({
      ...prev,
      [tableId]: config
    }));
    
    setShowCustomizationPanel(false);
    setCustomizingTableId(null);
    console.log(`${getTableLabel(tableId)} customized: ${config.shape}, size ${config.size}, capacity ${config.capacity}`);
  };

  const handleCanvasClick = (e) => {
    if (showAddTableMode) {
      const stage = e.target.getStage();
      const pointer = stage.getPointerPosition();
      
      const adjustedPointer = {
        x: (pointer.x - stagePos.x) / zoom,
        y: (pointer.y - stagePos.y) / zoom
      };
      
      const snappedPos = snapToGrid(adjustedPointer);
      
      if (checkCollision(null, snappedPos)) {
        alert('Cannot place table here - too close to another object!');
        return;
      }
      
      const newTableId = nextTableId.toString();
      setTablePositions(prev => ({
        ...prev,
        [newTableId]: snappedPos
      }));
      
      // Set the configuration for the new table
      setTableConfigs(prev => ({
        ...prev,
        [newTableId]: { ...newTableConfig }
      }));
      
      setNextTableId(prev => prev + 1);
      setShowAddTableMode(false);
      setGhostTablePos(null);
    } else {
      setSelectedTable(null);
      setShowCustomizationPanel(false);
    }
  };

  const handleMouseMove = (e) => {
    if (showAddTableMode) {
      const stage = e.target.getStage();
      const pointer = stage.getPointerPosition();
      
      const adjustedPointer = {
        x: (pointer.x - stagePos.x) / zoom,
        y: (pointer.y - stagePos.y) / zoom
      };
      
      const snappedPos = snapToGrid(adjustedPointer);
      setGhostTablePos(snappedPos);
    }
  };

  const exportImage = () => {
    const dataURL = stageRef.current.toDataURL({
      mimeType: 'image/png',
      quality: 1,
      pixelRatio: 2
    });
    
    const link = document.createElement('a');
    link.download = `seating_chart_${new Date().toISOString().split('T')[0]}.png`;
    link.href = dataURL;
    link.click();
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.3));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setStagePos({ x: 0, y: 0 });
  };

  const clearSavedLayout = () => {
    if (window.confirm('Reset layout to default positions? This will remove all custom tables and labels.')) {
      isLoadingRef.current = true;
      
      localStorage.removeItem('wedding-seating-layout');
      
      setTablePositions({
        '1': { x: 150, y: 150 },
        '2': { x: 320, y: 150 },
        '3': { x: 490, y: 150 },
        '4': { x: 660, y: 150 },
        '5': { x: 150, y: 310 },
        '6': { x: 320, y: 310 },
        '7': { x: 490, y: 310 },
        '8': { x: 150, y: 470 },
        '9': { x: 320, y: 470 },
        '10': { x: 490, y: 470 },
        '11': { x: 120, y: 630 },
        '12': { x: 240, y: 630 },
        '13': { x: 360, y: 630 },
        '14': { x: 480, y: 630 },
        '15': { x: 600, y: 630 },
        '16': { x: 720, y: 630 }
      });
      setTableLabels({});
      setTableConfigs({});
      setDanceFloorPos({ x: 1060, y: 180 });
      setDanceFloorSize({ width: 180, height: 120 });
      setZoom(1);
      setStagePos({ x: 0, y: 0 });
      setNextTableId(17);
      setSelectedTable(null);
      setShowAddTableMode(false);
      setShowCustomizationPanel(false);
      
      setTimeout(() => {
        isLoadingRef.current = false;
      }, 100);
    }
  };

  const handleWheel = (e) => {
    e.evt.preventDefault();
    
    const scaleBy = 1.1;
    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };
    
    const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const clampedScale = Math.max(0.3, Math.min(3, newScale));
    
    setZoom(clampedScale);
    
    const newPos = {
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    };
    
    setStagePos(newPos);
  };

  const handleTableDragStart = (tableId) => {
    setIsDraggingTable(true);
  };

  const handleTableDragEnd = (tableId, newPosition) => {
    const snappedPos = snapToGrid(newPosition);
    
    if (checkCollision(tableId, snappedPos)) {
      alert('Cannot place table here - too close to another table!');
      setIsDraggingTable(false);
      return;
    }
    
    setTablePositions(prev => ({
      ...prev,
      [tableId]: snappedPos
    }));
    
    setTimeout(() => {
      setIsDraggingTable(false);
    }, 100);
  };

  const handleSweetheartDragEnd = (e) => {
    const newPos = e.target.position();
    setSweetheartPos(newPos);
    
    setTimeout(() => {
      setIsDraggingTable(false);
    }, 100);
  };

  const handleDanceFloorDragEnd = (e) => {
    const newPos = e.target.position();
    setDanceFloorPos(newPos);
    
    setTimeout(() => {
      setIsDraggingTable(false);
    }, 100);
  };

  const handleTableClick = (tableId, guestList) => {
    setSelectedTable(tableId);
  };

  const handleSlotClick = (guestName, fromTableId, toTableId = null) => {
    if (toTableId) {
      const targetTableConfig = getTableConfig(toTableId);
      const currentGuestsInTargetTable = assignments.filter(a => a.table === toTableId).length;
      if (currentGuestsInTargetTable >= targetTableConfig.capacity) {
        alert(`${getTableLabel(toTableId)} is full! (Capacity: ${targetTableConfig.capacity})`);
        return;
      }
      
      onRemoveGuest(guestName);
      setTimeout(() => {
        onDrop({ name: guestName, fromTable: fromTableId }, toTableId);
      }, 100);
    } else {
      onRemoveGuest(guestName);
    }
  };

  const findNearestTable = (x, y) => {
    let nearestTable = null;
    let minDistance = Infinity;
    const maxDistance = 100;
    
    Object.entries(tablePositions).forEach(([tableId, pos]) => {
      const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
      
      if (distance < maxDistance && distance < minDistance) {
        minDistance = distance;
        nearestTable = tableId;
      }
    });
    
    return nearestTable;
  };

  const handleCanvasDrop = (e) => {
    e.preventDefault();
    setDragOverTable(null);
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      const containerRect = e.currentTarget.getBoundingClientRect();
      
      const mouseX = e.clientX - containerRect.left;
      const mouseY = e.clientY - containerRect.top;
      
      const adjustedPointer = {
        x: (mouseX - stagePos.x) / zoom,
        y: (mouseY - stagePos.y) / zoom
      };
      
      const tableId = findNearestTable(adjustedPointer.x, adjustedPointer.y);
      
      if (tableId) {
        const tableConfig = getTableConfig(tableId);
        const currentGuests = assignments.filter(a => a.table === tableId).length;
        if (currentGuests >= tableConfig.capacity) {
          alert(`This table is full! (Capacity: ${tableConfig.capacity})`);
          return;
        }
        
        onDrop(data, tableId);
      }
    } catch (error) {
      console.error('Drop error:', error);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    
    const containerRect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - containerRect.left;
    const mouseY = e.clientY - containerRect.top;
    
    const adjustedPointer = {
      x: (mouseX - stagePos.x) / zoom,
      y: (mouseY - stagePos.y) / zoom
    };
    
    const nearestTable = findNearestTable(adjustedPointer.x, adjustedPointer.y);
    setDragOverTable(nearestTable);
  };

  const handleDragLeave = (e) => {
    setDragOverTable(null);
  };

  const handleStageDragEnd = (e) => {
    if (!isDraggingTable) {
      const newPos = e.target.position();
      setStagePos(newPos);
    }
  };

  // Render the main component
  return (
    <div className="canvas-chart-area" style={{ position: 'relative', height: 'calc(100vh - 100px)', overflow: 'hidden' }}>
      {/* Compact Header */}
     
<div style={{ 
  position: 'sticky',
  top: 0,
  zIndex: 100,
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid rgba(222, 226, 230, 0.5)',
  padding: '0.75rem 1.25rem',
  marginBottom: '1rem',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
}}>
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: '1400px',
    margin: '0 auto'
  }}>
    {/* Left: Title with Status */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div>
        <h3 style={{ 
          margin: 0, 
          fontSize: '1.1rem', 
          fontWeight: '700',
          color: '#495057',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            💺 SeatSaver
          </span>
          <span style={{ 
            fontSize: '0.7rem',
            color: '#6c757d',
            fontWeight: '400',
            marginLeft: '0.5rem'
          }}>
            Layout Designer
          </span>
        </h3>
      </div>
      
      {/* Status Indicators */}
      <div style={{ 
        display: 'flex', 
        gap: '0.75rem',
        alignItems: 'center'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.3rem 0.7rem',
          backgroundColor: '#e8f5e8',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: '600',
          color: '#28a745'
        }}>
          <span style={{ animation: 'pulse 2s infinite' }}>●</span>
          <span>Auto-save ON</span>
        </div>
      </div>
    </div>

    {/* Right: Action Groups */}
    <div style={{ 
      display: 'flex', 
      alignItems: 'center',
      gap: '1rem'
    }}>
      {/* Table Management */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.4rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        border: '1px solid #e9ecef'
      }}>
        <button 
          onClick={handleAddTable} 
          className={`btn ${showAddTableMode ? 'btn-success' : 'btn-primary'}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.5rem 0.9rem',
            backgroundColor: showAddTableMode ? '#28a745' : '#0d6efd',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          }}
        >
          {showAddTableMode ? (
            <>
              <span>📍</span>
              <span>Click to Place</span>
            </>
          ) : (
            <>
              <span>➕</span>
              <span>Add Table</span>
            </>
          )}
        </button>
        
        {showAddTableMode && (
          <button 
            onClick={() => {
              setShowAddTableMode(false);
              setGhostTablePos(null);
            }}
            style={{
              padding: '0.5rem 0.7rem',
              backgroundColor: 'transparent',
              color: '#dc3545',
              border: '1px solid #dc3545',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#dc3545';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#dc3545';
            }}
          >
            Cancel
          </button>
        )}
      </div>

      {/* View Controls */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: '0.3rem',
        padding: '0.4rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        border: '1px solid #e9ecef'
      }}>
        <button 
          onClick={handleZoomOut} 
          style={{
            padding: '0.4rem 0.6rem',
            backgroundColor: 'white',
            border: '1px solid #dee2e6',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.8rem',
            transition: 'all 0.2s ease'
          }}
          title="Zoom Out"
          onMouseEnter={(e) => e.target.style.backgroundColor = '#e9ecef'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
        >
          🔍-
        </button>
        
        <div style={{
          padding: '0.4rem 0.8rem',
          fontSize: '0.75rem',
          fontWeight: '600',
          color: '#495057',
          minWidth: '55px',
          textAlign: 'center',
          backgroundColor: 'white',
          borderRadius: '6px',
          border: '1px solid #dee2e6'
        }}>
          {Math.round(zoom * 100)}%
        </div>
        
        <button 
          onClick={handleZoomIn} 
          style={{
            padding: '0.4rem 0.6rem',
            backgroundColor: 'white',
            border: '1px solid #dee2e6',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.8rem',
            transition: 'all 0.2s ease'
          }}
          title="Zoom In"
          onMouseEnter={(e) => e.target.style.backgroundColor = '#e9ecef'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
        >
          🔍+
        </button>
        
        <button 
          onClick={handleResetZoom} 
          style={{
            padding: '0.4rem 0.6rem',
            backgroundColor: 'white',
            border: '1px solid #dee2e6',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.8rem',
            transition: 'all 0.2s ease'
          }}
          title="Reset View"
          onMouseEnter={(e) => e.target.style.backgroundColor = '#e9ecef'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
        >
          🎯
        </button>
      </div>

      {/* Quick Actions */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <button 
          onClick={clearSavedLayout} 
          style={{
            padding: '0.5rem 0.8rem',
            backgroundColor: 'white',
            color: '#fd7e14',
            border: '1px solid #fd7e14',
            borderRadius: '8px',
            fontSize: '0.75rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          title="Reset Layout"
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#fd7e14';
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'white';
            e.target.style.color = '#fd7e14';
          }}
        >
          🔄 Reset
        </button>
        
        <button 
          onClick={exportImage} 
          style={{
            padding: '0.5rem 0.8rem',
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.75rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          title="Export as Image"
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#138496';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#17a2b8';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          📷 Export
        </button>
      </div>
    </div>
  </div>
</div>

      {/* Main Layout Container */}
      <div style={{ 
  display: 'flex', 
  gap: '1rem', 
  position: 'relative',
  height: '100%',
  overflow: 'hidden'
}}>
        
        {/* Canvas Area */}
        <div 
  style={{ 
    flex: '1',
    position: 'relative',
    minWidth: 0, // Important for flex shrinking
    overflow: 'hidden'
  }}
          onDrop={handleCanvasDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div 
            style={{ 
              border: '2px dashed #ddd', 
              borderRadius: '8px', 
              overflow: 'hidden',
              borderColor: dragOverTable ? '#0d6efd' : '#ddd',
              backgroundColor: dragOverTable ? 'rgba(13, 110, 253, 0.05)' : 'transparent',
              cursor: showAddTableMode ? 'crosshair' : 'default',
              width: '100%',
              height: isMobile ? 'calc(100% - 20px)' : 'auto'
            }}
          >
            <Stage
              width={stageSize.width}
              height={stageSize.height}
              ref={stageRef}
              scaleX={zoom}
              scaleY={zoom}
              x={stagePos.x}
              y={stagePos.y}
              draggable={!isDraggingTable && !showAddTableMode}
              onDragEnd={handleStageDragEnd}
              onWheel={handleWheel}
              onClick={handleCanvasClick}
              onMouseMove={handleMouseMove}
              perfectDrawEnabled={false}
            >
              <Layer>
                <Rect
                  width={stageSize.width}
                  height={stageSize.height}
                  fill="#ffffff"
                />
                
                {/* Grid */}
                {Array.from({ length: Math.ceil(stageSize.width / 20) }).map((_, i) => (
                  <Line
                    key={`grid-v-${i}`}
                    points={[i * 20, 0, i * 20, stageSize.height]}
                    stroke="rgba(0,0,0,0.05)"
                    strokeWidth={1}
                  />
                ))}
                {Array.from({ length: Math.ceil(stageSize.height / 20) }).map((_, i) => (
                  <Line
                    key={`grid-h-${i}`}
                    points={[0, i * 20, stageSize.width, i * 20]}
                    stroke="rgba(0,0,0,0.05)"
                    strokeWidth={1}
                  />
                ))}
                
                {/* Sweetheart Table - REMOVED */}
                
                {/* Dance Floor */}
                <Group 
                  x={danceFloorPos.x} 
                  y={danceFloorPos.y}
                  draggable
                  onDragStart={() => setIsDraggingTable(true)}
                  onDragEnd={handleDanceFloorDragEnd}
                >
                  <Rect
                    width={danceFloorSize.width}
                    height={danceFloorSize.height}
                    fill="#e3f2fd"
                    stroke="#2196f3"
                    strokeWidth={3}
                    cornerRadius={15}
                    offsetX={danceFloorSize.width / 2}
                    offsetY={danceFloorSize.height / 2}
                    shadowBlur={6}
                    shadowColor="rgba(33, 150, 243, 0.4)"
                    shadowOffsetY={3}
                  />
                  <Text
                    text="Dance Floor"
                    fontSize={18}
                    fontFamily="Arial"
                    fontStyle="bold"
                    fill="#1565c0"
                    x={-45}
                    y={-9}
                    shadowBlur={2}
                    shadowColor="rgba(0,0,0,0.3)"
                  />
                  <Text
                    text={`${danceFloorSize.width}×${danceFloorSize.height}`}
                    fontSize={10}
                    fontFamily="Arial"
                    fill="#1976d2"
                    x={-25}
                    y={8}
                    opacity={0.7}
                  />
                </Group>
                
                {/* Ghost table preview when adding */}
                {showAddTableMode && ghostTablePos && (
                  <Group x={ghostTablePos.x} y={ghostTablePos.y}>
                    {newTableConfig.shape === 'circle' ? (
                      <Circle
                        radius={newTableConfig.size}
                        fill="rgba(13, 110, 253, 0.1)"
                        stroke="#0d6efd"
                        strokeWidth={2}
                        dash={[5, 5]}
                      />
                    ) : newTableConfig.shape === 'oval' ? (
                      <Circle
                        radius={newTableConfig.size}
                        fill="rgba(13, 110, 253, 0.1)"
                        stroke="#0d6efd"
                        strokeWidth={2}
                        dash={[5, 5]}
                      />
                    ) : (
                      <Rect
                        width={newTableConfig.shape === 'rectangle' ? newTableConfig.size * 1.6 : newTableConfig.size}
                        height={newTableConfig.shape === 'rectangle' ? newTableConfig.size : newTableConfig.size}
                        offsetX={(newTableConfig.shape === 'rectangle' ? newTableConfig.size * 1.6 : newTableConfig.size) / 2}
                        offsetY={newTableConfig.size / 2}
                        fill="rgba(13, 110, 253, 0.1)"
                        stroke="#0d6efd"
                        strokeWidth={2}
                        dash={[5, 5]}
                        cornerRadius={8}
                      />
                    )}
                    <Text
                      text={`Table ${nextTableId}`}
                      fontSize={14}
                      fontFamily="Arial"
                      fontWeight="bold"
                      fill="#0d6efd"
                      x={-30}
                      y={-8}
                      width={60}
                      align="center"
                      opacity={0.7}
                    />
                    <Text
                      text={`${newTableConfig.shape} • ${newTableConfig.capacity} seats`}
                      fontSize={10}
                      fontFamily="Arial"
                      fill="#0d6efd"
                      x={-50}
                      y={6}
                      width={100}
                      align="center"
                      opacity={0.7}
                    />
                  </Group>
                )}
                
                {/* Tables */}
                {Object.entries(tablePositions).map(([tableId, position]) => (
                  <CanvasTable
                    key={tableId}
                    tableId={tableId}
                    tableLabel={getTableLabel(tableId)}
                    tableConfig={getTableConfig(tableId)}
                    x={position.x}
                    y={position.y}
                    assignments={assignments}
                    allGuests={allGuests}
                    onDragStart={handleTableDragStart}
                    onDragEnd={handleTableDragEnd}
                    onTableClick={handleTableClick}
                    onSlotClick={handleSlotClick}
                    onAddGuest={onAddGuest}
                    isHighlighted={dragOverTable === tableId}
                    isSelected={selectedTable === tableId}
/>
                ))}
              </Layer>
            </Stage>
          </div>
        </div>

        {/* Modern Sidebar Panels */}
        <div style={{ 
  width: '380px', // Increased width for better content fit
  minWidth: '380px', // Prevent shrinking
  display: 'flex', 
  flexDirection: 'column', 
  gap: '1rem',
  maxHeight: '100%',
  overflowY: 'auto', // Enable vertical scrolling
  paddingRight: '8px' // Space for scrollbar
}}>
          
          {/* New Table Configuration Panel (only when adding) */}
          {showAddTableMode && (
            <div style={{ 
              backgroundColor: '#ffffff',
              border: '2px solid #0d6efd',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 12px rgba(13, 110, 253, 0.15)',
              flexShrink: 0
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '1.25rem',
                paddingBottom: '0.75rem',
                borderBottom: '2px solid #e9ecef'
              }}>
                <span style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  color: '#0d6efd',
                  marginRight: '0.5rem'
                }}>
                  🆕
                </span>
                <h4 style={{ margin: 0, color: '#495057', fontSize: '1.1rem' }}>
                  Configure New Table
                </h4>
              </div>
              
              {/* Shape Selection */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ 
                  display: 'block', 
                  fontWeight: '600', 
                  marginBottom: '0.5rem',
                  color: '#495057',
                  fontSize: '0.9rem'
                }}>
                  Shape
                </label>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '0.5rem' 
                }}>
                  {['circle', 'rectangle', 'square', 'oval'].map(shape => (
                    <button
                      key={shape}
                      onClick={() => setNewTableConfig(prev => ({ ...prev, shape }))}
                      style={{
                        padding: '0.75rem',
                        border: `2px solid ${newTableConfig.shape === shape ? '#0d6efd' : '#dee2e6'}`,
                        borderRadius: '8px',
                        backgroundColor: newTableConfig.shape === shape ? '#e7f3ff' : '#ffffff',
                        color: newTableConfig.shape === shape ? '#0d6efd' : '#6c757d',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontWeight: newTableConfig.shape === shape ? '600' : '400',
                        fontSize: '0.85rem',
                        textTransform: 'capitalize'
                      }}
                    >
                      {shape === 'circle' && '⭕'} 
                      {shape === 'rectangle' && '▭'} 
                      {shape === 'square' && '⬜'} 
                      {shape === 'oval' && '⭕'} 
                      <br />
                      {shape}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Color Selection */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ 
                  display: 'block', 
                  fontWeight: '600', 
                  marginBottom: '0.5rem',
                  color: '#495057',
                  fontSize: '0.9rem'
                }}>
                  Background Color
                </label>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(4, 1fr)', 
                  gap: '0.5rem',
                  marginBottom: '0.75rem'
                }}>
                  {[
                    { color: '#f8f9fa', name: 'Default' },
                    { color: '#fff3cd', name: 'Gold' },
                    { color: '#d1ecf1', name: 'Blue' },
                    { color: '#d4edda', name: 'Green' },
                    { color: '#f8d7da', name: 'Pink' },
                    { color: '#e2e3e5', name: 'Gray' },
                    { color: '#fff2e6', name: 'Orange' },
                    { color: '#e6f3ff', name: 'Light Blue' }
                  ].map(({ color, name }) => (
                    <button
                      key={color}
                      onClick={() => setNewTableConfig(prev => ({ ...prev, backgroundColor: color }))}
                      style={{
                        width: '100%',
                        height: '40px',
                        border: `3px solid ${newTableConfig.backgroundColor === color ? '#0d6efd' : '#dee2e6'}`,
                        borderRadius: '8px',
                        backgroundColor: color,
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: '600',
                        color: color === '#f8f9fa' || color === '#fff3cd' || color === '#fff2e6' || color === '#e6f3ff' ? '#495057' : '#333'
                      }}
                      title={name}
                    >
                      {newTableConfig.backgroundColor === color && '✓'}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="color"
                    value={newTableConfig.backgroundColor}
                    onChange={(e) => setNewTableConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
                    style={{
                      width: '40px',
                      height: '40px',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  />
                  <span style={{ fontSize: '0.85rem', color: '#6c757d' }}>
                    Custom Color: {newTableConfig.backgroundColor}
                  </span>
                </div>
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ 
                  display: 'block', 
                  fontWeight: '600', 
                  marginBottom: '0.5rem',
                  color: '#495057',
                  fontSize: '0.9rem'
                }}>
                  Size: {newTableConfig.size}px
                </label>
                <input 
                  type="range" 
                  min="20" 
                  max="80" 
                  value={newTableConfig.size}
                  onChange={(e) => setNewTableConfig(prev => ({ ...prev, size: parseInt(e.target.value) }))}
                  style={{ 
                    width: '100%',
                    height: '6px',
                    borderRadius: '3px',
                    background: '#e9ecef',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                />
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginTop: '0.25rem',
                  fontSize: '0.75rem',
                  color: '#6c757d'
                }}>
                  <span>Small (20)</span>
                  <span>Large (80)</span>
                </div>
              </div>
              
              {/* Capacity Slider */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  fontWeight: '600', 
                  marginBottom: '0.5rem',
                  color: '#495057',
                  fontSize: '0.9rem'
                }}>
                  Capacity: {newTableConfig.capacity} guests
                </label>
                <input 
                  type="range" 
                  min="2" 
                  max="20" 
                  value={newTableConfig.capacity}
                  onChange={(e) => setNewTableConfig(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                  style={{ 
                    width: '100%',
                    height: '6px',
                    borderRadius: '3px',
                    background: '#e9ecef',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                />
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginTop: '0.25rem',
                  fontSize: '0.75rem',
                  color: '#6c757d'
                }}>
                  <span>2 guests</span>
                  <span>20 guests</span>
                </div>
              </div>
              
              {/* Preview */}
              <div style={{ 
                textAlign: 'center',
                padding: '1rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                fontSize: '0.85rem',
                color: '#6c757d'
              }}>
                <div style={{ 
                  width: '60px', 
                  height: '60px', 
                  backgroundColor: newTableConfig.backgroundColor,
                  border: '2px solid #0d6efd',
                  borderRadius: newTableConfig.shape === 'circle' ? '50%' : '8px',
                  margin: '0 auto 0.5rem auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  color: '#495057'
                }}>
                  Preview
                </div>
                <strong>Configuration:</strong><br />
                {newTableConfig.shape} • size {newTableConfig.size} • {newTableConfig.capacity} seats
                <br />
                <small style={{ color: '#0d6efd', marginTop: '0.5rem', display: 'block' }}>
                  💡 Click anywhere on the canvas to place
                </small>
              </div>
            </div>
          )}
          
          {/* Table Selection Panel */}
          {selectedTable && !showAddTableMode && (
            <div style={{ 
              backgroundColor: '#ffffff',
              border: '2px solid #28a745',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 12px rgba(40, 167, 69, 0.15)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '1.25rem',
                paddingBottom: '0.75rem',
                borderBottom: '2px solid #e9ecef'
              }}>
                <span style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  color: '#28a745',
                  marginRight: '0.5rem'
                }}>
                  ✨
                </span>
                <h4 style={{ margin: 0, color: '#495057', fontSize: '1.1rem' }}>
                  {getTableLabel(selectedTable)}
                </h4>
              </div>
              
              {/* Table Info */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: '0.5rem 1rem',
                  fontSize: '0.9rem'
                }}>
                  <span style={{ fontWeight: '600', color: '#6c757d' }}>Shape:</span>
                  <span style={{ textTransform: 'capitalize' }}>{getTableConfig(selectedTable).shape}</span>
                  
                  <span style={{ fontWeight: '600', color: '#6c757d' }}>Size:</span>
                  <span>{getTableConfig(selectedTable).size}px</span>
                  
                  <span style={{ fontWeight: '600', color: '#6c757d' }}>Capacity:</span>
                  <span>{getTableConfig(selectedTable).capacity} guests</span>
                  
                  <span style={{ fontWeight: '600', color: '#6c757d' }}>Background:</span>
                  <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    backgroundColor: getTableConfig(selectedTable).backgroundColor,
                    border: '1px solid #dee2e6',
                    borderRadius: '4px',
                    display: 'inline-block'
                  }} />
                  
                  <span style={{ fontWeight: '600', color: '#6c757d' }}>Current:</span>
                  <span>{assignments.filter(a => a.table === selectedTable).length} guests</span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button 
                  onClick={() => handleEditLabel(selectedTable)} 
                  style={{
                    padding: '0.75rem',
                    border: '2px solid #17a2b8',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    color: '#17a2b8',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#17a2b8';
                    e.target.style.color = '#ffffff';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#ffffff';
                    e.target.style.color = '#17a2b8';
                  }}
                >
                  ✏️ Edit Label
                </button>
                
                <button 
                  onClick={() => handleCustomizeTable(selectedTable)} 
                  style={{
                    padding: '0.75rem',
                    border: '2px solid #fd7e14',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    color: '#fd7e14',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#fd7e14';
                    e.target.style.color = '#ffffff';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#ffffff';
                    e.target.style.color = '#fd7e14';
                  }}
                >
                  🎨 Customize Table
                </button>
                
                <button 
                  onClick={() => handleRemoveTable(selectedTable)} 
                  style={{
                    padding: '0.75rem',
                    border: '2px solid #dc3545',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    color: '#dc3545',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#dc3545';
                    e.target.style.color = '#ffffff';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#ffffff';
                    e.target.style.color = '#dc3545';
                  }}
                >
                  🗑️ Remove Table
                </button>
              </div>
            </div>
          )}
          
          {/* Table Customization Panel */}
          {showCustomizationPanel && customizingTableId && (
            <div style={{ 
              backgroundColor: '#ffffff',
              border: '2px solid #fd7e14',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 12px rgba(253, 126, 20, 0.15)',
              position: 'relative'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '1.25rem',
                paddingBottom: '0.75rem',
                borderBottom: '2px solid #e9ecef'
              }}>
                <span style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  color: '#fd7e14',
                  marginRight: '0.5rem'
                }}>
                  🎨
                </span>
                <h4 style={{ margin: 0, color: '#495057', fontSize: '1.1rem' }}>
                  Customize {getTableLabel(customizingTableId)}
                </h4>
              </div>
              
              <CustomizationForm 
                tableId={customizingTableId}
                currentConfig={getTableConfig(customizingTableId)}
                onApply={applyTableCustomization}
                onCancel={() => {
                  setShowCustomizationPanel(false);
                  setCustomizingTableId(null);
                }}
                assignments={assignments}
              />
            </div>
          )}
          
          {/* Quick Tools Panel */}
          <div style={{ 
            backgroundColor: '#ffffff',
            border: '1px solid #dee2e6',
            borderRadius: '12px',
            padding: '1.25rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
          }}>
            <h5 style={{ 
              margin: '0 0 1rem 0', 
              color: '#495057', 
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{ marginRight: '0.5rem' }}>🛠️</span>
              Quick Tools
            </h5>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button 
                onClick={() => {
                  setDanceFloorSize(prev => ({ 
                    width: Math.min(prev.width + 20, 300), 
                    height: Math.min(prev.height + 15, 200) 
                  }));
                }} 
                style={{
                  padding: '0.5rem',
                  border: '1px solid #6c757d',
                  borderRadius: '6px',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  transition: 'all 0.2s ease'
                }}
                title="Expand Dance Floor"
              >
                🏢+ Floor
              </button>
              
              <button 
                onClick={() => {
                  setDanceFloorSize(prev => ({ 
                    width: Math.max(prev.width - 20, 120), 
                    height: Math.max(prev.height - 15, 80) 
                  }));
                }} 
                style={{
                  padding: '0.5rem',
                  border: '1px solid #6c757d',
                  borderRadius: '6px',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  transition: 'all 0.2s ease'
                }}
                title="Shrink Dance Floor"
              >
                🏢- Floor
              </button>
            </div>
          </div>
          
          {/* Instructions */}
          {!selectedTable && !showAddTableMode && !showCustomizationPanel && (
            <div style={{ 
              backgroundColor: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderRadius: '12px',
              padding: '1.25rem'
            }}>
              <h5 style={{ 
                margin: '0 0 1rem 0', 
                color: '#495057', 
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ marginRight: '0.5rem' }}>💡</span>
                Quick Guide
              </h5>
              
              <div style={{ fontSize: '0.85rem', color: '#6c757d', lineHeight: '1.5' }}>
                <p style={{ margin: '0 0 0.75rem 0' }}>
                  <strong>• Add Tables:</strong> Click "Add Table", configure, then click to place
                </p>
                <p style={{ margin: '0 0 0.75rem 0' }}>
                  <strong>• Select Tables:</strong> Double-click any table to select and customize
                </p>
                <p style={{ margin: '0 0 0.75rem 0' }}>
                  <strong>• Move Elements:</strong> Drag tables, sweetheart table, or dance floor
                </p>
                <p style={{ margin: '0' }}>
                  <strong>• Navigation:</strong> Mouse wheel to zoom, drag canvas to pan
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Customization Form Component
const CustomizationForm = ({ tableId, currentConfig, onApply, onCancel, assignments }) => {
  const [config, setConfig] = useState(currentConfig);
  const tableGuests = assignments.filter(a => a.table === tableId);
  const wouldRemoveGuests = config.capacity < tableGuests.length;

  return (
    <div>
      {/* Shape Selection */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ 
          display: 'block', 
          fontWeight: '600', 
          marginBottom: '0.5rem',
          color: '#495057',
          fontSize: '0.9rem'
        }}>
          Shape
        </label>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '0.5rem' 
        }}>
          {['circle', 'rectangle', 'square', 'oval'].map(shape => (
            <button
              key={shape}
              onClick={() => setConfig(prev => ({ ...prev, shape }))}
              style={{
                padding: '0.75rem',
                border: `2px solid ${config.shape === shape ? '#fd7e14' : '#dee2e6'}`,
                borderRadius: '8px',
                backgroundColor: config.shape === shape ? '#fff3e0' : '#ffffff',
                color: config.shape === shape ? '#fd7e14' : '#6c757d',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: config.shape === shape ? '600' : '400',
                fontSize: '0.85rem',
                textTransform: 'capitalize'
              }}
            >
              {shape === 'circle' && '⭕'} 
              {shape === 'rectangle' && '▭'} 
              {shape === 'square' && '⬜'} 
              {shape === 'oval' && '⭕'} 
              <br />
              {shape}
            </button>
          ))}
        </div>
      </div>
      
      {/* Color Selection */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ 
          display: 'block', 
          fontWeight: '600', 
          marginBottom: '0.5rem',
          color: '#495057',
          fontSize: '0.9rem'
        }}>
          Background Color
        </label>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '0.5rem',
          marginBottom: '0.75rem'
        }}>
          {[
            { color: '#f8f9fa', name: 'Default' },
            { color: '#fff3cd', name: 'Gold' },
            { color: '#d1ecf1', name: 'Blue' },
            { color: '#d4edda', name: 'Green' },
            { color: '#f8d7da', name: 'Pink' },
            { color: '#e2e3e5', name: 'Gray' },
            { color: '#fff2e6', name: 'Orange' },
            { color: '#e6f3ff', name: 'Light Blue' }
          ].map(({ color, name }) => (
            <button
              key={color}
              onClick={() => setConfig(prev => ({ ...prev, backgroundColor: color }))}
              style={{
                width: '100%',
                height: '35px',
                border: `3px solid ${config.backgroundColor === color ? '#fd7e14' : '#dee2e6'}`,
                borderRadius: '6px',
                backgroundColor: color,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                fontWeight: '600',
                color: color === '#f8f9fa' || color === '#fff3cd' || color === '#fff2e6' || color === '#e6f3ff' ? '#495057' : '#333'
              }}
              title={name}
            >
              {config.backgroundColor === color && '✓'}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="color"
            value={config.backgroundColor}
            onChange={(e) => setConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
            style={{
              width: '35px',
              height: '35px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          />
          <span style={{ fontSize: '0.8rem', color: '#6c757d' }}>
            Custom: {config.backgroundColor}
          </span>
        </div>
      </div>
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ 
          display: 'block', 
          fontWeight: '600', 
          marginBottom: '0.5rem',
          color: '#495057',
          fontSize: '0.9rem'
        }}>
          Size: {config.size}px
        </label>
        <input 
          type="range" 
          min="20" 
          max="80" 
          value={config.size}
          onChange={(e) => setConfig(prev => ({ ...prev, size: parseInt(e.target.value) }))}
          style={{ 
            width: '100%',
            height: '6px',
            borderRadius: '3px',
            background: '#e9ecef',
            outline: 'none',
            cursor: 'pointer'
          }}
        />
      </div>
      
      {/* Capacity Slider */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ 
          display: 'block', 
          fontWeight: '600', 
          marginBottom: '0.5rem',
          color: '#495057',
          fontSize: '0.9rem'
        }}>
          Capacity: {config.capacity} guests
        </label>
        <input 
          type="range" 
          min="2" 
          max="20" 
          value={config.capacity}
          onChange={(e) => setConfig(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
          style={{ 
            width: '100%',
            height: '6px',
            borderRadius: '3px',
            background: '#e9ecef',
            outline: 'none',
            cursor: 'pointer'
          }}
        />
        {wouldRemoveGuests && (
          <div style={{ 
            marginTop: '0.5rem',
            padding: '0.5rem',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '4px',
            fontSize: '0.8rem',
            color: '#856404'
          }}>
            ⚠️ This will remove {tableGuests.length - config.capacity} guests from the table
          </div>
        )}
      </div>
      
      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button 
          onClick={() => onApply(tableId, config)}
          style={{
            flex: 1,
            padding: '0.75rem',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: '#fd7e14',
            color: '#ffffff',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.9rem',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#e8690b'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#fd7e14'}
        >
          ✅ Apply Changes
        </button>
        
        <button 
          onClick={onCancel}
          style={{
            flex: 1,
            padding: '0.75rem',
            border: '2px solid #6c757d',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            color: '#6c757d',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.9rem',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#6c757d';
            e.target.style.color = '#ffffff';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#ffffff';
            e.target.style.color = '#6c757d';
          }}
        >
          ❌ Cancel
        </button>
      </div>
    </div>
  );
};

export default CanvasChartArea;