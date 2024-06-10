function iniciarListaDeTareas() {
    const listaDeTareas = document.getElementById("taskList");
    const inputTituloNuevaTarea = document.getElementById("newTaskTitle");
    const selectPrioridadNuevaTarea = document.getElementById("newTaskPriority");
    const botonAgregarTarea = document.getElementById("addTaskBtn");
    const filtroPrioridad = document.getElementById("priorityFilter");
    const buscarTarea = document.getElementById("taskSearch");
    const contenedorDeAlertas = document.getElementById("alertContainer");

    let arrayDeTareas = cargarTareas();

    if (!arrayDeTareas.length) {
        arrayDeTareas = listaTareas.slice();
        guardarTareas(arrayDeTareas);
    }

    imprimirTareas(arrayDeTareas);
    botonAgregarTarea.addEventListener('click', function () {
        const titulo = inputTituloNuevaTarea.value;
        const prioridad = selectPrioridadNuevaTarea.value;

        if (titulo !== "" && prioridad !== "all") {
            const nuevaTarea = {
                id: generarIdUnico(),
                titulo: titulo,
                prioridad: prioridad,
                completada: false
            };

            arrayDeTareas.push(nuevaTarea);
            guardarTareas(arrayDeTareas);
            imprimirUnaTarea(nuevaTarea);
            inputTituloNuevaTarea.value = "";
            selectPrioridadNuevaTarea.value = "all";
            mostrarAlerta('Tarea añadida con éxito', 'success');
        } else {
            mostrarAlerta('Los campos tienen que estar llenos', 'error');
        }
    });

    function imprimirTareas(tareas) {
        listaDeTareas.innerHTML = "";
        tareas.forEach(tarea => imprimirUnaTarea(tarea));
    }

    function imprimirUnaTarea(tarea) {
        let elementoTarea = document.createElement("div");
        elementoTarea.classList.add("task");
        elementoTarea.classList.add(tarea.prioridad);
        elementoTarea.classList.toggle("completed", tarea.completada);
        elementoTarea.id = tarea.id;

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("custom-checkbox");
        checkbox.checked = tarea.completada;
        checkbox.addEventListener('change', function () {
            tarea.completada = checkbox.checked;
            guardarTareas(arrayDeTareas);
            elementoTarea.classList.toggle("completed", tarea.completada);
        });

        let tituloTarea = document.createElement("span");
        tituloTarea.textContent = tarea.titulo;

        let botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.classList.add("delete-btn");
        botonEliminar.addEventListener("click", function () {
            arrayDeTareas = arrayDeTareas.filter(t => t.id !== tarea.id);
            guardarTareas(arrayDeTareas);
            elementoTarea.remove();
            mostrarAlerta('Tarea eliminada con éxito', 'error');
        });

        elementoTarea.appendChild(checkbox);
        elementoTarea.appendChild(tituloTarea);
        elementoTarea.appendChild(botonEliminar);
        listaDeTareas.appendChild(elementoTarea);
    }


    let idCounter = 0;
    function generarIdUnico() {
        return idCounter++;
    }

    filtroPrioridad.addEventListener('change', filtrarTareas);
    buscarTarea.addEventListener('input', filtrarTareas);

    function filtrarTareas() {
        const valorPrioridad = filtroPrioridad.value;
        const textoDeBusqueda = buscarTarea.value.toLowerCase();

        const tareasFiltradas = arrayDeTareas.filter(tarea => {
            const coincidePrioridad = valorPrioridad === 'all' || tarea.prioridad === valorPrioridad;
            const coincideTexto = tarea.titulo.toLowerCase().includes(textoDeBusqueda);
            return coincidePrioridad && coincideTexto;
        });

        imprimirTareas(tareasFiltradas);
    }

    function mostrarAlerta(mensaje, tipo) {
        const alerta = document.createElement('div');
        alerta.className = `alert ${tipo === 'success' ? 'success' : 'error'}`;
        alerta.textContent = mensaje;

        contenedorDeAlertas.appendChild(alerta);

        setTimeout(() => {
            alerta.classList.add('show');
        }, 10);

        setTimeout(() => {
            alerta.classList.remove('show');
            alerta.addEventListener('transitionend', () => alerta.remove());
        }, 3000);
    }

    function cargarTareas() {
        const tareas = localStorage.getItem('tasks');
        return tareas ? JSON.parse(tareas) : [];
    }

    function guardarTareas(tareas) {
        localStorage.setItem('tasks', JSON.stringify(tareas));
    }
}

iniciarListaDeTareas();
