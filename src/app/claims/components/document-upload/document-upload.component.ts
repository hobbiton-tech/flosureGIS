import { Component, OnInit, OnDestroy } from '@angular/core';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMessageService } from 'ng-zorro-antd';
import { ClaimsProcessingServiceService } from '../../services/claims-processing-service.service';
import { Claim } from '../../models/claim.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ClaimsService } from '../../services/claims-service.service';
import { IDocumentUpload } from '../../models/document-upload.model';
import { Subscription } from 'rxjs';
import { IClass } from 'src/app/settings/components/product-setups/models/product-setups-models.model';

@Component({
    selector: 'app-document-upload',
    templateUrl: './document-upload.component.html',
    styleUrls: ['./document-upload.component.scss']
})
export class DocumentUploadComponent implements OnInit, OnDestroy {
    claimSubscription: Subscription;

    isDocumentUploadModalVisible: boolean = false;

    claim: Claim;

    motorClassDocuments = [
        'Drivers License',
        'Claim Form',
        'Police Report',
        'Subrogation Form'
    ];

    fireClassdocuments = ['Claim Form', 'Police Report', 'Subrogation Form'];

    data = [];

    documentUploads: string[];

    currentClaim: Claim;

    downloadLink: string;

    currentClass: IClass;

    constructor(
        private readonly route: Router,
        private router: ActivatedRoute,
        public msg: NzMessageService,
        private claimProcessingService: ClaimsProcessingServiceService,
        private claimsService: ClaimsService
    ) {
        this.claimSubscription = this.claimProcessingService.claimChanged$.subscribe(
            claim => {
                this.ngOnInit();
            }
        );
    }

    ngOnInit(): void {
        this.isDocumentUploadModalVisible = false;
        this.router.data.subscribe(data => {
            this.claim = data.claim;
            this.currentClass = this.claim.policy.class;
            console.log('claim policy class:=>', this.currentClass);

            if (this.currentClass.className == 'Motor') {
                this.data = this.motorClassDocuments;
            }
            if (this.currentClass.className == 'Fire') {
                this.data = this.fireClassdocuments;
            }
            if (this.currentClass.className == 'Accident') {
                this.data = this.fireClassdocuments;
            }
        });
        this.documentUploads = this.claim.documentUploads.map(
            x => x.documentType
        );
    }

    openDocumentUploadModal(item) {
        console.log(item);
        this.claimProcessingService.changeDocumentType(item);
        this.isDocumentUploadModalVisible = true;
    }

    viewDocument(item) {
        const document: IDocumentUpload = this.claim.documentUploads.filter(
            x => x.documentType == item
        )[0];
        this.downloadLink = document.storageLink;
        window.open(this.downloadLink);
    }

    ngOnDestroy() {
        this.claimSubscription.unsubscribe();
    }
}
