import { FormsModule } from '@angular/forms';
import { Component, Injectable, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export abstract class AbstractModuleComponent {
  @Output() dataFileSet = new EventEmitter();
  @Output() storageSet = new EventEmitter();
  @Output() nameChange = new EventEmitter();
  @Output() moduleChanged = new EventEmitter();
  @Output() delete = new EventEmitter();
  @ViewChild('moduleNameInput')
  private moduleNameInput;
  id: number

  moduleStorage: string;
  name: string;
  dataFile: string;
  editName: boolean;
  deleteModal: boolean;
  optionsModal: boolean; 

  setModuleStorage(appStorage: string) {
    this.moduleStorage = appStorage;
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
    this.dataFile = dataFile;
    this.dataFileSet.emit();
  }

  deleteDataFile() {
    if (!this.dataFile) return;

    let f = path.join(__dirname, "..", this.moduleStorage, this.dataFile);
    console.log(this.moduleStorage, this.dataFile);
    fs.unlink(f, err => {
      console.error(err);
    })

  }

  saveModuleName() {
    this.editName = false;
    this.nameChange.emit(name)
  }

  editModuleName() {
    this.editName= !this.editName
    setTimeout(() => {this.moduleNameInput.nativeElement.focus()},0)
  }

  deleteModule() {
    this.delete.emit();
  }

  updateFromServer(data) {

  }

  public static needsConfigFile() {
    return false;
  }
}
