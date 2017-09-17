import { Component, OnInit } from '@angular/core';
import * as fs from 'fs';
import * as path from 'path';
import { spawn, execFileSync } from 'child_process';
import { shell, remote } from 'electron';

@Component({
  selector: 'app-memos',
  templateUrl: './memos.component.html',
  styleUrls: ['./memos.component.css']
})
export class MemosComponent implements OnInit {
  memos;
  memosDir = path.join(__dirname, "..", "files", "memos");

  constructor() {
    this.memos = [];
    try {
      !fs.statSync(this.memosDir);
    } catch (e) {
      fs.mkdirSync(path.join(__dirname, "..", "files"));
      fs.mkdirSync(this.memosDir);
      this.loadMemos();
    }
    this.loadMemos(); // replace duplication by a promise    
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

  openMemo(fileName: string, index: number, isNew: boolean) {
    // Problem : no detection of memo close -> files are never set to close
    // if ((!isNew && this.memos[index].open)){
    //   return;
    //   // Put the window in focus
    // }
    let self = this;
    if (isNew) {
      fileName = this.getFirstFreeFileName();
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
        let open = shell.openItem(fileName);
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
    str = str.charAt(0).toUpperCase() + str.slice(1);
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
    let splitName = fileName.split('\\');
    fileName = splitName[splitName.length - 1];

    for (let i = 0; i < this.memos.length; i++) {
      if (this.memos[i].fileName == fileName)
        return true;
    }
    return false;
  }
}
