import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceSetupsComponent } from './finance-setups.component';

describe('FinanceSetupsComponent', () => {
  let component: FinanceSetupsComponent;
  let fixture: ComponentFixture<FinanceSetupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinanceSetupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceSetupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
