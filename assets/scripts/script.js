const addTask = document.querySelector("#button");
const showPopup = document.querySelector("#popup");
const closePopup = document.querySelector(".popup__header_close");
const buttonCancel = document.querySelector(".button_cancel");
const buttonOk = document.querySelector(".button_ok");
const table = document.querySelector("table");
const modalInputs = document.querySelectorAll(".field");
const allTasks = [];
const errorText = document.querySelector(".error_text");
const tabsName = document.querySelectorAll("[data-tab-name]");
const activeTab = document.querySelector(".nav-link.active");

if (localStorage.getItem("toDoList")) {
  const savedTasksFromStorage = JSON.parse(localStorage.getItem("toDoList"));
  savedTasksFromStorage.forEach((task) => allTasks.push(task));
  drawTable("new");
} else {
  savedTasksFromStorage = [];
}

addTask.addEventListener("click", (e) => {
  e.preventDefault();
  let editId = null;
  showPopup.style.display = "block";
  modalInputs[0].classList.remove("invalid");
  errorText.style.display = "none";
  clearForm();
});

closePopup.addEventListener("click", () => {
  showPopup.style.display = "none";
});

buttonCancel.addEventListener("click", (e) => {
  e.preventDefault();
  showPopup.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target == showPopup) {
    showPopup.style.display = "none";
  }
});

buttonOk.addEventListener("click", (e) => {
  e.preventDefault();

  const newTask = {
    task: "",
    description: "",
    priority: "",
  };

  Object.keys(newTask).forEach((value) => {
    let field = document.querySelector(`[name = '${value}']`);
    newTask[value] = field.value;
  });

  if (newTask.id) {
    allTasks.splice(numId, 1, newTask);
    // console.log(numId, editId);
    newTask.id = editId;
    newTask.status = "new";
    showPopup.style.display = "none";
  } else {
    newTask.id = Math.random().toString();
    newTask.status = "new";

    const validationInputs = [].filter.call(
      modalInputs,
      (input) => input.hasAttribute("required") && !input.value
    );

    if (validationInputs.length) {
      validationInputs.forEach((input) => {
        input.classList.add("invalid");
        errorText.style.display = "block";
      });
    } else {
      showPopup.style.display = "none";
      errorText.style.display = "none";
      allTasks.push(newTask);
    }
  }
  drawTable(activeTab.dataset.tabName);

  tabsName.forEach((tab) => tab.classList.remove("active"));
  activeTab.classList.add("active");

  saveToLocalStorage(allTasks);
});

modalInputs[0].addEventListener("focus", function () {
  if (!modalInputs[0].value) {
    modalInputs[0].classList.remove("invalid");
    errorText.style.display = "none";
  }
});

function clearForm() {
  modalInputs.forEach((input) => (input.value = ""));
}

function drawTable(status) {
  const tableElement = table;
  const tableBody = tableElement.querySelector("tbody");
  tableBody.innerHTML = "";

  const visibleTasks = allTasks.filter((task) => task.status === status);
  visibleTasks.forEach((task, i) => {
    const row = document.createElement("tr");

    const num = document.createElement("td");
    const name = document.createElement("td");
    const description = document.createElement("td");
    const priority = document.createElement("td");
    const actionsTD = document.createElement("td");

    actionsTD.classList.add("action__td");
    actionsTD.setAttribute("data-id", task.id);

    num.textContent = i + 1;
    name.textContent = task.task;
    description.textContent = task.description;
    priority.textContent = task.priority;

    row.appendChild(num);
    row.appendChild(name);
    row.appendChild(description);
    row.appendChild(priority);
    row.appendChild(actionsTD);

    tableBody.appendChild(row);

    if (status === "new") {
      actionsTD.innerHTML += '<i class="fas action fa-pencil-alt"></i>';
      actionsTD.innerHTML += '<i class="fas action fa-check"></i>';
      actionsTD.innerHTML += '<i class="fas action fa-trash"></i>';
    } else if (status === "finished") {
      actionsTD.innerHTML = '<i class="fas action fa-trash"></i>';
    } else if (status === "deleted") {
      actionsTD.innerHTML = '<i class="fas fa-trash-restore"></i>';
      actionsTD.innerHTML += '<i class="fas fa-times"></i>';
    }
  });
}

// Press to icons

table.addEventListener("click", (event) => {
  if (event.target.tagName === "I") {
    const taskRow = event.target.closest("i");
    const taskTd = taskRow.closest("td");

    //edit task

    if (event.target.classList.contains("fa-pencil-alt")) {
      const editTask = allTasks.find((task) => {
        return task.id === taskTd.getAttribute("data-id");
      });

      if (editTask) {
        showPopup.style.display = "block";
        errorText.style.display = "none";
        modalInputs[0].classList.remove("invalid");
        modalInputs[0].value = editTask.task;
        modalInputs[1].value = editTask.priority;
        modalInputs[2].value = editTask.description;
        editId = editTask.id;
        numId = allTasks.indexOf(editTask);

        console.log(editId, numId);
      }
    }

    //finished

    if (event.target.classList.contains("fa-check")) {
      const finishedTask = allTasks.find((task) => {
        return task.id === taskTd.getAttribute("data-id");
      });
      if (finishedTask) {
        finishedTask.status = "finished";
      }
      drawTable("new");
    }

    //deleted

    if (event.target.classList.contains("fa-trash")) {
      const deletedTask = allTasks.find((task) => {
        return task.id === taskTd.getAttribute("data-id");
      });
      if (deletedTask && tabsName[0].classList.contains("active")) {
        deletedTask.status = "deleted";
        drawTable("new");
      } else {
        deletedTask.status = "deleted";
        drawTable("finished");
      }
    }

    //restored

    if (event.target.classList.contains("fa-trash-restore")) {
      const restoredTask = allTasks.find((task) => {
        return task.id === taskTd.getAttribute("data-id");
      });
      if (restoredTask) {
        restoredTask.status = "new";
        drawTable("deleted");
      }
    }

    //delete forever

    if (event.target.classList.contains("fa-times")) {
      const foreverDeletedTask = allTasks.find((task) => {
        return task.id === taskTd.getAttribute("data-id");
      });
      if (foreverDeletedTask) {
        foreverDeletedTask.status = "trash";
        drawTable("deleted");
      }
    }
  }
  saveToLocalStorage(allTasks);
});

// Draw table by press the tabs

const navigationTabs = document.querySelector("#navigation-tabs");
navigationTabs.addEventListener("click", function (event) {
  if (event.target.matches("a")) {
    const links = this.querySelectorAll("a");
    if (links) {
      links.forEach((link) => link.classList.remove("active"));
    }
    const selectedTab = event.target;
    const tabName = selectedTab.dataset.tabName;
    selectedTab.classList.add("active");
    drawTable(tabName);
  }
});

// save to localStorage

function saveToLocalStorage(arr) {
  const savedTasks = arr.filter((task) => task.status !== "trash");
  localStorage.setItem("toDoList", JSON.stringify(savedTasks));
}
