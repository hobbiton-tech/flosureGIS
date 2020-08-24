import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsSetupsComponent } from './claims-setups.component';

describe('ClaimsSetupsComponent', () => {
  let component: ClaimsSetupsComponent;
  let fixture: ComponentFixture<ClaimsSetupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimsSetupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimsSetupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
