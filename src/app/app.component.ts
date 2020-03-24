import { Component, OnInit } from '@angular/core';
// import { generateQuotes } from './quotes/data/quote.data';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'flosure-broker-ui';
    // quotes = generateQuotes();

    ngOnInit() {
        // console.log(this.quotes);
    }
}
