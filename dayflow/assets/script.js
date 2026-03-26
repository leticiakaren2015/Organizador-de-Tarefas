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

    // Get the values of the new properties
    const priority = document.getElementById("taskPriority").value;
    const category = document.getElementById("taskCategory").value;
    const dueDate = document.getElementById("taskDueDate").value;
    const reminder = document.getElementById("taskReminder").value;

    // Create the task on the screen
    createTaskElement(taskText, false, priority, category, dueDate, reminder);
    // Salve the task on localStorage
    saveTask(taskText, false, priority, category, dueDate, reminder);

    // Clears the from fields
    document.getElementById("taskInput").value = "";
    document.getElementById("taskCategory").value = "";
    document.getElementById("taskDueDate").value = "";
    document.getElementById("taskReminder").value = "";
}


// Load tasks from localStorage and display them
function loadTasks() {
    // Get tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    // For each task, create on screen
    tasks.forEach(task => {
        createTaskElement(task.text, task.completed, task.priority, task.category, task.dueDate, task.reminder);
    });
}


// Create task on screen
function createTaskElement(taskText, completed, priority, category, dueDate, reminder) {
    // Create element <li>
    const li = document.createElement("li");

    // Add priority the class to the element
    li.classList.add(priority);

    // Stores task information as attributes of the <li>
    li.dataset.text = taskText;
    li.dataset.priority = priority;
    li.dataset.category = category;
    li.dataset.dueDate = dueDate;
    li.dataset.reminder = reminder;

    // Add task content
    li.innerHTML = `<strong>[${priority}]</strong> ${taskText} 
    <em>(${category})</em>
    <span> | Prazo: ${dueDate || '-'} </span>
    <span> | Lembrete: ${reminder || '-'} </span>`;
    
    // If completed, add the class 'completed'
    if(completed) li.classList.add("completed");

    // Toggle completed by clicking
    li.onclick = function () {
        completed = !completed; // Toggle between true or false
        li.classList.toggle("completed");
        updateTasks(); // Update storage
    };

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";

    deleteBtn.onclick = function(event) {
        event.stopPropagation(); // Prevents the click from going up to the li
        li.remove();
        updateTasks(); // Update storage
    };

        // Add button of task delete
    li.appendChild(deleteBtn);

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️"; 
    editBtn.onclick = function(event) {
        event.stopPropagation(); // Prevent toggle completed
        editarTarefa(li); //Calls the edit function
    }

    // Add button of task edit
    li.appendChild(editBtn);
    
    // Add on visible list
    document.getElementById("taskList").appendChild(li);
}


// Save a single task to localStorage
function saveTask( taskText, completed, priority, category, dueDate, reminder) {
    // Retrieve previously saved tasks 
    let  tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    // Add the new task to the list
    tasks.push({ text: taskText, completed, priority, category, dueDate, reminder, notified: false});
    // Salves back to localStorage 
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update all tasks in localStorage
function updateTasks() {
    let tasks = [];

    // Get all tasks from the screen
    document.querySelectorAll("#taskList li").forEach(li => {
        // Retrieves all task information stored in the attributes of <li>
        const text = li.dataset.text;
        const priority = li.dataset.priority;
        const category = li.dataset.category;
        const dueDate = li.dataset.dueDate;
        const reminder = li.dataset.reminder;

        // Add  the task to the array
        tasks.push({text, completed: li.classList.contains("completed"), priority, category, dueDate, reminder});

    });
    // Save everything again
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// Function to organize tasks by priority
function organizarDia() {
    // Retrieve tasks from localStorage 
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Define the order of priorities
    const ordem = { alta: 3, media: 2, baixa: 1 };

    // Organize the tasks
    tasks.sort((a, b) => ordem[b.priority] - ordem[a.priority]);

    //Clean the list from the screen
    document.getElementById("taskList").innerHTML = "";

    // Recreate thee tasks in the correct order
    tasks.forEach(task => {
        createTaskElement(
            task.text, task.completed, task.priority, task.category, task.dueDate, task.reminder
        );
    });

    // Salve the new order
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// Function task edit
function editarTarefa(li) {
    // Get current values
    let taskText = li.dataset.text;
    let priority = li.dataset.priority;
    let category = li.dataset.category;
    let dueDate = li.dataset.dueDate;
    let reminder = li.dataset.reminder;

    // Prompt user for new values
    const newText = prompt("Editar tarefa:", taskText) || taskText;
    const newPriority = prompt("Editar prioridade (baixa, media, alta):", priority) || priority;
    const newCategory = prompt("Editar categoria:",category) || category;
    const newDueDate = prompt("Editar prazo (AAAA-MM-DD):", dueDate) || dueDate;
    const newReminder = prompt("Editar lembrete (HH:MM):", reminder) || reminder;

    // Update dateset
    li.dataset.text = newText;
    li.dataset.priority = newPriority;
    li.dataset.category = newCategory;
    li.dataset.dueDate = newDueDate;
    li.dataset.reminder = newReminder;

    // Reset notify flag for reminders
    li.dataset.notify = "false";

    // Update visual content
    li.innerHTML =`<strong>[${newPriority}]</strong> ${newText}
    <em>(${newCategory})</em>
    <strong>| Prazo: ${newDueDate || '-'}</strong>
    <strong> | Lembrete: ${newReminder || '-'}</strong>`;

    // Re-add buttons (delete and edit)
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.onclick = function(event) {
        event.stopPropagation();
        li.remove();
        updateTasks();
    };

    li.appendChild(deleteBtn);

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.onclick = function(event) {
        event.stopPropagation();
        editarTarefa(li);
    };

    li.appendChild(editBtn);

    // Update localStorage
    updateTasks();
}


// Function to automatically check task reminders
function verificarLembretes() {

    //Retrieve tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Get the current time
    const now =new Date();
    const currentTime = now.toTimeString().slice(0, 5);

    // Check each task for a reminder
    tasks.forEach(task => {
        
        // If the reminder time matches the current time
        if (task.reminder && task.reminder === currentTime && task.notify !== true) {

            // Show reminder alert
            alert(`⏰ Reminder: ${task.text}`);

            // Mark reminder as shown
            task.notify = true; // Mark as notified
        }
    });
}

// Run the reminder checker every 60 seconds
setInterval(verificarLembretes, 60000);