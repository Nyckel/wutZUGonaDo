import { async } from '@angular/core/testing';
import { WorkspaceLoaderComponent } from './core/workspace-loader/workspace-loader.component';
import { Component, Type, ViewChild } from '@angular/core';
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
  @ViewChild(WorkspaceLoaderComponent) workspaceLoader: WorkspaceLoaderComponent;
  title = 'wutZUGonaDo';
  wutzModules;
  workspaces = [];
  selectedWorkspace: any;  
  windowMaximized = false;
  appStorage = remote.app.getPath("userData");
  dataPath = path.join(this.appStorage, "Data");
  configPath = path.join(this.appStorage, "Config");
  workspacePath = path.join(this.configPath, "workspaces");
  remoteConnected = false;

  socket: any;
  remoteWorkspaces: string[];
  remoteHost = 'http://localhost:4444';

  constructor() {
    this.checkPrerequisites()
      .then((firstLaunch: boolean) => this.listWorkspaces(firstLaunch));
   
    this.socket = io(this.remoteHost); // TODO: make remote host dynamic
    this.initSocketListeners();
  }

  checkPrerequisites() {
    let firstLaunch = false;
    return new Promise((resolve, reject) => {
      // Check Config, Config/workspaces, Data

      // Create Data
      this.checkWorkspacePathExists(this.dataPath)
      .catch(err => {
        return this.createWorkspaceFolder(this.dataPath);
      })
      // Create Config
      .then(() => { return this.checkWorkspacePathExists(this.configPath)})
      .catch(err => {
        console.log("Must be first launch as no workspace file was found")
        return this.createWorkspaceFolder(this.configPath);
      })
      .then(() => { return this.checkWorkspacePathExists(this.workspacePath)})
      .catch(err => {
        firstLaunch = true;
        return this.createWorkspaceFolder(this.workspacePath);
      })
      .catch(err => {
        console.error("Could not create workspace folder", err);
      })
      .then(() => {
          resolve(firstLaunch);
      })


    }) // End of promise
  }


  listWorkspaces(firstLaunch = false) {
    console.log("Firstlaunch: ", firstLaunch);
    
    if (firstLaunch) {
      this.createDefaultWorkspace(this.workspacePath).then(() => {
        this.listWorkspacesInFolder(this.workspacePath);
      });
    } else {
          this.listWorkspacesInFolder(this.workspacePath);
    } 
  }

  createDefaultWorkspace(workspacePath: string) {
    return new Promise((resolve, reject) => {
      console.log("Creating default workspace");
      let defaultContent = {
        appStorage: "Data",
        wutzModules: [],
        remoteConfigFile: []
      }
    
      let workspaceDataFolder = path.join(this.dataPath, "default");
      this.checkWorkspacePathExists(workspaceDataFolder)
      .catch(err => {
        return this.createWorkspaceFolder(workspaceDataFolder);
      })

      fs.writeFile(path.join(workspacePath, "default.json"), JSON.stringify(defaultContent), { encoding: 'utf8' },
       err => {
        if (err) {
          reject("Error creating default workspace" + err);
        }
        resolve();
      });
    });
  }

  listWorkspacesInFolder(workspacePath: string) {
    this.workspaces = [];
    let files = fs.readdirSync(workspacePath);

    files.forEach(file => {
      this.workspaces.push({
        name: file.split('.json')[0],
        configFile: file
      })
    });

    if (this.workspaces.length > 1) {
      this.selectedWorkspace = this.workspaces[0].name == 'default' ? this.workspaces[1] : this.workspaces[0];
    } else {
      this.selectedWorkspace = this.workspaces[0];
    }
  }


  checkWorkspacePathExists(workspacePath: string) {
    return new Promise((resolve, reject) => {
      fs.stat(workspacePath, (err, stats) => {
        if (err) {
          reject("Could not find workspace folder:" + err);
          return;
        }
        if (stats.isDirectory()) {
          resolve();
        } else console.log("Strange,", workspacePath, "is not a directory");

        reject("Workspace path does not fit requirement");
      })
    })
  }

  createWorkspaceFolder(workspacePath: string) {
    console.log("Trying to create", workspacePath, "...");
    return new Promise((reject, resolve) => {
      fs.mkdir(workspacePath, err => {
        if (err) {
          reject("Could not create workspace directory" + err);
          return;
        }
        else resolve();
      });
    });
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

    this.socket.on('moduleServerUpdate', data => {
      if (data.workspaceName === this.selectedWorkspace.name) {
        this.workspaceLoader.updateModule(data.dataFile, data.content);
      } else {
        for (let work of this.workspaces) {
          console.log(work);
          if (work.name === data.workspaceName)
            this.importData(path.join(this.appStorage, data.workspaceName), data.dataFile, data.content);
        }
      }
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

  onModuleChanged(data) {
    this.socket.emit('updateModule', data);
  }

  onWorkspaceCreation(name: string) {
    console.log("Received: " + name);
    this.listWorkspaces();
    for (let w of this.workspaces) {
      if (w.name == name) {
        this.selectedWorkspace = w;
        break;
      }
    }
  }
}

document.ondragover = document.ondrop = (ev) => {
  ev.preventDefault()
}

document.body.ondrop = (ev) => {
  // console.log(ev.dataTransfer.files[0].path)
  ev.preventDefault()
}