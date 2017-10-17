import { Component, OnInit, Input, SimpleChange } from '@angular/core';
import { ConfigLoaderService } from './../config-loader/config-loader.service';

@Component({
  selector: 'app-workspace-loader',
  templateUrl: './workspace-loader.component.html',
  styleUrls: ['./workspace-loader.component.css'],
  providers: [ ConfigLoaderService ]
})
export class WorkspaceLoaderComponent implements OnInit {
  @Input() workspaceToDisplay;
  wutzModules: any[];
  appStorage: any;
  ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
    if (changes['workspaceToDisplay'] && this.workspaceToDisplay) {
      this.loadWorkspace();
    }
  }

  constructor(private configService: ConfigLoaderService) {
  }

  ngOnInit() {
  }

  loadWorkspace() {
    console.log("Creating workspace", this.workspaceToDisplay.name, "with config file", this.workspaceToDisplay.configFile);
    this.configService.setModuleConfigFile(this.workspaceToDisplay.configFile);
    this.configService.initConfig();
    this.wutzModules = this.configService.getModulesConfig();
    this.appStorage = this.configService.getAppStorage();
  }
}
