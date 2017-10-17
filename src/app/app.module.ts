import { ConfigLoaderService } from './core/config-loader/config-loader.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ListsComponent } from './wutzModules/lists/lists.component';
import { MemosComponent } from './wutzModules/memos/memos.component';
import { ModuleLoaderComponent } from './core/module-loader/module-loader.component';
import { ModuleLoaderDirective } from './core/module-loader/module-loader.directive';
import { WorkspaceLoaderComponent } from './core/workspace-loader/workspace-loader.component';

// import { AdDirective }          from './ad.directive';
@NgModule({
  declarations: [
    AppComponent,
    ModuleLoaderComponent,
    ModuleLoaderDirective,
    ListsComponent,
    MemosComponent,
    WorkspaceLoaderComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [ ConfigLoaderService ],
  entryComponents: [ ListsComponent, MemosComponent ],
  bootstrap: [AppComponent]
})
export class AppModule { }
