let tasks = [];

const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const addBtn = document.getElementById("addBtn");
const taskContainer = document.getElementById("taskContainer");
const filterSelect = document.getElementById("filter");

window.onload = function () {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    tasks = JSON.parse(saved);
    renderTasks();
  }
};

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskContainer.innerHTML = "";
  const filter = filterSelect.value;

  tasks
    .filter(task => filter === "all" || task.status === filter)
    .forEach((task, index) => {
      const card = document.createElement("div");
      card.className = "task-card";

      if (task.editing) {
        card.innerHTML = `
          <div class="task-info">
            <input type="text" id="edit-text-${index}" value="${task.text}" />
            <input type="date" id="edit-date-${index}" value="${task.date}" />
            <span class="task-status status-${task.status}">${task.status}</span>
          </div>
          <div class="task-actions">
            <button onclick="saveEdit(${index})">💾</button>
            <button onclick="cancelEdit(${index})">❌</button>
          </div>
        `;
      } else {
        card.innerHTML = `
          <div class="task-info">
            <h3>${task.text}</h3>
            <small>Due: ${task.date || "No date"}</small><br>
            <span class="task-status status-${task.status}">${task.status}</span>
          </div>
          <div class="task-actions">
            <button onclick="editTask(${index})">📝</button>
            <button onclick="changeStatus(${index}, 'completed')">✅</button>
            <button onclick="changeStatus(${index}, 'onprogress')">⏳</button>
            <button onclick="changeStatus(${index}, 'cancelled')">❌</button>
            <button onclick="deleteTask(${index})">🗑️</button>
          </div>
        `;
      }

      taskContainer.appendChild(card);
    });

  saveTasks();
}

addBtn.onclick = function () {
  const text = taskInput.value.trim();
  const date = taskDate.value;

  if (text) {
    tasks.push({ text, date, status: "onprogress" });
    taskInput.value = "";
    taskDate.value = "";
    renderTasks();
  }
};

filterSelect.onchange = renderTasks;

function changeStatus(index, newStatus) {
  tasks[index].status = newStatus;
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

function editTask(index) {
  tasks[index].editing = true;
  renderTasks();
}

function saveEdit(index) {
  const newText = document.getElementById(`edit-text-${index}`).value.trim();
  const newDate = document.getElementById(`edit-date-${index}`).value;

  if (newText) {
    tasks[index].text = newText;
    tasks[index].date = newDate;
    delete tasks[index].editing;
    renderTasks();
  }
}

function cancelEdit(index) {
  delete tasks[index].editing;
  renderTasks();
}
