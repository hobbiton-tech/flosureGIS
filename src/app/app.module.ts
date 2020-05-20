import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { NavigationComponent } from './navigation/navigation.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { LoginComponent } from './login/login.component';
import { AngularFireStorageModule, BUCKET } from '@angular/fire/storage';
import { environment } from '../environments/environment';
import 'firebase/storage';
import { SlackService } from './slack.service';

registerLocaleData(en);

const firebaseConfig = {
    // apiKey: 'AIzaSyDzwhgLq4-nMHpJ1xldhHwPwpjOHc4sZV0',
    // authDomain: 'flosure-backend.firebaseapp.com',
    // databaseURL: 'https://flosure-backend.firebaseio.com',
    // projectId: 'flosure-backend',
    // storageBucket: 'flosure-backend.appspot.com',
    // messagingSenderId: '167483416678',
    // appId: '1:167483416678:web:dcd089c936275ee33f4da7',
    // measurementId: 'G-4565Y5EHD4',

    apiKey: 'AIzaSyA4otys77Tb4bX7uXJONdquRlj0HCzzn1M',
    authDomain: 'aplus-insurance.firebaseapp.com',
    databaseURL: 'https://aplus-insurance.firebaseio.com',
    projectId: 'aplus-insurance',
    storageBucket: 'aplus-insurance.appspot.com',
    messagingSenderId: '526693014551',
    appId: '1:526693014551:web:edce6fd10c1c52742dd052',
    measurementId: 'G-GNB5VZE6XQ'
};

@NgModule({
    declarations: [AppComponent, NavigationComponent, LoginComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgZorroAntdModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireDatabaseModule,
        AngularFireStorageModule
    ],
    providers: [{ provide: NZ_I18N, useValue: en_US }, SlackService],
    bootstrap: [AppComponent]
})
export class AppModule {}
