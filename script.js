// Data storage
let projects = [];
let tasks = [];

// Load data from localStorage
function loadData() {
    const savedProjects = localStorage.getItem('pms_projects');
    const savedTasks = localStorage.getItem('pms_tasks');
    
    if (savedProjects) {
        projects = JSON.parse(savedProjects);
    }
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('pms_projects', JSON.stringify(projects));
    localStorage.setItem('pms_tasks', JSON.stringify(tasks));
}

// Initialize the dashboard
function init() {
    loadData();
    updateStats();
    renderProjects();
    renderTasks();
    updateProjectDropdown();
}

// Update statistics
function updateStats() {
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const totalTasks = tasks.length;

    document.getElementById('totalProjects').textContent = totalProjects;
    document.getElementById('activeProjects').textContent = activeProjects;
    document.getElementById('completedProjects').textContent = completedProjects;
    document.getElementById('totalTasks').textContent = totalTasks;
}

// Render projects
function renderProjects() {
    const projectsList = document.getElementById('projectsList');
    
    if (projects.length === 0) {
        projectsList.innerHTML = '<div class="empty-state">No projects yet. Click "Add Project" to get started!</div>';
        return;
    }
    
    projectsList.innerHTML = projects.map((project, index) => `
        <div class="project-card">
            <h3>${project.name}</h3>
            <p>${project.description || 'No description'}</p>
            <span class="status-badge ${project.status}">${formatStatus(project.status)}</span>
            <button class="delete-btn" onclick="deleteProject(${index})">Delete</button>
        </div>
    `).join('');
}

// Render tasks
function renderTasks() {
    const tasksList = document.getElementById('tasksList');
    
    if (tasks.length === 0) {
        tasksList.innerHTML = '<div class="empty-state">No tasks yet. Click "Add Task" to get started!</div>';
        return;
    }
    
    tasksList.innerHTML = tasks.map((task, index) => `
        <div class="task-card">
            <h3>${task.name}</h3>
            <p>Project: ${getProjectName(task.projectId)}</p>
            <div>
                <span class="status-badge ${task.status}">${formatStatus(task.status)}</span>
                <span class="priority-badge ${task.priority}">${task.priority.toUpperCase()}</span>
            </div>
            <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
        </div>
    `).join('');
}

// Helper function to get project name by ID
function getProjectName(projectId) {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
}

// Helper function to format status
function formatStatus(status) {
    return status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// Show add project modal
function showAddProjectModal() {
    document.getElementById('projectModal').style.display = 'block';
}

// Close project modal
function closeProjectModal() {
    document.getElementById('projectModal').style.display = 'none';
    document.getElementById('projectForm').reset();
}

// Show add task modal
function showAddTaskModal() {
    if (projects.length === 0) {
        alert('Please create a project first before adding tasks!');
        return;
    }
    document.getElementById('taskModal').style.display = 'block';
}

// Close task modal
function closeTaskModal() {
    document.getElementById('taskModal').style.display = 'none';
    document.getElementById('taskForm').reset();
}

// Update project dropdown in task form
function updateProjectDropdown() {
    const taskProject = document.getElementById('taskProject');
    taskProject.innerHTML = '<option value="">Select a project</option>' + 
        projects.map(project => `<option value="${project.id}">${project.name}</option>`).join('');
}

// Add project
document.getElementById('projectForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const project = {
        id: Date.now(),
        name: document.getElementById('projectName').value,
        description: document.getElementById('projectDescription').value,
        status: document.getElementById('projectStatus').value
    };
    
    projects.push(project);
    saveData();
    updateStats();
    renderProjects();
    updateProjectDropdown();
    closeProjectModal();
});

// Add task
document.getElementById('taskForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const task = {
        id: Date.now(),
        name: document.getElementById('taskName').value,
        projectId: parseInt(document.getElementById('taskProject').value),
        priority: document.getElementById('taskPriority').value,
        status: document.getElementById('taskStatus').value
    };
    
    tasks.push(task);
    saveData();
    updateStats();
    renderTasks();
    closeTaskModal();
});

// Delete project
function deleteProject(index) {
    if (confirm('Are you sure you want to delete this project?')) {
        const projectId = projects[index].id;
        projects.splice(index, 1);
        // Also delete associated tasks
        tasks = tasks.filter(task => task.projectId !== projectId);
        saveData();
        updateStats();
        renderProjects();
        renderTasks();
        updateProjectDropdown();
    }
}

// Delete task
function deleteTask(index) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks.splice(index, 1);
        saveData();
        updateStats();
        renderTasks();
    }
}

// Close modals when clicking outside
window.onclick = function(event) {
    const projectModal = document.getElementById('projectModal');
    const taskModal = document.getElementById('taskModal');
    
    if (event.target === projectModal) {
        closeProjectModal();
    }
    if (event.target === taskModal) {
        closeTaskModal();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
