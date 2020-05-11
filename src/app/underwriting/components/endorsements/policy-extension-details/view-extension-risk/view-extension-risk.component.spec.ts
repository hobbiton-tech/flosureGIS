import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewExtensionRiskComponent } from './view-extension-risk.component';

describe('ViewExtensionRiskComponent', () => {
  let component: ViewExtensionRiskComponent;
  let fixture: ComponentFixture<ViewExtensionRiskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewExtensionRiskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewExtensionRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
