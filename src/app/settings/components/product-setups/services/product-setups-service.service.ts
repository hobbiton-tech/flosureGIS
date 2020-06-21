import { Injectable } from '@angular/core';
import { IProduct } from '../models/product-setups-models.model';
import { IClass } from '../models/product-setups-models.model';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

const BASE_URL = 'http://localhost:3000';

@Injectable({
    providedIn: 'root'
})
export class ProductSetupsServiceService {
    constructor(private http: HttpClient) {}

    // addClass(dto: IClass): Observable<IClass> {
    //     return this.http.post<IClass>(`${BASE_URL}/classes`, dto);
    // }

    // getClasses(): Observable<IClass[]> {
    //     return this.http.get<IClass[]>(`${BASE_URL}/classes`);
    // }

    // addProduct(dto: IProduct, id: string): Observable<IProduct> {
    //     return this.http.post<IProduct>(`${BASE_URL}/classes/products`, {
    //         classId: id,
    //         ...dto
    //     });
    // }

    // getProducts(): Observable<IProduct[]> {
    //     return this.http.get<IProduct[]>(`${BASE_URL}/classes/products`);
    // }

    addClass(dto: IClass): Observable<IClass> {
        return this.http.post<IClass>(
            'https://www.flosure-api.com/class',

            dto
        );
    }

    getClasses(): Observable<IClass[]> {
        return this.http.get<IClass[]>('https://www.flosure-api.com/class');
    }

    addProduct(dto: IProduct, id: string): Observable<IProduct> {
        return this.http.post<IProduct>(
            `https://www.flosure-api.com/product/${id}`,
            dto
        );
    }

    getProducts(id: string): Observable<IProduct[]> {
        return this.http.get<IProduct[]>(
            `https://www.flosure-api.com/product/class-products/${id}`
        );
    }

    getProductsNo(): Observable<IProduct[]> {
        return this.http.get<IProduct[]>(
            `https://www.flosure-api.com/product/class-products`
        );
    }
}
