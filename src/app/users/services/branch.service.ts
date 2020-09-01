import { BranchModel } from './../models/branch.model';
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
  BASEURLBranch = '';

  constructor(private http: HttpClient,
    private message: NzMessageService,
    private router: Router) { }

    createBranch(cBranch: BranchModel): Observable<BranchModel> {
      return this.http.post<BranchModel>(`${this.BASEURLBranch}/user-branch`, cBranch);
    }

    updateBranch(uBranch: any) {
      return this.http.put<any>(`${this.BASEURLBranch}/user-branch/${uBranch.ID}`, uBranch);
    }

    getBranch(): Observable<any> {
      return this.http.get<any>(`${this.BASEURLBranch}/user-branch`);

    }
}
