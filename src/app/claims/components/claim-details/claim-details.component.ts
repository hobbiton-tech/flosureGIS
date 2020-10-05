import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Claim } from '../../models/claim.model';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { ClaimsService } from '../../services/claims-service.service';
import { Peril } from '../../models/peril.model';
import { PerilService } from '../../services/peril-service.service';
import { Location } from '@angular/common';

import * as _ from 'lodash';
import { ClaimsProcessingServiceService } from '../../services/claims-processing-service.service';

@Component({
    selector: 'app-claim-details',
    templateUrl: './claim-details.component.html',
    styleUrls: ['./claim-details.component.scss']
})
export class ClaimDetailsComponent implements OnInit {
    isClaimDetailLoading: boolean = false;

    claimDetailsForm: FormGroup;
    perilsList: Peril[];

    claimsList: Claim[];

    // hide peril form drawer
    addPerilFormDrawerVisible = false;

    isEditmode = false;

    // claim id
    claimId: string;
    claimData: Claim = new Claim();

    // selected file upload
    selectedFile: any = null;

    // file upload url
    url: string;

    constructor(
        private readonly route: Router,
        private router: ActivatedRoute,
        private formBuilder: FormBuilder,
        private claimsService: ClaimsService,
        private perilService: PerilService,
        private storage: AngularFireStorage,
        private claimProcessingService: ClaimsProcessingServiceService,
        private location: Location
    ) {}

    ngOnInit(): void {
        this.isClaimDetailLoading = true;
        // setTimeout(() => {
        //     this.isClaimDetailLoading = false;
        // }, 3000);

        // get claimId from parameters
        this.router.params.subscribe(param => {
            this.claimId = param.id;
        });

        this.router.data.subscribe(data => {
            this.claimData = data.claim;
            console.log(this.claimData);
            this.isClaimDetailLoading = false;
        });

        this.claimDetailsForm = this.formBuilder.group({
            serviceProvider: [``, Validators.required],
            serviceProviderType: [``, Validators.required],
            claimDescription: [``, Validators.required],
            risk: [``, Validators.required],
            activity: [``, Validators.required],
            lossDate: [``, Validators.required],
            notificationDate: [``, Validators.required],
            status: 'resolved',
            document: [``, Validators.required]
        });

        // this.claimsService.getClaims().subscribe(claims => {
        //     this.claimsList = claims.filter(x => x.id === this.claimId);

        //     this.claimData = claims.filter(x => x.id === this.claimId)[0];
        //     this.claimProcessingService.changeClaim(this.claimData);

        //     console.log(this.claimData);
        // });

        // populate perils list
        // this.perilService.getPerils().subscribe(perils => {
        //     this.perilsList = perils.filter(
        //         x => x.claimId === this.claimData.id
        //     );
        // });
    }

    // cliam details form submission
    onSubmit() {
        const name = this.selectedFile.name;
        const fileRef = this.storage.ref(name);
        this.storage
            .upload(name, this.selectedFile)
            .snapshotChanges()
            .pipe(
                finalize(() => {
                    fileRef.getDownloadURL().subscribe(url => {
                        this.url = url;

                        const claim = this.claimDetailsForm.value as Claim;
                        // claim.document = { url: url, name: name };
                        // this.claimsService.updateClaimDoc(
                        //     this.claimData.id,
                        //     claim
                        // );
                    });
                })
            )
            .subscribe();
    }

    // show document preview
    showPreview(event: any) {
        this.selectedFile = event.target.files[0];
    }

    // open add peril form drawer
    openAddPerilFormDrawer() {
        this.addPerilFormDrawerVisible = true;
    }

    navigateBack(): void {
        // this.route.navigateByUrl('/flosure/claims/claim-transactions');
        this.location.back();
    }
}
