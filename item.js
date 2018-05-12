class Item {
    constructor(title, description, date) {
        this.title = title
        this.description = description
        this.date = date
    }
}

class Category {
    constructor(title) {
        this.title = title
        this.items = []
        this.select
    }

    addItem(i) {
        this.items.push(i)
    }
}

class Project {
    constructor(title) {
        this.title = title
        this.categories = []
    }

    addCategory(c) {
        this.categories.push(c)
    }
}

let projects = []
let current
const remote = require('electron').remote

function min() {
    remote.getCurrentWindow().minimize()
}

function max() {
    let window = remote.getCurrentWindow()
    window.isMaximized() ? window.unmaximize() : window.maximize()
}

function destroy() {
    remote.getCurrentWindow().close()
}

function addProject(p) {
    projects.push(p)
}

function select(e) {
    current = open.categories[index(e)]
    updateCategory(current, true)
}

function newItem() {
    let i = new Item('New Item', 'Description', new Date().toISOString().split('T')[0])
    current.addItem(i)
    updateCategory(current, false)
}

function newCategory() {
    let c = new Category('New Category')
    open.addCategory(c)
    updateProject(open, false)
}

function index(e) {
    let i = 0
    while((e = e.previousSibling) != null) {
        i++
    }
    return i
}

function updateCategory(c, a) {
    let div = document.getElementById('category')
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
    for (let i = 0; i < c.items.length; i++) {
        let j = c.items[i]
        
        let item = document.createElement('div')
        item.classList.add('item')
        
        let date = document.createElement('input')
        date.type = 'date'
        date.classList.add('date')
        date.required = true
        date.value = j.date
        item.appendChild(date)

        let body = document.createElement('div')
        body.classList.add('body')
        
        let buttons = document.createElement('div')
        buttons.classList.add('buttons')

        let h2 = document.createElement('h2')
        h2.contentEditable = true
        h2.innerHTML = j.title
        buttons.appendChild(h2)

        let star = document.createElement('i')
        star.classList.add('material-icons')
        star.innerHTML = 'star'
        buttons.appendChild(star)

        let del = document.createElement('i')
        del.classList.add('material-icons')
        del.innerHTML = 'clear'
        buttons.appendChild(del)

        body.appendChild(buttons)
        item.appendChild(body)
        div.appendChild(item)

        item.style.animation = 'slide 0'
        if (a || i == c.items.length - 1) {
            item.style.animation = 'slide 0.2s'
        }
    }

    doCurrent()
}

function updateProject(p, a) {
    let div = document.getElementById('project')
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
    for (let i = 0; i < p.categories.length; i++) {
        let j = p.categories[i]
        
        let title = document.createElement('p')
        title.onclick = function() {
            select(title)
        }
        title.innerHTML = j.title
        j.select = title

        div.appendChild(title)
    }

    if (a) {
        current = p.categories[0]
    }
    doCurrent()
}

function doCurrent() {
    for (let i = 0; i < open.categories.length; i++) {
        let j = open.categories[i]
        j.select.classList.remove('selected')
    }
    current.select.classList.add('selected')
}


let c = new Category('a')
c.addItem(new Item('a', 'a', new Date().toISOString().split('T')[0]))

let d = new Category('b')
d.addItem(new Item('b', 'a', new Date().toISOString().split('T')[0]))

let open = new Project('a')
open.addCategory(c)
open.addCategory(d)
updateProject(open, true)

updateCategory(c, false)