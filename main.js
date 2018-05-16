const {app, BrowserWindow} = require('electron')
const path = require('path')

function dothething() {
  win = new BrowserWindow({
    width: 1024,
    height: 768,
    frame: false,
    icon: 'cowbell.png',
    title: 'Cowbell'
  })
  
  win.loadURL(path.join(__dirname, 'index.html'))
}

app.on('ready', dothething)