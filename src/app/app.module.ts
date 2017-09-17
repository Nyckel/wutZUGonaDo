import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ListsComponent } from './wutzModules/lists/lists.component';
import { MemosComponent } from './wutzModules/memos/memos.component';
import { ModuleLoaderComponent } from './core/module-loader/module-loader.component';
import { ModuleLoaderDirective } from './core/module-loader/module-loader.directive';

// import { AdDirective }          from './ad.directive';
@NgModule({
  declarations: [
    AppComponent,
    ModuleLoaderComponent,
    ModuleLoaderDirective,
    ListsComponent,
    MemosComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  entryComponents: [ ListsComponent, MemosComponent ],
  bootstrap: [AppComponent]
})
export class AppModule { }
