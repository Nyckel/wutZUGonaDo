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
  // workspaces = [];
  workspaces = [
    {
      name: "Default",
      configFile: "default.json"
    },
    {
      name: "Home",
      configFile: "home.json"
    }
  ]; // TODO: Load workspaces dynamically listing jsons in 'workspaces' folder
  selectedWorkspace = this.workspaces[0];
  
  windowMaximized = false;
  appStorage: string[]; // TODO: replace by an object that handles read, write... on these locations
  
  constructor() {
    // let workspacePath = "Config/workspaces";
    // fs.readdir(workspacePath, (err, files) => {
    //   if (!err) {
    //     files.forEach(file => {
    //       this.workspaces.push({
    //         name: file.split('.json')[0],
    //         configFile: file
    //       })
    //     });
    //   } else {
    //     console.log("Error loading workspaces:", err);
    //   }
    // })
    // this.selectedWorkspace = this.workspaces[0];
  
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

}

document.ondragover = document.ondrop = (ev) => {
  ev.preventDefault()
}

document.body.ondrop = (ev) => {
  console.log(ev.dataTransfer.files[0].path)
  ev.preventDefault()
}