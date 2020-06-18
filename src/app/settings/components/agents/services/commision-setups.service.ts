import { Injectable } from '@angular/core';
import { ICommissionSetup } from '../models/commission-setup.model';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CommisionSetupsService {
    constructor(private http: HttpClient) {}

    addCommissionSetup(dto: ICommissionSetup): Observable<ICommissionSetup> {
        return this.http.post<ICommissionSetup>(
            'http://104.248.247.78:3000/commission-setups',
            dto
        );
    }

    getCommissionSetups(): Observable<ICommissionSetup[]> {
        return this.http.get<ICommissionSetup[]>(
            'http://104.248.247.78:3000/commission-setups'
        );
    }
}
