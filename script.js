document.addEventListener("DOMContentLoaded", function () {
  const todoInput = document.getElementById("todo");
  const addButton = document.getElementById("addButton");
  const taskList = document.getElementById("task_list");
  const clearAllButton = document.getElementById("clearAllButton");

  todoInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      addTodo();
    }
  });

  addButton.addEventListener("click", addTodo);
  clearAllButton.addEventListener("click", clearAll);
  loadTodo();

  function loadTodo() {
    const taskStorage = localStorage.getItem("taskStorage");
    if (taskStorage !== null && taskStorage !== "") {
      taskList.innerHTML = taskStorage;
      attachButtonEvents();
      countPendingTasks();
    }
  }

  function addTodo() {
    const todo = document.getElementById("todo");
    if (todo.value === "") {
      alert("Please enter the task");
    } else {
      const element = `
        <div class="task">
          <button class="check_btn"><i class='bx bx-check'></i></button>
          <span class="todo-text">${todo.value}</span>
          <input type="text" class="edit-input" style="display: none;">
          <button class="edit_btn"><i class='bx bx-edit'></i></button>
          <button class="delete_btn"><i class='bx bx-trash'></i></button>
        </div>
      `;
      taskList.insertAdjacentHTML("afterbegin", element);
      saveTodo();
      countPendingTasks();
      todo.value = "";
      attachButtonEvents(); // Reattach event listeners after adding new todo
    }
  }

  function saveTodo() {
    const task = taskList.innerHTML;
    localStorage.setItem("taskStorage", task);
  }

  function attachButtonEvents() {
    taskList.querySelectorAll(".check_btn").forEach((button) => {
      button.removeEventListener("click", check_btn); // Remove previous listeners
      button.addEventListener("click", check_btn); // Attach new listener
    });

    taskList.querySelectorAll(".delete_btn").forEach((button) => {
      button.removeEventListener("click", delete_btn); // Remove previous listeners
      button.addEventListener("click", delete_btn); // Attach new listener
    });

    taskList.querySelectorAll(".edit_btn").forEach((button) => {
      button.removeEventListener("click", editTodo); // Remove previous listeners
      button.addEventListener("click", editTodo); // Attach new listener
    });
  }

  function clearAll() {
    if (confirm("Are you sure you want to delete all tasks?")) {
      localStorage.removeItem("taskStorage");
      taskList.innerHTML = "";
      countPendingTasks();
    }
  }

  function delete_btn() {
    this.parentElement.remove(); // 'this' refers to the clicked button
    saveTodo();
    countPendingTasks();
  }

  function check_btn() {
    this.parentElement.classList.toggle("true"); // 'this' refers to the clicked button
    saveTodo();
    countPendingTasks();
  }

  function editTodo() {
    const taskItem = this.parentElement;
    const todoText = taskItem.querySelector(".todo-text");
    const editInput = taskItem.querySelector(".edit-input");
    const editButton = taskItem.querySelector(".edit_btn");
    const checkButton = taskItem.querySelector(".check_btn"); // Add this line

    // Create a new save button
    const saveButton = document.createElement("button");
    saveButton.classList.add("edit_btn");
    saveButton.innerHTML = '<i class="bx bx-check"></i>';
    saveButton.addEventListener("click", saveEditedTodo);

    if (editInput.style.display === "none") {
      editInput.style.display = "inline";
      editInput.value = todoText.textContent;
      todoText.style.display = "none";
      editButton.replaceWith(saveButton); // Replace the edit button with the save button
      checkButton.style.display = "none"; // Hide the check button
    }
  }


  function saveEditedTodo() {
    const taskItem = this.parentElement;
    const todoText = taskItem.querySelector(".todo-text");
    const editInput = taskItem.querySelector(".edit-input");
    const editButton = taskItem.querySelector(".edit_btn");
    const checkButton = taskItem.querySelector(".check_btn"); // Add this line

    if (editInput.value === "") {
      alert("Please enter the task");
      return;
    } else {
      todoText.textContent = editInput.value;
      editInput.style.display = "none";
      todoText.style.display = "inline";
      this.remove();
      checkButton.style.display = "inline"; // Show the check button again
      saveTodo();
    }
  }


  // Add event listeners for save buttons created dynamically
  taskList.addEventListener("click", function (event) {
    if (event.target && event.target.classList.contains("edit_btn")) {
      editTodo.call(event.target);
    }
  });

  // Add event listener for pressing Enter key while editing
  taskList.addEventListener("keypress", function (event) {
    if (
      event.key === "Enter" &&
      event.target.classList.contains("edit-input")
    ) {
      saveEditedTodo.call(
        event.target.parentElement.querySelector(".edit_btn")
      );
    }
  });

  function countPendingTasks() {
  const countPendingTextElement = document.getElementById("text");
  const pendingTasksCount = document.querySelectorAll(".task:not(.true)").length;


  if (pendingTasksCount === 0) {
    countPendingTextElement.textContent = "";
  } else if (pendingTasksCount === 1) {
    countPendingTextElement.textContent = "1 pending task";
  } else {
    countPendingTextElement.textContent = pendingTasksCount + " pending tasks";
  }
}

});

