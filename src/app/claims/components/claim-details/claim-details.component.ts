import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Claim } from '../../models/claim.model';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { ClaimsService } from '../../services/claims.service';
import { Peril } from '../../models/peril.model';
import { PerilService } from '../../services/perils.service';
import { IDocument } from '../../models/claim.model';

import * as _ from 'lodash';

@Component({
    selector: 'app-claim-details',
    templateUrl: './claim-details.component.html',
    styleUrls: ['./claim-details.component.scss']
})
export class ClaimDetailsComponent implements OnInit {
    claimDetailsForm: FormGroup;
    perilsList: Peril[];

    claimsList: Claim[];

    //hide peril form drawer
    addPerilFormDrawerVisible = false;

    isEditmode = false;

    //claim id
    claimId: string;
    claimData: Claim = new Claim();

    //selected file upload
    selectedFile: any = null;

    //file upload url
    url: string;

    constructor(
        private readonly route: Router,
        private router: ActivatedRoute,
        private formBuilder: FormBuilder,
        private claimsService: ClaimsService,
        private perilService: PerilService,
        private storage: AngularFireStorage
    ) {}

    ngOnInit(): void {
        //get claimId from parameters
        this.router.params.subscribe(param => {
            this.claimId = param.id;
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

        this.claimsService.getClaims().subscribe(claims => {
            this.claimsList = claims.filter(x => x.claimId === this.claimId);

            this.claimData = claims.filter(x => x.claimId === this.claimId)[0];

            this.claimDetailsForm
                .get('serviceProvider')
                .setValue(this.claimData.serviceProvider);
            this.claimDetailsForm
                .get('serviceProviderType')
                .setValue(this.claimData.serviceType);
            this.claimDetailsForm
                .get('claimDescription')
                .setValue(this.claimData.claimDescription);
            this.claimDetailsForm.get('risk').setValue(this.claimData.risk);
            this.claimDetailsForm
                .get('activity')
                .setValue(this.claimData.activity);
            //this.claimDetailsForm.get('lossDate').setValue(this.claimData.lossDate);
            //this.claimDetailsForm.get('notificationDate').setValue(this.claimData.notificationDate);
        });

        //populate perils list
        this.perilService.getPerils().subscribe(perils => {
            this.perilsList = perils.filter(
                x => x.claimId === this.claimData.claimId
            );
        });
    }

    //cliam details form submission
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
                        claim.document = { url: url, name: name };
                        this.claimsService.updateClaimDoc(
                            this.claimData.claimId,
                            claim
                        );
                    });
                })
            )
            .subscribe();
    }

    //show document preview
    showPreview(event: any) {
        this.selectedFile = event.target.files[0];
    }

    //open add peril form drawer
    openAddPerilFormDrawer() {
        this.addPerilFormDrawerVisible = true;
    }

    intimateClaim(): void {
        this.route.navigateByUrl('/flosure/claims/claim-transactions');
    }
}
