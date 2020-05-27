import { Component, OnInit } from '@angular/core';
import { IClass, IProduct } from './models/product-setups-models.model';
import { ProductSetupsServiceService } from './services/product-setups-service.service';
import { ActivatedRoute } from '@angular/router';
import { ProductTrackerService } from './services/producti-tracker.service';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-product-setups',
    templateUrl: './product-setups.component.html',
    styleUrls: ['./product-setups.component.scss']
})
export class ProductSetupsComponent implements OnInit {
    classesList: IClass[] = [];
    productsList: IProduct[] = [];

    classUpdate = new BehaviorSubject<boolean>(false);

    //classId
    classId: string;

    //ProductId
    productId: string;

    //Selected class
    selectedClass: IClass;

    //single class
    singleClass: IClass;

    // Drawers
    addClassFormDrawerVisible = false;
    addProductFormDrawerVisible = false;
    addCoverTypeFormDrawerVisible = false;
    addPerilFormDrawerVisible = false;

    constructor(
        private productSetupsService: ProductSetupsServiceService,
        private productTrackerService: ProductTrackerService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe(param => {
            this.classId = param.classId;
        });

        this.productSetupsService.getClasses().subscribe(classes => {
            this.classesList = classes;

            this.productsList = this.classesList[0].Product;
        });

        this.classUpdate.subscribe(update =>
            update === true
                ? this.productSetupsService.getClasses().subscribe(classes => {
                      this.classesList = classes;

                      this.productsList = this.classesList[0].Product;
                  })
                : ''
        );
    }

    openAddClassFormDrawer() {
        this.addClassFormDrawerVisible = true;
    }

    openAddProductFormDrawer() {
        this.addProductFormDrawerVisible = true;
    }

    openAddCoverTypeFormDrawer() {
        this.addCoverTypeFormDrawerVisible = true;
    }

    openAddPerilFormDrawer() {
        this.addPerilFormDrawerVisible = true;
    }

    changeSelectedClass(selectedClass: IClass) {
        this.productSetupsService.getClasses().subscribe(classes => {
            this.singleClass = classes.filter(
                x => x.id === selectedClass.id
            )[0];

            this.productsList = this.singleClass.Product;
        });
    }

    recieveUpdate($event) {
        this.classUpdate.next($event);
    }
}
