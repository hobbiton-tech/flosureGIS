import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UserModel, UserRolePermissionModel } from '../models/users.model';
import { AngularFireAuth } from '@angular/fire/auth';
// import { auth } from 'firebase';
import {
    AngularFirestore,
    AngularFirestoreDocument
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { PermissionsModel } from '../models/roles.model';


const BASE_URL = 'https://user-management.savenda-flosure.com';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    userData: any; // Save logged in user data
    userDetails: UserModel;
    constructor(
        private http: HttpClient,
        public afs: AngularFirestore, // Inject Firestore service
        public afAuth: AngularFireAuth, // Inject Firebase auth service
        public router: Router,
        public ngZone: NgZone, // NgZone service to remove outside scope warning
        // private usersService: UsersService,
        private msg: NzMessageService
    ) {}

    // Sign up with email/password
    SignUp(userData: UserModel) {
        const randomstring = Math.random()
            .toString(36)
            .slice(-8);
        this.userDetails = { ...userData, password: randomstring };
        console.log('USER DETAILS>>>>', this.userDetails);
        // this.usersService.addUser(this.userDetails);
        return this.afAuth
            .createUserWithEmailAndPassword(userData.email, randomstring)
            .then(result => {
                /* Call the SendVerificaitonMail() function when new user sign
        up and returns promise */

                // this.SendVerificationMail();
                // this.addUser(this.userDetails);
                this.http
                    .post<UserModel>(
                        ' http://api.goldenlotusinsurance.com/users',

                        this.userDetails
                    )
                    .subscribe();
                const emailDetails = {
                    username: this.userDetails.email,
                    text:
                        'Dear ' +
                        this.userDetails.first_name +
                        ' ' +
                        this.userDetails.surname +
                        ', ' +
                        ' your username is ' +
                        this.userDetails.email +
                        ' and your password is ' +
                        this.userDetails.password +
                        ' for https://www.goldenlotusinsurance.com (flosure General Insurance System)',
                    subject: 'Flosure General insurance System Credentials',
                    receiver: this.userDetails.email,
                    sender: 'Flosure General Insurance System',
                    password: this.userDetails.password,
                    url: 'https://www.goldenlotusinsurance.com'
                };
                this.http
                    .post<any>(
                        'https://number-generation.flosure-api.com/email',
                        emailDetails
                    )
                    .toPromise();
                console.log('Password>>>>', randomstring);
            })
            .catch(error => {
                this.msg.error(error.message);
            });
    }

    //                     this.userDetails
    //                 )
    //                 .subscribe();
    //             console.log('Password>>>>', randomstring);
    //         })
    //         .catch(error => {
    //             this.msg.error(error.message);
    //         });
    // }

    // Reset Forggot password
    ForgotPassword(passwordResetEmail) {
        return this.afAuth
            .sendPasswordResetEmail(passwordResetEmail)
            .then(() => {
                window.alert('Password reset email sent, check your inbox.');
            })
            .catch(error => {
                this.msg.error(error);
            });
    }

    addUser(dto: UserModel): Observable<UserModel> {
        console.log(dto);
        return this.http.post<UserModel>(
            ' http://api.goldenlotusinsurance.com/users',
            dto
        );
    }

    getUsers(): Observable<UserModel[]> {
        return this.http.get<UserModel[]>(`${BASE_URL}/user`);
    }

    createUser(cUser: UserModel): Observable<UserModel> {
        return this.http.post<UserModel>(`${BASE_URL}/register`, cUser);
    }

    updatePermission(uUser: UserModel) {
        return this.http.put<UserModel>(`${BASE_URL}/user/${uUser.ID}`, uUser);
    }

    createUserRolePermission(
        urp: UserRolePermissionModel
    ): Observable<UserRolePermissionModel> {
        return this.http.post<UserRolePermissionModel>(
            `${BASE_URL}/user-role-permission`,
            urp
        );
    }

    sendEmail(emailDetails) {
        return this.http.post<any>(
            'https://number-generation.flosure-api.com/email',
            emailDetails
        );
    }
    getSingleUser(userId: string): Observable<UserModel> {
        return this.http.get<UserModel>(
            ` http://api.goldenlotusinsurance.com/${userId}`
        );
    }
}
