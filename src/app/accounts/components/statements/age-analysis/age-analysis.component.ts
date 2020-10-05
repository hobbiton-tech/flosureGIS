import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import { ICorporateClient, IIndividualClient } from '../../../../clients/models/clients.model';
import { ClientsService } from '../../../../clients/services/clients.service';
import { ActivatedRoute, Router } from '@angular/router';

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

  transactionList: any;
  clientId: any;

  constructor(
    private clientsService: ClientsService,
    private readonly route: Router,
    private cdr: ChangeDetectorRef,
    private router: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.router.params.subscribe(param => {
      this.clientId = param.id;
    });

    this.clientsService.getAllClients().subscribe(clients => {
      console.log(clients);
      this.client = [...clients[1], ...clients[0]].filter(
        x => x.id === this.clientId
      )[0] as IIndividualClient & ICorporateClient;

      this.clientsService.getTransactions().subscribe((txns: any) => {
        this.transactionList = txns.data.filter((x) => x.client_id === this.clientId && x.balance >= 0 || x.open_balance).sort();
        console.log('Balance', this.transactionList);
      });
    });
  }


  ageThirty(value) {
    const todayDate = new Date();
    // const diff = Math.abs(value.transaction_date.getTime() - todayDate.getTime());
    // const diffDays = Math.ceil(diff / ((1000 * 3600 * 24)) * 30);

    const secondDate = new Date(value.transaction_date);
    const time = 30 * 60 * 60 * 24 * 1000;
    console.log('Time>>>', (todayDate.getTime() - secondDate.getTime()), time);
    if ((todayDate.getTime() - secondDate.getTime()) <= time  && value.balance >= 0) {
      return value.balance;
    } else  {
      return 0;
    }
  }
  ageSixty(value) {
    const todayDate = new Date();
    // const diff = Math.abs(value.transaction_date.getTime() - todayDate.getTime());
    // const diffDays = Math.ceil(diff / ((1000 * 3600 * 24)) * 30);

    const secondDate = new Date(value.transaction_date);
    const time = 60 * 60 * 60 * 24 * 1000;
    const time2 = 30 * 60 * 60 * 24 * 1000;
    if ((todayDate.getTime() - secondDate.getTime()) < time  && (todayDate.getTime() - secondDate.getTime()) > time2   && value.balance >= 0) {
      return value.balance;
    } else  {
      return 0;
    }

  }
  ageNinety(value) {
    const todayDate = new Date();
    // const diff = Math.abs(value.transaction_date.getTime() - todayDate.getTime());
    // const diffDays = Math.ceil(diff / ((1000 * 3600 * 24)) * 30);

    const secondDate = new Date(value.transaction_date);
    const time = 90 * 60 * 60 * 24 * 1000;
    const time2 = 60 * 60 * 60 * 24 * 1000;
    if ((todayDate.getTime() - secondDate.getTime()) < time  && (todayDate.getTime() - secondDate.getTime()) > time2  && value.balance >= 0) {
      return value.balance;
    } else  {
      return 0;
    }

  }
  ageOneTwenty(value) {
    const todayDate = new Date();
    // const diff = Math.abs(value.transaction_date.getTime() - todayDate.getTime());
    // const diffDays = Math.ceil(diff / ((1000 * 3600 * 24)) * 30);

    const secondDate = new Date(value.transaction_date);
    const time = 120 * 60 * 60 * 24 * 1000;
    const time2 = 90 * 60 * 60 * 24 * 1000;
    if ((todayDate.getTime() - secondDate.getTime()) < time  && (todayDate.getTime() - secondDate.getTime()) > time2  && value.balance >= 0) {
      return value.balance;
    } else  {
      return 0;
    }

  }
  ageOneEighty(value) {
    const todayDate = new Date();
    // const diff = Math.abs(value.transaction_date.getTime() - todayDate.getTime());
    // const diffDays = Math.ceil(diff / ((1000 * 3600 * 24)) * 30);

    const secondDate = new Date(value.transaction_date);
    const time = 180 * 60 * 60 * 24 * 1000;
    const time2 = 120 * 60 * 60 * 24 * 1000;
    if ((todayDate.getTime() - secondDate.getTime()) < time  && (todayDate.getTime() - secondDate.getTime()) > time2  && value.balance >= 0) {
      return value.balance;
    } else  {
      return 0;
    }

  }
  ageAnnual(value) {
    const todayDate = new Date();
    // const diff = Math.abs(value.transaction_date.getTime() - todayDate.getTime());
    // const diffDays = Math.ceil(diff / ((1000 * 3600 * 24)) * 30);

    const secondDate = new Date(value.transaction_date);
    const time = 365 * 60 * 60 * 24 * 1000;
    const time2 = 180 * 60 * 60 * 24 * 1000;
    if ((todayDate.getTime() - secondDate.getTime()) < time  && (todayDate.getTime() - secondDate.getTime()) > time2  && value.balance >= 0) {
      return value.balance;
    } else  {
      return 0;
    }

  }
  ageOverAnnual(value) {
    const todayDate = new Date();
    // const diff = Math.abs(value.transaction_date.getTime() - todayDate.getTime());
    // const diffDays = Math.ceil(diff / ((1000 * 3600 * 24)) * 30);

    const secondDate = new Date(value.transaction_date);
    const time = 365 * 60 * 60 * 24 * 1000;
    if ((todayDate.getTime() - secondDate.getTime()) > time  && value.balance >= 0) {
      return value.balance;
    } else  {
      return 0;
    }

  }

  getTotalOutstanding(value) {
    const total = Number(this.ageThirty(value)) + Number(this.ageSixty(value)) + Number(this.ageNinety(value)) +
      Number(this.ageOneTwenty(value)) + Number(this.ageOneEighty(value)) + Number(this.ageAnnual(value)) +
      Number(this.ageOverAnnual(value));
    console.log('Total', total);

    return total;
  }


  generatePDF() {
    const data = document.getElementById('printSection');
    html2canvas(data).then(canvas => {
      const imgWidth = 208;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('p', 'mm', 'a4');
      const position = 0;
      console.log('ID', this.client);
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save( `${this.client.clientID}-Age-Analysis.pdf`);
      this.generatingPDF = false;
    });
  }

}
