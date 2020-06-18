import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from '../models/users.model';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    constructor(private http: HttpClient) {}

    addUser(dto: User): Observable<User> {
        return this.http.post<User>(
            'http://104.248.247.78:3000/users',

            dto
        );
    }

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>('http://104.248.247.78:3000/users');
    }

    getSingleUser(userId: string): Observable<User> {
        return this.http.get<User>(`http://104.248.247.78:3000/${userId}`);
    }
}
