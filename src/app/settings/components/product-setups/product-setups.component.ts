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

    //products
    products: IProduct[];

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
        // this.productSetupsService.getProducts().subscribe(x => {
        //     this.products = x;
        //     console.log(this.products);
        //     console.log(x);
        // });

        // this.route.params.subscribe(param => {
        //     this.classId = param.classId;
        // });

        this.productSetupsService.getClasses().subscribe(classes => {
            this.classesList = classes;

            this.productsList = this.classesList[0].products;
        });

        this.classUpdate.subscribe(update =>
            update === true
                ? this.productSetupsService.getClasses().subscribe(classes => {
                      this.classesList = classes;

                      this.productsList = this.classesList[0].products;
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

            this.productsList = this.singleClass.products;
        });
    }

    recieveUpdate($event) {
        this.classUpdate.next($event);
    }
}
