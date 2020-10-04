import { Component, OnInit, OnDestroy } from '@angular/core';
import { QuotesService } from './services/quotes.service';
import { MotorQuotationModel } from './models/quote.model';
import { Router } from '@angular/router';
import { InsuranceClassHandlerService } from '../underwriting/services/insurance-class-handler.service';
import { Subscription } from 'rxjs';
import { IClass } from '../settings/components/product-setups/models/product-setups-models.model';
import { StringValueToken } from 'html2canvas/dist/types/css/syntax/tokenizer';
import * as jwt_decode from 'jwt-decode';
import { UsersService } from '../users/services/users.service';
import { UserModel } from '../users/models/users.model';
import { PermissionsModel, RolesModel } from '../users/models/roles.model';

@Component({
    selector: 'app-quotes',
    templateUrl: './quotes.component.html',
    styleUrls: ['./quotes.component.scss']
})
export class QuotesComponent implements OnInit, OnDestroy {
    classHandlerSubscription: Subscription;

    currentClass: IClass;
    currentClassName: string;
    currentClassDisplay: string;

    quotesList: MotorQuotationModel[];
    displayQuotesList: MotorQuotationModel[];
    quotesCount = 0;
    isOkLoading = false;

    searchString: string;
    permission: PermissionsModel;
    user: UserModel;
    isPresent: PermissionsModel;
    createQuote = 'create_quote';
    admin = 'admin';
    loggedIn = localStorage.getItem('currentUser');

    constructor(
        private quoteServise: QuotesService,
        private router: Router,
        private classHandler: InsuranceClassHandlerService,
        private usersService: UsersService
    ) {
        this.classHandlerSubscription = this.classHandler.selectedClassChanged$.subscribe(
            currentClass => {
                this.currentClass = JSON.parse(
                    localStorage.getItem('classObject')
                );
                this.currentClassName = localStorage.getItem('class');

                this.currentClassDisplay = currentClass.className;
            }
        );
    }

    ngOnInit(): void {
        this.isOkLoading = true;

        // setTimeout(() => {
        //     this.isOkLoading = false;
        // }, 3000);

        this.quoteServise.getMotorQuotations().subscribe(quotes => {
            this.quotesList = quotes;
            this.quotesCount = quotes.length;

            this.displayQuotesList = this.quotesList.filter(
                x => x.class.className == localStorage.getItem('class')
            );
            this.quotesCount = this.displayQuotesList.length;
            this.isOkLoading = false;
        });

        const decodedJwtData = jwt_decode(this.loggedIn);
        console.log('Decoded>>>>>>', decodedJwtData);

        this.usersService.getUsers().subscribe(users => {
            this.user = users.filter(x => x.ID === decodedJwtData.user_id)[0];

            this.isPresent = this.user.Permission.find(
                el => el.name === this.admin || el.name === this.createQuote
            );

            console.log('USERS>>>', this.user, this.isPresent, this.admin);
        });
    }

    viewDetails(quotation: MotorQuotationModel): void {
        this.router.navigateByUrl(
            '/flosure/quotes/quote-details/' +
                encodeURIComponent(quotation.quoteNumber)
        );
    }

    search(value: string): void {
        if (value === ' ' || !value) {
        }
        {
            this.displayQuotesList = this.quotesList;
        }

        this.displayQuotesList = this.quotesList.filter(quote => {
            return (
                quote.quoteNumber.toLowerCase().includes(value.toLowerCase()) ||
                quote.clientCode.toLowerCase().includes(value.toLowerCase()) ||
                quote.startDate
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()) ||
                quote.endDate
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()) ||
                quote.status
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase())
            );
        });
    }

    onCreateQuoteClicked(): void {
        this.router.navigateByUrl('/flosure/quotes/create-quote');
    }

    ngOnDestroy() {
        this.classHandlerSubscription.unsubscribe();
    }
}
