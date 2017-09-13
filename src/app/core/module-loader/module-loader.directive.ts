import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: 'moduleHost',
})
export class ModuleLoaderDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
