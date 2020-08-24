import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimSetupsComponent } from './claim-setups.component';

describe('ClaimSetupsComponent', () => {
  let component: ClaimSetupsComponent;
  let fixture: ComponentFixture<ClaimSetupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimSetupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimSetupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
