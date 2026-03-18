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

