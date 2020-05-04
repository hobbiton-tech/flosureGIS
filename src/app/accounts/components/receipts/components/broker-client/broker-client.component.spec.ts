import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerClientComponent } from './broker-client.component';

describe('BrokerClientComponent', () => {
  let component: BrokerClientComponent;
  let fixture: ComponentFixture<BrokerClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrokerClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
