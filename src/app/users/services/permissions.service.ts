import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IPermission } from '../models/permissions.model'
import { AngularFireAuth } from "@angular/fire/auth";
import { auth } from "firebase";
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from "@angular/fire/firestore";

import 'firebase/firestore';

import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';


@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  private permissionsCollection: AngularFirestoreCollection<IPermission>;
  permissions: Observable<IPermission[]>;


  // permissionsDetails: IPermission;

  constructor(
    private http: HttpClient,
    private firebase: AngularFirestore,
    private message: NzMessageService
    //  public afs: AngularFirestore,
    // public afAuth: AngularFireAuth, // Inject Firebase auth service
    // public router: Router,
    // public ngZone: NgZone, // NgZone service to remove outside scope warning
    //private permissionsService: PermissionsService,

  ) {
    this.permissionsCollection = firebase.collection<IPermission>('permissions')
    this.permissions = this.permissionsCollection.valueChanges();
  }

  // Permission Methods
  async addPermission(permission: IPermission): Promise<void> {
    await this.permissionsCollection
      .doc(permission.id)
      .set(permission)
      .then((mess) => {
        this.message.success('Permission  Added')
      })
      .catch((err) => {
        this.message.warning('Permission Creeation failed')
        console.log(err);
      });
  }

  async updatePermission(permission: IPermission): Promise<void> {
    return this.permissionsCollection
      .doc(`${permission.id}`)
      .update(permission)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

  }

  getPermission(): Observable<IPermission[]> {
    return this.permissions;
  }

  // addPermission(dto: PermissionsModel): Observable<PermissionsModel> {
  //   console.log(dto)
  //   return this.http.post<PermissionsModel>(
  //     ' https://www.flosure-Observable.com/permissions',

  //     dto
  //   );
  // }
  // getPermissions(): Observable<PermissionsModel[]> {
  //   return this.http.get<PermissionsModel[]>('https://www.flosure-Observable.com/permissions');
  // }
  // getSinglePermission(permissionId: string): Observable<PermissionsModel> {
  //   return this.http.get<PermissionsModel>(` https://www.flosure-api.com/${permissionId}`);

  // }

}
