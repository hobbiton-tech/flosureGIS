import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClaimantModalComponent } from './add-claimant-modal.component';

describe('AddClaimantModalComponent', () => {
  let component: AddClaimantModalComponent;
  let fixture: ComponentFixture<AddClaimantModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddClaimantModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddClaimantModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
