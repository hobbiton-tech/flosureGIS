import {
    Component,
    OnInit,
    AfterViewInit,
    ChangeDetectorRef,
    Output,
    EventEmitter
} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
    IIndividualClient,
    ICorporateClient
} from '../../models/clients.model';
import { ClientsService } from '../../services/clients.service';
import { NzMessageService } from 'ng-zorro-antd';
import { BehaviorSubject } from 'rxjs';
import { IClient, IClientDTO } from '../../models/client.model';

@Component({
    selector: 'app-create-client',
    templateUrl: './create-client.component.html',
    styleUrls: ['./create-client.component.scss']
})
export class CreateClientComponent implements OnInit, AfterViewInit {
    @Output()
    closeAddAgentsFormDrawerVisible: EventEmitter<any> = new EventEmitter();

    individualClientForm: FormGroup;
    corporateClientForm: FormGroup;

    userUpdate = new BehaviorSubject<boolean>(false);

    selectedClientType: string;

    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private clientsService: ClientsService,
        private msg: NzMessageService,
        private cdr: ChangeDetectorRef
    ) {
        this.individualClientForm = this.formBuilder.group({
            title: ['', Validators.required],
            idType: ['', Validators.required],
            idNumber: ['', Validators.required],
            clientType: ['Individual'],
            maritalStatus: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            middleName: ['', Validators.required],
            email: ['', Validators.required],
            dateOfBirth: ['', Validators.required],
            phoneNumber: ['', Validators.required],
            address: ['', Validators.required],
            gender: ['', Validators.required],
            sector: ['', Validators.required],
            nationality: ['', Validators.required],
            occupation: ['', Validators.required],
            accountName: ['', Validators.required],
            accountNumber: ['', Validators.required],
            accountType: ['', Validators.required],
            bank: ['', Validators.required],
            branch: ['', Validators.required]
        });

        this.corporateClientForm = this.formBuilder.group({
            companyName: ['', Validators.required],
            tpinNumber: ['', Validators.required],
            registrationNumber: ['', Validators.required],
            companyEmail: ['', Validators.required],
            phoneNumber: ['', Validators.required],
            companyAddress: ['', Validators.required],
            sector: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            contactEmail: ['', Validators.required],
            contactPhone: ['', Validators.required],
            contactAddress: ['', Validators.required],
            clientType: ['Corporate'],
            accountName: ['', Validators.required],
            accountNumber: ['', Validators.required],
            accountType: ['', Validators.required],
            bank: ['', Validators.required],
            branch: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.selectedClientType = 'Corporate';
        this.cdr.detectChanges();
    }

    ngAfterViewInit(): void {
        this.selectedClientType = 'Corporate';
    }

    changeClientType(event): void {
        console.log(event);
    }

    async addIndividualClient(client: IClientDTO): Promise<void> {
        await this.clientsService.createIndividualClient(client).subscribe(
            async res => {
                this.msg.success('Client Created successfully');
                this.router.navigateByUrl('/flosure/clients/clients-list');
            },
            async err => {
                this.msg.error('Client Creation failed');
            },
            async () => {
                this.closeDrawer();
            }
        );
    }

    async addCorporateClient(client: IClientDTO): Promise<void> {
        await this.clientsService.createCorporateClient(client).subscribe(
            async res => {
                this.msg.success('Client Created successfully');
                this.router.navigateByUrl('/flosure/clients/clients-list');
            },
            async err => {
                this.msg.error('Client Creation failed');
            },

            async () => {
                this.closeDrawer();
            }
        );
    }

    submitIndividualClient(): void {
        console.log('Submittingbbb');
        for (let i in this.individualClientForm.controls) {
            /// validation;
            this.individualClientForm.controls[i].markAsDirty();
            this.individualClientForm.controls[i].updateValueAndValidity();
        }

        if (
            this.individualClientForm.valid ||
            !this.individualClientForm.valid
        ) {
            this.addIndividualClient(this.individualClientForm.value).then(
                res => {
                    console.log('Added Individaul');
                    this.individualClientForm.reset();
                }
            );
        }
    }

    submitCorporateClient(): void {
        this.addCorporateClient(this.corporateClientForm.value).then(res => {
            console.log('Added Corporate.');
            this.corporateClientForm.reset();
        });

        // for (let i in this.corporateClientForm.controls) {
        //     /// validation;
        //     this.corporateClientForm.controls[i].markAsDirty();
        //     this.corporateClientForm.updateValueAndValidity();
        // }

        // if (this.corporateClientForm.valid) {
        //     this.addCorporateClient(this.corporateClientForm.value).then(
        //         res => {
        //             console.log('Added Corporate.');
        //             this.corporateClientForm.reset();
        //         }
        //     );
        // }
    }

    closeDrawer(): void {
        this.closeAddAgentsFormDrawerVisible.emit(true);
    }
}
