import { Injectable } from '@angular/core';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ConfigLoaderService {
  config: any[];
  appConfFile = path.join(__dirname,"../Config/appConf.json")

  constructor() {
    this.initConfig();
  }

  initConfig() {
    this.config = require("../../../../Config/appConf.json");
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
