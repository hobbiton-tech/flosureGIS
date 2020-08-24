import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimApprovalModalComponent } from './claim-approval-modal.component';

describe('ClaimApprovalModalComponent', () => {
  let component: ClaimApprovalModalComponent;
  let fixture: ComponentFixture<ClaimApprovalModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimApprovalModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimApprovalModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
