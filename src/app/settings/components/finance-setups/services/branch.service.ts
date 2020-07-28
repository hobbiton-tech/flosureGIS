import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBranch } from '../../../models/finance/branch.model';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import 'firebase/firestore';
import { NzMessageService } from 'ng-zorro-antd';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  private branchCollection: AngularFirestoreCollection<IBranch>;
  branches: Observable<IBranch[]>;

  constructor(
    private http: HttpClient,
    private firebase: AngularFirestore,
    private message: NzMessageService
  ) {

    this.branchCollection = firebase.collection<IBranch>('branches');
    this.branches = this.branchCollection.valueChanges();

  }

  // Branches Methods
  async addBranch(branch: IBranch): Promise<void> {
    await this.branchCollection
      .doc(branch.id)
      .set(branch)
      .then((mess) => {
        this.message.success('Branch Successfully Added')
      })
      .catch((err) => {
        this.message.warning('Branch Creeation failed')
        console.log(err);
      });
  }

  async updateBranch(branch: IBranch): Promise<void> {
    return this.branchCollection
      .doc(`${branch.id}`)
      .update(branch)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }


  getBranch(): Observable<IBranch[]> {
    return this.branches;
  }


}
