const { app, BrowserWindow } = require('electron')

const createWindow = () => {
    const win = new BrowserWindow({
      width: 1000,
      height: 600,
      minWidth: 1000,
      show:false,
      zoomFactor:0.5 ,
      autoHideMenuBar: true ,
      icon: __dirname+"/public/Graphicloads-Flat-Finance-Lock.ico"   
    })
  
    win.loadFile('./build/index.html')
    win.once('ready-to-show', () => {
      win.show()
    })
  }

  app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })