import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessedClaimsComponent } from './processed-claims.component';

describe('ProcessedClaimsComponent', () => {
  let component: ProcessedClaimsComponent;
  let fixture: ComponentFixture<ProcessedClaimsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessedClaimsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessedClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
