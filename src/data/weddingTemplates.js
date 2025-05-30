// src/data/weddingTemplates.js
// Wedding Seating Chart Templates for SeatSaver

export const WEDDING_TEMPLATES = {
  intimate_garden: {
    name: "Intimate Garden",
    description: "Perfect for 50-80 guests in a garden or outdoor setting",
    guestCount: "50-80 guests",
    style: "Organic, flowing arrangement with mixed table shapes",
    preview: "🌸",
    data: {
      guests: [{ Name: "Sample Guest", Group: "Unassigned" }],
      assignments: [{ name: "Sample Guest", table: "1" }],
      layout: {
        tablePositions: {
          '1': { x: 400, y: 120 }, '2': { x: 200, y: 250 }, '3': { x: 600, y: 250 }, 
          '4': { x: 120, y: 380 }, '5': { x: 320, y: 400 }, '6': { x: 520, y: 400 }, 
          '7': { x: 720, y: 380 }, '8': { x: 280, y: 550 }, '9': { x: 480, y: 550 }
        },
        tableLabels: {
          '1': 'Head Table', '2': 'Family & Parents', '3': 'Grandparents', '4': 'College Friends',
          '5': 'Work Colleagues', '6': 'Neighbors', '7': 'High School', '8': 'Plus Ones', '9': 'Mixed Group'
        },
        tableConfigs: {
          '1': { shape: 'rectangle', size: 75, capacity: 8, backgroundColor: '#fff3cd' },
          '2': { shape: 'circle', size: 60, capacity: 10, backgroundColor: '#d4edda' },
          '3': { shape: 'circle', size: 60, capacity: 10, backgroundColor: '#d4edda' },
          '4': { shape: 'oval', size: 55, capacity: 8, backgroundColor: '#d1ecf1' },
          '5': { shape: 'circle', size: 55, capacity: 8, backgroundColor: '#d1ecf1' },
          '6': { shape: 'circle', size: 55, capacity: 8, backgroundColor: '#d1ecf1' },
          '7': { shape: 'oval', size: 55, capacity: 8, backgroundColor: '#d1ecf1' },
          '8': { shape: 'square', size: 50, capacity: 6, backgroundColor: '#f8d7da' },
          '9': { shape: 'square', size: 50, capacity: 6, backgroundColor: '#f8d7da' }
        },
        danceFloorPos: { x: 900, y: 300 }, danceFloorSize: { width: 160, height: 120 },
        zoom: 0.85, stagePos: { x: 50, y: 50 }, nextTableId: 10
      },
      timestamp: new Date().toISOString()
    }
  },

  classic_ballroom: {
    name: "Classic Ballroom",
    description: "Traditional formal layout for 100-150 guests",
    guestCount: "100-150 guests",
    style: "Symmetrical, elegant arrangement perfect for hotel ballrooms",
    preview: "🏛️",
    data: {
      guests: [{ Name: "Sample Guest", Group: "Unassigned" }],
      assignments: [{ name: "Sample Guest", table: "1" }],
      layout: {
        tablePositions: {
          '1': { x: 400, y: 100 }, '2': { x: 200, y: 220 }, '3': { x: 400, y: 220 }, '4': { x: 600, y: 220 },
          '5': { x: 150, y: 350 }, '6': { x: 300, y: 350 }, '7': { x: 500, y: 350 }, '8': { x: 650, y: 350 },
          '9': { x: 200, y: 480 }, '10': { x: 350, y: 480 }, '11': { x: 450, y: 480 }, '12': { x: 600, y: 480 },
          '13': { x: 250, y: 610 }, '14': { x: 400, y: 610 }, '15': { x: 550, y: 610 }
        },
        tableLabels: {
          '1': 'Head Table', '2': 'Parents & Family', '3': 'Grandparents', '4': 'Siblings & Spouses',
          '5': 'Wedding Party', '6': 'College Friends', '7': 'Work Colleagues', '8': 'Childhood Friends',
          '9': 'Bride Extended Family', '10': 'Groom Extended Family', '11': 'Neighbors', '12': 'Church Friends',
          '13': 'Plus Ones A', '14': 'Plus Ones B', '15': 'Mixed Group'
        },
        tableConfigs: {
          '1': { shape: 'rectangle', size: 80, capacity: 10, backgroundColor: '#fff3cd' },
          '2': { shape: 'circle', size: 60, capacity: 10, backgroundColor: '#d4edda' },
          '3': { shape: 'circle', size: 60, capacity: 10, backgroundColor: '#d4edda' },
          '4': { shape: 'circle', size: 60, capacity: 10, backgroundColor: '#d4edda' },
          '5': { shape: 'circle', size: 60, capacity: 10, backgroundColor: '#e2e3e5' },
          '6': { shape: 'circle', size: 55, capacity: 10, backgroundColor: '#d1ecf1' },
          '7': { shape: 'circle', size: 55, capacity: 10, backgroundColor: '#d1ecf1' },
          '8': { shape: 'circle', size: 55, capacity: 10, backgroundColor: '#d1ecf1' },
          '9': { shape: 'circle', size: 55, capacity: 10, backgroundColor: '#f8f9fa' },
          '10': { shape: 'circle', size: 55, capacity: 10, backgroundColor: '#f8f9fa' },
          '11': { shape: 'circle', size: 55, capacity: 10, backgroundColor: '#f8f9fa' },
          '12': { shape: 'circle', size: 55, capacity: 10, backgroundColor: '#f8f9fa' },
          '13': { shape: 'circle', size: 50, capacity: 8, backgroundColor: '#f8d7da' },
          '14': { shape: 'circle', size: 50, capacity: 8, backgroundColor: '#f8d7da' },
          '15': { shape: 'circle', size: 50, capacity: 8, backgroundColor: '#f8d7da' }
        },
        danceFloorPos: { x: 850, y: 350 }, danceFloorSize: { width: 200, height: 150 },
        zoom: 0.75, stagePos: { x: 100, y: 80 }, nextTableId: 16
      },
      timestamp: new Date().toISOString()
    }
  },

  rustic_barn: {
    name: "Rustic Barn",
    description: "Casual, warm layout perfect for barn or farm weddings",
    guestCount: "80-120 guests",
    style: "Mix of long tables and rounds for a cozy, family-style feel",
    preview: "🌾",
    data: {
      guests: [{ Name: "Sample Guest", Group: "Unassigned" }],
      assignments: [{ name: "Sample Guest", table: "1" }],
      layout: {
        tablePositions: {
          '1': { x: 400, y: 120 }, '2': { x: 400, y: 280 }, '3': { x: 180, y: 200 }, '4': { x: 620, y: 200 },
          '5': { x: 150, y: 380 }, '6': { x: 650, y: 380 }, '7': { x: 280, y: 480 }, '8': { x: 520, y: 480 },
          '9': { x: 400, y: 580 }, '10': { x: 200, y: 620 }, '11': { x: 600, y: 620 }
        },
        tableLabels: {
          '1': 'Head Table', '2': 'Extended Family', '3': 'Grandparents', '4': 'Parents Friends',
          '5': 'College Gang', '6': 'Work Crew', '7': 'Childhood Friends', '8': 'Neighbors',
          '9': 'Mixed Family', '10': 'Young Cousins', '11': 'Plus Ones'
        },
        tableConfigs: {
          '1': { shape: 'rectangle', size: 75, capacity: 12, backgroundColor: '#fff3cd' },
          '2': { shape: 'rectangle', size: 70, capacity: 14, backgroundColor: '#d4edda' },
          '3': { shape: 'circle', size: 55, capacity: 8, backgroundColor: '#d4edda' },
          '4': { shape: 'circle', size: 55, capacity: 8, backgroundColor: '#d4edda' },
          '5': { shape: 'rectangle', size: 60, capacity: 10, backgroundColor: '#fff2e6' },
          '6': { shape: 'rectangle', size: 60, capacity: 10, backgroundColor: '#fff2e6' },
          '7': { shape: 'circle', size: 55, capacity: 8, backgroundColor: '#d1ecf1' },
          '8': { shape: 'circle', size: 55, capacity: 8, backgroundColor: '#d1ecf1' },
          '9': { shape: 'rectangle', size: 65, capacity: 10, backgroundColor: '#f8f9fa' },
          '10': { shape: 'square', size: 45, capacity: 4, backgroundColor: '#f8d7da' },
          '11': { shape: 'square', size: 45, capacity: 4, backgroundColor: '#f8d7da' }
        },
        danceFloorPos: { x: 900, y: 320 }, danceFloorSize: { width: 180, height: 140 },
        zoom: 0.8, stagePos: { x: 80, y: 40 }, nextTableId: 12
      },
      timestamp: new Date().toISOString()
    }
  },

  modern_minimalist: {
    name: "Modern Minimalist",
    description: "Clean, contemporary layout with geometric precision",
    guestCount: "60-100 guests",
    style: "Geometric arrangement with consistent spacing and modern shapes",
    preview: "⬜",
    data: {
      guests: [{ Name: "Sample Guest", Group: "Unassigned" }],
      assignments: [{ name: "Sample Guest", table: "1" }],
      layout: {
        tablePositions: {
          '1': { x: 400, y: 140 }, '2': { x: 250, y: 280 }, '3': { x: 400, y: 260 }, '4': { x: 550, y: 280 },
          '5': { x: 200, y: 420 }, '6': { x: 350, y: 400 }, '7': { x: 450, y: 400 }, '8': { x: 600, y: 420 },
          '9': { x: 300, y: 540 }, '10': { x: 500, y: 540 }
        },
        tableLabels: {
          '1': 'Head Table', '2': 'Family Circle', '3': 'VIP Table', '4': 'Close Friends',
          '5': 'Generation One', '6': 'Generation Two', '7': 'Work & Career', '8': 'Social Circle',
          '9': 'Extended Network', '10': 'Plus Ones'
        },
        tableConfigs: {
          '1': { shape: 'rectangle', size: 70, capacity: 8, backgroundColor: '#f8f9fa' },
          '2': { shape: 'square', size: 60, capacity: 8, backgroundColor: '#e2e3e5' },
          '3': { shape: 'square', size: 60, capacity: 8, backgroundColor: '#e2e3e5' },
          '4': { shape: 'square', size: 60, capacity: 8, backgroundColor: '#e2e3e5' },
          '5': { shape: 'square', size: 55, capacity: 8, backgroundColor: '#d1ecf1' },
          '6': { shape: 'square', size: 55, capacity: 8, backgroundColor: '#d1ecf1' },
          '7': { shape: 'square', size: 55, capacity: 8, backgroundColor: '#d1ecf1' },
          '8': { shape: 'square', size: 55, capacity: 8, backgroundColor: '#d1ecf1' },
          '9': { shape: 'square', size: 50, capacity: 6, backgroundColor: '#fff2e6' },
          '10': { shape: 'square', size: 50, capacity: 6, backgroundColor: '#fff2e6' }
        },
        danceFloorPos: { x: 800, y: 300 }, danceFloorSize: { width: 150, height: 150 },
        zoom: 0.9, stagePos: { x: 60, y: 60 }, nextTableId: 11
      },
      timestamp: new Date().toISOString()
    }
  },

  small_intimate: {
    name: "Small & Intimate",
    description: "Perfect for micro weddings and intimate gatherings",
    guestCount: "20-40 guests",
    style: "Cozy arrangement fostering conversation and connection",
    preview: "💕",
    data: {
      guests: [{ Name: "Sample Guest", Group: "Unassigned" }],
      assignments: [{ name: "Sample Guest", table: "1" }],
      layout: {
        tablePositions: {
          '1': { x: 400, y: 180 }, '2': { x: 280, y: 320 }, '3': { x: 520, y: 320 },
          '4': { x: 400, y: 460 }, '5': { x: 250, y: 550 }, '6': { x: 550, y: 550 }
        },
        tableLabels: {
          '1': 'Bride & Groom', '2': 'Immediate Family', '3': 'Best Friends',
          '4': 'Extended Family', '5': 'Work Friends', '6': 'Neighbors'
        },
        tableConfigs: {
          '1': { shape: 'oval', size: 60, capacity: 6, backgroundColor: '#fff3cd' },
          '2': { shape: 'circle', size: 60, capacity: 8, backgroundColor: '#d4edda' },
          '3': { shape: 'circle', size: 60, capacity: 8, backgroundColor: '#d1ecf1' },
          '4': { shape: 'circle', size: 55, capacity: 8, backgroundColor: '#f8f9fa' },
          '5': { shape: 'square', size: 50, capacity: 4, backgroundColor: '#f8d7da' },
          '6': { shape: 'square', size: 50, capacity: 4, backgroundColor: '#fff2e6' }
        },
        danceFloorPos: { x: 750, y: 350 }, danceFloorSize: { width: 140, height: 100 },
        zoom: 1.1, stagePos: { x: 0, y: 0 }, nextTableId: 7
      },
      timestamp: new Date().toISOString()
    }
  }
};

// Helper function to get template metadata for display
export const getTemplateMetadata = () => {
  return Object.entries(WEDDING_TEMPLATES).map(([key, template]) => ({
    id: key,
    name: template.name,
    description: template.description,
    guestCount: template.guestCount,
    style: template.style,
    preview: template.preview,
    tableCount: Object.keys(template.data.layout.tablePositions).length
  }));
};