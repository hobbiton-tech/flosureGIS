import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from '../models/users.model';

@Injectable({
    providedIn: 'root',
})
export class UsersService {
    constructor(private http: HttpClient) {}

    addUser(dto: User): Observable<User> {
        return this.http.post<User>(
            'https://flosure-postgres-api.herokuapp.com/users',

            dto
        );
    }

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(
            'https://flosure-postgres-api.herokuapp.com/users'
        );
    }

    getSingleUser(userId: string): Observable<User> {
        return this.http.get<User>(
            `https://flosure-postgres-api.herokuapp.com/${userId}`
        );
    }
}
