function startTodoList() {
    const taskList = document.getElementById("taskList");
    const newTaskTitleInput = document.getElementById("newTaskTitle");
    const newTaskPrioritySelect = document.getElementById("newTaskPriority");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const priorityFilter = document.getElementById("priorityFilter");
    const taskSearch = document.getElementById("taskSearch");
    const alertContainer = document.getElementById("alertContainer");


    let tasksArray = loadTasks();

    if (!tasksArray.length) {
        tasksArray = listaTareas.slice();
        saveTasks(tasksArray);
    }

    printTasks(tasksArray);
    addTaskBtn.addEventListener('click', function () {
        const title = newTaskTitleInput.value;
        const priority = newTaskPrioritySelect.value;

        if (title !== "" && priority !== "all") {
            const newObjTask = {
                id: Date.now(),
                titulo: title,
                prioridad: priority
            };

            tasksArray.push(newObjTask);
            saveTasks(tasksArray);
            printOneTask(newObjTask);
            newTaskTitleInput.value = "";
            newTaskPrioritySelect.value = "all";
            showAlert('Tarea añadida con éxito', 'success');
        } else {
            showAlert('Los campos tienen que estar llenos', 'error');
        }
    });

    function printTasks(tasks) {
        taskList.innerHTML = "";
        tasks.forEach(task => printOneTask(task));
    }

    function printOneTask(task) {
        let taskElement = document.createElement("div");
        taskElement.textContent = task.titulo;
        taskElement.classList.add("task");
        taskElement.classList.add(task.prioridad);
        taskElement.id = task.id;

        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Eliminar";
        deleteButton.classList.add("delete-btn");

        deleteButton.addEventListener("click", function () {
            tasksArray = tasksArray.filter(t => t.id !== task.id);
            saveTasks(tasksArray);
            taskElement.remove();
            showAlert('Tarea eliminada con éxito', 'error');
        });

        taskElement.appendChild(deleteButton);
        taskList.appendChild(taskElement);
    }

    priorityFilter.addEventListener('change', filterTasks);
    taskSearch.addEventListener('input', filterTasks);

    function filterTasks() {
        const priorityValue = priorityFilter.value;
        const searchText = taskSearch.value.toLowerCase();

        const filteredTasks = tasksArray.filter(task => {
            const matchesPriority = priorityValue === 'all' || task.prioridad === priorityValue;
            const matchesText = task.titulo.toLowerCase().includes(searchText);
            return matchesPriority && matchesText;
        });

        printTasks(filteredTasks);
    }

    function showAlert(message, type) {
        const alert = document.createElement('div');
        alert.className = `alert ${type === 'success' ? 'success' : 'error'}`;
        alert.textContent = message;

        alertContainer.appendChild(alert);

        setTimeout(() => {
            alert.classList.add('show');
        }, 10);

        setTimeout(() => {
            alert.classList.remove('show');
            alert.addEventListener('transitionend', () => alert.remove());
        }, 3000);
    }

    function loadTasks() {
        const tasks = localStorage.getItem('tasks');
        return tasks ? JSON.parse(tasks) : [];
    }

    function saveTasks(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}
startTodoList();
