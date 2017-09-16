import { ListsComponent } from './wutzModules/lists/lists.component';
import { Component, Type } from '@angular/core';
import { ipcRenderer, remote } from 'electron';

// import { remote, ipcRenderer } from 'electron';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'wutZUGonaDo';
  wutzModules;
  windowMaximized = false;
  
  constructor() {
    this.wutzModules = [
      {
        name: "lists",
        component: ListsComponent,
        selector: "app-lists",
        index: 1,
        height: "200px"
      }
    ];
    
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
/*
Dynamic modules inclusion
https://angular.io/guide/dynamic-component-loader
  Storage structure tree
  Storage
  App
    Modules.json
  Modules
    lists.json
    Memos
      memo1.txt
      memo2.txt
*/