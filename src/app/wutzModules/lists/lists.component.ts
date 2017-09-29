import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { AbstractModuleComponent } from '../../core/abstract-module/abstract-module.component';


@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent extends AbstractModuleComponent implements OnInit {
  data: any;
  activeTabIndex :number;
  newTabModal = false;
  restore = false;

  constructor() {
    super();
    this.storageSet.subscribe(
      data => {
        this.loadLists();
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
        elements : [],
        finishedElements: []
      })

    this.selectTab(this.data.length - 1);
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
      this.giveFocusToTab();
    }, 350);
  }

  checkEntry(tabIndex: number, entryIndex: number) {
    this.data[tabIndex].elements[entryIndex].finished = true;

    setTimeout((tabIndex, entryIndex) => {
      this.moveToFinishedList(tabIndex, entryIndex);
      this.giveFocusToTab();
    }, 350, tabIndex, entryIndex);
  }

  
  uncheckEntry(tabIndex: number, entryIndex: number) {
    this.data[tabIndex].finishedElements[entryIndex].finished = false;

    setTimeout((tabIndex, entryIndex) => {
      this.moveToNormalList(tabIndex, entryIndex);
      // this.giveFocusToTab();
    }, 350, tabIndex, entryIndex);
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
        document.getElementById('addEntry'+activeTabIndex).focus();
        //TODO: replace document search by module search because pb if multiple instances of module on same tab
      }
    }, 1, this.activeTabIndex, this.newTabModal);

  }

  focusNewTabModal() {
    setTimeout(() => {
      document.getElementById('newTab').focus();
    }, 1);
  }

  loadLists() {
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
    this.giveFocusToTab();
  }

}
