import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankSetupsComponent } from './bank-setups.component';

describe('BankSetupsComponent', () => {
  let component: BankSetupsComponent;
  let fixture: ComponentFixture<BankSetupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankSetupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankSetupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
