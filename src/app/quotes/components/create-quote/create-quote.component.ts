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
import { HttpClient, HttpRequest } from '@angular/common/http';

type AOA = any[][];

interface IRateResult {
    sumInsured: string;
    endDate: string;
    quarter: string;
    premium: string;
}

interface IRateRequest {
    sumInsured: number;
    premiumRate: number;
    startDate: Date;
    quarter: number;
    discount: number;
    carStereo: number;
    carStereoRate: number;
    lossOfUseDays: number;
    lossOfUseRate: number;
    thirdPartyLimit: number;
    thirdPartyLimitRate: number;
    riotAndStrike: number;
    levy: number;
}

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
    computePremiumIsLoading = false;

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

    //selected risk in risk table
    selectedRisk: RiskModel;

    premiumComputationForm: FormGroup;

    quoteNumber = '';
    risks: RiskModel[] = [];

    ///// Premium Computation
    // Basic Premium
    basicPremium: number;
    sumInsured: number;
    premiumRate: number;
    premiumRateType: string;

    basicPremiumLevy: number;
    // Loading
    addingLoad: boolean;
    premiumLoadingTotal: number;

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

    //risk details modal
    riskDetailsModalVisible = false;

    //close add risk panel
    isAddRiskPanelOpen: boolean

    //Edit risk details
    isRiskDetailsEditmode = false;

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
        }
    ];
    selectedLoadingValue = {
        label: '',
        value: '',
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


    ngOnInit(): void {
        this.quoteForm = this.formBuilder.group({
            quoteNumber: [this.quoteService.generateQuoteNumber('ran', 10)],
            clientCode: ['', Validators.required],
            messageCode: ['ewrewre', Validators.required],
            underwritingYear: [''],
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
            riskStartDate: ['', Validators.required],
            riskQuarter: ['', Validators.required],
            riskEndDate: ['', Validators.required],
            regNumber: ['', Validators.required],
            vehicleMake: ['', Validators.required],
            vehicleModel: ['', Validators.required],
            engineNumber: ['', Validators.required],
            chassisNumber: ['', Validators.required],
            color: ['', Validators.required],
            // sumInsured: ['', Validators.required],
            productType: ['', Validators.required],
            insuranceType: ['Comprehensive'],
        });

        this.riskThirdPartyForm = this.formBuilder.group({
            riskStartDate: ['', Validators.required],
            riskQuarter: ['', Validators.required],
            riskEndDate: ['', Validators.required],
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

        // start of initialize computations
        this.sumInsured = 0;
        this.premiumRate = 0;

        this.basicPremium = 0;
        this.premiumLoadingTotal = 0;
        this.premiumDiscount = 0;
        this.premiumDiscountRate = 0;
        this.basicPremiumLevy = 0;
        this.netPremium = 0;

        this.premiumDiscount = 0;
        this.carStereoValue = 0;
        this.carStereoRate = 0;
        this.lossOfUseDays = 0;
        this.lossOfUseDailyRate = 0;
        this.increasedThirdPartyLimitValue = 0;
        this.increasedThirdPartyLimitsRate = 0;
        this.riotAndStrikeRate = 0;


        // rate should be in percentage when page is loaded
        this.premiumRateType = 'percentage';
        this.increasedThirdPartyLimitsRateType = 'percentage';
        this.riotAndStrikeRateType = 'percentage';
        this.carStereoRateType = 'percentage';
        this.territorailExtensionRateType = 'percentage';
        this.lossOfUseDailyRateType = 'percentage';
        this.premiumDiscountRateType = 'percentage';
    }

    handleComprehensiveRiskEndDateCalculation(): void {
        if (this.riskComprehensiveForm.get('riskStartDate').value != '' && this.riskComprehensiveForm.get('riskQuarter').value != '') {
            const request: IRateRequest = {
                sumInsured: 0,
                premiumRate: 0,
                startDate:  this.riskComprehensiveForm.get('riskStartDate').value,
                quarter: Number(this.riskComprehensiveForm.get('riskQuarter').value),
                discount: 0,
                carStereo: 0,
                carStereoRate: 0,
                lossOfUseDays: 0 ,
                lossOfUseRate: 0,
                thirdPartyLimit: 0,
                thirdPartyLimitRate: 0,
                riotAndStrike: 0,
                levy:0
            }
                this.http.post<IRateResult>(`https://flosure-premium-rates.herokuapp.com/rates/comprehensive`, request).subscribe(data => {
                    this.riskComprehensiveForm.get('riskEndDate').setValue(data.endDate);
                })  
        } 
    }

    handleThirdPartyRiskEndDateCalculation(): void {
        if (this.riskThirdPartyForm.get('riskStartDate').value != '' && this.riskThirdPartyForm.get('riskQuarter').value != '') {
            const request: IRateRequest = {
                sumInsured: 0,
                premiumRate: 0,
                startDate:  this.riskThirdPartyForm.get('riskStartDate').value,
                quarter: Number(this.riskThirdPartyForm.get('riskQuarter').value),
                discount: 0,
                carStereo: 0,
                carStereoRate: 0,
                lossOfUseDays: 0 ,
                lossOfUseRate: 0,
                thirdPartyLimit: 0,
                thirdPartyLimitRate: 0,
                riotAndStrike: 0,
                levy:0
            }
                this.http.post<IRateResult>(`https://flosure-premium-rates.herokuapp.com/rates/comprehensive`, request).subscribe(data => {
                    this.riskThirdPartyForm.get('riskEndDate').setValue(data.endDate);
                })  
        } 
    }

    handlePolicyEndDateCalculation(): void {
        if (this.quoteForm.get('startDate').value != '' && this.quoteForm.get('quarter').value != '') {
            const request: IRateRequest = {
                sumInsured: 0,
                premiumRate: 0,
                startDate:  this.quoteForm.get('startDate').value,
                quarter: Number(this.quoteForm.get('quarter').value),
                discount: 0,
                carStereo: 0,
                carStereoRate: 0,
                lossOfUseDays: 0 ,
                lossOfUseRate: 0,
                thirdPartyLimit: 0,
                thirdPartyLimitRate: 0,
                riotAndStrike: 0,
                levy:0
            }
                this.http.post<IRateResult>(`https://flosure-premium-rates.herokuapp.com/rates/comprehensive`, request).subscribe(data => {
                    this.quoteForm.get('endDate').setValue(data.endDate);
                })  
            
        } 
    }

    onSubmit() {
        const some = this.quoteForm.value;
        this.quoteService.addMotorQuotation(some);

        localStorage.setItem('motor', JSON.stringify(some));
        this.quoteService.getRisk('an');
    }

    //add third party risk
    addThirdPartyRisk(): void {
        const some: RiskModel[] = [];
        some.push({
            ...this.riskThirdPartyForm.value,
            sumInsured: this.sumInsured,
            premiumRate: this.premiumRate,
            basicPremium: this.basicPremium,
            loads: this.loads,
            loadingTotal: this.premiumLoadingTotal,
            discountRate: this.premiumDiscountRate,
            premiumLevy: 0.03,
            netPremium: this.netPremium,
            insuranceType: this.selectedValue.value
        });
        this.risks = [...this.risks, ...some]; 

        //reset form after submitting
        this.riskThirdPartyForm.reset();
            this.sumInsured = 0,
            this.premiumRate = 0,
            this.basicPremium = 0,
            this.loads = [],
            this.premiumLoadingTotal = 0,
            this.premiumDiscountRate = 0,
            this.netPremium = 0

        this.isAddRiskPanelOpen = false;
        console.log(this.risks);
    }

    //reset third party risk form
    resetThirdPartyRiskForm(e: MouseEvent) {
        e.preventDefault();
    this.riskComprehensiveForm.reset();
            this.sumInsured = 0,
            this.premiumRate = 0,
            this.basicPremium = 0,
            this.loads = [],
            this.premiumLoadingTotal = 0,
            this.premiumDiscountRate = 0,
            this.netPremium = 0
    }

    //add comprehesive risk
    addComprehensiveRisk(): void {
        const some: RiskModel[] = [];
        some.push({
            ...this.riskComprehensiveForm.value,
            sumInsured: this.sumInsured,
            premiumRate: this.premiumRate,
            basicPremium: this.basicPremium,
            loads: this.loads,
            loadingTotal: this.premiumLoadingTotal,
            discountRate: this.premiumDiscountRate,
            premiumLevy: 0.03,
            netPremium: this.netPremium,
            insuranceType: this.selectedValue.value
        });
        this.risks = [...this.risks, ...some]; 

        //reset form after submitting
        this.riskComprehensiveForm.reset();
            this.sumInsured = 0,
            this.premiumRate = 0,
            this.basicPremium = 0,
            this.loads = [],
            this.premiumLoadingTotal = 0,
            this.premiumDiscountRate = 0,
            this.netPremium = 0

        this.isAddRiskPanelOpen = false;
    }

    //reset comprehensive risk form
    resetComprehensiveRiskForm(e: MouseEvent) {
        e.preventDefault();
    this.riskComprehensiveForm.reset();
            this.sumInsured = 0,
            this.premiumRate = 0,
            this.basicPremium = 0,
            this.loads = [],
            this.premiumLoadingTotal = 0,
            this.premiumDiscountRate = 0,
            this.netPremium = 0
    }

    resetForms() {
    this.riskComprehensiveForm.reset();
    this.riskThirdPartyForm.reset();
            this.sumInsured = 0,
            this.premiumRate = 0,
            this.basicPremium = 0,
            this.loads = [],
            this.premiumLoadingTotal = 0,
            this.premiumDiscountRate = 0,
            this.netPremium = 0
    }
    
    //view details of the risk
    viewRiskDetails(risk: RiskModel) {
        this.selectedRisk = risk;
        this.riskDetailsModalVisible = true;

        console.log(risk);
        
        if (this.selectedValue.value === 'Comprehensive') {
        // this.riskComprehensiveForm.get('vehicleMake').setValue(risk.vehicleMake);
        // this.riskComprehensiveForm.get('vehicleModel').setValue(risk.vehicleModel);
        this.riskComprehensiveForm.get('regNumber').setValue(risk.regNumber);
        this.riskComprehensiveForm.get('engineNumber').setValue(risk.engineNumber);
        this.riskComprehensiveForm.get('chassisNumber').setValue(risk.chassisNumber);
        this.riskComprehensiveForm.get('productType').setValue(risk.productType);
        this.riskComprehensiveForm.get('riskStartDate').setValue(risk.riskStartDate);
        this.riskComprehensiveForm.get('riskQuarter').setValue(risk.riskQuarter);
        this.riskComprehensiveForm.get('riskEndDate').setValue(risk.riskEndDate);
        this.riskComprehensiveForm.get('color').setValue(risk.color);
    }
    else {
        // this.riskComprehensiveForm.get('vehicleMake').setValue(risk.vehicleMake);
        // this.riskComprehensiveForm.get('vehicleModel').setValue(risk.vehicleModel);
        this.riskThirdPartyForm.get('regNumber').setValue(risk.regNumber);
        this.riskThirdPartyForm.get('engineNumber').setValue(risk.engineNumber);
        this.riskThirdPartyForm.get('chassisNumber').setValue(risk.chassisNumber);
        this.riskThirdPartyForm.get('productType').setValue(risk.productType);
        this.riskThirdPartyForm.get('riskStartDate').setValue(risk.riskStartDate);
        this.riskThirdPartyForm.get('riskQuarter').setValue(risk.riskQuarter);
        this.riskThirdPartyForm.get('riskEndDate').setValue(risk.riskEndDate);
        this.riskThirdPartyForm.get('color').setValue(risk.color);
    }
       
        this.selectedVehicleMake = risk.vehicleMake
        this.selectedVehicleModel = risk.vehicleModel
        this.sumInsured = risk.sumInsured;
        this.premiumRate = risk.premiumRate;
        this.loads = risk.loads;
        this.basicPremium = risk.basicPremium;
        this.premiumLoadingTotal = risk.loadingTotal;
        this.basicPremiumLevy = risk.premiumLevy;
        this.netPremium = risk.netPremium;
    }

    //remove risk from risks table
    removeRisk(regNumber: string): void {
        this.risks = this.risks.filter(risk => risk.regNumber !== regNumber);
      }

      deleteRow(id: string): void {
        
      }

    closeRiskDetails(){
        this.riskDetailsModalVisible = false;
    }

    async addQuote(): Promise<void> {
        const quote: MotorQuotationModel = {
            ...this.quoteForm.value,
            user: this.agentMode
                ? this.quoteForm.get('user').value
                : 'Charles Malama',
            risks: this.risks,

        };
        console.log(quote);
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

    computePremium() {
        this.computePremiumIsLoading = true;
        const request: IRateRequest = {
            sumInsured: Number(this.sumInsured),
            premiumRate: (Number(this.premiumRate)/100),
            startDate:  this.riskComprehensiveForm.get('riskStartDate').value,
            quarter: Number(this.riskComprehensiveForm.get('riskQuarter').value),
            discount: (Number(this.premiumDiscountRate)/100),
            carStereo: Number(this.carStereoValue),
            carStereoRate: (Number(this.carStereoRate)/100),
            lossOfUseDays: Number(this.lossOfUseDays),
            lossOfUseRate: (Number(this.lossOfUseDailyRate)/100),
            thirdPartyLimit: (Number(this.increasedThirdPartyLimitValue)),
            thirdPartyLimitRate: (Number(this.increasedThirdPartyLimitsRate)/100),
            riotAndStrike: (Number(this.riotAndStrikeRate)/100),
            levy: 0.03
        }
            this.http.post<IRateResult>(`https://flosure-premium-rates.herokuapp.com/rates/comprehensive`, request).subscribe(data => {
                this.netPremium = Number(data.premium);
                this.computePremiumIsLoading = false;
            }) 
    }

    computeThirdPartyPremium() {
        this.computePremiumIsLoading = true;
        const request: IRateRequest = {
            sumInsured: Number(this.sumInsured),
            premiumRate: (Number(this.premiumRate)/100),
            startDate:  this.riskThirdPartyForm.get('riskStartDate').value,
            quarter: Number(this.riskThirdPartyForm.get('riskQuarter').value),
            discount: (Number(this.premiumDiscountRate)/100),
            carStereo: Number(this.carStereoValue),
            carStereoRate: (Number(this.carStereoRate)/100),
            lossOfUseDays: Number(this.lossOfUseDays),
            lossOfUseRate: (Number(this.lossOfUseDailyRate)/100),
            thirdPartyLimit: (Number(this.increasedThirdPartyLimitValue)),
            thirdPartyLimitRate: (Number(this.increasedThirdPartyLimitsRate)/100),
            riotAndStrike: (Number(this.riotAndStrikeRate)/100),
            levy: 0.03
        }
            this.http.post<IRateResult>(`https://flosure-premium-rates.herokuapp.com/rates/comprehensive`, request).subscribe(data => {
                this.netPremium = Number(data.premium);
                this.computePremiumIsLoading = false;
            }) 

    }

    // Loading computation
    computeRiotAndStrike() {
        this.computeRiotAndStrikeIsLoading = true;

            setTimeout(() => {
                console.log(this.riotAndStrikeRate)
        
                this.loads.push({
                    loadType: 'Riot And Strike',
                    amount: this.riotAndStrikeAmount,
                });
                this.addingLoad = false;
            
            this.computeRiotAndStrikeIsLoading = false;
            this.selectedLoadingValue.value = '';
            }, 2000);

    }

    computeIncreasedThirdPartyLimit() {
        this.computeIncreasedThirdPartyLimitIsLoading = true;

            setTimeout(() => {

                this.loads.push({
                    loadType: 'Increased Third Party Limit',
                    amount: this.increasedThirdPartyLimitsAmount,
                });
        
                    this.addingLoad = false;
                    
            
            this.computeIncreasedThirdPartyLimitIsLoading = false;
            this.selectedLoadingValue.value = '';
            }, 2000);  
    }

    computeCarStereo() {
        this.computeCarStereoIsLoading = true;
            setTimeout(() => {
                this.loads.push({
                    loadType: 'Car Stereo',
                    amount: this.carStereoAmount,
                });
               
        
                    this.addingLoad = false;
                    
            
            this.computeCarStereoIsLoading = false;
            this.selectedLoadingValue.value = '';
            }, 2000);
    }

    computeTerritorialExtension() {
        this.computeTerritorialExtensionIsLoading = true;

            setTimeout(() => {
                this.loads.push({ loadType: 'Territorial Extension', amount: 1750 });
        
                    this.addingLoad = false;
            
            this.computeTerritorialExtensionIsLoading = false;
            this.selectedLoadingValue.value = '';
            }, 2000);

            this.basicPremiumLevy = this.totalPremium * 0.03;
            this.netPremium = this.totalPremium + this.basicPremiumLevy;

            this.addingLoad = false;

            this.computeTerritorialExtensionIsLoading = false;
        }, 2000);
    }

    computeLossOfUse() {
        this.computeLossOfUseIsLoading = true;
            setTimeout(() => {
            
                this.loads.push({
                    loadType: 'Loss Of Use',
                    amount: this.lossOfUseAmount,
                });
                    this.addingLoad = false;
            
            this.computeLossOfUseIsLoading = false;
            this.selectedLoadingValue.value = '';
            }, 2000);
    }

    removeLoad(i: LoadModel, e: MouseEvent): void {
        e.preventDefault();
        if (this.loads.length > 0) {
          const index = this.loads.indexOf(i);
          this.loads.splice(index, 1);
        }
      }

    // Discount Computation
    computeDiscount() {
        this.computeDiscountIsLoading = true;

    }

    //Add risk validation
    validateriskComprehensiveFormDetails(): boolean {
        if (this.riskComprehensiveForm.valid){
            if (this.sumInsured && this.sumInsured != 0){
                if (this.premiumRate && this.premiumRate != 0){
                    if (this.netPremium > 0) {
                        return true;
                    }  
                }
            }
        }
    }
}
