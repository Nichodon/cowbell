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

    setup() {
        for (let i = 0; i < this.items.length; i++) {
            let j = this.items[i]
            Object.setPrototypeOf(j, Item.prototype)
        }
    }
}

class Project {
    constructor(title) {
        this.title = title
        this.categories = [new Category('New Category')]
    }

    addCategory(c) {
        this.categories.push(c)
    }

    setup() {
        for (let i = 0; i < this.categories.length; i++) {
            let j = this.categories[i]
            Object.setPrototypeOf(j, Category.prototype)
            j.setup()
        }
    }
}

class Tasks {
    constructor() {
        this.overdue = []
        this.today = []
        this.tomorrow = []
        this.week = []
        this.later = []
    }
}

let projects = []
let current
const remote = require('electron').remote
const fs = require('fs');

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

function toggle() {
    document.getElementById('window').classList.remove('show')
}

function flip() {
    document.getElementById('second').classList.remove('show')
}

function addProject(p) {
    projects.push(p)
}

function select(e) {
    if (!e.classList.contains('selected')) {
        current = open.categories[index(e)]
        updateCategory(current, true)
    }
}

function newItem() {
    let i = new Item('New Item', 'Description', getISO(new Date()))
    current.addItem(i)
    updateCategory(current, false)
    save()
}

function newCategory() {
    let c = new Category('New Category')
    open.addCategory(c)
    updateProject(open, false)
    save()
}

function index(e) {
    let i = 0
    while((e = e.previousSibling) != null) {
        i++
    }
    return i
}

function edit(e) {
    current.items[index(e)].title = e.querySelector('h2').innerHTML
    current.items[index(e)].date = e.querySelector('input').value
    save()
}

let content = null

function change(e) {
    content = e
    e.contentEditable = true
    window.getSelection().selectAllChildren(e);
}

function modify(e) {
    open.categories[index(e)].title = e.querySelector('p').innerHTML
    save()
}

function bigChoose(e) {
    open = everything[index(e)]
    updateProject(open, true)
}

function removeItem(e) {
    e.style.animation = 'glide 0.2s forwards'
    setTimeout(function() {
        current.items.splice(index(e), 1)
        e.parentNode.removeChild(e)
    }, 200)
    save()
}

function removeCategory(e) {
    e.children[0].style.animation = 'glide 0.2s forwards'
    setTimeout(function() {
        open.categories.splice(index(e), 1)
        e.parentNode.removeChild(e)
        current = open.categories[0]
        updateProject(open, true)
        updateCategory(current, true)
    }, 200)
    save()
}

document.body.addEventListener('click', function(e) {
    if (e.target != content && e.target.innerHTML != 'edit' && content != null) {
        content.contentEditable = false
        content = null
    }
})

function getISO(date) {
    return date.toISOString().split('T')[0]
}

function sortItems() {
    let big = []
    for (let i = 0; i < everything.length; i++) {
        for (let j = 0; j < everything[i].categories.length; j++) {
            for (let k = 0; k < everything[i].categories[j].items.length; k++) {
                big.push(everything[i].categories[j].items[k])
            }
        }
    }
    big.sort(function(a, b) {
        return new Date(a.date) - new Date(b.date)
    })

    let tasks = new Tasks()
    
    var next = new Date()
    next.setDate(next.getDate() + 1)
    
    var after = new Date()
    after.setDate(after.getDate() + 7)

    for (let i = 0; i < big.length; i++) {
        if (getISO(new Date()) ==  getISO(new Date(big[i].date))) {
            tasks.today.push(big[i])
        } else if (new Date(big[i].date) - new Date() < 0) {
            tasks.overdue.push(big[i])
        } else if (new Date(big[i].date) - next < 0) {
            tasks.tomorrow.push(big[i])
        } else if (new Date(big[i].date) - after < 0) {
            tasks.week.push(big[i])
        } else {
            tasks.later.push(big[i])
        }
    }

    console.log(tasks)
    let div = document.getElementById('list')
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
    for (let k = 0; k < 5; k++) {
        let due = ['overdue', 'today', 'tomorrow', 'week', 'later'][k]

        let h1 = document.createElement('h1')
        h1.innerHTML = due
        div.appendChild(h1)

        for (let i = 0; i < tasks[due].length; i++) {
            let j = tasks[due][i]
            
            let item = document.createElement('div')
            item.classList.add('item')
            
            let date = document.createElement('input')
            date.type = 'date'
            date.classList.add('date')
            date.disabled = true
            date.value = j.date
            item.appendChild(date)
    
            let fixed = document.createElement('div')
    
            let h2 = document.createElement('h2')
            h2.innerHTML = j.title
            fixed.appendChild(h2)
    
            item.appendChild(fixed)
            div.appendChild(item)
        }
    }
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
        date.oninput = function() {
            edit(item)
        }
        date.value = j.date
        item.appendChild(date)

        let fixed = document.createElement('div')

        let h2 = document.createElement('h2')
        h2.contentEditable = true
        h2.oninput = function() {
            edit(item)
        }
        h2.innerHTML = j.title
        fixed.appendChild(h2)
        
        h2.addEventListener('keypress', function(e) {
            if (e.which === 13) {
                e.preventDefault();
            }
        });

        item.appendChild(fixed)

        let star = document.createElement('i')
        star.classList.add('material-icons')
        star.innerHTML = 'star'
        item.appendChild(star)

        let del = document.createElement('i')
        del.classList.add('material-icons')
        del.onclick = function() {
            removeItem(item)
        }
        del.innerHTML = 'clear'
        item.appendChild(del)
        
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

        let wrap = document.createElement('div')
        wrap.onclick = function() {
            select(wrap)
        }
        j.select = wrap
        
        let title = document.createElement('p')
        title.oninput = function() {
            modify(wrap)
        }
        title.innerHTML = j.title
        wrap.appendChild(title)

        let edit = document.createElement('i')
        edit.classList.add('material-icons')
        edit.onclick = function() {
            change(title)
        }
        edit.innerHTML = 'edit'
        wrap.appendChild(edit)

        let clear = document.createElement('i')
        clear.classList.add('material-icons')
        clear.onclick = function() {
            removeCategory(wrap)
        }
        clear.innerHTML = 'clear'
        wrap.appendChild(clear)

        div.appendChild(wrap)

        title.style.animation = 'slide 0'
        if (!a && i == p.categories.length - 1) {
            title.style.animation = 'slide 0.2s'
        }
    }

    if (a) {
        current = p.categories[0]
        updateCategory(current, true)
    }
    doCurrent()

    document.getElementById('window').classList.add('show')
    document.getElementById('title').innerHTML = p.title
}

function updateEverything() {
    let div = document.getElementById('menu')
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
    for (let i = 0; i < everything.length; i++) {
        let j = everything[i]
        
        let thing = document.createElement('div')

        let h1 = document.createElement('h1')
        h1.onclick = function() {
            bigChoose(thing)
        }
        h1.innerHTML = j.title
        thing.appendChild(h1)

        let edit = document.createElement('i')
        edit.classList.add('material-icons')
        edit.innerHTML = 'edit'
        thing.appendChild(edit)

        let clear = document.createElement('i')
        clear.classList.add('material-icons')
        clear.innerHTML = 'clear'
        thing.appendChild(clear)

        div.appendChild(thing)
    }
}

function doCurrent() {
    for (let i = 0; i < open.categories.length; i++) {
        let j = open.categories[i]
        j.select.classList.remove('selected')
    }
    current.select.classList.add('selected')
}

function showTasks() {
    document.getElementById('second').classList.add('show')
}

let everything

fs.readFile("test.json", function(err, data) {
    everything = JSON.parse(data)
    for (let i = 0; i < everything.length; i++) {
        Object.setPrototypeOf(everything[i], Project.prototype)
        everything[i].setup()
    }
    open = everything[0]
    updateProject(open, true)
    updateEverything()

    sortItems()
})

function save() {
    let json = JSON.parse(JSON.stringify(everything))
    fs.writeFile("test.json", JSON.stringify(json, null, '\t'), function(err) {})
}