import { Component, OnInit, Input, SimpleChange, ViewChild, Output, EventEmitter } from '@angular/core';
import { ConfigLoaderService } from './../config-loader/config-loader.service';
import { ListsComponent } from './../../wutzModules/lists/lists.component';
import { MemosComponent } from './../../wutzModules/memos/memos.component';
import * as io from 'socket.io-client';
import * as path from 'path';
import * as fs from 'fs';

@Component({
  selector: 'app-workspace-loader',
  templateUrl: './workspace-loader.component.html',
  styleUrls: ['./workspace-loader.component.css'],
  providers: [ ConfigLoaderService ]
})
export class WorkspaceLoaderComponent implements OnInit {
  @Input() workspaceToDisplay;
  @Output() workspaceAdded = new EventEmitter();
  @ViewChild('newWorkspaceName') newWorkspaceName;
  wutzModules: any[];
  appStorage: any;
  newWorkspace = {
    name: "",
    configFile: "",
    wutzModules: []
  };
  socket: any;
  remoteWorkspaces: string[];
  remoteHost = 'http://localhost:4444';

  ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
    if (changes['workspaceToDisplay'] && this.workspaceToDisplay) {
      if (this.workspaceToDisplay !== 'new')
        this.loadWorkspace();
      else {
        this.getRemoteWorkspaceList();
      }
    }
  }

  constructor(private configService: ConfigLoaderService) {
    this.socket = io(this.remoteHost); // TODO: make remote host dynamic
    this.initSocketListeners();
  }

  ngOnInit() {
  }

  addWorkspace() {
    console.log("Adding workspace with name", this.newWorkspaceName.nativeElement.value);
    
    this.newWorkspaceName.nativeElement.value = '';
  }

  addModuleToFutureWorkspace() {
    this.newWorkspace.wutzModules.push( {})
  }

  loadWorkspace() {
    // console.log("Creating workspace", this.workspaceToDisplay.name, "with config file", this.workspaceToDisplay.configFile);
    this.configService.setWorkspaceName(this.workspaceToDisplay.name);
    this.configService.setModuleConfigFile(this.workspaceToDisplay.configFile);
    this.configService.initConfig();
    this.wutzModules = this.configService.getModulesConfig();
    this.appStorage = this.configService.getAppStorage();
  }

  getRemoteWorkspaceList() {
    this.socket.emit('listWorkspaces', '');
  }

  importRemoteWorkspace(workspaceName) {
    console.log(workspaceName);
    this.socket.emit('importWorkspace', workspaceName);
  }

  getAvailableComponentsList() {
    return Object.keys(this.componentMap)
  }
  componentMap = {
    'ListsComponent': ListsComponent,
    'MemosComponent': MemosComponent
  };

  initSocketListeners() {
    this.socket.on('connect', data => {
      this.getRemoteWorkspaceList();
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
      this.workspaceAdded.emit(
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
