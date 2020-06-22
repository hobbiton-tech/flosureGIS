import { Injectable } from '@angular/core';
import { ICommissionSetup } from '../models/commission-setup.model';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
// const BASE_URL = 'https://www.flosure-api.com';
const BASE_URL = 'http://104.248.247.78:3000';
@Injectable({
    providedIn: 'root',
})
export class CommisionSetupsService {
    constructor(private http: HttpClient) {}

    addCommissionSetup(dto: ICommissionSetup): Observable<ICommissionSetup> {
        return this.http.post<ICommissionSetup>(
            'https://www.flosure-api.com/commission-setups',
            dto
        );
    }

    getCommissionSetups(): Observable<ICommissionSetup[]> {
        return this.http.get<ICommissionSetup[]>(
            'https://www.flosure-api.com/commission-setups'
        );
    }
}
