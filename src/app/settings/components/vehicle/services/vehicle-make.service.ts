import { Injectable } from '@angular/core';
import { IVehicleMake } from '../models/vehicle.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE_URL = 'https://www.flosure-api.com';
// const BASE_URL = 'http://localhost:3000'

@Injectable({
    providedIn: 'root',
})
export class VehicleMakeService {
    vehicleMake: IVehicleMake[];

    constructor(private http: HttpClient) {}

    addVehicleMake(vehicleMake: IVehicleMake): Observable<IVehicleMake> {
        return this.http.post<IVehicleMake>(
            `${BASE_URL}/vehicle-make`,
            vehicleMake
        );
    }

    getOneVehicleMake(id: string): Observable<IVehicleMake> {
        return this.http.get<IVehicleMake>(
            `${BASE_URL}/vehicle-make/${id}`
        );
    }

    getVehicleMake(): Observable<IVehicleMake[]> {
        return this.http.get<IVehicleMake[]>(`${BASE_URL}/vehicle-make`);
    }

    updateVehicleMake(
        vehicleMake: IVehicleMake,
        id: string
    ): Observable<IVehicleMake> {
        return this.http.put<IVehicleMake>(
            `${BASE_URL}vehicle-make/${id}`,
            vehicleMake
        );
    }
}
