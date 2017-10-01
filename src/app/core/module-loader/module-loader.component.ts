import { Component, Type, ViewChild, AfterContentInit, Input, ComponentFactoryResolver, ViewContainerRef, QueryList } from '@angular/core';
import { ModuleLoaderDirective } from "./module-loader.directive";
import { ListsComponent } from './../../wutzModules/lists/lists.component';
import { MemosComponent } from './../../wutzModules/memos/memos.component';

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

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngAfterContentInit() {
    this.loadComponent();
  }

  loadComponent() {
    // console.log(this.modules);
    
    if (this.container) {
      this.container.clear();        
      // let item = this.modules[0];
      for (let item of this.modules) {
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.componentMap[item.component]);
        let componentRef = this.container.createComponent(componentFactory);
        componentRef.instance.setAppStorage(this.appStorage);
        componentRef.instance.setName(item.name);
        componentRef.instance.setDataFile(item.dataFile);
        

      }
    } else {
      console.error("Couldn't find slot to insert modules");
    }

  }

}
