import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ListsComponent } from './wutzModules/lists/lists.component';
import { ModuleLoaderComponent } from './core/module-loader/module-loader.component';
import { ModuleLoaderDirective } from './core/module-loader/module-loader.directive';

// import { AdDirective }          from './ad.directive';
@NgModule({
  declarations: [
    AppComponent,
    ListsComponent,
    ModuleLoaderComponent,
    ModuleLoaderDirective
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  entryComponents: [ ListsComponent ],
  bootstrap: [AppComponent]
})
export class AppModule { }
