import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { InsuranceClassHandlerService } from '../underwriting/services/insurance-class-handler.service';
import { IClass } from '../settings/components/product-setups/models/product-setups-models.model';
import { ProductSetupsServiceService } from '../settings/components/product-setups/services/product-setups-service.service';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnDestroy {
    isCollapsed = false;
    loggedIn = localStorage.getItem('user');

    classesList: IClass[] = [];

    //current class
    singleClass: IClass;

    constructor(
        private router: Router,
        private classHandler: InsuranceClassHandlerService,
        private productSetupsService: ProductSetupsServiceService
    ) {}

    ngOnInit(): void {}

    logout(): void {
        this.router.navigateByUrl('/');
    }

    handleClass(insuranceClass: string) {
        this.productSetupsService.getClasses().subscribe(classes => {
            this.classesList = classes;

            this.singleClass = this.classesList.filter(
                x => x.className == insuranceClass
            )[0];

            this.classHandler.changeSelectedClass(this.singleClass);
        });
    }

    ngOnDestroy() {}
}
