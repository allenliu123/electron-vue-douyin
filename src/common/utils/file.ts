const { ipcRenderer } = window.require('electron')

export function openFile(path: string) {
  ipcRenderer.send('openFile', path)
}
