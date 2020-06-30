import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyWordingsDocumentComponent } from './policy-wordings-document.component';

describe('PolicyWordingsDocumentComponent', () => {
  let component: PolicyWordingsDocumentComponent;
  let fixture: ComponentFixture<PolicyWordingsDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyWordingsDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyWordingsDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
