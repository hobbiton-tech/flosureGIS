import { Component, OnInit } from '@angular/core';
import html2canvas from "html2canvas";
import jspdf from "jspdf";
import { ICorporateClient, IIndividualClient } from '../../../../clients/models/clients.model';

@Component({
  selector: 'app-age-analysis',
  templateUrl: './age-analysis.component.html',
  styleUrls: ['./age-analysis.component.scss']
})
export class AgeAnalysisComponent implements OnInit {
  loadingStatement = false;
  generatingPDF = false;
  client: IIndividualClient & ICorporateClient;
  today = new Date();

  constructor() { }

  ngOnInit(): void {
  }

  generatePDF() {
    const data = document.getElementById('printSection');
    html2canvas(data).then(canvas => {
      const imgWidth = 208;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('p', 'mm', 'a4');
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save( `${this.client.clientID}-Account-Statement.pdf`);
      this.generatingPDF = false;
    });
  }

}
