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

registerLocaleData(en);

const firebaseConfig = {
    apiKey: 'AIzaSyDzwhgLq4-nMHpJ1xldhHwPwpjOHc4sZV0',
    authDomain: 'flosure-backend.firebaseapp.com',
    databaseURL: 'https://flosure-backend.firebaseio.com',
    projectId: 'flosure-backend',
    storageBucket: 'flosure-backend.appspot.com',
    messagingSenderId: '167483416678',
    appId: '1:167483416678:web:dcd089c936275ee33f4da7',
    measurementId: 'G-4565Y5EHD4'
};

@NgModule({
    declarations: [AppComponent, NavigationComponent, LoginComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgZorroAntdModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        AngularFireAuthModule,
        AngularFireDatabaseModule,
        AngularFireModule.initializeApp(firebaseConfig)
    ],
    providers: [{ provide: NZ_I18N, useValue: en_US }],
    bootstrap: [AppComponent]
})
export class AppModule {}
