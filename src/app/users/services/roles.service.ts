import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IRole } from '../models/roles.model';
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

// const BASE_URL = 'https://www.flosure-api.com';


@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private rolesCollection: AngularFirestoreCollection<IRole>;
  roles: Observable<IRole[]>;

  constructor(
    private http: HttpClient,
    private firebase: AngularFirestore,
    private message: NzMessageService
    //  public afs: AngularFirestore,
    // public afAuth: AngularFireAuth, // Inject Firebase auth service
    // public router: Router,
    // public ngZone: NgZone, // NgZone service to remove outside scope warning
  ) {
    this.rolesCollection = firebase.collection<IRole>('roles')
    this.roles = this.rolesCollection.valueChanges();
  }


  // roles Methods
  async addRole(role: IRole): Promise<void> {
    await this.rolesCollection
      .doc(role.id)
      .set(role)
      .then((mess) => {
        this.message.success('Role  Added')
      })
      .catch((err) => {
        this.message.warning('Role Creeation failed')
        console.log(err);
      });
  }

  async updateRole(role: IRole): Promise<void> {
    return this.rolesCollection
      .doc(`${role.id}`)
      .update(role)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }




  getRole(): Observable<IRole[]> {
    return this.roles;
  }



  // addRole(dto: IRoles): Observable<IRoles> {
  //   console.log(dto)
  //   return this.http.post<IRoles>(
  //     ' https://www.flosure-Observable.com/roles',

  //     dto
  //   );
  // }
  // getRoles(): Observable<RolesModel[]> {
  //   return this.http.get<RolesModel[]>(' https://www.flosure-api.com/roles');
  // }
  // getSingleRole(roleId: string): Observable<RolesModel> {
  //   return this.http.get<RolesModel>(` https://www.flosure-api.com/${roleId}`);

  // }

}
