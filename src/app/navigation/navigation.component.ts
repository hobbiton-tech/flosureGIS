import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { InsuranceClassHandlerService } from '../underwriting/services/insurance-class-handler.service';
import { IClass } from '../settings/components/product-setups/models/product-setups-models.model';
import { ProductSetupsServiceService } from '../settings/components/product-setups/services/product-setups-service.service';
import * as jwt_decode from 'jwt-decode';
import { AuthenticationService } from '../users/services/authentication.service';
import { UsersService } from '../users/services/users.service';
import { UserModel } from '../users/models/users.model';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnDestroy {
    isCollapsed = false;
    loggedIn = localStorage.getItem('currentUser');
    user: UserModel;

    classesList: IClass[] = [];

    //current class
    singleClass: IClass;

    constructor(
        private router: Router,
        private classHandler: InsuranceClassHandlerService,
        private productSetupsService: ProductSetupsServiceService,
        public authenticationService: AuthenticationService,
        private usersService: UsersService
    ) {}

    ngOnInit(): void {
        const decodedJwtData = jwt_decode(this.loggedIn);
        console.log('Decoded>>>>>>', decodedJwtData);

        this.usersService.getUsers().subscribe(users => {
            this.user = users.filter(x => x.ID === decodedJwtData.user_id)[0];
        });
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
