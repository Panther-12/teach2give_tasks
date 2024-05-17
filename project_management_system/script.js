document.addEventListener('DOMContentLoaded', (event) => {
    const projectList = document.getElementById('project-list');
    const projectIdInput = document.getElementById('project-id');
    const projectNameInput = document.getElementById('project-name');
    const projectDescriptionInput = document.getElementById('project-description');
    const projectForm = document.getElementById('project-form');
    const projectView = document.getElementById('project-view');
    const projectViewName = document.getElementById('project-view-name');
    const projectViewDescription = document.getElementById('project-view-description');

    let projects = JSON.parse(localStorage.getItem('projects')) || [];

    function renderProjects() {
        projectList.innerHTML = '';
        projects.forEach((project, index) => {
            const div = document.createElement('div');
            div.className = 'project';
            div.innerHTML = `
            <h2>${project.name}</h2>
            <p>${project.description}</p>
            <div class="button-container">
                <button class="view"><ion-icon name="eye-outline"></ion-icon></button>
                <button class="edit"><ion-icon name="create-outline"></ion-icon></button>
                <button class="delete"><ion-icon name="trash-outline"></ion-icon></button>
            </div>
            `;
            div.querySelector('.view').addEventListener('click', () => {
                projectViewName.textContent = project.name;
                projectViewDescription.textContent = project.description;
                projectList.style.display = 'none';
                projectForm.style.display = 'none';
                projectView.style.display = 'block';
                window.history.pushState({}, '', '/project_management_system/' + index);
            });
            div.querySelector('.edit').addEventListener('click', () => {
                projectIdInput.value = index;
                projectNameInput.value = project.name;
                projectDescriptionInput.value = project.description;
            });
            div.querySelector('.delete').addEventListener('click', () => {
                projects.splice(index, 1);
                localStorage.setItem('projects', JSON.stringify(projects));
                renderProjects();
            });
            projectList.appendChild(div);
        });
    }

    projectForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const id = projectIdInput.value;
        if (id) {
            projects[id] = {
                name: projectNameInput.value,
                description: projectDescriptionInput.value
            };
        } else {
            projects.push({
                name: projectNameInput.value,
                description: projectDescriptionInput.value
            });
        }
        localStorage.setItem('projects', JSON.stringify(projects));
        projectIdInput.value = '';
        projectNameInput.value = '';
        projectDescriptionInput.value = '';
        renderProjects();
    });

    projectDescriptionInput.addEventListener("keypress",(event)=>{
        if(event.key === "Enter"){
            event.preventDefault()
            const id = projectIdInput.value;
            if (id) {
                projects[id] = {
                    name: projectNameInput.value,
                    description: projectDescriptionInput.value
                };
            } else {
                projects.push({
                    name: projectNameInput.value,
                    description: projectDescriptionInput.value
                });
            }
            localStorage.setItem('projects', JSON.stringify(projects));
            projectIdInput.value = '';
            projectNameInput.value = '';
            projectDescriptionInput.value = '';
            renderProjects();
        }

    })

    renderProjects();
});

const projectList = document.getElementById('project-list');
const projectForm = document.getElementById('project-form');
const projectView = document.getElementById('project-view');
document.getElementById('back').addEventListener('click', () => {
    projectList.style.display = 'block';
    projectForm.style.display = 'block';
    projectView.style.display = 'none';
    window.location.href = 'index.html'
});

document.getElementById('search').addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const projects = document.querySelectorAll('.project');
    projects.forEach((project) => {
        const name = project.querySelector('h2').textContent.toLowerCase();
        if (name.includes(searchTerm)) {
            project.style.display = 'block';
        } else {
            project.style.display = 'none';
        }
    });
});