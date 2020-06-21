import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UserModel } from '../models/users.model';
import { AngularFireAuth } from "@angular/fire/auth";
import { auth } from "firebase";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    userData: any; // Save logged in user data
  userDetails: UserModel;
    constructor(private http: HttpClient,  public afs: AngularFirestore, // Inject Firestore service
        public afAuth: AngularFireAuth, // Inject Firebase auth service
        public router: Router,
        public ngZone: NgZone, // NgZone service to remove outside scope warning
        private usersService: UsersService,
        private msg: NzMessageService) {}


         // Sign up with email/password
  SignUp(userData: UserModel) {
    const randomstring = Math.random().toString(36).slice(-8);
    this.userDetails = {...userData, password: randomstring};
    console.log("USER DETAILS>>>>", this.userDetails);
    // this.usersService.addUser(this.userDetails);
    return this.afAuth
      .createUserWithEmailAndPassword(userData.email, randomstring)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign
        up and returns promise */
        // this.SendVerificationMail();
        // this.addUser(this.userDetails);
        this.http.post<UserModel>(
            ' https://www.flosure-api.com/users',
    
            this.userDetails
        ).subscribe();
        console.log("Password>>>>", randomstring)
      })
      .catch((error) => {
        this.msg.error(error.message);
      });
  }

  

  // Reset Forggot password
  ForgotPassword(passwordResetEmail) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert("Password reset email sent, check your inbox.");
      })
      .catch((error) => {
        this.msg.error(error);
      });
  }

    addUser(dto: UserModel): Observable<UserModel> {
        console.log(dto)
        return this.http.post<UserModel>(
            ' https://www.flosure-api.com/users',

            dto
        );
    }

    getUsers(): Observable<UserModel[]> {
        return this.http.get<UserModel[]>(' https://www.flosure-api.com/users');
    }

    getSingleUser(userId: string): Observable<UserModel> {
        return this.http.get<UserModel>(` https://www.flosure-api.com/${userId}`);
    }
}
