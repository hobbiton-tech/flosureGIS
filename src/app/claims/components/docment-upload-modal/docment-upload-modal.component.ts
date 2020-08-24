import { Component, OnInit, Input, Output, OnDestroy } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { UploadChangeParam } from 'ng-zorro-antd';
import { NzMessageService } from 'ng-zorro-antd';
import { Subscription } from 'rxjs';
import { Claim } from '../../models/claim.model';
import { ClaimsProcessingServiceService } from '../../services/claims-processing-service.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { IDocumentUpload } from '../../models/document-upload.model';
import { ClaimsService } from '../../services/claims-service.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-docment-upload-modal',
    templateUrl: './docment-upload-modal.component.html',
    styleUrls: ['./docment-upload-modal.component.scss']
})
export class DocmentUploadModalComponent implements OnInit, OnDestroy {
    isUploadingDocuments: boolean = true;

    claimSubscription: Subscription;
    documentTypeSubscription: Subscription;
    isUploading = false;

    @Input()
    isViewDocumentUploadModalVisible: boolean;

    @Output()
    closeViewDocumentUploadModal: EventEmitter<any> = new EventEmitter();

    documentType = '';
    documentTitle: string = this.documentType + ' Upload';

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
                console.log('>>>', claim);
            }
        );

        this.documentTypeSubscription = this.claimProcessingService.documentTypeChanged$.subscribe(
            documentType => {
                this.documentType = documentType;
                this.documentTitle = this.documentType + ' Upload';
            }
        );
    }

    ngOnInit(): void {
        this.router.data.subscribe(data => (this.currentClaim = data.claim));
    }

    closeDocumentUploadModal() {
        this.closeViewDocumentUploadModal.emit(true);
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
                        this.downloadURL.subscribe(url => {
                            if (url) {
                                this.returnStorgeLink = url;
                            }

                            const docUpload: IDocumentUpload = {
                                documentType: this.documentType,
                                storageLink: this.returnStorgeLink
                            };
                            this.currentClaim.documentUploads.push(docUpload);

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
                                    this.isViewDocumentUploadModalVisible = false;
                                    this.msg.success('Document Uploaded!');
                                });
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
        this.documentTypeSubscription.unsubscribe();
    }
}
