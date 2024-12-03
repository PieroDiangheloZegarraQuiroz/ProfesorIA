document.addEventListener('DOMContentLoaded', function() {
    let temas = [];
    let calendar;
    let eventoSeleccionado = null;

    const nuevoTemaInput = document.getElementById('nuevo-tema');
    const agregarTemaBtn = document.getElementById('agregar-tema');
    const temasLista = document.getElementById('temas-lista');
    const modal = document.getElementById('editarModal');
    const editarTemaInput = document.getElementById('editarTemaInput');
    const confirmarEdicionBtn = document.getElementById('confirmarEdicion');
    const cancelarEdicionBtn = document.getElementById('cancelarEdicion');
    const closeModalBtn = modal.querySelector('.close');

    // Crear botones de modificar y eliminar
    const modificarBtn = document.createElement('button');
    modificarBtn.textContent = 'Modificar';
    modificarBtn.style.display = 'none';
    modificarBtn.classList.add('fc-button', 'fc-button-primary', 'modificar');

    const eliminarBtn = document.createElement('button');
    eliminarBtn.textContent = 'Eliminar';
    eliminarBtn.style.display = 'none';
    eliminarBtn.classList.add('fc-button', 'fc-button-primary', 'eliminar');

    // Añadir los botones a la barra de herramientas del calendario
    function agregarBotones() {
        const toolbar = document.querySelector('.fc-toolbar-chunk:nth-child(2)');
        if (toolbar) {
            toolbar.insertBefore(eliminarBtn, toolbar.firstChild);
            toolbar.insertBefore(modificarBtn, toolbar.firstChild);
        }
    }

    // Función para actualizar la lista de temas
    function actualizarListaTemas() {
        temasLista.innerHTML = '';
        temas.forEach((tema, index) => {
            const temaElement = document.createElement('div');
            temaElement.textContent = tema;
            temaElement.className = 'tema-item';
            temaElement.draggable = true;
            temaElement.setAttribute('data-index', index);
            temaElement.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', index);
            });
            temasLista.appendChild(temaElement);
        });
    }

    // Mostrar los botones de modificar y eliminar
    function mostrarBotones() {
        modificarBtn.style.display = 'inline-block';
        eliminarBtn.style.display = 'inline-block';
    }

    // Ocultar los botones
    function ocultarBotones() {
        modificarBtn.style.display = 'none';
        eliminarBtn.style.display = 'none';
    }

    // Función para abrir el modal
    function abrirModal() {
        modal.style.display = 'block';
        editarTemaInput.value = eventoSeleccionado.title;
        editarTemaInput.focus();
    }

    // Función para cerrar el modal
    function cerrarModal() {
        modal.style.display = 'none';
    }

    // Función para modificar el tema seleccionado
    modificarBtn.addEventListener('click', () => {
        if (eventoSeleccionado) {
            abrirModal();
        }
    });

    // Manejar la confirmación de edición
    confirmarEdicionBtn.addEventListener('click', () => {
        const nuevoTexto = editarTemaInput.value.trim();
        if (nuevoTexto && eventoSeleccionado) {
            const temaAnterior = eventoSeleccionado.title;
            eventoSeleccionado.setProp('title', nuevoTexto);
            
            // Actualizar en la lista de temas
            const index = temas.indexOf(temaAnterior);
            if (index !== -1) {
                temas[index] = nuevoTexto;
                actualizarListaTemas();
            }
        }
        cerrarModal();
        ocultarBotones();
    });

    // Manejar la cancelación de edición
    cancelarEdicionBtn.addEventListener('click', cerrarModal);
    closeModalBtn.addEventListener('click', cerrarModal);

    // Cerrar el modal si se hace clic fuera de él
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            cerrarModal();
        }
    });

    // Función para eliminar el tema seleccionado
    eliminarBtn.addEventListener('click', () => {
        if (eventoSeleccionado) {
            const temaEliminado = eventoSeleccionado.title;
            eventoSeleccionado.remove();
            
            // Eliminar de la lista de temas
            const index = temas.indexOf(temaEliminado);
            if (index !== -1) {
                temas.splice(index, 1);
                actualizarListaTemas();
            }
        }
        ocultarBotones();
    });

    agregarTemaBtn.addEventListener('click', () => {
        const nuevoTema = nuevoTemaInput.value.trim();
        if (nuevoTema) {
            temas.push(nuevoTema);
            nuevoTemaInput.value = '';
            actualizarListaTemas();
        }
    });

    // Crear el calendario
    calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
        initialView: 'dayGridMonth',
        editable: true,
        droppable: true,
        locale: 'es',
        events: [],
        drop: function(info) {
            const temaIndex = info.draggedEl.getAttribute('data-index');
            const tema = temas[temaIndex];
            if (tema) {
                calendar.addEvent({
                    title: tema,
                    start: info.date,
                    allDay: true
                });
            }
        },
        eventClick: function(info) {
            const eventos = calendar.getEvents();
            eventos.forEach(evento => {
                evento.setProp('classNames', []); 
            });

            eventoSeleccionado = info.event;
            eventoSeleccionado.setProp('classNames', ['evento-seleccionado']);
    
            mostrarBotones();
        },
        unselect: function() {
            eventoSeleccionado = null;
            ocultarBotones();
        }
    });

    // Renderizar el calendario y agregar los botones
    calendar.render();
    agregarBotones();

    new FullCalendar.Draggable(temasLista, {
        itemSelector: '.tema-item',
        eventData: function(eventEl) {
            return {
                title: eventEl.textContent,
                duration: '01:00'
            };
        }
    });
});
