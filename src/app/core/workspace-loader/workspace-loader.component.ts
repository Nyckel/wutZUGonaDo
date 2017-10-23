import { Component, OnInit, Input, SimpleChange, ViewChild } from '@angular/core';
import { ConfigLoaderService } from './../config-loader/config-loader.service';
import { ListsComponent } from './../../wutzModules/lists/lists.component';
import { MemosComponent } from './../../wutzModules/memos/memos.component';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-workspace-loader',
  templateUrl: './workspace-loader.component.html',
  styleUrls: ['./workspace-loader.component.css'],
  providers: [ ConfigLoaderService ]
})
export class WorkspaceLoaderComponent implements OnInit {
  @Input() workspaceToDisplay;
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
      console.log('imported workspace: ', data);
    });
  }
}
