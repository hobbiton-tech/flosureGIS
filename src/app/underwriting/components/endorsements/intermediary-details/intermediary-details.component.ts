import { Component, OnInit } from '@angular/core';
import { IAgent, IBroker, ISalesRepresentative } from 'src/app/settings/components/agents/models/agents.model';
import { ActivatedRoute } from '@angular/router';
import { AgentsService } from 'src/app/settings/components/agents/services/agents.service';

@Component({
    selector: 'app-intermediary-details',
    templateUrl: './intermediary-details.component.html',
    styleUrls: ['./intermediary-details.component.scss'],
})
export class IntermediaryDetailsComponent implements OnInit {
    isEditmode = false;

    client: IAgent & IBroker & ISalesRepresentative;

    id: string;

    constructor(private router: ActivatedRoute,
      private agentService: AgentsService) {}

    ngOnInit(): void {
        this.router.params.subscribe((param) => {
            this.id = param.id;
        });

        this.agentService.getAllIntermediaries().subscribe((intermedieries)=>{
          console.log(intermedieries);
          this.client = [...intermedieries[2], ...intermedieries[1],...intermedieries[0]].filter(
            (x) => x.id === this.id
          )[0] as IAgent & IBroker & ISalesRepresentative;
        });

        console.log('Intermedieris', this.client);

        // this.agentService.getAllIntermediaries().subscribe((agents) =>{
        //   console.log(agents);
        //   this.client = agents.filter(
        //     (x) => x.id === this.id
        //   )[0] as IAgent & IBroker & ISalesRepresentative;
        //   console.log('AGENTS', this.client)
        // });
    }
}
