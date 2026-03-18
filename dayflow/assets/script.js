// Load tasks when page starts
window.onload = function () {
    loadTasks();
};

// Function to add a new task
function addTask() {
    //Get input value
    const input = document.getElementById("taskInput");
    const taskText = input.value;

    //Validade empty input
    if(taskText === "") {
        alert("Digite uma nova tarefa!");
        return;
    }

    //Create list item 
    const li = document.createElement("li");
    li.textContent = taskText;

    //Toggle completed task on click
    li.onclick = function() {
        if(li.style.textDecoration  === "line-through") {
            li.style.textDecoration = "none";
        } else {
            li.style.textDecoration = "line-through"
        }
    };

    //Create delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";

    //Remover task  when clicking delete
    deleteBtn.onclick = function() {
        li.remove();
    };

    //Add delete button inside the task
    li.appendChild(deleteBtn);
    //Add to list
    document.getElementById("taskList").appendChild(li);

    //Clear input
    input.value = "";
}