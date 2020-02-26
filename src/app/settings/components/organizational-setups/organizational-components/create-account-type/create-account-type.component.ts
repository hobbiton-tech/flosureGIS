import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-create-account-type',
  templateUrl: './create-account-type.component.html',
  styleUrls: ['./create-account-type.component.scss']
})
export class CreateAccountTypeComponent implements OnInit {

  @Input()
  isDrawerVisible: boolean;

  @Output()
  closeAccountTypeDrawer: EventEmitter<any> = new EventEmitter(); 


  constructor() { }

  ngOnInit(): void {
  }


  closeDrawer(): void {
    this.closeAccountTypeDrawer.emit();
    // this.isDrawerVisible = false;
  }

}
