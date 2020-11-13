import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProcessedClaimsComponent } from './view-processed-claims.component';

describe('ViewProcessedClaimsComponent', () => {
  let component: ViewProcessedClaimsComponent;
  let fixture: ComponentFixture<ViewProcessedClaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewProcessedClaimsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewProcessedClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
