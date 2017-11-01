import { element } from 'protractor';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractModuleComponent } from '../../core/abstract-module/abstract-module.component';
import * as path from 'path';
import * as fs from 'fs';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent extends AbstractModuleComponent implements OnInit {
  @ViewChild('tabContents') tabContents
  data: any;
  activeTabIndex :number;
  newTabModal = false;
  restore = false;
  showAll = false;
  jsonFile: string;

  constructor() {
    super();
    this.storageSet.subscribe(
      data => {
        this.dataFileSet.subscribe(
          data2 => {
            this.loadLists();
          }
        )
      }
    )
  }

  ngOnInit() {
    // array of tabs
  }

  isSelected(tabIndex: number) {
    return this.activeTabIndex === tabIndex;
  }

  selectTab(tabIndex: number) {
    this.newTabModal = false;
    this.restore = false;
    if (tabIndex == this.activeTabIndex) {
      this.giveFocusToTab();
      return;      
    }

    if (this.tabExists(tabIndex)) {
      this.activeTabIndex = tabIndex;
      this.giveFocusToTab();
    }
  }

  addEntry(tabIndex: number, newEntry: string) {
    if (newEntry == "") return;
    if (this.tabExists(tabIndex)) {
      this.data[tabIndex].elements.splice(
        this.data[tabIndex].elements.length, 0, {
        name: newEntry,
        finished: false,
        edited: false
      });
    }
    this.saveLists();
  }

  tabExists(tabIndex: number) {
    return tabIndex >= 0 && tabIndex < this.data.length;
  }

  addTab(tabName: string) {
    this.data.splice(this.data.length, 0, 
      {
        label: tabName,
        index: this.data.length,
        elements : [],
        finishedElements: []
      })

    this.selectTab(this.data.length - 1);
    this.saveLists();
  }

  deleteTab(tabIndex: number) {
    this.data[tabIndex].deleted = true;

    setTimeout(() => {
      this.data.splice(tabIndex, 1);
      this.saveLists();

      this.activeTabIndex--;
      if (this.activeTabIndex == -1) {
        if (this.data.length == 0) {
          this.newTabModal = true;
        } else {
          this.activeTabIndex = 0;
        }
      }
      this.giveFocusToTab();
    }, 350);
  }

  checkEntry(tabIndex: number, entryIndex: number) {
    this.data[tabIndex].elements[entryIndex].finished = true;

    setTimeout((tabIndex, entryIndex) => {
      this.moveToFinishedList(tabIndex, entryIndex);
      this.saveLists();
      // this.giveFocusToTab();
    }, 350, tabIndex, entryIndex);
  }

  
  uncheckEntry(tabIndex: number, entryIndex: number) {
    this.data[tabIndex].finishedElements[entryIndex].finished = false;

    setTimeout((tabIndex, entryIndex) => {
      this.moveToNormalList(tabIndex, entryIndex);
      this.saveLists();
      // this.giveFocusToTab();
    }, 350, tabIndex, entryIndex);
  }

  editEntry(tabIndex: number, entryIndex: number) {
    
    this.data[tabIndex].elements[entryIndex];    
    this.saveLists();
  }

  moveToFinishedList(tabIndex: number, entryIndex: number) {
    let elem = this.data[tabIndex].elements[entryIndex];
    this.data[tabIndex].finishedElements.push(elem);
    this.data[tabIndex].elements.splice(entryIndex, 1);
  }

  moveToNormalList(tabIndex: number, entryIndex: number) {
    let elem = this.data[tabIndex].finishedElements[entryIndex];
    this.data[tabIndex].elements.push(elem);
    this.data[tabIndex].finishedElements.splice(entryIndex, 1);
    console.log(this.data[tabIndex]);
  }

  giveFocusToTab() {
    setTimeout((activeTabIndex, newTabModal) => {
      if (newTabModal) {
        this.focusNewTabModal();
      } else {
        this.tabContents.nativeElement.querySelector('#addEntry'+activeTabIndex).focus();
      }
    }, 1, this.activeTabIndex, this.newTabModal);

  }

  focusNewTabModal() {
    setTimeout(() => {
      document.getElementById('newTab').focus();
    }, 1);
  }

  loadLists() {
    let self = this;
    this.jsonFile = path.join(__dirname, "..", this.moduleStorage, this.dataFile)
    
    this.initJsonIfNeeded()
    this.data = JSON.parse(fs.readFileSync(this.jsonFile, 'utf8'));

    this.activeTabIndex = this.data.length > 0 ? 0 : -1;
    if (this.data.length > 0) {
      this.activeTabIndex = 0;
      this.giveFocusToTab();
    } else {
      this.newTabModal = true;
      this.focusNewTabModal();
    }
  }

  saveLists() {
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
      })

    })
  }

  initJsonIfNeeded() {
    try {
      fs.statSync(this.jsonFile)
    } catch (e) { // File doesn't exist
      fs.writeFileSync(this.jsonFile, "[]");
      console.log(this.jsonFile, "created")
    }
  }

  public static needsConfigFile() {
    return true
  }
}
