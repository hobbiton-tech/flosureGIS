import * as faker from 'faker';

export interface IClause {
    id: string;
    clauseHeading: string;
    productId: string;
    clauseDetails: string;
}

// const createClause = () => {
//     const clause: IClause = {
//         clauseId: faker.random.number(12),
//         clauseHeading: faker.random.words(5),
//         clauseType: faker.random.word(),
//         isEditable: faker.random.boolean(),
//         clauseWording: faker.random.words(10),
//     }

//     return clause;
// }

// export const generateClauses = () => {
//     let clauses: IClause[] = [];
//     for (let i = 0; i <= 7; i++) {
//         clauses.push(createClause());
//     }
//     return clauses;
// }
