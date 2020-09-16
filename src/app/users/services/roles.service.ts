import { PermissionsModel, RolesModel } from './../models/roles.model';
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
    BASEURLRolePermission = 'https://user-management.savenda-flosure.com';

    constructor(
        private http: HttpClient,
        private message: NzMessageService,
        private router: Router
    ) {}

    createRole(cRole: RolesModel): Observable<RolesModel> {
        return this.http.post<RolesModel>(
            `${this.BASEURLRolePermission}/role`,
            cRole
        );
    }

    updateRole(uRole: RolesModel) {
        return this.http.put<RolesModel>(
            `${this.BASEURLRolePermission}/role/${uRole.ID}`,
            uRole
        );
    }

    getRole(): Observable<RolesModel[]> {
        return this.http.get<RolesModel[]>(
            `${this.BASEURLRolePermission}/role`
        );
    }

    createPermission(
        cPermission: PermissionsModel
    ): Observable<PermissionsModel> {
        return this.http.post<PermissionsModel>(
            `${this.BASEURLRolePermission}/permission`,
            cPermission
        );
    }

    updatePermission(uPermission: PermissionsModel) {
        return this.http.put<PermissionsModel>(
            `${this.BASEURLRolePermission}/permission/${uPermission.ID}`,
            uPermission
        );
    }

    getPermission(): Observable<PermissionsModel[]> {
        return this.http.get<PermissionsModel[]>(
            `${this.BASEURLRolePermission}/permission`
        );
    }
}
