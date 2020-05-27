export interface IClause {
    id: string;
    heading: string;
    productId: string;
    clauseDetails: string;
}

export interface IWording {
    id: string;
    heading: string;
    productId: string;
    description: string;
}

export interface IExtension {
    id: string;
    heading: string;
    productId: string;
    description: string;
}

export interface IRiskClauses {
    id: string;
    productName: string;
    clauseId: string;
    heading: string;
    clauseDetails;
}

export interface IRiskWording {
    id: string;
    productName: string;
    wordingId: string;
    heading: string;
    description: string;
}

export interface IRiskExtension {
    id: string;
    productName: string;
    extensionId: string;
    heading: string;
    description: string;
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
