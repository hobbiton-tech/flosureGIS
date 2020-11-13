import { Injectable } from '@angular/core';
import {
    Resolve,
    RouterStateSnapshot,
    ActivatedRouteSnapshot
} from '@angular/router';
import { Claim } from '../models/claim.model';
import { ClaimsService } from './claims-service.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const BASE_URL = 'http://test-main.flosure-api.com';

@Injectable({
    providedIn: 'root'
})
export class CalimsResolverService implements Resolve<any> {
    claimData: Claim;

    constructor(
        private claimsService: ClaimsService,
        private http: HttpClient
    ) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<Claim> {
        return this.http.get<Claim>(`${BASE_URL}/claim/${route.params['id']}`);
    }
}
