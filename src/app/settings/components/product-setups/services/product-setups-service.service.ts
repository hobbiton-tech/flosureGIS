import { Injectable } from '@angular/core';
import { IProduct } from '../models/product-setups-models.model';
import { IClass } from '../models/product-setups-models.model';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProductSetupsServiceService {
    constructor(private http: HttpClient) {}

    addClass(dto: IClass): Observable<IClass> {
        return this.http.post<IClass>(
            'https://flosure-postgres-api.herokuapp.com/class',
            dto
        );
    }

    getClasses(): Observable<IClass[]> {
        return this.http.get<IClass[]>(
            'https://flosure-postgres-api.herokuapp.com/class'
        );
    }

    addProduct(dto: IProduct, id: string): Observable<IProduct> {
        return this.http.post<IProduct>(
            `https://flosure-postgres-api.herokuapp.com/product/${id}`,
            dto
        );
    }

    getProducts(id: string): Observable<IProduct[]> {
        return this.http.get<IProduct[]>(
            `https://flosure-postgres-api.herokuapp.com/product/class-products/${id}`
        );
    }
}
