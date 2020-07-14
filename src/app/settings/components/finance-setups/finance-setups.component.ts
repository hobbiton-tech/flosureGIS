import { Component, OnInit, Output } from '@angular/core';
import { IBank } from '../../models/finance/bank.model';
import { IBranch } from '../../models/finance/branch.model';
import { IPaymentMethod } from '../../models/finance/payment-methodes.model';
import { IReceiptTypes } from '../../models/finance/receipt-types.model';
import { IDiscountType } from '../../models/finance/discount-type.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PaymentMethodService } from 'src/app/settings/components/finance-setups/services/payment-method.service';
import { BankService } from '../../components/finance-setups/components/bank-setups/services/bank.service';
import { BranchService } from '../../components/finance-setups/services/branch.service';
import { ReceiptTypesService } from 'src/app/settings/components/finance-setups/services/receipt-types.service';
import { DiscountTypesService } from 'src/app/settings/components/finance-setups/services/discount-types.service';
import { v4 } from 'uuid';
import { from } from 'rxjs';
import { EventEmitter } from '@angular/core';
import { FeGaussianBlurElement } from 'canvg';

@Component({
    selector: 'app-finance-setups',
    templateUrl: './finance-setups.component.html',
    styleUrls: ['./finance-setups.component.scss'],
})
export class FinanceSetupsComponent implements OnInit {
    bankList: IBank[] = [];
    banks: IBank[] = [];
    branchList: IBranch[] = [];
    paymentMethodList: IPaymentMethod[] = [];
    paymentMethods: [] = [];
    receiptTypeList: IReceiptTypes[] = [];
    discountTypeList: IDiscountType[] = [];

    @Output() onBankSelected: EventEmitter<any> = new EventEmitter();
    @Output() onPaymentMethodSelected: EventEmitter<any> = new EventEmitter();
    @Output() onRecceiptTypeSelected: EventEmitter<any> = new EventEmitter();
    @Output() onBranchSelected: EventEmitter<any> = new EventEmitter();

    selectedBankValue: any[] = [];
    selectedBranchValue: any[] = [];
    selectedPaymentMethodValue: any[] = [];
    selectedReceiptTypeValue: any[] = [];

    isBankEditVisible: boolean = false;
    isBranchEditVisible: boolean = false;
    isPaymentMethodEditVisible: boolean = false;
    isReceiptTypeEditVisible: boolean = false;

    editBank: any;
    editBranch: any;
    editPaymentMethod: any;
    editReceiptType: any;

    paymentMethod: any;
    bankForm: FormGroup;
    branchForm: FormGroup;
    paymentMethodForm: FormGroup;
    receiptTypeForm: FormGroup;
    discountTypeForm: FormGroup;

    isBankVisible = false;
    isBranchVisible = false;
    isPaymentMethodVisible = false;
    isReceiptTypeVisible = false;
    isDiscountTypeVisible = false;

    branch_Code: any;

    dtype: any;
    ddescription;

    Type_name: any;
    Description: any;

    Method_name: any;
    description: any;

    bank_name: any;
    branch_name: any;
    branch_code: any;
    swift_code: any;
    receiptType: IReceiptTypes;
    selectedBankId: string;
    selectedPaymentMethodId: string;
    selectedReceiptTypeId: string;

    constructor(
        private BankService: BankService,
        private PaymentMethodService: PaymentMethodService,
        private ReceiptTypeService: ReceiptTypesService,
        private DiscountTypesService: DiscountTypesService,
        private BranchService: BranchService,
        private formBuider: FormBuilder
    ) {
        this.bankForm = formBuider.group({
            bank_name: ['', Validators.required],
            swift_code: ['', Validators.required],
            description: ['', Validators.required],
        });

        this.branchForm = formBuider.group({
            branch_name: ['', Validators.required],
            branch_code: ['', Validators.required],
            description: ['', Validators.required],
        });

        this.paymentMethodForm = formBuider.group({
            Method_name: ['', Validators.required],
            description: ['', Validators.required],
        });

        this.receiptTypeForm = formBuider.group({
            Type_name: ['', Validators.required],
            Description: ['', Validators.required],
        });

        this.discountTypeForm = formBuider.group({
            dtype: ['', Validators.required],
            ddescription: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        ///////////////////////////////
        /// BANK SERVICE //////
        //////////////////////////////
        this.BankService.getBanks().subscribe((res) => {
            this.banks = res;
            this.bankList = this.banks;
        });

        ///////////////////////////////////
        ///////// PAYMENT ////////////////////
        /////////////////////////////////////////
        this.PaymentMethodService.getPaymentMethods().subscribe((res) => {
            this.paymentMethodList = res;
            // this.paymentMethod.replace(/[^A-Za-z0-9-,.;'&/.() ]|^ /g,'')  paymentMethod=""
        });
        //////////////////////////////////
        /////////// RECEIPT ///////////////
        ////////////////////////////////
        this.ReceiptTypeService.getReceiptTypes().subscribe((res) => {
            this.receiptTypeList = res;
        });
        //////////////////////////////////
        /////////// Discount ///////////////
        ////////////////////////////////

        this.DiscountTypesService.getDiscountType().subscribe((res) => {
            this.discountTypeList = res;
        });

        //////////////////////////////////
        /////////// Discount ///////////////
        ////////////////////////////////

        this.BranchService.getBranch().subscribe((res) => {
            this.branchList = res;
        });
    }

    /////////////////////////////
    ///EDIT  BANK SERVICE //////
    //////////////////////////////
    onEditBank(value) {
        this.editBank = value;
        this.bankForm.get('bank_name').setValue(this.editBank.bank_name);
        this.bankForm.get('swift_code').setValue(this.editBank.swift_code);
        this.bankForm.get('description').setValue(this.editBank.description);
        this.isBankEditVisible = true;
    }

    handleEditBankOk() {
        this.editBank.bank_name = this.bankForm.controls.bank_name.value;
        this.editBank.swift_code = this.bankForm.controls.swift_code.value;
        this.editBank.description = this.bankForm.controls.description.value;

        const index = this.selectedBankValue.indexOf(this.editBank);
        this.selectedBankValue[index] = this.editBank;

        const bank: IBank = {
            ...this.bankForm.value,
            id: this.editBank.id,
        };
        this.BankService.updateBank(bank);

        this.isBankEditVisible = false;
    }

    handleEditBankCancel() {
        this.isBankEditVisible = false;
    }
    selectBank() {
        this.onBankSelected.emit(this.selectedBankValue);
    }

    /////////////////////////////
    ///EDIT  Payment SERVICE //////
    //////////////////////////////
    onEditPaymentMethod(value) {
        this.editPaymentMethod = value;
        this.paymentMethodForm
            .get('Method_name')
            .setValue(this.editPaymentMethod.Method_name);
        this.paymentMethodForm
            .get('description')
            .setValue(this.editPaymentMethod.description);
        this.isPaymentMethodEditVisible = true;
    }

    handleEditPaymentMethodOk() {
        this.editPaymentMethod.Method_name = this.paymentMethodForm.controls.Method_name.value;
        this.editPaymentMethod.description = this.paymentMethodForm.controls.description.value;

        const index = this.selectedPaymentMethodValue.indexOf(
            this.editPaymentMethod
        );
        this.selectedPaymentMethodValue[index] = this.editPaymentMethod;

        const paymentMethod: IPaymentMethod = {
            ...this.paymentMethodForm.value,
            id: this.editPaymentMethod.id,
        };
        this.PaymentMethodService.updatePaymentMethod(paymentMethod);

        this.isPaymentMethodEditVisible = false;
    }

    handleEditPaymentMethodCancel() {
        this.isPaymentMethodEditVisible = false;
    }
    selectPaymentMethod() {
        this.onRecceiptTypeSelected.emit(this.selectedPaymentMethodValue);
    }

    /////////////////////////////
    ///EDIT  Receipts SERVICE //////
    //////////////////////////////
    onEditReceiptTypes(value) {
        this.editReceiptType = value;
        this.receiptTypeForm
            .get('Type_name')
            .setValue(this.editReceiptType.Type_name);
        this.receiptTypeForm
            .get('Description')
            .setValue(this.editReceiptType.Description);
        this.isReceiptTypeEditVisible = true;
    }

    handleEditReceiptTypeOk() {
        this.editReceiptType.Type_name = this.receiptTypeForm.controls.Type_name.value;
        this.editReceiptType.Description = this.receiptTypeForm.controls.Description.value;

        const index = this.selectedReceiptTypeValue.indexOf(
            this.editReceiptType
        );
        this.selectedReceiptTypeValue[index] = this.editReceiptType;

        const receiptType: IReceiptTypes = {
            ...this.receiptTypeForm.value,
            id: this.editReceiptType.id,
        };
        this.ReceiptTypeService.updateReceiptType(receiptType);

        this.isReceiptTypeEditVisible = false;
    }

    handleEditReceiptTypeCancel() {
        this.isReceiptTypeEditVisible = false;
    }
    selectReceiptType() {
        this.onRecceiptTypeSelected.emit(this.selectedReceiptTypeValue);
    }
    /////////////////////////////
    ///EDIT  BRANCH SERVICE //////
    //////////////////////////////
    onEditBranch(value) {
        this.editBranch = value;
        this.branchForm
            .get('branch_name')
            .setValue(this.editBranch.branch_name);
        this.branchForm
            .get('branch_code')
            .setValue(this.editBranch.branch_code);
        this.branchForm
            .get('description')
            .setValue(this.editBranch.description);
        this.isBranchEditVisible = true;
    }

    handleEditBranchOk() {
        this.editBranch.branch_name = this.branchForm.controls.branch_name.value;
        this.editBranch.branch_code = this.branchForm.controls.branch_code.value;
        this.editBranch.description = this.branchForm.controls.description.value;

        const index = this.selectedBranchValue.indexOf(this.editBranch);
        this.selectedBranchValue[index] = this.editBranch;

        const branch: IBranch = {
            ...this.branchForm.value,
            id: this.editBranch.id,
        };
        this.BranchService.updateBranch(branch);

        this.isBranchEditVisible = false;
    }

    handleEditBranchCancel() {
        this.isBranchEditVisible = false;
    }
    selectBranch() {
        this.onBranchSelected.emit(this.selectedBranchValue);
    }

    onChange(value) {
        console.log('WWWWWWWWWWW>>>>>>>>', value);
        this.BranchService.getBranch().subscribe((res) => {
            console.log('YEEEEEEEE>>>>', res);

            this.branchList = res;
        });

        console.log('WWWWWWWWWWW>>>>>>>>', value);
        this.PaymentMethodService.getPaymentMethods().subscribe((res) => {
            console.log('YEEEEEEEE>>>>', res);

            this.paymentMethodList = res;
        });

        console.log('WWWWWWWWWWW>>>>>>>>', value);
        this.ReceiptTypeService.getReceiptTypes().subscribe((res) => {
            this.receiptTypeList = res;
        });

        console.log('WWWWWWWWWWW>>>>>>>>', value);
        this.DiscountTypesService.getDiscountType().subscribe((res) => {
            this.discountTypeList = res;
        });

        console.log('WWWWWWWWWWW>>>>>>>>', value);
        this.BranchService.getBranch().subscribe((res) => {
            this.branchList = res;
        });
    }

    onSelectBank(bank) {
        console.log('PEEEEEEEE>>>>', bank);
        this.bank_name = bank.bank_name;
        this.swift_code = bank.swift_code;
        this.description = bank.description;
    }

    onSelectPaymentMethod(paymentMethod) {
        console.log('PEEEEEEEE>>>>', paymentMethod);
        this.Method_name = paymentMethod.Method_name;
        this.description = paymentMethod.description;
    }

    onSelectReceiptType(receiptType) {
        console.log('PEEEEEEEE>>>>', receiptType);
        this.Type_name = receiptType.Type_name;
        this.Description = receiptType.Description;
    }

    onSelectDiscountType(discountType) {
        console.log('PEEEEEEEE>>>>', discountType);
        this.dtype = discountType.dtype;
        this.ddescription = discountType.ddescription;
    }

    onSelectBranch(branch) {
        console.log('PEEEEEEEE>>>>', branch);
        this.branch_name = branch.branch_name;
        this.branch_code = branch.branch_code;
        this.description = branch.description;
    }

    openBanks(): void {
        this.isBankVisible = true;
    }

    openPaymentMethods(): void {
        this.isPaymentMethodVisible = true;
    }

    openReceiptTypes(): void {
        this.isReceiptTypeVisible = true;
    }

    openDiscountTypes(): void {
        this.isDiscountTypeVisible = true;
    }

    openBranches(): void {
        this.isBranchVisible = true;
    }

    closeBanks(): void {
        this.isBankVisible = false;
    }

    closePaymentMethods(): void {
        this.isPaymentMethodVisible = false;
    }

    closeReceiptTypes(): void {
        this.isReceiptTypeVisible = false;
    }

    closeDiscountTypes(): void {
        this.isDiscountTypeVisible = false;
    }

    closeBranches(): void {
        this.isBranchVisible = false;
    }

    submitBankForm() {
        const bank: IBank = {
            ...this.bankForm.value,
            id: v4(),
        };
        this.BankService.addBank(bank);
        console.log('DDDDDDDDDD>>>>>>>', bank);
        this.isBankVisible = false;
    }

    submitPaymentMethodForm() {
        const paymentMethod: IPaymentMethod = {
            ...this.paymentMethodForm.value,
            id: v4(),
        };
        this.PaymentMethodService.addPaymentMethod(paymentMethod);
        console.log('DDDDDDDDDD>>>>>>>', paymentMethod);
        this.isPaymentMethodVisible = false;
    }

    submitReceiptTypeForm() {
        const receiptType: IReceiptTypes = {
            ...this.receiptTypeForm.value,
            id: v4(),
        };
        this.ReceiptTypeService.addReceiptType(receiptType);
        console.log('DDDDDDDDDD>>>>>>>', receiptType);
        this.isReceiptTypeVisible = false;
    }

    submitDiscountTypeForm() {
        const discountType: IDiscountType = {
            ...this.discountTypeForm.value,
            id: v4(),
        };
        this.DiscountTypesService.addDiscountType(discountType);
        console.log('DDDDDDDDDD>>>>>>>', discountType);
        this.isDiscountTypeVisible = false;
    }

    submitBranchForm() {
        const branch: IBranch = {
            ...this.branchForm.value,
            id: v4(),
            bankId: this.selectedBankId,
        };
        this.BranchService.addBranch(branch);
        console.log('DDDDDDDDDD>>>>>>>', branch);
        this.isBranchVisible = false;
    }

    resetBankForm(value) {}

    resetBranchForm(value) {}

    resetPaymentMethodForm(value) {}

    resetReceiptTypeForm(value) {}

    resetDiscountTypeForm(value) {}
}
