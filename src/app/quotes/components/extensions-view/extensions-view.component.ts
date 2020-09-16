import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadModel } from '../../models/quote.model';
import { IExtensions } from '../../models/extensions.model';
import { PremiumComputationService } from '../../services/premium-computation.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-extensions-view',
    templateUrl: './extensions-view.component.html',
    styleUrls: ['./extensions-view.component.scss']
})
export class ExtensionsViewComponent implements OnInit, OnDestroy {
    extensionsListChanges: Subscription;

    constructor(private premiumComputationService: PremiumComputationService) {
        this.extensionsListChanges = premiumComputationService.extensionsTotalChanged$.subscribe(
            extensions => {
                console.log(
                    'extensions changed, listening from extensions view comp'
                );
                this.extensions = premiumComputationService.getExtensions();
            }
        );
    }

    //  added extensions
    extensions: IExtensions[] = [];

    ngOnInit(): void {
        this.extensions = this.premiumComputationService.getExtensions();
    }

    removeLoad(i: IExtensions, e: MouseEvent): void {
        e.preventDefault();
        this.premiumComputationService.removeExtension(i);
    }

    ngOnDestroy() {
        this.extensionsListChanges.unsubscribe();
    }
}
