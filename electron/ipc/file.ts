const { ipcMain, dialog, shell } = require('electron')

export default function handleIPC() {
  ipcMain.on('openFile', (evt, args) => {
    shell.showItemInFolder(args)
  })
}