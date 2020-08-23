import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsProcessingComponent } from './claims-processing.component';

describe('ClaimsProcessingComponent', () => {
  let component: ClaimsProcessingComponent;
  let fixture: ComponentFixture<ClaimsProcessingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimsProcessingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimsProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
