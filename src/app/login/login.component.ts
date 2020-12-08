import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {} from 'firebase/app';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SlackService } from '../slack.service';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../users/services/authentication.service';
import { first } from 'rxjs/operators';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    email: string;
    password: string;
    validateStatus: string;
    loginForm: FormGroup;
  returnUrl: string;
  error = '';

    geolocationPosition: Position;

    isLoggingIn = false;

    constructor(
        private router: Router,
        public auth: AngularFireAuth,
        private fb: FormBuilder,
        private slackServie: SlackService,
        private http: HttpClient,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private authenticationService: AuthenticationService
    ) {
      // redirect to home if already logged in
      if (this.authenticationService.currentUserValue) {
        this.router.navigate(['/flosure/dashboard']);
      }
    }

    async ngOnInit(): Promise<void> {
        this.loginForm = this.fb.group({
            email: [null, [Validators.required, Validators.email]],
            password: [null, [Validators.required]],
            remember: [true],
        });

        // await this.slackServie.sendToSlack({
        //     event: 'Portal Access Event',
        //     title: 'Flosure portal has been accessed',
        //     text: `The location of access is currently unknown`,
        // });

        // if (window.navigator && window.navigator.geolocation) {
        //     window.navigator.geolocation.getCurrentPosition(
        //         async (position) => {
        //             (this.geolocationPosition = position),
        //                 console.log(position);
        //             this.http
        //                 .get(
        //                     `https://api.opencagedata.com/geocode/v1/json?q=${position.coords.latitude}+${position.coords.longitude}&key=7840d4e63aa84c7d95ff24c9b431a8fc`
        //                 )
        //                 .subscribe(async (res) => {
        //                     await this.slackServie.sendToSlack({
        //                         event: 'Portal Access Event',
        //                         title: 'Flosure portal has been accessed',
        //                         text: `The location of access is ${res['results'][0]['formatted']}`,
        //                     });
        //                 });
        //         },
        //         async (error) => {
        //             switch (error.code) {
        //                 case 1:
        //                     await this.slackServie.sendToSlack({
        //                         event: 'Portal Access Event',
        //                         title: 'Flosure portal has been accessed',
        //                         text: `Location access has been denied`,
        //                     });
        //                     break;
        //                 case 2:
        //                     await this.slackServie.sendToSlack({
        //                         event: 'Portal Access Event',
        //                         title: 'Flosure portal has been accessed',
        //                         text: `User location is not available`,
        //                     });
        //                     break;
        //                 case 3:
        //                     await this.slackServie.sendToSlack({
        //                         event: 'Portal Access Event',
        //                         title: 'Flosure portal has been accessed',
        //                         text: `The location of access is has timeout`,
        //                     });
        //                     break;
        //             }
        //         }
        //     );
        // }

      // get return url from route parameters or default to '/'
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/flosure/dashboard';
    }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

    login(): Promise<void> {
        this.isLoggingIn = true;
      // stop here if form is invalid
        if (this.loginForm.invalid) {
        return;
      }
        for (const i in this.loginForm.controls) {
            this.loginForm.controls[i].markAsDirty();
            this.loginForm.controls[i].updateValueAndValidity();
        }
        if (!this.loginForm.invalid) {
            // await this.auth
            //     .signInWithEmailAndPassword(
            //         this.loginForm.controls.email.value,
            //         this.loginForm.controls.password.value
            //     )
            //     .then((res) => {
            //         localStorage.setItem(
            //             'user',
            //             this.loginForm.controls.email.value
            //         );
            //         this.router.navigateByUrl('/flosure/dashboard');
            //         this.slackServie.sendToSlack({
            //             event: 'Login Event',
            //             title: 'Flosure Portal Login',
            //             text: `${this.loginForm.controls.email.value} logged into the portal`,
            //         });
            //     })
            //     .catch((err) => {
            //         this.isLoggingIn = false;
            //         for (const i in this.loginForm.controls) {
            //             this.loginForm.controls[i].markAsDirty();
            //             this.validateStatus = 'error';
            //         }
            //     });


          this.authenticationService.login(this.f.email.value, this.f.password.value)
            .pipe(first())
            .subscribe(
              data => {
                this.slackServie.sendToSlack({
                  event: 'Login Event',
                  title: 'Flosure Portal Login',
                  text: `${this.loginForm.controls.email.value} logged into the portal`,
                });
                this.router.navigate([this.returnUrl]);
              },
              error => {
                this.error = error;
                this.isLoggingIn = false;
                for (const i in this.loginForm.controls) {
                  this.loginForm.controls[i].markAsDirty();
                  this.validateStatus = 'error';
                }
              });

        }
    }
}
