import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clauses',
  templateUrl: './clauses.component.html',
  styleUrls: ['./clauses.component.scss']
})
export class ClausesComponent implements OnInit {

clauses: any[]=[];

wordings:any[]=[];
clauseList:any[]=[];

selectedWordingValue:any[]=[];

wordingList: any[]=[]

selectedClauseValue: any[] = []

  constructor() { }

  ngOnInit(): void {
  }

  onEditWording(value) {}

  onEditClause(value) {}

}
