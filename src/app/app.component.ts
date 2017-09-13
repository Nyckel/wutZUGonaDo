import { ListsComponent } from './wutzModules/lists/lists.component';
import { Component, Type } from '@angular/core';
// import { remote, ipcRenderer } from 'electron';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'wutZUGonaDo';
  wutzModules;
  
  constructor() {
    this.wutzModules = [
      {
        name: "lists",
        component: ListsComponent,
        selector: "app-lists",
        index: 1,
        height: "200px"
      },
      {
        name: "lists",
        component: ListsComponent,
        selector: "app-lists",
        index: 1,
        height: "200px"
      }
    ];
    
  }

  openSettings() {
    let data: any;
    // ipcRenderer.send('openSettings', data);
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