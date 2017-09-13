import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleLoaderComponent } from './module-loader.component';

describe('ModuleLoaderComponentComponent', () => {
  let component: ModuleLoaderComponent;
  let fixture: ComponentFixture<ModuleLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuleLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
