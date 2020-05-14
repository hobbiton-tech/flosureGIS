import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtensionCoverComponent } from './extension-cover.component';

describe('ExtensionCoverComponent', () => {
  let component: ExtensionCoverComponent;
  let fixture: ComponentFixture<ExtensionCoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtensionCoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtensionCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
