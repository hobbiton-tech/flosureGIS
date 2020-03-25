import { Injectable } from '@angular/core';
import { MotorQuotationModel, RiskModel, Quote } from '../models/quote.model';
import { Observable, from } from 'rxjs';
import {
    AngularFirestore,
    AngularFirestoreCollection,
    AngularFirestoreDocument,
    DocumentReference
} from '@angular/fire/firestore';
import { map, flatMap, first } from 'rxjs/operators';
import { v4 } from 'uuid';

@Injectable({
    providedIn: 'root'
})
export class QuotesService {
    private motorQuoteCollection: AngularFirestoreCollection<
        MotorQuotationModel
    >;
    private quoteObject: AngularFirestoreDocument<MotorQuotationModel>;
    quotations: Observable<MotorQuotationModel[]>;
    quotation: Observable<MotorQuotationModel>;
    quote: MotorQuotationModel;
    myQuote: DocumentReference;

    private riskCollection: AngularFirestoreCollection<RiskModel>;
    risks: Observable<RiskModel[]>;
    risk: Observable<RiskModel>;
    constructor(private firebase: AngularFirestore) {
        this.motorQuoteCollection = firebase.collection<MotorQuotationModel>(
            'mortor_quotations'
      );

        this.quotations = this.motorQuoteCollection.valueChanges();

        this.riskCollection = firebase.collection<RiskModel>('risks');
        this.risks = this.riskCollection.valueChanges();
    }

  // add quotation
  async addMotorQuotation(quotation: MotorQuotationModel): Promise<void> {
    this.quotations.pipe(first()).subscribe(async quotations => {
      quotation.id = v4();

      quotation.quoteNumber = this.generateQuoteNumber('BRaa', quotations.length);

      await this.motorQuoteCollection
          .add(quotation)
          .then(mess => {
              // view message
              console.log('<========Qoutation Details==========>');

              console.log(quotation);
          })
          .catch(err => {
              console.log('<========Qoutation Error Details==========>');
              console.log(err);
          });
      // });
      // this.motorQuoteCollection
      //       .add(quotation)
            // .then(mess => {
            //     // Do something
            //     console.log('<========Qoutation Details==========>');

            //     console.log(quotation);
            // })
            // .catch(err => {
            //     console.log('<========Qoutation Error Details==========>');
            //     console.log(err);
            // });
    });
  }


    // add risks
  async addRisk(risk: RiskModel): Promise<void> {

    this.risks.pipe(first()).subscribe(async risks => {
      this.riskCollection
          .add(risk)
          .then(mess => {
              // view message
              console.log('<========Risk Details==========>');

              console.log(risk);
          })
          .catch(err => {
              console.log('<========Risk Error Details==========>');
              console.log(err);
          });
    });
    }

  // get single risk
    getRisk(quoteNumber: string) {
        return this.firebase
            .collection('risks')
            .ref.where('quoteNumber', '==', quoteNumber)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    // doc.data() is never undefined for query doc snapshots
                    console.log('<============Quote Data=============>');
                    console.log(doc.data());
                });
            })
            .catch(error => {
                console.log('Error getting documents: ', error);
            });
      // return this.risks.pipe(map(x => x.find(y => y.qouteNumber === quoteNumber)));
  }


  // get risks

    getRisks(): Observable<RiskModel[]> {
        return this.risks;
    }

    getQuotes(): Observable<MotorQuotationModel[]> {
        return this.quotations;
    }

    private countGenerator(numb) {
        if (numb <= 99999) {
            numb = ('000' + numb).slice(-4);
        }
        return numb;
    }

    // Genereating quote number
    generateQuoteNumber(brokerCode: string, totalQuotes: number) {
        const brokerCod = brokerCode;
        const today = new Date();
        const dateString: string =
            today
                .getFullYear()
                .toString()
                .substr(-2) +
            ('0' + (today.getMonth() + 1)).slice(-2) +
            +('0' + today.getDate()).slice(-2);
        const count = this.countGenerator(totalQuotes);
        return 'QO' + brokerCode + dateString + count;
    }
}
