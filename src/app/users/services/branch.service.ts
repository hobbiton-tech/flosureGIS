import { BranchModel, SalesPoint } from '../models/branch.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BranchService {
    branchModel: BranchModel;
    branchesModel: BranchModel[] = [];
    BASEURLBranch = 'https://user-management.savenda-flosure.com';

    constructor(
        private http: HttpClient,
        private message: NzMessageService,
        private router: Router
    ) {}

    createBranch(cBranch: BranchModel): Observable<BranchModel> {
        return this.http.post<BranchModel>(
            `${this.BASEURLBranch}/branch`,
            cBranch
        );
    }

    updateBranch(uBranch: BranchModel) {
        return this.http.put<BranchModel>(
            `${this.BASEURLBranch}/branch/${uBranch.ID}`,
            uBranch
        );
    }

    getBranch(): Observable<BranchModel[]> {
        return this.http.get<BranchModel[]>(`${this.BASEURLBranch}/branch`);
    }

    createSOP(cSOP: SalesPoint): Observable<SalesPoint> {
        return this.http.post<SalesPoint>(
            `${this.BASEURLBranch}/sales-point`,
            cSOP
        );
    }

    updateSOP(uSOP: SalesPoint) {
        return this.http.put<SalesPoint>(
            `${this.BASEURLBranch}/sales-point/${uSOP.ID}`,
            uSOP
        );
    }

    getSOP(): Observable<SalesPoint> {
        return this.http.get<SalesPoint>(`${this.BASEURLBranch}/sales-point`);
    }
}
