// import {
//     Resolve,
//     ActivatedRouteSnapshot,
//     RouterStateSnapshot,
// } from '@angular/router';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { Policy } from '../models/policy.model';
// import { PoliciesService } from '../services/policies.service';
// import { first, filter, map } from 'rxjs/operators';
//
// @Injectable()
// export class PolicyDetailsResolver implements Resolve<Policy> {
//     constructor(private service: PoliciesService) {}
//     resolve(
//         route: ActivatedRouteSnapshot,
//         state: RouterStateSnapshot
//     ): Policy | Observable<Policy> | Promise<Policy> {
//         const policyId = route.params['id'];
//         console.log('PARAMS', policyId);
//         return this.service.getPolicyById(policyId).pipe(first());
//     }
// }
