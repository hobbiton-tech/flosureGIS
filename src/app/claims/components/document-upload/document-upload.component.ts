import { Component, OnInit, OnDestroy } from '@angular/core';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMessageService } from 'ng-zorro-antd';
import { ClaimsProcessingServiceService } from '../../services/claims-processing-service.service';
import { Claim } from '../../models/claim.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ClaimsService } from '../../services/claims-service.service';
import { IDocumentUpload } from '../../models/document-upload.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-document-upload',
    templateUrl: './document-upload.component.html',
    styleUrls: ['./document-upload.component.scss']
})
export class DocumentUploadComponent implements OnInit, OnDestroy {
    claimSubscription: Subscription;

    isDocumentUploadModalVisible: boolean = false;

    claim: Claim;

    data = [
        'Drivers License',
        'Claim Form',
        'Police Report',
        'Subrogation Form'
    ];

    documentUploads: string[];

    currentClaim: Claim;

    downloadLink: string;

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
        this.router.data.subscribe(data => (this.claim = data.claim));
        this.documentUploads = this.claim.documentUploads.map(
            x => x.documentType
        );
        console.log(this.documentUploads);
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
