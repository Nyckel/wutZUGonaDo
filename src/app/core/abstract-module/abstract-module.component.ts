import { FormsModule } from '@angular/forms';
import { Component, Injectable, Input, Output, EventEmitter, ViewChild } from '@angular/core';

@Injectable()
export abstract class AbstractModuleComponent {
  @Output() dataFileSet = new EventEmitter();
  @Output() storageSet = new EventEmitter();
  @Output() nameChange = new EventEmitter();
  @ViewChild('moduleNameInput')
  private moduleNameInput;
  id: number

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
    this.nameChange.emit(name)
  }
  getName() {
    return this.name
  }

  setDataFile(dataFile: string) {
    this.dataFile = dataFile
    this.dataFileSet.emit();
  }

  saveModuleName() {
    this.editName = false;
    this.nameChange.emit(name)
  }

  editModuleName() {
    this.editName= !this.editName
    setTimeout(() => {this.moduleNameInput.nativeElement.focus()},0)
  }

  public static needsConfigFile() {
    return false
  }
}
