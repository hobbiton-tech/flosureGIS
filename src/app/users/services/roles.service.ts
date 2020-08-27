import { RolesModel } from './../models/roles.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  roleModel: RolesModel;
  rolesModel: RolesModel[] = [];
  BASEURLRolePayment = '';


  constructor(private http: HttpClient,
    private message: NzMessageService,
    private router: Router) {}

    createRole(cRole: RolesModel): Observable<RolesModel> {
      return this.http.post<RolesModel>(`${this.BASEURLRolePayment}/user-permissions`, cRole);
    }

    updateRole(uRole: any) {
      return this.http.put<any>(`${this.BASEURLRolePayment}/user-permissions/${uRole.ID}`, uRole);
    }

    getRole(): Observable<any> {
      return this.http.get<any>(`${this.BASEURLRolePayment}/user-permissions`);

    }
}
