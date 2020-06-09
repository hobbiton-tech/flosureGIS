import { Injectable } from '@angular/core';
import { IProduct } from '../models/product-setups-models.model';
import { IClass } from '../models/product-setups-models.model';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

const BASE_URL = 'http://104.248.247.78:3000';

@Injectable({
    providedIn: 'root',
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
            'http://104.248.247.78:3000/class',

            dto
        );
    }

    getClasses(): Observable<IClass[]> {
        return this.http.get<IClass[]>('http://104.248.247.78:3000/class');
    }

    addProduct(dto: IProduct, id: string): Observable<IProduct> {
        return this.http.post<IProduct>(
            `http://104.248.247.78:3000/product/${id}`,
            dto
        );
    }

    getProducts(id: string): Observable<IProduct[]> {
        return this.http.get<IProduct[]>(
            `http://104.248.247.78:3000/product/class-products/${id}`
        );
    }

    getProductsNo(): Observable<IProduct[]> {
        return this.http.get<IProduct[]>(
            `http://104.248.247.78:3000/product/class-products`
        );
    }
}
