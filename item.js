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
const remote = require('electron').remote;

function destroy() {
    remote.getCurrentWindow().close()
}

function addProject(p) {
    projects.push(p)
}

function updateCategory(c) {
    let div = document.getElementById('category')
    /*while (div.firstChild) {
        div.removeChild(div.firstChild);
    }*/
    for (let i = 0; i < c.items.length; i++) {
        let j = c.items[i]
        
        let item = document.createElement('div')
        item.classList.add('item')
        
        let date = document.createElement('p')
        date.classList.add('date')
        date.innerHTML = j.date
        item.appendChild(date)

        let body = document.createElement('div')
        body.classList.add('body')
        
        let buttons = document.createElement('div')
        buttons.classList.add('buttons')

        let h2 = document.createElement('h2')
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
    }
}

let c = new Category('a')
c.addItem(new Item('a', 'a', 'a'))
updateCategory(c)