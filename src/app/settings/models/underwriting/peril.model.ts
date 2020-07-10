import * as faker from 'faker';

export interface IPeril {
    perilId: number;
    perilDescription: string;
    perilType: string;
}

const createPeril = () => {
    let peril: IPeril = {
        perilId: faker.random.number(100),
        perilDescription: faker.random.words(13),
        perilType: faker.random.word(),
    };

    return peril;
};

export const generatePerils = () => {
    let perilList: IPeril[] = [];
    for (let i = 0; i <= 23; i++) {
        perilList.push(createPeril());
    }
    return perilList;
};
