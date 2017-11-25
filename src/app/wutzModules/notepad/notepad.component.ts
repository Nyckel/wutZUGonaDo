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
    this.jsonFile = path.join(__dirname, "..", this.moduleStorage, this.dataFile)

    this.initJsonIfNeeded();
    this.data = JSON.parse(fs.readFileSync(this.jsonFile, 'utf8'));
  }

  initJsonIfNeeded() {
    try {
      fs.statSync(this.jsonFile)
    } catch (e) { // File doesn't exist
      fs.writeFileSync(this.jsonFile, "[]");
      console.log(this.jsonFile, "created")
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
    if (this.jsonFile === undefined) {
      console.error('Tried to save lists but file is not defined')
      return;
    }
    let self = this;

    fs.stat(this.jsonFile, (err, stats) => {
      if (err) {
        console.error('File ' + self.jsonFile + ' does not exist')
        return
      }
      fs.writeFile(self.jsonFile, JSON.stringify(self.data), err => {
        if (err)
          console.error(err)
      });

    });
  }

  public static needsConfigFile() {
    return true;
  }


}
