import { Component, Injectable, Input, Output, EventEmitter } from '@angular/core';

@Injectable()
export abstract class AbstractModuleComponent {
  @Output() dataFileSet = new EventEmitter();
  @Output() storageSet = new EventEmitter();
  appStorage: string[];
  name: string
  dataFile: string

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
}
