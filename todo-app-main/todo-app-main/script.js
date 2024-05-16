document.addEventListener('DOMContentLoaded', (event) => {
    const taskList = document.getElementById('task-list');
    const newTaskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task');
    const clearCompletedButton = document.getElementById('clear-completed');
    const filterButtons = document.querySelectorAll('.filter');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function renderTasks(filter = 'all') {
        taskList.innerHTML = '';
        tasks.filter(task => {
            if (filter === 'all') return true;
            if (filter === 'active') return !task.completed;
            if (filter === 'completed') return task.completed;
        }).forEach(task => {
            const li = document.createElement('li');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => {
                task.completed = checkbox.checked;
                localStorage.setItem('tasks', JSON.stringify(tasks));
                renderTasks(filter);
            });
            li.appendChild(checkbox);
            li.appendChild(document.createTextNode(task.text));
            if (task.completed) li.classList.add('completed');
            taskList.appendChild(li);
        });
    }

    addTaskButton.addEventListener('click', () => {
        tasks.push({ text: newTaskInput.value, completed: false });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        newTaskInput.value = '';
        renderTasks();
    });

    clearCompletedButton.addEventListener('click', () => {
        tasks = tasks.filter(task => !task.completed);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            renderTasks(button.dataset.filter);
        });
    });

    renderTasks();
});