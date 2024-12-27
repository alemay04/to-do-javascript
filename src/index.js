//http://localhost:8080/
import "./styles.css";
import {
    createToDo,
    createProject,
    createNote,
    addToDo,
    removeToDo,
    editToDo,
    editProject,
    project
} from './applicationLogic.js';

import trash from './trash.svg';
import edit from './edit.svg';

import { add, compareAsc, format } from "date-fns";
import { se } from "date-fns/locale";

const ul = document.getElementById('projectList');
const form = document.getElementById('form');
const main = document.getElementById('main');
const addButton = document.getElementById('add');
const popup = document.getElementById('popupForm');
const closePopup = document.getElementById('closePopup');
const toDoSection = document.getElementById('to-do-form');
const projectSection = document.getElementById('project-form');
const noteSection = document.getElementById('note-form');
const baseOptions = document.getElementById('baseOptions');


// Le bouton + ouvre le popup------------------------------------------------
addButton.addEventListener('click', () => {
    popup.style.display = 'flex';
    form.innerHTML = '';
    addToDoWindow();
    toggleSelectedSection(toDoSection, [toDoSection, projectSection, noteSection]);

});
closePopup.addEventListener('click', () => {
    popup.style.display = 'none';
});

// Fermer le popup si l'utilisateur clique en dehors du formulaire
window.addEventListener('click', (event) => {
    if (event.target === popup) {
        popup.style.display = 'none';
    }
});
// Le bouton + ouvre le popup------------------------------------------------

// Bouton de section du popUp-----------------------------------------------
toDoSection.addEventListener('click', () => {
    form.innerHTML = '';
    addToDoWindow();
    toggleSelectedSection(toDoSection, [toDoSection, projectSection, noteSection]);
});

projectSection.addEventListener('click', () => {
    form.innerHTML = '';
    addProjectWindow();
    toggleSelectedSection(projectSection, [toDoSection, projectSection, noteSection]);
}); 

noteSection.addEventListener('click', () => {
    form.innerHTML = '';
    addNoteWindow();
    toggleSelectedSection(noteSection, [toDoSection, projectSection, noteSection]);
});

function toggleSelectedSection(sectionToSelect, sections) {
    sections.forEach(section => {
        section.classList.toggle('selectedAddCategory', section === sectionToSelect);
    });
}
// Bouton de section du popUp-----------------------------------------------

document.addEventListener('click', (event) => {
    const section = event.target.closest('.categorie'); // Vérifie si le clic est sur une catégorie
    if (!section) return;

    // Effacer l'id "selected" de toutes les catégories
    document.querySelectorAll('.categorie').forEach(el => {
        if (el.id === 'selected') {
            el.id = ''; // Supprime l'id
        }
    });

    // Ajouter l'id "selected" à la section cliquée
    section.id = 'selected';

    // Récupérer le titre du projet cliqué
    const projectTitle = section.textContent.trim();

    // Mettre à jour la clé "selected" des projets dans localStorage
    updateProjectSelection(projectTitle);
    render();
});

// Fonction pour mettre à jour la clé "selected" dans localStorage
function updateProjectSelection(selectedTitle) {
    const projects = JSON.parse(localStorage.getItem('projects')) || [];

    projects.forEach(project => {
        project.selected = project.title === selectedTitle;
    });

    //alert(JSON.stringify(projects));

    localStorage.setItem('projects', JSON.stringify(projects));

}

function addToDoWindow() {
    const title = document.createElement('input');
    title.setAttribute('type', 'text');
    title.setAttribute('placeholder', 'Title');
    title.setAttribute('id', 'toDoTitle');

    const detail = document.createElement('textarea');
    detail.setAttribute('placeholder', 'Detail');
    detail.setAttribute('rows', '5');
    detail.setAttribute('id', 'toDoDetail');

    const dueDate = document.createElement('input');
    dueDate.setAttribute('type', 'datetime-local');
    dueDate.setAttribute('placeholder', 'Due Date');
    dueDate.setAttribute('id', 'toDoDueDate');

    const priority = document.createElement('select');
    const priorityPlaceholder = document.createElement('option');
    priorityPlaceholder.text = '--Choose a Priority--';
    priorityPlaceholder.disabled = true;
    priorityPlaceholder.selected = true;
    priority.appendChild(priorityPlaceholder);
    const priorities = ["Low", "Medium", "High"];
    for (let i = 0; i < priorities.length; i++) {
        const option = document.createElement('option');
        option.value = priorities[i];
        option.text = priorities[i];
        priority.appendChild(option);
    }
    priority.setAttribute('id', 'toDoPriority');

    const submit = document.createElement('input');
    submit.setAttribute('type', 'submit');
    submit.setAttribute('id', 'toDoSubmit');

    form.appendChild(title);
    form.appendChild(detail);
    form.appendChild(dueDate);
    form.appendChild(priority);
    form.appendChild(submit);


    submit.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent the form from refreshing the page

        const data = {
            title: document.getElementById('toDoTitle').value,
            detail: document.getElementById('toDoDetail').value,
            dueDate: document.getElementById('toDoDueDate').value,
            priority: document.getElementById('toDoPriority').value,
        };
    
        // Validate the form
        if (!data.title || !data.dueDate || !data.priority) {
            alert("All fields are required.");
            return;
        }
    
        form.innerHTML = '';
        popup.style.display = 'none';

        const newToDo = createToDo(
            data.title,
            data.detail,
            data.dueDate,
            data.priority
        );

        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        //alert(JSON.stringify(projects));
        let selectedProject = null;

        for (let i = 0; i < projects.length; i++) {
            if (projects[i].selected) {
                selectedProject = projects[i];
                break; // Exit the loop once the selected project is found
            }
        }

        selectedProject.toDos.push(newToDo);
        //selectedProject.toDos = [];
        //alert(JSON.stringify(selectedProject.toDos));
        
        localStorage.setItem('projects', JSON.stringify(projects));
        render();
        
    });
    

}

function addProjectWindow() {
    const title = document.createElement('input');
    title.setAttribute('type', 'text');
    title.setAttribute('placeholder', 'Title');
    title.setAttribute('id', 'projectTitle');

    const submit = document.createElement('input');
    submit.setAttribute('type', 'submit');
    submit.setAttribute('id', 'projectSubmit');
    form.appendChild(title);
    form.appendChild(submit);

    submit.addEventListener('click', (e) => {

        e.preventDefault(); // Prevent the form from refreshing the page

        // Get the form values
        const data = {
         title : document.getElementById('projectTitle').value,
        };

        // Validate the form
        if (!title.value) {
            alert("All fields are required.");
            return;
        }

        // Clear the form and close popup
        form.innerHTML = '';
        popup.style.display = 'none';

        const newProject = createProject(data.title);

        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        projects.push(newProject);
        localStorage.setItem('projects', JSON.stringify(projects));

        deployProject(newProject);


    });
}

function addNoteWindow( ){
    const title = document.createElement('input');
    title.setAttribute('type', 'text');
    title.setAttribute('placeholder', 'Title');
    title.setAttribute('id', 'noteTitle');

    const detail = document.createElement('textarea');
    detail.setAttribute('placeholder', 'Detail');
    detail.setAttribute('rows', '9');
    detail.setAttribute('id', 'noteDetail');

    const submit = document.createElement('input');
    submit.setAttribute('type', 'submit');
    submit.setAttribute('id', 'noteSubmit');
    form.appendChild(title);
    form.appendChild(detail);
    form.appendChild(submit);

    submit.addEventListener('click', (e) => {
        
        e.preventDefault(); // Prevent the form from refreshing the page

        // Get the form values
        const title = document.getElementById('noteTitle');
        const detail = document.getElementById('noteDetail');

        // Validate the form
        if (!title.value || !detail.value) {
            alert("All fields are required.");
            return;
        }

        // Create the Note
        const newNote = createNote(
            title.value,
            detail.value
        );

        // Deploy the Note on the page
        deployNote (newNote);

        // Clear the form and close popup
        form.innerHTML = '';
        popup.style.display = 'none';

    });
}

function deployToDo(toDo) {
    const toDoFile = document.createElement('div');
    toDoFile.classList.add('toDo');

    const container = document.createElement('label');
    container.classList.add('container');

    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.addEventListener('change', () => {
        if (input.checked) {
            toDoFile.classList.add('toDoCompleted');
        }
        else {
            toDoFile.classList.remove('toDoCompleted');
        }
    });

    const span = document.createElement('span');
    span.classList.add('checkmark');

    container.appendChild(input);
    container.appendChild(span);

    const title = document.createElement('h4');
    title.textContent = toDo.title;

    function getOrdinalSuffix(day) {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    }
    function formatDateWithOrdinal(date) {
        const day = format(date, 'd'); // Get day (1-31)
        const suffix = getOrdinalSuffix(Number(day));
        const month = format(date, 'MMM'); // Get abbreviated month
        const time = format(date, 'h:mm a');
        return `${month} ${day}${suffix} , ${time}`;
    }
    
    // Example usage:
    const date = formatDateWithOrdinal(new Date(toDo.dueDate));
    const dueDate = document.createElement('p');
    dueDate.textContent = `${date}`;

    if (toDo.priority === 'Low') {
        toDoFile.style.setProperty('border-left', `10px solid ${'green'}`, 'important');
    }
    else if (toDo.priority === 'Medium') {
        toDoFile.style.setProperty('border-left', `10px solid ${'orange'}`, 'important');
    }
    else if (toDo.priority === 'High') {
        toDoFile.style.setProperty('border-left', `10px solid ${'red'}`, 'important');
    }

    const editButton = document.createElement('button');
    editButton.classList.add('icons');
    editButton.innerHTML = `<img src="${edit}" alt="Edit">`;

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('icons');
    deleteButton.innerHTML = `<img src="${trash}" alt="Delete">`;
    deleteButton.addEventListener('click', () => {
        let projects = JSON.parse(localStorage.getItem('projects'));
        //alert(JSON.stringify(projects));
        let selectedProject = null;
        for (let i = 0; i < projects.length; i++) {
            if (projects[i].selected) {
                selectedProject = projects[i];
                break; // Exit the loop once the selected project is found
            }
        }
        //alert(JSON.stringify(selectedProject));
    
        //alert(JSON.stringify(selectedProject));
        if (!selectedProject) {
            alert('No selected project found!');
            return;
        }
        //alert(JSON.stringify(toDo));
        //alert(JSON.stringify(selectedProject.toDos));
        removeToDo(selectedProject, toDo);
        projects = projects.map(project => 
            project.selected ? selectedProject : project
        );
        //alert(JSON.stringify(selectedProject.toDos));
        //alert(JSON.stringify(projects));
        localStorage.setItem('projects', JSON.stringify(projects));
        render();

    });


    toDoFile.appendChild(container);
    toDoFile.appendChild(title);
    toDoFile.appendChild(dueDate);
    toDoFile.appendChild(editButton);
    toDoFile.appendChild(deleteButton);

    main.appendChild(toDoFile);

}

function deployProject (project) {
    const projectFile = document.createElement('li');
    projectFile.classList.add('project');

    const title = document.createElement('button');
    title.textContent = project.title;
    title.classList.add('categorie');

    projectFile.appendChild(title);

    ul.appendChild(projectFile);
}

function deployLocalProject (project) {
    const projectTitle = document.createElement('button');
    projectTitle.textContent = project.title;
    projectTitle.classList.add('categorie');

    if (project.selected) {
        projectTitle.id = 'selected';
    }


    baseOptions.appendChild(projectTitle);

}
function deployNote (note) {
    const noteFile = document.createElement('div');
    noteFile.classList.add('note');

    const title = document.createElement('h4');
    title.textContent = note.title;

    const detail = document.createElement('p');
    detail.textContent = note.detail;

    noteFile.appendChild(title);
    noteFile.appendChild(detail);

    main.appendChild(noteFile);
}

function localProject() {
    // Check if projects already exist in localStorage
    const existingProjects = JSON.parse(localStorage.getItem('projects'));
   
    
    if (!existingProjects) {
        // Create an array of Project objects
        const projects = [
            createProject('Home'),
            createProject('Today'),
            createProject('Week')
        ];

        projects[0].selected = true; // Select the first project by default

        // Save all Projects to localStorage as a single array
        localStorage.setItem('projects', JSON.stringify(projects));
    }
    else {
        updateProjectSelection('Home');
        render();
    }
}
    
window.addEventListener('load', () => {
    //localStorage.clear();
    localProject();
    const savedProjects = JSON.parse(localStorage.getItem('projects')) || [];
    savedProjects.forEach(project => {
        if (['Home', 'Today', 'Week'].includes(project.title)) {
            deployLocalProject(project);
        } else {
            deployProject(project);
        }
    });
    //alert(JSON.stringify(savedProjects));
});

function render() {
        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        //alert(JSON.stringify(projects));
        let selectedP = null;

        for (let i = 0; i < projects.length; i++) {
            if (projects[i].selected) {
                selectedP = projects[i];
                break; // Exit the loop once the selected project is found
            }
        }
        //alert(JSON.stringify(selectedP.toDos));

    main.innerHTML = '';

    /*if (selectedP.toDos = []) {
        const empty = document.createElement('p');
        empty.textContent = 'No To-Dos';
        main.appendChild(empty);
    }
    else{
        selectedP.toDos.forEach(deployToDo);
        
    }*/
    selectedP.toDos.forEach(deployToDo);

}
function getSelectedProject() {
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    let selectedProject = null;
    for (let i = 0; i < projects.length; i++) {
        if (projects[i].selected) {
            selectedProject = projects[i];
            break; // Exit the loop once the selected project is found
        }
        return selectedProject;
    }
    //alert(JSON.stringify(selectedProject));
    return selectedProject;
    alert(JSON.stringify(selectedProject));
}
render();