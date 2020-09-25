export interface IPersonalAccidentProductModel {
    id?: string;
    personsInsured: string[];
    aggregateGroupLimit: string;
    limitPerPerson: string;
    itemNumber: string;
    benefits?: IBenefit[];
}

export interface IBenefit {
    id?: string;
    name?: string;
    description?: string;
}
