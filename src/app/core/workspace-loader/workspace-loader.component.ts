import { ModuleLoaderComponent } from './../module-loader/module-loader.component';
import { Component, OnInit, Input, SimpleChange, ViewChild, Output, EventEmitter } from '@angular/core';
import { ConfigLoaderService } from './../config-loader/config-loader.service';
import { ListsComponent } from './../../wutzModules/lists/lists.component';
import { MemosComponent } from './../../wutzModules/memos/memos.component';
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
  @Input() remoteConnect;
  @Input() remoteWorkspaces;
  @Output() workspaceAdded = new EventEmitter();
  @Output() deleteWorkspace = new EventEmitter();
  @Output() listRemoteWorkspaces = new EventEmitter();
  @Output() importRemoteWorkspace = new EventEmitter();
  @Output() workspaceCreated = new EventEmitter();
  @Output() moduleChanged = new EventEmitter();
  @ViewChild('newWorkspaceName') newWorkspaceName;
  @ViewChild('newWorkspaceStorage') newWorkspaceStorage;
  @ViewChild(ModuleLoaderComponent) moduleLoader: ModuleLoaderComponent;
  deleteWorkspaceModal = false;
  wutzModules: any[];
  componentMap: any;
  appStorage: any;
  newWorkspace = {
    name: "",
    configFile: "",
    wutzModules: []
  };

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
    this.componentMap = configService.getComponentMap();
  }

  ngOnInit() {
  }

  createWorkspace() {
    let workspaceName = this.newWorkspaceName.nativeElement.value;
    console.log("Creating workspace with name", workspaceName);

    this.configService.setWorkspaceName(workspaceName);
    this.configService.setWorkspaceConfigFile(workspaceName + '.json');
    this.configService.setAppStorage(this.newWorkspaceStorage.nativeElement.value);
    let self = this;
    this.configService.createConfig()
      .then(function() {
        self.workspaceCreated.emit(workspaceName)
      })
      .catch(reason => 
        console.log(reason))
    
    this.newWorkspaceName.nativeElement.value = '';
  }

  addModuleToFutureWorkspace() {
    this.newWorkspace.wutzModules.push({});
  }

  loadWorkspace() {
    // console.log("Creating workspace", this.workspaceToDisplay.name, "with config file", this.workspaceToDisplay.configFile);
    this.configService.setWorkspaceName(this.workspaceToDisplay.name);
    this.configService.setWorkspaceConfigFile(this.workspaceToDisplay.configFile);
    this.configService.initConfig();
    this.wutzModules = this.configService.getModulesConfig();
    this.appStorage = this.configService.getAppStorage();
  }

  getRemoteWorkspaceList() {
    this.listRemoteWorkspaces.emit();
  }

  importRemoteWorkspaceEmit(workspaceName) {
    this.importRemoteWorkspace.emit(workspaceName);
  }

  getAvailableComponentsList() {
    return Object.keys(this.componentMap)
  }

  deleteWorkspaceEmit() {
    this.deleteWorkspace.emit();
  }
  
  onModuleChange(data) {
    if (this.hasToBeSynced(this.workspaceToDisplay)) {
      data.workspaceName = this.workspaceToDisplay.name;
      this.moduleChanged.emit(data);
    }
  }

  updateModule(moduleDataFile, moduleContent) {
    for (let mod of this.moduleLoader.moduleList) {
      if (mod.dataFile === moduleDataFile)
        mod.updateFromServer(JSON.parse(moduleContent));
    }
  }

  hasToBeSynced(workspaceName) {
    return this.remoteWorkspaces != null && this.remoteWorkspaces.includes(workspaceName);
  }
}
