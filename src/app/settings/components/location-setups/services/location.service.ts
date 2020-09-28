import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IProvince } from '../models/province.model';
import { ICity } from '../models/city.model';
import { Observable } from 'rxjs';

const BASE_URL = 'http://localhost:3001';

@Injectable({
    providedIn: 'root'
})
export class LocationService {
    constructor(private http: HttpClient) {}

    // Provinces
    addProvince(province: IProvince): Observable<IProvince> {
        return this.http.post<IProvince>(`${BASE_URL}/province/1`, province);
    }

    getProvinces(): Observable<IProvince[]> {
        return this.http.get<IProvince[]>(`${BASE_URL}/province`);
    }

    getProvinceById(provinceId: string): Observable<IProvince> {
        return this.http.get<IProvince>(`${BASE_URL}/province/${provinceId}`);
    }

    updateProvince(
        province: IProvince,
        provinceId: string
    ): Observable<IProvince> {
        return this.http.put<IProvince>(
            `${BASE_URL}/province/${provinceId}`,
            province
        );
    }

    // Cities/Towns
    addCity(provinceId: string, city: ICity): Observable<ICity> {
        return this.http.post<ICity>(`${BASE_URL}/city/${provinceId}`, city);
    }

    getCities(): Observable<ICity[]> {
        return this.http.get<ICity[]>(`${BASE_URL}/city`);
    }

    getCityById(cityId: string): Observable<ICity> {
        return this.http.get<ICity>(`${BASE_URL}/city${cityId}`);
    }

    updateCity(city: ICity, cityId: string): Observable<ICity> {
        return this.http.put<ICity>(`${BASE_URL}/city/${cityId}`, city);
    }
}
