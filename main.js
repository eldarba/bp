let nextId = 1;
loadTasks();

function loadTasks() {
  let str = localStorage.getItem("tasks");
  if (!str) return;
  tasks = JSON.parse(str);
  tasks.forEach((task) => {
    addTask(task);
  });
}

function saveAllTasks() {
  let tasks = document.getElementsByTagName("input");
  let arr = [];
  for (let index = 0; index < tasks.length; index++) {
    if (tasks[index].value !== null && tasks[index].value !== "") {
      arr.push(tasks[index].value);
    }
  }
  localStorage.setItem("tasks", JSON.stringify(arr));
}

function clearAllTasks() {
  if (confirm("פעולה זאת תמחוק את כל המשימות. להמשיך?")) {
    let tasks = document.getElementById("to-do-list");
    tasks.innerHTML = null;
    localStorage.clear();
  }
}

function deleteTask(button) {
  const taskContainter = button.parentNode;
  taskContainter.parentNode.removeChild(taskContainter);
  saveAllTasks();
}

function dragStarted(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}
// ondragover
function allowDrop(ev) {
  ev.preventDefault();
  ev.target.style.height = "45px";
}
// ondragout
function dragOut(ev) {
  // ev.preventDefault();
  ev.target.style.height = null;
}

function drop(ev) {
  ev.target.style.height = null;
  let elementToDrop = document.getElementById(ev.dataTransfer.getData("text"));
  let elementToDropOn = ev.target.parentNode;
  let position = elementToDrop.compareDocumentPosition(elementToDropOn);
  document
    .getElementById("to-do-list")
    .insertBefore(elementToDrop, elementToDropOn);

  if (position == Node.DOCUMENT_POSITION_FOLLOWING) {
    document
      .getElementById("to-do-list")
      .insertBefore(elementToDropOn, elementToDrop);
  }
  saveAllTasks();
}

function addTask(description, taskElement) {
  // task container
  const newTaskContainter = document.createElement("div");
  newTaskContainter.id = "t" + nextId++;
  newTaskContainter.className = "task-container";
  newTaskContainter.draggable = true;

  newTaskContainter.addEventListener("dragstart", dragStarted);
  newTaskContainter.addEventListener("dragover", allowDrop);
  newTaskContainter.addEventListener("dragleave", dragOut);
  newTaskContainter.addEventListener("drop", drop);

  // delete button
  const deleteButton = document.createElement("button");
  deleteButton.className = "task-bt";
  deleteButton.textContent = "מחק";
  deleteButton.onclick = function () {
    deleteTask(this);
  };
  newTaskContainter.appendChild(deleteButton);

  // input
  const newInput = document.createElement("input");
  newInput.className = "task";
  newInput.type = "text";
  newInput.autocomplete = "off";
  newInput.placeholder = "הכנס משימה";
  newInput.onkeydown = "handleKeyPress";
  newInput.addEventListener("keyup", handleKeyPress);
  if (description) {
    newInput.value = description;
  }
  newTaskContainter.appendChild(newInput);

  if (taskElement) {
    taskElement.insertAdjacentElement("afterend", newTaskContainter);
  } else {
    document.getElementById("to-do-list").appendChild(newTaskContainter);
  }
  newInput.focus();
}

function handleKeyPress(ev) {
  saveAllTasks();
  if (ev.key === "Enter" || ev.keyCode === 13) {
    let taskElement = ev.target.parentNode;
    addTask(undefined, taskElement);
  } else if (
    (ev.key === "Backspace" ||
      ev.keyCode === 8 ||
      ev.key === "Delete" ||
      ev.keyCode === 46) &&
    !ev.target.value
  ) {
    ev.target.parentNode.previousElementSibling.children[1].focus();
    let deleteBtn = ev.target.parentNode.getElementsByTagName("button")[0];
    deleteBtn.click();
  }
}

// window.addEventListener("beforeunload", function (event) {
//   alert("closing");
// });
// window.addEventListener("unload", function (event) {
//   alert("closing");
// });
