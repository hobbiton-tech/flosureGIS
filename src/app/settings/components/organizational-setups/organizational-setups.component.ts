import { Component, OnInit, ChangeDetectorRef, Output } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import "firebase/firestore";
import { IOBranch } from "../../models/organizational/branch.model";
import { ISalesPoints } from "../../models/organizational/salesPoints.model";
import { NzMessageService } from "ng-zorro-antd";

import { v4 } from "uuid";
import { EventEmitter } from "@angular/core";
import { OrgBranchService } from "../organizational-setups/Services/org-branch.service";
import { SalesPointsService } from "../organizational-setups/Services/sales-points.service";

@Component({
    selector: "app-organizational-setups",
    templateUrl: "./organizational-setups.component.html",
    styleUrls: ["./organizational-setups.component.scss"],
})
export class OrganizationalSetupsComponent implements OnInit {
    salesPoints: ISalesPoints[] = [];
    orgBranches: IOBranch[] = [];

    salesPointsList: ISalesPoints[] = [];
    orgBranchesList: IOBranch[] = [];

    isSalesPointVisible = false;
    isOrgBranchVisible = false;
    isPopUpVisible = false;

    isSalesPointEidtVisible: boolean = false;
    isOrgBranchEditVisible: boolean = false;

    editSalesPoint: any;
    editOrgBranch: any;

    salesPoint: any;
    orgbranch: any;

    salesPointForm: FormGroup;
    orgbranchForm: FormGroup;

    orgName: any;
    orgDescription: any;

    sp_name: any;
    code: any;
    description: any;

    selectedOrgBranch: string;
    selectedOrgBranchId: string;

    @Output() onSalesPointSelected: EventEmitter<any> = new EventEmitter();
    @Output() onOrgBranchSelected: EventEmitter<any> = new EventEmitter();
    selectedOrgBranchValue: any[] = [];
    selectedSalesValue: any[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private orgbranchService: OrgBranchService,
        private salesPointsServeice: SalesPointsService,
        private msg: NzMessageService,
        private changeDetectorRefs: ChangeDetectorRef
    ) {
        this.orgbranchForm = formBuilder.group({
            orgName: ["", Validators.required],
            orgDescription: ["", Validators.required],
        });

        this.salesPointForm = formBuilder.group({
            branchId: ["", Validators.required],
            sp_name: ["", Validators.required],
            code: ["", Validators.required],
            description: ["", Validators.required],
        });
    }

    ngOnInit(): void {
        ///Organizationn Branches SERVICE //////
        this.orgbranchService.getBranch().subscribe((res) => {
            this.orgBranches = res;
            this.orgBranchesList = this.orgBranches;
        });

        /// SalesPoints SERVICE //////
        this.salesPointsServeice.getSalesPoint().subscribe((res) => {
            this.salesPoints = res;
            this.salesPointsList = this.salesPoints;
        });
    }

    /////////////////////////////
    ///EDIT  Orgn SERVICE //////
    //////////////////////////////
    onEditBranch(value) {
        console.log("value", value);
        this.editOrgBranch = value;

        this.orgbranchForm.get("orgName").setValue(this.editOrgBranch.orgName);

        this.orgbranchForm
            .get("orgDescription")
            .setValue(this.editOrgBranch.orgDescription);
        this.isOrgBranchEditVisible = true;
    }

    handleEditBranchOk() {
        this.editOrgBranch.orgName = this.orgbranchForm.controls.orgName.value;
        this.editOrgBranch.orgDescription = this.orgbranchForm.controls.orgDescription.value;
        this.selectedOrgBranchValue.indexOf(this.editOrgBranch);
        // const index = this.selectedOrgBranchValue
        // this.selectedOrgBranchValue[index] = this.editOrgBranch

        const index = this.selectedOrgBranchValue.indexOf(this.editOrgBranch);
        this.selectedOrgBranchValue[index] = this.editOrgBranch;

        const orgbranch: IOBranch = {
            ...this.orgbranchForm.value,
            id: this.editOrgBranch.id,
        };
        this.orgbranchService.updateBranch(orgbranch);

        this.isOrgBranchEditVisible = false;
    }

    handleEditOrgBranchCancel() {
        this.isOrgBranchEditVisible = false;
    }

    /////////////////////////////
    ///EDIT  Sales SERVICE //////
    //////////////////////////////
    onEditSalesPoint(sales) {
        console.log("sales value>>>>", sales);
        this.editSalesPoint = sales;

        this.salesPointForm.get("sp_name").setValue(this.editSalesPoint.sp_name);
        this.salesPointForm.get("code").setValue(this.editSalesPoint.code);
        this.salesPointForm
            .get("description")
            .setValue(this.editSalesPoint.description);
        this.isSalesPointEidtVisible = true;
    }

    handleEditSalesPointsOk() {
        this.editSalesPoint.sp_name = this.salesPointForm.controls.sp_name.value;
        this.editSalesPoint.code = this.salesPointForm.controls.code.value;
        this.editSalesPoint.description = this.salesPointForm.controls.description.value;
        this.selectedSalesValue.indexOf(this.editSalesPoint);

        const index = this.selectedSalesValue.indexOf(this.editSalesPoint);
        this.selectedSalesValue[index] = this.editSalesPoint;

        const salesPoint: ISalesPoints = {
            ...this.salesPointForm.value,
            id: this.editSalesPoint.id,
        };
        this.salesPointsServeice.updateSalesPoint(salesPoint);

        this.isSalesPointEidtVisible = false;
    }

    handleEditSalesPointCancel() {
        this.isSalesPointEidtVisible = false;
    }

    selectOrgBranch() {
        this.onOrgBranchSelected.emit(this.selectedOrgBranchValue);
    }
    changeOrgBranchName(value: any): void {
        this.orgbranchService.getBranch().subscribe((res) => {
            console.log("rrroooo>>>>>", value);
        });
    }

    changeSalesPointName(value: any): void {
        this.salesPointsServeice.getSalesPoint().subscribe((res) => {
            console.log("SSSoooo>>>>>", value);
        });
    }

    handleOrgBranchCancel() {
        this.isOrgBranchVisible = false;
    }
    selectBranch() {
        this.onOrgBranchSelected.emit(this.selectedOrgBranchValue);
    }

    handleSalesPointCancel() {
        this.isSalesPointVisible = false;
    }

    selectSalesPoint() {
        this.onSalesPointSelected.emit(this.selectedSalesValue);
    }

    onChange(value) {
        console.log("xxxxxxxxxxx>>>>>>>>", value);
        this.orgbranchService.getBranch().subscribe((res) => {
            console.log("PUUU>>>>", res);

            this.orgBranchesList = res;
        });

        console.log("Vvvvvvv>>>>>>>>", value);
        this.salesPointsServeice.getSalesPoint().subscribe((res) => {
            console.log("BEEEEE>>>>", res);

            this.salesPointsList = res;
        });
    }

    onSelectBranch(orgbranch) {
        this.selectedOrgBranchId = orgbranch.branchId;
        this.orgName = orgbranch.orgName;
        this.orgDescription = orgbranch.orgDescription;

        // rId.replace(/\s/g, "");
        this.selectedOrgBranch = orgbranch;
        this.salesPointsList = this.salesPoints.filter(
            (x) => x.branchId === orgbranch.id
        );
        console.log(
            "FIlt>>>>",
            orgbranch.id,
            this.salesPoints,
            this.salesPointsList
        );
    }

    onSelectSalesPoint(value) {
        console.log("PEEEEEEEE>>>>", value);
        this.salesPointsServeice = value.sp_name;
        this.salesPointsServeice = value.code;
        this.description = value.description;

        this.salesPointsServeice.getSalesPoint().subscribe((res) => {
            console.log("sla>>>>", res);

            this.salesPointsList = res;
        });
    }

    change(event): void {
        console.log(event);
    }

    openBranches(): void {
        this.isOrgBranchVisible = true;
    }
    openSalesPoints(): void {
        this.isSalesPointVisible = true;
    }

    closeBranch(): void {
        this.isOrgBranchVisible = false;
    }

    closeSalesPoint(): void {
        this.isSalesPointVisible = false;
    }

    submitOrgBranchForm() {
        const branch: IOBranch = {
            ...this.orgbranchForm.value,
            id: v4(),
        };
        this.orgbranchService.addBranch(branch);
        console.log("DDDDDDDDDD>>>>>>>", branch);
        this.isOrgBranchVisible = false;
    }
    submitSalesPointForm() {
        const salesPoint: ISalesPoints = {
            id: v4(),
            sp_name: this.salesPointForm.controls.sp_name.value,
            description: this.salesPointForm.controls.description.value,
            code: this.salesPointForm.controls.code.value,
            branchId: this.salesPointForm.controls.branchId.value.replace(/\s/g, ""),
        };

        this.salesPointsServeice.addSalesPoint(salesPoint);
        console.log("SalesPoint>>>>>>>", salesPoint);
        this.isSalesPointVisible = false;
    }
    //

    resetBranchesForm(value) { }

    resetSalesPointForm(value) { }
}
