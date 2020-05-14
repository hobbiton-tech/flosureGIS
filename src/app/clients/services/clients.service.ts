import { Injectable } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { IIndividualClient, ICorporateClient } from '../models/clients.model';
import {
    AngularFirestore,
    AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { first } from 'rxjs/operators';
import { v4 } from 'uuid';

import 'firebase/firestore';
import { IIndividualClientDto, ICorporateClientDto } from '../models/client.dto';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
    providedIn: 'root',
})
export class ClientsService {
    constructor(
        private readonly http: HttpClient,
    ) {}

    getAllClients(): Observable<[IIndividualClientDto[], ICorporateClientDto[]]> {
        return combineLatest(
            this.getIndividualClient(),
            this.getCorporateClient()
        );
    }

    addIndividualClient(dto: IIndividualClientDto): Observable<IIndividualClientDto> {
        return this.http.post<IIndividualClient>(
            'https://flosure-postgres-api.herokuapp.com/',
            dto, httpOptions
        );
    }

    addCorporateClient(dto: ICorporateClientDto): Observable<ICorporateClientDto> {
        return this.http.post<ICorporateClientDto>(
            'https://flosure-postgres-api.herokuapp.com/',
            dto, httpOptions
        );
    }

    getIndividualClient(): Observable<IIndividualClientDto[]> {
        return this.http.get<IIndividualClientDto[]>('');
    }

    getCorporateClient(): Observable<ICorporateClientDto[]> {
        return this.http.get<ICorporateClientDto[]>('');
    }
    updateIndividualClient(dto: IIndividualClientDto): Observable<any> {
        return this.http.put('', dto, httpOptions);
    }

    countGenerator(numb: string | number) {
        if (numb <= 99999) {
            numb = ('0000' + numb).slice(-5);
        }
        return numb;
    }

    generateClientID(
        clientType: string,
        brokerName: string,
        totalClients: number
    ) {
        const clientTyp = clientType.substring(0, 3).toLocaleUpperCase();
        const brokerNam = brokerName.substring(0, 2).toLocaleUpperCase();
        const count = this.countGenerator(totalClients);

        return clientTyp + brokerNam + count;
    }
}
