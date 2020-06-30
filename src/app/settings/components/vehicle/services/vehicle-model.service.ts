import { Injectable } from '@angular/core';
import { IVehicleModel } from '../models/vehicle.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// const BASE_URL = 'https://flosure-api.com';
const BASE_URL = 'http://localhost:3000'

@Injectable({
    providedIn: 'root',
})
export class VehicleModelService {
    vehicleModel: IVehicleModel[];

    constructor(private http: HttpClient) {}

    addVehicleModel(vehicleModel: IVehicleModel, id: string): Observable<IVehicleModel> {
      console.log()
        return this.http.post<IVehicleModel>(
            `${BASE_URL}/vehicle-model/${id}`,
            vehicleModel
        );
    }

    getOneVehicleModel(id: string): Observable<IVehicleModel> {
        return this.http.get<IVehicleModel>(
            `${BASE_URL}/vehicle-model/${id}`
        );
    }

    getVehicleModel(): Observable<IVehicleModel[]> {
        return this.http.get<IVehicleModel[]>(`${BASE_URL}/vehicle-model`);
    }

    updateVehicleModel(
        vehicleModel: IVehicleModel,
        id: string
    ): Observable<IVehicleModel> {
        return this.http.put<IVehicleModel>(
            `${BASE_URL}vehicle-model/${id}`,
            vehicleModel
        );
    }
}
