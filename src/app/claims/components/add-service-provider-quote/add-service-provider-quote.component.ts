import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    OnDestroy
} from '@angular/core';
import { UploadChangeParam, NzMessageService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClaimsService } from '../../services/claims-service.service';
import { IServiceProvider } from '../../models/service-provider.model';
import { Subscription } from 'rxjs';
import { ClaimsProcessingServiceService } from '../../services/claims-processing-service.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Claim } from '../../models/claim.model';
import { finalize } from 'rxjs/operators';
import { IDocumentUpload } from '../../models/document-upload.model';
import { IServiceProviderQuote } from '../../models/service-provider-quote.model';
import { v4 } from 'uuid';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-add-service-provider-quote',
    templateUrl: './add-service-provider-quote.component.html',
    styleUrls: ['./add-service-provider-quote.component.scss']
})
export class AddServiceProviderQuoteComponent implements OnInit, OnDestroy {
    isAddingServiceProvider = false;
    claimSubscription: Subscription;
    isUploading = false;

    @Input()
    isAddServiceProviderQuoteVisible: boolean;

    @Output()
    closeAddServiceProviderQuoteModal: EventEmitter<any> = new EventEmitter();

    documentTitle: string = 'Service Privider Quotation';

    currentClaim: Claim;
    claimsList: Claim[] = [];

    serviceProviderQuoteForm: FormGroup;

    serviceProvidersList: IServiceProvider[];
    displayServiceProvidersList: IServiceProvider[];

    documentUploads: IDocumentUpload[] = [];
    servicePrividerDocumentUpload: IDocumentUpload;
    returnedServicePrividerDocumentUpload: IDocumentUpload;

    downloadURL;
    returnStorgeLink: string;
    fileURL;

    constructor(
        private formBuilder: FormBuilder,
        private msg: NzMessageService,
        private claimsService: ClaimsService,
        private claimProcessingService: ClaimsProcessingServiceService,
        private storage: AngularFireStorage,
        private router: ActivatedRoute
    ) {
        this.claimSubscription = this.claimProcessingService.claimChanged$.subscribe(
            claim => {
                this.currentClaim = claim;
                // this.documentUploads = this.currentClaim.documentUploads;
                console.log('claimmm', this.currentClaim);
            }
        );
    }

    ngOnInit(): void {
        // this.router.params.subscribe(param => {
        //     this.claimsService.getClaims().subscribe(claims => {
        //         this.currentClaim = claims.filter(x => x.id == param.id)[0];
        //     });
        // });
        this.router.data.subscribe(data => (this.currentClaim = data.claim));

        this.serviceProviderQuoteForm = this.formBuilder.group({
            serviceProvider: ['', Validators.required],
            totalCost: [''],
            repairesDescription: ['', Validators.required]
        });

        this.claimsService.getServiceProviders().subscribe(serviceProviders => {
            this.serviceProvidersList = serviceProviders;
            this.displayServiceProvidersList = this.serviceProvidersList;
        });
    }

    closeAddServiceProviderQuote() {
        this.closeAddServiceProviderQuoteModal.emit(true);
    }

    onFileSelected(event) {
        this.isUploading = true;

        const date = Date.now();
        const file = event.file.originFileObj;
        const filePath = `DocumentUploads/${date}`;
        const fileRef = this.storage.ref(filePath);

        const task = fileRef.put(file);
        setTimeout(() => {
            task.snapshotChanges()
                .pipe(
                    finalize(() => {
                        this.downloadURL = fileRef.getDownloadURL();
                        console.log(this.downloadURL);
                        this.downloadURL.subscribe(url => {
                            if (url) {
                                this.returnStorgeLink = url;

                                console.log(
                                    'returned link',
                                    this.returnStorgeLink
                                );

                                const documentUpload: IDocumentUpload = {
                                    documentType: 'Service Provider Quotation',
                                    storageLink: this.returnStorgeLink
                                };

                                this.claimsService
                                    .createDocumentUpload(documentUpload)
                                    .subscribe(docUpload => {
                                        console.log('docU', docUpload);
                                        this.returnedServicePrividerDocumentUpload = docUpload;
                                        this.isUploading = false;
                                    });
                            }
                        });
                    })
                )
                .subscribe(url => {
                    if (url) {
                        this.fileURL = url;
                    }
                });
        }, 3000);
    }

    addQuote() {
        this.isAddingServiceProvider = true;
        this.claimsService.getDocumentUploads().subscribe(uploads => {
            const sp: IServiceProvider[] = [];
            const du: IDocumentUpload[] = [];
            const ServiceProviderQuotations: IServiceProviderQuote[] = [];

            this.documentUploads = uploads;

            this.servicePrividerDocumentUpload = this.documentUploads.filter(
                x => x.id == this.returnedServicePrividerDocumentUpload.id
            )[0];

            sp.push(this.serviceProviderQuoteForm.get('serviceProvider').value);
            du.push(this.servicePrividerDocumentUpload);

            const serviceProviderQuote: IServiceProviderQuote = {
                ...this.serviceProviderQuoteForm.value,
                serviceProvider: sp,
                documentUpload: du
            };

            this.currentClaim.serviceProviderRepairsQuotations.push(
                serviceProviderQuote
            );

            this.claimsService
                .updateClaim(this.currentClaim.id, this.currentClaim)
                .subscribe(
                    res => {
                        console.log(res);
                        this.isAddingServiceProvider = false;
                        this.closeAddServiceProviderQuoteModal.emit(true);
                        this.isAddServiceProviderQuoteVisible = false;
                        this.msg.success('Quotation Added');
                    },
                    err => {
                        console.log(err);
                        this.isAddingServiceProvider = false;
                        this.msg.error('Failed to Add Quotation');
                    }
                );

            // this.claimsService
            //     .createServiceProviderQuote(serviceProviderQuote)
            //     .subscribe(quote => {
            //         this.currentClaim.serviceProviderRepairsQuotations.push(
            //             quote
            //         );

            //         this.claimsService
            //             .updateClaim(this.currentClaim.id, this.currentClaim)
            //             .subscribe(res => {
            //                 console.log(res);
            //             });
            //     });
        });
    }

    resetForm(e: MouseEvent): void {
        e.preventDefault();
        this.serviceProviderQuoteForm.reset();
    }

    ngOnDestroy() {
        this.claimSubscription.unsubscribe();
    }
}
