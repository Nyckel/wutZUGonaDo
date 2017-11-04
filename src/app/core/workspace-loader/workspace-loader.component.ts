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
  @Input() remoteWorkspaces;
  @Output() workspaceAdded = new EventEmitter();
  @Output() deleteWorkspace = new EventEmitter();
  @Output() listWorkspaces = new EventEmitter();
  @Output() importRemoteWorkspace = new EventEmitter();
  @Output() moduleChanged = new EventEmitter();
  @ViewChild('newWorkspaceName') newWorkspaceName;
  @ViewChild(ModuleLoaderComponent) moduleLoader: ModuleLoaderComponent;
  deleteWorkspaceModal = false;
  wutzModules: any[];
  appStorage: any;
  newWorkspace = {
    name: "",
    configFile: "",
    wutzModules: []
  };
  remoteConnected = false;

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
    this.listWorkspaces.emit();
  }

  importRemoteWorkspaceEmit(workspaceName) {
    this.importRemoteWorkspace.emit(workspaceName);
  }

  getAvailableComponentsList() {
    return Object.keys(this.componentMap)
  }
  componentMap = {
    'ListsComponent': ListsComponent,
    'MemosComponent': MemosComponent
  };

  deleteWorkspaceEmit() {
    this.deleteWorkspace.emit();
  }
  
  onModuleChange(data) {
    data.workspaceName = this.workspaceToDisplay.name;
    this.moduleChanged.emit(data);
  }

  updateModule(moduleDataFile, moduleContent) {
    for (let mod of this.moduleLoader.moduleList) {
      if (mod.dataFile === moduleDataFile)
        mod.updateFromServer(JSON.parse(moduleContent));
    }
  }
}
