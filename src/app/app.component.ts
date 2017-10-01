import { ConfigLoaderService } from './core/config-loader/config-loader.service';
import { Component, Type } from '@angular/core';
import { ListsComponent } from './wutzModules/lists/lists.component';
import { MemosComponent } from './wutzModules/memos/memos.component';
import { ipcRenderer, remote } from 'electron';
import * as path from 'path';

// import { remote, ipcRenderer } from 'electron';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ ConfigLoaderService ]
})
export class AppComponent {
  title = 'wutZUGonaDo';
  wutzModules;
  windowMaximized = false;
  appStorage: string[]; // TODO: replace by an object that handles read, write... on these locations
  
  constructor(configService: ConfigLoaderService) {
    /* TODO: Should get main config file, parse modules in it
    and give it their config files and defaut storage */
    this.wutzModules = configService.getModulesConfig();

    // this.appStorage = [
    //   path.join(__dirname, "..", "Data")
    // ]
    this.appStorage = configService.getAppStorage();
    
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