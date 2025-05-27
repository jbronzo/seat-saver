# 💺 SeatSaver

**Stress-free wedding seating charts made simple**

SeatSaver is a free, web-based wedding seating chart tool that helps couples plan their perfect reception layout without the stress. Built with React and designed with privacy in mind - all your guest data stays in your browser!

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20SeatSaver-blue?style=for-the-badge)](https://your-vercel-url.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

## ✨ Features

### 🎯 **Easy Guest Management**
- **CSV Import**: Upload your guest list from Excel or Google Sheets
- **Drag & Drop**: Intuitive guest assignment to tables
- **Add On-the-Fly**: Create new guests directly in the app
- **Smart Search**: Find guests quickly as your list grows

### 🎨 **Customizable Tables**
- **Multiple Shapes**: Circle, rectangle, square, and oval tables
- **Custom Sizes**: Adjust table sizes from intimate (2 guests) to large (20 guests)
- **Color Coding**: Choose background colors for easy organization
- **Custom Labels**: Name your tables (Head Table, Family, College Friends, etc.)

### 📱 **Modern Interface**
- **Fully Responsive**: Works perfectly on desktop, tablet, and mobile
- **Touch Friendly**: Optimized for touch interactions
- **Visual Canvas**: Interactive seating chart with zoom and pan
- **Real-time Updates**: See changes instantly as you plan

### 🔒 **Privacy First**
- **No Account Required**: Start using immediately
- **Local Storage**: All data stays in your browser
- **No Server Upload**: Your guest list never leaves your device
- **Offline Ready**: Works without internet after initial load

### 💾 **Save & Export**
- **Auto-Save**: Layout saves automatically to your browser
- **Project Files**: Save complete projects to resume later
- **CSV Export**: Export assignments for your venue
- **Image Export**: High-resolution seating charts for printing
- **Table Summaries**: Detailed breakdowns for planning

## 🚀 Quick Start

### For Wedding Couples

1. **Visit [SeatSaver](https://your-vercel-url.vercel.app)**
2. **Upload your guest list** (CSV format) or use our sample
3. **Drag guests** from the sidebar to table seats
4. **Customize tables** by double-clicking them
5. **Save and export** your perfect seating arrangement!

### CSV Format
Your guest list should be a simple CSV file:
```csv
Name
John Smith
Jane Doe
Mike Johnson
Sarah Wilson
```

## 🛠️ For Developers

### Tech Stack
- **Frontend**: React 18 with Hooks
- **Canvas**: Konva.js for interactive graphics
- **Styling**: CSS3 with responsive design
- **Build**: Create React App
- **Deployment**: Vercel

### Local Development

```bash
# Clone the repository
git clone https://github.com/jbronzo/seat-saver.git
cd seatsaver

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### Project Structure
```
src/
├── components/
│   ├── WeddingSeatingChart.js    # Main app component
│   ├── Sidebar.js                # Guest list and controls
│   ├── CanvasChartArea.js        # Interactive seating canvas
│   ├── CanvasTable.js            # Individual table component
│   ├── WelcomeModal.js           # Getting started guide
│   ├── LandingHeader.js          # Welcome screen
│   └── GuestListItem.js          # Draggable guest component
├── utils/
│   └── fileUtils.js              # Import/export utilities
├── App.js                        # Root component
└── App.css                       # Responsive styles
```

### Key Features Implementation

- **Drag & Drop**: HTML5 drag and drop API with Konva.js canvas
- **Responsive Design**: CSS Grid and Flexbox with mobile-first approach
- **Local Storage**: Browser localStorage for persistence
- **File Operations**: FileReader API for CSV import, Blob API for export
- **Canvas Interactions**: Konva.js for zoomable, pannable seating charts

## 📖 Usage Guide

### Getting Started
1. **Upload Guest List**: CSV file with guest names
2. **Place Tables**: Click "Add Table" and customize as needed
3. **Assign Guests**: Drag names from sidebar to table seats
4. **Customize Layout**: Double-click tables to modify shape, size, capacity
5. **Save Progress**: Use "Save State" to preserve your work
6. **Export Results**: Download CSV assignments or chart images

### Pro Tips
- Start with VIP tables (wedding party, parents) and work outward
- Use color coding to organize table types (family, work, college friends)
- Right-click empty seats to add last-minute guests
- Use the zoom controls for precise positioning
- Save regularly to preserve your work

## 🎯 Roadmap

### Coming Soon
- [ ] **Guest Groups**: Manage families and couples together  
- [ ] **Dietary Restrictions**: Track special meal requirements
- [ ] **Plus-One Management**: Handle uncertain guest counts
- [ ] **Multiple Layouts**: Save different seating arrangements
- [ ] **Venue Templates**: Pre-made layouts for common venues

### Future Ideas
- [ ] **Collaboration**: Share projects with wedding planners
- [ ] **Print Optimization**: Better print layouts and formats
- [ ] **Guest Communication**: Generate place cards and escort cards
- [ ] **Analytics**: Seating arrangement insights and suggestions

## 🤝 Contributing

We welcome contributions! Whether you're fixing bugs, adding features, or improving documentation:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and patterns
- Test on multiple screen sizes and devices
- Ensure accessibility standards are met
- Update documentation for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with love for couples planning their special day
- Inspired by the need for accessible, privacy-focused wedding tools
- Thanks to the React and Konva.js communities for excellent libraries

## 📞 Support

Having issues or suggestions? We'd love to help!

- 🐛 **Bug Reports**: [Open an issue](https://github.com/jbronzo/seat-saver/issues)
- 💡 **Feature Requests**: [Start a discussion](https://github.com/jbronzo-/seatsaver/discussions)
- 📧 **General Questions**: Create an issue with the "question" label

## 🌟 Show Your Support

If SeatSaver helped make your wedding planning easier, please:
- ⭐ **Star this repository**
- 🐦 **Share on social media**
- 💬 **Tell other couples about it**
- 🤝 **Contribute to make it even better**

---

**Made with 💜 for couples everywhere**

*Because your wedding seating should be the least stressful part of planning your big day!*