import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  data: any;
  activeTabIndex :number;
  newTabModal = false;

  constructor() {
    this.data = [
      {
        label: "todo",
        elements: [
          {
            name: "Cisco",
            finished: false
          },
          {
            name: "VM creation script",
            finished: false
          },
          {
            name: "Script detect usb",
            finished: false
          },
        ],
        finishedElements: [
          {
            name: "Stop caring",
            finished: true
          }
        ],
        deleted: false
      },
      {
        label: "toLook",
        elements : [
          {
            name: "Sword art online",
            finished: false
          },
          
        ],
        finishedElements: [
        ],
        deleted: false
      }
    ]

    this.activeTabIndex = this.data.length > 0 ? 0 : -1;
    console.log("here");
    this.giveFocusToTab();
  }

  ngOnInit() {
    // array of tabs
  }

  isSelected(tabIndex: number) {
    return this.activeTabIndex === tabIndex;
  }

  selectTab(tabIndex: number) {
    this.newTabModal = false;
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
        finished: false
      });
    }
  }

  tabExists(tabIndex: number) {
    return tabIndex >= 0 && tabIndex < this.data.length;
  }

  addTab(tabName: string) {
    this.data.splice(this.data.length, 0, 
      {
        label: tabName,
        index: this.data.length,
        elements : []
      })

    this.activeTabIndex = this.data.length - 1;
  }

  deleteTab(tabIndex: number) {
    this.data[tabIndex].deleted = true;

    setTimeout(() => {
      this.data.splice(tabIndex, 1);
  
      this.activeTabIndex--;
      if (this.activeTabIndex == -1) {
        if (this.data.length == 0) {
          this.newTabModal = true;
        } else {
          this.activeTabIndex = 0;
        }
      }
    }, 350);
  }

  checkEntry(tabIndex: number, entryIndex: number) {
    this.data[tabIndex].elements[entryIndex].finished = true;

    setTimeout((tabIndex, entryIndex) => {
      this.moveToFinishedList(tabIndex, entryIndex);
    }, 350, tabIndex, entryIndex);
  }

  moveToFinishedList(tabIndex: number, entryIndex: number) {
    let elem = this.data[tabIndex].elements[entryIndex];
    this.data[tabIndex].finishedElements.push(elem);
    this.data[tabIndex].elements.splice(entryIndex, 1);
  }

  giveFocusToTab() {
    setTimeout((activeTabIndex) => {
      document.getElementById('addEntry'+activeTabIndex).focus();
    }, 1, this.activeTabIndex);
  }

  focusNewTabModal() {
    setTimeout(() => {
      document.getElementById('newTab').focus();
    }, 1);
  }
}
