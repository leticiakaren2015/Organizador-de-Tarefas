// Load tasks when page starts
window.onload = function () {
    loadTasks();
};

// Function to add a new task
function addTask() {
    //Get input value
    const input = document.getElementById("taskInput");
    const taskText = input.value;

    // Validade empty input
    if(taskText === "") {
        alert("Digite uma nova tarefa!");
        return;
    };

    // Call the function that creates the element on the screen
    createTaskElement(taskText, false);
    // The rescue I'll be doing in the next step
    saveTask(taskText, false);

    input.value = ""
}

// Load tasks from localStorage and display them
function loadTasks() {
    // Get tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    // For each task, create on screen
    tasks.forEach(task => {
        createTaskElement(task.text, task.completed)
    });
}

// Create task on screen
function createTaskElement(taskText, completed) {
    const li = document.createElement("li");
        li.textContent = taskText;
        
        // Mark as completed if necessary
        if(completed) {
            li.style.textDecoration = "line-through";
        };

        // Toggle completed by clicking
        li.onclick = function () {
            completed = !completed; // Toggle between true or false
            li.style.textDecoration = completed ? "line-through" : "none";
            updateTasks(); // Update storage
        };

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑️";

        deleteBtn.onclick = function() {
            li.remove();
            updateTasks(); // Update storage
        };

        li.appendChild(deleteBtn);
        
        // Add on visible list
        document.getElementById("taskList").appendChild(li);
}

// Save a single task to localStorage
function saveTask( taskText, completed) {
    // Retrieve previously saved tasks from your browser
    let  tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    // Add the new task to the list
    tasks.push({ text: taskText, completed: completed});
    //
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update all tasks in localStorage
function updateTasks() {
    let tasks = [];
    // Get all tasks from the screen
    document.querySelectorAll("#taskList li").forEach(li => {
        tasks.push({
            text: li.firstChild.textContent,
            completed: li.firstChild.textContent === "line-through"
        });
    });
    // Save everything again
    localStorage.setItem("tasks", JSON.stringify(tasks));
}