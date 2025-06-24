// Optimized CanvasTable.js - Performance improvements for smoother dragging

import React, { useState, useMemo, useCallback } from 'react';
import { Group, Circle, Text, Rect, Ellipse } from 'react-konva';

const CanvasTable = ({ 
  tableId, 
  tableLabel,
  x, 
  y, 
  assignments, 
  allGuests = [],
  onDragStart,
  onDragEnd, 
  onTableClick,
  onSlotClick,
  onAddGuest,
  isHighlighted = false,
  isSelected = false,
  tableConfig = { shape: 'circle', size: 45, capacity: 10, backgroundColor: '#f8f9fa' }
}) => {
  const { shape, size, capacity, backgroundColor } = tableConfig;
  const slotSize = 6;
  const [hoveredSlot, setHoveredSlot] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDoubleClicking, setIsDoubleClicking] = useState(false);
  const [isClickingInfo, setIsClickingInfo] = useState(false);
  const [isClickingSlot, setIsClickingSlot] = useState(false);
  
  // PERFORMANCE: Memoize expensive calculations
  const guestList = useMemo(() => {
    return assignments
      .filter(a => a.table === tableId)
      .map(a => {
        const guestObj = allGuests.find(g => g.Name === a.name);
        return {
          name: a.name,
          group: guestObj ? guestObj.Group : 'Unknown'
        };
      });
  }, [assignments, tableId, allGuests]);
  
  const guestCount = guestList.length;

  // PERFORMANCE: Memoize table dimensions
  const tableDimensions = useMemo(() => {
    switch (shape) {
      case 'rectangle':
        return { width: size * 1.6, height: size, radius: null };
      case 'square':
        return { width: size, height: size, radius: null };
      case 'oval':
        return { width: size * 1.4, height: size * 0.8, radius: null };
      case 'circle':
      default:
        return { width: null, height: null, radius: size };
    }
  }, [shape, size]);

  // PERFORMANCE: Memoize slot positions - only recalculate when shape/size/capacity changes
  const slots = useMemo(() => {
    const slots = [];
    const slotDistance = 15;
    
    switch (shape) {
      case 'rectangle':
      case 'square':
        return generateRectangularSlots();
      case 'oval':
        return generateOvalSlots();
      case 'circle':
      default:
        return generateCircularSlots();
    }

    function generateCircularSlots() {
      const slotRadius = size + slotDistance;
      for (let i = 0; i < capacity; i++) {
        const angle = (i * (360 / capacity)) * (Math.PI / 180);
        const slotX = Math.cos(angle) * slotRadius;
        const slotY = Math.sin(angle) * slotRadius;
        
        slots.push({
          x: slotX,
          y: slotY,
          guest: guestList[i] ? guestList[i].name : null,
          guestGroup: guestList[i] ? guestList[i].group : null,
          index: i
        });
      }
      return slots;
    }

    function generateRectangularSlots() {
      const { width, height } = tableDimensions;
      const perimeter = 2 * (width + height);
      const slotSpacing = perimeter / capacity;
      
      for (let i = 0; i < capacity; i++) {
        const distance = i * slotSpacing;
        let slotX, slotY;
        
        if (distance <= width) {
          slotX = -width/2 + distance;
          slotY = -height/2 - slotDistance;
        } else if (distance <= width + height) {
          slotX = width/2 + slotDistance;
          slotY = -height/2 + (distance - width);
        } else if (distance <= 2 * width + height) {
          slotX = width/2 - (distance - width - height);
          slotY = height/2 + slotDistance;
        } else {
          slotX = -width/2 - slotDistance;
          slotY = height/2 - (distance - 2 * width - height);
        }
        
        slots.push({
          x: slotX,
          y: slotY,
          guest: guestList[i] ? guestList[i].name : null,
          guestGroup: guestList[i] ? guestList[i].group : null,
          index: i
        });
      }
      return slots;
    }

    function generateOvalSlots() {
      const { width, height } = tableDimensions;
      const a = width/2 + slotDistance;
      const b = height/2 + slotDistance;
      
      for (let i = 0; i < capacity; i++) {
        const angle = (i * (360 / capacity)) * (Math.PI / 180);
        const slotX = a * Math.cos(angle);
        const slotY = b * Math.sin(angle);
        
        slots.push({
          x: slotX,
          y: slotY,
          guest: guestList[i] ? guestList[i].name : null,
          guestGroup: guestList[i] ? guestList[i].group : null,
          index: i
        });
      }
      return slots;
    }
  }, [shape, size, capacity, tableDimensions, guestList]);

  // PERFORMANCE: Use useCallback for event handlers to prevent re-renders
  const handleDragStart = useCallback((e) => {
    if (isDoubleClicking || isClickingInfo || isClickingSlot) {
      e.target.stopDrag();
      return;
    }
    setIsDragging(true);
    onDragStart(tableId);
  }, [isDoubleClicking, isClickingInfo, isClickingSlot, onDragStart, tableId]);

  const handleDragEnd = useCallback((e) => {
    if (!isDragging) return;
    
    const newPos = e.target.position();
    onDragEnd(tableId, newPos);
    setIsDragging(false);
  }, [isDragging, onDragEnd, tableId]);

  // PERFORMANCE: Simplify drag handling - remove heavy computations during drag
  const handleDrag = useCallback((e) => {
    // Don't do heavy collision detection during drag - only on drag end
    // This significantly improves performance
  }, []);

  const handleInfoClick = useCallback((e) => {
    setIsClickingInfo(true);
    
    e.cancelBubble = true;
    if (e.evt && e.evt.stopPropagation) {
      e.evt.stopPropagation();
    }
    if (e.evt && e.evt.preventDefault) {
      e.evt.preventDefault();
    }
    
    if (guestCount === 0) {
      alert(`${tableLabel} is empty.\nCapacity: ${capacity} guests\n\nNo guests have been assigned to this table yet.`);
    } else {
      const guestDetails = guestList
        .map(guest => `${guest.name} - ${guest.group || 'Unknown Group'}`)
        .join('\n');
      
      alert(`${tableLabel} guests (${guestCount}/${capacity}):\n\n${guestDetails}`);
    }
    
    setTimeout(() => {
      setIsClickingInfo(false);
    }, 100);
  }, [guestCount, tableLabel, capacity, guestList]);

  const handleTableDoubleClick = useCallback((e) => {
    setIsDoubleClicking(true);
    
    e.cancelBubble = true;
    if (e.evt && e.evt.stopPropagation) {
      e.evt.stopPropagation();
    }
    
    if (e.target && e.target.getStage) {
      const stage = e.target.getStage();
      if (stage) {
        stage.container().style.cursor = 'default';
      }
    }
    
    onTableClick(tableId, []);
    
    setTimeout(() => {
      setIsDoubleClicking(false);
    }, 300);
  }, [onTableClick, tableId]);

  // PERFORMANCE: Memoize common props to reduce re-renders
  const commonShapeProps = useMemo(() => ({
    fill: isSelected ? "#d1f2db" : isHighlighted ? "#e7f3ff" : backgroundColor,
    stroke: isSelected ? "#28a745" : isHighlighted ? "#0a58ca" : "#0d6efd",
    strokeWidth: isHighlighted || isSelected ? 3 : 2,
    shadowBlur: isHighlighted || isSelected ? 8 : 4,
    shadowColor: isSelected ? "rgba(40, 167, 69, 0.3)" : isHighlighted ? "rgba(13, 110, 253, 0.3)" : "rgba(0,0,0,0.1)",
    shadowOffsetY: 2,
    onDblClick: handleTableDoubleClick,
    perfectDrawEnabled: false // PERFORMANCE: Disable perfect drawing
  }), [isSelected, isHighlighted, backgroundColor, handleTableDoubleClick]);

  // PERFORMANCE: Render the appropriate table shape with memoized props
  const renderTableShape = () => {
    switch (shape) {
      case 'rectangle':
      case 'square':
        return (
          <Rect
            width={tableDimensions.width}
            height={tableDimensions.height}
            offsetX={tableDimensions.width / 2}
            offsetY={tableDimensions.height / 2}
            cornerRadius={8}
            {...commonShapeProps}
          />
        );
      case 'oval':
        return (
          <Ellipse
            radiusX={tableDimensions.width / 2}
            radiusY={tableDimensions.height / 2}
            {...commonShapeProps}
          />
        );
      case 'circle':
      default:
        return (
          <Circle
            radius={tableDimensions.radius}
            {...commonShapeProps}
          />
        );
    }
  };

  // PERFORMANCE: Memoize text positions
  const textPos = useMemo(() => {
    switch (shape) {
      case 'rectangle':
      case 'square':
        return { x: -tableDimensions.width/3, y: -8, width: tableDimensions.width * 2/3 };
      case 'oval':
        return { x: -tableDimensions.width/3, y: -8, width: tableDimensions.width * 2/3 };
      case 'circle':
      default:
        return { x: -30, y: -8, width: 60 };
    }
  }, [shape, tableDimensions]);

  const countPos = useMemo(() => {
    switch (shape) {
      case 'rectangle':
      case 'square':
        return { x: 0, y: tableDimensions.height/2 + 25 };
      case 'oval':
        return { x: 0, y: tableDimensions.height/2 + 25 };
      case 'circle':
      default:
        return { x: 0, y: size + 30 };
    }
  }, [shape, tableDimensions, size]);

  const infoPos = useMemo(() => {
    switch (shape) {
      case 'rectangle':
      case 'square':
        return { x: -tableDimensions.width/2 - 15, y: -tableDimensions.height/2 - 15 };
      case 'oval':
        return { x: -tableDimensions.width/2 - 15, y: -tableDimensions.height/2 - 15 };
      case 'circle':
      default:
        return { x: -size - 10, y: -size - 10 };
    }
  }, [shape, tableDimensions, size]);

  return (
    <Group
      x={x}
      y={y}
      draggable={!isDoubleClicking && !isClickingInfo && !isClickingSlot}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragMove={handleDrag} // PERFORMANCE: Simplified drag handler
      perfectDrawEnabled={false} // PERFORMANCE: Disable perfect drawing
    >
      {/* Selection ring */}
      {isSelected && (
        <Group perfectDrawEnabled={false}>
          {shape === 'circle' ? (
            <Circle
              radius={size + 8}
              fill="transparent"
              stroke="#28a745"
              strokeWidth={3}
              dash={[5, 5]}
              shadowBlur={8}
              shadowColor="rgba(40, 167, 69, 0.5)"
              perfectDrawEnabled={false}
            />
          ) : shape === 'oval' ? (
            <Ellipse
              radiusX={tableDimensions.width/2 + 8}
              radiusY={tableDimensions.height/2 + 8}
              fill="transparent"
              stroke="#28a745"
              strokeWidth={3}
              dash={[5, 5]}
              shadowBlur={8}
              shadowColor="rgba(40, 167, 69, 0.5)"
              perfectDrawEnabled={false}
            />
          ) : (
            <Rect
              width={tableDimensions.width + 16}
              height={tableDimensions.height + 16}
              offsetX={(tableDimensions.width + 16) / 2}
              offsetY={(tableDimensions.height + 16) / 2}
              cornerRadius={12}
              fill="transparent"
              stroke="#28a745"
              strokeWidth={3}
              dash={[5, 5]}
              shadowBlur={8}
              shadowColor="rgba(40, 167, 69, 0.5)"
              perfectDrawEnabled={false}
            />
          )}
        </Group>
      )}
      
      {/* Main table shape */}
      {renderTableShape()}
      
      {/* Table label */}
      <Text
        text={tableLabel}
        fontSize={14}
        fontFamily="Arial"
        fontWeight="bold"
        fill="#333"
        x={textPos.x}
        y={textPos.y}
        width={textPos.width}
        align="center"
        shadowBlur={2}
        shadowColor="rgba(255,255,255,0.8)"
        shadowOffsetY={1}
        onDblClick={handleTableDoubleClick}
        listening={true}
        perfectDrawEnabled={false}
      />
      
      {/* Guest count */}
      <Group perfectDrawEnabled={false}>
        <Circle
          x={countPos.x}
          y={countPos.y}
          radius={15}
          fill="rgba(255,255,255,0.95)"
          stroke={isSelected ? "#28a745" : "#0d6efd"}
          strokeWidth={2}
          shadowBlur={3}
          shadowColor="rgba(0,0,0,0.2)"
          shadowOffsetY={1}
          perfectDrawEnabled={false}
        />
        <Text
          text={`${guestCount}/${capacity}`}
          fontSize={guestCount === capacity ? 9 : 10}
          fontFamily="Arial"
          fontWeight="bold"
          fill={isSelected ? "#28a745" : "#0d6efd"}
          x={countPos.x - 15}
          y={countPos.y - 4}
          width={30}
          align="center"
          perfectDrawEnabled={false}
        />
      </Group>
      
      {/* STEP 1: Render all guest slots first (WITHOUT tooltips) */}
{!isDragging && slots.map((slot, index) => (
  <Group key={index} perfectDrawEnabled={false}>
    <Circle
      x={slot.x}
      y={slot.y}
      radius={slotSize + 4}
      fill="transparent"
      onClick={(e) => handleSlotLeftClick(e, index, slot.guest)}
      onTap={(e) => handleSlotLeftClick(e, index, slot.guest)}
      onContextMenu={(e) => handleSlotRightClick(e, index, slot.guest)}
      onMouseEnter={() => setHoveredSlot(index)}
      onMouseLeave={() => setHoveredSlot(null)}
      perfectDrawEnabled={false}
    />
    
    <Circle
      x={slot.x}
      y={slot.y}
      radius={slotSize}
      fill={slot.guest ? 
        (hoveredSlot === index ? "#0a58ca" : "#0d6efd") : 
        (hoveredSlot === index ? "#28a745" : "#ffffff")}
      stroke={slot.guest ? 
        (hoveredSlot === index ? "#ffffff" : "#0d6efd") :
        (hoveredSlot === index ? "#ffffff" : "#28a745")}
      strokeWidth={hoveredSlot === index ? 3 : 2}
      shadowBlur={hoveredSlot === index ? 4 : 2}
      shadowColor={hoveredSlot === index ? 
        (slot.guest ? "rgba(10, 88, 202, 0.4)" : "rgba(40, 167, 69, 0.4)") : 
        "rgba(0,0,0,0.1)"}
      listening={false}
      perfectDrawEnabled={false}
    />
    
    {/* Guest initial letter */}
    {slot.guest && (
      <Text
        text={slot.guest.charAt(0).toUpperCase()}
        fontSize={9}
        fontFamily="Arial"
        fontWeight="bold"
        fill="white"
        x={slot.x - 4}
        y={slot.y - 5}
        shadowBlur={1}
        shadowColor="rgba(0,0,0,0.7)"
        listening={false}
        perfectDrawEnabled={false}
      />
    )}
  </Group>
))}

{/* STEP 2: Render tooltip AFTER all slots - so it appears on top */}
{!isDragging && hoveredSlot !== null && slots[hoveredSlot] && (
  <Group perfectDrawEnabled={false}>
    <Rect
      x={slots[hoveredSlot].x - 100}  // Wider
      y={slots[hoveredSlot].y - 45}
      width={200}                     // Much wider
      height={35}                     // Simpler height
      fill="rgba(0,0,0,0.9)"
      cornerRadius={6}
      shadowBlur={4}
      shadowColor="rgba(0,0,0,0.5)"
      shadowOffsetY={2}
      perfectDrawEnabled={false}
    />
    <Text
      text={slots[hoveredSlot].guest ? 
        `${slots[hoveredSlot].guest} • Left Click: Move | Right Click: Remove` : 
        "Right-click: Add guest | Drag from sidebar"
      }
      fontSize={10}
      fontFamily="Arial"
      fill="white"
      x={slots[hoveredSlot].x - 95}
      y={slots[hoveredSlot].y - 38}
      width={190}
      align="center"
      perfectDrawEnabled={false}
    />
  </Group>
)}

{/* Info icon */}
<Text
  text="ℹ️"
  fontSize={14}
  x={infoPos.x}
  y={infoPos.y}
  onClick={handleInfoClick}
  onTap={handleInfoClick}
  listening={true}
  perfectDrawEnabled={false}
/>
</Group>
);

// Simplified slot click handlers (keeping the same logic but optimized)
function handleSlotLeftClick(e, slotIndex, guest) {
  e.cancelBubble = true;
  if (e.evt && e.evt.stopPropagation) {
    e.evt.stopPropagation();
    e.evt.stopImmediatePropagation();
  }
  
  if (e.evt && e.evt.button !== 0) return;
  
  setIsClickingSlot(true);
  
  if (guest) {
    const moveToTable = window.prompt(
      `Move ${guest} to which table?\nEnter a table number (e.g., 1, 2, 3...)\nCurrent table: ${tableId}`
    );
    
    if (moveToTable && moveToTable !== tableId) {
      onSlotClick(guest, tableId, moveToTable);
    }
  }
  
  setTimeout(() => setIsClickingSlot(false), 200);
}

function handleSlotRightClick(e, slotIndex, guest) {
  e.evt.preventDefault();
  e.evt.stopPropagation();
  e.evt.stopImmediatePropagation();
  e.cancelBubble = true;
  
  setIsClickingSlot(true);
  
  if (guest) {
    const action = window.confirm(`${guest} is assigned to ${tableLabel}.\n\nClick OK to REMOVE from table.\nClick Cancel to keep guest here.`);
    if (action) {
      onSlotClick(guest, tableId);
    }
  } else {
    const newGuestName = window.prompt(
      `Add a new guest to ${tableLabel}?\n\nEnter the guest's name:\n(This will create a new guest and assign them to this table)`
    );
    
    if (newGuestName && newGuestName.trim()) {
      const trimmedName = newGuestName.trim();
      
      const existingGuest = assignments.find(a => 
        a.name.toLowerCase() === trimmedName.toLowerCase()
      );
      
      if (existingGuest) {
        alert(`Guest "${trimmedName}" already exists and is assigned to Table ${existingGuest.table}.`);
        setIsClickingSlot(false);
        return;
      }
      
      if (guestCount >= capacity) {
        alert(`${tableLabel} is already full! (${guestCount}/${capacity})`);
        setIsClickingSlot(false);
        return;
      }
      
      if (onAddGuest) {
        onAddGuest(trimmedName, tableId);
      }
    }
  }
  
  setTimeout(() => setIsClickingSlot(false), 200);
}
};

export default CanvasTable;