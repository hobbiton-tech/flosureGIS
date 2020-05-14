import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
    selector: 'app-add-peril',
    templateUrl: './add-peril.component.html',
    styleUrls: ['./add-peril.component.scss']
})
export class AddPerilComponent implements OnInit {
    @Input()
    isAddPerilFormDrawerVisible: boolean;

    @Output()
    closeAddPerilFormDrawerVisible: EventEmitter<any> = new EventEmitter();

    constructor() {}

    ngOnInit(): void {}

    closeAddPerilFormDrawer(): void {
        this.closeAddPerilFormDrawerVisible.emit();
    }
}
