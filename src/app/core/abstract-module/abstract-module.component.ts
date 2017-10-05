import { FormsModule } from '@angular/forms';
import { Component, Injectable, Input, Output, EventEmitter } from '@angular/core';

@Injectable()
export abstract class AbstractModuleComponent {
  @Output() dataFileSet = new EventEmitter();
  @Output() storageSet = new EventEmitter();
  appStorage: string[];
  name: string
  dataFile: string
  editName: boolean

  setAppStorage(appStorage: string[]) {
    this.appStorage = appStorage;
    this.storageSet.emit();
  }

  setName(name: string) {
    this.name = name
  }

  setDataFile(dataFile: string) {
    this.dataFile = dataFile
    this.dataFileSet.emit();
  }

  saveModuleName() {
    //TODO: Implement true fonctionnality
    this.editName = false;
  }
}
