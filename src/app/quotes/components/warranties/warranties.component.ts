import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-warranties',
  templateUrl: './warranties.component.html',
  styleUrls: ['./warranties.component.scss']
})
export class WarrantiesComponent implements OnInit {

  selectedWarrantyValue:any[]=[];
  warrantyList:any[]=[];

  selectedExclusionValue:any[]=[];
  exclusionList: any[]=[];

  constructor() { }

  ngOnInit(): void {
  }

  onEditWarranty(warranty) {}

  onEditExclusion(value) {}

}
