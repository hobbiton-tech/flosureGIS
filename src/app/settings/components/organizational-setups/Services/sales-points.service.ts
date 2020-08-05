
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs'
import { ISalesPoints } from '../../../models/organizational/salesPoints.model'
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import 'firebase/firestore';

import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { promise } from 'protractor';


@Injectable({
  providedIn: 'root'
})
export class SalesPointsService {
  private salesPointCollection: AngularFirestoreCollection<ISalesPoints>;
  salesPoints: Observable<ISalesPoints[]>;

  constructor(
    private http: HttpClient,
    private firebase: AngularFirestore,
    private message: NzMessageService
  ) {

    this.salesPointCollection = firebase.collection<ISalesPoints>('salespoints')
    this.salesPoints = this.salesPointCollection.valueChanges();

  }

  //Sales Points Methods
  async addSalesPoint(salesPoint: ISalesPoints): Promise<void> {
    await this.salesPointCollection
      .doc(salesPoint.id)
      .set(salesPoint)
      .then((mess) => {
        this.message.success('Sales-Point Created Successfully')
      })
      .catch((err) => {
        this.message.warning('Sales-Point Creation Failed')
        console.log(err);
      });

  }

  async updateSalesPoint(salesPoint: ISalesPoints): Promise<void> {
    return this.salesPointCollection
      .doc(`${salesPoint.id}`)
      .update(salesPoint)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

  }

  getSalesPoint(): Observable<ISalesPoints[]> {
    return this.salesPoints;
  }









}
