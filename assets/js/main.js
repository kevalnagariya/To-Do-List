// Retrieve tasks from localStorage, or initialize as an empty array if none exists
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// This variable stores the index of the task being edited
let editingIndex = null;

// Initialize the task modal using Bootstrap's modal component
const taskModal = new bootstrap.Modal(document.getElementById('taskModal'));

// Store references to key DOM elements for easy access
const elements = {
    title: document.getElementById('taskTitle'),   // Task title input
    desc: document.getElementById('taskDesc'),     // Task description input
    date: document.getElementById('taskDate'),     // Task due date input
    status: document.getElementById('taskStatus'), // Task status dropdown
    list: document.getElementById('taskList'),     // Container for the task list
    save: document.getElementById('saveTask'),     // Save button inside modal
};

// Function to load tasks from the localStorage and display them in the list
function loadTasks() {
    elements.list.innerHTML = ''; // Clear the current task list
    tasks.forEach((task, index) => {
        // Convert task status to a CSS-compatible class (e.g., 'Complete' becomes 'Complete')
        const statusClass = task.status.replace(/ /g, '-');

        // Check if the task status is 'Complete' to disable the edit button
        const isComplete = task.status === "Complete";

        // Add each task to the task list dynamically using template literals
        elements.list.innerHTML += `
            <div class="col-md-6">
                <div class="card shadow-sm p-3">
                    <h5>${task.title}</h5> <!-- Display task title -->
                    <p>${task.description}</p> <!-- Display task description -->
                    <small class="text-muted">Due: ${task.dueDate}</small> <!-- Display task due date -->
                    <div class="mt-2 d-flex justify-content-between align-items-center">
                        <!-- Display task status with dynamic badge class -->
                        <span class="badge badge-status badge-${statusClass}">${task.status}</span>
                        <div>
                            <!-- Edit button is disabled if the task status is 'Complete' -->
                            <button class="btn btn-sm btn-outline-primary me-2" onclick="editTask(${index})" ${isComplete ? "disabled" : ""}>Edit</button>
                            <!-- Delete button triggers deleteTask function when clicked -->
                            <button class="btn btn-sm btn-outline-danger" onclick="deleteTask(${index})">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

// Reset the form to its default state (empty fields and status 'Incomplete')
function resetForm() {
    elements.title.value = '';
    elements.desc.value = '';
    elements.date.value = '';
    elements.status.value = 'Incomplete'; // Default task status
    editingIndex = null; // Reset editing index
}

// Save task to localStorage and update the UI
function saveTask() {
    const newTask = {
        title: elements.title.value.trim(),      // Task title
        description: elements.desc.value.trim(), // Task description
        dueDate: elements.date.value,            // Task due date
        status: elements.status.value,           // Task status
    };

    // Validate input fields (make sure title, description, and due date are not empty)
    if (!newTask.title || !newTask.description || !newTask.dueDate) {
        alert("Please fill out all fields."); // Show alert if any required fields are missing
        return;
    }

    // If editing an existing task, update it; otherwise, add a new task
    if (editingIndex !== null) {
        tasks[editingIndex] = newTask; // Update task at the editing index
    } else {
        tasks.push(newTask); // Add new task to the array
    }

    // Store updated tasks in localStorage and refresh the UI
    localStorage.setItem('tasks', JSON.stringify(tasks));
    taskModal.hide(); // Close the modal after saving
    resetForm(); // Reset the form
    loadTasks(); // Reload the task list
}

// Function to edit a specific task by index
function editTask(index) {
    const task = tasks[index]; // Get the task by index

    // Populate form fields with task data
    elements.title.value = task.title;
    elements.desc.value = task.description;
    elements.date.value = task.dueDate;
    elements.status.value = task.status;

    // Set the editing index to the current task
    editingIndex = index;

    // Show the task modal for editing
    taskModal.show();
}

// Function to delete a task by index
function deleteTask(index) {
    // Confirm if the user really wants to delete the task
    if (confirm("Are you sure you want to delete this task?")) {
        tasks.splice(index, 1); // Remove the task from the tasks array
        localStorage.setItem('tasks', JSON.stringify(tasks)); // Update localStorage
        loadTasks(); // Reload the task list
    }
}

// Attach event listener to save button
elements.save.addEventListener('click', saveTask);

// Load tasks when the window is loaded
window.onload = loadTasks;
