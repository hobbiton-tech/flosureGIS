import { DepartmentModel } from './../../../models/department/department.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DepartmentService {
    departmentModel: DepartmentModel;
    departmentsModel: DepartmentModel[] = [];
    BASEURLDepartment = 'https://test-user.flosure-api.com';

    constructor(
        private http: HttpClient,
        private message: NzMessageService,
        private router: Router
    ) {}

    createDepartment(
        cDepartment: DepartmentModel
    ): Observable<DepartmentModel> {
        return this.http.post<DepartmentModel>(
            `${this.BASEURLDepartment}/department`,
            cDepartment
        );
    }

    updateDepartment(uDepartment: DepartmentModel) {
        return this.http.put<DepartmentModel>(
            `${this.BASEURLDepartment}/department/${uDepartment.ID}`,
            uDepartment
        );
    }

    getDepartment(): Observable<DepartmentModel[]> {
        return this.http.get<DepartmentModel[]>(
            `${this.BASEURLDepartment}/department`
        );
    }
}
