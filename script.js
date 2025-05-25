// ******************************************************
// 1. creating used variables & selecting ui elements.  *
// 2. synching storage with app data.                   *
// 3. displaying stored data.                           *
// 4. handling add, check, edit and delete task events. *
// ******************************************************
// app variable
let app = [
  {
    content: "Hello world!",
    timeStamp: 1747576149578,
    isChecked: true,
  },
];
const appKey = "todo's170525";
// ui elements
const addButtonForTask = document.querySelector("#task-add-button");
const textareaForTask = document.querySelector("textarea");
const errorForTask = document.querySelector("#textarea-error");
const containerForTask = document.querySelector("#tasks-container");

// app logic
function updateStorageData() {
  localStorage.setItem(appKey, JSON.stringify(app));
}
// updating app with stored taskmc
if (localStorage.getItem(appKey)) {
  app = JSON.parse(localStorage.getItem(appKey));
}

// tasks display method definition
function displayTasks() {
  // handling empty task situation
  containerForTask.innerHTML = `<span id="empty-tasks-label">Ooops nothing found!</span>`;
  document.querySelector("#empty-tasks-label").style.display = "none";
  if (!app.length) {
    document.querySelector("#empty-tasks-label").style.display = "block";
    return;
  }

  // utility function for converting html string to html element
  function createTaskElement() {
    const htmlParser = new DOMParser();
    return htmlParser.parseFromString(
      `<div class="task-card">
          <input type="checkbox" id="task-checkbox" />
          <label for="task-checkbox">
          </label>
          <div class="buttons-container">
            <p class="time">&#128336; <span></span></p>
            <div>
              <button class="edit">&#9998; edit</button>
              <button class="delete">&#128465; delete</button>
            </div>
          </div>
        </div>`,
      "text/html"
    ).body.firstChild;
  }

  //   converting tasks into taskComponents
  const tasksList = app.map((task) => {
    const taskComponent = createTaskElement();
    const taskContentElement = taskComponent.querySelector("label");
    const taskInputElement = taskComponent.querySelector("input");
    const taskEditButton = taskComponent.querySelector("button.edit");
    const taskDeleteButton = taskComponent.querySelector("button.delete");
    const { content, timeStamp, isChecked } = task;

    // placing task content into taskComponent
    taskContentElement.textContent = content;
    const time = new Date(timeStamp).toString().slice(0, 21);
    taskComponent.querySelector("span").textContent = time;
    if (isChecked) {
      taskInputElement.checked = true;
      taskInputElement.disabled;
      taskContentElement.style.textDecoration = "line-through";
      taskContentElement.style.opacity = "var(--checked-opacity)";
    }

    // attaching identity keys
    taskComponent.setAttribute("task-key", `task${timeStamp}`);
    taskInputElement.setAttribute("task-key", `task${timeStamp}`);
    taskEditButton.setAttribute("task-key", `task${timeStamp}`);
    taskDeleteButton.setAttribute("task-key", `task${timeStamp}`);

    // attaching task events like checkTask, editTask, deleteTask
    taskInputElement.addEventListener("click", (checkTaskEvent) => {
      const { target } = checkTaskEvent;
      const key = target.getAttribute("task-key");
      const task = app.find((task) => `task${task.timeStamp}` === key);

      if (task && task.isChecked) return;

      task.isChecked = true;
      updateStorageData();
      displayTasks();
    });
    taskDeleteButton.addEventListener("click", (deleteTaskEvent) => {
      const { currentTarget } = deleteTaskEvent;
      const key = currentTarget.getAttribute("task-key");
      app = app.filter((task) => `task${task.timeStamp}` !== key);
      updateStorageData();
      displayTasks();
    });
    taskEditButton.addEventListener("click", (editTaskEvent) => {
      const { currentTarget } = editTaskEvent;
      const key = currentTarget.getAttribute("task-key");
      const task = app.find((task) => `task${task.timeStamp}` === key);
      app.pop(task);
      textareaForTask.value = task.content;
      updateStorageData();
      displayTasks();
    });

    return taskComponent;
  });

  // display task components
  tasksList.forEach((task) => containerForTask.append(task));
}

// initial tasks components displaying
displayTasks();

// app main feature implementing
addButtonForTask.addEventListener("click", (addTaskEvent) => {
  const userInput = textareaForTask.value.trim();
  // handling empty user input
  errorForTask.style.display = "hidden";
  if (!userInput.length) {
    errorForTask.style.display = "block";
    setTimeout(function () {
      errorForTask.style.display = "none";
    }, 1500);
    return;
  }
  textareaForTask.value = "";
  // storing task
  app.unshift({
    timeStamp: Date.now(),
    content: userInput,
    isChecked: false,
  });
  // display task elements
  updateStorageData();
  displayTasks();
});
