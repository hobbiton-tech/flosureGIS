
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs'
import { IOBranch } from '../../../models/organizational/branch.model';
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
export class OrgBranchService {
  private branchCollection: AngularFirestoreCollection<IOBranch>;
  orgBranches: Observable<IOBranch[]>;

  constructor(
    private http: HttpClient,
    private firebase: AngularFirestore,
    private message: NzMessageService) {
    this.branchCollection = firebase.collection<IOBranch>('orgBranches')
    this.orgBranches = this.branchCollection.valueChanges();
  }


  //Brnahces Methods
  async addBranch(orgBranch: IOBranch): Promise<void> {
    await this.branchCollection
      .doc(orgBranch.id)
      .set(orgBranch)
      .then((mess) => {
        this.message.success('Branch Created Successfully')
      })
      .catch((err) => {
        this.message.warning('Branche Creation Failed')
        console.log(err);
      });

  }

  async updateBranch(orgBranch: IOBranch): Promise<void> {
    return this.branchCollection
      .doc(`${orgBranch.id}`)
      .update(orgBranch)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

  }

  getBranch(): Observable<IOBranch[]> {
    return this.orgBranches;
  }



}
