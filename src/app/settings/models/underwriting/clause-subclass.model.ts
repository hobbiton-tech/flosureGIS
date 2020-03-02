import * as faker from 'faker';

export interface IClauseSubclass {
    clauseId: number;
    clauseHeading: string;
    clauseType: string;
    isEditable: boolean;
    isMandatory: boolean;
}


const createClauseSubClassData = () => {
    const clause: IClauseSubclass = {
        clauseId: faker.random.number(100),
        clauseHeading: faker.random.words(7),
        clauseType: faker.random.words(3),
        isEditable: faker.random.arrayElement([true, false]),
        isMandatory: faker.random.arrayElement([true, false])
    };

    return clause;
}

export const generateClauseSubclassData = () => {
    let clauseList: IClauseSubclass[] = [];
    for (let i = 0; i <= 12; i++) {
        clauseList.push(createClauseSubClassData());
    }
    return clauseList;
}