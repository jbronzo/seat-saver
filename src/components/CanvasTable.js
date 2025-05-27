import React, { useState } from 'react';
import { Group, Circle, Text, Rect, Ellipse } from 'react-konva';

const CanvasTable = ({ 
  tableId, 
  tableLabel,
  x, 
  y, 
  assignments, 
  allGuests = [], // Add allGuests prop to access group information
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
  
  // Get guests assigned to this table with their group information
  const guestList = assignments
    .filter(a => a.table === tableId)
    .map(a => {
      // Find the guest object to get their group
      const guestObj = allGuests.find(g => g.Name === a.name);
      return {
        name: a.name,
        group: guestObj ? guestObj.Group : 'Unknown'
      };
    });
  
  const guestCount = guestList.length;

  // Calculate dimensions based on shape and size
  const getTableDimensions = () => {
    switch (shape) {
      case 'rectangle':
        return {
          width: size * 1.6,
          height: size,
          radius: null
        };
      case 'square':
        return {
          width: size,
          height: size,
          radius: null
        };
      case 'oval':
        return {
          width: size * 1.4,
          height: size * 0.8,
          radius: null
        };
      case 'circle':
      default:
        return {
          width: null,
          height: null,
          radius: size
        };
    }
  };

  const tableDimensions = getTableDimensions();

  // Generate positions for guest slots based on shape and capacity
  const generateSlotPositions = () => {
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
  };

  const slots = generateSlotPositions();

  const handleDragStart = (e) => {
    if (isDoubleClicking || isClickingInfo || isClickingSlot) {
      e.target.stopDrag();
      return;
    }
    setIsDragging(true);
    onDragStart(tableId);
  };

  const handleDragEnd = (e) => {
    if (!isDragging) return;
    
    const newPos = e.target.position();
    onDragEnd(tableId, newPos);
    setIsDragging(false);
  };

  const handleInfoClick = (e) => {
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
    // Format guest list with groups
    const guestDetails = guestList
      .map(guest => `${guest.name} - ${guest.group || 'Unknown Group'}`)
      .join('\n');
    
    alert(`${tableLabel} guests (${guestCount}/${capacity}):\n\n${guestDetails}`);
  }
  
  setTimeout(() => {
    setIsClickingInfo(false);
  }, 100);
};

  const handleTableDoubleClick = (e) => {
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
  };

  const handleSlotLeftClick = (e, slotIndex, guest) => {
    e.cancelBubble = true;
    if (e.evt && e.evt.stopPropagation) {
      e.evt.stopPropagation();
      e.evt.stopImmediatePropagation();
    }
    
    if (e.evt && e.evt.button !== 0) return;
    
    setIsClickingSlot(true);
    
    if (guest) {
      const moveToTable = window.prompt(
        `Move ${guest} to which table?\n` +
        `Enter a table number (e.g., 1, 2, 3...)\n` +
        `Current table: ${tableId}`
      );
      
      if (moveToTable && moveToTable !== tableId) {
        onSlotClick(guest, tableId, moveToTable);
      }
    }
    
    setTimeout(() => {
      setIsClickingSlot(false);
    }, 200);
  };

  const handleSlotRightClick = (e, slotIndex, guest) => {
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
        `Add a new guest to ${tableLabel}?\n\n` +
        `Enter the guest's name:\n` +
        `(This will create a new guest and assign them to this table)`
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
    
    setTimeout(() => {
      setIsClickingSlot(false);
    }, 200);
  };

  // Render the appropriate table shape
  const renderTableShape = () => {
    const commonProps = {
      fill: isSelected ? "#d1f2db" : isHighlighted ? "#e7f3ff" : backgroundColor,
      stroke: isSelected ? "#28a745" : isHighlighted ? "#0a58ca" : "#0d6efd",
      strokeWidth: isHighlighted || isSelected ? 3 : 2,
      shadowBlur: isHighlighted || isSelected ? 8 : 4,
      shadowColor: isSelected ? "rgba(40, 167, 69, 0.3)" : isHighlighted ? "rgba(13, 110, 253, 0.3)" : "rgba(0,0,0,0.1)",
      shadowOffsetY: 2,
      onDblClick: handleTableDoubleClick
    };

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
            {...commonProps}
          />
        );
      case 'oval':
        return (
          <Ellipse
            radiusX={tableDimensions.width / 2}
            radiusY={tableDimensions.height / 2}
            {...commonProps}
          />
        );
      case 'circle':
      default:
        return (
          <Circle
            radius={tableDimensions.radius}
            {...commonProps}
          />
        );
    }
  };

  // Calculate text positioning based on shape
  const getTextPosition = () => {
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
  };

  const textPos = getTextPosition();

  // Calculate guest count position based on shape
  const getCountPosition = () => {
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
  };

  const countPos = getCountPosition();

  // Calculate info icon position based on shape
  const getInfoPosition = () => {
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
  };

  const infoPos = getInfoPosition();

  return (
    <Group
      x={x}
      y={y}
      draggable={!isDoubleClicking && !isClickingInfo && !isClickingSlot}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Selection ring */}
      {isSelected && (
        <Group>
          {shape === 'circle' ? (
            <Circle
              radius={size + 8}
              fill="transparent"
              stroke="#28a745"
              strokeWidth={3}
              dash={[5, 5]}
              shadowBlur={8}
              shadowColor="rgba(40, 167, 69, 0.5)"
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
        style={{ cursor: 'move' }}
        listening={true}
      />
      
      {/* Guest count */}
      <Group>
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
        />
      </Group>
      
      {/* Guest slots */}
      {slots.map((slot, index) => (
        <Group key={index}>
          <Circle
            x={slot.x}
            y={slot.y}
            radius={slotSize + 4}
            fill="transparent"
            onClick={(e) => handleSlotLeftClick(e, index, slot.guest)}
            onTap={(e) => handleSlotLeftClick(e, index, slot.guest)}
            onContextMenu={(e) => handleSlotRightClick(e, index, slot.guest)}
            onMouseDown={(e) => {
              e.cancelBubble = true;
              if (e.evt) {
                e.evt.stopPropagation();
                e.evt.stopImmediatePropagation();
              }
              setIsClickingSlot(true);
              
              setTimeout(() => {
                setIsClickingSlot(false);
              }, 100);
            }}
            onMouseEnter={() => setHoveredSlot(index)}
            onMouseLeave={() => setHoveredSlot(null)}
            style={{ cursor: slot.guest ? 'pointer' : 'copy' }}
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
          />
          
          {/* Enhanced tooltip with group information */}
          {hoveredSlot === index && (
            <Group>
              <Rect
                x={slot.x - 75}
                y={slot.y - (slot.guest ? 55 : 55)}
                width={150}
                height={slot.guest ? 42 : 42}
                fill="rgba(0,0,0,0.9)"
                cornerRadius={4}
                shadowBlur={4}
                shadowColor="rgba(0,0,0,0.5)"
                shadowOffsetY={2}
              />
              {slot.guest ? (
                <>
                  <Text
                    text={slot.guest}
                    fontSize={11}
                    fontFamily="Arial"
                    fontWeight="bold"
                    fill="white"
                    x={slot.x - 72}
                    y={slot.y - 48}
                    width={144}
                    align="center"
                  />
                  <Text
                    text={slot.guestGroup || 'Unknown Group'}
                    fontSize={9}
                    fontFamily="Arial"
                    fill="#cccccc"
                    x={slot.x - 72}
                    y={slot.y - 36}
                    width={144}
                    align="center"
                  />
                  <Text
                    text="Left-click: Move • Right-click: Remove"
                    fontSize={8}
                    fontFamily="Arial"
                    fill="#aaaaaa"
                    x={slot.x - 72}
                    y={slot.y - 24}
                    width={144}
                    align="center"
                  />
                </>
              ) : (
                <>
                  <Text
                    text="Empty Seat"
                    fontSize={11}
                    fontFamily="Arial"
                    fontWeight="bold"
                    fill="#28a745"
                    x={slot.x - 72}
                    y={slot.y - 48}
                    width={144}
                    align="center"
                  />
                  <Text
                    text="Right-click to add new guest"
                    fontSize={9}
                    fontFamily="Arial"
                    fill="#cccccc"
                    x={slot.x - 72}
                    y={slot.y - 36}
                    width={144}
                    align="center"
                  />
                  <Text
                    text="or drag existing guest here"
                    fontSize={8}
                    fontFamily="Arial"
                    fill="#aaaaaa"
                    x={slot.x - 72}
                    y={slot.y - 24}
                    width={144}
                    align="center"
                  />
                </>
              )}
            </Group>
          )}

          {slot.guest ? (
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
            />
          ) : (
            hoveredSlot === index && (
              <Text
                text="+"
                fontSize={12}
                fontFamily="Arial"
                fontWeight="bold"
                fill="white"
                x={slot.x - 4}
                y={slot.y - 6}
                shadowBlur={1}
                shadowColor="rgba(0,0,0,0.7)"
                listening={false}
              />
            )
          )}
        </Group>
      ))}
      
      {/* Info icon */}
      <Text
        text="ℹ️"
        fontSize={14}
        x={infoPos.x}
        y={infoPos.y}
        onClick={handleInfoClick}
        onTap={handleInfoClick}
        style={{ cursor: 'pointer' }}
        listening={true}
      />
    </Group>
  );
};

export default CanvasTable;