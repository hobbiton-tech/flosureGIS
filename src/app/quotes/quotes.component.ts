import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-quotes',
    templateUrl: './quotes.component.html',
    styleUrls: ['./quotes.component.scss']
})
export class QuotesComponent implements OnInit {
    quotesList = [];

    constructor() {}

    ngOnInit(): void {}
}
