import { ConfigLoaderService } from './../config-loader/config-loader.service';
import { Component, Type, ViewChild, AfterContentInit, Input, ComponentFactoryResolver, ViewContainerRef, QueryList } from '@angular/core';
import { ModuleLoaderDirective } from "./module-loader.directive";
import { ListsComponent } from './../../wutzModules/lists/lists.component';
import { MemosComponent } from './../../wutzModules/memos/memos.component';
import { AbstractModuleComponent } from './../abstract-module/abstract-module.component'

@Component({
  selector: 'app-module-loader',
  templateUrl: './module-loader.component.html',
  styleUrls: ['./module-loader.component.css']
})
export class ModuleLoaderComponent implements AfterContentInit {
  @Input() modules;
  @Input() appStorage;
  // @ViewChild(ModuleLoaderDirective) moduleHost: ModuleLoaderDirective;
  @ViewChild("moduleContainer", { read: ViewContainerRef }) container;
  componentMap = {
    'ListsComponent': ListsComponent,
    'MemosComponent': MemosComponent
  };
  showAddModule = false

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private configService: ConfigLoaderService) { }

  ngAfterContentInit() {
    this.loadComponents();
  }

  loadComponents() {
    // console.log(this.modules);
    
    if (this.container) {
      this.container.clear();        
      // let item = this.modules[0];
      for (let item of this.modules)
        this.createWutzComponent(item)

    } else {
      console.error("Couldn't find slot to insert modules");
    }
  }

  createWutzComponent(item: any) {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.componentMap[item.component]);
    let componentRef = this.container.createComponent(componentFactory);
    componentRef.instance.setAppStorage(this.appStorage);
    componentRef.instance.setName(item.name);
    componentRef.instance.setDataFile(item.dataFile);
  }

  addComponent(newComponent: any) {
    if (!this.isValidComponent(newComponent))
      return;
    
    this.createWutzComponent(newComponent)
    this.configService.addModule(newComponent);
    // TODO: Output an event so that config is forwarded to config file
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

}
