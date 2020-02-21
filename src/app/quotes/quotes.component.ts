import { Component, OnInit } from '@angular/core';
import { generateQuotes } from './data/quote.data';

@Component({
    selector: 'app-quotes',
    templateUrl: './quotes.component.html',
    styleUrls: ['./quotes.component.scss']
})
export class QuotesComponent implements OnInit {
    quotesList = generateQuotes();

    constructor() {}

    ngOnInit(): void {}
}
