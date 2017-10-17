import { ConfigLoaderService } from './../config-loader/config-loader.service';
import { Component, SimpleChange, Type, ViewChild, AfterContentInit, Input, ComponentFactoryResolver, ViewContainerRef, QueryList } from '@angular/core';
import { ModuleLoaderDirective } from "./module-loader.directive";
import { ListsComponent } from './../../wutzModules/lists/lists.component';
import { MemosComponent } from './../../wutzModules/memos/memos.component';
import { shell } from 'electron';
import { AbstractModuleComponent } from './../abstract-module/abstract-module.component'

@Component({
  selector: 'app-module-loader',
  templateUrl: './module-loader.component.html',
  styleUrls: ['./module-loader.component.css']
})
export class ModuleLoaderComponent implements AfterContentInit {
  @Input() modules;
  @Input() appStorage;
  ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
    if ((changes['modules'] && this.modules) || (changes['appStorage'] && this.appStorage)) {
      this.loadComponents();
    }
  }
  @ViewChild("moduleContainer", { read: ViewContainerRef }) container;
  
  componentMap = {
    'ListsComponent': ListsComponent,
    'MemosComponent': MemosComponent
  };
  idCounter = 0
  showAddModule = false

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private configService: ConfigLoaderService) { }

  ngAfterContentInit() {
    this.loadComponents();
  }

  loadComponents() {
    // console.log(this.modules);
    if (!this.modules) return;
    
    if (this.container) {
      this.container.clear();        
      // let item = this.modules[0];
      for (let item of this.modules)
        this.createWutzComponent(item)

    } else {
      console.error("Couldn't find slot to insert modules");
    }

    this.showAddModule = this.modules.length === 0;
  }

  createWutzComponent(item: any) {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.componentMap[item.component]);
    let componentRef = this.container.createComponent(componentFactory);
    let newModule = componentRef.instance

    newModule.setAppStorage(this.appStorage);
    newModule.setName(item.name);
    newModule.setDataFile(item.dataFile);
    newModule.id = this.idCounter
    newModule.nameChange.subscribe(
      data => {
        this.configService.updateModuleName(newModule.id, newModule.getName())
      }
    )

    this.idCounter += 1
  }

  addComponent(newComponent: any) {
    if (!this.isValidComponent(newComponent))
      return;
    
    this.createWutzComponent(newComponent)
    this.configService.addModule(newComponent);
  }

  isValidComponent(newComponent: any) {
    if (!newComponent.hasOwnProperty('name') ||
        !newComponent.hasOwnProperty('component') ||
        !newComponent.hasOwnProperty('dataFile'))
        return false
    return true
  }

  getAvailableComponentsList() {
     return Object.keys(this.componentMap)
  }

  addComponentWithName(name: string, componentType: string) {
    if (!this.isFreeModuleName(name)) {
      console.log("Module", name, "already exists")
      return
    }

    let dataFile = name+".json"
    if (this.componentMap[componentType].needsConfigFile())
      this.createModuleConfig(dataFile)
    else
      console.log("module doesn't need config file")


    this.addComponent(
      {
        "name": name,
        "component": componentType,
        "dataFile": dataFile
      }
    )
    this.showAddModule = false
  }

  isFreeModuleName(testedName: string) {
    for (let module of this.modules)
      if (module.name == testedName)
        return false

    return true
  }

  createModuleConfig(dataFile: string) {
    //TODO: decide if each module implements its own stuff or not
  }

  openExternal(url: string) {
    let open = shell.openExternal(url);
  }

}
