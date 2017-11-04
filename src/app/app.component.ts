import { Component, Type } from '@angular/core';
import { ListsComponent } from './wutzModules/lists/lists.component';
import { MemosComponent } from './wutzModules/memos/memos.component';
import { ipcRenderer, remote } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as io from 'socket.io-client';

// import { remote, ipcRenderer } from 'electron';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'wutZUGonaDo';
  wutzModules;
  workspaces = [];
  selectedWorkspace: any;  
  windowMaximized = false;
  appStorage = "Data"; // TODO: replace by an object that handles read, write... on these locations
  remoteConnected = false;

  socket: any;
  remoteWorkspaces: string[];
  remoteHost = 'http://localhost:4444';

  constructor() {
    let workspacePath = "Config/workspaces";
    this.workspaces = [];
    let files = fs.readdirSync(workspacePath);
    files.forEach(file => {
      this.workspaces.push({
        name: file.split('.json')[0],
        configFile: file
      })
    });
    
    this.selectedWorkspace = this.workspaces[0];  

    this.socket = io(this.remoteHost); // TODO: make remote host dynamic
    this.initSocketListeners();
  }


  closeWindow() {
    console.log("Close!");
    let window = remote.getCurrentWindow();
    // window.close();
    window.hide();
  }
  
  minimizeWindow() {
    let window = remote.getCurrentWindow();	
    window.minimize();
  }
  maximizeWindow() {
    let window = remote.getCurrentWindow();	
    this.windowMaximized ? window.unmaximize() : window.maximize();
    this.windowMaximized = !this.windowMaximized;

  }
  
  openSettings() {
  	let data;
  	ipcRenderer.send('openSettings', data);
  }
  closeSettings() {
    ipcRenderer.send('closeSettings');
  }

  exit() {
    let window = remote.getCurrentWindow();
    window.close();    
  }

  addWorkspaceToList(newWorkspace: any) {
    this.workspaces.push(newWorkspace);
    let myNotification = new Notification('WutzUGonaDo', {
      body: 'Workspace "'+ newWorkspace.name +'" has been imported'
    });
  }

  onRemoteStatusChange(connected: boolean) {
    this.remoteConnected = connected;
  }

  deleteSelectedWorkspace() {
    let workspacePath = "Config/workspaces";    
    fs.unlink(path.join(workspacePath, this.selectedWorkspace.configFile), err => {
      if (!err) {
        this.workspaces.splice(this.workspaces.indexOf(this.selectedWorkspace), 1);
        this.selectedWorkspace = this.workspaces[0];
      } else {
        console.error("Error, couldn't delete workspace");
      }
    });
  }

  getRemoteWorkspaceList() {
    this.socket.emit('listWorkspaces', '');
  }

  importRemoteWorkspace(workspaceName) {
    console.log(workspaceName);
    this.socket.emit('importWorkspace', workspaceName);
  }

  initSocketListeners() {
    this.socket.on('connect', data => {
      this.getRemoteWorkspaceList();
      this.remoteConnected = true;
    });
    this.socket.on('disconnect', data => {
      this.remoteConnected = false;
    });
    this.socket.on('event', data => {
      console.log(data);
    });

    this.socket.on('listWorkspaces', list => {
      this.remoteWorkspaces = list;
    });

    this.socket.on('importWorkspace', data => {
      console.log("Importing workspace", data.name);
      this.importData(path.join(data.name, '..', 'Config', 'workspaces'), data.file, data.content);
      this.addWorkspaceToList(
        {
          name: data.name,
          configFile: data.file
        }
      );
    });

    this.socket.on('importWorkspaceData', data => {
      this.importData(path.join(this.appStorage, data.workspace), data.fileName, data.content);
    });
  }

  importData(folder: string, file: string, content: any) {
    fs.mkdir(folder, err => {
      if (!err || err.code === 'EEXIST') {
        fs.writeFile(
          path.join(folder, file), content, { encoding: 'utf8' }, err => {
            if (err) {
              console.error("Error importing workspace data: ", err);
            }
          });
      } else {
        console.error(err);
      }
    })
  }
}

document.ondragover = document.ondrop = (ev) => {
  ev.preventDefault()
}

document.body.ondrop = (ev) => {
  console.log(ev.dataTransfer.files[0].path)
  ev.preventDefault()
}