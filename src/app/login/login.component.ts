import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {} from 'firebase/app';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    email: string;
    password: string;
    validateStatus: string;
    loginForm: FormGroup;

    constructor(
        private router: Router,
        public auth: AngularFireAuth,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            email: [null, [Validators.required, Validators.email]],
            password: [null, [Validators.required]],
            remember: [true]
        });
    }

    login(): void {
        for (const i in this.loginForm.controls) {
            this.loginForm.controls[i].markAsDirty();
            this.loginForm.controls[i].updateValueAndValidity();
        }
        if (!this.loginForm.invalid) {
            this.auth
                .signInWithEmailAndPassword(
                    this.loginForm.controls['email'].value,
                    this.loginForm.controls['password'].value
                )
                .then(res => {
                    console.log(res);
                    this.router.navigateByUrl('/flosure/dashboard');
                })
                .catch(err => {
                    console.log(err);
                    for (const i in this.loginForm.controls) {
                        this.loginForm.controls[i].markAsDirty();
                        this.validateStatus = 'error';
                        // this.loginForm.controls[i].updateValueAndValidity();
                    }
                    // this.loginForm.reset();
                });
        }
    }
}