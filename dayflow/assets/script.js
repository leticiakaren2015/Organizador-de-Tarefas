// Global state: this will store all tasks in memory
let tasks = [];

// Entry point: runs when the page finishes loading
window.onload = function () {
    loadTasks(); // load data into memory
    renderTasks(); // Render UI from state
};


// Responsible ONLY for loading data into the global state
function loadTasks() {
    try {
        // Load tasks from localStorage into global array
        tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    } catch {
        // Fallback in JSON is corrupted
        tasks = [];
    }

    // Debug: confirm tasks are loaded
    console.log("Tasks loaded", tasks);
}


// Responsible for rendering all tasks fro the global state to the DOM
function renderTasks() {
    const list = document.getElementById("taskList");
    
    // Clear current UI
    list.innerHTML = "";

    // Loop through all tasks in memory
    tasks.forEach((task) => {
        const li = document.createElement("li");

        // Apply priority class
        li.classList.add(task.priority);

        // Apply completed state
        if (task.completed) {
            li.classList.add("completed");
        }

        // Create content safely
        const span = document.createElement ("span");
        span.textContent = 
        `[${task.priority}] ${task.text} (${task.category}) | ` +
        `Prazo: ${task.dueDate || '-'} | ` + 
        `Lembrete: ${task.reminder || '-'}`;

        li.appendChild(span);

        // Toggle complete only when clicking the list item itself
        li.addEventListener("click", () => {
            // Find the  correct task using id instead of index
            const t = tasks.find(t => t.id === task.id);
            if (!t) return;
            t.completed = !t.completed;
            saveTasks();
        });

        // Delete button
        const delBtn = document.createElement("button");
        delBtn.textContent = "🗑️";

        delBtn.onclick = (e) => {
            e.stopPropagation();
            // Remove task using id
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
        };

        li.appendChild(delBtn);

        // Create edit button
        const editBtn = document.createElement("button");
        editBtn.textContent = "✏️";

        // Edit task based on state (NOT DOM)
        editBtn.onclick = (e) => {
            e.stopPropagation();

            // Find index safely using id
            const i = tasks.findIndex(t => t.id === task.id);
            if (i === -1) return;

            const currentTask = tasks[i];

            // Prompt user for new values
            const newText = prompt("Editar tarefa:", currentTask.text) || currentTask.text;
            const newPriority = prompt("Prioridade (baixa, media, alta):", currentTask.priority) || currentTask.priority;
            const newCategory = prompt("Categoria:", currentTask.category) || currentTask.category;
            const newDueDate = prompt("Prazo (YYYY-MM-DD):", currentTask.dueDate) || currentTask.dueDate;
            const newReminder = prompt("Lembrete (HH:MM):", currentTask.reminder) || currentTask.reminder;

            
            tasks[i] = {
                ...currentTask,
                text: newText,
                priority: newPriority,
                category: newCategory,
                dueDate: newDueDate,
                reminder: newReminder,
                notified : false
            };

            // Save and re-render
            saveTasks();
        };

        li.appendChild(editBtn);


        list.appendChild(li);
    });
}


// Responsible for saving state and re-rendering UI
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks(); // Always re-render after state change
}


// Function to add a new task
function addTask() {
    //Get input value
    const input = document.getElementById("taskInput");
    const taskText = input.value;

    // Validade empty or whitespace-only input
    if (!taskText.trim()) {
        alert("Digite uma nova tarefa!");
        return;
    };

    // Create a new task object (single source of truth)
    const newTask = {
        id: crypto.randomUUID(),
        text: taskText,
        priority: document.getElementById("taskPriority").value,
        category: document.getElementById("taskCategory").value,
        dueDate: document.getElementById("taskDueDate").value,
        reminder: document.getElementById("taskReminder").value,
        completed: false,
        notified: false
    };

    // Add task to global state
    tasks.push(newTask);

    // Salve and re-render UI
    saveTasks();
    
    // Clears  from inputs
    input.value = "";
    document.getElementById("taskCategory").value = "";
    document.getElementById("taskDueDate").value = "";
    document.getElementById("taskReminder").value = "";
}


// Function to organize tasks by priority
function organizarDia() {
    // Define priority order
    const ordem = { alta: 3, media: 2, baixa:1 };

    // Sort tasks in memory
    tasks.sort((a, b) => ordem[b.priority] - ordem[a.priority]);

    // Save and re-render UI
    saveTasks();
}


// Function to automatically check task reminders
function verificarLembretes() {

    // Use global state instead of reloading
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);

    // Flag to track if any reminder was triggered
    let updated = false;

    // Check each task for a reminder
    tasks.forEach(task => {
        
        // Check reminder and avoid duplicate alerts
        if (task.reminder && task.reminder === currentTime && !task.notified) {

            alert(`⏰ Reminder: ${task.text}`);
            task.notified = true; // Mark as notified
            updated = true;
        }
    });

    // Persist only if something changed
    if (updated) {
        saveTasks();
    }
}

// Run the reminder checker every 60 seconds
setInterval(verificarLembretes, 60000);