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
                <button class="view">View</button>
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
            `;
            div.querySelector('.view').addEventListener('click', () => {
                projectViewName.textContent = project.name;
                projectViewDescription.textContent = project.description;
                projectList.style.display = 'none';
                projectForm.style.display = 'none';
                projectView.style.display = 'block';
                window.history.pushState({}, '', '/project/' + index);
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

    renderProjects();
});

document.getElementById('back').addEventListener('click', () => {
    projectList.style.display = 'block';
    projectForm.style.display = 'block';
    projectView.style.display = 'none';
    window.history.pushState({}, '', '/');
});