const tasks = []; ///tareas
let time = 0; ///tiempo transcurrido
let timer = null; ///tiempo total
let timerBreak = null; ///descanso de 5 min
let current = null; ///tarea actual

const bAdd = document.querySelector("#bAdd"); ///break add
const itTask = document.querySelector("#itTask"); ///name de la tarea
const form = document.querySelector("#form"); ///formulario
const taskName = document.querySelector("#time #taskname");

renderTime()
renderTasks()


form.addEventListener("submit", (e) => {
  e.preventDefault(); ///prevent default pausa el envio del formulario para
  ///primero pasarlo por una validacion
  if (itTask.value != "") {
    createTask(itTask.value);
    itTask.value = ""; ///limpiamos el formulario
    renderTasks();
  }
});

function createTask(value) {
  const newTask = {
    id: (Math.random() * 100).toString(36).slice(3),
    title: value,
    completed: false,
  };
  tasks.unshift(newTask); ///agrega un elemento al inicio del array
}

function renderTasks() {
  const html = tasks.map((task) => {
    return `
          <div class="task">
          <div class="completed">${
            task.completed
              ? "<span class='done'>Done</span>"
              : `<button class="start-button" data-id="${task.id}">Start</button></div>`
          }
              <div class="title">${task.title}</div>
          </div>`;
  });

  const tasksContainer = document.querySelector("#tasks");
  tasksContainer.innerHTML = html.join("");

  const startButtons = document.querySelectorAll(".task .start-button"); ///retorna varios objetos que cumplen con los parametros,
  ///en este caso retorna que sean de id task y id startbutton

  startButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      if (!timer) {
        const id = button.getAttribute("data-id"); ///si no hay algun timer activo...
        startButtonHandler(id);
        button.textContent = "in Progress...";
      }
    });
  });
}

function startButtonHandler(id) {
  time = 5;
  current = id;
  const taskIndex = tasks.findIndex((task) => task.id === id);
  taskName.textContent = tasks[taskIndex].title;

  ///setinterval ejecuta una funcion constantemente hasta detenerla manualmente
  ///settimeout ejecuta una funcion luego de cierto tiempo

  timer = setInterval(() => {
    timerHandler(id);
  }, 1000);
}

function timerHandler(id) {
  time--;
  renderTime();

  if (time === 0) {
    clearInterval(timer);
    markCompleted(id);
    timer = null
    renderTasks();
    startBreak();
  }
}

function startBreak() {
  time = 3;
  taskName.textContent = "Break!";
  timerBreak = setInterval(() => {
    timerBreakHandler();
  }, 1000);
}

function timerBreakHandler() {
  time--;
  renderTime();

  if (time === 0) {
    clearInterval(timerBreak);
    current = null
    timerBreak = null
    taskName.textContent = ''
    renderTasks();
  }
}

function renderTime() {
  const timeDiv = document.querySelector("#time #value");
  const minutes = parseInt(time / 60); ///round
  const seconds = parseInt(time % 60);

  timeDiv.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
}

function markCompleted(id) {
  const taskIndex = tasks.findIndex((task) => task.id === id);
  tasks[taskIndex].completed = true;
}
