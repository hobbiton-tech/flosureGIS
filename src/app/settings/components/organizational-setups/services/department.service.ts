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
  BASEURLDepartment = '';

  constructor(private http: HttpClient,
    private message: NzMessageService,
    private router: Router) { }

    createDepartment(cDepartment: DepartmentModel): Observable<DepartmentModel> {
      return this.http.post<DepartmentModel>(`${this.BASEURLDepartment}/user-department`, cDepartment);
    }

    updateDepartment(uDepartment: any) {
      return this.http.put<any>(`${this.BASEURLDepartment}/user-department/${uDepartment.ID}`, uDepartment);
    }

    getDepartment(): Observable<any> {
      return this.http.get<any>(`${this.BASEURLDepartment}/user-department`);

    }


}
