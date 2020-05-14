import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
    selector: 'app-add-cover-type',
    templateUrl: './add-cover-type.component.html',
    styleUrls: ['./add-cover-type.component.scss']
})
export class AddCoverTypeComponent implements OnInit {
    @Input()
    isAddCoverTypeFormDrawerVisible: boolean;

    @Output()
    closeAddCoverTypeFormDrawerVisible: EventEmitter<any> = new EventEmitter();

    constructor() {}

    ngOnInit(): void {}

    closeAddCoverTypeFormDrawer(): void {
        this.closeAddCoverTypeFormDrawerVisible.emit();
    }
}
