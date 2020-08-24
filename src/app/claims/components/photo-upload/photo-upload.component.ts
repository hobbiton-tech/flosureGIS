import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { ClaimsProcessingServiceService } from '../../services/claims-processing-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Claim } from '../../models/claim.model';
import { IPhotoUpload } from '../../models/photo-upload.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-photo-upload',
    templateUrl: './photo-upload.component.html',
    styleUrls: ['./photo-upload.component.scss']
})
export class PhotoUploadComponent implements OnInit {
    isPhotoUploadModalVisible: boolean = false;

    claimSubscription: Subscription;

    claim: Claim;

    data = ['Front', 'Rear', 'Left', 'Right'];

    photoUploads: string[];

    constructor(
        private readonly route: Router,
        private router: ActivatedRoute,
        public msg: NzMessageService,
        private claimProcessingService: ClaimsProcessingServiceService
    ) {
        this.claimSubscription = this.claimProcessingService.claimChanged$.subscribe(
            claim => {
                this.ngOnInit();
            }
        );
    }

    ngOnInit(): void {
        this.isPhotoUploadModalVisible = false;
        this.router.data.subscribe(data => (this.claim = data.claim));
        this.photoUploads = this.claim.photoUploads.map(
            x => x.photoDescription
        );
        console.log(this.photoUploads);
    }

    openPhotoUploadModal(side) {
        this.claimProcessingService.changePhotoSide(side);
        this.isPhotoUploadModalVisible = true;
    }

    viewPhotoUpload(item) {
        const photoUpload: IPhotoUpload = this.claim.photoUploads.filter(
            x => x.photoDescription == item
        )[0];
        const link = photoUpload.storageLink;
        window.open(link);
    }
}
