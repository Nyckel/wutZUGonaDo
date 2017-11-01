import { Injectable } from '@angular/core';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ConfigLoaderService {
  config: any[];
  appConfFile = path.join(__dirname,"../Config/appConf.json");
  name: string;

  constructor() {
    // this.initConfig();
  }

  initConfig() {
    try {
      this.config = JSON.parse(fs.readFileSync(this.appConfFile, 'utf8'));
      // this.config = require("../../../../Config/appConf.json");
    } catch {
      this.appConfFile = path.join(__dirname,"../Config/appConfTemplate.json");
      this.config = JSON.parse(fs.readFileSync(this.appConfFile, 'utf8'));
    }
  }

  setWorkspaceName(wName: string) {
    this.name = wName;
  }

  getWorkspaceName() {
    return(this.name);
  }

  setModuleConfigFile(conf: string) {
    this.appConfFile = path.join(__dirname,"../Config/workspaces", conf);
  }

  getAppStorage() { 
    return this.config['appStorage']; 
  }

  getModulesConfig() { 
    return this.config['wutzModules']; }

  addModule(newModule: any) {
    this.config['wutzModules'].push(newModule)
    this.upateConfigFile()
  }
  
  deleteModule(newModule: any) {
    let moduleIndex = this.config['wutzModules'].indexOf(newModule);
    this.config['wutzModules'].splice(moduleIndex, 1);
    this.upateConfigFile();
  }

  upateConfigFile() {
    let self = this;

    fs.stat(this.appConfFile, (err, stats) => {
      if (err) {
        console.error('File ' + this.appConfFile + ' does not exist')
        return
      }
      fs.writeFile(self.appConfFile, JSON.stringify(self.config), err => {
        if (err)
          console.error(err)
      })

    })
  }

  updateModuleName(moduleId: number, newName: string) {
    this.config["wutzModules"][moduleId].name = newName
    this.upateConfigFile()
  }
}
