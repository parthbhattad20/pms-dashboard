# PMS Dashboard

A simple and intuitive Project Management System (PMS) Dashboard for tracking projects and tasks.

## Features

- **Project Management**: Create, view, and delete projects with status tracking
- **Task Management**: Add tasks associated with projects, set priorities and track progress
- **Real-time Statistics**: View dashboard stats including total projects, active projects, completed projects, and total tasks
- **Local Storage**: All data is stored locally in your browser, no backend required
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/parthbhattad20/pms-dashboard.git
cd pms-dashboard
```

2. Open `index.html` in your web browser

That's it! No build process or dependencies required.

## Usage

### Adding a Project

1. Click the "+ Add Project" button in the Projects section
2. Fill in the project name, description (optional), and select a status
3. Click "Add Project" to save

### Adding a Task

1. Click the "+ Add Task" button in the Tasks section
2. Fill in the task name, select a project, set priority and status
3. Click "Add Task" to save

Note: You must create at least one project before adding tasks.

### Managing Items

- **Delete**: Click the "Delete" button on any project or task card to remove it
- **Status Tracking**: View project and task statuses at a glance with color-coded badges
- **Priority Levels**: Tasks support three priority levels: Low, Medium, and High

## Project Structure

```
pms-dashboard/
├── index.html      # Main HTML structure
├── styles.css      # Styling and layout
├── script.js       # Application logic and functionality
└── README.md       # Documentation
```

## Technologies Used

- HTML5
- CSS3 (with Flexbox and Grid)
- Vanilla JavaScript
- LocalStorage API

## Browser Compatibility

This dashboard works on all modern browsers that support:
- LocalStorage
- ES6 JavaScript
- CSS Grid and Flexbox

## License

This project is open source and available under the MIT License.

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## Author

Parth Bhattad
