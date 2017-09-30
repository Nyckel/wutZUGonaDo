import { Component, OnInit } from '@angular/core';
import * as fs from 'fs';
import * as path from 'path';
import { spawn, execFileSync } from 'child_process';
import { shell, remote, app } from 'electron';
import { AbstractModuleComponent } from '../../core/abstract-module/abstract-module.component';

@Component({
  selector: 'app-memos',
  templateUrl: './memos.component.html',
  styleUrls: ['./memos.component.css']
})
export class MemosComponent extends AbstractModuleComponent implements OnInit {
  memos;
  memosDir: string;
  
  constructor() {
    super();
    this.storageSet.subscribe(
      data => {
        this.checkStorageAndLoadMemos();
      }
    )
  }

  ngOnInit() {
  }

  loadMemos() {
    fs.readdir(this.memosDir, (err, files) => {
      files.forEach(file => {
        this.memos.push(
          {
            name: this.sanitizeString(file),
            fileName: file,
            open: false,
            deleted: false
          }
        )
      })
    });
  }

  createMemo(fileName: string, fileType: string) {
    switch(fileType) {
      case "txt":
        if (!this.fileExists(fileName+'.txt')) {
          this.createAndOpenTextMemo(fileName)
        } else {
          fileName = fileName+'.txt'        
          console.log("File " + fileName + " already exists")
          this.openTextMemo(fileName)
        }
        break;
        case "gdoc":
          this.createAndOpenGdoc(fileName)
          break;
    }
  }

  createAndOpenTextMemo(fileName: string) {
    fileName = fileName+'.txt'
    let self = this;
    this.memos.push(
      {
        name: this.sanitizeString(fileName),
        fileName: fileName,
        open: true,
        deleted: false
      }
    )
    let fullFileName = path.join(this.memosDir, fileName);
    fs.writeFileSync(fullFileName, "");
    this.openTextMemo(fileName)
  }

  openTextMemo(fileName: string) {
    let self = this
    fileName = path.join(this.memosDir, fileName);
    fs.readFile(fileName, 'utf-8', function(err, data) {      
      if (err == null) {
        let open = shell.openItem(path.join(__dirname, '..', fileName));
      } else {
        console.log("Couldn't read file", fileName);
        if (self.fileExists(fileName))
          console.error("ERROR: Couldn't read file", fileName);
        // Else file has been deleted
      }
    });
  }

  createAndOpenGdoc(fileName: string) {
    // TODO: https://developers.google.com/drive/v3/web/integrate-open
    let open = shell.openExternal("https://docs.google.com/document/create?title="+fileName);
  }

  openMemo(fileName: string, index: number, isNew: boolean) {
    // Problem : no detection of memo close -> files are never set to close
    // if ((!isNew && this.memos[index].open)){
    //   return;
    //   // Put the window in focus
    // }
    let self = this;
    if (isNew) {
      // fileName = this.getFirstFreeFileName();
      fileName = fileName+'.txt'
      this.memos.push(
        {
          name: this.sanitizeString(fileName),
          fileName: fileName,
          open: true,
          deleted: false
        }
      )
    }
    fileName = path.join(this.memosDir, fileName);
    if (isNew) {
      fs.writeFileSync(fileName, "");
    }
 
    fs.readFile(fileName, 'utf-8', function(err, data) {      
      if (err == null) {
        console.log("Opening " + path.join(__dirname, '..', fileName))
        let open = shell.openItem(path.join(__dirname, '..', fileName));
        // let open = shell.openExternal("https://docs.google.com/document/create?title='"+fileName+"'");
        if (!isNew) {
          self.memos[index].open = open;
        }
      } else {
        console.log("Couldn't read file", fileName);
        if (self.fileExists(fileName))
          console.error("ERROR: Couldn't read file", fileName);
        // Else file has been deleted
      }
    });
  }

  deleteMemo(memoIndex: number) {
    this.memos[memoIndex].deleted = true;
    let filePath = path.join(this.memosDir, this.memos[memoIndex].fileName);
    fs.unlinkSync(filePath);
    setTimeout((tabIndex) => {
      this.removeMemoFromList(memoIndex);
    }, 350, memoIndex);
  }

  removeMemoFromList(memoIndex: number) {
    this.memos.splice(memoIndex, 1);
  }

  sanitizeString(str: string) {
    str = str.replace('_',' ').split('.')[0];
    // str = str.charAt(0).toUpperCase() + str.slice(1);
    return str;
  }

  getFirstFreeFileName() {
    let freeFile = false;
    let fileSearchCounter = 0;
    let fileName;

    while (!freeFile) {
      fileName = "newMemo".concat(fileSearchCounter == 0 ? '' : String(fileSearchCounter)).concat('.txt');
      if (!this.fileExists(fileName)) {
        freeFile = true;
      }
      fileSearchCounter++;
    }
    return fileName;
  }

  fileExists(fileName: string) {
    console.log(fileName)
    let splitName = fileName.split('\\');
    fileName = splitName[splitName.length - 1];
    console.log(fileName)
    
    for (let i = 0; i < this.memos.length; i++) {
      if (this.memos[i].fileName == fileName)
        return true;
    }
    return false;
  }

  checkStorageAndLoadMemos() {

    this.memosDir = path.join(this.appStorage[0], "memos")
    this.memos = [];
    try {
      !fs.statSync(this.memosDir);
    } catch (e) {
      fs.mkdirSync(this.appStorage[0]);
      fs.mkdirSync(this.memosDir);
      this.loadMemos();
    }
    this.loadMemos(); // TODO: replace duplication by a promise  
  }
}