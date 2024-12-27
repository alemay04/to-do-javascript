
export function toDo (title, detail, dueDate, priority, project) {
    this.title = title;
    this.detail = detail;
    this.dueDate = dueDate;
    this.priority = priority;
    this.project = project;
}

export function createToDo (title, detail, dueDate, priority) {
    return new toDo (title, detail, dueDate, priority);
}

export function project (title) {
    this.title = title;
    this.toDos = [];
    this.selected = false;
}

export function createProject (title) {
    return new project (title);
}

export function note (title, detail) {
    this.title = title;
    this.detail = detail;
}

export function createNote (title, detail) {
    return new note (title, detail);
}

export function addToDo (project, toDo) {
    project.toDos.push(toDo);
}

export function removeToDo (project, toDo) {
    function isEqual(obj1, obj2) {
        if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
            return obj1 === obj2;
        }
    
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);
    
        if (keys1.length !== keys2.length) {
            return false;
        }
    
        return keys1.every(key => isEqual(obj1[key], obj2[key]));
    }
    project.toDos = project.toDos.filter(item => !isEqual(item, toDo));
}

export function editToDo (toDo, title, detail, dueDate, priority) {
    toDo.title = title;
    toDo.detail = detail;
    toDo.dueDate = dueDate;
    toDo.priority = priority;
}

export function editProject (project, title) {
    project.title = title;
}



