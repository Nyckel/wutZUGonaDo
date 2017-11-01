import { Component, Type } from '@angular/core';
import { ListsComponent } from './wutzModules/lists/lists.component';
import { MemosComponent } from './wutzModules/memos/memos.component';
import { ipcRenderer, remote } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

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
  appStorage: string[]; // TODO: replace by an object that handles read, write... on these locations
  remoteConnected = false;

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
}

document.ondragover = document.ondrop = (ev) => {
  ev.preventDefault()
}

document.body.ondrop = (ev) => {
  console.log(ev.dataTransfer.files[0].path)
  ev.preventDefault()
}