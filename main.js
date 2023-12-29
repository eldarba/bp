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
    let tasks = document.getElementById("todo-list");
    tasks.innerHTML = null;
    localStorage.clear();
  }
}

function deleteTask(button) {
  const taskContainter = button.parentNode;
  // save done task history
  const the_input = taskContainter.getElementsByTagName("input")[0];
  const taskTxt = the_input.value;
  if (taskTxt != null && taskTxt != "") {
    const taskObj = new Task(taskTxt);
    const historyJson = localStorage.getItem("history");
    let taskHistoryArr;
    if (historyJson != null) {
      taskHistoryArr = JSON.parse(historyJson);
      taskHistoryArr.push(taskObj);
    } else {
      taskHistoryArr = [taskObj];
    }
    localStorage.setItem("history", JSON.stringify(taskHistoryArr));
    //
  }
  taskContainter.parentNode.removeChild(taskContainter);
  saveAllTasks();
}

class Task {
  constructor(txt) {
    this.txt = txt;
    this.date = new Date();
  }
}

function showHistory() {
  const historyJson = localStorage.getItem("history");
  if (historyJson != null) {
    const history = JSON.parse(historyJson);
    history.sort((t1, t2) => {
      t1.date - t2.date;
    });
    let tBody = document.getElementById("tab-history");
    tBody.innerHTML = null;
    history.forEach((t) => {
      let tr = document.createElement("tr");
      let tdTask = document.createElement("td");
      tdTask.innerText = t.txt;
      let tdDate = document.createElement("td");
      t.date = new Date(t.date);
      let tdTime = document.createElement("td");
      tdTime.innerText = t.date.toLocaleTimeString();
      tdDate.innerText = t.date.toLocaleDateString();
      tr.appendChild(tdDate);
      tr.appendChild(tdTime);
      tr.appendChild(tdTask);
      tBody.appendChild(tr);
    });
  }
  // let historyList = document.getElementById("history-list");
  // historyList.innerHTML = historyJson;

  document.getElementById("show-history").style.display = null;
  document.getElementById("show-tasks").style.display = "none";
}

function clearTaskHistory() {
  if (confirm("כל ההיסטוריה תימחק. להמשיך?")) {
    localStorage.removeItem("history");
    document.getElementById("tab-history").innerHTML = null;
  }
}

function showTasks() {
  document.getElementById("show-history").style.display = "none";
  document.getElementById("show-tasks").style.display = null;
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
  console.dir(ev.target.nodeName);
  console.dir(ev.target.parentNode.id);
  console.dir(ev.dataTransfer.getData("text"));

  if (
    ev.target.nodeName == "BUTTON" &&
    ev.target.parentNode.id == ev.dataTransfer.getData("text")
  ) {
    ev.target.click();
    return;
  }

  ev.target.style.height = null;
  let elementToDrop = document.getElementById(ev.dataTransfer.getData("text"));
  let elementToDropOn = ev.target.parentNode;
  let position = elementToDrop.compareDocumentPosition(elementToDropOn);
  document
    .getElementById("todo-list")
    .insertBefore(elementToDrop, elementToDropOn);

  if (position == Node.DOCUMENT_POSITION_FOLLOWING) {
    document
      .getElementById("todo-list")
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
  deleteButton.className = "done-bt";
  deleteButton.textContent = "בוצע";
  deleteButton.title = "המשימה תועבר לארכיון משימות שבוצעו";
  deleteButton.onclick = function () {
    deleteTask(this);
  };
  // deleteButton.addEventListener("dragover", allowDrop);
  //   deleteButton.addEventListener("drop", function () {
  //     deleteButton.click();
  //   });

  // input
  const newInput = document.createElement("input");
  newInput.className = "task-input";
  newInput.type = "text";
  newInput.autocomplete = "off";
  newInput.placeholder = "הכנס משימה";
  newInput.title = "הזז למטה או למעלה";
  newInput.onkeydown = "handleKeyPress";
  newInput.addEventListener("keyup", handleKeyPress);
  if (description) {
    newInput.value = description;
  }
  newTaskContainter.appendChild(deleteButton);
  newTaskContainter.appendChild(newInput);

  if (taskElement) {
    taskElement.insertAdjacentElement("afterend", newTaskContainter);
  } else {
    document.getElementById("todo-list").appendChild(newTaskContainter);
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
    ev.target.parentNode.previousElementSibling?.children[1].focus();
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
