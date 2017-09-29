import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbstractModuleComponent } from './abstract-module.component';

describe('AbstractModuleComponent', () => {
  let component: AbstractModuleComponent;
  let fixture: ComponentFixture<AbstractModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbstractModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbstractModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
