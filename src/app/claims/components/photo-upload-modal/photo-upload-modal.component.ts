import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    OnDestroy
} from '@angular/core';
import { NzMessageService, UploadChangeParam } from 'ng-zorro-antd';
import { Subscription } from 'rxjs';
import { Claim } from '../../models/claim.model';
import { ClaimsProcessingServiceService } from '../../services/claims-processing-service.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { ClaimsService } from '../../services/claims-service.service';
import { finalize } from 'rxjs/operators';
import { IDocumentUpload } from '../../models/document-upload.model';
import { IPhotoUpload } from '../../models/photo-upload.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-photo-upload-modal',
    templateUrl: './photo-upload-modal.component.html',
    styleUrls: ['./photo-upload-modal.component.scss']
})
export class PhotoUploadModalComponent implements OnInit, OnDestroy {
    claimSubscription: Subscription;
    photoSideSubscription: Subscription;

    isUploading = false;

    @Input()
    isViewPhotoUploadModalVisible: boolean;

    @Output()
    closeViewPhotoUploadModal: EventEmitter<any> = new EventEmitter();

    photoSide: string = '';
    photoTitle: string = this.photoSide + 'Side';

    currentClaim: Claim;

    downloadURL;
    returnStorgeLink: string;
    fileURL;

    constructor(
        private msg: NzMessageService,
        private claimProcessingService: ClaimsProcessingServiceService,
        private storage: AngularFireStorage,
        private claimsService: ClaimsService,
        private readonly route: Router,
        private router: ActivatedRoute
    ) {
        this.claimSubscription = this.claimProcessingService.claimChanged$.subscribe(
            claim => {
                this.currentClaim = claim;
            }
        );

        this.photoSideSubscription = this.claimProcessingService.photoSideChanged$.subscribe(
            photoSide => {
                this.photoSide = photoSide;
                this.photoTitle = this.photoSide + ' Side';
            }
        );
    }

    ngOnInit(): void {
        this.router.data.subscribe(data => (this.currentClaim = data.claim));
    }

    closePhotoUploadModal() {
        this.closeViewPhotoUploadModal.emit(true);
    }

    // handleChange({ file, fileList }: UploadChangeParam): void {
    //     const status = file.status;
    //     if (status !== 'uploading') {
    //         console.log(file, fileList);
    //     }
    //     if (status === 'done') {
    //         this.msg.success(`${file.name} file uploaded successfully.`);
    //     } else if (status === 'error') {
    //         this.msg.error(`${file.name} file upload failed.`);
    //     }
    // }

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
                            }

                            const photoUpload: IPhotoUpload = {
                                photoDescription: this.photoSide,
                                storageLink: this.returnStorgeLink
                            };

                            console.log('here', this.currentClaim);
                            this.currentClaim.photoUploads.push(photoUpload);

                            this.claimsService
                                .updateClaim(
                                    this.currentClaim.id,
                                    this.currentClaim
                                )
                                .subscribe(res => {
                                    console.log(res);
                                    this.isUploading = false;

                                    this.claimProcessingService.changeClaim(
                                        this.currentClaim
                                    );

                                    this.isViewPhotoUploadModalVisible = false;
                                    this.msg.success('Photo Uploaded!');
                                });

                            console.log(this.currentClaim);
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

    ngOnDestroy() {
        this.claimSubscription.unsubscribe();
        this.photoSideSubscription.unsubscribe();
    }
}
