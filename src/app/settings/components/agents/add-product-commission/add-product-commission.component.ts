import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ISalesRepresentative, IAgent, IBroker } from '../models/agents.model';
import { AgentsService } from '../services/agents.service';
import {
    IClass,
    IProduct
} from '../../product-setups/models/product-setups-models.model';
import { ProductSetupsServiceService } from '../../product-setups/services/product-setups-service.service';

@Component({
    selector: 'app-add-product-commission',
    templateUrl: './add-product-commission.component.html',
    styleUrls: ['./add-product-commission.component.scss']
})
export class AddProductCommissionComponent implements OnInit {
    @Input()
    isAddProductCommissionFormDrawerVisible: boolean;

    @Output()
    closeAddProductCommissionDrawerVisible: EventEmitter<
        any
    > = new EventEmitter();

    @Input()
    selectedIntermediary: Array<IAgent & IBroker & ISalesRepresentative>;

    productCommissionForm: FormGroup;

    intermediariesList: Array<IAgent & IBroker & ISalesRepresentative>;
    displayIntermediariesList: Array<IAgent & IBroker & ISalesRepresentative>;

    classesList: IClass[] = [];
    productsList: IProduct[] = [];

    //Selected class
    selectedClass: IClass;

    //single class
    singleClass: IClass;

    constructor(
        private formBuilder: FormBuilder,
        private productSetupsService: ProductSetupsServiceService,
        private agentService: AgentsService
    ) {}

    ngOnInit(): void {
        this.agentService.getAllIntermediaries().subscribe(intermediaries => {
            this.intermediariesList = [
                ...intermediaries[0],
                ...intermediaries[1],
                ...intermediaries[2]
            ] as Array<IAgent & IBroker & ISalesRepresentative>;
        });

        this.productSetupsService.getClasses().subscribe(classes => {
            this.classesList = classes;
        });
    }

    //changes products based on selected class
    changeClassProducts(selectedClass: IClass): void {
        this.productSetupsService.getClasses().subscribe(classes => {
            this.singleClass = classes.filter(
                x => x.id === selectedClass.id
            )[0];

            this.productsList = this.singleClass.Product;
        });
    }

    closeDrawer(): void {
        console.log(this.selectedIntermediary);
        this.closeAddProductCommissionDrawerVisible.emit();
    }

    async addProductCommission() {}

    submitProductCommission() {}
}
