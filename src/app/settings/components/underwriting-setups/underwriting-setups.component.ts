import { Component, OnInit } from '@angular/core';
import { generateClauses } from '../../models/underwriting/clause.model';
import { generateClauseSubclassData } from '../../models/underwriting/clause-subclass.model';
import { generateCoverTypePremiums } from '../../models/underwriting/cover-type-premium.model';
import { generateCoverTypes } from '../../models/underwriting/cover-type.model';
import { generatePerils } from '../../models/underwriting/peril.model';
import { generatePerilSubclasses } from '../../models/underwriting/peril-subclass.model';
import { generateProducts } from '../../models/underwriting/product.model';
import { generateProductClasses } from '../../models/underwriting/product-class.model';
import { generateProductGroups } from '../../models/underwriting/product-group.model';
import { generateProductSubclasses } from '../../models/underwriting/product-subclass.model';
import { generateTaxRates } from '../../models/underwriting/tax-rate.model';
import { generateRevenueItems } from '../../models/underwriting/revenue-item.model';
import { generateEndorsementRemarks } from '../../models/underwriting/endorsement-remark.model';

@Component({
    selector: 'app-underwriting-setups',
    templateUrl: './underwriting-setups.component.html',
    styleUrls: ['./underwriting-setups.component.scss'],
})
export class UnderwritingSetupsComponent implements OnInit {
    clausesList = [];
    clauseSubClassList = [];

    coverTypePremiumsList = [];
    coverTypesList = [];

    perilsList = [];
    perilsSubclassList = [];

    productsList = [];
    productClassList = [];
    productGroupList = [];
    productSubclassGroupList = [];

    revenuesList = [];

    taxRatesList = [];

    endorsementRemarksList = [];

    constructor() {}

    ngOnInit(): void {}
}
