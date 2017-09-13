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
          }
        ]
      },
      {
        label: "toLook",
        elements : [
          {
            name: "Sword art online",
            finished: false
          }
        ]
      }
    ]

    this.activeTabIndex = this.data.length > 0 ? 0 : -1;
  }

  ngOnInit() {
    // array of tabs
  }

  isSelected(tabIndex: number) {
    return this.activeTabIndex === tabIndex;
  }

  selectTab(tabIndex: number) {
    this.newTabModal = false;
    if (tabIndex == this.activeTabIndex)
      return;

    if (this.tabExists(tabIndex)) {
      // console.log(tabName + " found !");
      this.activeTabIndex = tabIndex;
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
    this.data.splice(tabIndex, 1);

    this.activeTabIndex--;
    if (this.activeTabIndex == -1) {
      if (this.data.length == 0) {
        this.newTabModal = true;
      } else {
        this.activeTabIndex = 0;
      }
    }
  }

}
