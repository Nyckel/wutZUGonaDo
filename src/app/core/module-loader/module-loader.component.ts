import { Component, Type, ViewChild, AfterContentInit, Input, ComponentFactoryResolver, ViewContainerRef, QueryList } from '@angular/core';
import { ModuleLoaderDirective } from "./module-loader.directive";

@Component({
  selector: 'app-module-loader',
  templateUrl: './module-loader.component.html',
  styleUrls: ['./module-loader.component.css']
})
export class ModuleLoaderComponent implements AfterContentInit {
  @Input() modules;
  // @ViewChild(ModuleLoaderDirective) moduleHost: ModuleLoaderDirective;
  @ViewChild("moduleContainer", { read: ViewContainerRef }) container;

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
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(item.component);
        let componentRef = this.container.createComponent(componentFactory);
      }
    } else {
      console.error("Couldn't find slot to insert modules");
    }

  }

}
