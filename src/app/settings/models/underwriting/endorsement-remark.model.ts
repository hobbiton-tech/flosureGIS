import * as faker from 'faker';

export interface IEndorsementRemark {
    remarkId: number;
    remarkDescription: string;
}

const createEndorsementRemark = () => {
    let remark: IEndorsementRemark = {
        remarkId: faker.random.number(100),
        remarkDescription: faker.random.words(43)
    }

    return remark;
}

export const generateEndorsementRemarks = () => {
    let remarks: IEndorsementRemark[] = [];
    for (let i = 0; i <= 23; i++) {
        remarks.push(createEndorsementRemark())
    }

    return remarks;
}