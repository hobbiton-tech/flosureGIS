import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perils',
  templateUrl: './perils.component.html',
  styleUrls: ['./perils.component.scss']
})
export class PerilsComponent implements OnInit {


  selectedPerilValue: any[]=[];
  perilList:any[] = []


  constructor() { }

  ngOnInit(): void {
  }

  onEditPeril(value) {}

}
