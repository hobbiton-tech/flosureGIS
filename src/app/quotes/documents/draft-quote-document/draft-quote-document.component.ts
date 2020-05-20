import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-draft-quote-document',
  templateUrl: './draft-quote-document.component.html',
  styleUrls: ['./draft-quote-document.component.scss']
})
export class DraftQuoteDocumentComponent implements OnInit {

  @Input()
  quoteNumber: string;

  @Input()
  dateCreated: string;

  @Input()
  clientName: string;

  @Input()
  clientNumber: string;

  @Input()
  clientEmail: string;

  @Input()
  insuranceType: string;

  @Input()
  numberOfRisks: string;

  @Input()
  basicPremium: string;

  @Input()
  loadingAmount: string;

  @Input()
  discountAmount: string;

  @Input()
  premiumLevy: string;

  @Input()
  totalAmount: string;

  constructor() { }

  ngOnInit(): void {
  }

}