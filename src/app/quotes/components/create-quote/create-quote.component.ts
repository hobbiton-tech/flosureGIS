import { Component, OnInit } from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { QuotesService } from '../../services/quotes.service';
import { ClientsService } from 'src/app/clients/services/clients.service';
import {
    ICorporateClient,
    IIndividualClient,
} from 'src/app/clients/models/client.model';
import {
    RiskModel,
    Quote,
    MotorQuotationModel,
    Load,
    LoadModel,
} from '../../models/quote.model';
import {
    map,
    tap,
    filter,
    scan,
    retry,
    catchError,
    debounceTime,
    switchMap,
} from 'rxjs/operators';
import { NzMessageService, UploadChangeParam } from 'ng-zorro-antd';
import * as XLSX from 'xlsx';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

type AOA = any[][];

@Component({
    selector: 'app-create-quote',
    templateUrl: './create-quote.component.html',
    styleUrls: ['./create-quote.component.scss'],
})
export class CreateQuoteComponent implements OnInit {
    // conditional render of agent field based on mode(agent or user)
    agentMode = false;
    switchLoading = false;

    // vehicle make drop down
    vehicleMakeUrl = 'https://api.randomuser.me/?results=5';
    searchChange$ = new BehaviorSubject('');
    vehicleMakeOptionList: string[] = [];
    selectedVehicleMake: string;
    isVehicleMakeLoading = false;

    // vehicle model drop down
    vehicleModelUrl = 'https://api.randomuser.me/?results=5';
    // searchChange$ = new BehaviorSubject('');
    vehicleModelOptionList: string[] = [];
    selectedVehicleModel: string;
    isVehicleModelLoading = false;

    // loading feedback
    computeBasicPremiumIsLoading = false;
    computeIncreasedThirdPartyLimitIsLoading = false;
    computeRiotAndStrikeIsLoading = false;
    computeCarStereoIsLoading = false;
    computeTerritorialExtensionIsLoading = false;
    computeLossOfUseIsLoading = false;
    computeDiscountIsLoading = false;

    addLoadIsLoading = false;

    //
    data: AOA = [
        [1, 2],
        [3, 4],
    ];
    wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };

    /*name of the risks template that will be downloaded. */
    fileName = 'Risks_template.xlsx';
    fileLocation: string;

    constructor(
        private formBuilder: FormBuilder,
        private readonly router: Router,
        private readonly quoteService: QuotesService,
        private readonly clientsService: ClientsService,
        private msg: NzMessageService,
        private http: HttpClient
    ) {}

    motor: any;
    quoteForm: FormGroup;
    riskThirdPartyForm: FormGroup;
    riskComprehensiveForm: FormGroup;
    clients: Array<IIndividualClient & ICorporateClient>;
    premiumLoadingForm: FormGroup;

    premiumComputationForm: FormGroup;

    quoteNumber = '';
    risks: RiskModel[] = [];

    ///// Premium Computation
    // Basic Premium
    basicPremium: number;
    basicPremiumLevy: number;
    basicPremiumSubTotal: number;
    sumInsured: number;
    premiumRate: number;
    premiumRateType: string;
    // Loading
    addingLoad: boolean;
    premiumLoadingsubTotal: number;

    increasedThirdPartyLimitsRate: number;
    increasedThirdPartyLimitsAmount: number;
    increasedThirdPartyLimitsRateType: string;
    increasedThirdPartyLimitValue: number;

    riotAndStrikeRate: number;
    riotAndStrikeAmount: number;
    riotAndStrikeRateType: string;

    carStereoValue: number;
    carStereoRate: number;
    carStereoRateType: string;
    carStereoAmount: number;

    territorailExtensionRateType: string;

    lossOfUseDailyRate: number;
    lossOfUseDailyRateType: string;
    lossOfUseDays: number;
    lossOfUseAmount: number;

    // Discount
    premiumDiscountRate: number;
    premiumDiscountRateType: string;
    premiumDiscount: number;
    premiumDiscountSubtotal: number;
    // Net or total premium
    totalPremium: number;
    netPremium: number;

    // loads added to loading
    loads: LoadModel[] = [];

    // risk upload modal
    isVisible = false;
    isConfirmLoading = false;

    todayYear = null;

    optionList = [
        { label: 'Motor Comprehensive', value: 'Comprehensive' },
        { label: 'Motor Third Party', value: 'ThirdParty' },
    ];
    selectedValue = { label: 'Motor Comprehensive', value: 'Comprehensive' };

    motorComprehensiveloadingOptions = [
        {
            label: 'Increased Third Party Limit',
            value: 'increasedThirdPartyLimits',
        },
        { label: 'Riot and strike', value: 'riotAndStrike' },
        { label: 'Car Stereo', value: 'carStereo' },
        // { label: 'Territorial Extension', value: 'territorailExtension'},
        { label: 'Loss Of Use', value: 'lossOfUse' },
    ];

    motorThirdPartyloadingOptions = [
        {
            label: 'Increased Third Party Limit',
            value: 'increasedThirdPartyLimits',
        },
    ];
    selectedLoadingValue = {
        label: 'Increased Third Party Limit',
        value: 'increasedThirdPartyLimits',
    };

    startValue: Date | null = null;
    endValue: Date | null = null;
    endOpen = false;

    compareFn = (o1: any, o2: any) =>
        o1 && o2 ? o1.value === o2.value : o1 === o2;

    log(value: { label: string; value: string }): void {
        this.selectedLoadingValue = {
            label: 'Increased Third Party Limit',
            value: 'increasedThirdPartyLimits',
        };
        console.log(value);
    }

    disabledStartDate = (startValue: Date): boolean => {
        if (!startValue || !this.endValue) {
            return false;
        }
        return startValue.getTime() > this.endValue.getTime();
    };

    disabledEndDate = (endValue: Date): boolean => {
        if (!endValue || !this.startValue) {
            return false;
        }
        return endValue.getTime() <= this.startValue.getTime();
    };

    handleStartOpenChange(open: boolean): void {
        if (!open) {
            this.endOpen = true;
            // const start_date = this.quoteForm.get('startDate').value;
            // console.log(start_date);
        }
    }

    handleEndOpenChange(open: boolean): void {
        console.log(open);
        this.endOpen = open;
    }

    ngOnInit(): void {
        this.quoteForm = this.formBuilder.group({
            quoteNumber: [this.quoteService.generateQuoteNumber('ran', 10)],
            clientCode: ['', Validators.required],
            messageCode: ['ewrewre', Validators.required],
            underwritingYear: ['', Validators.required],
            currency: ['', Validators.required],
            startDate: ['', Validators.required],
            endDate: [''],
            quarter: ['', Validators.required],
            user: ['Charles Malama', Validators.required],
            status: ['Draft'],
            receiptStatus: ['Unreceipted'],
        });

        this.clientsService.getAllClients().subscribe((clients) => {
            this.clients = [...clients[0], ...clients[1]] as Array<
                IIndividualClient & ICorporateClient
            >;
        });

        this.riskComprehensiveForm = this.formBuilder.group({
            regNumber: ['', Validators.required],
            vehicleMake: ['', Validators.required],
            vehicleModel: ['', Validators.required],
            engineNumber: ['', Validators.required],
            chassisNumber: ['', Validators.required],
            color: ['', Validators.required],
            estimatedValue: ['', Validators.required],
            productType: ['', Validators.required],
            insuranceType: ['Comprehensive'],
        });

        this.riskThirdPartyForm = this.formBuilder.group({
            regNumber: ['', [Validators.required]],
            vehicleMake: ['', [Validators.required]],
            vehicleModel: ['', [Validators.required]],
            engineNumber: ['', [Validators.required]],
            chassisNumber: ['', [Validators.required]],
            color: ['', [Validators.required]],
            productType: ['', [Validators.required]],
            insuranceType: ['ThirdParty'],
        });

        // vehicle make loading
        const getVehicleMakeList = (name: string) =>
            this.http
                .get(`${this.vehicleMakeUrl}`)
                .pipe(map((res: any) => res.results))
                .pipe(
                    map((list: any) => {
                        return list.map((item: any) => `${name}`);
                    })
                );

        const vehicleMakeOptionList$: Observable<
            string[]
        > = this.searchChange$
            .asObservable()
            .pipe(debounceTime(500))
            .pipe(switchMap(getVehicleMakeList));
        vehicleMakeOptionList$.subscribe((data) => {
            this.vehicleMakeOptionList = data;
            this.isVehicleMakeLoading = false;
        });

        // vehicle model loading
        const getVehicleModelList = (name: string) =>
            this.http
                .get(`${this.vehicleModelUrl}`)
                .pipe(map((res: any) => res.results))
                .pipe(
                    map((list: any) => {
                        return list.map((item: any) => `${name}`);
                    })
                );

        const vehicleModelOptionList$: Observable<
            string[]
        > = this.searchChange$
            .asObservable()
            .pipe(debounceTime(500))
            .pipe(switchMap(getVehicleModelList));
        vehicleModelOptionList$.subscribe((data) => {
            this.vehicleModelOptionList = data;
            this.isVehicleModelLoading = false;
        });

        this.premiumComputationForm = this.formBuilder.group({
            sumInsured: ['', Validators.required],
            premiumRate: ['', Validators.required],
            increasedThirdPartyLimitsRate: ['', Validators.required],
            increasedThirdPartyLimitValue: ['', Validators.required],
            riotAndStrikeRate: ['', Validators.required],
            carStereoRate: ['', Validators.required],
            lossOfUseDailyRate: ['', Validators.required],
            lossOfUseDays: ['', Validators.required],
            premiumDiscountRate: ['', Validators.required],
        });

        // Basic Premium
        this.sumInsured = 0;
        this.premiumRate = 0;
        this.basicPremium = this.sumInsured * this.premiumRate;
        this.basicPremiumLevy = 0;
        this.basicPremiumSubTotal = this.basicPremium;
        this.netPremium = 0;

        // premium Loading
        this.addingLoad = false;
        this.increasedThirdPartyLimitsRate = 0;
        this.increasedThirdPartyLimitsAmount = 0;
        this.increasedThirdPartyLimitValue = 0;

        this.riotAndStrikeRate = 0;
        this.riotAndStrikeAmount = 0;

        this.carStereoValue = 0;
        this.carStereoRate = 0;
        this.carStereoAmount = 0;

        this.lossOfUseDailyRate = 0;
        this.lossOfUseDays = 0;
        this.lossOfUseAmount = 0;

        this.premiumLoadingsubTotal = 0;

        // Discount
        this.premiumDiscountRate = 0;
        this.premiumDiscount = 0;
        this.premiumDiscountSubtotal = this.premiumDiscount;
        this.totalPremium =
            this.basicPremiumSubTotal +
            this.premiumLoadingsubTotal -
            this.premiumDiscountSubtotal;

        // rate should be in percentage when page is loaded
        this.premiumRateType = 'percentage';
        this.increasedThirdPartyLimitsRateType = 'percentage';
        this.riotAndStrikeRateType = 'percentage';
        this.carStereoRateType = 'percentage';
        this.territorailExtensionRateType = 'percentage';
        this.lossOfUseDailyRateType = 'percentage';
        this.premiumDiscountRateType = 'percentage';
    }

    onSubmit() {
        const some = this.quoteForm.value;
        this.quoteService.addMotorQuotation(some);

        localStorage.setItem('motor', JSON.stringify(some));
        this.quoteService.getRisk('an');
    }

    addThirdPartyRisk(): void {
        const some: RiskModel[] = [];
        some.push(this.riskThirdPartyForm.value);
        this.risks = [...this.risks, ...some];
        console.log(this.risks);
    }

    addComprehensiveRisk(): void {
        const some: RiskModel[] = [];
        some.push(this.riskComprehensiveForm.value);
        this.risks = [...this.risks, ...some];
        console.log(this.risks);
    }

    async addQuote(): Promise<void> {
        const quote: MotorQuotationModel = {
            ...this.quoteForm.value,
            user: this.agentMode
                ? this.quoteForm.get('user').value
                : 'Charles Malama',
            risks: this.risks,
            sumInsured: this.sumInsured,
            premiumRate: this.premiumRate,
            basicPremium: this.basicPremium,
            premiumLevy: this.basicPremiumLevy,
            basicPremiumSubTotal: this.basicPremiumSubTotal,
            discountRate: this.premiumDiscountRate,
            discount: this.premiumDiscount,
            discountSubTotal: this.premiumDiscountSubtotal,
            totalPremium: this.totalPremium,
            netPremium: this.netPremium,
            loads: this.loads,
            loadingSubTotal: this.premiumLoadingsubTotal,
            endDate: this.quoteForm.get('startDate').value,
        };
        await this.quoteService
            .addMotorQuotation(quote)
            .then((success) => {
                this.msg.success('Quotation Successfully created');
            })
            .catch((err) => {
                this.msg.error('Quotation Creation Failed');
            });
    }

    showModal(): void {
        this.isVisible = true;
    }

    handleCancel(): void {
        this.isVisible = false;
    }

    handleDownloadTemplate() {
        const element = document.getElementById('risksTable');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, this.fileName);
    }

    // what happens when a file is uploaded
    handleChange({ file, fileList, event, type }: UploadChangeParam): void {
        const status = file.status;

        // when file is uploading
        if (status !== 'uploading') {
            // console.log(file);
            //
        }

        // when file is done uploading
        if (status === 'done') {
            this.msg.success(`${file.name} file uploaded successfully.`);
            this.fileLocation = file.response.Location;
            console.log(this.fileLocation);
            const fileExtension = file.name.split('.')[1];
            this.isVisible = false;

            // get uploaded excel file and convert it to array
            // XMLHttpRequest
            const url = 'assets/docs/risks.xlsx';
            // const url = this.fileLocation;
            const oReq = new XMLHttpRequest();
            oReq.open('GET', this.fileLocation, true);
            oReq.responseType = 'arraybuffer';

            oReq.onload = (e) => {
                const arraybuffer = oReq.response;

                // //convert data to binary string
                const data = new Uint8Array(arraybuffer);
                const arr = new Array();
                for (let i = 0; i !== data.length; ++i) {
                    arr[i] = String.fromCharCode(data[i]);
                }
                const bstr = arr.join('');

                // call XLSX
                const workbook = XLSX.read(bstr, { type: 'binary' });
                workbook.SheetNames.forEach((sheetName) => {
                    const imported_risks: RiskModel[] = XLSX.utils.sheet_to_json(
                        workbook.Sheets[sheetName]
                    );
                    this.risks = imported_risks;
                });
            };

            oReq.send();

            // when there is an error during upload
        } else if (status === 'error') {
            this.msg.error(`${file.name} file upload failed.`);
        }
    }

    switchMode(): void {
        if (!this.switchLoading) {
            this.switchLoading = true;
            setTimeout(() => {
                this.agentMode = !this.agentMode;
                this.switchLoading = false;
            }, 500);
        }
    }

    // vehicle make loading
    onVehicleMakeSearch(value: string): void {
        this.isVehicleMakeLoading = true;
        this.searchChange$.next(value);
    }

    // vehicle model loading
    onVehicleModelSearch(value: string): void {
        this.isVehicleModelLoading = true;
        this.searchChange$.next(value);
    }

    addLoad() {
        this.addLoadIsLoading = true;
        setTimeout(() => {
            this.addingLoad = true;
            this.addLoadIsLoading = false;
        }, 1000);
    }

    // Premium computation methods
    // Basic Premum Computation
    computeBasicPremium() {
        this.computeBasicPremiumIsLoading = true;
        setTimeout(() => {
            if (this.premiumRateType === 'percentage') {
                this.basicPremium = this.sumInsured * (this.premiumRate / 100);
            } else {
                this.basicPremium = +this.sumInsured + +this.premiumRate;
            }
            this.basicPremiumSubTotal = this.basicPremium;
            this.totalPremium =
                this.basicPremiumSubTotal +
                this.premiumLoadingsubTotal -
                this.premiumDiscountSubtotal;
            this.basicPremiumLevy = this.totalPremium * 0.03;
            this.netPremium = this.totalPremium + this.basicPremiumLevy;

            this.computeBasicPremiumIsLoading = false;
        }, 2000);
    }

    // Loading computation
    computeRiotAndStrike() {
        this.computeRiotAndStrikeIsLoading = true;
        setTimeout(() => {
            if (this.riotAndStrikeRateType === 'percentage') {
                this.riotAndStrikeAmount =
                    this.basicPremium * (this.riotAndStrikeRate / 100);
            } else {
                this.riotAndStrikeAmount = +this.riotAndStrikeRate;
            }

            this.loads.push({
                loadType: 'Riot And Strike',
                amount: this.riotAndStrikeAmount,
            });
            this.premiumLoadingsubTotal =
                this.premiumDiscountSubtotal + this.riotAndStrikeAmount;
            this.totalPremium =
                this.basicPremiumSubTotal +
                this.premiumLoadingsubTotal -
                this.premiumDiscountSubtotal;

            this.basicPremiumLevy = this.totalPremium * 0.03;
            this.netPremium = this.totalPremium + this.basicPremiumLevy;

            this.addingLoad = false;

            this.computeRiotAndStrikeIsLoading = false;
        }, 2000);
    }

    computeIncreasedThirdPartyLimit() {
        this.computeIncreasedThirdPartyLimitIsLoading = true;
        setTimeout(() => {
            if (this.increasedThirdPartyLimitsRateType === 'percentage') {
                this.increasedThirdPartyLimitsAmount =
                    (+this.increasedThirdPartyLimitValue - 100200) *
                    (this.increasedThirdPartyLimitsRate / 100);
            } else {
                this.increasedThirdPartyLimitsAmount = this.increasedThirdPartyLimitsRate;
            }
            this.loads.push({
                loadType: 'Increased Third Party Limit',
                amount: this.increasedThirdPartyLimitsAmount,
            });

            this.premiumLoadingsubTotal =
                this.premiumLoadingsubTotal +
                this.increasedThirdPartyLimitsAmount;
            this.totalPremium =
                this.basicPremiumSubTotal +
                this.premiumLoadingsubTotal -
                this.premiumDiscountSubtotal;

            this.basicPremiumLevy = this.totalPremium * 0.03;
            this.netPremium = this.totalPremium + this.basicPremiumLevy;

            this.addingLoad = false;

            this.computeIncreasedThirdPartyLimitIsLoading = false;
        }, 2000);
    }

    computeCarStereo() {
        this.computeCarStereoIsLoading = true;
        setTimeout(() => {
            if (this.carStereoRateType === 'percentage') {
                this.carStereoAmount =
                    this.carStereoValue * (this.carStereoRate / 100);
            } else {
                this.carStereoAmount = +this.carStereoRate;
            }

            this.loads.push({
                loadType: 'Car Stereo',
                amount: this.carStereoAmount,
            });
            this.premiumLoadingsubTotal =
                this.premiumLoadingsubTotal + this.carStereoAmount;
            this.totalPremium =
                this.basicPremiumSubTotal +
                this.premiumLoadingsubTotal -
                this.premiumDiscountSubtotal;

            this.basicPremiumLevy = this.totalPremium * 0.03;
            this.netPremium = this.totalPremium + this.basicPremiumLevy;

            this.addingLoad = false;

            this.computeCarStereoIsLoading = false;
        }, 2000);
    }

    computeTerritorialExtension() {
        this.computeTerritorialExtensionIsLoading = true;
        setTimeout(() => {
            this.loads.push({
                loadType: 'Territorial Extension',
                amount: 1750,
            });
            this.premiumLoadingsubTotal = this.premiumLoadingsubTotal + 1750;
            this.totalPremium =
                this.basicPremiumSubTotal +
                this.premiumLoadingsubTotal -
                this.premiumDiscountSubtotal;

            this.basicPremiumLevy = this.totalPremium * 0.03;
            this.netPremium = this.totalPremium + this.basicPremiumLevy;

            this.addingLoad = false;

            this.computeTerritorialExtensionIsLoading = false;
        }, 2000);
    }

    computeLossOfUse() {
        this.computeLossOfUseIsLoading = true;
        setTimeout(() => {
            if (this.lossOfUseDailyRateType === 'percentage') {
                this.lossOfUseAmount =
                    this.lossOfUseDays *
                    (this.basicPremium * (this.lossOfUseDailyRate / 100));
            } else {
                this.lossOfUseAmount =
                    this.lossOfUseDays * this.lossOfUseDailyRate;
            }

            this.loads.push({
                loadType: 'Loss Of Use',
                amount: this.lossOfUseAmount,
            });
            this.premiumLoadingsubTotal =
                this.premiumLoadingsubTotal + this.lossOfUseAmount;
            this.totalPremium =
                this.basicPremiumSubTotal +
                this.premiumLoadingsubTotal -
                this.premiumDiscountSubtotal;

            this.basicPremiumLevy = this.totalPremium * 0.03;
            this.netPremium = this.totalPremium + this.basicPremiumLevy;

            this.addingLoad = false;

            this.computeLossOfUseIsLoading = false;
        }, 2000);
    }

    // Discount Computation
    computeDiscount() {
        this.computeDiscountIsLoading = true;
        setTimeout(() => {
            if (this.premiumDiscountRateType == 'percentage') {
                this.premiumDiscount =
                    (this.basicPremiumSubTotal + this.premiumLoadingsubTotal) *
                    (this.premiumDiscountRate / 100);
            } else {
                this.premiumDiscount = this.premiumDiscountRate;
            }

            this.premiumDiscountSubtotal = this.premiumDiscount;
            this.totalPremium =
                this.basicPremiumSubTotal +
                this.premiumLoadingsubTotal -
                this.premiumDiscountSubtotal;

            this.basicPremiumLevy = this.totalPremium * 0.03;
            this.netPremium = this.totalPremium + this.basicPremiumLevy;

            this.computeDiscountIsLoading = false;
        }, 2000);
    }
}
