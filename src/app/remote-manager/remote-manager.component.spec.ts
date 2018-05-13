import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoteManagerComponent } from './remote-manager.component';

describe('RemoteManagerComponent', () => {
  let component: RemoteManagerComponent;
  let fixture: ComponentFixture<RemoteManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoteManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoteManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
