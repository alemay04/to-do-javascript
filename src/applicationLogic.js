
function toDo (title, detail, dueDate, priority, project) {
    this.title = title;
    this.detail = detail;
    this.dueDate = dueDate;
    this.priority = priority;
    this.project = project;
}

function createToDo (title, detail, dueDate, priority, project) {
    return new toDo (title, detail, dueDate, priority, project);
}

function project (title) {
    this.title = title;
    this.toDos = [];
}

function createProject (title) {
    return new project (title);
}

function addToDo (project, toDo) {
    project.toDos.push(toDo);
}

function removeToDo (project, toDo) {
    project.toDos = project.toDos.filter(item => item !== toDo);
}

function editToDo (toDo, title, detail, dueDate, priority, project) {
    toDo.title = title;
    toDo.detail = detail;
    toDo.dueDate = dueDate;
    toDo.priority = priority;
}

function editProject (project, title) {
    project.title = title;
}



