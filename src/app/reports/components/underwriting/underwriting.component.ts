import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {  PremiumService } from '../../services/premium.service';
import { map, filter, tap } from 'rxjs/operators';
import { from } from 'rxjs';
import { PremiumDTO } from 'src/app/quotes/services/quotes.service';
import { IPremiumReport, IPolicyReportDto, ICommissionReportDto, IIntermediaryReportDto, ICreditNoteReportDto, IDebitNoteReportDto } from '../../model/premium';
import { IIndividualClientDto } from 'src/app/clients/models/client.dto';
import { Policy } from 'src/app/underwriting/models/policy.model';

import * as XLSX from 'xlsx'


@Component({
  selector: 'app-underwriting',
  templateUrl: './underwriting.component.html',
  styleUrls: ['./underwriting.component.scss']
})
export class UnderwritingComponent implements OnInit {

  dateForm: FormGroup;

  // premiumProductionList: PolicyDto[];
  // displayPremiumProductionList: PolicyDto[];
  filterPremiumReport: PremiumDTO[]; 

  // premiumProductionList: PremiumDTO[];
  displayPremiumProductionList: any[];
  // filterPremiumReport: PremiumDTO[]; 

  timeDay = new Date();
  fileName = 'PremiumReportTable' + this.timeDay + '.xlsx';


  constructor(
    
    private premiumService: PremiumService)
   { }

  ngOnInit(): void {
    // this.premiumService.generateReport().subscribe((d) => {
    //   this.displayPremiumProductionList = d;
    //   console.log('This->',  this.displayPremiumProductionList);
    // });

    this.premiumService.generatePremiumReport().subscribe((d) => {
      this.displayPremiumProductionList = d;
      console.log('This->',  this.displayPremiumProductionList);
    });
  }

//   _getFilterReportList(fromDate: Date, toDate: Date): void {
//     if (fromDate === null || (!fromDate && toDate == null) || !toDate) {
//         this.displayPremiumProductionList = this.filterPremiumReport;
//     }

  

//     this.premiumReportService.generatePremiumProductionReport()
//         .pipe(
//             map((premium) =>
//                 from(premium).pipe(
//                     // filter(
//                     //     (d: Client) =>
//                     //         d.dateCreated >= this.dateForm.get('fromDate').value &&
//                     //         d.dateCreated <= this.dateForm.get('toDate').value
//                     // )
//                 )
//             ),
//             tap((premium) =>
//             premium.subscribe((d) => {
//                     this.filterPremiumReport.push(d);
//                     console.log(this.filterPremiumReport)
//                 })
//             )
//         )
//         .subscribe();
// }

  downloadPremiumProductionReport(){
    let element = document.getElementById('premiumReportTable');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }

}
