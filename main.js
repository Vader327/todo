const electron = require('electron');
const url = require('url');
const path = require('path');
require('electron-reload')(__dirname);

let { PythonShell } = require('python-shell')

const { app, BrowserWindow, ipcMain, Notification } = electron;
var mainWindow;
var addWindow;

app.on('ready', function(){
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    }
  })
  //mainWindow.setMenuBarVisibility(false)
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'mainWindow.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.on('closed', function(){
    app.quit();
  });
})

ipcMain.on('open_window', function(){
  addWindow = new BrowserWindow({
    width: 400,
    height: 380,
    title: "Add Task",
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'addWindow.html'),
    protocol: 'file:',
    slashes:true
  }));
  addWindow.on('close', function(){
    addWindow = null;
  });
  addWindow.setMenuBarVisibility(false)
});

ipcMain.on('add_task', function(e, item){
  mainWindow.webContents.send('add_task', item);
  BrowserWindow.getFocusedWindow().close();

  if(item.time != null){
    let pyshell = new PythonShell('worker.py');
    pyshell.send(item.time).end();
    pyshell.on('message', function(message){
      notification = new Notification({title: 'Reminder', body: item.name});
      notification.show();
      mainWindow.webContents.send('delete_task', item.name);
    })
  }
})