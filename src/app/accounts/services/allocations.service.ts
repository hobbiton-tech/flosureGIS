import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AllocationPolicy, AllocationReceipt } from '../components/models/allocations.model';

@Injectable({
  providedIn: 'root'
})
export class AllocationsService {

  BASEURLAllocationsReceipt = 'https://pay-api.goldenlotusinsurance.com/allocation-receipt';
  BASEURLAllocationsPolicy = 'https://pay-api.goldenlotusinsurance.com/allocation-policy';

  constructor(private http: HttpClient,
              private message: NzMessageService,
              private router: Router) { }


  createAllocationReceipt(
    allocationReceipt: AllocationReceipt
  ): Observable<AllocationReceipt> {
    return this.http.post<AllocationReceipt>(`${this.BASEURLAllocationsReceipt}`, allocationReceipt);
  }

  updateAllocationReceipt(allocationReceipt: AllocationReceipt) {

    return this.http.put(`${this.BASEURLAllocationsReceipt}/${allocationReceipt.ID}`, allocationReceipt);

  }

  getAllocationReceipt(): Observable<any> {
    return this.http.get<any>(`${this.BASEURLAllocationsReceipt}`);
  }


  createAllocationPolicy(
    allocationPolicy: AllocationPolicy
  ): Observable<AllocationPolicy> {
    return this.http.post<AllocationPolicy>(`${this.BASEURLAllocationsPolicy}`, allocationPolicy);
  }

  updateAllocationPolicy(allocationPolicy: AllocationPolicy) {

    return this.http.put(`${this.BASEURLAllocationsPolicy}/${allocationPolicy.ID}`, allocationPolicy);

  }

  getAllocationPolicy(): Observable<any> {
    return this.http.get<any>(`${this.BASEURLAllocationsPolicy}`);
  }
}
