const taskInput = document.querySelector(".task-input");
const addBtn = document.querySelector(".add-btn")
let taskList = document.querySelector(".task-list")
const emptyState = document.querySelector(".empty-state")
const taskCount = document.querySelector(".task-count")
const filters = document.querySelector(".filters")
const savedList = localStorage.getItem("lists")
const filtersBtn = document.querySelectorAll(".filters__btn")
let lists = savedList ? JSON.parse(savedList) : []
let currentFilter = "all"
filterTask(currentFilter)

filters.addEventListener("click", function (e) {
    if (e.target.classList.contains("completed")) {
        currentFilter = "completed"
        filterTask(currentFilter)
    } else if (e.target.classList.contains("active")) {
        currentFilter = "active"
        filterTask(currentFilter)
    } else if (e.target.classList.contains("all")) {
        currentFilter = "all"
        filterTask(currentFilter)
    }
    
    if (e.target.classList.contains("clear")) {
        updateFiltersUi(e)
        clearCompleted()
        return
      
    }
    updateFiltersUi(e)
})


function filterTask(filterType) {
    let visibleTasks = lists
    if (lists.length === 0) {
        updateUI(visibleTasks)
        updateTaskCount(lists)
        return
    }

    if (filterType === "completed") {
        visibleTasks = lists.filter(task => task.completed)
    } else if (filterType === "active") {
        visibleTasks = lists.filter(task => !task.completed)
    }else if (filterType === "all") {
        visibleTasks = lists
    }
    updateTaskCount(lists)
    updateUI(visibleTasks)

}

function clearCompleted(){
 lists = lists.filter(task => !task.completed)
saveToLocalStorage()
filterTask(currentFilter)
}
function updateUI(list) {
    display(list)
    re_render(list)
}

function display(list) {
    if (list.length === 0) {
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none"
    }
}

function re_render(tasks) {
    taskList.innerHTML = ""
    tasks.forEach(task => render(task))
}

function saveToLocalStorage() {
    localStorage.setItem("lists", JSON.stringify(lists))
}

function createTask() {
    const value = taskInput.value.trim()
    if (value === "") return;
    const obj = {
        id: Date.now(),
        name: value,
        completed: false,
        edit: false
    }
    lists.push(obj)
    saveToLocalStorage()
    return obj
}

function render(newTask) {
    const data = newTask
    const { id, name, completed, edit } = data
    const task = document.createElement("li")
    task.dataset.id = id;
    task.className = `task ${completed ? "completed task-completed" : ""} ${edit ? "edit-style" : ""} `
    task.innerHTML = `<div class="task-content"><input type="checkbox" class="checked" ${completed ? "checked" : ""} >  ${edit ? `<input type="text" class="edit-input" value = "${name}">` : `<span class="task-text">${name}</span>`}</div> <div class="btn__content">${edit ? `<button class="save-btn">save</button>` : `<button class="edit-btn"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg></button>`} <button class="delete-btn"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button></div>`
    taskList.append(task)
}


function addTask() {
    const task = createTask()
    if (!task) return
    taskInput.value = ""
    filterTask(currentFilter)
}

function updateTaskCount(tasks) {
    const taskLeft = tasks.filter(task => !task.completed).length
    taskCount.textContent = `${taskLeft} Task${taskLeft !== 1 ? "s" : ""} left`
}

function list__task(e) {
    const task = e.target.closest(".task")
    return task
}

function task__id(e) {
    const task = list__task(e)
    if (!task) return
    return Number(task.dataset.id)
}

function delete__btn(e) {
    const task = list__task(e)
    const deletebtn = e.target.closest(".delete-btn")
    if (!deletebtn) return
    const id = task__id(e)
    if (!id) return
    task.classList.add("deleted")
    lists = lists.filter(task => task.id !== id)
    saveToLocalStorage()
    setTimeout(() => {
    filterTask(currentFilter);
}, 300);
}

function edit__btn(e) {
    const editBtn = e.target.closest(".edit-btn")
    if (!editBtn) return
    const id = task__id(e)
    if (!id) return
    const editItem = lists.find(task => task.id === id)
    if (!editItem) return
    editItem.edit = true
    filterTask(currentFilter)
    const newTask = taskList.querySelector(`[data-id="${id}"]`)
    const editInput = newTask.querySelector(".edit-input")
    editInput.focus()
    editInput.select()
}

function save__action(e){
     const id = task__id(e)
    if (!id) return
    const editItem = lists.find(item => item.id === id)
    const newTask = taskList.querySelector(`[data-id = "${id}"]`)
    const editInput = newTask?.querySelector(".edit-input")
    const editValue = editInput?.value.trim()
    if (!editValue) {
        editInput.focus()
        editInput.placeholder = "Enter your task..."
        return
    }
    editItem.name = editValue
    editItem.edit = false
    saveToLocalStorage()
    filterTask(currentFilter)
    } 

function save__btn(e) {
    const saveBtn = e.target.closest(".save-btn")
    if (!saveBtn) return
    save__action(e)
}

function checked__btn(e) {
    const checked__box = e.target.closest(".checked")
    if (!checked__box) return
    const checked = checked__box.checked
    const task = list__task(e)
    const id = task__id(e)
    if (!id) return
    const markCompleted = lists.find(task => task.id === id)
    if (!markCompleted) return
    task.classList.toggle("completed")
    task.classList.toggle("task-completed")
     markCompleted.completed = checked
    saveToLocalStorage()
    setTimeout(()=>{
     filterTask(currentFilter)   
    },300)
}
function updateFiltersUi(e){
const filter__btn = e.target.closest(".filters__btn")
console.log(filter__btn)
if (!filter__btn) return
filtersBtn.forEach(btn => {
    btn.classList.remove("filters-clicked")
})
filter__btn.classList.add("filters-clicked")
}

function taskOperations(e) {
    delete__btn(e)
    edit__btn(e)
    save__btn(e)
    checked__btn(e)
}
addBtn.addEventListener("click", addTask)
taskList.addEventListener("click", taskOperations);
taskInput.addEventListener("keydown",function(e){
    if (e.key === "Enter") addTask()
})
taskList.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    if (!e.target.classList.contains("edit-input")) return;
    save__action(e);
});

