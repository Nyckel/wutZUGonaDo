import { Injectable } from '@angular/core';


@Injectable()
export class ConfigLoaderService {
  config: any[];

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

}
