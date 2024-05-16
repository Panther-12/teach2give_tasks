document.addEventListener('DOMContentLoaded', (event) => {
    const taskList = document.getElementById('task-list');
    const newTaskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task');
    const clearCompletedButton = document.getElementById('clear-completed');
    const backgroundWrapper = document.getElementById("bg");
    const themeButton = document.getElementById("light-mode-toggle");
    const filterButtons = document.querySelectorAll('.filter');
    const noWrapper = document.getElementById('no-wrapper');
    var switchMode = false

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    if (tasks.length === 0){
        noWrapper.textContent = '0 tasks left';
        noWrapper.style.display = 'flex';
        noWrapper.style.alignItems = 'center'
        noWrapper.style.marginTop = '3%'
    }
    noWrapper.textContent = `${tasks.length} tasks left`;
    noWrapper.style.display = 'flex';
    noWrapper.style.alignItems = 'center'
    noWrapper.style.marginTop = '3%'
    

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
        window.location.reload()
        renderTasks();
    });

    themeButton.addEventListener('click', ()=>{
        if(!switchMode){
            backgroundWrapper.style.background ="url('./images/bg-desktop-light.jpg')"
            backgroundWrapper.style.backgroundRepeat = 'no-repeat'
            backgroundWrapper.style.backgroundPosition = 'center'
            backgroundWrapper.style.backgroundSize = 'cover'
            document.querySelector(".input-wrapper").style.backgroundColor = "white"
            document.querySelector(".items-wrapper").style.backgroundColor = "white"
            document.querySelector(".items-wrapper").style.color = "black"
            document.getElementById("task-list").childNodes.forEach(child => {
                child.style.background = "rgba(173,173,173,0.8)"
            })
            document.getElementById("light-mode-toggle").style.display = "none"
            document.getElementById("dark-mode-toggle").style.display = "block"
            document.body.style.backgroundColor = "white"
            document.getElementById("dark-mode-toggle").addEventListener('click', ()=>{
                backgroundWrapper.style.background ="url('./images/bg-desktop-dark.jpg')"
                backgroundWrapper.style.backgroundRepeat = 'no-repeat'
                backgroundWrapper.style.backgroundPosition = 'center'
                backgroundWrapper.style.backgroundSize = 'cover'
                document.body.style.backgroundColor = "rgb(24, 8, 24)"
                document.querySelector(".input-wrapper").style.backgroundColor = "rgb(24, 8, 24)"
                document.querySelector(".items-wrapper").style.backgroundColor = "rgb(24, 8, 24)"
                document.querySelector(".items-wrapper").style.color = "white"
                            document.getElementById("task-list").childNodes.forEach(child => {
                child.style.background = "rgba(255,255,255,0.1)"
            })
                document.getElementById("dark-mode-toggle").style.display = "none"
                document.getElementById("light-mode-toggle").style.display = "block"
                return
            })
            return
        }
    })

    clearCompletedButton.addEventListener('click', () => {
        tasks = tasks.filter(task => !task.completed);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        window.location.reload()
        renderTasks();
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            renderTasks(button.dataset.filter);
        });
    });

    renderTasks();
});

const filterButtons = document.querySelector('.filter');
filterButtons.addEventListener('click', () => {
    filterButtons.style.color = 'blue'
});