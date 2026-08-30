const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('qrprint', { stores: { list: () => ipcRenderer.invoke('stores:list'), create: n => ipcRenderer.invoke('stores:create', n) }, jobs: { list: () => ipcRenderer.invoke('jobs:list'), complete: id => ipcRenderer.invoke('jobs:complete', id), collect: code => ipcRenderer.invoke('jobs:collect', code) } });
