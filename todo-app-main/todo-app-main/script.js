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
    localStorage.setItem("switch",switchMode)

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    

    function renderTasks(filter = 'all') {
        while (taskList.firstElementChild) {
            taskList.removeChild(taskList.firstElementChild);
        }

        noWrapper.textContent = `${tasks.filter(item => !item.completed).length} tasks left`;
        noWrapper.style.display = 'flex';
        noWrapper.style.alignItems = 'center'
        noWrapper.style.marginTop = '3%'

        taskList.innerHTML = '';
        tasks.filter((task,index) => {
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
            var logo = document.createElement('div')
            logo.className = "close"
            logo.innerHTML = "&times"
            logo.style.textDecoration = "none"

            logo.addEventListener('click', ()=>{
                let task_index = ""
                task_index = tasks.map((item, index)=>{
                    if(task.text === item.text ) { return index}
                })
                let final = task_index.filter(i => i !== undefined)
                tasks.splice(final[0],1)
                localStorage.setItem('tasks', JSON.stringify(tasks));
                renderTasks();
                return
            })
            li.appendChild(logo)
            if (task.completed) li.classList.add('completed');
            li.style.display = "flex"
            taskList.appendChild(li);
        });

        if(localStorage.getItem("switch")){
                backgroundWrapper.style.background ="url('./images/bg-desktop-light.jpg')"
                backgroundWrapper.style.backgroundRepeat = 'no-repeat'
                backgroundWrapper.style.backgroundPosition = 'center'
                backgroundWrapper.style.backgroundSize = 'cover'
                document.querySelector(".input-wrapper").style.backgroundColor = "white"
                document.querySelector(".items-wrapper").style.backgroundColor = "white"
                document.querySelector(".input-wrapper").style.transition = "background-color 0.5s ease-in-out"
                document.querySelector(".items-wrapper").style.transition = "background-color 0.5s ease-in-out"
                document.querySelector(".items-wrapper").style.color = "black"
                document.getElementById("task-list").childNodes.forEach(child => {
                    child.style.background = "rgba(173,173,173,0.8)"
                })
                document.getElementById("light-mode-toggle").style.display = "none"
                document.getElementById("dark-mode-toggle").style.display = "block"
                document.body.style.backgroundColor = "white"
                newTaskInput.style.color = "black"
                document.querySelectorAll("input").forEach(item =>{
                    if (item.type == 'checkbox' && item.checked == false){
                        item.style.border = '1px solid rgb(0,0,0)'
                    }
                })
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
                    newTaskInput.style.color = "white"
                    return
                })
                return
            }
    }

    addTaskButton.addEventListener('click', () => {
        tasks.push({ text: newTaskInput.value, completed: false });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        newTaskInput.value = '';
        renderTasks();
    });

    newTaskInput.addEventListener('keypress', (event)=>{
          if(event.key === 'Enter'){
            event.preventDefault()
            tasks.push({ text: newTaskInput.value, completed: false });
            localStorage.setItem('tasks', JSON.stringify(tasks));
            newTaskInput.value = '';
            renderTasks();
        }
    })

    themeButton.addEventListener('click', ()=>{
        if(!switchMode){
            localStorage.setItem("switch",true)
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
            newTaskInput.style.color = "black"
            document.querySelectorAll("input").forEach(item =>{
                if (item.type == 'checkbox'){
                    item.style.border = '1px solid rgb(0,0,0,0.7)'
                }
            })
            document.getElementById("dark-mode-toggle").addEventListener('click', ()=>{
                localStorage.setItem("switch",false)
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
                newTaskInput.style.color = "white"
                return
            })
            return
        }
    })

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

// const filterButtons = document.querySelector('.filter');
// filterButtons.addEventListener('click', () => {
//     filterButtons.style.color = 'blue'
// });