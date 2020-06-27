import { Injectable } from '@angular/core';
import { IVehicleType } from '../models/vehicle.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VehicleDTO } from 'src/app/quotes/services/quotes.service';

// const BASE_URL = 'https://flosure-api.com';
const BASE_URL = 'http://localhost:3000'

@Injectable({
    providedIn: 'root',
})
export class VehicleService {
    vehicleType: IVehicleType[];

    constructor(private http: HttpClient) {}

    addVehicleType(vehicleType: IVehicleType): Observable<IVehicleType> {
        return this.http.post<IVehicleType>(
            `${BASE_URL}/vehicle`,
            vehicleType
        );
    }

    getOneVehicleType(id: string): Observable<IVehicleType> {
        return this.http.get<IVehicleType>(
            `${BASE_URL}/vehicle/${id}`
        );
    }

    getVehicleType(): Observable<IVehicleType[]> {
        return this.http.get<IVehicleType[]>(`${BASE_URL}/vehicle`);
    }

    updateVehicleType(
        vehicleType: IVehicleType,
        id: string
    ): Observable<IVehicleType[]> {
        return this.http.put<IVehicleType[]>(
            `${BASE_URL}vehicle/${id}`,
            vehicleType
        );
    }
}
