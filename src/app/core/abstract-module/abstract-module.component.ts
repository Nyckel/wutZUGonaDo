import { Component, Injectable, Input, Output, EventEmitter } from '@angular/core';

@Injectable()
export abstract class AbstractModuleComponent {
  @Input() modules;
  @Output() storageSet = new EventEmitter();
  appStorage: string[];

  constructor() {
  }

  setAppStorage(appStorage: string[]) {
    this.appStorage = appStorage;
    this.storageSet.emit();
  }
}
