import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClausesService } from 'src/app/settings/components/underwriting-setups/services/clauses.service';
import { IExccess } from 'src/app/settings/models/underwriting/clause.model';
import { Excess, InsuranceType } from '../../models/quote.model';
import { ISelectedInsuranceType } from '../../models/premium-computations.model';

@Component({
    selector: 'app-excesses',
    templateUrl: './excesses.component.html',
    styleUrls: ['./excesses.component.scss']
})
export class ExcessesComponent implements OnInit {
    constructor(private productClauseService: ClausesService) {}

    //Excess Variable
    excessList: IExccess[] = [];

    //excesses
    excesses: Excess[] = [];

    excessTHP: IExccess[] = [];
    excessAct: IExccess[] = [];
    excessFT: IExccess[] = [];

    ngOnInit(): void {
        this.productClauseService.getExccesses().subscribe(res => {
            this.excessList = res.filter(
                x => x.productId === '5bf2a73c-709a-4f38-9846-c260e8fffefc'
            );

            this.excessTHP = res.filter(
                x =>
                    x.productId === 'c40dcacc-b3fa-43fb-bb13-ac1e24bd657d' &&
                    x.vehicleType === 'private'
            );

            this.excessAct = res.filter(
                x => x.productId === 'c40dcacc-b3fa-43fb-bb13-ac1e24bd657d'
            );

            this.excessFT = res.filter(
                x => x.productId === 'c40dcacc-b3fa-43fb-bb13-ac1e24bd657d'
            );
        });
    }

    getExcesses(selectedValue: string) {
        console.log(selectedValue);
        if (selectedValue === 'Comprehensive') {
            for (const ex of this.excessList) {
                this.excesses.push({
                    excessType: ex.description,
                    amount: Number(ex.amount)
                });
            }
            return this.excesses;
        } else {
            for (const exTHP of this.excessTHP) {
                this.excesses.push({
                    excessType: exTHP.description,
                    amount: Number(exTHP.amount)
                });
            }
            return this.excesses;
        }
    }
}
