import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceLoaderComponent } from './workspace-loader.component';

describe('WorkspaceLoaderComponent', () => {
  let component: WorkspaceLoaderComponent;
  let fixture: ComponentFixture<WorkspaceLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkspaceLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
