import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
    IAgent,
    IBroker,
    ISalesRepresentative,
} from '../agents/models/agents.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ICommissionSetup } from '../agents/models/commission-setup.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductSetupsServiceService } from '../product-setups/services/product-setups-service.service';
import { CommisionSetupsService } from '../agents/services/commision-setups.service';
import { AgentsService } from '../agents/services/agents.service';
import { NzMessageService } from 'ng-zorro-antd';
import {
    IVehicleType,
    IVehicleMake,
    IVehicleModel,
} from './models/vehicle.model';
import { VehicleService } from './services/vehicle.service';
import { VehicleMakeService } from './services/vehicle-make.service';
import { VehicleModelService } from './services/vehicle-model.service';

@Component({
    selector: 'app-vehicle',
    templateUrl: './vehicle.component.html',
    styleUrls: ['./vehicle.component.scss'],
})
export class VehicleComponent implements OnInit {
    addVehicleTypesFormDrawerVisible = false;
    addVehicleMakesFormDrawerVisible = false;
    addVehicleModelsFormDrawerVisible = false;

    vehicleType: IVehicleType[] = [];
    displayedVehicleType: IVehicleType[] = [];

    vehicleMake: IVehicleMake[] = [];
    displayedVehicleMake: IVehicleMake[] = [];

    vehicleModel: IVehicleModel[] = [];
    displayedVehicleModel: IVehicleModel[] = [];

    vehicleModelUpdate = new BehaviorSubject<boolean>(false);
    vehicleMakeUpdate = new BehaviorSubject<boolean>(false);
    vehicleTypeUpdate = new BehaviorSubject<boolean>(false);

    isOkLoading = false;

    selectedVehicleMake: IVehicleMake;
    selectedVehicleModel: IVehicleModel;

    vehicleMakeId: string;

    constructor(
        private readonly router: Router,
        private formBuilder: FormBuilder,
        private cdr: ChangeDetectorRef,
        private productSetupsService: ProductSetupsServiceService,
        private commissionSetupsService: CommisionSetupsService,
        private agentService: AgentsService,
        private msg: NzMessageService,
        private route: ActivatedRoute,
        private vehicleService: VehicleService,
        private vehicleMakeService: VehicleMakeService,
        private vehicleModelService: VehicleModelService
    ) {}

    ngOnInit(): void {
        this.isOkLoading = true;
        setTimeout(() => {
            this.isOkLoading = false;
        }, 3000);

             this.route.params.subscribe(param => {
            this.vehicleMakeId = param.vehicleMakeId;
        });


        this.vehicleService.getVehicleType().subscribe((type) => {
            this.vehicleType = type;
            this.displayedVehicleType = this.vehicleType;
            console.log('vehicleType',  this.displayedVehicleType )
        });

        this.vehicleMakeService.getVehicleMake().subscribe((make) => {
            this.vehicleMake = make;
            this.displayedVehicleMake = this.vehicleMake;
        });

        // this.vehicleModelService.getVehicleModel().subscribe((model) => {
        //     this.vehicleModel = model;
        //     this.displayedVehicleModel = this.vehicleModel;
        // });

        this.vehicleTypeUpdate.subscribe((update) =>
            update === true
                ? this.vehicleService.getVehicleType().subscribe((type) => {
                      this.vehicleType = type;
                      this.displayedVehicleType = this.vehicleType;
                  })
                : ''
        );

        this.vehicleMakeUpdate.subscribe((update) =>
            update === true
                ? this.vehicleMakeService.getVehicleMake().subscribe((make) => {
                      this.vehicleMake = make;
                      this.displayedVehicleMake = this.vehicleMake;
                  })
                : ''
        );

        this.vehicleModelUpdate.subscribe((update) =>
            update === true
                ? this.vehicleModelService
                      .getVehicleModel()
                      .subscribe((model) => {
                          this.vehicleModel = model;
                          this.displayedVehicleModel = this.vehicleModel;
                      })
                : ''
        );
    }

    vehicleMakeChange(value: string): void {
        this.selectedVehicleModel = this.displayedVehicleModel[value][0];
    }

    openAddVehicleTypeFormDrawer() {
        this.addVehicleTypesFormDrawerVisible = true;
    }

    openAddVehicleMakeFormDrawer() {
        this.addVehicleMakesFormDrawerVisible = true;
    }

    openAddVehicleModelFormDrawer() {
        this.addVehicleModelsFormDrawerVisible = true;
    }

    recieveUpdate($event) {
        this.vehicleMakeUpdate.next($event);
        this.vehicleTypeUpdate.next($event);
        this.vehicleModelUpdate.next($event);
    }

    // changeSelectedVehicleMake(make: IVehicleMake) {
    //     this.selectedVehicleMake = make;
    //     this.filterModelList(this.selectedVehicleMake.vehicleMake);
    // }

    // filterModelList(vehicleMake: string) {
    //     this.vehicleModelService.getVehicleModel(vehicleMake.id).subscribe((make) => {
    //         this.displayedVehicleModel == make.filter(
    //             (x) => x.vehicleMakeName == this.selectedVehicleMake.vehicleMake
    //         );
    //     });
    // }
}
