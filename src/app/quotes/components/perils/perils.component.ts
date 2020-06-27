import { Component, OnInit } from '@angular/core';
import { AddPerilService } from 'src/app/settings/components/product-setups/components/add-peril/services/add-peril.service';

@Component({
    selector: 'app-perils',
    templateUrl: './perils.component.html',
    styleUrls: ['./perils.component.scss'],
})
export class PerilsComponent implements OnInit {
    selectedPerilValue: any[] = [];
    perilList: any[] = [];

    constructor(private perilsService: AddPerilService) {}

    ngOnInit(): void {
        this.perilsService.getPerils().subscribe((res) => {
            this.perilList = res;
        });
    }

    onEditPeril(value) {}
}
