import {
    Component,
    OnInit,
    ChangeDetectorRef,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AgentsService } from '../services/agents.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'app-add-agent',
    templateUrl: './add-agent.component.html',
    styleUrls: ['./add-agent.component.scss']
})
export class AddAgentComponent implements OnInit {
    agentForm: FormGroup;

    @Input()
    isAddAgentsFormDrawerVisible: boolean;

    @Output()
    closeAddAgentsFormDrawerVisible: EventEmitter<any> = new EventEmitter();

    constructor(
        private formBuilder: FormBuilder,
        private cdr: ChangeDetectorRef,
        private agentService: AgentsService,
        private message: NzMessageService
    ) {
        this.agentForm = this.formBuilder.group({
            title: ['', Validators.required],
            userType: ['Agent'],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', Validators.required],
            phone: ['', Validators.required],
            address: ['', Validators.required],
            branch: ['', Validators.required]
        });
    }

    ngOnInit(): void {}

    onSubmit() {
        this.agentService
            .addAgent(this.agentForm.value)
            .then(success => {
                this.message.success('Agent Successfully created');
            })
            .catch(err => {
                this.message.error('Agent Creation Failed');
            });
        this.agentForm.reset();
    }

    resetForm(e: MouseEvent): void {
        e.preventDefault();
        this.agentForm.reset();
    }

    closeDrawer(): void {
        this.closeAddAgentsFormDrawerVisible.emit();
    }
}
