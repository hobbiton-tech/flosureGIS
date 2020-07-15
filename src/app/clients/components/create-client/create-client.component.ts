import {
    Component,
    OnInit,
    AfterViewInit,
    ChangeDetectorRef,
    Output,
    EventEmitter
} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, ValidationErrors } from '@angular/forms';
import {
    IIndividualClient,
    ICorporateClient
} from '../../models/clients.model';
import { ClientsService } from '../../services/clients.service';
import { NzMessageService } from 'ng-zorro-antd';
import { BehaviorSubject, Observable, Observer } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-create-client',
    templateUrl: './create-client.component.html',
    styleUrls: ['./create-client.component.scss']
})
export class CreateClientComponent implements OnInit, AfterViewInit {
    //feedback loading
    creatingClient: boolean = false;
    defaultDate = new Date();
    individualClients: IIndividualClient[] = [];
    corporateClients: ICorporateClient[] = [];

    @Output()
    closeAddAgentsFormDrawerVisible: EventEmitter<any> = new EventEmitter();

    individualClientForm: FormGroup;
    corporateClientForm: FormGroup;

    userUpdate = new BehaviorSubject<boolean>(false);

    selectedClientType: string;
    clientID: any;

    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private clientsService: ClientsService,
        private msg: NzMessageService,
        private cdr: ChangeDetectorRef, private http: HttpClient
    ) {
        this.individualClientForm = this.formBuilder.group({
            title: [''],
            idType: ['', Validators.required],
            idNumber: ['', Validators.required, [this.clientIDAsyncValidator]],
            clientType: ['Individual'],
            maritalStatus: [''],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            middleName: [''],
            email: [''],
            dateOfBirth: [this.defaultDate],
            phone: [''],
            address: [''],
            gender: [''],
            sector: [''],
            nationality: [''],
            occupation: [''],
            accountName: [''],
            accountNumber: [''],
            accountType: [''],
            bank: [''],
            branch: ['']
        });

        this.corporateClientForm = this.formBuilder.group({
            companyName: ['', Validators.required],
            taxPin: [''],
            registrationNumber: ['', Validators.required, [this.companyRegAsyncValidator]],
            email: [''],
            phone: [''],
            address: [''],
            sector: [''],
            contactFirstName: [''],
            contactLastName: [''],
            contactEmail: [''],
            contactPhone: [''],
            contactAddress: [''],
            clientType: ['Corporate'],
            accountName: [''],
            accountNumber: [''],
            accountType: [''],
            bank: [''],
            branch: ['']
        });
    }

    ngOnInit(): void {
        this.selectedClientType = 'Corporate';
        this.clientsService.getIndividualClients().subscribe((res) => {
            this.individualClients = res;
        })
        this.clientsService.getCorporateClients().subscribe((res) => {
            this.corporateClients = res;
        })
        this.cdr.detectChanges();
    }


    clientIDAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        this.clientsService.getIndividualClients().subscribe((res) => {
            this.individualClients = res;
            if(this.individualClients.length > 0) {
                console.log("ARRAY>>", this.individualClients);
                
              for (const ind of this.individualClients) {
                  console.log("ERROR>>>",control.value, ind.idNumber);
                if (control.value === ind.idNumber) {
                    // you have to return `{error: true}` to mark it as an error event
                    observer.next({ error: true, duplicated: true });
                    break;
                  } else {
                    observer.next(null);
                  }
              }
            } else {
              observer.next(null);
            }
            observer.complete();
        })
         
      }, 1000);
    });

    companyRegAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        this.clientsService.getCorporateClients().subscribe((res) => {
            this.corporateClients = res;
            if(this.corporateClients.length > 0) {
                for (const cor of this.corporateClients) {
                    console.log("ERROR>>>", cor.registrationNumber);
                    
                  if (control.value === cor.registrationNumber) {
                      // you have to return `{error: true}` to mark it as an error event
                      observer.next({ error: true, duplicated: true });
                      break;
                    } else {
                      observer.next(null);
                    }
                }
              } else {
                  observer.next(null);
              }
              observer.complete();
        })
       
      }, 1000);
    });



    ngAfterViewInit(): void {
        this.selectedClientType = 'Corporate';
        this.clientsService.getIndividualClients().subscribe((res) => {
            this.individualClients = res;
        })
        this.clientsService.getCorporateClients().subscribe((res) => {
            this.corporateClients = res;
        })
        this.cdr.detectChanges();
    }

    changeClientType(event): void {
        console.log(event);
    }

    async addIndividualClient(client: IIndividualClient): Promise<void> {
        this.creatingClient = true;
        this.http
        .get<any>(
            `https://number-generation.flosure-api.com/golden-lotus-client-number/IND`
        )
        .subscribe(async (res) => {
            console.log('Client ID>>>>>>', res.data.client_number);
            this.clientID = res.data.client_number;
            console.log('Client ID>>>>>>', this.clientID);
        client.clientType = 'Individual';
        client.dateCreated = new Date();
        client.dateUpdated = new Date();
        client.status = 'Inactive';
        client.clientID = this.clientID;

        console.log(client);
            await this.clientsService.addIndividualClient(client).subscribe(
                async res => {
                    this.creatingClient = false;
                    this.msg.success('Client Created successfully');
                    this.router.navigateByUrl('/flosure/clients/clients-list');
                },
                async err => {
                    this.creatingClient = false;
                    this.msg.error('Client Creation failed');
                },
                async () => {
                    this.closeDrawer();
                }
            );
        });
        
    }

    async addCorporateClient(client: ICorporateClient): Promise<void> {
        this.creatingClient = true;
        this.http
            .get<any>(
                `https://number-generation.flosure-api.com/golden-lotus-client-number/COR`
            )
            .subscribe(async (res) => {
                console.log('Client ID>>>>>>', res.data.client_number);
                this.clientID = res.data.client_number;
                client.clientType = 'Corporate';
        client.dateCreated = new Date();
        client.dateUpdated = new Date();
        client.status = 'Inactive';
        client.clientID = this.clientID;
        console.log(client);
        await this.clientsService.addCorporateClient(client).subscribe(
            async res => {
                this.creatingClient = true;
                this.msg.success('Client Created successfully');
                this.router.navigateByUrl('/flosure/clients/clients-list');
            },
            async err => {
                this.msg.error('Client Creation failed');
                this.creatingClient = false;
            },

            async () => {
                this.creatingClient = false;
                this.closeDrawer();
            }
            
        );
            });
        
        
        
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
