import { Component, OnInit, Input, SimpleChange, ViewChild } from '@angular/core';
import { ConfigLoaderService } from './../config-loader/config-loader.service';
import { ListsComponent } from './../../wutzModules/lists/lists.component';
import { MemosComponent } from './../../wutzModules/memos/memos.component';

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
  ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
    if (changes['workspaceToDisplay'] && this.workspaceToDisplay) {
      if (this.workspaceToDisplay !== 'new')
        this.loadWorkspace();
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
    console.log("Creating workspace", this.workspaceToDisplay.name, "with config file", this.workspaceToDisplay.configFile);
    this.configService.setModuleConfigFile(this.workspaceToDisplay.configFile);
    this.configService.initConfig();
    this.wutzModules = this.configService.getModulesConfig();
    this.appStorage = this.configService.getAppStorage();
  }

  getAvailableComponentsList() {
    return Object.keys(this.componentMap)
  }
  componentMap = {
    'ListsComponent': ListsComponent,
    'MemosComponent': MemosComponent
  };
}
