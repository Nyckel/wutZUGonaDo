import { Component, OnInit } from '@angular/core';
import { AbstractModuleComponent } from '../../core/abstract-module/abstract-module.component';
import * as path from 'path';
import * as fs from 'fs';

@Component({
  selector: 'app-notepad',
  templateUrl: './notepad.component.html',
  styleUrls: ['./notepad.component.css']
})
export class NotepadComponent extends AbstractModuleComponent implements OnInit {

  data:any;
  jsonFile: string;
  saveToModal = false;
  fileToSave: string;
  filenameToSave: string;
  
  constructor() {
    super();
    this.storageSet.subscribe(
      data => {
        this.dataFileSet.subscribe(
          data2 => {
            this.loadContent();
          }
        )
      }
    );
   }

  ngOnInit() {

  }

  loadContent() {
    let self = this;
    console.log(this.dataFile);
    this.jsonFile = path.join(this.moduleStorage, this.dataFile);

    this.initFileIfNeeded(this.jsonFile);
    this.data = JSON.parse(fs.readFileSync(this.jsonFile, 'utf8'));
  }

  initFileIfNeeded(fileName: string) {
    try {
      fs.statSync(fileName);
    } catch (e) { // File doesn't exist
      fs.writeFileSync(fileName, "[]");
      console.log(fileName, "created");
    }
  }

  logChanges(event) {
    console.log(event);
  }

  saveDataAndSync() {
    this.saveData();
    this.moduleChanged.emit(
      {
        dataFile: this.dataFile,
        content: JSON.stringify(this.data)
      }
    );
  }

  saveData() {
    if (!this.fileToSave && !this.jsonFile) {
      console.error('Tried to save lists but file is not defined')
      return;
    }
    let self = this;
    let f = this.fileToSave ? this.fileToSave : this.jsonFile;
    fs.stat(f, (err, stats) => {
      if (err) {
        console.error('File ' + f + ' does not exist');
        return;
      }
      fs.writeFile(f, JSON.stringify(self.data), err => {
        if (err)
          console.error(err);
      });

    });
  }

  saveToFile() {
    this.saveToModal = false;
    let input = <HTMLInputElement>document.getElementById('notepadDestFile');
    if (input) {
      let fileName = input.value;
      if (fileName) {
        this.filenameToSave = fileName;
        this.fileToSave = path.join(this.moduleStorage, fileName);
        this.initFileIfNeeded(this.fileToSave);
        this.saveData();
      }
    }
  }

  public static needsConfigFile() {
    return true;
  }


}
