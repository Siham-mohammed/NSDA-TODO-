const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskCategory = document.getElementById("taskCategory");
const taskList = document.getElementById("taskList");

const clearDataBtn = document.getElementById("clearDataBtn");
const themeToggle = document.getElementById("themeToggle");

clearDataBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear everything?")) {
    localStorage.clear();
    location.reload();
  }
});
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark")
    ? "☀️"
    : "🌙";
});

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskText = taskInput.value.trim();
  const category = taskCategory.value;

  if (taskText !== "") {
    addTask(taskText, category);
    taskInput.value = "";
    saveTasks();
  }
});
function addTask(text, category) {
  const taskItem = document.createElement("div");
  taskItem.classList.add("task-item");
  taskItem.setAttribute("data-category", category);
  taskItem.innerHTML = `<span>${text} <small>(${category})</small></span>
    <div class="actions">
    <button class="complete-btn">✅</button>
    <button class="delete-btn">🗑️</button></div>`;
  taskList.appendChild(taskItem);
  updateProgress();
  saveTasks();
}

taskList.addEventListener("click", (e) => {
  const target = e.target;
  const taskItem = target.closest(".task-item");

  if (target.classList.contains("complete-btn")) {
    taskItem.classList.toggle("completed");
    updateProgress();
    saveTasks();
  }
  if (target.classList.contains("delete-btn")) {
    taskItem.remove();
    updateProgress();
    saveTasks();
  }
});

function updateProgress() {
  const allTasks = document.querySelectorAll(".task-item");
  const completedTasks = document.querySelectorAll(".task-item.completed");
  const progressBar = document.querySelector(".progress");
  if (allTasks.length === 0) {
    progressBar.style.width = "0%";
    return;
  }
  const percent = (completedTasks.length / allTasks.length) * 100;
  progressBar.style.width = `${percent}%`;
}

const habitList = document.getElementById("habitList");

let habits = JSON.parse(localStorage.getItem("habits"))||[];
function renderHabits() {
  habitList.innerHTML = "";

  if (habits.length === 0) {
    habitList.innerHTML = "<p>No habits yet. Add one above!</p>";
    return;
  }

  habits.forEach((habit, index) => {
    const div = document.createElement("div");
    div.classList.add("habit-item");

   
    if (habit.progress >= habit.target) {
      div.classList.add("completed");
    }

    let content = `
      <span>${habit.name}: ${habit.progress}/${habit.target}</span>
      <div class="actions">
    `;

    
    if (habit.progress < habit.target) {
      content += `<button class="increment-btn" onclick="updateHabit(${index})">+1</button>`;
    }

   
    content += `<button class="delete-habit-btn" onclick="deleteHabit(${index})">🗑️</button>
      </div>`;

    div.innerHTML = content;
    habitList.appendChild(div);
  });
}

function updateHabit(index) {
  if (habits[index].progress < habits[index].target) {
    habits[index].progress++;
  } 
  localStorage.setItem("habits", JSON.stringify(habits));
  renderHabits();
}

function deleteHabit(index) {
  habits.splice(index, 1);
  localStorage.setItem("habits", JSON.stringify(habits));
  renderHabits();
}


function resetHabitsIfNewWeek() {
  const lastReset = localStorage.getItem("lastReset");
  const now = new Date();
  const currentWeek = getWeekNumber(now);

  if (lastReset !== String(currentWeek)) {
    habits.forEach((h) => (h.progress = 0));
    localStorage.setItem("lastReset", String(currentWeek));
    localStorage.setItem("lastReset", String(currentWeek));
  }
}
const habitForm = document.getElementById("habitForm");
const habitNameInput = document.getElementById("habitName");
const habitTargetInput = document.getElementById("habitTarget");

habitForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = habitNameInput.value.trim();
  const target = parseInt(habitTargetInput.value.trim());

  if (name && target > 0) {
    habits.push({ name, target, progress: 0 });
    localStorage.setItem("habits", JSON.stringify(habits));
    renderHabits();
    habitForm.reset(); 
  }
});

function getWeekNumber(date) {
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - firstDay) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + firstDay.getDay() + 1) / 7);
}

resetHabitsIfNewWeek();
renderHabits();

function saveTasks() {
  localStorage.setItem("tasks", taskList.innerHTML);
}

function loadTasks() {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    taskList.innerHTML = saved;
  }
}
const sidebarItems = document.querySelectorAll(".sidebar li");
sidebarItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    const selected = item.textContent.trim().replace(/[^\w\s]/gi, "").trim();

    sidebarItems.forEach((i) => i.classList.remove("active"));
    item.classList.add("active");
    sidebarItems.forEach((i) => i.classList.remove("active"));
    item.classList.add("active");
    console.log("Sidebar clicked:", selected);

    filterTasks(selected);
    
  });
});

function filterTasks(category) {
  const allTasks = document.querySelectorAll(".task-item");

  allTasks.forEach((task) => {
    const taskCategory = task.getAttribute("data-category");
    if (category === "All" || taskCategory === category) {
      task.style.display = "flex";
    } else {
      task.style.display = "none";
    }
  });
}

loadTasks();
updateProgress();
