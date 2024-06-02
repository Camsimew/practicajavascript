// Contenido del archivo ./js/to_doapp1.js

function initializeApp() {
    const taskList = document.getElementById("taskList");
    const newTaskTitleInput = document.getElementById("newTaskTitle");
    const newTaskPrioritySelect = document.getElementById("newTaskPriority");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const priorityFilter = document.getElementById("priorityFilter");
    const taskSearch = document.getElementById("taskSearch");
    const alertContainer = document.getElementById("alertContainer");

    // Cargar tareas desde localStorage y combinar con las preexistentes
    let tasksArray = loadTasks();

    // Si el localStorage está vacío, inicializar con listaTareas
    if (!tasksArray.length) {
        tasksArray = listaTareas.slice(); // Clonar el array inicial para no modificar el original
        saveTasks(tasksArray); // Guardar tareas iniciales en localStorage
    }

    // Imprimir todas las tareas
    printTasks(tasksArray);

    // Evento para agregar una nueva tarea
    addTaskBtn.addEventListener('click', function () {
        const title = newTaskTitleInput.value;
        const priority = newTaskPrioritySelect.value;

        if (title !== "" && priority !== "all") {
            const newObjTask = {
                id: Date.now(), // Generar un ID único
                titulo: title,
                prioridad: priority
            };

            tasksArray.push(newObjTask);
            saveTasks(tasksArray); // Guardar tareas en localStorage
            printOneTask(newObjTask);
            newTaskTitleInput.value = "";
            newTaskPrioritySelect.value = "all";
            showAlert('Tarea añadida con éxito', 'success');
        } else {
            showAlert('Los campos tienen que estar llenos', 'error');
        }
    });

    // Función para imprimir todas las tareas
    function printTasks(tasks) {
        taskList.innerHTML = "";
        tasks.forEach(task => printOneTask(task));
    }

    // Función para imprimir una sola tarea
    function printOneTask(task) {
        let taskElement = document.createElement("div");
        taskElement.textContent = task.titulo;
        taskElement.classList.add("task");
        taskElement.classList.add(task.prioridad); // Usar "prioridad" en lugar de "priority"
        taskElement.id = task.id;

        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Eliminar";
        deleteButton.classList.add("delete-btn");

        deleteButton.addEventListener("click", function () {
            tasksArray = tasksArray.filter(t => t.id !== task.id);
            saveTasks(tasksArray); // Actualizar localStorage
            taskElement.remove();
            showAlert('Tarea eliminada con éxito', 'error');
        });

        taskElement.appendChild(deleteButton);
        taskList.appendChild(taskElement);
    }

    // Filtrar tareas por prioridad y texto
    priorityFilter.addEventListener('change', filterTasks);
    taskSearch.addEventListener('input', filterTasks);

    function filterTasks() {
        const priorityValue = priorityFilter.value;
        const searchText = taskSearch.value.toLowerCase();

        const filteredTasks = tasksArray.filter(task => {
            const matchesPriority = priorityValue === 'all' || task.prioridad === priorityValue; // Usar "prioridad" en lugar de "priority"
            const matchesText = task.titulo.toLowerCase().includes(searchText);
            return matchesPriority && matchesText;
        });

        printTasks(filteredTasks);
    }

    // Función para mostrar alertas personalizadas
    function showAlert(message, type) {
        const alert = document.createElement('div');
        alert.className = `alert ${type === 'success' ? 'success' : 'error'}`;
        alert.textContent = message;

        alertContainer.appendChild(alert);

        // Mostrar la alerta
        setTimeout(() => {
            alert.classList.add('show');
        }, 10);

        // Ocultar la alerta después de 3 segundos
        setTimeout(() => {
            alert.classList.remove('show');
            alert.addEventListener('transitionend', () => alert.remove());
        }, 3000);
    }

    // Función para cargar tareas desde localStorage
    function loadTasks() {
        const tasks = localStorage.getItem('tasks');
        return tasks ? JSON.parse(tasks) : [];
    }

    // Función para guardar tareas en localStorage
    function saveTasks(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

// Llamar a la función para inicializar la aplicación
initializeApp();
